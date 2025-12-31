/**
 * Performance Screen - Large documents & parse benchmarks
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
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

// Generate large markdown content
const generateLargeContent = (paragraphs: number): string => {
  const sections = [];
  for (let i = 1; i <= paragraphs; i++) {
    sections.push(`
## Section ${i}

This is paragraph ${i} with **bold text**, *italic text*, and a [link](https://example.com).

- List item 1 for section ${i}
- List item 2 with \`inline code\`
- List item 3 with ~~strikethrough~~

> Blockquote for section ${i}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.

\`\`\`javascript
function section${i}() {
  return "Section ${i} code";
}
\`\`\`
`);
  }
  return `# Performance Test\n\nDocument with ${paragraphs} sections.\n\n---\n${sections.join('\n---\n')}`;
};

type BenchmarkResult = {
  size: number;
  bytes: number;
  parseTime: number;
  nodes: number;
};

export function PerformanceScreen(): React.JSX.Element {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const [content, setContent] = useState('');
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runBenchmark = useCallback(async () => {
    setIsRunning(true);
    setResults([]);
    setContent('');

    const sizes = [5, 10, 25, 50, 100];
    const newResults: BenchmarkResult[] = [];

    for (const size of sizes) {
      const markdown = generateLargeContent(size);

      // Warm up
      parseMarkdown(markdown);

      // Measure
      const start = Date.now();
      const result = parseMarkdown(markdown);
      const end = Date.now();

      newResults.push({
        size,
        bytes: markdown.length,
        parseTime: end - start,
        nodes: result.success ? result.nodes.length : 0,
      });

      setResults([...newResults]);

      // Small delay for UI update
      await new Promise<void>(resolve => setTimeout(resolve, 100));
    }

    // Show the largest content
    setContent(generateLargeContent(50));
    setIsRunning(false);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['bottom']}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Parse Performance Benchmarks
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            Native C++ parsing with md4c
          </Text>
        </View>

        <Pressable
          onPress={runBenchmark}
          disabled={isRunning}
          style={[styles.runButton, isRunning && styles.runButtonDisabled]}
        >
          <Text style={styles.runButtonText}>
            {isRunning ? '⏳ Running...' : '🚀 Run Benchmark'}
          </Text>
        </Pressable>

        {results.length > 0 && (
          <View
            style={[
              styles.resultsTable,
              { borderColor: theme.colors.tableBorder },
            ]}
          >
            <View
              style={[
                styles.tableRow,
                styles.tableHeader,
                { backgroundColor: theme.colors.codeBackground },
              ]}
            >
              <Text
                style={[
                  styles.tableCell,
                  styles.headerText,
                  { color: theme.colors.text },
                ]}
              >
                Sections
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.headerText,
                  { color: theme.colors.text },
                ]}
              >
                Size
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.headerText,
                  { color: theme.colors.text },
                ]}
              >
                Time
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.headerText,
                  { color: theme.colors.text },
                ]}
              >
                Nodes
              </Text>
            </View>
            {results.map(r => (
              <View
                key={r.size}
                style={[
                  styles.tableRow,
                  { borderColor: theme.colors.tableBorder },
                ]}
              >
                <Text style={[styles.tableCell, { color: theme.colors.text }]}>
                  {r.size}
                </Text>
                <Text style={[styles.tableCell, { color: theme.colors.text }]}>
                  {formatBytes(r.bytes)}
                </Text>
                <Text style={[styles.tableCell, { color: '#10b981' }]}>
                  {r.parseTime.toFixed(2)}ms
                </Text>
                <Text style={[styles.tableCell, { color: theme.colors.text }]}>
                  {r.nodes}
                </Text>
              </View>
            ))}
          </View>
        )}

        {content && (
          <ScrollView style={styles.content}>
            <Text style={[styles.contentHeader, { color: theme.colors.text }]}>
              Preview (50 sections)
            </Text>
            <MarkdownView content={content} />
          </ScrollView>
        )}
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
    paddingTop: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  runButton: {
    margin: 16,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#6366f1',
    alignItems: 'center',
  },
  runButtonDisabled: {
    backgroundColor: '#4b5563',
  },
  runButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultsTable: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tableHeader: {
    paddingVertical: 10,
  },
  tableCell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 13,
    textAlign: 'center',
  },
  headerText: {
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    marginTop: 16,
  },
  contentHeader: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
});
