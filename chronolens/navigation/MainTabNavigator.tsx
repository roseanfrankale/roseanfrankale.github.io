import React from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Platform,
  Text,
  useWindowDimensions,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";

import TimelineStackNavigator from "@/navigation/TimelineStackNavigator";
import ExploreStackNavigator from "@/navigation/ExploreStackNavigator";
import ProfileStackNavigator from "@/navigation/ProfileStackNavigator";
import MapStackNavigator from "@/navigation/MapStackNavigator";
import CameraScreen from "@/screens/CameraScreen";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import UploadModal from "@/screens/UploadModal";
import { WebLayout } from "@/components/WebLayout";

export type MainTabParamList = {
  TimelineTab: undefined;
  ExploreTab: undefined;
  CameraTab: undefined;
  UploadTab: undefined;
  MapTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

// Upload screen wrapper for modal
function UploadTabScreen({ navigation }: any) {
  const isFocused = useIsFocused();
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (isFocused) {
      setIsModalOpen(true);
    }
  }, [isFocused]);

  const handleClose = () => {
    setIsModalOpen(false);
    navigation.navigate("TimelineTab");
  };

  return (
    <>
      <View
        style={[
          styles.placeholderScreen,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <Text style={{ color: theme.text }}>Upload</Text>
      </View>
      <UploadModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onCameraClick={() => {
          setIsModalOpen(false);
          navigation.navigate("CameraTab");
        }}
      />
    </>
  );
}

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isLargeLayout = width >= 768;
  const [activeTab, setActiveTab] = React.useState<keyof MainTabParamList>(
    "TimelineTab",
  );

  const tabNavigator = (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName="TimelineTab"
        screenListeners={{
          state: (event) => {
            const tabState = event.data.state as
              | {
                  index: number;
                  routes: Array<{ name: keyof MainTabParamList }>;
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
            backgroundColor: Platform.select({
              ios: "transparent",
              android: theme.backgroundRoot,
              web: isDark ? "rgba(26, 25, 23, 0.78)" : "rgba(255, 255, 255, 0.78)",
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
            ...(isLargeLayout ? { display: "none" } : {}),
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
          name="TimelineTab"
          component={TimelineStackNavigator}
          options={{
            title: "Timeline",
            tabBarIcon: ({ color, size }) => (
              <Feather
                name="trending-up"
                size={size}
                color={color}
                strokeWidth={1.5}
              />
            ),
          }}
        />
        <Tab.Screen
          name="ExploreTab"
          component={ExploreStackNavigator}
          options={{
            title: "Explore",
            tabBarIcon: ({ color, size }) => (
              <Feather
                name="compass"
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
            tabBarIcon: ({ color, size }) => (
              <View
                style={[styles.cameraIconContainer, { borderColor: color }]}
              >
                <Feather
                  name="camera"
                  size={size - 4}
                  color={color}
                  strokeWidth={1.5}
                />
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
          name="UploadTab"
          component={UploadTabScreen}
          options={{
            title: "Upload",
            tabBarIcon: ({ color, size }) => (
              <Feather
                name="upload"
                size={size}
                color={color}
                strokeWidth={1.5}
              />
            ),
          }}
        />
        <Tab.Screen
          name="MapTab"
          component={MapStackNavigator}
          options={{
            title: "Map",
            tabBarIcon: ({ color, size }) => (
              <Feather
                name="map"
                size={size}
                color={color}
                strokeWidth={1.5}
              />
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

  if (isLargeLayout) {
    return <WebLayout activeTab={activeTab}>{tabNavigator}</WebLayout>;
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
  placeholderScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraLabel: {
    fontSize: 10,
    fontWeight: "500",
    marginTop: Spacing.xs,
  },
});
