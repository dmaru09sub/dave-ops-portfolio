
import React, { ReactNode } from "react";
import { usePageViewTracking } from "@/hooks/use-page-view-tracking";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  usePageViewTracking();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">
          {children}
        </div>
        <footer className="py-6 border-t glass-effect">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Dave-Ops.Net Portfolio. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
