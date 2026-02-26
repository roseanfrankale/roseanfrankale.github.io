import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

import RootNavigator from "@/navigation/RootNavigator";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useTheme } from "@/hooks/useTheme";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function AppShell() {
  const { theme, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === "web" && width >= 768;

  return (
    <GestureHandlerRootView
      style={[styles.root, { backgroundColor: theme.backgroundDefault }]}
    >
      <View
        style={[
          styles.appFrame,
          isDesktopWeb && {
            maxWidth: 500,
            width: "100%",
            alignSelf: "center",
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.backgroundDefault,
          },
        ]}
      >
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </View>
      <StatusBar
        style={isDark ? "light" : "dark"}
        backgroundColor={theme.backgroundDefault}
      />
    </GestureHandlerRootView>
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load custom fonts
        await Font.loadAsync({
          "Cinzel-Regular": require("./assets/fonts/Cinzel-Regular.ttf"),
          "JetBrainsMono-Regular": require("./assets/fonts/JetBrainsMono-Regular.ttf"),
          "JetBrainsMono-Bold": require("./assets/fonts/JetBrainsMono-Bold.ttf"),
          "SpaceMono-Regular": require("./assets/fonts/SpaceMono-Regular.ttf"),
        });

        // Perform any other app initialization here
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (e) {
        console.warn("Error loading fonts:", e);
        console.warn(
          "App will use system fonts. See assets/fonts/README.md for setup instructions.",
        );
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <SafeAreaProvider>
            <AppShell />
          </SafeAreaProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  appFrame: {
    flex: 1,
  },
});
