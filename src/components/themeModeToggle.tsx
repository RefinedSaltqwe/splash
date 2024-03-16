"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useThemeMode } from "@/stores/useThemeMode";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const storageKey = "splash-theme-mode-state";

  const [themeMode, setThemeMode] = useLocalStorage<string>(storageKey, "");
  const setMode = useThemeMode((state) => state.setMode);

  function themeSetter(mode: string) {
    setTheme(mode);
    setThemeMode(mode);
    setMode(mode);
  }
  // Sets the theme mode in first load
  useEffect(() => {
    setTheme(themeMode);
    setMode(themeMode);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full ">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-drop-downmenu">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => themeSetter("light")}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => themeSetter("dark")}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => themeSetter("system")}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
