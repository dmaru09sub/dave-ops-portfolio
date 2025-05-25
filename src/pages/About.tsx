
import React, { useState, useEffect } from 'react';
import MainLayout from "@/components/layouts/main-layout";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';

interface AboutSection {
  id: string;
  section_key: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  sort_order: number;
}

const About = () => {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const { data, error } = await supabase
          .from('daveops_about_content')
          .select('*')
          .eq('published', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setSections(data || []);
      } catch (error) {
        console.error('Error fetching about content:', error);
        // Fallback to default content if database fails
        setSections([
          {
            id: '1',
            section_key: 'intro',
            title: 'About Me',
            content: "Hello! I'm a passionate developer with over 5 years of experience building web and mobile applications. My journey in software development started when I was in college, and I've been hooked ever since.",
            image_url: null,
            sort_order: 1
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <SiteHeader />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SiteHeader />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">About Me</CardTitle>
            <CardDescription>Full-stack developer passionate about building exceptional user experiences</CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            {sections.length > 0 && sections[0].image_url && (
              <img 
                src={sections[0].image_url} 
                alt="Developer" 
                className="float-right ml-6 mb-4 w-48 h-48 rounded-full object-cover"
              />
            )}
            
            {sections.map((section) => (
              <div key={section.id} className="mb-6">
                {section.title && section.section_key !== 'intro' && (
                  <h3>{section.title}</h3>
                )}
                {section.content && (
                  <p>{section.content}</p>
                )}
              </div>
            ))}
            
            {sections.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Content is being loaded...</p>
              </div>
            )}
            
            <p className="mt-6">Interested in working together? Feel free to reach out through my contact form or connect with me on social media.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default About;
