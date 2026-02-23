import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  Modal,
  Dimensions,
  ScrollView,
  FlatList,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { Spacing, BorderRadius } from "@/constants/theme";
import { usePhotoStore, Photo, PhotoLocation } from "@/store/photoStore";

const { height } = Dimensions.get("window");

interface ClusteredLocation {
  location: PhotoLocation;
  photos: Photo[];
}

// Group photos by location (clustering nearby coordinates)
function groupPhotosByLocation(photos: Photo[]): ClusteredLocation[] {
  const groups = new Map<string, ClusteredLocation>();

  photos.forEach((photo) => {
    if (
      photo.location &&
      typeof photo.location === "object" &&
      photo.location.lat &&
      photo.location.lng
    ) {
      // Round to 3 decimal places for clustering (~111m precision)
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

export default function MapScreen() {
  const { theme, fonts, skin } = useTheme();
  const { paddingTop } = useScreenInsets();
  const { photos } = usePhotoStore();
  const [selectedCluster, setSelectedCluster] =
    useState<ClusteredLocation | null>(null);

  // Filter photos with valid location data
  const photosWithLocation = useMemo(
    () =>
      photos.filter(
        (photo) =>
          photo.location &&
          typeof photo.location === "object" &&
          photo.location.lat &&
          photo.location.lng,
      ),
    [photos],
  );

  const locationGroups = useMemo(
    () => groupPhotosByLocation(photosWithLocation),
    [photosWithLocation],
  );

  // Calculate map region to fit all markers
  const mapRegion = useMemo(() => {
    if (locationGroups.length === 0) {
      return {
        latitude: 20,
        longitude: 0,
        latitudeDelta: 80,
        longitudeDelta: 80,
      };
    }

    const lats = locationGroups.map((g) => g.location.lat);
    const lngs = locationGroups.map((g) => g.location.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max((maxLat - minLat) * 1.5, 10),
      longitudeDelta: Math.max((maxLng - minLng) * 1.5, 10),
    };
  }, [locationGroups]);

  // Custom map style based on theme
  const mapStyle = skin === "historian" ? historianMapStyle : cyberpunkMapStyle;

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
        // TODO: Navigate to photo detail
        setSelectedCluster(null);
      }}
    >
      <Image source={{ uri: item.uri }} style={styles.photoGridImage} />
    </Pressable>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundDefault }]}
    >
      {/* Header */}
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
            {photosWithLocation.length} memories • {locationGroups.length}{" "}
            locations
          </ThemedText>
        </View>
        <View
          style={[
            styles.themeBadge,
            {
              borderColor: theme.border,
              backgroundColor: theme.backgroundSecondary,
            },
          ]}
        >
          <ThemedText
            type="small"
            style={[
              styles.themeBadgeText,
              { fontFamily: fonts.mono, color: theme.textSecondary },
            ]}
          >
            {skin === "historian" ? "🗺️ Vintage" : "🌐 Digital"}
          </ThemedText>
        </View>
      </View>

      {photosWithLocation.length > 0 ? (
        <>
          {/* Map */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={mapRegion}
              provider={PROVIDER_DEFAULT}
              customMapStyle={mapStyle}
              showsUserLocation={false}
              showsMyLocationButton={false}
            >
              {locationGroups.map((cluster, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: cluster.location.lat,
                    longitude: cluster.location.lng,
                  }}
                  onPress={() => setSelectedCluster(cluster)}
                >
                  <View style={styles.markerContainer}>
                    <View
                      style={[
                        styles.markerPin,
                        {
                          backgroundColor: theme.accent,
                          borderColor: theme.backgroundDefault,
                        },
                      ]}
                    >
                      <ThemedText
                        style={[
                          styles.markerCount,
                          {
                            color: theme.backgroundDefault,
                            fontFamily: fonts.mono,
                          },
                        ]}
                      >
                        {cluster.photos.length}
                      </ThemedText>
                    </View>
                    <View
                      style={[
                        styles.markerLabel,
                        {
                          backgroundColor: theme.card,
                          borderColor: theme.border,
                        },
                      ]}
                    >
                      <ThemedText
                        type="small"
                        style={[
                          styles.markerLabelText,
                          { fontFamily: fonts.mono, color: theme.text },
                        ]}
                      >
                        {cluster.location.name}
                      </ThemedText>
                    </View>
                  </View>
                </Marker>
              ))}
            </MapView>

            {/* Attribution */}
            <View
              style={[
                styles.attribution,
                {
                  backgroundColor: theme.card + "CC",
                  borderColor: theme.border,
                },
              ]}
            >
              <ThemedText
                type="small"
                style={[
                  styles.attributionText,
                  { fontFamily: fonts.mono, color: theme.textSecondary },
                ]}
              >
                CHRONOLENS FAMILY ATLAS
              </ThemedText>
            </View>
          </View>

          {/* Instructions */}
          <View
            style={[
              styles.instructionsCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.accent + "40",
              },
            ]}
          >
            <Feather name="map-pin" size={18} color={theme.accent} />
            <View style={styles.instructionsText}>
              <ThemedText
                style={[
                  styles.instructionsTitle,
                  { fontFamily: fonts.mono, color: theme.text },
                ]}
              >
                Tap markers to view photos at that location
              </ThemedText>
              <ThemedText
                type="small"
                style={[
                  styles.instructionsSubtitle,
                  { color: theme.textSecondary },
                ]}
              >
                Visualize your family&apos;s journey across time and geography
              </ThemedText>
            </View>
          </View>

          {/* Location Grid */}
          <ScrollView style={styles.locationListContainer}>
            <ThemedText
              style={[
                styles.locationListTitle,
                { fontFamily: fonts.header, color: theme.text },
              ]}
            >
              All Locations
            </ThemedText>
            {locationGroups.map((cluster, index) => (
              <Pressable
                key={index}
                style={[
                  styles.locationCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => setSelectedCluster(cluster)}
              >
                <View
                  style={[
                    styles.locationIcon,
                    { backgroundColor: theme.accent + "20" },
                  ]}
                >
                  <Feather name="map-pin" size={20} color={theme.accent} />
                </View>
                <View style={styles.locationInfo}>
                  <ThemedText
                    style={[
                      styles.locationName,
                      { fontFamily: fonts.mono, color: theme.text },
                    ]}
                    numberOfLines={1}
                  >
                    {cluster.location.name}
                  </ThemedText>
                  <ThemedText
                    type="small"
                    style={{ color: theme.textSecondary }}
                  >
                    {cluster.photos.length}{" "}
                    {cluster.photos.length === 1 ? "photo" : "photos"}
                  </ThemedText>
                  <ThemedText
                    type="small"
                    style={[
                      styles.locationCoords,
                      { fontFamily: fonts.mono, color: theme.textSecondary },
                    ]}
                  >
                    {cluster.location.lat.toFixed(2)}°,{" "}
                    {cluster.location.lng.toFixed(2)}°
                  </ThemedText>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </>
      ) : (
        // Empty State
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

      {/* Photo Cluster Modal */}
      {selectedCluster && (
        <Modal
          visible={true}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSelectedCluster(null)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setSelectedCluster(null)}
          />
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            {/* Modal Header */}
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

            {/* Photo Grid */}
            <FlatList
              data={selectedCluster.photos}
              renderItem={renderPhotoItem}
              keyExtractor={(item) => item.id}
              numColumns={3}
              columnWrapperStyle={styles.photoGridRow}
              contentContainerStyle={styles.photoGridContainer}
            />

            {/* Location Stats */}
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
                  {selectedCluster.location.lat.toFixed(2)}°,{" "}
                  {selectedCluster.location.lng.toFixed(2)}°
                </ThemedText>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

// Map styles
const historianMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#F4E8D8" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#8B7355" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#FFF8E7" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#C8DAE8" }],
  },
];

const cyberpunkMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#0A0E27" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#00F0FF" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#0A0E27" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#1A1F3A" }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  themeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  themeBadgeText: {
    fontSize: 12,
  },
  mapContainer: {
    height: height * 0.4,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    position: "relative",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    alignItems: "center",
  },
  markerPin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "-45deg" }],
  },
  markerCount: {
    fontSize: 12,
    fontWeight: "bold",
    transform: [{ rotate: "45deg" }],
  },
  markerLabel: {
    marginTop: 8,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  markerLabelText: {
    fontSize: 10,
  },
  attribution: {
    position: "absolute",
    bottom: Spacing.sm,
    right: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  attributionText: {
    fontSize: 8,
    opacity: 0.5,
  },
  instructionsCard: {
    flexDirection: "row",
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  instructionsText: {
    flex: 1,
  },
  instructionsTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  instructionsSubtitle: {
    fontSize: 12,
    opacity: 0.7,
  },
  locationListContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  locationListTitle: {
    fontSize: 18,
    fontWeight: "400",
    marginBottom: Spacing.md,
  },
  locationCard: {
    flexDirection: "row",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
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
  locationCoords: {
    fontSize: 10,
    opacity: 0.5,
    marginTop: 4,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: height * 0.8,
    borderTopLeftRadius: BorderRadius["2xl"],
    borderTopRightRadius: BorderRadius["2xl"],
    borderTopWidth: 1,
    paddingBottom: Spacing.xl,
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
