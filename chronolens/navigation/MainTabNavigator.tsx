import React from "react";
import {
  View,
  StyleSheet,
  Platform,
  Text,
  useWindowDimensions,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import TimelineStackNavigator from "@/navigation/TimelineStackNavigator";
import ExploreStackNavigator from "@/navigation/ExploreStackNavigator";
import ProfileStackNavigator from "@/navigation/ProfileStackNavigator";
import MapStackNavigator from "@/navigation/MapStackNavigator";
import CameraScreen from "@/screens/CameraScreen";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { WebLayout } from "@/components/WebLayout";

export type MainTabParamList = {
  ExploreTab: undefined;
  TimelineTab: undefined;
  CameraTab: undefined;
  MapTab: undefined;
  ProfileTab: undefined;
};

function withAlpha(color: string, alphaHex: string) {
  return color.startsWith("#") && color.length === 7
    ? `${color}${alphaHex}`
    : color;
}

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] =
    React.useState<keyof MainTabParamList>("ExploreTab");
  const cameraGlowStyle = React.useMemo(
    () =>
      Platform.select({
        web: {
          filter: `drop-shadow(0 0 10px ${withAlpha(theme.accent, "80")})`,
        },
        default: {
          shadowColor: theme.accent,
        },
      }),
    [theme.accent],
  );

  const webViewMode = React.useMemo<"mobile" | "desktop">(() => {
    if (Platform.OS !== "web") {
      return "mobile";
    }

    const forcedMode = new URLSearchParams(window.location.search).get("view");
    if (forcedMode === "mobile" || forcedMode === "desktop") {
      return forcedMode;
    }

    return width >= 1280 ? "desktop" : "mobile";
  }, [width]);

  const showDesktopShell = Platform.OS === "web" && webViewMode === "desktop";

  const desktopContent = React.useMemo(() => {
    switch (activeTab) {
      case "TimelineTab":
        return <TimelineStackNavigator />;
      case "CameraTab":
        return <CameraScreen />;
      case "MapTab":
        return <MapStackNavigator />;
      case "ProfileTab":
        return <ProfileStackNavigator />;
      case "ExploreTab":
      default:
        return <ExploreStackNavigator />;
    }
  }, [activeTab]);

  const handleDesktopNavigate = React.useCallback(
    (tabName: keyof MainTabParamList) => {
      setActiveTab(tabName);
    },
    [],
  );

  const tabNavigator = (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName="ExploreTab"
        screenListeners={{
          state: (event) => {
            const tabState = event.data.state as
              | {
                  index: number;
                  routes: { name: keyof MainTabParamList }[];
                }
              | undefined;
            const focusedRoute = tabState?.routes?.[tabState.index]?.name;
            if (focusedRoute) {
              setActiveTab(focusedRoute);
            }
          },
        }}
        screenOptions={{
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.tabIconDefault,
          tabBarStyle: {
            position: "absolute",
            overflow: "visible",
            backgroundColor: Platform.select({
              ios: "transparent",
              android: theme.backgroundRoot,
              web: isDark
                ? "rgba(26, 25, 23, 0.78)"
                : "rgba(255, 255, 255, 0.78)",
            }),
            borderTopWidth: 1,
            borderTopColor: theme.border,
            elevation: 0,
            height: 65 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: Spacing.sm,
            ...(Platform.OS === "web"
              ? ({
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                } as any)
              : {}),
            ...(activeTab === "CameraTab" ? { display: "none" } : {}),
            ...(showDesktopShell ? { display: "none" } : {}),
          },
          tabBarBackground: () =>
            Platform.OS === "ios" ? (
              <BlurView
                intensity={100}
                tint={isDark ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
              />
            ) : null,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "500",
            marginTop: Spacing.xs,
          },
          tabBarIconStyle: {
            marginTop: Spacing.sm,
          },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="ExploreTab"
          component={ExploreStackNavigator}
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Feather
                name="home"
                size={size}
                color={color}
                strokeWidth={1.5}
              />
            ),
          }}
        />
        <Tab.Screen
          name="TimelineTab"
          component={TimelineStackNavigator}
          options={{
            title: "Timeline",
            tabBarIcon: ({ color, size }) => (
              <Feather
                name="clock"
                size={size}
                color={color}
                strokeWidth={1.5}
              />
            ),
          }}
        />
        <Tab.Screen
          name="CameraTab"
          component={CameraScreen}
          options={{
            title: "Camera",
            tabBarIcon: ({ size }) => (
              <View
                style={[
                  styles.cameraButtonWrapper,
                  styles.cameraButtonGlow,
                  cameraGlowStyle,
                ]}
              >
                <View
                  style={[
                    styles.cameraIconContainer,
                    {
                      backgroundColor: theme.accent,
                      borderColor: theme.accent,
                    },
                  ]}
                >
                  <Feather
                    name="camera"
                    size={size}
                    color={theme.backgroundRoot}
                    strokeWidth={1.5}
                  />
                </View>
              </View>
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={[
                  styles.cameraLabel,
                  { color: focused ? theme.accent : theme.tabIconDefault },
                ]}
              >
                Camera
              </Text>
            ),
          }}
        />
        <Tab.Screen
          name="MapTab"
          component={MapStackNavigator}
          options={{
            title: "Map",
            tabBarIcon: ({ color, size }) => (
              <Feather name="map" size={size} color={color} strokeWidth={1.5} />
            ),
          }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileStackNavigator}
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Feather
                name="user"
                size={size}
                color={color}
                strokeWidth={1.5}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );

  if (showDesktopShell) {
    return (
      <WebLayout activeTab={activeTab} onNavigate={handleDesktopNavigate}>
        {desktopContent}
      </WebLayout>
    );
  }

  return tabNavigator;
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  container: {
    flex: 1,
  },
  cameraButtonWrapper: {
    position: "absolute",
    top: -6,
    zIndex: 50,
    elevation: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraButtonGlow: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 7,
    elevation: 7,
  },
  cameraIconContainer: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.full,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },
  cameraLabel: {
    fontSize: 10,
    fontWeight: "500",
    marginTop: Spacing.xs,
  },
});
