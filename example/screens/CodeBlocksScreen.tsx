/**
 * Code Blocks Screen - Multi-language code highlighting with theme options
 */
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MarkdownView,
  ThemeProvider,
  lightTheme,
  darkTheme,
  type MarkdownTheme,
} from 'react-native-hyper-markdown';

// Import syntax highlighter themes
import {
  atomOneDark,
  atomOneLight,
  github,
  monokai,
  vs2015,
  dracula,
} from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Theme options for the picker
const syntaxThemes = {
  atomOneDark: { name: 'Atom One Dark', style: atomOneDark },
  atomOneLight: { name: 'Atom One Light', style: atomOneLight },
  github: { name: 'GitHub', style: github },
  monokai: { name: 'Monokai', style: monokai },
  vs2015: { name: 'VS 2015', style: vs2015 },
  dracula: { name: 'Dracula', style: dracula },
  none: { name: 'No Highlighting', style: undefined },
} as const;

type SyntaxThemeKey = keyof typeof syntaxThemes;

const codeBlocksMarkdown = `
# Syntax Highlighting Demo

This demo showcases **syntax highlighting** with customizable themes.

---

## JavaScript

\`\`\`javascript
import { MarkdownView } from 'react-native-hyper-markdown'

function App() {
  const markdown = "# Hello World"
  const handlePress = (url) => {
    console.log('Link pressed:', url)
  }
  
  return (
    <MarkdownView 
      content={markdown}
      onLinkPress={handlePress}
    />
  )
}

export default App
\`\`\`

---

## TypeScript

\`\`\`typescript
interface MarkdownProps {
  content: string
  theme?: MarkdownTheme
  onLinkPress?: (url: string) => void
}

const MarkdownRenderer: React.FC<MarkdownProps> = ({
  content,
  theme,
  onLinkPress,
}) => {
  return (
    <MarkdownView
      content={content}
      theme={theme}
      onLinkPress={onLinkPress}
    />
  )
}
\`\`\`

---

## Python

\`\`\`python
def parse_markdown(content: str) -> dict:
    """Parse markdown content and return AST."""
    import markdown
    
    md = markdown.Markdown(extensions=['tables', 'fenced_code'])
    html = md.convert(content)
    
    return {
        'html': html,
        'toc': md.toc
    }

# Usage
result = parse_markdown("# Hello")
print(result['html'])
\`\`\`

---

## JSON

\`\`\`json
{
  "name": "react-native-hyper-markdown",
  "version": "1.0.0",
  "features": {
    "syntaxHighlighting": true,
    "themes": ["light", "dark"],
    "languages": ["js", "ts", "python", "json"]
  }
}
\`\`\`

---

## Shell

\`\`\`bash
# Install the package
npm install react-native-hyper-markdown

# Optional: Add syntax highlighting support
npm install react-syntax-highlighter

# Run the app
npm run ios
\`\`\`

---

## Inline Code

Use \`npm install\` to install packages. Variables like \`const theme = darkTheme\` work inline too!
`;

export function CodeBlocksScreen(): React.JSX.Element {
  const colorScheme = useColorScheme();
  const baseTheme = colorScheme === 'dark' ? darkTheme : lightTheme;

  const [syntaxThemeKey, setSyntaxThemeKey] =
    useState<SyntaxThemeKey>('atomOneDark');
  const [fontSize, setFontSize] = useState(14);

  // Create theme with syntax highlighting options
  const theme: MarkdownTheme = useMemo(
    () => ({
      ...baseTheme,
      syntaxHighlighting:
        syntaxThemeKey === 'none'
          ? { enabled: false }
          : {
              enabled: true,
              theme: syntaxThemes[syntaxThemeKey].style,
              fontSize,
              highlighter: 'hljs',
            },
    }),
    [baseTheme, syntaxThemeKey, fontSize],
  );

  const themeKeys = Object.keys(syntaxThemes) as SyntaxThemeKey[];

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['bottom']}
      >
        {/* Controls */}
        <View style={styles.controls}>
          <Text style={[styles.controlLabel, { color: theme.colors.text }]}>
            Syntax Theme:
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.themeScroll}
          >
            {themeKeys.map(key => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.themeButton,
                  syntaxThemeKey === key && styles.themeButtonActive,
                ]}
                onPress={() => setSyntaxThemeKey(key)}
              >
                <Text
                  style={[
                    styles.themeButtonText,
                    syntaxThemeKey === key && styles.themeButtonTextActive,
                  ]}
                >
                  {syntaxThemes[key].name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Font Size Controls */}
          <View style={styles.fontSizeRow}>
            <Text style={[styles.controlLabel, { color: theme.colors.text }]}>
              Font Size: {fontSize}px
            </Text>
            <View style={styles.fontSizeButtons}>
              <TouchableOpacity
                style={styles.fontButton}
                onPress={() => setFontSize(s => Math.max(10, s - 2))}
              >
                <Text style={styles.fontButtonText}>A-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.fontButton}
                onPress={() => setFontSize(s => Math.min(24, s + 2))}
              >
                <Text style={styles.fontButtonText}>A+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Markdown Content */}
        <ScrollView style={styles.scrollView}>
          <MarkdownView content={codeBlocksMarkdown} />
        </ScrollView>
      </SafeAreaView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controls: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  themeScroll: {
    marginBottom: 12,
  },
  themeButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(128, 128, 128, 0.15)',
    marginRight: 8,
  },
  themeButtonActive: {
    backgroundColor: '#007AFF',
  },
  themeButtonText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  themeButtonTextActive: {
    color: '#FFF',
  },
  fontSizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fontSizeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  fontButton: {
    width: 40,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  scrollView: {
    flex: 1,
  },
});
