
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, ExternalLink } from 'lucide-react';

interface DeploymentTriggerProps {
  onTriggerDeployment: () => void;
  deploying: boolean;
}

const DeploymentTrigger: React.FC<DeploymentTriggerProps> = ({ onTriggerDeployment, deploying }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5" />
          Deploy Professional Portfolio
        </CardTitle>
        <CardDescription>
          Trigger a deployment to your professional GitHub Pages site at{' '}
          <a 
            href="https://dmaru09sub.github.io/dave-ops-portfolio" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            dmaru09sub.github.io/dave-ops-portfolio
            <ExternalLink className="h-3 w-3" />
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium mb-2">What happens during deployment:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Removes all Lovable branding and development references</li>
              <li>• Updates package.json with professional metadata</li>
              <li>• Adds professional SEO meta tags</li>
              <li>• Generates clean, employer-friendly codebase</li>
              <li>• Deploys to your professional GitHub repository</li>
            </ul>
          </div>
          
          <Button 
            onClick={onTriggerDeployment} 
            disabled={deploying}
            className="flex items-center gap-2"
          >
            <Rocket className="h-4 w-4" />
            {deploying ? 'Deploying...' : 'Deploy Now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeploymentTrigger;
