/**
 * Task List Screen - Interactive checkbox task lists
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MarkdownView,
  ThemeProvider,
  lightTheme,
  darkTheme,
} from 'react-native-hyper-markdown';

const initialMarkdown = `
# Task List Demo

HyperMarkdown supports **interactive task lists** with checkbox toggling.

---

## Project Setup

- [x] Initialize React Native project
- [x] Install dependencies
- [ ] Configure Metro bundler
- [ ] Set up TypeScript

## Feature Implementation

- [x] Basic markdown parsing
- [x] Text formatting
- [x] Lists support
- [ ] Table rendering
- [ ] Image handling

## Testing

- [ ] Write unit tests
- [ ] Add integration tests
- [ ] Performance testing
- [ ] Accessibility audit

## Documentation

- [x] README
- [ ] API reference
- [ ] Examples
- [ ] Migration guide

---

Tap checkboxes to toggle! ☝️
`;

export function TaskListScreen(): React.JSX.Element {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [toggleCount, setToggleCount] = useState(0);

  const handleCheckboxToggle = useCallback((checked: boolean) => {
    setToggleCount(prev => prev + 1);
    Alert.alert(
      'Checkbox Toggled',
      `New state: ${checked ? '✅ Checked' : '⬜ Unchecked'}\n\nIn a real app, you would update your state here.`,
      [{ text: 'OK' }],
    );
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['bottom']}
      >
        <View style={styles.header}>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            Tap checkboxes to interact with task lists
          </Text>
          <Text style={[styles.stats, { color: theme.colors.link }]}>
            Toggle count: {toggleCount}
          </Text>
        </View>
        <ScrollView style={styles.scrollView}>
          <MarkdownView
            content={markdown}
            onCheckboxToggle={handleCheckboxToggle}
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
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  stats: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
});
