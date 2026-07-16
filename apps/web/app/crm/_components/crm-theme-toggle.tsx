"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CrmThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document
      .querySelector("[data-crm-shell]")
      ?.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Toggle theme"
      onClick={(event) => {
        const shell = event.currentTarget.closest("[data-crm-shell]");
        const nextIsDark = !isDark;

        shell?.classList.toggle("dark", nextIsDark);
        document.documentElement.classList.toggle("dark", nextIsDark);
        setIsDark(nextIsDark);
      }}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}
