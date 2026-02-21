import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import * as MediaLibrary from "expo-media-library";

export default function CameraScreen({ navigation }: any) {
  const { theme } = useTheme();
  const cameraRef = useRef<any>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const [cameraType, setCameraType] = useState<any>("back");
  const [flashMode, setFlashMode] = useState<any>("off");
  const [showGrid, setShowGrid] = useState(true);

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

        // Navigate back
        navigation.goBack();
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
        <View style={styles.topControls}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.iconButton, { backgroundColor: "rgba(0,0,0,0.5)" }]}
          >
            <Feather name="x" size={24} color="white" />
          </Pressable>

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
        <View style={styles.bottomControls}>
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
          </Pressable>

          {/* Switch Camera */}
          <Pressable
            onPress={toggleCameraType}
            style={[
              styles.iconButton,
              { backgroundColor: "rgba(0,0,0,0.5)", marginLeft: 16 },
            ]}
          >
            <Feather name="repeat" size={20} color="white" />
          </Pressable>

          <View style={{ flex: 1 }} />

          <Text style={[styles.cameraInfo, { color: theme.textSecondary }]}>
            {cameraType === "back" ? "Back Camera" : "Front Camera"}
          </Text>
        </View>
      </CameraView>
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
    top: Platform.OS === "ios" ? 60 : 40,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topRightControls: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomControls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  cameraInfo: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
