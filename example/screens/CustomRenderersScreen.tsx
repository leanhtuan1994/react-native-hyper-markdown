/**
 * Custom Renderers Screen - Override default element renderers
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  useColorScheme,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MarkdownView,
  ThemeProvider,
  lightTheme,
  darkTheme,
} from 'react-native-hyper-markdown';
import type {
  CustomRenderers,
  RenderContext,
  MarkdownNode,
} from 'react-native-hyper-markdown';

const testMarkdown = `
# Custom Heading Style

This paragraph demonstrates **custom bold** and *custom italic* rendering.

## Subsection

Here's a [custom link](https://example.com) that will show a custom style.

### Code Example

\`\`\`typescript
function example() {
  return "custom renderer";
}
\`\`\`

- Item 1 with **bold**
- Item 2 with *italic*
- Item 3 with ~~strikethrough~~

---

> This blockquote will have custom styling

Final paragraph with mixed formatting: **bold**, *italic*, and [links](https://example.com).
`;

export function CustomRenderersScreen(): React.JSX.Element {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const [renderMode, setRenderMode] = useState<'default' | 'custom'>('default');

  // Custom renderers with enhanced styling
  const customRenderers: CustomRenderers = {
    heading: (node: MarkdownNode, key: string | number, ctx: RenderContext) => (
      <View
        key={key}
        style={{
          backgroundColor: '#6366f1',
          paddingHorizontal: 12,
          paddingVertical: 8,
          marginVertical: 12,
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 24 - (node.level || 1) * 2,
            fontWeight: 'bold',
          }}
        >
          ✨{' '}
          {node.children?.map((child, i) =>
            ctx.renderNode(child, `${key}-${i}`),
          )}
        </Text>
      </View>
    ),

    strong: (node: MarkdownNode, key: string | number, ctx: RenderContext) => (
      <Text key={key} style={{ color: '#f43f5e', fontWeight: 'bold' }}>
        {node.children?.map((child, i) => ctx.renderNode(child, `${key}-${i}`))}
      </Text>
    ),

    emphasis: (
      node: MarkdownNode,
      key: string | number,
      ctx: RenderContext,
    ) => (
      <Text key={key} style={{ color: '#10b981', fontStyle: 'italic' }}>
        {node.children?.map((child, i) => ctx.renderNode(child, `${key}-${i}`))}
      </Text>
    ),

    link: (node: MarkdownNode, key: string | number, ctx: RenderContext) => (
      <Text
        key={key}
        style={{
          color: '#f59e0b',
          textDecorationLine: 'underline',
          fontWeight: '600',
        }}
        onPress={() => {
          Alert.alert('Link Pressed', `URL: ${node.href}`);
        }}
      >
        🔗{' '}
        {node.children?.map((child, i) => ctx.renderNode(child, `${key}-${i}`))}
      </Text>
    ),

    blockquote: (
      node: MarkdownNode,
      key: string | number,
      ctx: RenderContext,
    ) => (
      <View
        key={key}
        style={{
          borderLeftWidth: 4,
          borderLeftColor: '#8b5cf6',
          paddingLeft: 12,
          paddingVertical: 8,
          marginVertical: 8,
          backgroundColor: '#8b5cf620',
          borderRadius: 4,
        }}
      >
        <Text
          style={{
            color: theme.colors.text,
            fontStyle: 'italic',
            opacity: 0.9,
          }}
        >
          {node.children?.map((child, i) =>
            ctx.renderNode(child, `${key}-${i}`),
          )}
        </Text>
      </View>
    ),
  };

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['bottom']}
      >
        <View style={styles.header}>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            Toggle to see custom vs default rendering
          </Text>
        </View>

        <View style={styles.controls}>
          <Pressable
            onPress={() => setRenderMode('default')}
            style={[
              styles.button,
              renderMode === 'default' && styles.buttonActive,
            ]}
          >
            <Text
              style={{
                color: renderMode === 'default' ? '#fff' : theme.colors.text,
                fontWeight: 'bold',
              }}
            >
              Default
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setRenderMode('custom')}
            style={[
              styles.button,
              renderMode === 'custom' && styles.buttonActive,
            ]}
          >
            <Text
              style={{
                color: renderMode === 'custom' ? '#fff' : theme.colors.text,
                fontWeight: 'bold',
              }}
            >
              Custom ✨
            </Text>
          </Pressable>
        </View>

        <ScrollView style={styles.scrollView}>
          <MarkdownView
            content={testMarkdown}
            customRenderers={
              renderMode === 'custom' ? customRenderers : undefined
            }
            onLinkPress={url => {
              Alert.alert('Link Pressed', `URL: ${url}`);
            }}
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
    paddingTop: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
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
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#374151',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#6366f1',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
