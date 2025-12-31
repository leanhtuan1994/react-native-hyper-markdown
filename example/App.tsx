/**
 * Example App - React Native Hyper Markdown Demo
 *
 * This example app showcases all the features of react-native-hyper-markdown
 * through multiple demo screens.
 */
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Navigation } from './navigation';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <Navigation />
    </SafeAreaProvider>
  );
}

export default App;
