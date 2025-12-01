import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

type ThemeMode = "light" | "dark" | "contrast"
type FontSize = "sm" | "md" | "lg"
type FontFamily = "sans" | "serif" | "mono"

interface ThemeContextValue {
  theme: ThemeMode
  fontSize: FontSize
  fontFamily: FontFamily
  setTheme: (value: ThemeMode) => void
  setFontSize: (value: FontSize) => void
  setFontFamily: (value: FontFamily) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeMode>("light")
  const [fontSize, setFontSize] = useState<FontSize>("md")
  const [fontFamily, setFontFamily] = useState<FontFamily>("sans")

  const value = useMemo(
    () => ({ theme, fontSize, fontFamily, setTheme, setFontSize, setFontFamily }),
    [theme, fontSize, fontFamily],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useThemeSettings = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error("useThemeSettings must be used within ThemeProvider")
  }
  return ctx
}
