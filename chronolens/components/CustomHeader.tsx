import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { Spacing } from "@/constants/theme";

interface CustomHeaderProps {
  photoCount?: number;
  title?: string;
  showNotificationButton?: boolean;
  onNotificationPress?: () => void;
  showMessageButton?: boolean;
  onMessagePress?: () => void;
  showProfileButton?: boolean;
  onProfilePress?: () => void;
  style?: ViewStyle;
}

export function CustomHeader({
  title = "archives",
  showNotificationButton = true,
  onNotificationPress,
  showMessageButton = false,
  onMessagePress,
  showProfileButton = false,
  onProfilePress,
  style,
}: CustomHeaderProps) {
  const { theme } = useTheme();
  const { paddingTop } = useScreenInsets();

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    }
  };

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    }
  };

  const handleMessagePress = () => {
    if (onMessagePress) {
      onMessagePress();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundDefault,
          borderBottomColor: theme.border,
          paddingTop: paddingTop + Spacing.xl + 16,
        },
        style,
      ]}
    >
      {/* Logo Section with App Icon */}
      <View style={styles.logoContainer}>
        <View style={styles.logoRow}>
          <Text style={[styles.logoText, { color: theme.text }]}>c</Text>
          <View style={styles.iconContainer}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.appIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.logoText, { color: theme.text }]}>l</Text>
        </View>
      </View>

      {/* Title */}
      {title && (
        <Text style={[styles.titleText, { color: theme.text }]}>{title}</Text>
      )}

      {/* Buttons Container */}
      <View style={styles.buttonsContainer}>
        {showNotificationButton && (
          <Pressable
            onPress={handleNotificationPress}
            style={({ pressed }) => [
              styles.iconButton,
              {
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Feather
              name="bell"
              size={20}
              color={theme.text}
              strokeWidth={1.5}
            />
          </Pressable>
        )}
        {showMessageButton && (
          <Pressable
            onPress={handleMessagePress}
            style={({ pressed }) => [
              styles.iconButton,
              {
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Feather
              name="message-circle"
              size={20}
              color={theme.text}
              strokeWidth={1.5}
            />
          </Pressable>
        )}
        {showProfileButton && (
          <Pressable
            onPress={handleProfilePress}
            style={({ pressed }) => [
              styles.profileButton,
              {
                opacity: pressed ? 0.7 : 1,
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
              },
            ]}
          >
            <Feather
              name="user"
              size={16}
              color={theme.text}
              strokeWidth={1.5}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    gap: Spacing.sm,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  iconButton: {
    padding: Spacing.sm,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "600",
  },
  iconContainer: {
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  appIcon: {
    width: 20,
    height: 20,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    textAlign: "center",
    textTransform: "lowercase",
    marginHorizontal: Spacing.md,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
