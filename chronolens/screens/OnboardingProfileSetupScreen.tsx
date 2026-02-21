import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  Pressable,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/contexts/AuthContext";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { Spacing, BorderRadius } from "@/constants/theme";

const AVATAR_OPTIONS = [
  {
    id: "camera",
    name: "Vintage Camera",
    source: require("../assets/images/avatars/camera.png"),
  },
  {
    id: "film",
    name: "Film Roll",
    source: require("../assets/images/avatars/film.png"),
  },
  {
    id: "polaroid",
    name: "Polaroid Frame",
    source: require("../assets/images/avatars/polaroid.png"),
  },
  {
    id: "album",
    name: "Photo Album",
    source: require("../assets/images/avatars/album.png"),
  },
];

export default function OnboardingProfileSetupScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { paddingTop, paddingBottom } = useScreenInsets();
  const { setIsAuthenticated } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  const handleComplete = () => {
    // Mock profile setup - update auth state to trigger RootNavigator switch
    setIsAuthenticated(true);
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
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
                Set Up Your Profile
              </ThemedText>
              <ThemedText
                type="body"
                style={[styles.subtitle, { color: theme.textSecondary }]}
              >
                Choose an avatar and tell us about yourself
              </ThemedText>
            </View>

            <View style={styles.form}>
              <View style={styles.avatarSection}>
                <ThemedText
                  type="caption"
                  style={[styles.label, { color: theme.textSecondary }]}
                >
                  Choose Avatar
                </ThemedText>
                <View style={styles.avatarGrid}>
                  {AVATAR_OPTIONS.map((avatar) => (
                    <Pressable
                      key={avatar.id}
                      onPress={() => setSelectedAvatar(avatar.id)}
                      style={[
                        styles.avatarOption,
                        {
                          borderColor:
                            selectedAvatar === avatar.id
                              ? theme.sepia
                              : theme.border,
                          borderWidth: selectedAvatar === avatar.id ? 2 : 1,
                          backgroundColor:
                            selectedAvatar === avatar.id
                              ? theme.sepiaLight
                              : "transparent",
                        },
                      ]}
                    >
                      <Image
                        source={avatar.source}
                        style={styles.avatarImage}
                        resizeMode="contain"
                      />
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.inputSection}>
                <ThemedText
                  type="caption"
                  style={[styles.label, { color: theme.textSecondary }]}
                >
                  Display Name
                </ThemedText>
                <View
                  style={[styles.inputWrapper, { borderColor: theme.border }]}
                >
                  <Feather
                    name="user"
                    size={18}
                    color={theme.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="Your name"
                    placeholderTextColor={theme.textSecondary}
                    value={displayName}
                    onChangeText={setDisplayName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.inputSection}>
                <ThemedText
                  type="caption"
                  style={[styles.label, { color: theme.textSecondary }]}
                >
                  Bio (Optional)
                </ThemedText>
                <View
                  style={[
                    styles.inputWrapper,
                    styles.textAreaWrapper,
                    { borderColor: theme.border },
                  ]}
                >
                  <TextInput
                    style={[styles.textArea, { color: theme.text }]}
                    placeholder="Tell us about yourself..."
                    placeholderTextColor={theme.textSecondary}
                    value={bio}
                    onChangeText={setBio}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              <Button
                onPress={handleComplete}
                style={styles.submitButton}
                disabled={!selectedAvatar || !displayName.trim()}
              >
                Complete Setup
              </Button>
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
  avatarSection: {
    marginBottom: Spacing.xl,
  },
  label: {
    marginBottom: Spacing.md,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    justifyContent: "center",
  },
  avatarOption: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.sm,
  },
  inputSection: {
    marginBottom: Spacing.lg,
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
  textAreaWrapper: {
    height: 100,
    alignItems: "flex-start",
    paddingTop: Spacing.md,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    padding: 0,
    width: "100%",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  submitButton: {
    marginTop: Spacing.lg,
  },
});
