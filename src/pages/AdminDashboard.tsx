
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/admin-layout';
import PageAnalytics from '@/components/admin/page-analytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { FolderOpen, BookOpen, User, Mail, Eye, MessageSquare } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    tutorials: 0,
    aboutSections: 0,
    contactSubmissions: 0,
    unreadSubmissions: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projects, tutorials, aboutSections, submissions] = await Promise.all([
          supabase.from('daveops_portfolio_projects').select('id', { count: 'exact' }),
          supabase.from('daveops_tutorials').select('id', { count: 'exact' }),
          supabase.from('daveops_about_content').select('id', { count: 'exact' }),
          supabase.from('daveops_contact_submissions').select('id, read', { count: 'exact' }),
        ]);

        const unreadCount = submissions.data?.filter(sub => !sub.read).length || 0;

        setStats({
          projects: projects.count || 0,
          tutorials: tutorials.count || 0,
          aboutSections: aboutSections.count || 0,
          contactSubmissions: submissions.count || 0,
          unreadSubmissions: unreadCount,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Portfolio Projects',
      value: stats.projects,
      description: 'Total published projects',
      icon: FolderOpen,
      color: 'text-blue-600',
    },
    {
      title: 'Tutorials',
      value: stats.tutorials,
      description: 'Available tutorials',
      icon: BookOpen,
      color: 'text-green-600',
    },
    {
      title: 'About Sections',
      value: stats.aboutSections,
      description: 'Content sections',
      icon: User,
      color: 'text-purple-600',
    },
    {
      title: 'Contact Messages',
      value: stats.contactSubmissions,
      description: `${stats.unreadSubmissions} unread`,
      icon: Mail,
      color: 'text-orange-600',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your Dave-Ops.Net admin panel
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Page Analytics Section */}
        <PageAnalytics />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common management tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2">
                <a 
                  href="/admin/portfolio" 
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <span>Manage Portfolio Projects</span>
                  <FolderOpen className="h-4 w-4" />
                </a>
                <a 
                  href="/admin/tutorials" 
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <span>Edit Tutorials</span>
                  <BookOpen className="h-4 w-4" />
                </a>
                <a 
                  href="/admin/contact" 
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <span>Review Contact Messages</span>
                  <MessageSquare className="h-4 w-4" />
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates and changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">Page analytics tracking enabled</p>
                    <p className="text-xs text-muted-foreground">Now tracking unique and total page views</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">Admin panel initialized</p>
                    <p className="text-xs text-muted-foreground">System ready for content management</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
