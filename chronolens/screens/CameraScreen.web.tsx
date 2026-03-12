import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/hooks/useTheme";
import { usePhotoStore } from "@/store/photoStore";
import UploadModal from "@/screens/UploadModal";

export default function CameraScreen({ navigation }: any) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { addPhoto } = usePhotoStore();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const addToArchive = (
    photoUri: string,
    createdAt?: string | number | Date,
  ) => {
    const parsedDate = createdAt ? new Date(createdAt) : new Date();
    const isValidDate = !Number.isNaN(parsedDate.getTime());
    const date = isValidDate ? parsedDate : new Date();
    const year = date.getFullYear();
    const isoDate = date.toISOString().split("T")[0];

    addPhoto({
      uri: photoUri,
      year,
      date: isoDate,
      title: `Imported Archive ${year}`,
      caption: "Added from desktop upload",
      catalogNumber: `REF.${year}-${Date.now().toString().slice(-4)}`,
      tags: ["New"],
      isShared: false,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <View
          style={[styles.iconWrap, { backgroundColor: `${theme.accent}16` }]}
        >
          <Feather name="upload" size={28} color={theme.accent} />
        </View>

        <Text style={[styles.title, { color: theme.text }]}>
          Desktop Upload
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Import images from your computer into your archive. Camera capture is
          available on mobile devices.
        </Text>

        <Pressable
          onPress={() => setShowUploadModal(true)}
          style={[styles.primaryButton, { backgroundColor: theme.accent }]}
        >
          <Text
            style={[styles.primaryLabel, { color: theme.backgroundDefault }]}
          >
            Choose Photos
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("TimelineTab")}
          style={[styles.secondaryButton, { borderColor: theme.border }]}
        >
          <Text style={[styles.secondaryLabel, { color: theme.text }]}>
            Go to Timeline
          </Text>
        </Pressable>
      </View>

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadComplete={(assets) => {
          assets.forEach((asset) => {
            if (asset?.uri) {
              addToArchive(asset.uri, asset.creationTime);
            }
          });

          if (assets.length > 0) {
            Alert.alert(
              "Uploaded",
              `${assets.length} photo${assets.length > 1 ? "s" : ""} added to your archive.`,
              [
                {
                  text: "OK",
                  onPress: () => navigation.navigate("TimelineTab"),
                },
              ],
            );
          }
        }}
      />

      <View style={{ height: Math.max(insets.bottom, 12) }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 560,
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontFamily: "Cinzel-Regular",
    fontSize: 28,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginBottom: 22,
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  primaryLabel: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    width: "100%",
    alignItems: "center",
  },
  secondaryLabel: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
