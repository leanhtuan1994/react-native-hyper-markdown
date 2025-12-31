/**
 * SyntaxHighlighter - React Native compatible syntax highlighter
 * Based on react-native-syntax-highlighter
 * Requires react-syntax-highlighter as a peer dependency
 */
import React, { useMemo } from 'react'
import { Text, ScrollView, Platform, View, type TextStyle } from 'react-native'

// Style transformation cache for performance
const styleCache = new Map<object, TransformedStyleResult>()

// CSS properties that need to be removed from top-level styles
const topLevelPropertiesToRemove = [
  'color',
  'textShadow',
  'textAlign',
  'whiteSpace',
  'wordSpacing',
  'wordBreak',
  'wordWrap',
  'lineHeight',
  'MozTabSize',
  'OTabSize',
  'tabSize',
  'WebkitHyphens',
  'MozHyphens',
  'msHyphens',
  'hyphens',
  'fontFamily',
]

interface TransformedStyleResult {
  transformedStyle: Record<string, Record<string, unknown>>
  defaultColor: string
}

interface VDOMNode {
  type: string
  tagName?: unknown
  value?: string
  properties?: {
    className?: string[]
    style?: Record<string, unknown>
  }
  children?: VDOMNode[]
}

/**
 * Props for the SyntaxHighlighter component
 */
export interface SyntaxHighlighterProps {
  /** Code string to highlight */
  children: string
  /** Programming language for syntax highlighting */
  language?: string
  /** Style theme from react-syntax-highlighter/styles */
  style?: object
  /** Which highlighter to use: 'hljs' or 'prism' (default: 'hljs') */
  highlighter?: 'hljs' | 'prism'
  /** Font size in pixels */
  fontSize?: number
  /** Font family for code text */
  fontFamily?: string
}

/**
 * Transform value from CSS to React Native
 */
function transformValue(_key: string, value: unknown): unknown {
  if (typeof value !== 'string') return value

  // Handle em units
  if (value.includes('em')) {
    const [num] = value.split('em')
    return Number(num) * 16
  }

  return value
}

/**
 * Transform web CSS stylesheet to React Native compatible styles
 */
function generateNewStylesheet(
  stylesheet: object,
  highlighter: 'hljs' | 'prism'
): TransformedStyleResult {
  if (styleCache.has(stylesheet)) {
    return styleCache.get(stylesheet)!
  }

  // Handle array stylesheet format (workaround for some themes)
  const normalizedStylesheet = Array.isArray(stylesheet)
    ? stylesheet[0]
    : stylesheet

  const transformedStyle: Record<string, Record<string, unknown>> = {}

  for (const [className, style] of Object.entries(
    normalizedStylesheet as Record<string, Record<string, string>>
  )) {
    if (!style || typeof style !== 'object') {
      continue
    }

    const newStyle: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(style)) {
      if (key === 'overflowX' || key === 'overflow') {
        newStyle.overflow = value === 'auto' ? 'scroll' : value
      } else if (key === 'background') {
        newStyle.backgroundColor = value
      } else if (key === 'display') {
        // Skip display property (not supported in RN)
        continue
      } else {
        newStyle[key] = transformValue(key, value)
      }
    }

    transformedStyle[className] = newStyle
  }

  // Get top-level style based on highlighter type
  const topLevel =
    highlighter === 'prism'
      ? transformedStyle['pre[class*="language-"]']
      : transformedStyle.hljs

  const defaultColor = (topLevel && (topLevel.color as string)) || '#abb2bf'

  // Remove unsupported properties from top-level styles
  if (topLevel) {
    topLevelPropertiesToRemove.forEach((property) => {
      if (topLevel[property]) {
        delete topLevel[property]
      }
    })
    if (topLevel.backgroundColor === 'none') {
      delete topLevel.backgroundColor
    }
  }

  // Handle prism-specific code-level styles
  const codeLevel = transformedStyle['code[class*="language-"]']
  if (highlighter === 'prism' && codeLevel) {
    topLevelPropertiesToRemove.forEach((property) => {
      if (codeLevel[property]) {
        delete codeLevel[property]
      }
    })
    if (codeLevel.backgroundColor === 'none') {
      delete codeLevel.backgroundColor
    }
  }

  const result = { transformedStyle, defaultColor }
  styleCache.set(stylesheet, result)
  return result
}

/**
 * Create style object from class names
 * Handles both "hljs-keyword" and "keyword" style lookups
 */
function createStyleObject(
  classNames: string[] | undefined,
  baseStyle: Record<string, unknown>,
  stylesheet: Record<string, Record<string, unknown>>
): Record<string, unknown> {
  if (!classNames || classNames.length === 0) return baseStyle

  let result = { ...baseStyle }

  for (const className of classNames) {
    // Try exact match first
    let style = stylesheet[className]

    // Try with hljs- prefix removed
    if (!style && className.startsWith('hljs-')) {
      style = stylesheet[className.substring(5)]
    }

    // Try with . prefix
    if (!style) {
      style = stylesheet[`.${className}`]
    }

    // Try without any prefix
    if (!style) {
      style = stylesheet[className.replace('hljs-', '')]
    }

    if (style) {
      result = { ...result, ...style }
    }
  }

  return result
}

/**
 * Create React Native Text element from VDOM node
 */
function createNativeElement(
  node: VDOMNode,
  stylesheet: Record<string, Record<string, unknown>>,
  key: string,
  defaultColor: string,
  fontFamily: string,
  fontSize: number
): React.ReactNode {
  const startingStyle: TextStyle = {
    fontFamily,
    fontSize,
    lineHeight: fontSize + 5,
  }

  if (node.type === 'text') {
    return (
      <Text key={key} style={[{ color: defaultColor }, startingStyle]}>
        {node.value}
      </Text>
    )
  }

  if (node.tagName) {
    const classNames = node.properties?.className
    const style = createStyleObject(
      classNames,
      { color: defaultColor, ...startingStyle },
      stylesheet
    )

    // Get the color from computed style
    const nodeColor = (style.color as string) || defaultColor

    const children = node.children?.map((child, i) =>
      createNativeElement(
        child,
        stylesheet,
        `${key}-${i}`,
        nodeColor,
        fontFamily,
        fontSize
      )
    )

    return (
      <Text key={key} style={style as TextStyle}>
        {children}
      </Text>
    )
  }

  return null
}

/**
 * Native renderer function for react-syntax-highlighter
 */
function createNativeRenderer(
  defaultColor: string,
  fontFamily: string,
  fontSize: number
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (props: any) => {
    const { rows, stylesheet } = props
    return (rows as VDOMNode[]).map((node, i) =>
      createNativeElement(
        node,
        stylesheet as Record<string, Record<string, unknown>>,
        `code-segment-${i}`,
        defaultColor,
        fontFamily,
        fontSize
      )
    )
  }
}

// Cache the highlighter module to avoid repeated require attempts
let _highlighterModule: unknown = null
let _highlighterChecked = false

function getHighlighterModule(): unknown {
  if (_highlighterChecked) {
    return _highlighterModule
  }
  _highlighterChecked = true
  try {
    _highlighterModule = require('react-syntax-highlighter')
    return _highlighterModule
  } catch {
    return null
  }
}

/**
 * Check if react-syntax-highlighter is available
 */
export function isSyntaxHighlightingAvailable(): boolean {
  return getHighlighterModule() !== null
}

/**
 * SyntaxHighlighter component for React Native
 * Renders syntax-highlighted code using react-syntax-highlighter
 */
export function SyntaxHighlighter({
  children,
  language = 'text',
  style,
  highlighter = 'hljs',
  fontSize = 14,
  fontFamily = Platform.OS === 'ios' ? 'Menlo-Regular' : 'monospace',
}: SyntaxHighlighterProps): React.ReactElement | null {
  // Get the highlighter module
  const highlighterModule = getHighlighterModule()

  // Get the appropriate highlighter component
  const Highlighter = useMemo(() => {
    if (!highlighterModule) {
      return null
    }

    const mod = highlighterModule as Record<string, unknown>

    // Try different export patterns
    if (highlighter === 'prism' && mod.Prism) {
      return mod.Prism as React.ComponentType<Record<string, unknown>>
    }

    // Try default export first
    if (mod.default) {
      return mod.default as React.ComponentType<Record<string, unknown>>
    }

    // The module itself might be the component
    if (typeof highlighterModule === 'function') {
      return highlighterModule as React.ComponentType<Record<string, unknown>>
    }

    // Light build default export
    if (mod.Light) {
      return mod.Light as React.ComponentType<Record<string, unknown>>
    }

    return null
  }, [highlighterModule, highlighter])

  // Transform stylesheet - the style needs to be passed correctly
  const { transformedStyle, defaultColor } = useMemo(() => {
    if (!style) {
      // Return a default style
      return {
        transformedStyle: {},
        defaultColor: '#abb2bf',
      }
    }
    return generateNewStylesheet(style, highlighter)
  }, [style, highlighter])

  // If react-syntax-highlighter is not available, return fallback
  if (!Highlighter) {
    return (
      <ScrollView horizontal>
        <Text
          style={{
            fontFamily,
            fontSize,
            color: '#abb2bf',
          }}
        >
          {children}
        </Text>
      </ScrollView>
    )
  }

  // If no style provided, let react-syntax-highlighter use its own styling
  // but we still need to use our native renderer
  const styleToUse = style ? transformedStyle : undefined

  return (
    <Highlighter
      language={language}
      style={styleToUse}
      PreTag={ScrollView}
      CodeTag={View}
      renderer={createNativeRenderer(defaultColor, fontFamily, fontSize)}
    >
      {children}
    </Highlighter>
  )
}

export default SyntaxHighlighter
