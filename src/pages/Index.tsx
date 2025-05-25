
import { Card } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import MainLayout from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Code, Youtube, User, Briefcase } from "lucide-react";

const Index = () => {
  return (
    <MainLayout>
      <SiteHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Where Dev meets 
            <span className="text-primary"> Dave</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Orchestrating cloud solutions with a personal touch. Your friendly neighborhood DevOps engineer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 h-full">
            <div className="flex flex-col h-full space-y-4">
              <div className="flex flex-col items-center text-center space-y-4 flex-grow">
                <Briefcase className="w-12 h-12 text-primary" />
                <h3 className="text-xl font-semibold">Portfolio</h3>
                <p className="text-muted-foreground text-sm">
                  Explore my projects with detailed tech stacks and filterable categories
                </p>
              </div>
              <Button asChild className="w-full mt-auto">
                <Link to="/portfolio">View Projects</Link>
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 h-full">
            <div className="flex flex-col h-full space-y-4">
              <div className="flex flex-col items-center text-center space-y-4 flex-grow">
                <Youtube className="w-12 h-12 text-primary" />
                <h3 className="text-xl font-semibold">Tutorials</h3>
                <p className="text-muted-foreground text-sm">
                  Custom YouTube tutorials covering DevOps and cloud technologies
                </p>
              </div>
              <Button asChild className="w-full mt-auto">
                <Link to="/tutorials">Watch Tutorials</Link>
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 h-full">
            <div className="flex flex-col h-full space-y-4">
              <div className="flex flex-col items-center text-center space-y-4 flex-grow">
                <User className="w-12 h-12 text-primary" />
                <h3 className="text-xl font-semibold">About Me</h3>
                <p className="text-muted-foreground text-sm">
                  Learn about my journey in DevOps and cloud engineering
                </p>
              </div>
              <Button asChild className="w-full mt-auto">
                <Link to="/about">About Dave</Link>
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 h-full">
            <div className="flex flex-col h-full space-y-4">
              <div className="flex flex-col items-center text-center space-y-4 flex-grow">
                <Code className="w-12 h-12 text-primary" />
                <h3 className="text-xl font-semibold">Contact</h3>
                <p className="text-muted-foreground text-sm">
                  Get in touch for collaboration or DevOps consultation
                </p>
              </div>
              <Button asChild className="w-full mt-auto">
                <Link to="/contact">Get In Touch</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
