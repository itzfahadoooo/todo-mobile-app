import { Slot } from 'expo-router';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

// Get Convex URL from environment with fallback
const getConvexUrl = () => {
  // Try multiple ways to get the URL
  const url = 
    process.env.EXPO_PUBLIC_CONVEX_URL || 
    Constants.expoConfig?.extra?.convexUrl ||
    Constants.manifest?.extra?.convexUrl;
  
  return url;
};

const convexUrl = getConvexUrl();

// Log for debugging (will appear in expo logs)
console.log('Convex URL:', convexUrl ? 'Found' : 'Missing');

let convex: ConvexReactClient | null = null;

if (convexUrl) {
  try {
    convex = new ConvexReactClient(convexUrl, {
      unsavedChangesWarning: false,
    });
    console.log('Convex client initialized successfully');
  } catch (error) {
    console.error('Convex initialization error:', error);
  }
} else {
  console.error('EXPO_PUBLIC_CONVEX_URL is not defined');
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'JosefinSans-Regular': require('../assets/fonts/JosefinSans-Regular.ttf'),
    'JosefinSans-Bold': require('../assets/fonts/JosefinSans-Bold.ttf'),
  });

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (fontError) {
      console.error('Font loading error:', fontError);
    }
    
    // Show error after 2 seconds if no Convex URL
    if (!convexUrl) {
      const timer = setTimeout(() => setShowError(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [fontError]);

  // Show loading while fonts load
  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading TodoApp...</Text>
      </View>
    );
  }

  // Show error if Convex is not initialized
  if (!convex && showError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Configuration Error</Text>
        <Text style={styles.errorText}>
          Unable to connect to backend server.
        </Text>
        <Text style={styles.errorHint}>
          Please contact the developer.
        </Text>
        <Text style={styles.errorDebug}>
          Missing EXPO_PUBLIC_CONVEX_URL
        </Text>
      </View>
    );
  }

  // If no Convex but within timeout, show loading
  if (!convex) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Connecting to server...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ConvexProvider client={convex}>
        <ThemeProvider>
          <Slot />
        </ThemeProvider>
      </ConvexProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#EAEAEA',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    padding: 32,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#EAEAEA',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorHint: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 16,
  },
  errorDebug: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});