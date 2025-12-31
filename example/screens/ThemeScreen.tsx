/**
 * Theme Screen - Light/Dark theme switching demo
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MarkdownView,
  ThemeProvider,
  lightTheme,
  darkTheme,
} from 'react-native-hyper-markdown';
import type { MarkdownTheme } from 'react-native-hyper-markdown';

const sampleMarkdown = `
# Theme Demo

This screen demonstrates the **theming** capabilities of HyperMarkdown.

## Features

- 🌙 **Dark Mode**: Easy on the eyes
- ☀️ **Light Mode**: Classic reading experience
- 🎨 **Custom Theme**: Create your own!

## Code Example

\`\`\`typescript
import { ThemeProvider, darkTheme } from 'react-native-hyper-markdown'

<ThemeProvider theme={darkTheme}>
  <MarkdownView content={markdown} />
</ThemeProvider>
\`\`\`

## Blockquote

> Themes affect all markdown elements including colors, spacing, and typography.

## Table

| Property | Light | Dark |
|----------|-------|------|
| Background | #ffffff | #0d1117 |
| Text | #1a1a1a | #e6edf3 |
| Links | #0969da | #58a6ff |

---

Try switching themes above! ⬆️
`;

// Custom purple theme
const purpleTheme: MarkdownTheme = {
  ...darkTheme,
  colors: {
    ...darkTheme.colors,
    background: '#1a1025',
    text: '#e0d4f7',
    link: '#a78bfa',
    codeBackground: '#2d2040',
    blockquoteBorder: '#7c3aed',
    tableBorder: '#4c1d95',
    hr: '#6d28d9',
  },
};

type ThemeOption = 'light' | 'dark' | 'purple';

const themes: Record<ThemeOption, MarkdownTheme> = {
  light: lightTheme,
  dark: darkTheme,
  purple: purpleTheme,
};

export function ThemeScreen(): React.JSX.Element {
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>('dark');
  const theme = themes[selectedTheme];

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['bottom']}
      >
        <View style={styles.controls}>
          {(['light', 'dark', 'purple'] as ThemeOption[]).map(t => (
            <Pressable
              key={t}
              onPress={() => setSelectedTheme(t)}
              style={[
                styles.button,
                selectedTheme === t && styles.buttonActive,
                selectedTheme === t && { backgroundColor: theme.colors.link },
              ]}
            >
              <Text
                style={{
                  color: selectedTheme === t ? '#fff' : theme.colors.text,
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                }}
              >
                {t === 'light' ? '☀️ ' : t === 'dark' ? '🌙 ' : '💜 '}
                {t}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView style={styles.scrollView}>
          <MarkdownView content={sampleMarkdown} />
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
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#1e90ff',
  },
  scrollView: {
    flex: 1,
  },
});
