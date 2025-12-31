/**
 * Basic Screen - Simple markdown rendering demo
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MarkdownView,
  ThemeProvider,
  lightTheme,
  darkTheme,
  parseMarkdown,
} from 'react-native-hyper-markdown';

const sampleMarkdown = `
# 🚀 React Native Hyper Markdown

A **high-performance** markdown parser for React Native using *Nitro Modules* and md4c.

---

## 📝 Text Formatting

**Bold text** for emphasis, *italic text* for subtle emphasis, and ~~strikethrough~~ for deleted content.

## 📋 Lists

### Unordered List

- First item with some text
- Second item
- Third item with **bold** and *italic*

### Ordered List

1. First step: Install the package
2. Second step: Import components
3. Third step: Use MarkdownView

## 💬 Blockquotes

> **Note:** This is a blockquote with important information.

> 📚 **Tip:** You can customize themes and renderers!

## 🔗 Links

- [GitHub](https://github.com)
- [React Native](https://reactnative.dev)

---

That's all folks! 🎉
`;

export function BasicScreen(): React.JSX.Element {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const [parseTime, setParseTime] = useState<number | null>(null);

  useEffect(() => {
    const start = Date.now();
    const result = parseMarkdown(sampleMarkdown);
    const end = Date.now();
    setParseTime(end - start);
    console.log('Parse result:', result.success, 'nodes:', result.nodes.length);
  }, []);

  const handleLinkPress = (url: string) => {
    Alert.alert('Link Pressed', `URL: ${url}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open', onPress: () => Linking.openURL(url) },
    ]);
  };

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['bottom']}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Basic Markdown Demo
          </Text>
          {parseTime !== null && (
            <Text style={[styles.subtitle, { color: theme.colors.text }]}>
              Parsed {sampleMarkdown.length} bytes in {parseTime.toFixed(2)}ms
            </Text>
          )}
        </View>
        <ScrollView style={styles.scrollView}>
          <MarkdownView
            content={sampleMarkdown}
            onLinkPress={handleLinkPress}
          />
        </ScrollView>
      </SafeAreaView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
});
