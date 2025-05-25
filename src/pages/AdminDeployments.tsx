
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/admin-layout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DeploymentHeader from '@/components/admin/deployment-header';
import DeploymentTrigger from '@/components/admin/deployment-trigger';
import DeploymentHistory from '@/components/admin/deployment-history';

interface Deployment {
  id: string;
  status: string;
  created_at: string;
  approved_at: string | null;
  deployed_at: string | null;
  deployment_url: string | null;
  commit_hash: string | null;
  notes: string | null;
  error_message: string | null;
}

const AdminDeployments = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDeployments();
  }, []);

  const fetchDeployments = async () => {
    try {
      const { data, error } = await supabase
        .from('daveops_portfolio_deployments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeployments(data || []);
    } catch (error) {
      console.error('Error fetching deployments:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch deployment history',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerDeployment = async () => {
    if (deploying) return;
    
    setDeploying(true);
    let newDeployment: any = null;
    
    try {
      console.log('Creating deployment record...');
      // Create deployment record in database
      const { data, error: dbError } = await supabase
        .from('daveops_portfolio_deployments')
        .insert({
          status: 'pending',
          notes: 'Manual deployment triggered from admin panel'
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }
      
      newDeployment = data;
      console.log('Created deployment record:', newDeployment);

      console.log('Calling trigger-deployment function with direct fetch...');
      
      // Get the session to include auth token
      const { data: { session } } = await supabase.auth.getSession();
      
      // Call the edge function directly with fetch
      const response = await fetch('https://nlzwrlgtjshcjfxfchyz.supabase.co/functions/v1/trigger-deployment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sendybGd0anNoY2pmeGZjaHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3OTQ0OTksImV4cCI6MjA2MzM3MDQ5OX0.-HJhOWKhgGzH_h8bKSUJ6-p9QJ8ZUecXB9qTqMyYmKE'
        },
        body: JSON.stringify({ deployment_id: newDeployment.id })
      });

      console.log('Fetch response status:', response.status);
      console.log('Fetch response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Function response error:', errorText);
        throw new Error(`Function call failed: ${response.status} ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Function response data:', responseData);

      toast({
        title: 'Deployment Started',
        description: 'Portfolio deployment has been triggered. Check GitHub Actions for progress.',
      });

      fetchDeployments();
    } catch (error: any) {
      console.error('Error triggering deployment:', error);
      
      // Update deployment status to failed if we have a deployment record
      if (newDeployment?.id) {
        try {
          await supabase
            .from('daveops_portfolio_deployments')
            .update({ 
              status: 'failed',
              error_message: error.message || 'Deployment failed to trigger'
            })
            .eq('id', newDeployment.id);
        } catch (updateError) {
          console.error('Error updating deployment status to failed:', updateError);
        }
      }
      
      toast({
        title: 'Deployment Failed',
        description: `Failed to trigger portfolio deployment: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
      
      fetchDeployments();
    } finally {
      setDeploying(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <DeploymentHeader />
        <DeploymentTrigger 
          onTriggerDeployment={triggerDeployment}
          deploying={deploying}
        />
        <DeploymentHistory deployments={deployments} />
      </div>
    </AdminLayout>
  );
};

export default AdminDeployments;
