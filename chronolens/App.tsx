import React, { useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

import RootNavigator from "@/navigation/RootNavigator";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// On native, keep the splash screen visible while we fetch resources.
if (Platform.OS !== "web") {
  SplashScreen.preventAutoHideAsync();
}

export default function App() {
  const [appReady, setAppReady] = useState(false);

  // Initialize app and hide splash screen
  React.useEffect(() => {
    async function prepare() {
      try {
        console.log("ChronoLens App Starting...");
        // Simulate any async initialization (fonts, data, etc.)
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (e) {
        console.warn("Error during app preparation:", e);
      } finally {
        setAppReady(true);
        // Hide splash screen once ready
        if (Platform.OS !== "web") {
          SplashScreen.hideAsync();
        }
      }
    }

    prepare();
  }, []);

  if (!appReady) {
    return null;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView style={styles.root}>
            <KeyboardProvider>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
              <StatusBar style="auto" />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
