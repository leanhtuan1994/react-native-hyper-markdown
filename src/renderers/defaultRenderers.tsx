// Default renderers for react-native-hyper-markdown
import React from 'react'
import { Text, View, Image as RNImage, Pressable } from 'react-native'
import type { MarkdownNode } from '../types/ast'
import type { RenderContext, RendererFn } from '../types/renderers'

// Text node renderer
export function renderText(
  node: MarkdownNode,
  _key: string | number,
  _ctx: RenderContext
): React.ReactNode {
  return node.content ?? ''
}

// Strong (bold) renderer
export function renderStrong(
  node: MarkdownNode,
  key: string | number,
  ctx: RenderContext
): React.ReactNode {
  return (
    <Text key={key} style={ctx.theme.textStyles.strong}>
      {node.children?.map((child, i) => ctx.renderNode(child, `${key}-${i}`))}
    </Text>
  )
}

// Emphasis (italic) renderer
export function renderEmphasis(
  node: MarkdownNode,
  key: string | number,
  ctx: RenderContext
): React.ReactNode {
  return (
    <Text key={key} style={ctx.theme.textStyles.emphasis}>
      {node.children?.map((child, i) => ctx.renderNode(child, `${key}-${i}`))}
    </Text>
  )
}

// Strikethrough renderer
export function renderStrikethrough(
  node: MarkdownNode,
  key: string | number,
  ctx: RenderContext
): React.ReactNode {
  return (
    <Text key={key} style={ctx.theme.textStyles.strikethrough}>
      {node.children?.map((child, i) => ctx.renderNode(child, `${key}-${i}`))}
    </Text>
  )
}

// Heading renderer
export function renderHeading(
  node: MarkdownNode,
  key: string | number,
  ctx: RenderContext
): React.ReactNode {
  const level = node.level ?? 1
  const styleKey = `heading${level}` as keyof typeof ctx.theme.textStyles
  const style = ctx.theme.textStyles[styleKey] ?? ctx.theme.textStyles.heading1

  return (
    <Text
      key={key}
      style={style}
      accessibilityRole="header"
      accessibilityLabel={`Heading level ${level}`}
    >
      {node.children?.map((child, i) => ctx.renderNode(child, `${key}-${i}`))}
    </Text>
  )
}

// Paragraph renderer
export function renderParagraph(
  node: MarkdownNode,
  key: string | number,
  ctx: RenderContext
): React.ReactNode {
  // Check if paragraph contains block-level elements (like images)
  // that can't be nested inside Text
  const hasBlockChildren = node.children?.some(
    (child) => child.type === 'image'
  )

  if (hasBlockChildren) {
    // For paragraphs with images, render as View with Text wrapper for inline content
    return (
      <View key={key} style={ctx.theme.containerStyles.paragraph}>
        {node.children?.map((child, i) => {
          if (child.type === 'image') {
            return ctx.renderNode(child, `${key}-${i}`)
          }
          // Wrap non-image children in Text
          return (
            <Text key={`${key}-${i}`} style={ctx.theme.textStyles.text}>
              {ctx.renderNode(child, `${key}-${i}-inner`)}
            </Text>
          )
        })}
      </View>
    )
  }

  // Standard text-only paragraph
  return (
    <Text
      key={key}
      style={[ctx.theme.textStyles.text, ctx.theme.containerStyles.paragraph]}
    >
      {node.children?.map((child, i) => ctx.renderNode(child, `${key}-${i}`))}
    </Text>
  )
}

// Link renderer
export function renderLink(
  node: MarkdownNode,
  key: string | number,
  ctx: RenderContext
): React.ReactNode {
  const handlePress = () => {
    if (ctx.onLinkPress && node.href) {
      ctx.onLinkPress(node.href, node.title)
    }
  }

  return (
    <Text
      key={key}
      style={ctx.theme.textStyles.link}
      accessibilityRole="link"
      accessibilityLabel={`Link to ${node.href}`}
      accessibilityHint="Double tap to open"
      onPress={handlePress}
    >
      {node.children?.map((child, i) => ctx.renderNode(child, `${key}-${i}`))}
    </Text>
  )
}

// Image renderer
export function renderImage(
  node: MarkdownNode,
  key: string | number,
  ctx: RenderContext
): React.ReactNode {
  const handlePress = () => {
    if (ctx.onImagePress && node.src) {
      ctx.onImagePress(node.src, node.alt, node.title)
    }
  }

  if (!node.src) {
    return null
  }

  return (
    <View key={key} style={ctx.theme.containerStyles.imageContainer}>
      <Pressable
        onPress={ctx.onImagePress ? handlePress : undefined}
        accessibilityRole="image"
        accessibilityLabel={node.alt ?? 'Image'}
      >
        <RNImage
          source={{ uri: node.src }}
          style={{
            width: '100%',
            height: 200,
            resizeMode: 'cover',
            borderRadius: 8,
          }}
          accessibilityLabel={node.alt}
        />
      </Pressable>
      {node.alt && (
        <Text
          style={{
            fontSize: 12,
            color: ctx.theme.colors.text,
            opacity: 0.7,
            textAlign: 'center',
            marginTop: 4,
          }}
        >
          {node.alt}
        </Text>
      )}
    </View>
  )
}

// Code inline renderer
export function renderCodeInline(
  node: MarkdownNode,
  key: string | number,
  ctx: RenderContext
): React.ReactNode {
  return (
    <Text
      key={key}
      style={ctx.theme.textStyles.codeInline}
      accessibilityLabel="Code"
    >
      {node.content ??
        node.children?.map((child, i) => ctx.renderNode(child, `${key}-${i}`))}
    </Text>
  )
}

// Code block renderer with optional syntax highlighting
export function renderCodeBlock(
  node: MarkdownNode,
  key: string | number,
  ctx: RenderContext
): React.ReactNode {
  const code =
    node.content ??
    node.children?.map((child) => child.content ?? '').join('') ??
    ''
  const language = node.language ?? 'text'

  // Try to use syntax highlighting if enabled
  const syntaxOptions = ctx.theme.syntaxHighlighting
  const isEnabled = syntaxOptions?.enabled !== false

  if (isEnabled) {
    try {
      // Dynamic import to handle optional dependency
      const {
        SyntaxHighlighter,
        isSyntaxHighlightingAvailable,
      } = require('../components/SyntaxHighlighter')

      if (isSyntaxHighlightingAvailable()) {
        return (
          <View
            key={key}
            style={ctx.theme.containerStyles.codeBlockContainer}
            accessibilityLabel="Code block"
          >
            <SyntaxHighlighter
              language={language}
              style={syntaxOptions?.theme}
              highlighter={syntaxOptions?.highlighter}
              fontSize={syntaxOptions?.fontSize}
              fontFamily={syntaxOptions?.fontFamily}
            >
              {code}
            </SyntaxHighlighter>
          </View>
        )
      }
    } catch {
      // Fallback to plain text if SyntaxHighlighter is not available
    }
  }

  // Fallback: plain text rendering
  return (
    <View
      key={key}
      style={ctx.theme.containerStyles.codeBlockContainer}
      accessibilityLabel="Code block"
    >
      <Text style={ctx.theme.textStyles.codeBlock}>{code}</Text>
    </View>
  )
}

// Blockquote renderer
export function renderBlockquote(
  node: MarkdownNode,
  key: string | number,
  ctx: RenderContext
): React.ReactNode {
  return (
    <View
      key={key}
      style={ctx.theme.containerStyles.blockquoteContainer}
      accessibilityLabel="Quote"
    >
      <Text style={ctx.theme.textStyles.blockquote}>
        {node.children?.map((child, i) => ctx.renderNode(child, `${key}-${i}`))}
      </Text>
    </View>
  )
}

// List renderer
export function renderList(
  node: MarkdownNode,
  key: string | number,
  ctx: RenderContext
): React.ReactNode {
  return (
    <View
      key={key}
      style={ctx.theme.containerStyles.list}
      accessibilityLabel={node.ordered ? 'Numbered list' : 'Bullet list'}
    >
      {node.children?.map((child, i) => ctx.renderNode(child, `${key}-${i}`))}
    </View>
  )
}

// List item renderer
export function renderListItem(
  node: MarkdownNode,
  key: string | number,
  ctx: RenderContext
): React.ReactNode {
  return (
    <View key={key} style={ctx.theme.containerStyles.listItemContainer}>
      <Text style={ctx.theme.textStyles.listItem}>• </Text>
      <Text style={[ctx.theme.textStyles.listItem, { flex: 1 }]}>
        {node.children?.map((child, i) => ctx.renderNode(child, `${key}-${i}`))}
      </Text>
    </View>
  )
}

// Task list item renderer
export function renderTaskListItem(
  node: MarkdownNode,
  key: string | number,
  ctx: RenderContext
): React.ReactNode {
  const handleToggle = () => {
    if (ctx.onCheckboxToggle) {
      ctx.onCheckboxToggle(!node.checked, node)
    }
  }

  return (
    <View key={key} style={ctx.theme.containerStyles.listItemContainer}>
      <Pressable
        onPress={handleToggle}
        style={[
          ctx.theme.containerStyles.checkbox,
          node.checked && ctx.theme.containerStyles.checkboxChecked,
        ]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: node.checked }}
      >
        {node.checked && <Text style={{ color: '#fff', fontSize: 12 }}>✓</Text>}
      </Pressable>
      <Text style={[ctx.theme.textStyles.listItem, { flex: 1 }]}>
        {node.children?.map((child, i) => ctx.renderNode(child, `${key}-${i}`))}
      </Text>
    </View>
  )
}

// Table renderer
export function renderTable(
  node: MarkdownNode,
  key: string | number,
  ctx: RenderContext
): React.ReactNode {
  return (
    <View
      key={key}
      style={ctx.theme.containerStyles.table}
      accessibilityLabel="Table"
    >
      {node.children?.map((child, i) => ctx.renderNode(child, `${key}-${i}`))}
    </View>
  )
}

// Table row renderer
export function renderTableRow(
  node: MarkdownNode,
  key: string | number,
  ctx: RenderContext
): React.ReactNode {
  return (
    <View key={key} style={ctx.theme.containerStyles.tableRow}>
      {node.children?.map((child, i) => ctx.renderNode(child, `${key}-${i}`))}
    </View>
  )
}

// Table cell renderer
export function renderTableCell(
  node: MarkdownNode,
  key: string | number,
  ctx: RenderContext
): React.ReactNode {
  const textStyle = node.isHeader
    ? ctx.theme.textStyles.tableHeader
    : ctx.theme.textStyles.tableCell
  const alignStyle = node.align
    ? { textAlign: node.align as 'left' | 'center' | 'right' }
    : {}

  return (
    <View key={key} style={ctx.theme.containerStyles.tableCellContainer}>
      <Text style={[textStyle, alignStyle]}>
        {node.children?.map((child, i) => ctx.renderNode(child, `${key}-${i}`))}
      </Text>
    </View>
  )
}

// Thematic break (hr) renderer
export function renderThematicBreak(
  _node: MarkdownNode,
  key: string | number,
  ctx: RenderContext
): React.ReactNode {
  return <View key={key} style={ctx.theme.containerStyles.thematicBreak} />
}

// Soft break renderer
export function renderSoftbreak(
  _node: MarkdownNode,
  key: string | number,
  _ctx: RenderContext
): React.ReactNode {
  return <Text key={key}> </Text>
}

// Hard break renderer
export function renderHardbreak(
  _node: MarkdownNode,
  key: string | number,
  _ctx: RenderContext
): React.ReactNode {
  return <Text key={key}>{'\n'}</Text>
}

// Default renderer for unknown types
export function renderDefault(
  node: MarkdownNode,
  key: string | number,
  ctx: RenderContext
): React.ReactNode {
  if (node.children && node.children.length > 0) {
    return (
      <Text key={key}>
        {node.children.map((child, i) => ctx.renderNode(child, `${key}-${i}`))}
      </Text>
    )
  }
  return node.content ? <Text key={key}>{node.content}</Text> : null
}

/**
 * Map of all default renderers by node type
 */
export const defaultRenderers: Record<string, RendererFn> = {
  text: renderText,
  strong: renderStrong,
  emphasis: renderEmphasis,
  strikethrough: renderStrikethrough,
  heading: renderHeading,
  paragraph: renderParagraph,
  link: renderLink,
  image: renderImage,
  code_inline: renderCodeInline,
  code_block: renderCodeBlock,
  blockquote: renderBlockquote,
  list: renderList,
  list_item: renderListItem,
  task_list_item: renderTaskListItem,
  table: renderTable,
  table_row: renderTableRow,
  table_cell: renderTableCell,
  thematic_break: renderThematicBreak,
  softbreak: renderSoftbreak,
  hardbreak: renderHardbreak,
}

/**
 * Get default renderer by node type
 * Returns renderDefault for unknown types
 */
export function getDefaultRenderer(nodeType: string): RendererFn {
  return defaultRenderers[nodeType] ?? renderDefault
}

// Get renderer for node type (backward compatibility)
export function getRenderer(
  nodeType: string
): (
  node: MarkdownNode,
  key: string | number,
  ctx: RenderContext
) => React.ReactNode {
  switch (nodeType) {
    case 'text':
      return renderText
    case 'strong':
      return renderStrong
    case 'emphasis':
      return renderEmphasis
    case 'strikethrough':
      return renderStrikethrough
    case 'heading':
      return renderHeading
    case 'paragraph':
      return renderParagraph
    case 'link':
      return renderLink
    case 'image':
      return renderImage
    case 'code_inline':
      return renderCodeInline
    case 'code_block':
      return renderCodeBlock
    case 'blockquote':
      return renderBlockquote
    case 'list':
      return renderList
    case 'list_item':
      return renderListItem
    case 'task_list_item':
      return renderTaskListItem
    case 'table':
      return renderTable
    case 'table_head':
    case 'table_body':
      return renderDefault
    case 'table_row':
      return renderTableRow
    case 'table_cell':
      return renderTableCell
    case 'thematic_break':
      return renderThematicBreak
    case 'softbreak':
      return renderSoftbreak
    case 'hardbreak':
      return renderHardbreak
    default:
      return renderDefault
  }
}
