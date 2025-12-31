/**
 * Tables Screen - GFM table support with alignment
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MarkdownView,
  ThemeProvider,
  lightTheme,
  darkTheme,
} from 'react-native-hyper-markdown';

const tablesMarkdown = `
# Tables Demo

HyperMarkdown supports **GitHub Flavored Markdown** tables with full alignment control.

---

## Basic Table

| Name | Role | Status |
|------|------|--------|
| Alice | Developer | Active |
| Bob | Designer | Active |
| Carol | Manager | Away |

---

## Column Alignment

| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Left 1 | Center 1 | Right 1 |
| Left 2 | Center 2 | Right 2 |
| Left 3 | Center 3 | Right 3 |

---

## Feature Comparison

| Feature | Basic | Pro | Enterprise |
|:--------|:-----:|:---:|:----------:|
| Users | 1 | 10 | Unlimited |
| Storage | 1GB | 10GB | 100GB |
| Support | Email | Priority | Dedicated |
| Price | Free | $9/mo | $99/mo |

---

## Mixed Content

Tables can contain **formatted** text:

| Element | Syntax | Output |
|---------|--------|--------|
| Bold | \`**text**\` | **bold** |
| Italic | \`*text*\` | *italic* |
| Strike | \`~~text~~\` | ~~strike~~ |
| Code | \`\\\`code\\\`\` | \`code\` |

---

## Emoji Table

| Category | Examples |
|----------|----------|
| Smileys | 😀 😊 🥰 😎 🤩 |
| Animals | 🐶 🐱 🦊 🐼 🦁 |
| Food | 🍎 🍕 🍔 🍦 🎂 |
| Activities | ⚽ 🎮 🎸 🎨 📚 |

---

Tables are great for organizing data! 📊
`;

export function TablesScreen(): React.JSX.Element {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['bottom']}
      >
        <View style={styles.header}>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            GFM table support with left/center/right alignment
          </Text>
        </View>
        <ScrollView style={styles.scrollView}>
          <MarkdownView content={tablesMarkdown} />
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
    paddingVertical: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
});
