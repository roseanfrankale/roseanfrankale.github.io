import React from "react";
import { View, StyleSheet, Image, Pressable, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { ProfileStackParamList } from "@/navigation/ProfileStackNavigator";
import { useUserStore } from "@/store/userStore";
import { usePhotoStore } from "@/store/photoStore";

const { width } = Dimensions.get("window");
const PHOTO_SIZE = (width - Spacing.xl * 2 - Spacing.sm * 2) / 3;

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

export default function ProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { theme } = useTheme();
  const { user } = useUserStore();
  const { photos } = usePhotoStore();

  const sharedCount = photos.filter((p) => p.isShared).length;

  return (
    <ScreenScrollView>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.navigate("Settings")}
          style={({ pressed }) => [
            styles.settingsButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Feather name="settings" size={24} color={theme.text} />
        </Pressable>
      </View>

      <View style={styles.profileSection}>
        <Image source={user.avatar} style={styles.avatar} />
        <ThemedText type="h2" style={styles.displayName}>
          {user.displayName}
        </ThemedText>
        {user.bio ? (
          <ThemedText
            type="body"
            style={[styles.bio, { color: theme.textSecondary }]}
          >
            {user.bio}
          </ThemedText>
        ) : null}

        <View style={[styles.pointsBadge, { backgroundColor: theme.accent }]}>
          <Feather name="star" size={14} color="#FFFFFF" />
          <ThemedText type="body" style={styles.pointsText}>
            {user.points} points
          </ThemedText>
        </View>
      </View>

      <View
        style={[styles.statsRow, { backgroundColor: theme.backgroundDefault }]}
      >
        <StatItem label="Photos" value={photos.length} />
        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
        <StatItem label="Shared" value={sharedCount} />
        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
        <StatItem label="Points" value={user.points} />
      </View>

      <Pressable
        onPress={() => navigation.navigate("EditProfile")}
        style={({ pressed }) => [
          styles.editButton,
          {
            borderColor: theme.sepia,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <ThemedText
          type="body"
          style={[styles.editButtonText, { color: theme.sepia }]}
        >
          Edit Profile
        </ThemedText>
      </Pressable>

      {photos.length > 0 ? (
        <View style={styles.photosSection}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Recent Uploads
          </ThemedText>
          <View style={styles.photoGrid}>
            {photos.slice(0, 6).map((photo) => (
              <Pressable
                key={photo.id}
                style={({ pressed }) => [
                  styles.photoContainer,
                  {
                    backgroundColor: theme.backgroundSecondary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Image source={{ uri: photo.uri }} style={styles.photo} />
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.joinedSection}>
        <Feather name="calendar" size={16} color={theme.textSecondary} />
        <ThemedText
          type="small"
          style={{ color: theme.textSecondary, marginLeft: Spacing.sm }}
        >
          Joined {user.joinedDate}
        </ThemedText>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: Spacing.md,
  },
  settingsButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
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
  editButton: {
    borderWidth: 1,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  editButtonText: {
    fontWeight: "600",
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
  joinedSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.lg,
  },
});
