import React, { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { CustomHeader } from "@/components/CustomHeader";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { ExploreStackParamList } from "@/navigation/ExploreStackNavigator";
import { usePhotoStore } from "@/store/photoStore";

type ExploreNav = NativeStackNavigationProp<ExploreStackParamList>;

export default function ExploreScreen() {
  const { theme, skin, fonts } = useTheme();
  const { paddingBottom } = useScreenInsets();
  const navigation = useNavigation<ExploreNav>();
  const { communityPhotos } = usePhotoStore();
  const [searchText, setSearchText] = useState("");

  const filteredPhotos = useMemo(() => {
    if (!searchText.trim()) return communityPhotos;

    const normalized = searchText.trim().toLowerCase();
    return communityPhotos.filter((photo) => {
      const fields = [
        photo.title,
        photo.caption,
        photo.catalogNumber,
        typeof photo.location === "string" ? photo.location : photo.location?.name,
      ];
      return fields.some((value) => value?.toLowerCase().includes(normalized));
    });
  }, [communityPhotos, searchText]);

  const totalPhotos = communityPhotos.length;
  const locations = new Set(
    communityPhotos.map((photo) =>
      typeof photo.location === "string" ? photo.location : photo.location?.name,
    ),
  ).size;
  const years = communityPhotos.map((photo) => photo.year);
  const oldestYear = years.length ? Math.min(...years) : 0;
  const newestYear = years.length ? Math.max(...years) : 0;

  const stats = [
    { label: "Total Archives", value: String(totalPhotos).padStart(3, "0"), icon: "image" as const },
    { label: "Anomalies", value: "03", icon: "zap" as const },
    { label: "Sectors", value: String(locations).padStart(2, "0"), icon: "map-pin" as const },
    {
      label: "Temporal Span",
      value: oldestYear && newestYear ? `${oldestYear}-${newestYear}` : "N/A",
      icon: "calendar" as const,
    },
  ];

  const recent = filteredPhotos.slice(0, 6);
  const communityHighlights = filteredPhotos.slice(0, 3);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <CustomHeader title="home" showNotificationButton showMessageButton />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: paddingBottom + 28,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: theme.backgroundSecondary,
              borderColor: theme.border,
            },
          ]}
        >
          <Feather name="search" size={16} color={theme.textSecondary} />
          <TextInput
            placeholder="Search by title, location or catalog..."
            placeholderTextColor={theme.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
            style={[styles.searchInput, { color: theme.text, fontFamily: fonts.body }]}
          />
          {searchText ? (
            <Pressable onPress={() => setSearchText("")}>
              <Feather name="x" size={16} color={theme.textSecondary} />
            </Pressable>
          ) : null}
        </View>

        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.heroLeft}>
            <View style={styles.heroLabelRow}>
              <Feather name="activity" size={14} color={theme.accent} />
              <ThemedText style={[styles.heroLabel, { color: theme.accent, fontFamily: fonts.mono }]}> 
                System Online
              </ThemedText>
            </View>
            <ThemedText
              style={[
                styles.heroTitle,
                {
                  color: theme.text,
                  fontFamily: skin === "cyberpunk" ? fonts.mono : fonts.header,
                },
              ]}
            >
              {skin === "cyberpunk" ? "NEURAL_LINK_ACTIVE" : "Chronicle Status"}
            </ThemedText>
            <ThemedText style={[styles.heroBody, { color: theme.textSecondary }]}> 
              {skin === "cyberpunk"
                ? "All optical sensors are functioning within normal parameters."
                : "Your archival collection is safely stored across the timeline."}
            </ThemedText>
          </View>

          <View style={[styles.heroRight, { borderColor: `${theme.accent}44` }]}> 
            <ThemedText style={[styles.syncValue, { color: theme.accent, fontFamily: fonts.header }]}> 
              98%
            </ThemedText>
            <ThemedText style={[styles.syncLabel, { color: theme.textSecondary, fontFamily: fonts.mono }]}> 
              Sync
            </ThemedText>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <View
              key={stat.label}
              style={[
                styles.statCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={[styles.statIcon, { backgroundColor: `${theme.accent}14` }]}> 
                <Feather name={stat.icon} size={16} color={theme.accent} />
              </View>
              <ThemedText style={[styles.statLabel, { color: theme.textSecondary, fontFamily: fonts.mono }]}> 
                {stat.label}
              </ThemedText>
              <ThemedText style={[styles.statValue, { color: theme.text, fontFamily: fonts.header }]}> 
                {stat.value}
              </ThemedText>
            </View>
          ))}
        </View>

        <SectionTitle title="Recent Ingestions" themeText={theme.text} font={fonts.header} />
        <View style={styles.recentGrid}>
          {recent.map((photo) => (
            <Pressable
              key={photo.id}
              onPress={() => navigation.navigate("PhotoDetail", { photoId: photo.id })}
              style={[
                styles.recentCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Image source={{ uri: photo.uri }} style={styles.recentImage} />
              <View style={styles.recentMeta}>
                <ThemedText style={[styles.recentCatalog, { color: theme.textSecondary, fontFamily: fonts.mono }]}> 
                  {photo.catalogNumber || `REF.${photo.year}`}
                </ThemedText>
              </View>
            </Pressable>
          ))}
        </View>

        <SectionTitle title="Community Highlights" themeText={theme.text} font={fonts.header} />
        <View style={styles.communityWrap}>
          {communityHighlights.map((photo) => (
            <Pressable
              key={`community-${photo.id}`}
              onPress={() => navigation.navigate("PhotoDetail", { photoId: photo.id })}
              style={[
                styles.communityCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Image source={{ uri: photo.uri }} style={styles.communityImage} />
              <View style={styles.communityBody}>
                <View style={styles.communityTopRow}>
                  <ThemedText style={[styles.communityUser, { color: theme.text }]}> 
                    {photo.userName || "@community"}
                  </ThemedText>
                  <View style={styles.communityLikes}>
                    <Feather name="heart" size={12} color={theme.accent} />
                    <ThemedText style={[styles.communityLikesText, { color: theme.accent, fontFamily: fonts.mono }]}> 
                      {photo.likes}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={[styles.communityLocation, { color: theme.textSecondary }]}> 
                  {typeof photo.location === "string" ? photo.location : photo.location?.name}
                </ThemedText>
                <ThemedText style={[styles.communityCaption, { color: theme.text }]} numberOfLines={2}> 
                  {photo.caption || photo.title || "Community archive update"}
                </ThemedText>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function SectionTitle({
  title,
  themeText,
  font,
}: {
  title: string;
  themeText: string;
  font: string;
}) {
  return (
    <View style={styles.sectionTitleRow}>
      <ThemedText style={[styles.sectionTitle, { color: themeText, fontFamily: font }]}> 
        {title}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  heroLeft: {
    flex: 1,
  },
  heroLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  heroLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 20,
  },
  heroBody: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
  },
  heroRight: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  syncValue: {
    fontSize: 22,
  },
  syncLabel: {
    marginTop: 2,
    fontSize: 10,
    textTransform: "uppercase",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    width: "48.5%",
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
  statIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 10,
    textTransform: "uppercase",
  },
  statValue: {
    marginTop: 2,
    fontSize: 18,
  },
  sectionTitleRow: {
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
  },
  recentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  recentCard: {
    width: "48.5%",
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  recentImage: {
    width: "100%",
    height: 124,
  },
  recentMeta: {
    padding: 8,
  },
  recentCatalog: {
    fontSize: 9,
    textTransform: "uppercase",
  },
  communityWrap: {
    gap: 10,
  },
  communityCard: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  communityImage: {
    width: "100%",
    height: 170,
  },
  communityBody: {
    padding: 10,
    gap: 5,
  },
  communityTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  communityUser: {
    fontSize: 12,
  },
  communityLikes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  communityLikesText: {
    fontSize: 11,
  },
  communityLocation: {
    fontSize: 11,
  },
  communityCaption: {
    fontSize: 12,
    lineHeight: 17,
  },
});
