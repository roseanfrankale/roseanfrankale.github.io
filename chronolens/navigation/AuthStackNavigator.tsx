import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OnboardingWelcomeScreen from "@/screens/OnboardingWelcomeScreen";
import LoginScreen from "@/screens/LoginScreen";
import OnboardingProfileSetupScreen from "@/screens/OnboardingProfileSetupScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type AuthStackParamList = {
  OnboardingWelcome: undefined;
  Login: undefined;
  OnboardingProfileSetup: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="OnboardingWelcome"
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
        headerShown: false,
      }}
    >
      <Stack.Screen name="OnboardingWelcome" component={OnboardingWelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OnboardingProfileSetup" component={OnboardingProfileSetupScreen} />
    </Stack.Navigator>
  );
}
