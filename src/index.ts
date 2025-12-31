// react-native-hyper-markdown - Main entry point
// High-performance markdown parser for React Native using Nitro Modules and md4c

// Main component
export { MarkdownView, type MarkdownViewProps } from './MarkdownView'

// Parser
export { parseMarkdown, getNativeModule } from './parser'

// Hooks
export {
  useMarkdown,
  useDebouncedParsing,
  useMarkdownAST,
  useMarkdownTheme,
} from './hooks'

// Theme
export { ThemeProvider, type ThemeProviderProps } from './context/ThemeContext'
export { lightTheme, darkTheme } from './themes'

// Types
export type {
  MarkdownNode,
  NodeType,
  TableCellAlign,
  ParseResult,
  ParseError,
  ParserOptions,
} from './types/ast'

export type {
  MarkdownTheme,
  MarkdownTextStyles,
  MarkdownContainerStyles,
  MarkdownImageStyles,
  PartialMarkdownTheme,
  SyntaxHighlightingOptions,
} from './types/theme'

export type {
  RendererProps,
  RendererComponent,
  CustomRenderers,
  CustomRenderer,
  RendererFn,
  RenderContext,
  OnLinkPress,
  OnImagePress,
  OnCheckboxToggle,
  AccessibilityOptions,
} from './types/renderers'

// Default renderers for customization
export {
  defaultRenderers,
  getDefaultRenderer,
  renderText,
  renderStrong,
  renderEmphasis,
  renderStrikethrough,
  renderHeading,
  renderParagraph,
  renderLink,
  renderImage,
  renderCodeInline,
  renderCodeBlock,
  renderBlockquote,
  renderList,
  renderListItem,
  renderTaskListItem,
  renderTable,
  renderTableRow,
  renderTableCell,
  renderThematicBreak,
  renderSoftbreak,
  renderHardbreak,
} from './renderers'

// Syntax Highlighting
export {
  SyntaxHighlighter,
  isSyntaxHighlightingAvailable,
  type SyntaxHighlighterProps,
} from './components'
