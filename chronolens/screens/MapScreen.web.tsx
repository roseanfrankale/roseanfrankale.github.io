import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  Modal,
  Dimensions,
  ScrollView,
  FlatList,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MapboxMap, { Marker } from "react-map-gl/mapbox";

import { ThemedText } from "@/components/ThemedText";
import { CustomHeader } from "@/components/CustomHeader";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { Spacing, BorderRadius } from "@/constants/theme";
import { MapStackParamList } from "@/navigation/MapStackNavigator";
import { usePhotoStore, Photo, PhotoLocation } from "@/store/photoStore";

const { height } = Dimensions.get("window");

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? "";

const MAPBOX_STYLE_BY_SKIN = {
  historian: "mapbox://styles/mapbox/outdoors-v12",
  cyberpunk: "mapbox://styles/mapbox/dark-v11",
} as const;

interface ClusteredLocation {
  location: PhotoLocation;
  photos: Photo[];
}

type MapNav = NativeStackNavigationProp<MapStackParamList>;

interface PreviewRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

function regionToZoom(region: PreviewRegion): number {
  const maxDelta = Math.max(region.latitudeDelta, region.longitudeDelta);
  const zoom = Math.log2(360 / Math.max(maxDelta, 0.0001));
  return Math.max(1.5, Math.min(12, zoom));
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
      const key = `${photo.location.lat.toFixed(3)},${photo.location.lng.toFixed(3)}`;

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
  const navigation = useNavigation<MapNav>();
  const { theme, fonts, skin } = useTheme();
  const { photos, communityPhotos } = usePhotoStore();
  const { paddingBottom } = useScreenInsets();
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

  const previewRegion = useMemo(() => {
    const source =
      filteredLocations.length > 0 ? filteredLocations : locationGroups;

    if (source.length === 0) {
      return {
        latitude: 20,
        longitude: 0,
        latitudeDelta: 120,
        longitudeDelta: 120,
      };
    }

    const latitudes = source.map((item) => item.location.lat);
    const longitudes = source.map((item) => item.location.lng);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max((maxLat - minLat) * 1.9, 30),
      longitudeDelta: Math.max((maxLng - minLng) * 1.9, 40),
    };
  }, [filteredLocations, locationGroups]);

  const mapStyleUrl =
    MAPBOX_STYLE_BY_SKIN[skin] ?? MAPBOX_STYLE_BY_SKIN.historian;

  const renderPhotoItem = ({ item }: { item: Photo }) => (
    <Pressable
      style={[
        styles.photoGridItem,
        {
          borderColor: theme.border,
          backgroundColor: theme.backgroundSecondary,
        },
      ]}
      onPress={() => {
        setSelectedCluster(null);
        navigation.navigate("PhotoDetail", { photoId: item.id });
      }}
    >
      <Image source={{ uri: item.uri }} style={styles.photoGridImage} />
    </Pressable>
  );

  const hasMapToken = MAPBOX_TOKEN.trim().length > 0;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundDefault }]}
    >
      <CustomHeader variant="actionsOnly" />

      {photosWithLocation.length > 0 ? (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: Spacing.lg,
            paddingTop: Spacing.lg,
            paddingBottom: Math.max(paddingBottom, 20) + Spacing["2xl"],
            gap: Spacing.lg,
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
                <Feather name="map" size={14} color={theme.accent} />
                <ThemedText
                  style={[
                    styles.heroLabel,
                    { color: theme.accent, fontFamily: fonts.mono },
                  ]}
                >
                  Spatial Archive
                </ThemedText>
              </View>
              <ThemedText
                style={[
                  styles.heroTitle,
                  {
                    color: theme.text,
                    fontFamily:
                      skin === "cyberpunk" ? fonts.mono : fonts.header,
                  },
                ]}
              >
                {skin === "cyberpunk" ? "GEO_NODES" : "Family Locations"}
              </ThemedText>
              <ThemedText
                style={[styles.heroBody, { color: theme.textSecondary }]}
              >
                {skin === "cyberpunk"
                  ? `${filteredLocations.length} geographic clusters mapped`
                  : `Visualize memories across ${filteredLocations.length} locations`}
              </ThemedText>
            </View>

            <View
              style={[styles.heroRight, { borderColor: `${theme.accent}44` }]}
            >
              <ThemedText
                style={[
                  styles.syncValue,
                  { color: theme.accent, fontFamily: fonts.header },
                ]}
              >
                {filteredLocations.length}
              </ThemedText>
              <ThemedText
                style={[
                  styles.syncLabel,
                  { color: theme.textSecondary, fontFamily: fonts.mono },
                ]}
              >
                Places
              </ThemedText>
            </View>
          </View>

          <View
            style={[
              styles.previewCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.previewToolbar}>
              <Pressable
                style={[
                  styles.previewToolbarButton,
                  {
                    backgroundColor: theme.backgroundSecondary,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Feather name="filter" size={16} color={theme.text} />
              </Pressable>
              <Pressable
                style={[
                  styles.previewToolbarButton,
                  styles.previewToolbarButtonActive,
                  { backgroundColor: theme.accent },
                ]}
              >
                <Feather
                  name="download"
                  size={16}
                  color={theme.backgroundRoot}
                />
              </Pressable>
            </View>

            <View
              style={[
                styles.previewMapFrame,
                {
                  borderColor: `${theme.border}AA`,
                },
              ]}
            >
              {hasMapToken ? (
                <MapboxMap
                  mapboxAccessToken={MAPBOX_TOKEN}
                  mapStyle={mapStyleUrl}
                  initialViewState={{
                    latitude: previewRegion.latitude,
                    longitude: previewRegion.longitude,
                    zoom: regionToZoom(previewRegion),
                  }}
                  longitude={previewRegion.longitude}
                  latitude={previewRegion.latitude}
                  zoom={regionToZoom(previewRegion)}
                  style={styles.previewMap}
                  dragPan={false}
                  scrollZoom={false}
                  boxZoom={false}
                  dragRotate={false}
                  doubleClickZoom={false}
                  touchZoomRotate={false}
                  keyboard={false}
                  attributionControl={false}
                  logoPosition="top-right"
                >
                  {filteredLocations.map((cluster, index) => (
                    <Marker
                      key={`${cluster.location.name}-${index}`}
                      latitude={cluster.location.lat}
                      longitude={cluster.location.lng}
                      anchor="center"
                    >
                      <Pressable
                        onPress={() => setSelectedCluster(cluster)}
                        style={[
                          styles.previewPin,
                          {
                            backgroundColor: theme.accent,
                            shadowColor: theme.accent,
                          },
                        ]}
                      >
                        <ThemedText
                          style={[
                            styles.previewPinText,
                            {
                              color: theme.backgroundRoot,
                              fontFamily: fonts.mono,
                            },
                          ]}
                        >
                          {cluster.photos.length}
                        </ThemedText>
                      </Pressable>
                    </Marker>
                  ))}
                </MapboxMap>
              ) : (
                <View
                  style={[
                    styles.noTokenState,
                    { backgroundColor: theme.backgroundSecondary },
                  ]}
                >
                  <Feather name="map" size={28} color={theme.textSecondary} />
                  <ThemedText
                    style={{ color: theme.textSecondary, textAlign: "center" }}
                  >
                    Mapbox token missing.
                  </ThemedText>
                </View>
              )}
            </View>
          </View>

          <View>
            <ThemedText
              style={[
                styles.sectionTitle,
                {
                  color: theme.text,
                  fontFamily: fonts.header,
                  marginBottom: Spacing.md,
                },
              ]}
            >
              Documented Locations
            </ThemedText>

            {filteredLocations.map((cluster, index) => (
              <Pressable
                key={index}
                onPress={() => setSelectedCluster(cluster)}
                style={[
                  styles.locationCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    marginBottom: Spacing.sm,
                  },
                ]}
              >
                <View
                  style={[
                    styles.locationIcon,
                    { backgroundColor: `${theme.accent}20` },
                  ]}
                >
                  <Feather name="map-pin" size={18} color={theme.accent} />
                </View>
                <View style={styles.locationInfo}>
                  <ThemedText
                    style={[
                      styles.locationName,
                      { color: theme.text, fontFamily: fonts.mono },
                    ]}
                    numberOfLines={1}
                  >
                    {cluster.location.name}
                  </ThemedText>
                  <ThemedText
                    type="small"
                    style={{ color: theme.textSecondary, fontSize: 11 }}
                  >
                    {cluster.photos.length}{" "}
                    {cluster.photos.length === 1 ? "memory" : "memories"}
                  </ThemedText>
                  <ThemedText
                    type="small"
                    style={[
                      {
                        color: theme.textSecondary,
                        fontSize: 10,
                        marginTop: 2,
                        fontFamily: fonts.mono,
                      },
                    ]}
                  >
                    {`${cluster.location.lat.toFixed(2)}°, ${cluster.location.lng.toFixed(2)}°`}
                  </ThemedText>
                </View>
                <Feather
                  name="chevron-right"
                  size={18}
                  color={theme.textSecondary}
                />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
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
            No Locations Yet
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.emptySubtitle, { color: theme.textSecondary }]}
          >
            Photos with GPS data will appear on the map. Upload photos from your
            camera or add location data manually.
          </ThemedText>
        </View>
      )}

      {selectedCluster && (
        <Modal
          visible={true}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSelectedCluster(null)}
        >
          <View
            style={[
              styles.modalContent,
              {
                bottom: Math.max(paddingBottom, 16) + 54,
              },
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <View>
                <ThemedText
                  style={[
                    styles.modalTitle,
                    { fontFamily: fonts.header, color: theme.text },
                  ]}
                >
                  {selectedCluster.location.name}
                </ThemedText>
                <ThemedText
                  type="caption"
                  style={[
                    styles.modalSubtitle,
                    { fontFamily: fonts.mono, color: theme.textSecondary },
                  ]}
                >
                  {selectedCluster.photos.length}{" "}
                  {selectedCluster.photos.length === 1 ? "memory" : "memories"}
                </ThemedText>
              </View>
              <Pressable
                style={[
                  styles.modalCloseButton,
                  { backgroundColor: theme.backgroundSecondary },
                ]}
                onPress={() => setSelectedCluster(null)}
              >
                <Feather name="x" size={20} color={theme.text} />
              </Pressable>
            </View>

            <FlatList
              data={selectedCluster.photos}
              renderItem={renderPhotoItem}
              keyExtractor={(item) => item.id}
              numColumns={3}
              columnWrapperStyle={styles.photoGridRow}
              contentContainerStyle={styles.photoGridContainer}
            />

            <View
              style={[
                styles.statsContainer,
                {
                  backgroundColor: theme.backgroundSecondary,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.statRow}>
                <Feather
                  name="calendar"
                  size={14}
                  color={theme.textSecondary}
                />
                <ThemedText
                  type="small"
                  style={[
                    styles.statText,
                    { fontFamily: fonts.mono, color: theme.text },
                  ]}
                >
                  {new Date(selectedCluster.photos[0].date).getFullYear()}
                  {selectedCluster.photos.length > 1 &&
                    ` - ${new Date(
                      selectedCluster.photos[
                        selectedCluster.photos.length - 1
                      ].date,
                    ).getFullYear()}`}
                </ThemedText>
              </View>
              <View style={styles.statRow}>
                <Feather name="image" size={14} color={theme.textSecondary} />
                <ThemedText
                  type="small"
                  style={[
                    styles.statText,
                    { fontFamily: fonts.mono, color: theme.text },
                  ]}
                >
                  {selectedCluster.photos.length} photos
                </ThemedText>
              </View>
              <View style={styles.statRow}>
                <Feather name="map-pin" size={14} color={theme.textSecondary} />
                <ThemedText
                  type="small"
                  style={[
                    styles.statText,
                    { fontFamily: fonts.mono, color: theme.text },
                  ]}
                >
                  {`${selectedCluster.location.lat.toFixed(2)}°, ${selectedCluster.location.lng.toFixed(2)}°`}
                </ThemedText>
              </View>
            </View>
          </View>
        </Modal>
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
  previewCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    gap: 12,
  },
  previewToolbar: {
    flexDirection: "row",
    gap: 10,
  },
  previewToolbarButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  previewToolbarButtonActive: {
    borderWidth: 0,
  },
  previewMapFrame: {
    height: 320,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  previewMap: {
    width: "100%",
    height: "100%",
  },
  noTokenState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
  },
  previewPin: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 4,
  },
  previewPinText: {
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 16,
  },
  locationCard: {
    flexDirection: "row",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.md,
    alignItems: "center",
  },
  locationIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  locationInfo: {
    flex: 1,
    justifyContent: "center",
  },
  locationName: {
    fontSize: 14,
    marginBottom: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing["2xl"],
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "400",
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
    maxWidth: 300,
  },
  modalContent: {
    position: "absolute",
    left: Spacing.md,
    right: Spacing.md,
    maxHeight: height * 0.72,
    borderRadius: BorderRadius["2xl"],
    borderTopWidth: 1,
    paddingBottom: Spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "400",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.7,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  photoGridContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  photoGridRow: {
    gap: Spacing.sm,
  },
  photoGridItem: {
    flex: 1 / 3,
    aspectRatio: 1,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  photoGridImage: {
    width: "100%",
    height: "100%",
  },
  statsContainer: {
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  statText: {
    fontSize: 12,
  },
});
