// Hooks for react-native-hyper-markdown
import { useMemo, useState, useEffect, useRef } from 'react'
import { parseMarkdown } from '../parser'
import type { MarkdownNode, ParseResult, ParserOptions } from '../types/ast'

/**
 * Hook to parse markdown and memoize the result
 * @param content - Markdown content to parse
 * @param options - Parser options
 * @returns Parse result with AST nodes
 */
export function useMarkdown(
  content: string,
  options?: ParserOptions
): ParseResult {
  return useMemo(() => {
    return parseMarkdown(content, options)
  }, [content, options])
}

/**
 * Hook for debounced markdown parsing
 * Useful for live preview scenarios where content changes frequently
 * @param content - Markdown content to parse
 * @param options - Parser options
 * @param delay - Debounce delay in milliseconds (default: 300)
 * @returns Parse result with AST nodes (updated after debounce delay)
 */
export function useDebouncedParsing(
  content: string,
  options?: ParserOptions,
  delay: number = 300
): ParseResult {
  const [result, setResult] = useState<ParseResult>(() =>
    parseMarkdown(content, options)
  )
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set up new debounced parse
    timeoutRef.current = setTimeout(() => {
      setResult(parseMarkdown(content, options))
    }, delay)

    // Cleanup on unmount or content change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [content, options, delay])

  return result
}

/**
 * Hook to get just the parsed AST nodes
 * Convenience wrapper around useMarkdown
 * @param content - Markdown content to parse
 * @param options - Parser options
 * @returns Array of MarkdownNode (empty array on error)
 */
export function useMarkdownAST(
  content: string,
  options?: ParserOptions
): MarkdownNode[] {
  const result = useMarkdown(content, options)
  return result.success ? result.nodes : []
}

// Re-export useMarkdownTheme from context
export { useMarkdownTheme } from '../context/ThemeContext'
