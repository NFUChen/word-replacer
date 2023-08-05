"use client";

import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeSwitch: React.FC = () => {
  const { setTheme } = useTheme();

  const handleSetDark = () => {
    setTheme("dark");
  };

  const handleSetLight = () => {
    setTheme("light");
  };

  return (
    <>
      <Button onClick={handleSetDark} variant="ghost" className="dark:hidden">
        <Sun size={16} />
      </Button>
      <Button onClick={handleSetLight} variant="ghost" className="hidden dark:block">
        <Moon size={16} />
      </Button>
    </>
  );
};
