
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import MainLayout from "@/components/layouts/main-layout";
import { Youtube, Clock, Calendar } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  content: string;
  difficulty_level: string;
  estimated_duration: number;
  tags: Json;
  image_url: string;
  published: boolean;
  coming_soon: boolean;
  sort_order: number;
  created_at: string;
}

const Tutorials = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const { data, error } = await supabase
          .from('daveops_tutorials')
          .select('*')
          .eq('published', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setTutorials(data || []);
      } catch (error) {
        console.error('Error fetching tutorials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorials();
  }, []);

  const getTags = (tags: Json): string[] => {
    if (Array.isArray(tags)) {
      return tags.filter((tag): tag is string => typeof tag === 'string');
    }
    return [];
  };

  if (loading) {
    return (
      <MainLayout>
        <SiteHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="text-center space-y-4">
                <div className="h-16 w-16 bg-gray-200 rounded mx-auto"></div>
                <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const comingSoonTutorials = tutorials.filter(t => t.coming_soon);
  const availableTutorials = tutorials.filter(t => !t.coming_soon);

  return (
    <MainLayout>
      <SiteHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Youtube className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold tracking-tight mb-4">YouTube Tutorials</h1>
            <p className="text-xl text-muted-foreground">
              DevOps and cloud engineering tutorials
            </p>
          </div>

          {availableTutorials.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Available Tutorials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableTutorials.map((tutorial) => (
                  <Card key={tutorial.id} className="relative overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                      <CardDescription>{tutorial.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{tutorial.estimated_duration} min</span>
                        </div>
                        {tutorial.difficulty_level && (
                          <Badge variant="secondary" className="text-xs">
                            {tutorial.difficulty_level}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {getTags(tutorial.tags).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {comingSoonTutorials.length > 0 && (
            <div className="mb-8">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Coming Soon
                  </CardTitle>
                  <CardDescription>
                    I'm currently working on creating comprehensive video tutorials covering various DevOps topics. 
                    Stay tuned for in-depth content on cloud infrastructure, automation, and best practices.
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {comingSoonTutorials.map((tutorial) => (
                  <Card key={tutorial.id} className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                      Coming Soon
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                      <CardDescription>{tutorial.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{tutorial.estimated_duration} min</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {getTags(tutorial.tags).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {tutorials.length === 0 && !loading && (
            <div className="text-center">
              <Card className="p-8">
                <h3 className="text-xl font-semibold mb-4">No tutorials available yet</h3>
                <p className="text-muted-foreground mb-6">
                  Check back soon for new DevOps and cloud engineering tutorials.
                </p>
                <Button size="lg" className="flex items-center gap-2 mx-auto">
                  <Youtube className="w-5 h-5" />
                  Subscribe on YouTube
                </Button>
              </Card>
            </div>
          )}

          {tutorials.length > 0 && (
            <div className="text-center mt-12">
              <Card className="p-8">
                <h3 className="text-xl font-semibold mb-4">Want to be notified?</h3>
                <p className="text-muted-foreground mb-6">
                  Subscribe to my channel and get notified when new DevOps tutorials are released.
                </p>
                <Button size="lg" className="flex items-center gap-2 mx-auto">
                  <Youtube className="w-5 h-5" />
                  Subscribe on YouTube
                </Button>
              </Card>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Tutorials;
