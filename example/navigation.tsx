/**
 * Navigation configuration for the example app
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';

import { HomeScreen } from './screens/HomeScreen';
import { BasicScreen } from './screens/BasicScreen';
import { ThemeScreen } from './screens/ThemeScreen';
import { CustomRenderersScreen } from './screens/CustomRenderersScreen';
import { LivePreviewScreen } from './screens/LivePreviewScreen';
import { PerformanceScreen } from './screens/PerformanceScreen';
import { TablesScreen } from './screens/TablesScreen';
import { TaskListScreen } from './screens/TaskListScreen';
import { CodeBlocksScreen } from './screens/CodeBlocksScreen';
import { ImagesScreen } from './screens/ImagesScreen';

export type RootStackParamList = {
  Home: undefined;
  Basic: undefined;
  Theme: undefined;
  CustomRenderers: undefined;
  LivePreview: undefined;
  Performance: undefined;
  Tables: undefined;
  TaskList: undefined;
  CodeBlocks: undefined;
  Images: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Navigation(): React.JSX.Element {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
          },
          headerTintColor: isDark ? '#ffffff' : '#000000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: isDark ? '#0d1117' : '#ffffff',
          },
          headerBackButtonDisplayMode: 'generic',
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'HyperMarkdown Examples' }}
        />
        <Stack.Screen
          name="Basic"
          component={BasicScreen}
          options={{ title: 'Basic Rendering' }}
        />
        <Stack.Screen
          name="Theme"
          component={ThemeScreen}
          options={{ title: 'Theming' }}
        />
        <Stack.Screen
          name="CustomRenderers"
          component={CustomRenderersScreen}
          options={{ title: 'Custom Renderers' }}
        />
        <Stack.Screen
          name="LivePreview"
          component={LivePreviewScreen}
          options={{ title: 'Live Preview' }}
        />
        <Stack.Screen
          name="Performance"
          component={PerformanceScreen}
          options={{ title: 'Performance' }}
        />
        <Stack.Screen
          name="Tables"
          component={TablesScreen}
          options={{ title: 'Tables' }}
        />
        <Stack.Screen
          name="TaskList"
          component={TaskListScreen}
          options={{ title: 'Task Lists' }}
        />
        <Stack.Screen
          name="CodeBlocks"
          component={CodeBlocksScreen}
          options={{ title: 'Code Blocks' }}
        />
        <Stack.Screen
          name="Images"
          component={ImagesScreen}
          options={{ title: 'Images' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
