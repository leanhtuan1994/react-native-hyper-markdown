// parseMarkdown wrapper function
import { NitroModules } from 'react-native-nitro-modules'
import type { HyperMarkdown as HyperMarkdownSpec } from './specs/hyper-markdown.nitro'
import type { MarkdownNode, ParseResult, ParserOptions } from './types/ast'

// Create the native HyperMarkdown module
const HyperMarkdown =
  NitroModules.createHybridObject<HyperMarkdownSpec>('HyperMarkdown')

/**
 * Parse markdown content into an AST
 * @param content - Markdown string to parse
 * @param options - Parser options
 * @returns ParseResult with AST nodes or error
 */
export function parseMarkdown(
  content: string,
  options?: ParserOptions
): ParseResult {
  try {
    const result = HyperMarkdown.parse(content, options)

    if (!result.success) {
      return {
        success: false,
        nodes: [],
        error: {
          message: result.errorMessage ?? 'Unknown parse error',
          line: result.errorLine,
          column: result.errorColumn,
        },
      }
    }

    // Parse the JSON AST string
    const nodes: MarkdownNode[] = JSON.parse(result.ast)

    return {
      success: true,
      nodes,
    }
  } catch (error) {
    return {
      success: false,
      nodes: [],
      error: {
        message:
          error instanceof Error ? error.message : 'Failed to parse markdown',
      },
    }
  }
}

/**
 * Get the native HyperMarkdown module for direct access
 */
export function getNativeModule(): HyperMarkdownSpec {
  return HyperMarkdown
}
