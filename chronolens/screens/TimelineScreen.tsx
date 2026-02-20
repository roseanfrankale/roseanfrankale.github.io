import React, { useState } from "react";
import { 
  View, 
  StyleSheet, 
  Image, 
  Pressable,
  Dimensions,
  FlatList,
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
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { TimelineStackParamList } from "@/navigation/TimelineStackNavigator";
import { usePhotoStore, Photo } from "@/store/photoStore";

const { width } = Dimensions.get("window");
const PHOTO_SIZE = (width - Spacing.xl * 2 - Spacing.sm * 2) / 3;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PhotoThumbnailProps {
  photo: Photo;
  onPress: () => void;
}

function PhotoThumbnail({ photo, onPress }: PhotoThumbnailProps) {
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
        styles.photoContainer,
        { backgroundColor: theme.backgroundSecondary },
        animatedStyle,
      ]}
    >
      <Image source={{ uri: photo.uri }} style={styles.photo} />
      {photo.isShared ? (
        <View style={[styles.sharedBadge, { backgroundColor: theme.communityBlue }]}>
          <Feather name="globe" size={10} color="#FFFFFF" />
        </View>
      ) : null}
    </AnimatedPressable>
  );
}

function EmptyState() {
  const { theme } = useTheme();

  return (
    <View style={styles.emptyContainer}>
      <Image
        source={require("../assets/images/illustrations/empty-timeline.png")}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <ThemedText type="h3" style={styles.emptyTitle}>
        Start Your Timeline
      </ThemedText>
      <ThemedText type="body" style={[styles.emptyText, { color: theme.textSecondary }]}>
        Tap the camera button below to add your first photo and begin archiving your memories.
      </ThemedText>
    </View>
  );
}

interface DecadeSection {
  decade: string;
  years: { year: string; photos: Photo[] }[];
}

export default function TimelineScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<TimelineStackParamList>>();
  const { theme } = useTheme();
  const { paddingTop, paddingBottom } = useScreenInsets();
  const { photos } = usePhotoStore();

  const groupPhotosByDecade = (): DecadeSection[] => {
    const grouped: Record<string, Record<string, Photo[]>> = {};
    
    photos.forEach((photo) => {
      const decade = `${Math.floor(photo.year / 10) * 10}s`;
      const year = photo.year.toString();
      
      if (!grouped[decade]) {
        grouped[decade] = {};
      }
      if (!grouped[decade][year]) {
        grouped[decade][year] = [];
      }
      grouped[decade][year].push(photo);
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => parseInt(b) - parseInt(a))
      .map(([decade, years]) => ({
        decade,
        years: Object.entries(years)
          .sort(([a], [b]) => parseInt(b) - parseInt(a))
          .map(([year, photos]) => ({ year, photos })),
      }));
  };

  const decadeSections = groupPhotosByDecade();

  const renderDecadeSection = ({ item }: { item: DecadeSection }) => (
    <View style={styles.decadeSection}>
      <ThemedText type="h2" style={[styles.decadeTitle, { color: theme.sepia }]}>
        {item.decade}
      </ThemedText>
      {item.years.map((yearData) => (
        <View key={yearData.year} style={styles.yearSection}>
          <ThemedText type="h4" style={styles.yearTitle}>
            {yearData.year}
          </ThemedText>
          <View style={styles.photoGrid}>
            {yearData.photos.map((photo) => (
              <PhotoThumbnail
                key={photo.id}
                photo={photo}
                onPress={() => navigation.navigate("PhotoDetail", { photoId: photo.id })}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={decadeSections}
        renderItem={renderDecadeSection}
        keyExtractor={(item) => item.decade}
        contentContainerStyle={[
          styles.content,
          { paddingTop, paddingBottom },
          decadeSections.length === 0 && styles.emptyContent,
        ]}
        ListEmptyComponent={EmptyState}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  emptyContent: {
    flex: 1,
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: Spacing.xl,
    opacity: 0.9,
  },
  emptyTitle: {
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  emptyText: {
    textAlign: "center",
    maxWidth: 280,
  },
  decadeSection: {
    marginBottom: Spacing["2xl"],
  },
  decadeTitle: {
    marginBottom: Spacing.lg,
  },
  yearSection: {
    marginBottom: Spacing.xl,
  },
  yearTitle: {
    marginBottom: Spacing.md,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  photoContainer: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: BorderRadius.sm,
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  sharedBadge: {
    position: "absolute",
    top: Spacing.xs,
    right: Spacing.xs,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
});
