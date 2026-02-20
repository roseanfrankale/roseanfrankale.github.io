import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/navigation/AuthStackNavigator";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { theme } = useTheme();
  const { paddingTop, paddingBottom } = useScreenInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = () => {
    // Mock auth - navigate to onboarding profile setup
    navigation.navigate("OnboardingProfileSetup");
  };

  const handleSSO = (provider: "apple" | "google") => {
    // Mock SSO - navigate to onboarding profile setup
    navigation.navigate("OnboardingProfileSetup");
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop, paddingBottom },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <ThemedText type="h1" style={styles.title}>
                {isSignUp ? "Create Account" : "Welcome Back"}
              </ThemedText>
              <ThemedText type="body" style={[styles.subtitle, { color: theme.textSecondary }]}>
                {isSignUp
                  ? "Sign up to start archiving your memories"
                  : "Sign in to continue"}
              </ThemedText>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <ThemedText type="caption" style={[styles.label, { color: theme.textSecondary }]}>
                  Email
                </ThemedText>
                <View style={[styles.inputWrapper, { borderColor: theme.border }]}>
                  <Feather name="mail" size={18} color={theme.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="you@example.com"
                    placeholderTextColor={theme.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <ThemedText type="caption" style={[styles.label, { color: theme.textSecondary }]}>
                  Password
                </ThemedText>
                <View style={[styles.inputWrapper, { borderColor: theme.border }]}>
                  <Feather name="lock" size={18} color={theme.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="••••••••"
                    placeholderTextColor={theme.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <Feather
                      name={showPassword ? "eye-off" : "eye"}
                      size={18}
                      color={theme.textSecondary}
                    />
                  </Pressable>
                </View>
              </View>

              {!isSignUp && (
                <Pressable style={styles.forgotPassword}>
                  <ThemedText type="small" style={{ color: theme.link }}>
                    Forgot password?
                  </ThemedText>
                </Pressable>
              )}

              <Button onPress={handleSubmit} style={styles.submitButton}>
                {isSignUp ? "Sign Up" : "Sign In"}
              </Button>

              <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
                <ThemedText type="caption" style={[styles.dividerText, { color: theme.textSecondary }]}>
                  OR
                </ThemedText>
                <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              </View>

              <View style={styles.ssoContainer}>
                {Platform.OS === "ios" && (
                  <Pressable
                    style={[styles.ssoButton, { borderColor: theme.border }]}
                    onPress={() => handleSSO("apple")}
                  >
                    <Feather name="smartphone" size={20} color={theme.text} />
                    <ThemedText type="body" style={styles.ssoButtonText}>
                      Continue with Apple
                    </ThemedText>
                  </Pressable>
                )}
                <Pressable
                  style={[styles.ssoButton, { borderColor: theme.border }]}
                  onPress={() => handleSSO("google")}
                >
                  <Feather name="chrome" size={20} color={theme.text} />
                  <ThemedText type="body" style={styles.ssoButtonText}>
                    Continue with Google
                  </ThemedText>
                </Pressable>
              </View>

              <View style={styles.footer}>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  {isSignUp ? "Already have an account? " : "Don't have an account? "}
                </ThemedText>
                <Pressable onPress={() => setIsSignUp(!isSignUp)}>
                  <ThemedText type="small" style={{ color: theme.link }}>
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </ThemedText>
                </Pressable>
              </View>

              <View style={styles.legal}>
                <ThemedText type="caption" style={[styles.legalText, { color: theme.textSecondary }]}>
                  By continuing, you agree to our{" "}
                  <ThemedText type="caption" style={{ color: theme.link }}>
                    Terms of Service
                  </ThemedText>{" "}
                  and{" "}
                  <ThemedText type="caption" style={{ color: theme.link }}>
                    Privacy Policy
                  </ThemedText>
                </ThemedText>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: Spacing.xl,
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    marginBottom: Spacing["2xl"],
    alignItems: "center",
  },
  title: {
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: Spacing.inputHeight,
    backgroundColor: "transparent",
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  eyeButton: {
    padding: Spacing.xs,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: Spacing.lg,
  },
  submitButton: {
    marginBottom: Spacing.lg,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    textTransform: "uppercase",
  },
  ssoContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  ssoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  ssoButtonText: {
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  legal: {
    alignItems: "center",
  },
  legalText: {
    textAlign: "center",
    fontSize: 11,
    lineHeight: 16,
  },
});
