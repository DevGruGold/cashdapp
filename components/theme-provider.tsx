"use client"

import { createContext, useContext } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange {...props}>
      {children}
    </NextThemesProvider>
  )
}

export const ThemeContext = createContext({ theme: "light", setTheme: (theme: string) => {} })

export const useTheme = () => {
  return useContext(ThemeContext)
}
