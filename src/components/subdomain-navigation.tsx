
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export function SubdomainNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentProject = {
    name: "Portfolio",
    color: "bg-primary",
    path: "/"
  };
  
  const subdomains = [
    { name: "Blog", color: "bg-blue-400", path: "https://blog.example.com" },
    { name: "Dashboard", color: "bg-blue-500", path: "https://dashboard.example.com" },
    { name: "Store", color: "bg-blue-600", path: "https://store.example.com" },
    { name: "Docs", color: "bg-blue-700", path: "https://docs.example.com" }
  ];

  return (
    <div className="relative z-50">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        <CollapsibleTrigger asChild>
          <button className="flex items-center w-full px-6 h-14 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", currentProject.color)} />
              <span className="font-medium">{currentProject.name}</span>
            </div>
            <ChevronDown className={cn(
              "ml-auto h-4 w-4 text-muted-foreground transition-transform duration-300",
              isOpen ? "transform rotate-180" : ""
            )} />
          </button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="border-t backdrop-blur-lg bg-background/95 shadow-lg">
          <div className="p-4">
            <div className="text-sm text-muted-foreground mb-2 px-2">My Other Apps</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {subdomains.map((subdomain) => (
                <a 
                  key={subdomain.name}
                  href={subdomain.path}
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-accent/50 transition-all hover:scale-[1.02]"
                >
                  <div className={cn("w-2 h-2 rounded-full", subdomain.color)} />
                  <span>{subdomain.name}</span>
                </a>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
