// AST Node Types for react-native-hyper-markdown
// These types match the JSON structure from the C++ parser

/**
 * Node type enum matching md4c output
 */
export type NodeType =
  | 'document'
  | 'paragraph'
  | 'heading'
  | 'text'
  | 'strong'
  | 'emphasis'
  | 'strikethrough'
  | 'link'
  | 'image'
  | 'code_block'
  | 'code_inline'
  | 'blockquote'
  | 'list'
  | 'list_item'
  | 'task_list_item'
  | 'table'
  | 'table_head'
  | 'table_body'
  | 'table_row'
  | 'table_cell'
  | 'math_inline'
  | 'math_block'
  | 'thematic_break'
  | 'softbreak'
  | 'hardbreak'
  | 'wiki_link'
  | 'html_block'
  | 'html_inline'
  | 'underline'

/**
 * Table cell alignment
 */
export type TableCellAlign = 'left' | 'center' | 'right' | 'default'

/**
 * Markdown AST node structure
 */
export interface MarkdownNode {
  /** Node type */
  type: NodeType
  /** Text content for leaf nodes */
  content?: string
  /** Children for container nodes */
  children?: MarkdownNode[]
  /** Heading level (1-6) */
  level?: number
  /** Link href */
  href?: string
  /** Image source */
  src?: string
  /** Image alt text */
  alt?: string
  /** Link/Image title */
  title?: string
  /** Code block language */
  language?: string
  /** Is ordered list */
  ordered?: boolean
  /** Ordered list start number */
  start?: number
  /** Task list item checked state */
  checked?: boolean
  /** Table cell alignment */
  align?: TableCellAlign
  /** Is table header cell */
  isHeader?: boolean
}

/**
 * Parse error structure
 */
export interface ParseError {
  message: string
  line?: number
  column?: number
}

/**
 * Parse result from the parser
 */
export interface ParseResult {
  success: boolean
  nodes: MarkdownNode[]
  error?: ParseError
}

/**
 * Parser options
 */
export interface ParserOptions {
  /** Enable all GFM extensions (default: true) */
  gfm?: boolean
  /** Enable tables (default: true) */
  enableTables?: boolean
  /** Enable task lists (default: true) */
  enableTaskLists?: boolean
  /** Enable strikethrough (default: true) */
  enableStrikethrough?: boolean
  /** Enable autolinks (default: true) */
  enableAutolink?: boolean
  /** Enable LaTeX math (default: false) */
  math?: boolean
  /** Enable WikiLinks (default: false) */
  wiki?: boolean
  /** Maximum input size in bytes (default: 10MB) */
  maxInputSize?: number
  /** Parse timeout in milliseconds (default: 5000) */
  timeout?: number
}
