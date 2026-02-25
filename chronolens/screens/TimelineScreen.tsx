import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  FlatList,
  TextInput,
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
import { useStaggeredAnimation } from "@/hooks/useStaggeredAnimation";
import { Spacing, BorderRadius } from "@/constants/theme";
import { pressableConfig } from "@/utils/animations";
import { TimelineStackParamList } from "@/navigation/TimelineStackNavigator";
import { usePhotoStore, Photo } from "@/store/photoStore";

const { width } = Dimensions.get("window");
const NUM_COLUMNS = 3;
const ITEM_SPACING = Spacing.sm;
const PHOTO_SIZE =
  (width - Spacing.lg * 2 - ITEM_SPACING * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PhotoCardProps {
  photo: Photo;
  onPress: () => void;
  index: number;
}

function PhotoCard({ photo, onPress, index }: PhotoCardProps) {
  const { theme, skin } = useTheme();
  const scale = useSharedValue(1);
  const { opacity, translateY } = useStaggeredAnimation(index);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const config = pressableConfig[skin];

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(config.scaleDown, {
          damping: config.damping,
          stiffness: config.stiffness,
        });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, {
          damping: config.damping,
          stiffness: config.stiffness,
        });
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

export default function TimelineScreen() {
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<TimelineStackParamList>>();
  const { communityPhotos } = usePhotoStore();
  const [searchQuery, setSearchQuery] = useState("");

  // Group photos by decade (descending)
  const groupedByDecade = React.useMemo(() => {
    const grouped: Record<string, typeof communityPhotos> = {};
    communityPhotos.forEach((photo) => {
      const decade = Math.floor(photo.year / 10) * 10;
      const decadeKey = `${decade}S`;
      if (!grouped[decadeKey]) grouped[decadeKey] = [];
      grouped[decadeKey].push(photo);
    });

    return Object.entries(grouped)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .map(([decade, photos]) => ({ decade, photos }));
  }, [communityPhotos]);

  const handlePhotoPress = (photo: (typeof communityPhotos)[0]) => {
    navigation.navigate("PhotoDetail", { photoId: photo.id });
  };

  return (
    <ThemedView style={styles.container}>
      <CustomHeader
        photoCount={communityPhotos.length}
        title="archives"
        showMessageButton={true}
      />

      <FlatList
        data={groupedByDecade}
        contentContainerStyle={styles.listContent}
        scrollIndicatorInsets={{ right: 1 }}
        ListHeaderComponent={
          <View style={styles.headerSection}>
            {/* Search Bar */}
            <View
              style={[
                styles.searchContainer,
                {
                  backgroundColor: theme.backgroundSecondary,
                  borderColor: theme.border,
                },
              ]}
            >
              <Feather
                name="search"
                size={18}
                color={theme.textSecondary}
                style={styles.searchIcon}
              />
              <TextInput
                style={[
                  styles.searchInput,
                  { color: theme.text, outlineStyle: "none" } as any,
                ]}
                placeholder="SEARCH"
                placeholderTextColor={theme.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.decadeSection}>
            {/* Decade Header */}
            <ThemedText
              type="h2"
              style={[styles.decadeText, { color: theme.text }]}
            >
              {item.decade}
            </ThemedText>

            {/* Photo Grid */}
            <View style={styles.photoGrid}>
              {item.photos.map((photo, index) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  index={index}
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
    paddingBottom: Spacing["2xl"],
  },
  headerSection: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    letterSpacing: 0.5,
    padding: 0,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    paddingTop: Spacing["2xl"],
  },
  emptyTitle: {
    textAlign: "center",
  },
  decadeSection: {
    marginBottom: Spacing["2xl"],
  },
  decadeText: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: Spacing.lg,
    letterSpacing: 0.5,
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
