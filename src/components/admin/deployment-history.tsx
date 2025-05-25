
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import DeploymentStatusBadge from './deployment-status-badge';

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

interface DeploymentHistoryProps {
  deployments: Deployment[];
}

const DeploymentHistory: React.FC<DeploymentHistoryProps> = ({ deployments }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployment History</CardTitle>
        <CardDescription>
          Recent deployments and their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {deployments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No deployments yet. Trigger your first deployment above.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Deployed</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deployments.map((deployment) => (
                <TableRow key={deployment.id}>
                  <TableCell>
                    <DeploymentStatusBadge status={deployment.status} />
                  </TableCell>
                  <TableCell>
                    {format(new Date(deployment.created_at), 'MMM d, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    {deployment.deployed_at ? 
                      format(new Date(deployment.deployed_at), 'MMM d, yyyy HH:mm') : 
                      '-'
                    }
                  </TableCell>
                  <TableCell>
                    {deployment.deployment_url ? (
                      <a 
                        href={deployment.deployment_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        View Site
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {deployment.error_message || deployment.notes || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default DeploymentHistory;
