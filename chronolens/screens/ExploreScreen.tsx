import React, { useState } from "react";
import { 
  View, 
  StyleSheet, 
  Image, 
  Pressable,
  ScrollView,
  FlatList,
  Dimensions,
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
import { ExploreStackParamList } from "@/navigation/ExploreStackNavigator";
import { usePhotoStore, Photo } from "@/store/photoStore";

const { width } = Dimensions.get("window");
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DECADES = ["All", "2020s", "2010s", "2000s", "1990s", "1980s", "1970s", "1960s", "1950s"];

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

function FilterChip({ label, isSelected, onPress }: FilterChipProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: isSelected ? theme.sepia : theme.sepiaLight,
        },
      ]}
    >
      <ThemedText
        type="caption"
        style={[
          styles.chipText,
          { color: isSelected ? "#FFFFFF" : theme.sepia },
        ]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

interface FeedCardProps {
  photo: Photo;
  onPress: () => void;
  onUserPress: () => void;
  onLike: () => void;
  onComment: () => void;
}

function FeedCard({ photo, onPress, onUserPress, onLike, onComment }: FeedCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.98, { damping: 15, stiffness: 200 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      }}
      style={[
        styles.card,
        { backgroundColor: theme.backgroundDefault },
        Shadows.card,
        animatedStyle,
      ]}
    >
      <Image source={{ uri: photo.uri }} style={styles.cardImage} />
      
      <View style={styles.cardContent}>
        <Pressable onPress={onUserPress} style={styles.userRow}>
          <Image source={photo.userAvatar} style={styles.avatar} />
          <View style={styles.userInfo}>
            <ThemedText type="body" style={styles.username}>
              {photo.userName}
            </ThemedText>
            <View style={styles.pointsBadge}>
              <Feather name="star" size={10} color={theme.accent} />
              <ThemedText type="caption" style={{ color: theme.accent, marginLeft: 2 }}>
                {photo.userPoints}
              </ThemedText>
            </View>
          </View>
          <View style={[styles.yearBadge, { backgroundColor: theme.sepiaLight }]}>
            <ThemedText type="caption" style={[styles.yearText, { color: theme.sepia }]}>
              {photo.year}
            </ThemedText>
          </View>
        </Pressable>

        {photo.caption ? (
          <ThemedText type="body" style={styles.caption} numberOfLines={2}>
            {photo.caption}
          </ThemedText>
        ) : null}

        <View style={styles.actionsRow}>
          <Pressable onPress={onLike} style={styles.actionButton}>
            <Feather 
              name={photo.isLiked ? "heart" : "heart"} 
              size={20} 
              color={photo.isLiked ? theme.error : theme.textSecondary} 
            />
            <ThemedText type="small" style={[styles.actionCount, { color: theme.textSecondary }]}>
              {photo.likes}
            </ThemedText>
          </Pressable>
          <Pressable onPress={onComment} style={styles.actionButton}>
            <Feather name="message-circle" size={20} color={theme.textSecondary} />
            <ThemedText type="small" style={[styles.actionCount, { color: theme.textSecondary }]}>
              {photo.comments}
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </AnimatedPressable>
  );
}

function EmptyState() {
  const { theme } = useTheme();

  return (
    <View style={styles.emptyContainer}>
      <Image
        source={require("../assets/images/illustrations/empty-explore.png")}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <ThemedText type="h3" style={styles.emptyTitle}>
        Explore Community Photos
      </ThemedText>
      <ThemedText type="body" style={[styles.emptyText, { color: theme.textSecondary }]}>
        Be the first to share a photo with the community. Your memories could inspire others!
      </ThemedText>
    </View>
  );
}

export default function ExploreScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ExploreStackParamList>>();
  const { theme } = useTheme();
  const { paddingTop, paddingBottom } = useScreenInsets();
  const { communityPhotos, toggleLike } = usePhotoStore();
  const [selectedDecade, setSelectedDecade] = useState("All");

  const filteredPhotos = communityPhotos.filter((photo) => {
    if (selectedDecade === "All") return true;
    const decade = `${Math.floor(photo.year / 10) * 10}s`;
    return decade === selectedDecade;
  });

  const renderFeedCard = ({ item }: { item: Photo }) => (
    <FeedCard
      photo={item}
      onPress={() => navigation.navigate("PhotoDetail", { photoId: item.id })}
      onUserPress={() => navigation.navigate("UserProfile", { userId: item.userId || "1" })}
      onLike={() => toggleLike(item.id)}
      onComment={() => navigation.navigate("PhotoDetail", { photoId: item.id })}
    />
  );

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.filterContainer, { paddingTop }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {DECADES.map((decade) => (
            <FilterChip
              key={decade}
              label={decade}
              isSelected={selectedDecade === decade}
              onPress={() => setSelectedDecade(decade)}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredPhotos}
        renderItem={renderFeedCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.content,
          { paddingBottom },
          filteredPhotos.length === 0 && styles.emptyContent,
        ]}
        ListEmptyComponent={EmptyState}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.lg }} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  filterContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  chipText: {
    textTransform: "uppercase",
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
  card: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 250,
  },
  cardContent: {
    padding: Spacing.lg,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  userInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  username: {
    fontWeight: "600",
  },
  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  yearBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  yearText: {
    textTransform: "uppercase",
  },
  caption: {
    marginBottom: Spacing.md,
  },
  actionsRow: {
    flexDirection: "row",
    gap: Spacing.xl,
    marginTop: Spacing.sm,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  actionCount: {
    marginLeft: Spacing.xs,
  },
});
