/**
 * Images Screen - Image rendering with press events
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MarkdownView,
  ThemeProvider,
  lightTheme,
  darkTheme,
} from 'react-native-hyper-markdown';

const imagesMarkdown = `
# Images Demo

HyperMarkdown renders **remote images** with loading states and press handling.

---

## Landscape Images

![Mountain Landscape](https://picsum.photos/seed/mountain/600/300)

![Ocean View](https://picsum.photos/seed/ocean/600/300)

---

## Square Images

![Nature](https://picsum.photos/seed/nature/400/400)

![Architecture](https://picsum.photos/seed/architecture/400/400)

---

## Portrait Images

![City Portrait](https://picsum.photos/seed/city/300/500)

---

## Multiple Images in Sequence

![Image 1](https://picsum.photos/seed/img1/300/200)

![Image 2](https://picsum.photos/seed/img2/300/200)

![Image 3](https://picsum.photos/seed/img3/300/200)

---

## Alt Text Examples

Images have alt text for accessibility:

![A beautiful sunset over the mountains](https://picsum.photos/seed/sunset/500/300)

![Coffee cup on a wooden table](https://picsum.photos/seed/coffee/500/300)

---

Tap any image to see its details! 👆
`;

export function ImagesScreen(): React.JSX.Element {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  const handleImagePress = (src: string, alt?: string) => {
    Alert.alert(
      'Image Pressed',
      `Alt: ${alt ?? 'No alt text'}\n\nURL: ${src}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open URL', onPress: () => Linking.openURL(src) },
      ],
    );
  };

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['bottom']}
      >
        <View style={styles.header}>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            Tap images to see press event handling
          </Text>
        </View>
        <ScrollView style={styles.scrollView}>
          <MarkdownView
            content={imagesMarkdown}
            onImagePress={handleImagePress}
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
