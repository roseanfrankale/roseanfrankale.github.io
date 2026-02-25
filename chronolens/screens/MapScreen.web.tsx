import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function MapScreenWeb() {
  const { theme, fonts } = useTheme();
  const { paddingTop } = useScreenInsets();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundDefault }]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.backgroundDefault,
            borderBottomColor: theme.border,
            paddingTop: paddingTop + Spacing.xl,
          },
        ]}
      >
        <View>
          <ThemedText
            style={[
              styles.headerTitle,
              { fontFamily: fonts.header, color: theme.text },
            ]}
          >
            Family Map
          </ThemedText>
          <ThemedText
            type="caption"
            style={[
              styles.headerSubtitle,
              { fontFamily: fonts.mono, color: theme.textSecondary },
            ]}
          >
            Web fallback
          </ThemedText>
        </View>
      </View>

      <View style={styles.emptyState}>
        <Feather
          name="map"
          size={64}
          color={theme.textSecondary}
          style={{ opacity: 0.3 }}
        />
        <ThemedText
          style={[
            styles.emptyTitle,
            { fontFamily: fonts.header, color: theme.text },
          ]}
        >
          Maps are not available on web
        </ThemedText>
        <ThemedText
          type="body"
          style={[styles.emptySubtitle, { color: theme.textSecondary }]}
        >
          Open the mobile app build to explore interactive map locations.
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "400",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.7,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing["3xl"],
    gap: Spacing.lg,
  },
  emptyTitle: {
    fontSize: 28,
    textAlign: "center",
  },
  emptySubtitle: {
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 320,
  },
  themeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
});
