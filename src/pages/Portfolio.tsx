
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import MainLayout from "@/components/layouts/main-layout";
import { Github, Link, Filter } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

interface Project {
  id: string;
  title: string;
  description: string;
  long_description: string;
  image_url: string;
  demo_url: string;
  github_url: string;
  technologies: Json;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
}

const Portfolio = () => {
  const [selectedTech, setSelectedTech] = useState<string>("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('daveops_portfolio_projects')
          .select('*')
          .eq('published', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getTechnologies = (technologies: Json): string[] => {
    if (Array.isArray(technologies)) {
      return technologies.filter((tech): tech is string => typeof tech === 'string');
    }
    return [];
  };

  const allTechs = Array.from(new Set(projects.flatMap(p => getTechnologies(p.technologies)))).sort();

  const filteredProjects = projects.filter(project => {
    const techMatch = selectedTech === "all" || getTechnologies(project.technologies).includes(selectedTech);
    return techMatch;
  });

  if (loading) {
    return (
      <MainLayout>
        <SiteHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="text-center space-y-4">
                <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SiteHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">My DevOps Portfolio</h1>
            <p className="text-xl text-muted-foreground">
              Projects showcasing cloud infrastructure, automation, and DevOps best practices
            </p>
          </div>

          {allTechs.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-8 p-4 bg-card rounded-lg">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span className="font-medium">Technology:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedTech === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTech("all")}
                >
                  All
                </Button>
                {allTechs.map(tech => (
                  <Button
                    key={tech}
                    variant={selectedTech === tech ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTech(tech)}
                  >
                    {tech}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={project.image_url || "/placeholder.svg"} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  {project.featured && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary">Featured</Badge>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-1">
                      {getTechnologies(project.technologies).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {project.demo_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.demo_url} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                        <Link className="h-4 w-4" />
                        Demo
                      </a>
                    </Button>
                  )}
                  {project.github_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                        <Github className="h-4 w-4" />
                        Code
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {projects.length === 0 ? "No projects available at the moment." : "No projects found matching the selected filters."}
              </p>
              {projects.length > 0 && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSelectedTech("all")}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Portfolio;
