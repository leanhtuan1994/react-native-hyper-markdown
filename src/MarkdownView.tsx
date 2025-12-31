// MarkdownView - Main component for rendering markdown content
import React, { useMemo, useCallback } from 'react'
import { View, Text } from 'react-native'
import type { ViewStyle } from 'react-native'
import { parseMarkdown } from './parser'
import { useMarkdownTheme } from './context/ThemeContext'
import { getRenderer } from './renderers'
import type { MarkdownNode, ParserOptions } from './types/ast'
import type { MarkdownTheme } from './types/theme'
import type {
  OnLinkPress,
  OnImagePress,
  OnCheckboxToggle,
  CustomRenderers,
  RenderContext,
} from './types/renderers'

/**
 * Props for the MarkdownView component
 */
export interface MarkdownViewProps {
  /** Markdown content to render */
  content: string
  /** Parser options */
  parserOptions?: ParserOptions
  /** Theme override (uses context theme if not provided) */
  theme?: MarkdownTheme
  /** Container style */
  style?: ViewStyle
  /** Link press handler */
  onLinkPress?: OnLinkPress
  /** Image press handler */
  onImagePress?: OnImagePress
  /** Checkbox toggle handler for task lists */
  onCheckboxToggle?: OnCheckboxToggle
  /** Show error message on parse failure */
  showErrors?: boolean
  /** Pre-parsed AST (skips parsing if provided) */
  ast?: MarkdownNode[]
  /** Custom renderers to override defaults */
  customRenderers?: CustomRenderers
}

/**
 * MarkdownView - Renders markdown content as React Native components
 */
export function MarkdownView({
  content,
  parserOptions,
  theme: themeProp,
  style,
  onLinkPress,
  onImagePress,
  onCheckboxToggle,
  showErrors = false,
  ast: astProp,
  customRenderers,
}: MarkdownViewProps): React.JSX.Element {
  // Get theme from context or props
  const contextTheme = useMarkdownTheme()
  const theme = themeProp ?? contextTheme

  // Parse markdown content
  const parseResult = useMemo(() => {
    if (astProp) {
      return { success: true, nodes: astProp }
    }
    return parseMarkdown(content, parserOptions)
  }, [content, parserOptions, astProp])

  // Create memoized renderer getter
  const getEffectiveRenderer = useMemo(() => {
    return (nodeType: string) =>
      customRenderers?.[nodeType] ?? getRenderer(nodeType)
  }, [customRenderers])

  // Recursive node renderer
  const renderNode = useCallback(
    (node: MarkdownNode, key: string | number): React.ReactNode => {
      const renderer = getEffectiveRenderer(node.type)
      const ctx: RenderContext = {
        theme,
        onLinkPress,
        onImagePress,
        onCheckboxToggle,
        renderNode,
      }
      return renderer(node, key, ctx)
    },
    [theme, onLinkPress, onImagePress, onCheckboxToggle, getEffectiveRenderer]
  )

  // Handle parse error
  if (!parseResult.success) {
    if (showErrors) {
      return (
        <View style={[theme.containerStyles.document, style]}>
          <Text style={{ color: '#ff0000' }}>
            Error parsing markdown:{' '}
            {parseResult.error?.message ?? 'Unknown error'}
          </Text>
        </View>
      )
    }
    return <View style={[theme.containerStyles.document, style]} />
  }

  // Render AST
  return (
    <View style={[theme.containerStyles.document, style]}>
      {parseResult.nodes.map((node, index) => {
        // For document nodes, render children directly
        if (node.type === 'document' && node.children) {
          return node.children.map((child, childIndex) =>
            renderNode(child, `doc-${index}-${childIndex}`)
          )
        }
        return renderNode(node, `node-${index}`)
      })}
    </View>
  )
}
