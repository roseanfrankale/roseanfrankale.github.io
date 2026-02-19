import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TimelineScreen from "@/screens/TimelineScreen";
import PhotoDetailScreen from "@/screens/PhotoDetailScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type TimelineStackParamList = {
  Timeline: undefined;
  PhotoDetail: { photoId: string };
};

const Stack = createNativeStackNavigator<TimelineStackParamList>();

export default function TimelineStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Timeline"
        component={TimelineScreen}
        options={{
          headerTitle: () => <HeaderTitle title="ChronoLens" />,
        }}
      />
      <Stack.Screen
        name="PhotoDetail"
        component={PhotoDetailScreen}
        options={{ headerTitle: "Photo" }}
      />
    </Stack.Navigator>
  );
}
