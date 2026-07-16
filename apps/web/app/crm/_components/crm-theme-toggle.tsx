"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CrmThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Toggle theme"
      onClick={(event) => {
        const shell = event.currentTarget.closest("[data-crm-shell]");
        const nextIsDark = !isDark;

        shell?.classList.toggle("dark", nextIsDark);
        setIsDark(nextIsDark);
      }}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}
