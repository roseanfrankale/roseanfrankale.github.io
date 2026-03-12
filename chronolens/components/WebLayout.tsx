import React from "react";
import { View, StyleSheet, Pressable, useWindowDimensions } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "./ThemedText";
import { useTheme } from "@/hooks/useTheme";
import type { MainTabParamList } from "@/navigation/MainTabNavigator";

interface WebLayoutProps {
  children: React.ReactNode;
  activeTab?: keyof MainTabParamList;
  onNavigate?: (tab: keyof MainTabParamList) => void;
}

type NavigationScreens = keyof MainTabParamList;

interface NavItem {
  name: NavigationScreens;
  label: string;
  icon: React.ComponentProps<typeof Feather>["name"];
}

const NAV_ITEMS: NavItem[] = [
  { name: "ExploreTab", label: "Dashboard", icon: "home" },
  { name: "TimelineTab", label: "Timeline", icon: "clock" },
  { name: "CameraTab", label: "Upload", icon: "upload" },
  { name: "MapTab", label: "Map", icon: "map" },
  { name: "ProfileTab", label: "Profile", icon: "user" },
];

export const WebLayout: React.FC<WebLayoutProps> = ({
  children,
  activeTab = "ExploreTab",
  onNavigate,
}) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  if (width < 1280) {
    return <View style={styles.container}>{children}</View>;
  }

  const sidebarWidth = isCollapsed ? 92 : 308;

  const renderNavItem = (item: NavItem) => {
    const isActive = activeTab === item.name;

    return (
      <Pressable
        key={item.name}
        accessibilityRole="button"
        onPress={() => onNavigate?.(item.name)}
        style={[
          styles.navItem,
          {
            backgroundColor: isActive ? `${theme.accent}22` : "transparent",
            borderColor: isActive ? `${theme.accent}44` : "transparent",
          },
          isCollapsed && styles.navItemCollapsed,
        ]}
      >
        <Feather
          name={item.icon}
          size={22}
          color={isActive ? theme.accent : theme.text}
          strokeWidth={1.8}
        />
        {!isCollapsed ? (
          <ThemedText
            style={[
              styles.navLabel,
              {
                color: theme.text,
                fontWeight: isActive ? "700" : "600",
              },
            ]}
          >
            {item.label}
          </ThemedText>
        ) : null}
      </Pressable>
    );
  };

  return (
    <View
      style={[styles.webContainer, { backgroundColor: theme.backgroundRoot }]}
    >
      <View
        style={[
          styles.sidebar,
          {
            width: sidebarWidth,
            backgroundColor: theme.backgroundDefault,
            borderRightColor: theme.border,
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          onPress={() => setIsCollapsed((current) => !current)}
          style={[
            styles.collapseButton,
            {
              borderColor: theme.border,
              backgroundColor: theme.backgroundRoot,
            },
          ]}
        >
          <Feather
            name={isCollapsed ? "chevron-right" : "chevron-left"}
            size={18}
            color={theme.text}
          />
        </Pressable>

        <View
          style={[styles.sidebarHeader, { borderBottomColor: theme.border }]}
        >
          <View
            style={[
              styles.brandBadge,
              {
                backgroundColor: `${theme.accent}22`,
                borderColor: `${theme.accent}30`,
              },
            ]}
          >
            <Feather name="clock" size={26} color={theme.accent} />
          </View>

          {!isCollapsed ? (
            <View style={styles.brandCopy}>
              <ThemedText style={[styles.brandName, { color: theme.text }]}>
                CHRONOLENS
              </ThemedText>
              <ThemedText
                style={[styles.brandSubline, { color: theme.textSecondary }]}
              >
                ARCHIVE DASHBOARD
              </ThemedText>
            </View>
          ) : null}
        </View>

        <View style={styles.navContainer}>{NAV_ITEMS.map(renderNavItem)}</View>
      </View>

      <View style={styles.contentArea}>
        <View
          style={[
            styles.contentWrapper,
            { backgroundColor: theme.backgroundRoot },
          ]}
        >
          {children}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webContainer: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    borderRightWidth: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
    position: "relative",
  },
  collapseButton: {
    position: "absolute",
    top: 72,
    right: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  sidebarHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingBottom: 28,
    marginBottom: 20,
    borderBottomWidth: 1,
  },
  brandBadge: {
    width: 68,
    height: 68,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  brandCopy: {
    flex: 1,
  },
  brandName: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 2,
    lineHeight: 30,
  },
  brandSubline: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 3,
  },
  navContainer: {
    flex: 1,
    gap: 8,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
  },
  navItemCollapsed: {
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  navLabel: {
    fontSize: 16,
  },
  contentArea: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },
});
