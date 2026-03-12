import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import * as MediaLibrary from "expo-media-library";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePhotoStore } from "@/store/photoStore";
import UploadModal from "@/screens/UploadModal";

export default function CameraScreen({ navigation }: any) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<any>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const { addPhoto } = usePhotoStore();

  const [cameraType, setCameraType] = useState<any>("back");
  const [flashMode, setFlashMode] = useState<any>("off");
  const [showGrid, setShowGrid] = useState(true);
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
      title: `New Capture ${year}`,
      caption: "Added from camera",
      catalogNumber: `REF.${year}-${Date.now().toString().slice(-4)}`,
      tags: ["New"],
      isShared: false,
    });
  };

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission?.granted, requestPermission]);

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.95,
          skipProcessing: false,
        });

        // Save to media library
        await MediaLibrary.saveToLibraryAsync(photo.uri);

        // Add to app archive
        addToArchive(photo.uri);

        Alert.alert("Captured", "Photo added to your archive.", [
          { text: "Stay", style: "cancel" },
          {
            text: "View Timeline",
            onPress: () => navigation.navigate("TimelineTab"),
          },
        ]);
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };

  const toggleCameraType = () => {
    setCameraType((current: string) => (current === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlashMode((current: string) => (current === "off" ? "on" : "off"));
  };

  const handleImport = async () => {
    setShowUploadModal(true);
  };

  if (!permission?.granted) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <View
          style={[
            styles.permissionCard,
            {
              backgroundColor: theme.backgroundSecondary,
              borderColor: theme.border,
            },
          ]}
        >
          <Feather
            name="camera-off"
            size={48}
            color={theme.accent}
            style={{ marginBottom: 16 }}
          />
          <Text style={[styles.permissionTitle, { color: theme.text }]}>
            Camera Access Denied
          </Text>
          <Text style={[styles.permissionText, { color: theme.textSecondary }]}>
            ChronoLens needs camera permissions to capture photos. Please enable
            camera access in your device settings.
          </Text>
          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.button, { backgroundColor: theme.accent }]}
          >
            <Text
              style={[styles.buttonText, { color: theme.backgroundDefault }]}
            >
              Go Back
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraType}
        flash={flashMode}
      >
        {/* Grid Overlay */}
        {showGrid && (
          <View style={styles.gridOverlay}>
            {[...Array(9)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.gridCell,
                  { borderColor: "rgba(255, 255, 255, 0.3)" },
                ]}
              />
            ))}
          </View>
        )}

        {/* Center Focus Indicator */}
        <View style={styles.focusIndicator}>
          <View style={[styles.focusBox, { borderColor: theme.accent }]} />
          <View
            style={[
              styles.focusCorner,
              styles.focusCornerTL,
              { borderColor: theme.accent },
            ]}
          />
          <View
            style={[
              styles.focusCorner,
              styles.focusCornerTR,
              { borderColor: theme.accent },
            ]}
          />
          <View
            style={[
              styles.focusCorner,
              styles.focusCornerBL,
              { borderColor: theme.accent },
            ]}
          />
          <View
            style={[
              styles.focusCorner,
              styles.focusCornerBR,
              { borderColor: theme.accent },
            ]}
          />
        </View>

        {/* Top Controls */}
        <View style={[styles.topControls, { top: insets.top + 24 }]}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.iconButton, { backgroundColor: "rgba(0,0,0,0.6)" }]}
          >
            <Feather name="x" size={24} color="white" />
          </Pressable>

          <View style={styles.scannerModeLabel}>
            <Text style={styles.scannerModeText}>CAPTURE / SCAN</Text>
          </View>

          <View style={styles.topRightControls}>
            <Pressable
              onPress={() => setShowGrid(!showGrid)}
              style={[
                styles.iconButton,
                {
                  backgroundColor: "rgba(0,0,0,0.5)",
                  borderWidth: showGrid ? 2 : 0,
                  borderColor: theme.accent,
                },
              ]}
            >
              <Feather name="grid" size={20} color="white" />
            </Pressable>

            <Pressable
              onPress={toggleFlash}
              style={[
                styles.iconButton,
                {
                  backgroundColor: "rgba(0,0,0,0.5)",
                  borderWidth: flashMode === "on" ? 2 : 0,
                  borderColor: theme.accent,
                },
              ]}
            >
              <Feather
                name={flashMode === "on" ? "zap" : "zap-off"}
                size={20}
                color="white"
              />
            </Pressable>
          </View>
        </View>

        {/* Bottom Controls */}
        <View
          style={[
            styles.bottomControls,
            { bottom: Math.max(insets.bottom, 24) + 80 },
          ]}
        >
          <Pressable
            onPress={handleImport}
            style={styles.tabLikeButton}
          >
            <View style={styles.tabLikeIconContainer}>
              <Feather name="image" size={24} color={theme.tabIconDefault} />
            </View>
            <Text style={[styles.tabLikeLabel, { color: theme.tabIconDefault }]}>
              Library
            </Text>
          </Pressable>

          {/* Capture Button */}
          <Pressable
            onPress={handleCapture}
            style={[styles.captureButton, { borderColor: theme.accent }]}
          >
            <View
              style={[
                styles.captureButtonInner,
                { backgroundColor: theme.accent },
              ]}
            />
            <Text style={[styles.captureLabel, { color: theme.accent }]}>
              Capture
            </Text>
          </Pressable>

          {/* Switch Camera */}
          <Pressable
            onPress={toggleCameraType}
            style={styles.tabLikeButton}
          >
            <View style={styles.tabLikeIconContainer}>
              <Feather name="repeat" size={24} color={theme.tabIconDefault} />
            </View>
            <Text style={[styles.tabLikeLabel, { color: theme.tabIconDefault }]}>
              Switch
            </Text>
          </Pressable>
        </View>
      </CameraView>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  camera: {
    flex: 1,
  },
  permissionCard: {
    padding: 24,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: "center",
    maxWidth: 400,
  },
  permissionTitle: {
    fontFamily: "Cinzel-Regular",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  permissionText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: " JetBrainsMono-Regular",
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  gridOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridCell: {
    width: "33.333%",
    height: "33.333%",
    borderWidth: 0.5,
  },
  focusIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 128,
    height: 128,
    marginLeft: -64,
    marginTop: -64,
  },
  focusBox: {
    width: "100%",
    height: "100%",
    borderWidth: 2,
    borderRadius: 8,
  },
  focusCorner: {
    position: "absolute",
    width: 16,
    height: 16,
  },
  focusCornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  focusCornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  focusCornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  focusCornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  topControls: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  scannerModeLabel: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scannerModeText: {
    color: "white",
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    opacity: 0.8,
  },
  topRightControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  bottomControls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  tabLikeButton: {
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 1000,
    gap: 4,
  },
  tabLikeIconContainer: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  tabLikeLabel: {
    fontSize: 10,
    fontWeight: "500",
    fontFamily: "JetBrainsMono-Regular",
  },
  captureButton: {
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    zIndex: 1000,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  captureLabel: {
    fontSize: 10,
    fontWeight: "500",
    fontFamily: "JetBrainsMono-Regular",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});
