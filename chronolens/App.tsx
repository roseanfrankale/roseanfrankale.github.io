import React, { useCallback } from "react";
import { Platform, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

import MainTabNavigator from "@/navigation/MainTabNavigator";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// On native, keep the splash screen visible while we fetch resources.
if (Platform.OS !== "web") {
  SplashScreen.preventAutoHideAsync();
}

export default function App() {
  const [fontsLoaded, fontError] = [true, null]; // Assume fonts are loaded

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      if (Platform.OS !== "web") {
        await SplashScreen.hideAsync();
      }
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <GestureHandlerRootView
          style={styles.root}
          onLayout={Platform.OS !== "web" ? onLayoutRootView : undefined}
        >
          <KeyboardProvider>
            <NavigationContainer>
              <MainTabNavigator />
            </NavigationContainer>
            <StatusBar style="auto" />
          </KeyboardProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
