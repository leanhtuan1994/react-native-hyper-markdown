/**
 * Home Screen - Navigation hub with demo cards
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const demos = [
  {
    key: 'Basic',
    title: '📝 Basic Rendering',
    description: 'Simple markdown rendering with all elements',
  },
  {
    key: 'Theme',
    title: '🎨 Theming',
    description: 'Light/Dark theme switching demo',
  },
  {
    key: 'CustomRenderers',
    title: '🔧 Custom Renderers',
    description: 'Override default element renderers',
  },
  {
    key: 'LivePreview',
    title: '✨ Live Preview',
    description: 'Real-time markdown editor with debouncing',
  },
  {
    key: 'Performance',
    title: '⚡ Performance',
    description: 'Large documents & parse benchmarks',
  },
  {
    key: 'Tables',
    title: '📊 Tables',
    description: 'GFM table support with alignment',
  },
  {
    key: 'TaskList',
    title: '☑️ Task Lists',
    description: 'Interactive checkbox task lists',
  },
  {
    key: 'CodeBlocks',
    title: '💻 Code Blocks',
    description: 'Multi-language code highlighting',
  },
  {
    key: 'Images',
    title: '🖼️ Images',
    description: 'Image rendering with press events',
  },
] as const;

export function HomeScreen({ navigation }: HomeScreenProps): React.JSX.Element {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const styles = createStyles(isDark);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>React Native Hyper Markdown</Text>
        <Text style={styles.subheader}>
          High-performance markdown parser with Nitro Modules
        </Text>

        <View style={styles.grid}>
          {demos.map(demo => (
            <Pressable
              key={demo.key}
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
              onPress={() =>
                navigation.navigate(demo.key as keyof RootStackParamList)
              }
            >
              <Text style={styles.cardTitle}>{demo.title}</Text>
              <Text style={styles.cardDescription}>{demo.description}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#0d1117' : '#f5f5f5',
    },
    scrollContent: {
      padding: 16,
    },
    header: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDark ? '#e6edf3' : '#1a1a1a',
      marginBottom: 8,
    },
    subheader: {
      fontSize: 16,
      color: isDark ? '#8b949e' : '#666666',
      marginBottom: 24,
    },
    grid: {
      gap: 12,
    },
    card: {
      backgroundColor: isDark ? '#161b22' : '#ffffff',
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? '#30363d' : '#e0e0e0',
    },
    cardPressed: {
      opacity: 0.7,
      transform: [{ scale: 0.98 }],
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#e6edf3' : '#1a1a1a',
      marginBottom: 4,
    },
    cardDescription: {
      fontSize: 14,
      color: isDark ? '#8b949e' : '#666666',
    },
  });
