"use Client";
import React, { useEffect } from "react";
import { useTheme } from "next-themes";
import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

export const MyThemeSwitch = () => {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (!mounted) return null;

  return (
    <div onClick={toggleTheme}>
      {theme === "light" ? <MoonFilledIcon /> : <SunFilledIcon />}
    </div>
  );
};
