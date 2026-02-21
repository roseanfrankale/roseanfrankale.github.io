import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useUserStore, AVATAR_OPTIONS } from "@/store/userStore";

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { user, updateUser } = useUserStore();

  const [displayName, setDisplayName] = useState(user.displayName);
  const [bio, setBio] = useState(user.bio);
  const [selectedAvatarId, setSelectedAvatarId] = useState(
    AVATAR_OPTIONS.find((a) => a.source === user.avatar)?.id || "camera",
  );

  const handleSave = () => {
    if (!displayName.trim()) {
      Alert.alert("Error", "Please enter a display name.");
      return;
    }

    const selectedAvatar = AVATAR_OPTIONS.find(
      (a) => a.id === selectedAvatarId,
    );

    updateUser({
      displayName: displayName.trim(),
      bio: bio.trim(),
      avatar: selectedAvatar?.source || user.avatar,
    });

    Alert.alert("Profile Updated", "Your profile has been saved.", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScreenKeyboardAwareScrollView>
      <View style={styles.avatarSection}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Choose Avatar
        </ThemedText>
        <View style={styles.avatarGrid}>
          {AVATAR_OPTIONS.map((avatar) => (
            <Pressable
              key={avatar.id}
              onPress={() => setSelectedAvatarId(avatar.id)}
              style={({ pressed }) => [
                styles.avatarOption,
                {
                  borderColor:
                    selectedAvatarId === avatar.id
                      ? theme.sepia
                      : "transparent",
                  backgroundColor: theme.backgroundSecondary,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Image source={avatar.source} style={styles.avatarImage} />
              {selectedAvatarId === avatar.id ? (
                <View
                  style={[styles.checkBadge, { backgroundColor: theme.sepia }]}
                >
                  <Feather name="check" size={12} color="#FFFFFF" />
                </View>
              ) : null}
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.fieldSection}>
        <ThemedText
          type="small"
          style={[styles.fieldLabel, { color: theme.textSecondary }]}
        >
          Display Name
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.backgroundSecondary, color: theme.text },
          ]}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Enter your display name"
          placeholderTextColor={theme.textSecondary}
          maxLength={30}
        />
      </View>

      <View style={styles.fieldSection}>
        <ThemedText
          type="small"
          style={[styles.fieldLabel, { color: theme.textSecondary }]}
        >
          Bio
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            styles.bioInput,
            { backgroundColor: theme.backgroundSecondary, color: theme.text },
          ]}
          value={bio}
          onChangeText={setBio}
          placeholder="Tell us about yourself..."
          placeholderTextColor={theme.textSecondary}
          multiline
          numberOfLines={3}
          maxLength={150}
        />
        <ThemedText
          type="caption"
          style={[styles.charCount, { color: theme.textSecondary }]}
        >
          {bio.length}/150
        </ThemedText>
      </View>

      <Pressable
        onPress={handleSave}
        style={({ pressed }) => [
          styles.saveButton,
          {
            backgroundColor: theme.sepia,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <ThemedText type="body" style={styles.saveButtonText}>
          Save Changes
        </ThemedText>
      </Pressable>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  avatarSection: {
    marginBottom: Spacing["2xl"],
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
  },
  avatarGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  avatarOption: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  checkBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  fieldSection: {
    marginBottom: Spacing.xl,
  },
  fieldLabel: {
    marginBottom: Spacing.sm,
    fontWeight: "600",
  },
  input: {
    height: 48,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    paddingTop: Spacing.md,
    textAlignVertical: "top",
  },
  charCount: {
    textAlign: "right",
    marginTop: Spacing.xs,
  },
  saveButton: {
    height: 56,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.lg,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 17,
  },
});
