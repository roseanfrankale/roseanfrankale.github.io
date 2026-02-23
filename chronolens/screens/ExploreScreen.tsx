import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  SectionList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { CustomHeader } from "../components/CustomHeader";
import { useTheme } from "../hooks/useTheme";

interface Photo {
  id: string;
  catalogNumber: string;
  url: string;
  date: string;
  location?: string;
  era?: string;
  title?: string;
  description?: string;
}

interface CommunityPost {
  id: string;
  user: string;
  location: string;
  imageUrl: string;
  caption: string;
  likes: number;
}

// Mock data
const MOCK_PHOTOS: Photo[] = [
  {
    id: "1",
    catalogNumber: "REF.2026-001-A",
    url: "https://picsum.photos/400/400",
    date: "2020-06-15",
    location: "London, England",
    title: "Summer Garden",
    description: "Beautiful afternoon in Hyde Park",
    era: "Contemporary",
  },
  {
    id: "2",
    catalogNumber: "REF.2026-002-B",
    url: "https://picsum.photos/401/401",
    date: "2019-03-22",
    location: "Paris, France",
    title: "Eiffel Tower",
    description: "Classic Parisian view",
    era: "Contemporary",
  },
  {
    id: "3",
    catalogNumber: "REF.2026-003-C",
    url: "https://picsum.photos/402/402",
    date: "2018-11-08",
    location: "Tokyo, Japan",
    title: "Shibuya Crossing",
    description: "Night lights and crowds",
    era: "Contemporary",
  },
  {
    id: "4",
    catalogNumber: "REF.2026-004-D",
    url: "https://picsum.photos/403/403",
    date: "2017-08-12",
    location: "New York, USA",
    title: "Manhattan Skyline",
    era: "Contemporary",
  },
  {
    id: "5",
    catalogNumber: "REF.2026-005-E",
    url: "https://picsum.photos/404/404",
    date: "2016-05-30",
    location: "Barcelona, Spain",
    title: "Sagrada Familia",
    era: "Contemporary",
  },
];

const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "cp-1",
    user: "@archive.anna",
    location: "Lisbon, Portugal",
    imageUrl: "https://picsum.photos/410/300",
    caption: "Found this beautiful tile alley at golden hour.",
    likes: 128,
  },
  {
    id: "cp-2",
    user: "@miles.catalog",
    location: "Seoul, South Korea",
    imageUrl: "https://picsum.photos/411/300",
    caption: "Night market textures and colors from last weekend.",
    likes: 204,
  },
  {
    id: "cp-3",
    user: "@retro.frames",
    location: "Mexico City, Mexico",
    imageUrl: "https://picsum.photos/412/300",
    caption: "Street portrait series from Centro Histórico.",
    likes: 176,
  },
];

export default function ExploreScreen() {
  const { colors } = useTheme();
  const [searchText, setSearchText] = useState("");

  // Group photos by year
  const groupedPhotos = React.useMemo(() => {
    const groups: Record<number, Photo[]> = {};
    const sortedPhotos = [...MOCK_PHOTOS].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    sortedPhotos.forEach((photo) => {
      const year = new Date(photo.date).getFullYear();
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(photo);
    });

    return Object.entries(groups).sort(
      ([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA),
    );
  }, []);

  // Filter based on search text
  const filteredGroups = React.useMemo(() => {
    if (!searchText.trim()) return groupedPhotos;

    return groupedPhotos
      .map(([year, photos]) => [
        year,
        photos.filter(
          (photo) =>
            photo.title?.toLowerCase().includes(searchText.toLowerCase()) ||
            photo.location?.toLowerCase().includes(searchText.toLowerCase()) ||
            photo.catalogNumber
              .toLowerCase()
              .includes(searchText.toLowerCase()),
        ),
      ])
      .filter(([_, photos]) => (photos as Photo[]).length > 0);
  }, [groupedPhotos, searchText]);

  const renderYearHeader = ({ section: { title } }: any) => (
    <View style={styles.yearHeaderContainer}>
      <View style={[styles.yearLine, { backgroundColor: colors.border }]} />
      <Text style={[styles.yearHeader, { color: colors.accent }]}>{title}</Text>
      <View style={[styles.yearLine, { backgroundColor: colors.border }]} />
    </View>
  );

  const renderPhotoEntry = ({ item }: { item: Photo }) => (
    <Pressable
      style={[
        styles.photoEntry,
        {
          backgroundColor: colors.backgroundDefault,
          borderColor: colors.border,
        },
      ]}
    >
      <Image source={{ uri: item.url }} style={styles.photoThumbnail} />
      <View style={styles.entryContent}>
        <Text style={[styles.catalogNumber, { color: colors.textSecondary }]}>
          {item.catalogNumber}
        </Text>
        {item.title && (
          <Text
            style={[styles.photoTitle, { color: colors.text }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
        )}
        <View style={styles.metadataRow}>
          {item.location && (
            <View style={styles.metadataTag}>
              <Feather name="map-pin" size={10} color={colors.textSecondary} />
              <Text
                style={[styles.metadataText, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {item.location}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.tagsRow}>
          <View
            style={[
              styles.tag,
              { backgroundColor: colors.backgroundSecondary },
            ]}
          >
            <Feather name="calendar" size={10} color={colors.textSecondary} />
            <Text style={[styles.tagText, { color: colors.textSecondary }]}>
              {new Date(item.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>
          {item.era && (
            <View
              style={[styles.tag, { backgroundColor: colors.accent + "1A" }]}
            >
              <Text style={[styles.tagText, { color: colors.accent }]}>
                {item.era}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );

  const renderCommunityPost = (item: CommunityPost) => (
    <Pressable
      key={item.id}
      style={[
        styles.communityCard,
        {
          backgroundColor: colors.backgroundDefault,
          borderColor: colors.border,
        },
      ]}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.communityImage} />
      <View style={styles.communityContent}>
        <View style={styles.communityMetaRow}>
          <Text style={[styles.communityUser, { color: colors.text }]}>
            {item.user}
          </Text>
          <View style={styles.communityLikes}>
            <Feather name="heart" size={12} color={colors.accent} />
            <Text style={[styles.communityLikesText, { color: colors.accent }]}>
              {item.likes}
            </Text>
          </View>
        </View>
        <Text
          style={[styles.communityLocation, { color: colors.textSecondary }]}
        >
          {item.location}
        </Text>
        <Text style={[styles.communityCaption, { color: colors.text }]}>
          {item.caption}
        </Text>
      </View>
    </Pressable>
  );

  const sections = filteredGroups.map(([year, photos]) => ({
    title: year.toString(),
    data: photos as Photo[],
  }));

  return (
    <View
      style={[styles.container, { backgroundColor: colors.backgroundDefault }]}
    >
      <CustomHeader
        title="explore"
        showNotificationButton={true}
        showMessageButton={true}
      />

      {/* Search Bar */}
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border,
          },
        ]}
      >
        <Feather name="search" size={16} color={colors.textSecondary} />
        <TextInput
          placeholder="Search by title, location, or catalog..."
          placeholderTextColor={colors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
          style={[
            styles.searchInput,
            {
              color: colors.text,
            },
          ]}
        />
        {searchText ? (
          <Pressable onPress={() => setSearchText("")}>
            <Feather name="x" size={16} color={colors.textSecondary} />
          </Pressable>
        ) : null}
      </View>

      {/* Photo Entries */}
      {sections.length > 0 ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderPhotoEntry}
          renderSectionHeader={renderYearHeader}
          ListFooterComponent={
            <View style={styles.communitySection}>
              <View style={styles.yearHeaderContainer}>
                <View
                  style={[styles.yearLine, { backgroundColor: colors.border }]}
                />
                <Text style={[styles.yearHeader, { color: colors.accent }]}>
                  community
                </Text>
                <View
                  style={[styles.yearLine, { backgroundColor: colors.border }]}
                />
              </View>
              {MOCK_COMMUNITY_POSTS.map(renderCommunityPost)}
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          SectionSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Feather name="inbox" size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No photos found
          </Text>
        </View>
      )}
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
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  yearHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 16,
  },
  yearLine: {
    flex: 1,
    height: 1,
  },
  yearHeader: {
    fontFamily: "Cinzel-Regular",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 2,
  },
  photoEntry: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
    gap: 12,
  },
  photoThumbnail: {
    width: 100,
    height: 100,
  },
  entryContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  catalogNumber: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  photoTitle: {
    fontFamily: "Cinzel-Regular",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  metadataRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  metadataTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metadataText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 9,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 9,
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
    letterSpacing: 1,
  },
  communitySection: {
    marginTop: 12,
    gap: 10,
  },
  communityCard: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  communityImage: {
    width: "100%",
    height: 160,
  },
  communityContent: {
    padding: 12,
    gap: 6,
  },
  communityMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  communityUser: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 12,
  },
  communityLikes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  communityLikesText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 11,
  },
  communityLocation: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 11,
  },
  communityCaption: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
    lineHeight: 18,
  },
});
