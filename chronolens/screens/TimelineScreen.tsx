import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
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
import { CustomHeader } from "@/components/CustomHeader";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { useStaggeredAnimation } from "@/hooks/useStaggeredAnimation";
import { TimelineStackParamList } from "@/navigation/TimelineStackNavigator";
import { usePhotoStore, Photo } from "@/store/photoStore";
import { pressableConfig } from "@/utils/animations";

type TimelineNav = NativeStackNavigationProp<TimelineStackParamList>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface DecadeGroup {
  decade: string;
  photos: Photo[];
  startIndex: number;
}

function TimelineTile({
  photo,
  index,
  tileSize,
  isSelected,
  onOpen,
  onToggle,
}: {
  photo: Photo;
  index: number;
  tileSize: number;
  isSelected: boolean;
  onOpen: () => void;
  onToggle: () => void;
}) {
  const { theme, fonts, skin } = useTheme();
  const scale = useSharedValue(1);
  const { opacity, translateY } = useStaggeredAnimation(index, {
    delay: 40,
    startDelay: 60,
    initialTranslateY: 16,
  });

  const config = pressableConfig[skin];

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onOpen}
      onPressIn={() => {
        scale.value = withSpring(config.scaleDown, {
          damping: config.damping,
          stiffness: config.stiffness,
        });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, {
          damping: config.damping,
          stiffness: config.stiffness,
        });
      }}
      style={[
        styles.cardWrap,
        { width: tileSize, height: tileSize + 32 },
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.photoCard,
          {
            borderColor: isSelected ? theme.accent : theme.border,
            backgroundColor: theme.card,
          },
        ]}
      >
        <Image source={{ uri: photo.uri }} style={styles.photoImage} resizeMode="cover" />

        <Pressable
          onPress={onToggle}
          style={[
            styles.selectToggle,
            {
              borderColor: isSelected ? theme.accent : "rgba(255,255,255,0.65)",
              backgroundColor: isSelected ? theme.accent : "rgba(0,0,0,0.4)",
            },
          ]}
        >
          {isSelected ? (
            <Feather name="check" size={12} color={skin === "cyberpunk" ? "#000" : "#fff"} />
          ) : null}
        </Pressable>
      </View>

      <View
        style={[
          styles.metaRow,
          {
            backgroundColor: theme.backgroundSecondary,
            borderColor: theme.border,
          },
        ]}
      >
        <ThemedText style={[styles.metaText, { color: theme.textSecondary, fontFamily: fonts.mono }]}> 
          {photo.catalogNumber || `REF.${photo.year}`}
        </ThemedText>
      </View>
    </AnimatedPressable>
  );
}

export default function TimelineScreen() {
  const { theme, fonts } = useTheme();
  const { paddingBottom, scrollInsetBottom } = useScreenInsets();
  const { width } = useWindowDimensions();
  const navigation = useNavigation<TimelineNav>();
  const { communityPhotos } = usePhotoStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const columns = width >= 1320 ? 5 : width >= 960 ? 4 : width >= 700 ? 3 : 2;
  const sidePadding = 16;
  const gap = 10;
  const tileSize =
    (width - sidePadding * 2 - gap * (columns - 1)) /
    (columns > 0 ? columns : 1);

  const filteredPhotos = useMemo(() => {
    if (!searchQuery.trim()) return communityPhotos;

    const normalized = searchQuery.trim().toLowerCase();
    return communityPhotos.filter((photo) => {
      const fields = [
        photo.title,
        photo.caption,
        photo.catalogNumber,
        photo.userName,
        typeof photo.location === "string" ? photo.location : photo.location?.name,
        String(photo.year),
      ];

      return fields.some((value) => value?.toLowerCase().includes(normalized));
    });
  }, [communityPhotos, searchQuery]);

  const decadeGroups = useMemo(() => {
    const grouped: Record<string, Photo[]> = {};

    [...filteredPhotos]
      .sort((a, b) => b.year - a.year)
      .forEach((photo) => {
        const decade = `${Math.floor(photo.year / 10) * 10}s`;
        if (!grouped[decade]) grouped[decade] = [];
        grouped[decade].push(photo);
      });

    let runningIndex = 0;
    return Object.entries(grouped)
      .sort((a, b) => parseInt(b[0], 10) - parseInt(a[0], 10))
      .map(([decade, photos]) => {
        const group: DecadeGroup = {
          decade,
          photos,
          startIndex: runningIndex,
        };
        runningIndex += photos.length;
        return group;
      });
  }, [filteredPhotos]);

  const toggleSelection = (photoId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(photoId)) {
        next.delete(photoId);
      } else {
        next.add(photoId);
      }
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const openPhoto = (photo: Photo) => {
    navigation.navigate("PhotoDetail", { photoId: photo.id });
  };

  return (
    <ThemedView style={styles.container}>
      <CustomHeader title="archives" showMessageButton />

      <FlatList
        data={decadeGroups}
        keyExtractor={(item) => item.decade}
        contentContainerStyle={{
          paddingHorizontal: sidePadding,
          paddingTop: 14,
          paddingBottom: paddingBottom + 96,
        }}
        scrollIndicatorInsets={{ bottom: scrollInsetBottom + 72 }}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View
              style={[
                styles.searchBar,
                {
                  backgroundColor: theme.backgroundSecondary,
                  borderColor: theme.border,
                },
              ]}
            >
              <Feather name="search" size={16} color={theme.textSecondary} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by title, location or catalog..."
                placeholderTextColor={theme.textSecondary}
                style={[styles.searchInput, { color: theme.text, fontFamily: fonts.body }]}
              />
            </View>

            <View style={styles.summaryRow}>
              <ThemedText style={[styles.summaryText, { color: theme.textSecondary, fontFamily: fonts.mono }]}> 
                {filteredPhotos.length} records
              </ThemedText>
              {selectedIds.size > 0 ? (
                <ThemedText style={[styles.summaryText, { color: theme.accent, fontFamily: fonts.mono }]}> 
                  {selectedIds.size} selected
                </ThemedText>
              ) : null}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.decadeSection}>
            <View style={styles.decadeHeaderRow}>
              <View style={[styles.decadeLine, { backgroundColor: theme.border }]} />
              <ThemedText style={[styles.decadeText, { color: theme.accent, fontFamily: fonts.header }]}> 
                {item.decade}
              </ThemedText>
              <View style={[styles.decadeLine, { backgroundColor: theme.border }]} />
            </View>

            <View style={[styles.photoGrid, { gap }]}> 
              {item.photos.map((photo, photoIndex) => (
                <TimelineTile
                  key={photo.id}
                  photo={photo}
                  index={item.startIndex + photoIndex}
                  tileSize={tileSize}
                  isSelected={selectedIds.has(photo.id)}
                  onOpen={() => openPhoto(photo)}
                  onToggle={() => toggleSelection(photo.id)}
                />
              ))}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="inbox" size={34} color={theme.textSecondary} />
            <ThemedText style={[styles.emptyTitle, { color: theme.text }]}>No records found</ThemedText>
            <ThemedText style={[styles.emptyHint, { color: theme.textSecondary }]}>Try a different search query.</ThemedText>
          </View>
        }
      />

      {selectedIds.size > 0 ? (
        <View
          style={[
            styles.batchToolbar,
            {
              borderColor: theme.border,
              backgroundColor: theme.card,
              bottom: Math.max(paddingBottom, 18),
            },
          ]}
        >
          <ThemedText style={[styles.batchText, { color: theme.text, fontFamily: fonts.mono }]}> 
            {selectedIds.size} selected
          </ThemedText>

          <View style={styles.batchActions}>
            <Pressable onPress={clearSelection} style={styles.batchButton}>
              <Feather name="x" size={16} color={theme.textSecondary} />
            </Pressable>
            <Pressable onPress={() => {}} style={styles.batchButton}>
              <Feather name="download" size={16} color={theme.textSecondary} />
            </Pressable>
            <Pressable onPress={() => {}} style={styles.batchButton}>
              <Feather name="tag" size={16} color={theme.textSecondary} />
            </Pressable>
            <Pressable onPress={() => {}} style={styles.batchButton}>
              <Feather name="trash-2" size={16} color={theme.error} />
            </Pressable>
          </View>
        </View>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listHeader: {
    marginBottom: 14,
    gap: 10,
  },
  searchBar: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryText: {
    fontSize: 11,
    textTransform: "uppercase",
  },
  decadeSection: {
    marginBottom: 16,
  },
  decadeHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  decadeLine: {
    flex: 1,
    height: 1,
  },
  decadeText: {
    fontSize: 14,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cardWrap: {
    overflow: "hidden",
  },
  photoCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  selectToggle: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  metaRow: {
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: "center",
  },
  metaText: {
    fontSize: 9,
    letterSpacing: 0.3,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 18,
  },
  emptyHint: {
    fontSize: 13,
  },
  batchToolbar: {
    position: "absolute",
    left: 16,
    right: 16,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  batchText: {
    fontSize: 11,
    textTransform: "uppercase",
  },
  batchActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  batchButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
