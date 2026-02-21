import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  FlatList,
  TextInput,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CustomHeader } from "@/components/CustomHeader";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { TimelineStackParamList } from "@/navigation/TimelineStackNavigator";

const { width } = Dimensions.get("window");
const NUM_COLUMNS = 3;
const ITEM_SPACING = Spacing.sm;
const PHOTO_SIZE =
  (width - Spacing.lg * 2 - ITEM_SPACING * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Mock data
const MOCK_PHOTOS = [
  {
    id: "1",
    uri: "https://picsum.photos/300/300?random=1",
    date: "2024-06-15",
    year: 2024,
    catalogNumber: "REF.2024-001",
  },
  {
    id: "2",
    uri: "https://picsum.photos/300/300?random=2",
    date: "2024-03-22",
    year: 2024,
    catalogNumber: "REF.2024-002",
  },
  {
    id: "3",
    uri: "https://picsum.photos/300/300?random=3",
    date: "2023-11-08",
    year: 2023,
    catalogNumber: "REF.2023-001",
  },
  {
    id: "4",
    uri: "https://picsum.photos/300/300?random=4",
    date: "2023-08-14",
    year: 2023,
    catalogNumber: "REF.2023-002",
  },
  {
    id: "5",
    uri: "https://picsum.photos/300/300?random=5",
    date: "2022-05-20",
    year: 2022,
    catalogNumber: "REF.2022-001",
  },
  {
    id: "6",
    uri: "https://picsum.photos/300/300?random=6",
    date: "2022-02-10",
    year: 2022,
    catalogNumber: "REF.2022-002",
  },
];

interface PhotoCardProps {
  photo: (typeof MOCK_PHOTOS)[0];
  onPress: () => void;
}

function PhotoCard({ photo, onPress }: PhotoCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      }}
      style={[
        styles.photoCard,
        {
          width: PHOTO_SIZE,
          height: PHOTO_SIZE,
          backgroundColor: theme.backgroundSecondary,
          borderColor: theme.border,
        },
        animatedStyle,
      ]}
    >
      <Image
        source={{ uri: photo.uri }}
        style={styles.photoImage}
        resizeMode="cover"
      />
      <View
        style={[
          styles.photoMeta,
          { backgroundColor: theme.backgroundTertiary },
        ]}
      >
        <ThemedText
          style={[styles.catalogNumber, { color: theme.textSecondary }]}
        >
          {photo.catalogNumber}
        </ThemedText>
      </View>
    </AnimatedPressable>
  );
}

function EmptyState() {
  const { theme } = useTheme();

  return (
    <View style={styles.emptyContainer}>
      <Feather name="inbox" size={48} color={theme.textSecondary} />
      <ThemedText type="h3" style={styles.emptyTitle}>
        No photos yet
      </ThemedText>
    </View>
  );
}

interface DecadeSection {
  decade: string;
  photos: (typeof MOCK_PHOTOS)[];
}

export default function TimelineScreen() {
  const { theme } = useTheme();
  const [photos] = useState(MOCK_PHOTOS);

  // Group photos by decade (descending)
  const groupedByDecade = React.useMemo(() => {
    const grouped: Record<string, (typeof MOCK_PHOTOS)[]> = {};
    photos.forEach((photo) => {
      const decade = Math.floor(photo.year / 10) * 10;
      const decadeKey = `${decade}s`;
      if (!grouped[decadeKey]) grouped[decadeKey] = [];
      grouped[decadeKey].push(photo);
    });

    return Object.entries(grouped)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .map(([decade, photos]) => ({ decade, photos }));
  }, [photos]);

  const handlePhotoPress = (photo: (typeof MOCK_PHOTOS)[0]) => {
    // Navigate to photo details if needed
  };

  return (
    <ThemedView style={styles.container}>
      <CustomHeader
        photoCount={photos.length}
        title="archives"
        showProfileButton={true}
      />

      <FlatList
        data={groupedByDecade}
        contentContainerStyle={styles.listContent}
        scrollIndicatorInsets={{ right: 1 }}
        renderItem={({ item }) => (
          <View style={styles.decadeSection}>
            {/* Decade Header with Lines */}
            <View style={styles.decadeHeader}>
              <View
                style={[styles.decadeLine, { backgroundColor: theme.border }]}
              />
              <ThemedText
                type="h4"
                style={[styles.decadeText, { color: theme.accent }]}
              >
                {item.decade}
              </ThemedText>
              <View
                style={[styles.decadeLine, { backgroundColor: theme.border }]}
              />
            </View>

            {/* Photo Grid */}
            <View style={styles.photoGrid}>
              {item.photos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  onPress={() => handlePhotoPress(photo)}
                />
              ))}
            </View>
          </View>
        )}
        keyExtractor={(item) => item.decade}
        ListEmptyComponent={EmptyState}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing["2xl"],
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  emptyTitle: {
    textAlign: "center",
  },
  decadeSection: {
    marginBottom: Spacing["2xl"],
  },
  decadeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  decadeLine: {
    flex: 1,
    height: 1,
  },
  decadeText: {
    fontWeight: "600",
    textAlign: "center",
    minWidth: 60,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ITEM_SPACING,
  },
  photoCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    overflow: "hidden",
  },
  photoImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  photoMeta: {
    padding: Spacing.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  catalogNumber: {
    fontSize: 8,
    letterSpacing: 0.5,
  },
});
