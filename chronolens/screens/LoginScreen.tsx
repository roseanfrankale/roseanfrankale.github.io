import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginScreen() {
  const { colors, skin } = useTheme();
  const { login, signup, isLoading: authLoading } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    if (mode === "signup" && !name) {
      setError("Please enter your name");
      return;
    }

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      // Auth state will update automatically and trigger navigation change
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  const handleOAuthLogin = (provider: string) => {
    setError(`${provider} OAuth is not configured in this demo.`);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View
            style={[
              styles.logoIcon,
              { backgroundColor: colors.card, borderColor: colors.accent },
            ]}
          >
            <Feather
              name={skin === "historian" ? "camera" : "zap"}
              size={32}
              color={colors.accent}
            />
          </View>
          <Text style={[styles.logoText, { color: colors.text }]}>
            ChronoLens
          </Text>
          <Text style={[styles.logoSubtext, { color: colors.textSecondary }]}>
            {skin === "historian"
              ? "ARCHIVAL PHOTO LEDGER"
              : "TEMPORAL PHOTO SCANNER"}
          </Text>
        </View>

        {/* Login Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </Text>
            <Text
              style={[styles.cardSubtitle, { color: colors.textSecondary }]}
            >
              {mode === "login"
                ? "Access your photo archive"
                : "Begin your archival journey"}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Error Message */}
            {error ? (
              <View style={[styles.errorBox, { backgroundColor: colors.card }]}>
                <Feather name="alert-circle" size={16} color="#ef4444" />
                <Text style={[styles.errorText, { color: "#ef4444" }]}>
                  {error}
                </Text>
              </View>
            ) : null}

            {/* Name (Signup only) */}
            {mode === "signup" && (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  FULL NAME
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.textSecondary}
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                      backgroundColor: colors.cardAlt,
                      borderColor: colors.border,
                    },
                  ]}
                  editable={!authLoading}
                  autoCapitalize="words"
                />
              </View>
            )}

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>EMAIL</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.textSecondary}
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    backgroundColor: colors.cardAlt,
                    borderColor: colors.border,
                  },
                ]}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!authLoading}
              />
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                PASSWORD
              </Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showPassword}
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                      backgroundColor: colors.cardAlt,
                      borderColor: colors.border,
                      paddingRight: 48,
                    },
                  ]}
                  editable={!authLoading}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color={colors.textSecondary}
                  />
                </Pressable>
              </View>
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={handleSubmit}
              disabled={authLoading}
              style={({ pressed }) => [
                styles.submitButton,
                {
                  backgroundColor: colors.accent,
                  opacity: authLoading ? 0.5 : pressed ? 0.8 : 1,
                },
              ]}
            >
              {authLoading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text
                  style={[
                    styles.submitButtonText,
                    { color: colors.background },
                  ]}
                >
                  {mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
                </Text>
              )}
            </Pressable>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View
              style={[styles.dividerLine, { backgroundColor: colors.border }]}
            />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>
              OR CONTINUE WITH
            </Text>
            <View
              style={[styles.dividerLine, { backgroundColor: colors.border }]}
            />
          </View>

          {/* OAuth Buttons */}
          <View style={styles.oauthGrid}>
            {[
              { id: "google", name: "Google", icon: "chrome" },
              { id: "apple", name: "Apple", icon: "aperture" },
              { id: "github", name: "GitHub", icon: "github" },
              { id: "microsoft", name: "Microsoft", icon: "grid" },
            ].map((provider) => (
              <Pressable
                key={provider.id}
                onPress={() => handleOAuthLogin(provider.name)}
                disabled={authLoading}
                style={({ pressed }) => [
                  styles.oauthButton,
                  {
                    borderColor: pressed ? colors.accent : colors.border,
                    backgroundColor: pressed ? colors.cardAlt : "transparent",
                    opacity: authLoading ? 0.5 : 1,
                  },
                ]}
              >
                <Feather
                  name={provider.icon as any}
                  size={16}
                  color={colors.text}
                />
                <Text style={[styles.oauthButtonText, { color: colors.text }]}>
                  {provider.name}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Toggle Mode */}
          <Pressable
            onPress={() => {
              setMode(mode === "login" ? "signup" : "login");
              setName("");
              setEmail("");
              setPassword("");
              setError("");
            }}
            disabled={authLoading}
            style={styles.toggleMode}
          >
            <Text style={[styles.toggleModeText, { color: colors.accent }]}>
              {mode === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Text>
          </Pressable>
        </View>

        {/* Footer */}
        <Text style={[styles.footer, { color: colors.textSecondary }]}>
          {skin === "historian"
            ? "Preserving memories since 2026"
            : "SCANNING TEMPORAL MEMORIES"}
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    fontFamily: "Cinzel-Regular",
    fontSize: 36,
    fontWeight: "400",
    marginBottom: 8,
  },
  logoSubtext: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 32,
    marginBottom: 24,
  },
  cardHeader: {
    marginBottom: 24,
  },
  cardTitle: {
    fontFamily: "Cinzel-Regular",
    fontSize: 24,
    fontWeight: "400",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
  },
  form: {
    gap: 16,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fee2e2",
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "SpaceMono-Regular",
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  passwordToggle: {
    position: "absolute",
    right: 16,
    top: 14,
  },
  submitButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  oauthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  oauthButton: {
    flex: 1,
    minWidth: "45%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
  oauthButtonText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  toggleMode: {
    alignItems: "center",
  },
  toggleModeText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
  },
  footer: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    textAlign: "center",
    opacity: 0.7,
  },
});
