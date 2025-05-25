
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

console.log('Update deployment status function initialized')

serve(async (req) => {
  console.log('Update status request received:', req.method)
  
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request for status update')
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Processing status update request')
    const requestBody = await req.json()
    console.log('Status update body:', requestBody)
    
    const { deployment_id, status, deployment_url, error_message, notes } = requestBody
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const updateData: any = { status }
    
    if (status === 'deployed') {
      updateData.deployed_at = new Date().toISOString()
      updateData.deployment_url = deployment_url
    }
    
    if (error_message) {
      updateData.error_message = error_message
    }
    
    if (notes) {
      updateData.notes = notes
    }

    console.log('Updating deployment with data:', updateData)

    const { error } = await supabaseClient
      .from('daveops_portfolio_deployments')
      .update(updateData)
      .eq('id', deployment_id)

    if (error) {
      console.error('Database update error:', error)
      throw error
    }

    console.log('Deployment status updated successfully')

    return new Response(
      JSON.stringify({ success: true, message: 'Deployment status updated' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Status update error:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
