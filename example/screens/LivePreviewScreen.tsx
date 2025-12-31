/**
 * Live Preview Screen - Real-time markdown editor with debouncing
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  useColorScheme,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MarkdownView,
  ThemeProvider,
  lightTheme,
  darkTheme,
  useDebouncedParsing,
} from 'react-native-hyper-markdown';

const defaultMarkdown = `# Live Preview Demo

Start typing to see **real-time** markdown rendering!

## Features

- Uses \`useDebouncedParsing\` hook
- 200ms debounce delay
- Native C++ parsing

Try editing this content...
`;

export function LivePreviewScreen(): React.JSX.Element {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const [content, setContent] = useState(defaultMarkdown);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>(
    'split',
  );

  // Use debounced parsing for live preview
  const parseResult = useDebouncedParsing(content, {}, 200);

  const renderEditor = () => (
    <View
      style={[
        styles.editorContainer,
        { flex: viewMode === 'split' ? 1 : viewMode === 'edit' ? 1 : 0 },
      ]}
    >
      {(viewMode === 'split' || viewMode === 'edit') && (
        <TextInput
          style={[
            styles.editor,
            {
              backgroundColor: theme.colors.codeBackground,
              color: theme.colors.text,
            },
          ]}
          value={content}
          onChangeText={setContent}
          multiline
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Type markdown here..."
          placeholderTextColor="#666"
        />
      )}
    </View>
  );

  const renderPreview = () => (
    <View
      style={[
        styles.previewContainer,
        { flex: viewMode === 'split' ? 1 : viewMode === 'preview' ? 1 : 0 },
      ]}
    >
      {(viewMode === 'split' || viewMode === 'preview') && (
        <ScrollView style={styles.preview}>
          {parseResult.success ? (
            <MarkdownView content="" ast={parseResult.nodes} />
          ) : (
            <Text style={{ color: '#ef4444' }}>
              Parse error: {parseResult.error?.message}
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['bottom']}
      >
        <View style={styles.controls}>
          {(['edit', 'split', 'preview'] as const).map(mode => (
            <Pressable
              key={mode}
              onPress={() => setViewMode(mode)}
              style={[styles.button, viewMode === mode && styles.buttonActive]}
            >
              <Text
                style={{
                  color: viewMode === mode ? '#fff' : theme.colors.text,
                  fontWeight: '600',
                  fontSize: 12,
                }}
              >
                {mode === 'edit'
                  ? '📝 Edit'
                  : mode === 'preview'
                    ? '👁️ Preview'
                    : '⚡ Split'}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.stats}>
          <Text style={[styles.statsText, { color: theme.colors.text }]}>
            {content.length} chars •{' '}
            {parseResult.success ? parseResult.nodes.length : 0} nodes
          </Text>
        </View>

        <View style={styles.content}>
          {renderEditor()}
          {viewMode === 'split' && (
            <View
              style={[styles.divider, { backgroundColor: theme.colors.hr }]}
            />
          )}
          {renderPreview()}
        </View>
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
    paddingVertical: 8,
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#374151',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#6366f1',
  },
  stats: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  statsText: {
    fontSize: 12,
    opacity: 0.6,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  },
  editorContainer: {
    minHeight: 100,
  },
  editor: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    fontFamily: 'monospace',
    textAlignVertical: 'top',
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  previewContainer: {
    minHeight: 100,
  },
  preview: {
    flex: 1,
    padding: 16,
  },
});
