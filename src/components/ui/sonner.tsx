"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--toast-bg": "var(--popover)",
          "--toast-text": "var(--popover-foreground)",
          "--toast-border": "var(--border)",
          "--toast-error-bg": "var(--destructive)",
          "--toast-error-text": "var(--destructive-foreground)",
          "--toast-error-border": "var(--destructive)",
          "--toast-success-bg": "var(--success)",
          "--toast-success-text": "var(--success-foreground)",
          "--toast-success-border": "var(--success)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
