// Dark theme for react-native-hyper-markdown
import type { MarkdownTheme } from '../types/theme'

export const darkTheme: MarkdownTheme = {
  textStyles: {
    text: {
      fontSize: 16,
      lineHeight: 24,
      color: '#e6edf3',
    },
    heading1: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 40,
      color: '#e6edf3',
      marginBottom: 16,
    },
    heading2: {
      fontSize: 28,
      fontWeight: 'bold',
      lineHeight: 36,
      color: '#e6edf3',
      marginBottom: 14,
    },
    heading3: {
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 32,
      color: '#e6edf3',
      marginBottom: 12,
    },
    heading4: {
      fontSize: 20,
      fontWeight: 'bold',
      lineHeight: 28,
      color: '#e6edf3',
      marginBottom: 10,
    },
    heading5: {
      fontSize: 18,
      fontWeight: 'bold',
      lineHeight: 26,
      color: '#e6edf3',
      marginBottom: 8,
    },
    heading6: {
      fontSize: 16,
      fontWeight: 'bold',
      lineHeight: 24,
      color: '#e6edf3',
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
      color: '#58a6ff',
      textDecorationLine: 'underline',
    },
    codeInline: {
      fontFamily: 'monospace',
      backgroundColor: '#343942',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      fontSize: 14,
      color: '#e6edf3',
    },
    codeBlock: {
      fontFamily: 'monospace',
      fontSize: 14,
      lineHeight: 20,
      color: '#e6edf3',
    },
    blockquote: {
      color: '#8b949e',
      fontStyle: 'italic',
    },
    listItem: {
      fontSize: 16,
      lineHeight: 24,
      color: '#e6edf3',
    },
    tableCell: {
      fontSize: 14,
      color: '#e6edf3',
    },
    tableHeader: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#e6edf3',
    },
  },
  containerStyles: {
    document: {
      padding: 16,
      backgroundColor: '#0d1117',
    },
    paragraph: {
      marginBottom: 16,
    },
    blockquoteContainer: {
      borderLeftWidth: 4,
      borderLeftColor: '#3d444d',
      paddingLeft: 16,
      marginBottom: 16,
    },
    codeBlockContainer: {
      backgroundColor: '#161b22',
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
      borderColor: '#3d444d',
      borderRadius: 6,
      marginBottom: 16,
      overflow: 'hidden',
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#3d444d',
    },
    tableCellContainer: {
      padding: 8,
      borderRightWidth: 1,
      borderRightColor: '#3d444d',
      flex: 1,
    },
    imageContainer: {
      marginBottom: 16,
    },
    thematicBreak: {
      height: 1,
      backgroundColor: '#3d444d',
      marginVertical: 24,
    },
    checkbox: {
      width: 16,
      height: 16,
      borderWidth: 1,
      borderColor: '#3d444d',
      borderRadius: 3,
      marginRight: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: {
      backgroundColor: '#58a6ff',
      borderColor: '#58a6ff',
    },
  },
  imageStyles: {
    image: {
      maxWidth: '100%',
      height: 'auto',
    },
  },
  colors: {
    text: '#e6edf3',
    background: '#0d1117',
    link: '#58a6ff',
    codeBackground: '#161b22',
    blockquoteBorder: '#3d444d',
    tableBorder: '#3d444d',
    hr: '#3d444d',
  },
  spacing: {
    paragraph: 16,
    listIndent: 24,
    codeBlockPadding: 16,
    blockquotePadding: 16,
    tableCellPadding: 8,
  },
}
