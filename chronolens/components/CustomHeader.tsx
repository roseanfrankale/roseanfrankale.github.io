import React from "react";
import { View, Text, StyleSheet, Pressable, ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { Spacing } from "@/constants/theme";

interface CustomHeaderProps {
  title?: string;
  showNotificationButton?: boolean;
  onNotificationPress?: () => void;
  style?: ViewStyle;
}

export function CustomHeader({
  title = "archives",
  showNotificationButton = true,
  onNotificationPress,
  style,
}: CustomHeaderProps) {
  const { theme } = useTheme();
  const { paddingTop } = useScreenInsets();

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundDefault,
          borderBottomColor: theme.border,
          paddingTop: Math.max(paddingTop, Spacing.md),
        },
        style,
      ]}
    >
      {/* Logo Section with Camera Icon */}
      <View style={styles.logoContainer}>
        <View style={styles.logoRow}>
          <Text style={[styles.logoText, { color: theme.text }]}>c</Text>
          <Feather name="camera" size={16} color={theme.accent} />
          <Text style={[styles.logoText, { color: theme.text }]}>l</Text>
        </View>
      </View>

      {/* Title (optional) */}
      {title && (
        <Text style={[styles.titleText, { color: theme.text }]}>{title}</Text>
      )}

      {/* Notification Button */}
      {showNotificationButton && (
        <Pressable
          onPress={handleNotificationPress}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Feather name="bell" size={20} color={theme.text} strokeWidth={1.5} />
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
  titleText: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    textAlign: "center",
    textTransform: "lowercase",
  },
});
