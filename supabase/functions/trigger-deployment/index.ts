
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

console.log('Function initialized')

serve(async (req) => {
  console.log('Request received:', req.method, req.url)
  
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request')
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Processing POST request')
    const requestBody = await req.json()
    console.log('Request body:', requestBody)
    
    const { deployment_id } = requestBody
    
    if (!deployment_id) {
      throw new Error('deployment_id is required')
    }
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get GitHub token from Supabase secrets
    const githubToken = Deno.env.get('GITHUB_TOKEN')
    if (!githubToken) {
      throw new Error('GitHub token not configured')
    }

    console.log('Updating deployment status to approved')
    // Update deployment status to approved
    const { error: updateError } = await supabaseClient
      .from('daveops_portfolio_deployments')
      .update({ 
        status: 'approved',
        approved_at: new Date().toISOString()
      })
      .eq('id', deployment_id)

    if (updateError) {
      console.error('Error updating deployment status:', updateError)
      throw updateError
    }

    console.log('Triggering GitHub Actions workflow on source repo (dave-ops)')
    // Trigger GitHub Actions workflow on the SOURCE repo (dave-ops)
    const response = await fetch(`https://api.github.com/repos/dmaru09sub/dave-ops/dispatches`, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: 'deploy-portfolio',
        client_payload: {
          deployment_id: deployment_id
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('GitHub API error:', response.status, errorText)
      
      // Parse the error response for better error messages
      let errorMessage = `GitHub API error: ${response.status}`
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = `GitHub API error: ${response.status} ${errorData.message || errorText}`
      } catch {
        errorMessage = `GitHub API error: ${response.status} ${errorText}`
      }
      
      // Update deployment with detailed error
      await supabaseClient
        .from('daveops_portfolio_deployments')
        .update({ 
          status: 'failed',
          notes: `Function call failed: ${response.status} ${errorText}`
        })
        .eq('id', deployment_id)
      
      throw new Error(errorMessage)
    }

    console.log('GitHub workflow triggered successfully')

    // Update deployment status to deploying
    const { error: deployingError } = await supabaseClient
      .from('daveops_portfolio_deployments')
      .update({ 
        status: 'deploying',
        deployment_url: 'https://dmaru09sub.github.io/dave-ops-portfolio'
      })
      .eq('id', deployment_id)

    if (deployingError) {
      console.error('Error updating deployment to deploying:', deployingError)
    }

    console.log('Deployment process completed successfully')

    return new Response(
      JSON.stringify({ success: true, message: 'Deployment triggered successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Deployment error:', error)
    
    // Try to update the deployment record with the error
    try {
      const { deployment_id } = await req.json().catch(() => ({}))
      if (deployment_id) {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )
        
        await supabaseClient
          .from('daveops_portfolio_deployments')
          .update({ 
            status: 'failed',
            notes: `Function call failed: ${error.message}`
          })
          .eq('id', deployment_id)
      }
    } catch (updateError) {
      console.error('Failed to update deployment with error:', updateError)
    }
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
