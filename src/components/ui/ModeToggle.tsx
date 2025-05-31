"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="icon"
            // className="relative w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-gray-800 dark:to-gray-700 shadow-md hover:shadow-lg transition duration-300"
            className="relative w-10 h-10 rounded-full bg-gradient-to-r from-orange-200 to-yellow-200 dark:from-gray-800 dark:to-gray-700 shadow-md hover:shadow-lg transition duration-300"
          >
            <Sun
              className="absolute h-5 w-5 text-black rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0"
            />
            <Moon
              className="absolute h-5 w-5 text-white rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100"
            />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Toggle {theme === "dark" ? "Light" : "Dark"} Mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
