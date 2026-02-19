import React from "react";
import { 
  View, 
  StyleSheet, 
  Image, 
  Pressable,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRoute, RouteProp } from "@react-navigation/native";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { ExploreStackParamList } from "@/navigation/ExploreStackNavigator";

const { width } = Dimensions.get("window");
const PHOTO_SIZE = (width - Spacing.xl * 2 - Spacing.sm * 2) / 3;

const SAMPLE_USER_PHOTOS = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300",
  "https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=300",
  "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=300",
];

const AVATARS = {
  camera: require("../assets/images/avatars/camera.png"),
  film: require("../assets/images/avatars/film.png"),
  polaroid: require("../assets/images/avatars/polaroid.png"),
  album: require("../assets/images/avatars/album.png"),
};

const SAMPLE_USERS: Record<string, { name: string; bio: string; avatar: keyof typeof AVATARS; points: number; photos: number }> = {
  u1: { name: "Sarah M.", bio: "Preserving family memories since 1985", avatar: "camera", points: 850, photos: 24 },
  u2: { name: "Michael R.", bio: "History enthusiast and vintage photo collector", avatar: "film", points: 620, photos: 18 },
  u3: { name: "Jessica L.", bio: "Documenting life one photo at a time", avatar: "polaroid", points: 1200, photos: 42 },
  u4: { name: "David K.", bio: "Road trip memories and adventure stories", avatar: "album", points: 980, photos: 31 },
};

interface StatItemProps {
  label: string;
  value: number;
}

function StatItem({ label, value }: StatItemProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.statItem}>
      <ThemedText type="h3" style={{ color: theme.sepia }}>
        {value}
      </ThemedText>
      <ThemedText type="caption" style={{ color: theme.textSecondary }}>
        {label}
      </ThemedText>
    </View>
  );
}

export default function UserProfileScreen() {
  const route = useRoute<RouteProp<ExploreStackParamList, "UserProfile">>();
  const { theme } = useTheme();
  
  const userData = SAMPLE_USERS[route.params.userId] || SAMPLE_USERS.u1;

  return (
    <ScreenScrollView>
      <View style={styles.profileSection}>
        <Image source={AVATARS[userData.avatar]} style={styles.avatar} />
        <ThemedText type="h2" style={styles.displayName}>
          {userData.name}
        </ThemedText>
        <ThemedText type="body" style={[styles.bio, { color: theme.textSecondary }]}>
          {userData.bio}
        </ThemedText>
        
        <View style={[styles.pointsBadge, { backgroundColor: theme.accent }]}>
          <Feather name="star" size={14} color="#FFFFFF" />
          <ThemedText type="body" style={styles.pointsText}>
            {userData.points} points
          </ThemedText>
        </View>
      </View>

      <View style={[styles.statsRow, { backgroundColor: theme.backgroundDefault }]}>
        <StatItem label="Photos" value={userData.photos} />
        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
        <StatItem label="Points" value={userData.points} />
      </View>

      <View style={styles.photosSection}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Shared Photos
        </ThemedText>
        <View style={styles.photoGrid}>
          {SAMPLE_USER_PHOTOS.map((uri, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.photoContainer,
                { 
                  backgroundColor: theme.backgroundSecondary,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Image source={{ uri }} style={styles.photo} />
            </Pressable>
          ))}
        </View>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: Spacing.lg,
  },
  displayName: {
    marginBottom: Spacing.xs,
  },
  bio: {
    textAlign: "center",
    marginBottom: Spacing.lg,
    maxWidth: 280,
  },
  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  pointsText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: Spacing.xl,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  statItem: {
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  photosSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
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
});
