import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/navigation/AuthStackNavigator";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { Spacing } from "@/constants/theme";

const { width } = Dimensions.get("window");

export default function OnboardingWelcomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { theme } = useTheme();
  const { paddingTop, paddingBottom } = useScreenInsets();

  const handleGetStarted = () => {
    navigation.navigate("Login");
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.content, { paddingTop, paddingBottom }]}>
        <View style={styles.illustrationContainer}>
          <ThemedText type="h1" style={styles.placeholderIllustration}>
            📸
          </ThemedText>
        </View>

        <View style={styles.textContainer}>
          <ThemedText type="h1" style={styles.title}>
            Preserve your memories across time
          </ThemedText>
          <ThemedText type="body" style={[styles.description, { color: theme.textSecondary }]}>
            ChronoLens helps you organize, archive, and rediscover your photos with intelligent timeline organization and community sharing.
          </ThemedText>
        </View>

        <View style={styles.actions}>
          <Button onPress={handleGetStarted} style={styles.primaryButton}>
            Get Started
          </Button>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing["2xl"],
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing["2xl"],
  },
  placeholderIllustration: {
    fontSize: 120,
    textAlign: "center",
  },
  textContainer: {
    paddingBottom: Spacing["2xl"],
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  description: {
    textAlign: "center",
    lineHeight: 24,
  },
  actions: {
    gap: Spacing.md,
  },
  primaryButton: {
    width: "100%",
  },
});
