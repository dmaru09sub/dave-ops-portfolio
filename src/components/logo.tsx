
import { CloudCog } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-2 text-2xl font-bold animate-in">
      <CloudCog className="w-8 h-8 text-primary animate-pulse" />
      <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
        Dave Ops
      </span>
    </div>
  );
};
