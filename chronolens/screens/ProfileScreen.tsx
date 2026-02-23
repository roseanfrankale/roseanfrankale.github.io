import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { usePhotoStore } from "@/store/photoStore";

type TabType = "overview" | "settings" | "leonardo";

export default function ProfileScreen() {
  const { theme, fonts, skin, toggleTheme } = useTheme();
  const { paddingTop } = useScreenInsets();
  const { user, logout } = useAuth();
  const { photos } = usePhotoStore();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [avatar, setAvatar] = useState(user?.avatar);

  // Mock family statistics
  const stats = {
    members: 12,
    generations: 3,
    locations: 8,
    decades: 7,
    oldestPhoto: 1945,
    newestPhoto: 2024,
    totalPhotos: photos.length,
  };

  const handlePickAvatar = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Please grant photo library access.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatar({ uri: result.assets[0].uri });
    }
  };

  const renderTabButton = (
    tab: TabType,
    label: string,
    icon: keyof typeof Feather.glyphMap,
  ) => (
    <Pressable
      style={[
        styles.tabButton,
        activeTab === tab && {
          backgroundColor: theme.accent,
          borderColor: theme.accent,
        },
        { borderColor: theme.border },
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Feather
        name={icon}
        size={18}
        color={activeTab === tab ? theme.backgroundDefault : theme.text}
      />
      <ThemedText
        style={[
          styles.tabButtonText,
          { fontFamily: fonts.mono },
          activeTab === tab && { color: theme.backgroundDefault },
        ]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );

  const renderOverviewTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Family Statistics */}
      <View
        style={[
          styles.section,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <ThemedText
          style={[
            styles.sectionTitle,
            { fontFamily: fonts.header, color: theme.text },
          ]}
        >
          Family Archive Statistics
        </ThemedText>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <ThemedText
              style={[
                styles.statValue,
                { fontFamily: fonts.mono, color: theme.accent },
              ]}
            >
              {stats.members}
            </ThemedText>
            <ThemedText
              style={[styles.statLabel, { color: theme.textSecondary }]}
            >
              Family Members
            </ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText
              style={[
                styles.statValue,
                { fontFamily: fonts.mono, color: theme.accent },
              ]}
            >
              {stats.generations}
            </ThemedText>
            <ThemedText
              style={[styles.statLabel, { color: theme.textSecondary }]}
            >
              Generations
            </ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText
              style={[
                styles.statValue,
                { fontFamily: fonts.mono, color: theme.accent },
              ]}
            >
              {stats.locations}
            </ThemedText>
            <ThemedText
              style={[styles.statLabel, { color: theme.textSecondary }]}
            >
              Locations
            </ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText
              style={[
                styles.statValue,
                { fontFamily: fonts.mono, color: theme.accent },
              ]}
            >
              {stats.decades}
            </ThemedText>
            <ThemedText
              style={[styles.statLabel, { color: theme.textSecondary }]}
            >
              Decades
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Archive Timeline */}
      <View
        style={[
          styles.section,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <View style={styles.timelineBanner}>
          <View style={styles.timelineYearBox}>
            <ThemedText
              style={[
                styles.timelineYear,
                { fontFamily: fonts.mono, color: theme.accent },
              ]}
            >
              {stats.oldestPhoto}
            </ThemedText>
            <ThemedText
              style={[styles.timelineLabel, { color: theme.textSecondary }]}
            >
              Oldest
            </ThemedText>
          </View>
          <View
            style={[styles.timelineLine, { backgroundColor: theme.accent }]}
          />
          <View style={styles.timelineYearBox}>
            <ThemedText
              style={[
                styles.timelineYear,
                { fontFamily: fonts.mono, color: theme.accent },
              ]}
            >
              {stats.newestPhoto}
            </ThemedText>
            <ThemedText
              style={[styles.timelineLabel, { color: theme.textSecondary }]}
            >
              Newest
            </ThemedText>
          </View>
        </View>
        <ThemedText
          style={[
            styles.timelineCaption,
            { fontFamily: fonts.mono, color: theme.textSecondary },
          ]}
        >
          {stats.newestPhoto - stats.oldestPhoto} years of family history
          preserved
        </ThemedText>
      </View>

      {/* Quick Actions */}
      <View
        style={[
          styles.section,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <ThemedText
          style={[
            styles.sectionTitle,
            { fontFamily: fonts.header, color: theme.text },
          ]}
        >
          Quick Actions
        </ThemedText>
        <Pressable
          style={[
            styles.actionButton,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <Feather name="image" size={20} color={theme.text} />
          <ThemedText style={{ flex: 1, color: theme.text }}>
            View All Photos
          </ThemedText>
          <ThemedText
            style={[
              styles.actionCount,
              { fontFamily: fonts.mono, color: theme.accent },
            ]}
          >
            {stats.totalPhotos}
          </ThemedText>
        </Pressable>
        <Pressable
          style={[
            styles.actionButton,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <Feather name="users" size={20} color={theme.text} />
          <ThemedText style={{ flex: 1, color: theme.text }}>
            Family Members
          </ThemedText>
          <ThemedText
            style={[
              styles.actionCount,
              { fontFamily: fonts.mono, color: theme.accent },
            ]}
          >
            {stats.members}
          </ThemedText>
        </Pressable>
        <Pressable
          style={[
            styles.actionButton,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <Feather name="map-pin" size={20} color={theme.text} />
          <ThemedText style={{ flex: 1, color: theme.text }}>
            Locations
          </ThemedText>
          <ThemedText
            style={[
              styles.actionCount,
              { fontFamily: fonts.mono, color: theme.accent },
            ]}
          >
            {stats.locations}
          </ThemedText>
        </Pressable>
        <Pressable
          style={[
            styles.actionButton,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <Feather name="heart" size={20} color={theme.text} />
          <ThemedText style={{ flex: 1, color: theme.text }}>
            Favorites
          </ThemedText>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </Pressable>
      </View>

      {/* Account Info */}
      <View
        style={[
          styles.section,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <ThemedText
          style={[
            styles.sectionTitle,
            { fontFamily: fonts.header, color: theme.text },
          ]}
        >
          Account Information
        </ThemedText>
        <View style={styles.infoRow}>
          <ThemedText
            style={[styles.infoLabel, { color: theme.textSecondary }]}
          >
            Family Archive
          </ThemedText>
          <ThemedText
            style={[
              styles.infoValue,
              { fontFamily: fonts.mono, color: theme.text },
            ]}
          >
            Frank-Alexander Family
          </ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText
            style={[styles.infoLabel, { color: theme.textSecondary }]}
          >
            Member Since
          </ThemedText>
          <ThemedText
            style={[
              styles.infoValue,
              { fontFamily: fonts.mono, color: theme.text },
            ]}
          >
            January 2024
          </ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText
            style={[styles.infoLabel, { color: theme.textSecondary }]}
          >
            Role
          </ThemedText>
          <ThemedText
            style={[
              styles.infoValue,
              { fontFamily: fonts.mono, color: theme.text },
            ]}
          >
            Curator
          </ThemedText>
        </View>
      </View>
    </ScrollView>
  );

  const renderSettingsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Theme Switcher */}
      <View
        style={[
          styles.section,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <ThemedText
          style={[
            styles.sectionTitle,
            { fontFamily: fonts.header, color: theme.text },
          ]}
        >
          App Theme
        </ThemedText>
        <View style={styles.themeGrid}>
          <Pressable
            style={[
              styles.themeCard,
              skin === "historian" && {
                borderColor: theme.accent,
                borderWidth: 2,
              },
              { backgroundColor: "#FFF8E7", borderColor: "#D4AF37" },
            ]}
            onPress={() => {
              if (skin !== "historian" && toggleTheme) {
                toggleTheme();
              }
            }}
          >
            <View style={[styles.themeIcon, { backgroundColor: "#8B7355" }]}>
              <ThemedText style={styles.themeEmoji}>🗺️</ThemedText>
            </View>
            <ThemedText style={[styles.themeName, { color: "#2C2416" }]}>
              Historian
            </ThemedText>
            <ThemedText style={[styles.themeDescription, { color: "#8B7355" }]}>
              Warm & Classic
            </ThemedText>
            {skin === "historian" && (
              <View
                style={[
                  styles.themeCheckmark,
                  { backgroundColor: theme.accent },
                ]}
              >
                <Feather name="check" size={12} color="#FFF" />
              </View>
            )}
          </Pressable>

          <Pressable
            style={[
              styles.themeCard,
              skin === "cyberpunk" && {
                borderColor: theme.accent,
                borderWidth: 2,
              },
              { backgroundColor: "#0A0E27", borderColor: "#00F0FF" },
            ]}
            onPress={() => {
              if (skin !== "cyberpunk" && toggleTheme) {
                toggleTheme();
              }
            }}
          >
            <View style={[styles.themeIcon, { backgroundColor: "#00F0FF" }]}>
              <ThemedText style={styles.themeEmoji}>🌐</ThemedText>
            </View>
            <ThemedText style={[styles.themeName, { color: "#E0E0E0" }]}>
              Cyberpunk
            </ThemedText>
            <ThemedText style={[styles.themeDescription, { color: "#9CA3AF" }]}>
              Dark & Modern
            </ThemedText>
            {skin === "cyberpunk" && (
              <View
                style={[
                  styles.themeCheckmark,
                  { backgroundColor: theme.accent },
                ]}
              >
                <Feather name="check" size={12} color="#0A0E27" />
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {/* Preferences */}
      <View
        style={[
          styles.section,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <ThemedText
          style={[
            styles.sectionTitle,
            { fontFamily: fonts.header, color: theme.text },
          ]}
        >
          Preferences
        </ThemedText>
        <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
          <View style={styles.settingInfo}>
            <Feather name="bell" size={20} color={theme.text} />
            <View style={{ flex: 1 }}>
              <ThemedText style={[styles.settingLabel, { color: theme.text }]}>
                Notifications
              </ThemedText>
              <ThemedText
                style={[
                  styles.settingDescription,
                  { color: theme.textSecondary },
                ]}
              >
                Family updates and new photos
              </ThemedText>
            </View>
          </View>
          <Switch value={true} onValueChange={() => {}} />
        </View>
        <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
          <View style={styles.settingInfo}>
            <Feather name="lock" size={20} color={theme.text} />
            <View style={{ flex: 1 }}>
              <ThemedText style={[styles.settingLabel, { color: theme.text }]}>
                Privacy
              </ThemedText>
              <ThemedText
                style={[
                  styles.settingDescription,
                  { color: theme.textSecondary },
                ]}
              >
                Control who sees your profile
              </ThemedText>
            </View>
          </View>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </View>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Feather name="help-circle" size={20} color={theme.text} />
            <View style={{ flex: 1 }}>
              <ThemedText style={[styles.settingLabel, { color: theme.text }]}>
                Help & Support
              </ThemedText>
              <ThemedText
                style={[
                  styles.settingDescription,
                  { color: theme.textSecondary },
                ]}
              >
                FAQs, tutorials, and contact
              </ThemedText>
            </View>
          </View>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </View>
      </View>

      {/* Logout */}
      <Pressable
        style={[
          styles.logoutButton,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
        onPress={() => {
          Alert.alert("Sign Out", "Are you sure you want to sign out?", [
            { text: "Cancel", style: "cancel" },
            { text: "Sign Out", style: "destructive", onPress: logout },
          ]);
        }}
      >
        <Feather name="log-out" size={20} color="#EF4444" />
        <ThemedText style={[styles.logoutText, { fontFamily: fonts.mono }]}>
          Sign Out
        </ThemedText>
      </Pressable>
    </ScrollView>
  );

  const renderLeonardoTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Leonardo AI Banner */}
      <View
        style={[
          styles.section,
          {
            backgroundColor: theme.accent + "20",
            borderColor: theme.accent,
            borderWidth: 2,
          },
        ]}
      >
        <View style={styles.leonardoHeader}>
          <ThemedText style={styles.leonardoEmoji}>🎨</ThemedText>
          <View style={{ flex: 1 }}>
            <ThemedText
              style={[
                styles.leonardoTitle,
                { fontFamily: fonts.header, color: theme.text },
              ]}
            >
              Leonardo AI Animations
            </ThemedText>
            <ThemedText
              style={[styles.leonardoSubtitle, { color: theme.textSecondary }]}
            >
              Bring your family photos to life
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Description */}
      <View
        style={[
          styles.section,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <ThemedText style={[styles.leonardoDescription, { color: theme.text }]}>
          Transform static family photographs into animated memories using
          advanced AI technology. Watch ancestors smile, children wave, and
          special moments come alive with realistic movement.
        </ThemedText>
      </View>

      {/* Features */}
      <View
        style={[
          styles.section,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <ThemedText
          style={[
            styles.sectionTitle,
            { fontFamily: fonts.header, color: theme.text },
          ]}
        >
          Animation Features
        </ThemedText>
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <View
              style={[
                styles.featureIcon,
                { backgroundColor: theme.accent + "20" },
              ]}
            >
              <ThemedText style={styles.featureEmoji}>✨</ThemedText>
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={[styles.featureTitle, { color: theme.text }]}>
                Natural Motion
              </ThemedText>
              <ThemedText
                style={[
                  styles.featureDescription,
                  { color: theme.textSecondary },
                ]}
              >
                Subtle facial expressions and realistic movement
              </ThemedText>
            </View>
          </View>
          <View style={styles.featureItem}>
            <View
              style={[
                styles.featureIcon,
                { backgroundColor: theme.accent + "20" },
              ]}
            >
              <ThemedText style={styles.featureEmoji}>🎭</ThemedText>
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={[styles.featureTitle, { color: theme.text }]}>
                Portrait Animation
              </ThemedText>
              <ThemedText
                style={[
                  styles.featureDescription,
                  { color: theme.textSecondary },
                ]}
              >
                Make portrait photos smile, blink, and turn their heads
              </ThemedText>
            </View>
          </View>
          <View style={styles.featureItem}>
            <View
              style={[
                styles.featureIcon,
                { backgroundColor: theme.accent + "20" },
              ]}
            >
              <ThemedText style={styles.featureEmoji}>⚡</ThemedText>
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={[styles.featureTitle, { color: theme.text }]}>
                Fast Processing
              </ThemedText>
              <ThemedText
                style={[
                  styles.featureDescription,
                  { color: theme.textSecondary },
                ]}
              >
                Generate animations in seconds with cloud processing
              </ThemedText>
            </View>
          </View>
          <View style={styles.featureItem}>
            <View
              style={[
                styles.featureIcon,
                { backgroundColor: theme.accent + "20" },
              ]}
            >
              <ThemedText style={styles.featureEmoji}>💾</ThemedText>
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={[styles.featureTitle, { color: theme.text }]}>
                Save & Share
              </ThemedText>
              <ThemedText
                style={[
                  styles.featureDescription,
                  { color: theme.textSecondary },
                ]}
              >
                Export animated memories to share with family
              </ThemedText>
            </View>
          </View>
        </View>
      </View>

      {/* Connect Button */}
      <Pressable
        style={[
          styles.connectButton,
          {
            backgroundColor: theme.accent,
          },
        ]}
        onPress={() => {
          Alert.alert(
            "Leonardo AI",
            "Connect your Leonardo AI account to enable photo animations. You'll need an API key from leonardo.ai",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Learn More", onPress: () => {} },
            ],
          );
        }}
      >
        <Feather name="link" size={20} color={theme.backgroundDefault} />
        <ThemedText
          style={[
            styles.connectButtonText,
            {
              fontFamily: fonts.mono,
              color: theme.backgroundDefault,
            },
          ]}
        >
          Connect Leonardo AI
        </ThemedText>
      </Pressable>

      {/* API Note */}
      <View
        style={[
          styles.section,
          {
            backgroundColor: theme.backgroundSecondary,
            borderColor: theme.border,
          },
        ]}
      >
        <ThemedText style={[styles.apiNote, { color: theme.textSecondary }]}>
          <Feather name="info" size={14} color={theme.textSecondary} /> Requires
          Leonardo AI account and API key. Visit leonardo.ai to sign up.
        </ThemedText>
      </View>
    </ScrollView>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundDefault }]}
    >
      {/* Header with Avatar */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.backgroundDefault,
            borderBottomColor: theme.border,
            paddingTop: paddingTop + Spacing.xl,
          },
        ]}
      >
        <Pressable onPress={handlePickAvatar}>
          <Image
            source={avatar || require("@/assets/images/avatars/camera.png")}
            style={[styles.avatar, { borderColor: theme.accent }]}
          />
          <View style={[styles.avatarEdit, { backgroundColor: theme.accent }]}>
            <Feather name="camera" size={14} color={theme.backgroundDefault} />
          </View>
        </Pressable>
        <View style={styles.headerInfo}>
          <ThemedText
            style={[
              styles.headerName,
              { fontFamily: fonts.header, color: theme.text },
            ]}
          >
            {user?.name || "Family Curator"}
          </ThemedText>
          <ThemedText
            style={[
              styles.headerEmail,
              { fontFamily: fonts.mono, color: theme.textSecondary },
            ]}
          >
            {user?.email || "curator@chronolens.app"}
          </ThemedText>
        </View>
      </View>

      {/* Tab Navigation */}
      <View
        style={[
          styles.tabBar,
          {
            backgroundColor: theme.backgroundDefault,
            borderBottomColor: theme.border,
          },
        ]}
      >
        {renderTabButton("overview", "Overview", "home")}
        {renderTabButton("settings", "Settings", "settings")}
        {renderTabButton("leonardo", "Leonardo AI", "zap")}
      </View>

      {/* Tab Content */}
      {activeTab === "overview" && renderOverviewTab()}
      {activeTab === "settings" && renderSettingsTab()}
      {activeTab === "leonardo" && renderLeonardoTab()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
    gap: Spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
  },
  avatarEdit: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 20,
    fontWeight: "400",
    marginBottom: 4,
  },
  headerEmail: {
    fontSize: 12,
    opacity: 0.7,
  },
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    borderBottomWidth: 1,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  tabButtonText: {
    fontSize: 12,
  },
  tabContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  section: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    padding: Spacing.md,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  timelineBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  timelineYearBox: {
    alignItems: "center",
  },
  timelineYear: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  timelineLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  timelineLine: {
    flex: 1,
    height: 2,
    marginHorizontal: Spacing.md,
  },
  timelineCaption: {
    fontSize: 12,
    textAlign: "center",
    opacity: 0.7,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  actionCount: {
    fontSize: 14,
    fontWeight: "bold",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
  },
  themeGrid: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  themeCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: "center",
    position: "relative",
  },
  themeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  themeEmoji: {
    fontSize: 24,
  },
  themeName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  themeDescription: {
    fontSize: 12,
  },
  themeCheckmark: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: Spacing.md,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  logoutText: {
    fontSize: 14,
    color: "#EF4444",
  },
  leonardoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  leonardoEmoji: {
    fontSize: 48,
  },
  leonardoTitle: {
    fontSize: 20,
    fontWeight: "400",
    marginBottom: 4,
  },
  leonardoSubtitle: {
    fontSize: 14,
  },
  leonardoDescription: {
    fontSize: 14,
    lineHeight: 22,
  },
  featureList: {
    gap: Spacing.md,
  },
  featureItem: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  featureEmoji: {
    fontSize: 20,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    lineHeight: 18,
  },
  connectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  apiNote: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
});
