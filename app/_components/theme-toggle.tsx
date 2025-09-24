'use client';

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";
import { useEffect, useMemo, useState, type ComponentProps } from "react";

type ThemeToggleProps = {
  className?: string;
  size?: ComponentProps<typeof Button>["size"];
  variant?: ComponentProps<typeof Button>["variant"];
  showLabel?: boolean;
};

export function ThemeToggle({
  className,
  size = "icon",
  variant = "ghost",
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const label = useMemo(() => {
    if (!mounted) return "Toggle theme";
    return theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  }, [mounted, theme]);

  const labelWithState = useMemo(() => {
    if (!mounted) return "Toggle theme";
    return theme === "dark" ? "Light mode" : "Dark mode";
  }, [mounted, theme]);

  const Icon = mounted && theme === "dark" ? Sun : Moon;

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      onClick={toggleTheme}
      aria-label={label}
      className={className}
    >
      <Icon className="h-4 w-4" aria-hidden />
      {showLabel ? <span>{labelWithState}</span> : <span className="sr-only">{label}</span>}
    </Button>
  );
}
