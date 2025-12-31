// Light theme for react-native-hyper-markdown
import type { MarkdownTheme } from '../types/theme'

export const lightTheme: MarkdownTheme = {
  textStyles: {
    text: {
      fontSize: 16,
      lineHeight: 24,
      color: '#1a1a1a',
    },
    heading1: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 40,
      color: '#1a1a1a',
      marginBottom: 16,
    },
    heading2: {
      fontSize: 28,
      fontWeight: 'bold',
      lineHeight: 36,
      color: '#1a1a1a',
      marginBottom: 14,
    },
    heading3: {
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 32,
      color: '#1a1a1a',
      marginBottom: 12,
    },
    heading4: {
      fontSize: 20,
      fontWeight: 'bold',
      lineHeight: 28,
      color: '#1a1a1a',
      marginBottom: 10,
    },
    heading5: {
      fontSize: 18,
      fontWeight: 'bold',
      lineHeight: 26,
      color: '#1a1a1a',
      marginBottom: 8,
    },
    heading6: {
      fontSize: 16,
      fontWeight: 'bold',
      lineHeight: 24,
      color: '#1a1a1a',
      marginBottom: 6,
    },
    strong: {
      fontWeight: 'bold',
    },
    emphasis: {
      fontStyle: 'italic',
    },
    strikethrough: {
      textDecorationLine: 'line-through',
    },
    link: {
      color: '#0969da',
      textDecorationLine: 'underline',
    },
    codeInline: {
      fontFamily: 'monospace',
      backgroundColor: '#f6f8fa',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      fontSize: 14,
    },
    codeBlock: {
      fontFamily: 'monospace',
      fontSize: 14,
      lineHeight: 20,
      color: '#1a1a1a',
    },
    blockquote: {
      color: '#656d76',
      fontStyle: 'italic',
    },
    listItem: {
      fontSize: 16,
      lineHeight: 24,
      color: '#1a1a1a',
    },
    tableCell: {
      fontSize: 14,
      color: '#1a1a1a',
    },
    tableHeader: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#1a1a1a',
    },
  },
  containerStyles: {
    document: {
      padding: 16,
    },
    paragraph: {
      marginBottom: 16,
    },
    blockquoteContainer: {
      borderLeftWidth: 4,
      borderLeftColor: '#d0d7de',
      paddingLeft: 16,
      marginBottom: 16,
    },
    codeBlockContainer: {
      backgroundColor: '#f6f8fa',
      padding: 16,
      borderRadius: 6,
      marginBottom: 16,
      overflow: 'hidden',
    },
    list: {
      marginBottom: 16,
    },
    listItemContainer: {
      flexDirection: 'row',
      marginBottom: 4,
    },
    table: {
      borderWidth: 1,
      borderColor: '#d0d7de',
      borderRadius: 6,
      marginBottom: 16,
      overflow: 'hidden',
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#d0d7de',
    },
    tableCellContainer: {
      padding: 8,
      borderRightWidth: 1,
      borderRightColor: '#d0d7de',
      flex: 1,
    },
    imageContainer: {
      marginBottom: 16,
    },
    thematicBreak: {
      height: 1,
      backgroundColor: '#d0d7de',
      marginVertical: 24,
    },
    checkbox: {
      width: 16,
      height: 16,
      borderWidth: 1,
      borderColor: '#d0d7de',
      borderRadius: 3,
      marginRight: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: {
      backgroundColor: '#0969da',
      borderColor: '#0969da',
    },
  },
  imageStyles: {
    image: {
      maxWidth: '100%',
      height: 'auto',
    },
  },
  colors: {
    text: '#1a1a1a',
    background: '#ffffff',
    link: '#0969da',
    codeBackground: '#f6f8fa',
    blockquoteBorder: '#d0d7de',
    tableBorder: '#d0d7de',
    hr: '#d0d7de',
  },
  spacing: {
    paragraph: 16,
    listIndent: 24,
    codeBlockPadding: 16,
    blockquotePadding: 16,
    tableCellPadding: 8,
  },
}
