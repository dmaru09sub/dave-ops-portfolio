
import React from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  LayoutDashboard, 
  FolderOpen, 
  BookOpen, 
  User, 
  Mail, 
  LogOut,
  Settings,
  ExternalLink,
  Rocket
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAdmin, loading, user } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/portfolio', icon: FolderOpen, label: 'Portfolio', publicLink: '/portfolio' },
    { to: '/admin/tutorials', icon: BookOpen, label: 'Tutorials', publicLink: '/tutorials' },
    { to: '/admin/about', icon: User, label: 'About', publicLink: '/about' },
    { to: '/admin/contact', icon: Mail, label: 'Contact', publicLink: '/contact' },
    { to: '/admin/deployments', icon: Rocket, label: 'Deployments' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="flex items-center space-x-2">
              <Settings className="h-6 w-6" />
              <span className="font-bold">Dave-Ops Admin</span>
            </Link>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                View Site
              </Link>
            </Button>
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 min-h-[calc(100vh-4rem)] border-r bg-background/50">
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                
                return (
                  <li key={item.to}>
                    <div className="flex items-center gap-1">
                      <Link
                        to={item.to}
                        className={`flex-1 flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                          isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                      {item.publicLink && (
                        <Button variant="ghost" size="sm" asChild className="p-1 h-8 w-8">
                          <Link to={item.publicLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
