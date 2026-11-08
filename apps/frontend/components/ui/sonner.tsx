"use client";

import { useTheme } from "next-themes";
import {
  Toaster as Sonner,
  toast as sonnerToast, // <- grab helper
  type ToasterProps,
} from "sonner";

/* — themed toaster — */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

/* — tiny hook wrapper — */
function useToast() {
  return { toast: sonnerToast };
}

export { Toaster, useToast };
// optional: export raw toast if you ever want toast() directly
export { sonnerToast as toast };
