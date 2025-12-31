// Renderer types for react-native-hyper-markdown
import type { ReactNode } from 'react'
import type { MarkdownNode } from './ast'
import type { MarkdownTheme } from './theme'

// Import RenderContext after defining the interface in this file
// RenderContext is defined below as it needs to reference this file's types

/**
 * Props passed to all renderers
 */
export interface RendererProps<T extends MarkdownNode = MarkdownNode> {
  /** The AST node to render */
  node: T
  /** Children elements (already rendered child nodes) */
  children?: ReactNode
  /** Current theme */
  theme: MarkdownTheme
  /** Key for React list rendering */
  key?: string | number
}

/**
 * Link press handler
 */
export type OnLinkPress = (url: string, title?: string) => void

/**
 * Image press handler
 */
export type OnImagePress = (src: string, alt?: string, title?: string) => void

/**
 * Checkbox toggle handler for task lists
 */
export type OnCheckboxToggle = (checked: boolean, node: MarkdownNode) => void

/**
 * Render context passed to renderers
 */
export interface RenderContext {
  theme: MarkdownTheme
  onLinkPress?: OnLinkPress
  onImagePress?: OnImagePress
  onCheckboxToggle?: OnCheckboxToggle
  renderNode: (node: MarkdownNode, key: string | number) => ReactNode
}

/**
 * Renderer function signature (matches implementation)
 */
export type CustomRenderer<T extends MarkdownNode = MarkdownNode> = (
  node: T,
  key: string | number,
  ctx: RenderContext
) => ReactNode

/**
 * Renderer function type alias for public API
 */
export type RendererFn = CustomRenderer

/**
 * Custom renderers map
 */
export interface CustomRenderers {
  /** Document renderer */
  document?: CustomRenderer
  /** Paragraph renderer */
  paragraph?: CustomRenderer
  /** Heading renderer (all levels) */
  heading?: CustomRenderer
  /** Text renderer */
  text?: CustomRenderer
  /** Strong (bold) renderer */
  strong?: CustomRenderer
  /** Emphasis (italic) renderer */
  emphasis?: CustomRenderer
  /** Strikethrough renderer */
  strikethrough?: CustomRenderer
  /** Link renderer */
  link?: CustomRenderer
  /** Image renderer */
  image?: CustomRenderer
  /** Code block renderer */
  code_block?: CustomRenderer
  /** Inline code renderer */
  code_inline?: CustomRenderer
  /** Blockquote renderer */
  blockquote?: CustomRenderer
  /** List renderer */
  list?: CustomRenderer
  /** List item renderer */
  list_item?: CustomRenderer
  /** Task list item renderer */
  task_list_item?: CustomRenderer
  /** Table renderer */
  table?: CustomRenderer
  /** Table row renderer */
  table_row?: CustomRenderer
  /** Table cell renderer */
  table_cell?: CustomRenderer
  /** Math inline renderer */
  math_inline?: CustomRenderer
  /** Math block renderer */
  math_block?: CustomRenderer
  /** Horizontal rule renderer */
  thematic_break?: CustomRenderer
  /** Soft break renderer */
  softbreak?: CustomRenderer
  /** Hard break renderer */
  hardbreak?: CustomRenderer
  /** Wiki link renderer */
  wiki_link?: CustomRenderer
  /** HTML block renderer */
  html_block?: CustomRenderer
  /** Underline renderer */
  underline?: CustomRenderer
  /** Index signature for dynamic node types */
  [nodeType: string]: CustomRenderer | undefined
}

/**
 * Renderer component type (alternative props-based approach)
 * @deprecated Use RendererFn or CustomRenderer instead
 */
export type RendererComponent<T extends MarkdownNode = MarkdownNode> = (
  props: RendererProps<T>
) => ReactNode

/**
 * Accessibility options
 */
export interface AccessibilityOptions {
  /** Announce document structure (default: true) */
  announceStructure?: boolean
  /** Custom labels for elements */
  labels?: {
    codeBlock?: string
    codeInline?: string
    blockquote?: string
    table?: string
    listOrdered?: string
    listUnordered?: string
    taskList?: string
    mathInline?: string
    mathBlock?: string
  }
  /** Minimum touch target size (default: 44) */
  minTouchTargetSize?: number
}
