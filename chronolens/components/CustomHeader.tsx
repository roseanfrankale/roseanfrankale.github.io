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
  title?: string;
  showNotificationButton?: boolean;
  onNotificationPress?: () => void;
  showProfileButton?: boolean;
  onProfilePress?: () => void;
  style?: ViewStyle;
}

export function CustomHeader({
  title = "archives",
  showNotificationButton = true,
  onNotificationPress,
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

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundDefault,
          borderBottomColor: theme.border,
          paddingTop: paddingTop + Spacing.xl,
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

      {/* Notification or Profile Button */}
      {showNotificationButton && (
        <Pressable
          onPress={handleNotificationPress}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.7 : 1,
              marginRight: showProfileButton ? Spacing.md : 0,
            },
          ]}
        >
          <Feather name="bell" size={20} color={theme.text} strokeWidth={1.5} />
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
          <Feather name="user" size={16} color={theme.text} strokeWidth={1.5} />
        </Pressable>
      )}
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
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
