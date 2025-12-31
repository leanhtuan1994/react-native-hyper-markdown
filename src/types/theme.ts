// Theme types for react-native-hyper-markdown
import type { TextStyle, ViewStyle, ImageStyle } from 'react-native'

/**
 * Text styles for markdown elements
 */
export interface MarkdownTextStyles {
  /** Default text style */
  text?: TextStyle
  /** Heading 1 */
  heading1?: TextStyle
  /** Heading 2 */
  heading2?: TextStyle
  /** Heading 3 */
  heading3?: TextStyle
  /** Heading 4 */
  heading4?: TextStyle
  /** Heading 5 */
  heading5?: TextStyle
  /** Heading 6 */
  heading6?: TextStyle
  /** Bold text */
  strong?: TextStyle
  /** Italic text */
  emphasis?: TextStyle
  /** Strikethrough text */
  strikethrough?: TextStyle
  /** Link text */
  link?: TextStyle
  /** Inline code */
  codeInline?: TextStyle
  /** Code block text */
  codeBlock?: TextStyle
  /** Blockquote text */
  blockquote?: TextStyle
  /** List item text */
  listItem?: TextStyle
  /** Table cell text */
  tableCell?: TextStyle
  /** Table header text */
  tableHeader?: TextStyle
}

/**
 * Container styles for markdown elements
 */
export interface MarkdownContainerStyles {
  /** Document container */
  document?: ViewStyle
  /** Paragraph container */
  paragraph?: ViewStyle
  /** Blockquote container */
  blockquoteContainer?: ViewStyle
  /** Code block container */
  codeBlockContainer?: ViewStyle
  /** List container */
  list?: ViewStyle
  /** List item container */
  listItemContainer?: ViewStyle
  /** Table container */
  table?: ViewStyle
  /** Table row */
  tableRow?: ViewStyle
  /** Table cell container */
  tableCellContainer?: ViewStyle
  /** Image container */
  imageContainer?: ViewStyle
  /** Horizontal rule */
  thematicBreak?: ViewStyle
  /** Task list item checkbox */
  checkbox?: ViewStyle
  /** Checked checkbox */
  checkboxChecked?: ViewStyle
}

/**
 * Image styles
 */
export interface MarkdownImageStyles {
  /** Default image style */
  image?: ImageStyle
}

/**
 * Syntax highlighting configuration options
 */
export interface SyntaxHighlightingOptions {
  /** Enable syntax highlighting (default: true if available) */
  enabled?: boolean
  /** Theme object from react-syntax-highlighter/styles */
  theme?: object
  /** Which highlighter to use: 'hljs' or 'prism' (default: 'hljs') */
  highlighter?: 'hljs' | 'prism'
  /** Font size in pixels (default: 14) */
  fontSize?: number
  /** Font family for code text */
  fontFamily?: string
}

/**
 * Complete theme interface
 */
export interface MarkdownTheme {
  /** Text styles */
  textStyles: MarkdownTextStyles
  /** Container styles */
  containerStyles: MarkdownContainerStyles
  /** Image styles */
  imageStyles: MarkdownImageStyles
  /** Colors */
  colors: {
    /** Primary text color */
    text: string
    /** Background color */
    background: string
    /** Link color */
    link: string
    /** Code background color */
    codeBackground: string
    /** Blockquote border color */
    blockquoteBorder: string
    /** Table border color */
    tableBorder: string
    /** Horizontal rule color */
    hr: string
  }
  /** Spacing values */
  spacing: {
    /** Paragraph margin */
    paragraph: number
    /** List item indent */
    listIndent: number
    /** Code block padding */
    codeBlockPadding: number
    /** Blockquote padding */
    blockquotePadding: number
    /** Table cell padding */
    tableCellPadding: number
  }
  /** Syntax highlighting options for code blocks */
  syntaxHighlighting?: SyntaxHighlightingOptions
}

/**
 * Deep partial type for theme customization
 */
export type PartialMarkdownTheme = {
  [K in keyof MarkdownTheme]?: K extends 'syntaxHighlighting'
    ? Partial<SyntaxHighlightingOptions>
    : Partial<MarkdownTheme[K]>
}
