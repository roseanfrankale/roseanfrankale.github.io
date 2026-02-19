import React, { useState } from "react";
import { 
  View, 
  StyleSheet, 
  Image, 
  Pressable,
  Dimensions,
  Alert,
  ScrollView,
  TextInput,
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

const { width } = Dimensions.get("window");
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CommentData {
  id: string;
  userName: string;
  text: string;
  timeAgo: string;
}

const SAMPLE_COMMENTS: CommentData[] = [
  { id: "1", userName: "Sarah M.", text: "This brings back so many memories!", timeAgo: "2h ago" },
  { id: "2", userName: "Michael R.", text: "Beautiful photo. What camera was this taken with?", timeAgo: "5h ago" },
];

export default function PhotoDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<TimelineStackParamList>>();
  const route = useRoute<RouteProp<TimelineStackParamList, "PhotoDetail">>();
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { getPhotoById, toggleLike, deletePhoto } = usePhotoStore();
  
  const photo = getPhotoById(route.params.photoId);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

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
      ]
    );
  };

  const handleShare = () => {
    Alert.alert("Share", "Sharing functionality coming soon!");
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerHeight + Spacing.md, paddingBottom: insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: photo.uri }} style={styles.image} resizeMode="cover" />

        <View style={styles.metadataSection}>
          <View style={[styles.yearBadge, { backgroundColor: theme.sepiaLight }]}>
            <ThemedText type="caption" style={[styles.yearText, { color: theme.sepia }]}>
              {photo.year}
            </ThemedText>
          </View>

          {photo.tags && photo.tags.length > 0 ? (
            <View style={styles.tagsRow}>
              {photo.tags.map((tag, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: theme.backgroundSecondary }]}>
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
                <ThemedText type="caption" style={{ color: theme.accent, marginLeft: 2 }}>
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
              <ThemedText type="body" style={{ color: theme.textSecondary, marginLeft: Spacing.sm }}>
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
              <Feather name="message-circle" size={24} color={theme.textSecondary} />
              <ThemedText type="body" style={{ color: theme.textSecondary, marginLeft: Spacing.sm }}>
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
                <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                  {comment.timeAgo}
                </ThemedText>
              </View>
            ))}
            <View style={styles.commentInputRow}>
              <TextInput
                style={[
                  styles.commentInput,
                  { backgroundColor: theme.backgroundSecondary, color: theme.text },
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
          <ThemedText type="small" style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}>
            Uploaded {photo.uploadDate}
          </ThemedText>
        </View>
      </ScrollView>

      {isOwnPhoto ? (
        <AnimatedPressable
          onPress={handleDelete}
          onPressIn={() => {
            deleteScale.value = withSpring(0.9, { damping: 15, stiffness: 200 });
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
  image: {
    width: width - Spacing.xl * 2,
    height: width - Spacing.xl * 2,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
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
});
