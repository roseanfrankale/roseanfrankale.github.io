import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  Platform,
  Alert,
  ScrollView,
  TextInput,
  Modal,
  useWindowDimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { useHeaderHeight } from "@react-navigation/elements";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { TimelineStackParamList } from "@/navigation/TimelineStackNavigator";
import { usePhotoStore } from "@/store/photoStore";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CommentData {
  id: string;
  userName: string;
  text: string;
  timeAgo: string;
}

const SAMPLE_COMMENTS: CommentData[] = [
  {
    id: "1",
    userName: "Sarah M.",
    text: "This brings back so many memories!",
    timeAgo: "2h ago",
  },
  {
    id: "2",
    userName: "Michael R.",
    text: "Beautiful photo. What camera was this taken with?",
    timeAgo: "5h ago",
  },
];

export default function PhotoDetailScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<TimelineStackParamList>>();
  const route = useRoute<RouteProp<TimelineStackParamList, "PhotoDetail">>();
  const { theme } = useTheme();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { getPhotoById, toggleLike, deletePhoto } = usePhotoStore();

  const photo = getPhotoById(route.params.photoId);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLightboxVisible, setIsLightboxVisible] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const isDesktopWeb = Platform.OS === "web" && windowWidth >= 1024;
  const detailMaxWidth = isDesktopWeb ? 980 : windowWidth - Spacing.xl * 2;
  const imageSize = isDesktopWeb
    ? Math.min(560, detailMaxWidth)
    : windowWidth - Spacing.xl * 2;

  const deleteScale = useSharedValue(1);
  const deleteAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: deleteScale.value }],
  }));

  if (!photo) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="body">Photo not found</ThemedText>
      </ThemedView>
    );
  }

  useEffect(() => {
    Image.getSize(
      photo.uri,
      (widthValue, heightValue) => {
        setImageDimensions({ width: widthValue, height: heightValue });
      },
      () => {
        setImageDimensions(null);
      },
    );
  }, [photo.uri]);

  const locationText =
    typeof photo.location === "string"
      ? photo.location
      : photo.location?.name || "Location unknown";

  const catalogText =
    photo.catalogNumber || `CATALOG #A-${photo.year}${photo.id.toUpperCase()}`;

  const titleText = photo.title || photo.caption || "Untitled Archive";
  const descriptionText =
    photo.caption ||
    "No description has been added yet for this archival record.";

  const classificationTags =
    photo.tags && photo.tags.length > 0 ? photo.tags : ["Mechanism"];

  const formatText = useMemo(() => {
    const match = photo.uri.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    return match?.[1] ? match[1].toUpperCase() : "JPEG";
  }, [photo.uri]);

  const dimensionsText = imageDimensions
    ? `${imageDimensions.width} x ${imageDimensions.height}`
    : "Unknown";

  const estimatedSizeText = imageDimensions
    ? `${(
        (imageDimensions.width * imageDimensions.height * 0.35) /
        (1024 * 1024)
      ).toFixed(1)} MB`
    : "--";

  const archivedByText = photo.userName || "ChronoLens Archive";

  const lightboxAspectRatio = imageDimensions
    ? imageDimensions.width / imageDimensions.height
    : 1;

  let lightboxImageWidth = Math.min(windowWidth * 0.84, 1100);
  let lightboxImageHeight = lightboxImageWidth / lightboxAspectRatio;
  const maxLightboxHeight = windowHeight * 0.78;
  if (lightboxImageHeight > maxLightboxHeight) {
    lightboxImageHeight = maxLightboxHeight;
    lightboxImageWidth = lightboxImageHeight * lightboxAspectRatio;
  }

  const isOwnPhoto = photo.userId === "self" || !photo.userId;

  const handleDelete = () => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to delete this photo? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deletePhoto(photo.id);
            navigation.goBack();
          },
        },
      ],
    );
  };

  const handleShare = () => {
    Alert.alert("Share", "Sharing functionality coming soon!");
  };

  const handleDownload = () => {
    Alert.alert("Download", "Download functionality coming soon!");
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.md,
            paddingBottom: insets.bottom + Spacing.xl,
            alignItems: isDesktopWeb ? "center" : "stretch",
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.detailContent,
            isDesktopWeb && { maxWidth: detailMaxWidth },
          ]}
        >
          <Pressable
            onPress={() => {
              setLightboxZoom(1);
              setIsLightboxVisible(true);
            }}
            style={[
              styles.imageFrame,
              {
                width: imageSize,
                height: imageSize,
                borderColor: theme.border,
              },
            ]}
          >
            <Image source={{ uri: photo.uri }} style={styles.image} resizeMode="cover" />
            {isDesktopWeb ? (
              <View
                style={[
                  styles.zoomHint,
                  {
                    backgroundColor: theme.backgroundSecondary,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Feather name="maximize-2" size={14} color={theme.text} />
              </View>
            ) : null}
          </Pressable>

          <View style={styles.detailHeader}>
          <ThemedText
            type="caption"
            style={[styles.catalogText, { color: theme.textSecondary }]}
          >
            {catalogText}
          </ThemedText>
          <ThemedText
            type="h2"
            style={[styles.detailTitle, { color: theme.text }]}
          >
            {titleText}
          </ThemedText>
          <View style={styles.detailMetaRow}>
            <View style={styles.inlineMetaRow}>
              <Feather name="calendar" size={14} color={theme.textSecondary} />
              <ThemedText
                type="body"
                style={[styles.detailMetaText, { color: theme.textSecondary }]}
              >
                {photo.date}
              </ThemedText>
            </View>
            <View style={styles.inlineMetaRow}>
              <Feather name="map-pin" size={14} color={theme.textSecondary} />
              <ThemedText
                type="body"
                style={[styles.detailMetaText, { color: theme.textSecondary }]}
                numberOfLines={1}
              >
                {locationText}
              </ThemedText>
            </View>
          </View>
          </View>

          <View
            style={[styles.divider, { backgroundColor: theme.border, opacity: 0.8 }]}
          />

          <View style={styles.infoBlock}>
          <ThemedText
            type="caption"
            style={[styles.sectionLabel, { color: theme.textSecondary }]}
          >
            Description
          </ThemedText>
          <ThemedText type="body" style={styles.sectionBody}>
            {descriptionText}
          </ThemedText>
          </View>

          <View style={styles.infoBlock}>
          <ThemedText
            type="caption"
            style={[styles.sectionLabel, { color: theme.textSecondary }]}
          >
            Classification
          </ThemedText>
          <View style={styles.classificationRow}>
            {classificationTags.map((tag, index) => {
              const normalizedTag = tag.startsWith("#") ? tag : `#${tag}`;
              return (
                <View
                  key={`${normalizedTag}-${index}`}
                  style={[
                    styles.classificationChip,
                    {
                      backgroundColor: theme.backgroundSecondary,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <ThemedText type="body" style={styles.classificationText}>
                    {normalizedTag}
                  </ThemedText>
                </View>
              );
            })}
          </View>
          </View>

          <View
            style={[
              styles.technicalCard,
              { backgroundColor: theme.backgroundSecondary, borderColor: theme.border },
            ]}
          >
          <View style={styles.technicalRow}>
            <View style={styles.technicalItem}>
              <ThemedText
                type="caption"
                style={[styles.technicalLabel, { color: theme.textSecondary }]}
              >
                Dimensions
              </ThemedText>
              <ThemedText type="h4" style={styles.technicalValue}>
                {dimensionsText}
              </ThemedText>
            </View>
            <View style={styles.technicalItem}>
              <ThemedText
                type="caption"
                style={[styles.technicalLabel, { color: theme.textSecondary }]}
              >
                Size
              </ThemedText>
              <ThemedText type="h4" style={styles.technicalValue}>
                {estimatedSizeText}
              </ThemedText>
            </View>
          </View>

          <View style={styles.technicalRow}>
            <View style={styles.technicalItem}>
              <ThemedText
                type="caption"
                style={[styles.technicalLabel, { color: theme.textSecondary }]}
              >
                Format
              </ThemedText>
              <ThemedText type="h4" style={styles.technicalValue}>
                {formatText}
              </ThemedText>
            </View>
            <View style={styles.technicalItem}>
              <ThemedText
                type="caption"
                style={[styles.technicalLabel, { color: theme.textSecondary }]}
              >
                Archived By
              </ThemedText>
              <ThemedText type="h4" style={styles.technicalValue}>
                {archivedByText}
              </ThemedText>
            </View>
          </View>
          </View>

          <View style={styles.metadataSection}>
          <View
            style={[styles.yearBadge, { backgroundColor: theme.sepiaLight }]}
          >
            <ThemedText
              type="caption"
              style={[styles.yearText, { color: theme.sepia }]}
            >
              {photo.year}
            </ThemedText>
          </View>

          {photo.tags && photo.tags.length > 0 ? (
            <View style={styles.tagsRow}>
              {photo.tags.map((tag, index) => (
                <View
                  key={index}
                  style={[
                    styles.tag,
                    { backgroundColor: theme.backgroundSecondary },
                  ]}
                >
                  <ThemedText type="caption">{tag}</ThemedText>
                </View>
              ))}
            </View>
          ) : null}
          </View>

          {photo.caption ? (
            <ThemedText type="body" style={styles.caption}>
              {photo.caption}
            </ThemedText>
          ) : null}

          {photo.userName ? (
            <View style={styles.userSection}>
            <Image source={photo.userAvatar} style={styles.avatar} />
            <View style={styles.userInfo}>
              <ThemedText type="body" style={styles.userName}>
                {photo.userName}
              </ThemedText>
              <View style={styles.pointsBadge}>
                <Feather name="star" size={12} color={theme.accent} />
                <ThemedText
                  type="caption"
                  style={{ color: theme.accent, marginLeft: 2 }}
                >
                  {photo.userPoints}
                </ThemedText>
              </View>
            </View>
            </View>
          ) : null}

          {photo.isShared ? (
            <View style={styles.actionsSection}>
            <Pressable
              onPress={() => toggleLike(photo.id)}
              style={({ pressed }) => [
                styles.actionButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Feather
                name="heart"
                size={24}
                color={photo.isLiked ? theme.error : theme.textSecondary}
              />
              <ThemedText
                type="body"
                style={{ color: theme.textSecondary, marginLeft: Spacing.sm }}
              >
                {photo.likes}
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() => setShowComments(!showComments)}
              style={({ pressed }) => [
                styles.actionButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Feather
                name="message-circle"
                size={24}
                color={theme.textSecondary}
              />
              <ThemedText
                type="body"
                style={{ color: theme.textSecondary, marginLeft: Spacing.sm }}
              >
                {photo.comments}
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [
                styles.actionButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Feather name="share" size={24} color={theme.textSecondary} />
            </Pressable>

            <Pressable
              onPress={handleDownload}
              style={({ pressed }) => [
                styles.actionButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Feather name="download" size={24} color={theme.textSecondary} />
            </Pressable>
            </View>
          ) : null}

          {showComments ? (
            <View style={styles.commentsSection}>
            <ThemedText type="h4" style={styles.commentsTitle}>
              Comments
            </ThemedText>
            {SAMPLE_COMMENTS.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <ThemedText type="body" style={styles.commentUser}>
                  {comment.userName}
                </ThemedText>
                <ThemedText type="body">{comment.text}</ThemedText>
                <ThemedText
                  type="caption"
                  style={{ color: theme.textSecondary }}
                >
                  {comment.timeAgo}
                </ThemedText>
              </View>
            ))}
            <View style={styles.commentInputRow}>
              <TextInput
                style={[
                  styles.commentInput,
                  {
                    backgroundColor: theme.backgroundSecondary,
                    color: theme.text,
                  },
                ]}
                placeholder="Add a comment..."
                placeholderTextColor={theme.textSecondary}
                value={commentText}
                onChangeText={setCommentText}
              />
              <Pressable
                onPress={() => {
                  setCommentText("");
                  Alert.alert("Comment", "Comment posted!");
                }}
                style={({ pressed }) => [
                  styles.sendButton,
                  { backgroundColor: theme.sepia, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Feather name="send" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
            </View>
          ) : null}

          <View style={styles.metaInfo}>
          <Feather name="calendar" size={14} color={theme.textSecondary} />
          <ThemedText
            type="small"
            style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}
          >
            Uploaded {photo.uploadDate}
          </ThemedText>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={isLightboxVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLightboxVisible(false)}
      >
        <View style={styles.lightboxBackdrop}>
          <View style={styles.lightboxControls}>
            <Pressable
              onPress={() => setLightboxZoom((value) => Math.max(1, value - 0.25))}
              style={[styles.lightboxButton, { backgroundColor: theme.backgroundSecondary }]}
            >
              <Feather name="minus" size={18} color={theme.text} />
            </Pressable>
            <Pressable
              onPress={() => setLightboxZoom((value) => Math.min(3, value + 0.25))}
              style={[styles.lightboxButton, { backgroundColor: theme.backgroundSecondary }]}
            >
              <Feather name="plus" size={18} color={theme.text} />
            </Pressable>
            <Pressable
              onPress={() => setLightboxZoom(1)}
              style={[styles.lightboxButton, { backgroundColor: theme.backgroundSecondary }]}
            >
              <Feather name="rotate-ccw" size={18} color={theme.text} />
            </Pressable>
            <Pressable
              onPress={() => setIsLightboxVisible(false)}
              style={[styles.lightboxButton, { backgroundColor: theme.error }]}
            >
              <Feather name="x" size={18} color="#FFFFFF" />
            </Pressable>
          </View>

          <View
            style={[
              styles.lightboxImageFrame,
              {
                width: lightboxImageWidth,
                height: lightboxImageHeight,
              },
            ]}
          >
            <Image
              source={{ uri: photo.uri }}
              style={[styles.lightboxImage, { transform: [{ scale: lightboxZoom }] }]}
              resizeMode="contain"
            />
          </View>
        </View>
      </Modal>

      {isOwnPhoto ? (
        <AnimatedPressable
          onPress={handleDelete}
          onPressIn={() => {
            deleteScale.value = withSpring(0.9, {
              damping: 15,
              stiffness: 200,
            });
          }}
          onPressOut={() => {
            deleteScale.value = withSpring(1, { damping: 15, stiffness: 200 });
          }}
          style={[
            styles.deleteButton,
            {
              backgroundColor: theme.error,
              bottom: insets.bottom + Spacing.xl,
              ...Shadows.float,
            },
            deleteAnimatedStyle,
          ]}
        >
          <Feather name="trash-2" size={20} color="#FFFFFF" />
        </AnimatedPressable>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
  },
  detailContent: {
    width: "100%",
  },
  imageFrame: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    marginBottom: Spacing.xl,
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  zoomHint: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  detailHeader: {
    marginBottom: Spacing.lg,
  },
  catalogText: {
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: Spacing.sm,
  },
  detailTitle: {
    textTransform: "uppercase",
    marginBottom: Spacing.md,
  },
  detailMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  inlineMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    maxWidth: "100%",
  },
  detailMetaText: {
    fontSize: 16,
  },
  divider: {
    width: "100%",
    height: 1,
    marginBottom: Spacing.xl,
  },
  infoBlock: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginBottom: Spacing.md,
  },
  sectionBody: {
    lineHeight: 30,
  },
  classificationRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  classificationChip: {
    borderWidth: 1,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  classificationText: {
    fontWeight: "600",
  },
  technicalCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  technicalRow: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  technicalItem: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.xs,
  },
  technicalLabel: {
    textTransform: "none",
    letterSpacing: 0,
  },
  technicalValue: {
    fontSize: 22,
  },
  metadataSection: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  yearBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  yearText: {
    textTransform: "uppercase",
    fontWeight: "600",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  tag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  caption: {
    marginBottom: Spacing.xl,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userInfo: {
    marginLeft: Spacing.md,
  },
  userName: {
    fontWeight: "600",
  },
  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  actionsSection: {
    flexDirection: "row",
    gap: Spacing["2xl"],
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    marginBottom: Spacing.xl,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentsSection: {
    marginBottom: Spacing.xl,
  },
  commentsTitle: {
    marginBottom: Spacing.lg,
  },
  commentItem: {
    marginBottom: Spacing.lg,
  },
  commentUser: {
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  commentInputRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  commentInput: {
    flex: 1,
    height: 44,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    position: "absolute",
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  lightboxBackdrop: {
    flex: 1,
    backgroundColor: "rgba(8, 8, 10, 0.92)",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
  },
  lightboxControls: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  lightboxButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  lightboxImageFrame: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  lightboxImage: {
    width: "100%",
    height: "100%",
  },
});
