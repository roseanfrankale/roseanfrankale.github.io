import React from "react";
import { View, StyleSheet, Pressable, useWindowDimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { MainTabParamList } from "@/navigation/MainTabNavigator";

interface WebLayoutProps {
  children: React.ReactNode;
  activeTab?: keyof MainTabParamList;
}

type NavigationScreens = keyof MainTabParamList;

interface NavItem {
  name: NavigationScreens;
  label: string;
  icon: "archive" | "compass" | "map-pin" | "user" | "settings";
}

const NAV_ITEMS: NavItem[] = [
  { name: "TimelineTab", label: "Timeline", icon: "archive" },
  { name: "ExploreTab", label: "Explore", icon: "compass" },
  { name: "MapTab", label: "Map", icon: "map-pin" },
  { name: "ProfileTab", label: "Profile", icon: "user" },
];

export const WebLayout: React.FC<WebLayoutProps> = ({
  children,
  activeTab = "TimelineTab",
}) => {
  const { width } = useWindowDimensions();
  const { theme, skin, colorMode } = useTheme();
  const navigation = useNavigation<NavigationProp<MainTabParamList>>();

  // Show sidebar only on desktop-sized web screens
  const isWebView = width >= 1280;
  const sidebarWidth = 240;
  const contentMaxWidth = 1200;

  if (!isWebView) {
    // Mobile layout - just return children
    return <View style={styles.container}>{children}</View>;
  }

  // Web layout with sidebar
  return (
    <View
      style={[styles.webContainer, { backgroundColor: theme.backgroundRoot }]}
    >
      {/* Sidebar Navigation */}
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
        {/* Logo/Brand */}
        <View
          style={[styles.sidebarHeader, { borderBottomColor: theme.border }]}
        >
          <ThemedText style={[styles.brandText, { color: theme.accent }]}>
            📷
          </ThemedText>
          <ThemedText style={[styles.brandName, { color: theme.text }]}>
            ChronoLens
          </ThemedText>
        </View>

        {/* Navigation Items */}
        <View style={styles.navContainer}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <Pressable
                key={item.name}
                onPress={() => {
                  navigation.navigate(item.name);
                }}
                style={[
                  styles.navItem,
                  isActive && {
                    backgroundColor: theme.accent + "1A",
                    borderLeftColor: theme.accent,
                    borderLeftWidth: 3,
                  },
                  {
                    borderLeftWidth: isActive ? 0 : 0, // Will be overridden by active state
                  },
                ]}
              >
                <Feather
                  name={item.icon}
                  size={20}
                  color={isActive ? theme.accent : theme.textSecondary}
                />
                <ThemedText
                  style={[
                    styles.navLabel,
                    {
                      color: isActive ? theme.accent : theme.text,
                      fontWeight: isActive ? "600" : "500",
                    },
                  ]}
                >
                  {item.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        {/* Theme Indicator */}
        <View
          style={[
            styles.themeIndicator,
            {
              borderTopColor: theme.border,
              backgroundColor: theme.backgroundSecondary,
            },
          ]}
        >
          <ThemedText
            style={[styles.themeLabel, { color: theme.textSecondary }]}
          >
            {skin === "historian" ? "🗺️ Historian" : "🌐 Cyberpunk"}
          </ThemedText>
          <ThemedText
            style={[styles.modeLabel, { color: theme.textSecondary }]}
          >
            {colorMode === "light"
              ? "☀️ Light"
              : colorMode === "dark"
                ? "🌙 Dark"
                : "⚙️ System"}
          </ThemedText>
        </View>
      </View>

      {/* Content Area */}
      <View style={styles.contentArea}>
        <View
          style={[
            styles.contentWrapper,
            {
              maxWidth: contentMaxWidth,
              backgroundColor: theme.backgroundRoot,
            },
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
  contentArea: {
    flex: 1,
    alignItems: "center",
  },
  sidebar: {
    borderRightWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  sidebarHeader: {
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 24,
    borderBottomWidth: 1,
    gap: 8,
  },
  brandText: {
    fontSize: 32,
  },
  brandName: {
    fontSize: 14,
    fontWeight: "600",
  },
  navContainer: {
    flex: 1,
    gap: 4,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 12,
    marginBottom: 8,
  },
  navLabel: {
    fontSize: 14,
  },
  themeIndicator: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 12,
    paddingHorizontal: 12,
  },
  themeLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  modeLabel: {
    fontSize: 12,
  },
  contentWrapper: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },
});
