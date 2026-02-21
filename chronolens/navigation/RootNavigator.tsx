import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { ActivityIndicator, View, StyleSheet } from "react-native";

// Import Navigators & Screens
import AuthStackNavigator from "@/navigation/AuthStackNavigator";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import OnboardingScreen from "@/screens/OnboardingScreen";

export type RootStackParamList = {
  Auth: undefined;
  Onboarding: undefined;
  Main: undefined;
  Loading: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, isLoading, hasCompletedOnboarding } = useAuth();
  const { theme } = useTheme();

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        // User is NOT logged in → Show Auth Stack (Login/Signup)
        <Stack.Screen
          name="Auth"
          component={AuthStackNavigator}
          options={{ animationEnabled: false }}
        />
      ) : !hasCompletedOnboarding ? (
        // User IS logged in but hasn't completed onboarding
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ animationEnabled: false }}
        />
      ) : (
        // User IS logged in AND has completed onboarding → Show Main App
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{ animationEnabled: false }}
        />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
