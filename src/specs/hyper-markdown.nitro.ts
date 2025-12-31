import { type HybridObject } from 'react-native-nitro-modules'

// Parser options matching md4c flags
export interface ParserOptions {
  // Enable all GFM extensions (default: true)
  gfm?: boolean
  // Enable tables (default: true)
  enableTables?: boolean
  // Enable task lists (default: true)
  enableTaskLists?: boolean
  // Enable strikethrough (default: true)
  enableStrikethrough?: boolean
  // Enable autolinks (default: true)
  enableAutolink?: boolean
  // Enable LaTeX math (default: false)
  math?: boolean
  // Enable WikiLinks (default: false)
  wiki?: boolean
  // Maximum input size in bytes (default: 10MB)
  maxInputSize?: number
  // Parse timeout in milliseconds (default: 5000)
  timeout?: number
}

// Parse result returned from native
export interface ParseResultNative {
  // Whether parsing succeeded
  success: boolean
  // JSON-encoded AST (parsed on JS side to avoid recursive type issues)
  ast: string
  // Error message if parsing failed
  errorMessage?: string
  // Error line number
  errorLine?: number
  // Error column number
  errorColumn?: number
}

// HyperMarkdown native module interface
export interface HyperMarkdown extends HybridObject<{
  ios: 'c++'
  android: 'c++'
}> {
  // Parse markdown content into AST (returns JSON string for recursive structure)
  parse(content: string, options?: ParserOptions): ParseResultNative
}
