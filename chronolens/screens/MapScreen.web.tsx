import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Pressable,
  ScrollView,
  Image,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { Spacing, BorderRadius } from "@/constants/theme";
import { usePhotoStore, Photo, PhotoLocation } from "@/store/photoStore";

const MAP_BACKGROUNDS = {
  historian:
    "https://images.unsplash.com/photo-1744911617351-da45df2861f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMG1hcCUyMHZpbnRhZ2UlMjBwYXBlcnxlbnwxfHx8fDE3NzE4NTIwMDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  cyberpunk:
    "https://images.unsplash.com/photo-1547930206-82ac0a7aa08d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMG1hcCUyMGJsYWNrJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzE4NTIwMTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
} as const;

interface ClusteredLocation {
  location: PhotoLocation;
  photos: Photo[];
}

function groupPhotosByLocation(photos: Photo[]): ClusteredLocation[] {
  const groups = new Map<string, ClusteredLocation>();

  photos.forEach((photo) => {
    if (
      photo.location &&
      typeof photo.location === "object" &&
      photo.location.lat &&
      photo.location.lng
    ) {
      const key = `${photo.location.lat.toFixed(2)},${photo.location.lng.toFixed(2)}`;

      if (!groups.has(key)) {
        groups.set(key, {
          location: photo.location,
          photos: [],
        });
      }
      groups.get(key)!.photos.push(photo);
    }
  });

  return Array.from(groups.values());
}

export default function MapScreenWeb() {
  const { theme, fonts, skin } = useTheme();
  const { paddingTop, paddingBottom } = useScreenInsets();
  const { photos, communityPhotos } = usePhotoStore();
  const [selectedCluster, setSelectedCluster] =
    useState<ClusteredLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const mapSourcePhotos = useMemo(
    () => [...photos, ...communityPhotos],
    [photos, communityPhotos],
  );

  const photosWithLocation = useMemo(
    () =>
      mapSourcePhotos.filter(
        (photo) =>
          photo.location &&
          typeof photo.location === "object" &&
          photo.location.lat &&
          photo.location.lng,
      ),
    [mapSourcePhotos],
  );

  const locationGroups = useMemo(
    () => groupPhotosByLocation(photosWithLocation),
    [photosWithLocation],
  );

  const filteredLocations = useMemo(
    () =>
      locationGroups.filter((group) =>
        group.location.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [locationGroups, searchQuery],
  );

  const renderLocationItem = ({ item }: { item: ClusteredLocation }) => (
    <Pressable
      style={[
        styles.locationCard,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
      onPress={() => setSelectedCluster(item)}
    >
      <View style={styles.locationCardHeader}>
        <View style={styles.locationCardLeft}>
          <View
            style={[
              styles.locationMarker,
              {
                backgroundColor: `${theme.accent}22`,
                borderColor: theme.accent,
              },
            ]}
          >
            <Feather name="map-pin" size={14} color={theme.accent} />
          </View>
          <View style={styles.locationCardText}>
            <ThemedText
              style={[
                styles.locationName,
                { color: theme.text, fontFamily: fonts.header },
              ]}
            >
              {item.location.name}
            </ThemedText>
            <ThemedText
              type="caption"
              style={[
                styles.locationCount,
                { color: theme.textSecondary, fontFamily: fonts.mono },
              ]}
            >
              {item.photos.length} photo{item.photos.length !== 1 ? "s" : ""}
            </ThemedText>
          </View>
        </View>
        <Feather
          name="chevron-right"
          size={16}
          color={theme.textSecondary}
          style={{ opacity: 0.5 }}
        />
      </View>

      {item.photos.length > 0 && (
        <View style={styles.locationCardThumbnails}>
          {item.photos.slice(0, 3).map((photo, idx) => (
            <Image
              key={photo.id}
              source={{ uri: photo.uri }}
              style={[
                styles.locationCardThumbnail,
                {
                  zIndex: 10 - idx,
                  marginLeft: idx === 0 ? 0 : -12,
                },
              ]}
            />
          ))}
          {item.photos.length > 3 && (
            <View
              style={[
                styles.locationCardThumbnail,
                styles.locationCardMore,
                {
                  backgroundColor: theme.backgroundSecondary,
                  borderColor: theme.border,
                  zIndex: 10,
                  marginLeft: -12,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.moreCount,
                  { color: theme.textSecondary, fontFamily: fonts.mono },
                ]}
              >
                +{item.photos.length - 3}
              </ThemedText>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );

  const renderPhotoItem = ({ item }: { item: Photo }) => (
    <Pressable
      style={[
        styles.photoGridItem,
        {
          borderColor: theme.border,
          backgroundColor: theme.backgroundSecondary,
        },
      ]}
    >
      <Image source={{ uri: item.uri }} style={styles.photoGridImage} />
    </Pressable>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundDefault }]}
    >
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
        <View>
          <ThemedText
            style={[
              styles.headerTitle,
              { fontFamily: fonts.header, color: theme.text },
            ]}
          >
            Family Map
          </ThemedText>
          <ThemedText
            type="caption"
            style={[
              styles.headerSubtitle,
              { fontFamily: fonts.mono, color: theme.textSecondary },
            ]}
          >
            {filteredLocations.length} location
            {filteredLocations.length !== 1 ? "s" : ""}
          </ThemedText>
        </View>
      </View>

      {photosWithLocation.length > 0 ? (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: Spacing.lg,
            paddingVertical: Spacing.lg,
            paddingBottom: paddingBottom + Spacing["2xl"],
            gap: Spacing.md,
          }}
          showsVerticalScrollIndicator={false}
        >
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
            <Feather name="search" size={16} color={theme.textSecondary} />
            <TextInput
              placeholder="Search locations..."
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={[
                styles.searchInput,
                { color: theme.text, fontFamily: fonts.mono },
              ]}
            />
            {searchQuery ? (
              <Pressable onPress={() => setSearchQuery("")}>
                <Feather name="x" size={16} color={theme.textSecondary} />
              </Pressable>
            ) : null}
          </View>

          {/* Map Background */}
          <ImageBackground
            source={{ uri: MAP_BACKGROUNDS[skin] }}
            style={[styles.mapPreview, { borderColor: theme.border }]}
            imageStyle={styles.mapPreviewImage}
          >
            <View
              style={[
                styles.mapOverlay,
                { backgroundColor: theme.backgroundDefault + "AA" },
              ]}
            >
              <Feather
                name={skin === "cyberpunk" ? "radio" : "map"}
                size={48}
                color={theme.accent}
                style={{ opacity: 0.6 }}
              />
              <ThemedText
                style={[
                  styles.mapLabel,
                  { color: theme.text, fontFamily: fonts.header },
                ]}
              >
                {skin === "cyberpunk" ? "GEO_NODES" : "Spatial Archive"}
              </ThemedText>
            </View>
          </ImageBackground>

          {/* Locations List */}
          {filteredLocations.length > 0 ? (
            <FlatList
              data={filteredLocations}
              renderItem={renderLocationItem}
              keyExtractor={(item) =>
                `${item.location.lat},${item.location.lng}`
              }
              scrollEnabled={false}
              ItemSeparatorComponent={() => (
                <View style={styles.listSeparator} />
              )}
            />
          ) : (
            <View style={styles.emptyState}>
              <Feather
                name="map-pin"
                size={40}
                color={theme.textSecondary}
                style={{ opacity: 0.3 }}
              />
              <ThemedText
                style={[
                  styles.emptyTitle,
                  { color: theme.textSecondary, fontFamily: fonts.header },
                ]}
              >
                No locations found
              </ThemedText>
            </View>
          )}
        </ScrollView>
      ) : (
        <ImageBackground
          source={{ uri: MAP_BACKGROUNDS[skin] }}
          style={styles.emptyContainer}
          imageStyle={styles.emptyStateImage}
        >
          <View
            style={[
              styles.emptyOverlay,
              { backgroundColor: theme.backgroundDefault + "CC" },
            ]}
          >
            <Feather
              name="map"
              size={64}
              color={theme.textSecondary}
              style={{ opacity: 0.3 }}
            />
            <ThemedText
              style={[
                styles.emptyTitle,
                { fontFamily: fonts.header, color: theme.text },
              ]}
            >
              No photos with locations yet
            </ThemedText>
            <ThemedText
              type="body"
              style={[styles.emptySubtitle, { color: theme.textSecondary }]}
            >
              Tag photos with locations to map your family&apos;s spatial
              history.
            </ThemedText>
          </View>
        </ImageBackground>
      )}

      {/* Location Detail Modal */}
      <Modal visible={!!selectedCluster} transparent animationType="slide">
        {selectedCluster && (
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: theme.backgroundDefault },
            ]}
          >
            <View
              style={[
                styles.modalHeader,
                {
                  backgroundColor: theme.backgroundDefault,
                  borderBottomColor: theme.border,
                  paddingTop: Math.max(paddingTop, Spacing.lg),
                },
              ]}
            >
              <Pressable onPress={() => setSelectedCluster(null)}>
                <Feather name="x" size={24} color={theme.text} />
              </Pressable>
              <View style={styles.modalHeaderContent}>
                <ThemedText
                  style={[
                    styles.modalTitle,
                    { color: theme.text, fontFamily: fonts.header },
                  ]}
                >
                  {selectedCluster.location.name}
                </ThemedText>
              </View>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: Spacing.lg,
                paddingVertical: Spacing.lg,
                paddingBottom: paddingBottom + Spacing["2xl"],
              }}
              showsVerticalScrollIndicator={false}
            >
              {/* Location Info */}
              <View
                style={[
                  styles.locationInfo,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View style={styles.locationInfoRow}>
                  <Feather name="map-pin" size={16} color={theme.accent} />
                  <ThemedText style={{ color: theme.text }}>
                    {selectedCluster.location.lat.toFixed(4)}°,{" "}
                    {selectedCluster.location.lng.toFixed(4)}°
                  </ThemedText>
                </View>
                <View style={styles.locationInfoRow}>
                  <Feather name="image" size={16} color={theme.accent} />
                  <ThemedText style={{ color: theme.text }}>
                    {selectedCluster.photos.length} photo
                    {selectedCluster.photos.length !== 1 ? "s" : ""}
                  </ThemedText>
                </View>
              </View>

              {/* Photos Grid */}
              <FlatList
                data={selectedCluster.photos}
                renderItem={renderPhotoItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={styles.photoGridRow}
                ItemSeparatorComponent={() => (
                  <View style={styles.photoGridSeparator} />
                )}
              />
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "400",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.7,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  mapPreview: {
    height: 200,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  mapPreviewImage: {
    opacity: 0.35,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
  },
  mapLabel: {
    fontSize: 18,
    textAlign: "center",
  },
  locationCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  listSeparator: {
    height: Spacing.md,
  },
  locationCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },
  locationMarker: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  locationCardText: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    marginBottom: 2,
  },
  locationCount: {
    fontSize: 11,
  },
  locationCardThumbnails: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
  },
  locationCardThumbnail: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    backgroundColor: "#ccc",
  },
  locationCardMore: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  moreCount: {
    fontSize: 12,
    fontWeight: "600",
  },
  photoGridItem: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    overflow: "hidden",
  },
  photoGridRow: {
    gap: Spacing.md,
  },
  photoGridSeparator: {
    height: Spacing.md,
  },
  photoGridImage: {
    width: "100%",
    height: "100%",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    paddingVertical: Spacing["3xl"],
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
  },
  emptyStateImage: {
    opacity: 0.35,
  },
  emptyOverlay: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing["3xl"],
    gap: Spacing.lg,
  },
  emptyTitle: {
    fontSize: 28,
    textAlign: "center",
  },
  emptySubtitle: {
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 320,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  modalHeaderContent: {
    flex: 1,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  locationInfo: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  locationInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
});
