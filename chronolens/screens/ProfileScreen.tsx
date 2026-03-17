import React, { useMemo } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { CustomHeader } from "@/components/CustomHeader";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { useAuth } from "@/contexts/AuthContext";
import { usePhotoStore } from "@/store/photoStore";
import { ProfileStackParamList } from "@/navigation/ProfileStackNavigator";

type ProfileNav = NativeStackNavigationProp<ProfileStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileNav>();
  const { paddingBottom } = useScreenInsets();
  const { user, logout } = useAuth();
  const { photos } = usePhotoStore();
  const { theme, fonts, skin, isDark } = useTheme();

  const styles = useMemo(
    () => createStyles(theme, fonts, skin, paddingBottom, isDark),
    [theme, fonts, skin, paddingBottom, isDark],
  );

  const stats = useMemo(
    () => [
      {
        label: "Memories",
        value: String(photos.length),
        icon: "image" as const,
      },
      { label: "Members", value: "12", icon: "users" as const },
      { label: "Generations", value: "3", icon: "git-branch" as const },
      { label: "Animated", value: "12", icon: "zap" as const },
    ],
    [photos.length],
  );

  const achievements = useMemo(
    () => [
      {
        title: "First Century",
        description: "100 photos catalogued",
        unlocked: true,
      },
      {
        title: "Daily Chronicler",
        description: "7 days in a row",
        unlocked: true,
      },
      {
        title: "World Explorer",
        description: "25+ locations",
        unlocked: false,
      },
      {
        title: "Metadata Master",
        description: "100 photos edited",
        unlocked: false,
      },
    ],
    [],
  );

  const recentActivity = useMemo(
    () => [
      {
        action: "Catalogued 12 photos",
        location: "1980s Album",
        time: "2 hours ago",
      },
      {
        action: "Animated Grandpa Joe",
        location: "Leonardo AI",
        time: "Yesterday",
      },
      {
        action: "Added story to REF.1954-002",
        location: "Miller Wedding",
        time: "3 days ago",
      },
    ],
    [],
  );

  const displayName = user?.name || "ChronoLens Curator";
  const displayEmail = user?.email || "curator@chronolens.app";

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      Alert.alert("Sign out failed", "Please try again.");
    }
  };

  return (
    <View style={styles.screen}>
      <CustomHeader variant="actionsOnly" />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.heroTextWrap}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.metaText}>{displayEmail}</Text>
            <Text style={styles.bioText}>
              Preserving family archives and crafting stories across
              generations.
            </Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((item) => (
            <View key={item.label} style={styles.statCard}>
              <View style={styles.statIconWrap}>
                <Feather name={item.icon} size={16} color={theme.accent} />
              </View>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.rowActions}>
            <ActionButton
              label="Invite Family"
              icon="user-plus"
              onPress={() => Alert.alert("Invite", "Coming soon")}
              styles={styles}
            />
            <ActionButton
              label="Add Story"
              icon="book-open"
              onPress={() => Alert.alert("Stories", "Coming soon")}
              styles={styles}
            />
            <ActionButton
              label="Animate"
              icon="zap"
              onPress={() =>
                Alert.alert("Animate", "Connect Leonardo flow next")
              }
              styles={styles}
            />
            <ActionButton
              label="Share"
              icon="share-2"
              onPress={() => Alert.alert("Share", "Coming soon")}
              styles={styles}
            />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Storage</Text>

          <View style={styles.storageHeaderRow}>
            <Text style={styles.storageMainText}>12.4 GB used</Text>
            <Text style={styles.storageSecondaryText}>50 GB total</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <View style={styles.backupCard}>
            <Feather name="cloud" size={15} color={theme.accent} />
            <View>
              <Text style={styles.backupTitle}>Last Backup</Text>
              <Text style={styles.backupSubtitle}>Today at 04:30 AM</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {achievements.map((item) => (
            <View
              key={item.title}
              style={[
                styles.achievementRow,
                item.unlocked
                  ? styles.achievementUnlocked
                  : styles.achievementLocked,
              ]}
            >
              <View style={styles.achievementLeft}>
                <Feather
                  name="award"
                  size={15}
                  color={item.unlocked ? theme.accent : theme.textSecondary}
                />
                <View>
                  <Text
                    style={[
                      styles.achievementTitle,
                      !item.unlocked && styles.dimmedText,
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.achievementDesc,
                      !item.unlocked && styles.dimmedText,
                    ]}
                  >
                    {item.description}
                  </Text>
                </View>
              </View>
              {item.unlocked && (
                <Feather name="check-circle" size={15} color={theme.accent} />
              )}
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivity.map((item, index) => (
            <View key={`${item.action}-${index}`} style={styles.activityRow}>
              <View style={styles.activityDot} />
              <View style={styles.activityBody}>
                <Text style={styles.activityAction}>{item.action}</Text>
                <View style={styles.activityMetaRow}>
                  <View style={styles.activityMetaItem}>
                    <Feather
                      name="map-pin"
                      size={11}
                      color={theme.textSecondary}
                    />
                    <Text style={styles.activityMetaText}>{item.location}</Text>
                  </View>
                  <View style={styles.activityMetaItem}>
                    <Feather
                      name="clock"
                      size={11}
                      color={theme.textSecondary}
                    />
                    <Text style={styles.activityMetaText}>{item.time}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account</Text>

          <Pressable
            onPress={() => navigation.navigate("EditProfile")}
            style={styles.linkRow}
          >
            <View style={styles.linkRowLeft}>
              <Feather name="edit-3" size={16} color={theme.text} />
              <Text style={styles.linkText}>Edit Profile</Text>
            </View>
            <Feather
              name="chevron-right"
              size={16}
              color={theme.textSecondary}
            />
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("Settings")}
            style={styles.linkRow}
          >
            <View style={styles.linkRowLeft}>
              <Feather name="settings" size={16} color={theme.text} />
              <Text style={styles.linkText}>Settings</Text>
            </View>
            <Feather
              name="chevron-right"
              size={16}
              color={theme.textSecondary}
            />
          </Pressable>

          <Pressable
            onPress={handleLogout}
            style={[styles.linkRow, styles.logoutRow]}
          >
            <View style={styles.linkRowLeft}>
              <Feather name="log-out" size={16} color={theme.error} />
              <Text style={styles.logoutText}>Sign Out</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function ActionButton({
  label,
  icon,
  onPress,
  styles,
}: {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <Pressable onPress={onPress} style={styles.actionButton}>
      <Feather name={icon} size={16} color={styles.__accentColor} />
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

function createStyles(
  theme: any,
  fonts: any,
  skin: "historian" | "cyberpunk",
  bottomInset: number,
  isDark: boolean,
) {
  const accentGlow = skin === "cyberpunk" ? theme.accent : theme.border;

  return Object.assign(
    StyleSheet.create({
      screen: {
        flex: 1,
        backgroundColor: theme.backgroundRoot,
      },
      contentContainer: {
        paddingTop: 12,
        paddingHorizontal: 16,
        paddingBottom: Math.max(bottomInset, 20) + 24,
        gap: 14,
      },
      heroCard: {
        backgroundColor: theme.card,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 18,
        padding: 16,
        flexDirection: "row",
        gap: 14,
        alignItems: "center",
      },
      avatarCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: `${theme.accent}22`,
        borderWidth: 1,
        borderColor: `${theme.accent}55`,
      },
      avatarText: {
        color: theme.accent,
        fontSize: 30,
        fontFamily: fonts.header,
      },
      heroTextWrap: {
        flex: 1,
      },
      name: {
        color: theme.text,
        fontSize: 22,
        fontFamily: fonts.header,
      },
      metaText: {
        color: theme.textSecondary,
        fontSize: 12,
        marginTop: 2,
        fontFamily: fonts.mono,
      },
      bioText: {
        color: theme.text,
        opacity: 0.85,
        marginTop: 8,
        fontSize: 13,
        lineHeight: 18,
        fontFamily: fonts.body,
      },
      statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
      },
      statCard: {
        width: "48.5%",
        backgroundColor: theme.card,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 14,
        padding: 12,
      },
      statIconWrap: {
        width: 30,
        height: 30,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: `${theme.accent}1A`,
      },
      statValue: {
        color: theme.text,
        marginTop: 10,
        fontSize: 20,
        fontFamily: fonts.header,
      },
      statLabel: {
        color: theme.textSecondary,
        marginTop: 2,
        fontSize: 11,
        fontFamily: fonts.mono,
        textTransform: "uppercase",
      },
      sectionCard: {
        backgroundColor: theme.card,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 14,
        padding: 14,
      },
      sectionTitle: {
        color: theme.text,
        fontSize: 16,
        marginBottom: 12,
        fontFamily: fonts.header,
      },
      dimmedText: {
        opacity: 0.5,
      },
      rowActions: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
      },
      actionButton: {
        width: "48.5%",
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 10,
        alignItems: "center",
        gap: 6,
        backgroundColor: theme.backgroundSecondary,
      },
      actionLabel: {
        color: theme.text,
        fontSize: 11,
        textAlign: "center",
        fontFamily: fonts.mono,
      },
      storageHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
      },
      storageMainText: {
        color: theme.text,
        fontSize: 13,
        fontFamily: fonts.body,
      },
      storageSecondaryText: {
        color: theme.textSecondary,
        fontSize: 12,
        fontFamily: fonts.mono,
      },
      progressTrack: {
        height: 8,
        borderRadius: 999,
        overflow: "hidden",
        backgroundColor: theme.backgroundSecondary,
        borderWidth: 1,
        borderColor: theme.border,
      },
      progressFill: {
        width: "25%",
        height: "100%",
        backgroundColor: theme.accent,
      },
      backupCard: {
        marginTop: 12,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 10,
        backgroundColor: theme.backgroundSecondary,
        paddingVertical: 10,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      },
      backupTitle: {
        color: theme.text,
        fontSize: 13,
        fontFamily: fonts.body,
      },
      backupSubtitle: {
        color: theme.textSecondary,
        fontSize: 11,
        marginTop: 1,
        fontFamily: fonts.mono,
      },
      achievementRow: {
        borderRadius: 10,
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
      achievementUnlocked: {
        borderColor: `${theme.accent}66`,
        backgroundColor: `${theme.accent}12`,
      },
      achievementLocked: {
        borderColor: theme.border,
        backgroundColor: theme.backgroundSecondary,
      },
      achievementLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      },
      achievementTitle: {
        color: theme.text,
        fontSize: 13,
        fontFamily: fonts.body,
      },
      achievementDesc: {
        color: theme.textSecondary,
        marginTop: 2,
        fontSize: 11,
        fontFamily: fonts.mono,
      },
      activityRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
        marginBottom: 12,
      },
      activityDot: {
        marginTop: 5,
        width: 9,
        height: 9,
        borderRadius: 999,
        backgroundColor: theme.accent,
      },
      activityBody: {
        flex: 1,
      },
      activityAction: {
        color: theme.text,
        fontSize: 13,
        fontFamily: fonts.body,
      },
      activityMetaRow: {
        marginTop: 4,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
      },
      activityMetaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
      },
      activityMetaText: {
        color: theme.textSecondary,
        fontSize: 11,
        fontFamily: fonts.mono,
      },
      linkRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 10,
        backgroundColor: theme.backgroundSecondary,
        paddingHorizontal: 12,
        paddingVertical: 11,
        marginBottom: 8,
      },
      linkRowLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      },
      linkText: {
        color: theme.text,
        fontSize: 14,
        fontFamily: fonts.body,
      },
      logoutRow: {
        marginTop: 4,
      },
      logoutText: {
        color: theme.error,
        fontSize: 14,
        fontFamily: fonts.body,
      },
    }),
    {
      __accentColor: theme.accent,
      __glowColor: accentGlow,
      __darkMode: isDark,
    },
  );
}
