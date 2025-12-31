// Theme Context for react-native-hyper-markdown
import React, { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { MarkdownTheme, PartialMarkdownTheme } from '../types/theme'
import { lightTheme } from '../themes/light'

/**
 * Deep merge two objects
 */
function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const result = { ...target } as T

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key]
      const targetValue = target[key]

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        ;(result as Record<string, unknown>)[key] = deepMerge(
          targetValue as object,
          sourceValue as object
        )
      } else if (sourceValue !== undefined) {
        ;(result as Record<string, unknown>)[key] = sourceValue
      }
    }
  }

  return result
}

/**
 * Theme context
 */
const ThemeContext = createContext<MarkdownTheme>(lightTheme)

/**
 * Theme context provider props
 */
export interface ThemeProviderProps {
  /** Theme to use (default: lightTheme) */
  theme?: MarkdownTheme
  /** Partial theme overrides */
  themeOverrides?: PartialMarkdownTheme
  /** Children */
  children: ReactNode
}

/**
 * Theme provider component
 */
export function ThemeProvider({
  theme = lightTheme,
  themeOverrides,
  children,
}: ThemeProviderProps): React.JSX.Element {
  const mergedTheme = useMemo(() => {
    if (!themeOverrides) {
      return theme
    }
    return deepMerge(theme, themeOverrides as Partial<MarkdownTheme>)
  }, [theme, themeOverrides])

  return (
    <ThemeContext.Provider value={mergedTheme}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Hook to access the current theme
 */
export function useMarkdownTheme(): MarkdownTheme {
  return useContext(ThemeContext)
}

export { ThemeContext }
