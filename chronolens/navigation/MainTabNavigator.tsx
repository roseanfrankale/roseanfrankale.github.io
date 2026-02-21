import React from "react";
import { View, StyleSheet, Pressable, Platform, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import TimelineStackNavigator from "@/navigation/TimelineStackNavigator";
import ExploreStackNavigator from "@/navigation/ExploreStackNavigator";
import ProfileStackNavigator from "@/navigation/ProfileStackNavigator";
import CameraScreen from "@/screens/CameraScreen";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import UploadModal from "@/screens/UploadModal";

export type MainTabParamList = {
  TimelineTab: undefined;
  ExploreTab: undefined;
  CameraTab: undefined;
  UploadTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

// Upload screen wrapper for modal
function UploadTabScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e: any) => {
      e.preventDefault();
      setIsModalOpen(true);
    });
    return unsubscribe;
  }, [navigation]);

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
        onClose={() => setIsModalOpen(false)}
        onCameraClick={() => {
          setIsModalOpen(false);
          navigation.navigate('CameraTab');
        }}
      />
    </>
  );
}

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName="TimelineTab"
        screenOptions={{
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.tabIconDefault,
          tabBarStyle: {
            position: "absolute",
            backgroundColor: Platform.select({
              ios: "transparent",
              android: theme.backgroundRoot,
            }),
            borderTopWidth: 1,
            borderTopColor: theme.border,
            elevation: 0,
            height: 65 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: Spacing.sm,
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
