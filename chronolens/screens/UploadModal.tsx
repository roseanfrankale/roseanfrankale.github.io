import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../hooks/useTheme";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCameraClick?: () => void;
}

export default function UploadModal({
  isOpen,
  onClose,
  onCameraClick,
}: UploadModalProps) {
  const { colors } = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedMetadata, setDetectedMetadata] = useState<any>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.95,
    });

    if (!result.canceled) {
      await processImages(result.assets);
    }
  };

  const processImages = async (assets: any[]) => {
    setIsProcessing(true);

    // Simulate AI detection
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setDetectedMetadata({
      date: "2024-06-15",
      location: "Paris, France",
      era: "Contemporary",
      confidence: 0.87,
    });

    setIsProcessing(false);

    // Auto-close after showing results
    setTimeout(() => {
      setDetectedMetadata(null);
      onClose();
    }, 2000);
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            styles.modalContent,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          {/* Header */}
          <View
            style={[
              styles.header,
              {
                backgroundColor: colors.cardAlt,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <View>
              <Text style={[styles.title, { color: colors.text }]}>
                upload photographs
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                automatic detection enabled
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={18} color={colors.text} />
            </Pressable>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {isProcessing ? (
              <View style={styles.processingContainer}>
                <ActivityIndicator
                  size="large"
                  color={colors.accent}
                  style={{ marginBottom: 16 }}
                />
                <Text style={[styles.processingText, { color: colors.text }]}>
                  analyzing photograph
                </Text>
                <Text
                  style={[
                    styles.processingSubtext,
                    { color: colors.textSecondary },
                  ]}
                >
                  detecting date, location, and metadata
                </Text>
              </View>
            ) : detectedMetadata ? (
              <View style={styles.resultsContainer}>
                <View
                  style={[
                    styles.resultsCard,
                    {
                      backgroundColor: colors.accent + "1A",
                      borderColor: colors.accent + "4D",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.resultsTitle,
                      { color: colors.textSecondary },
                    ]}
                  >
                    ✓ detection complete
                  </Text>
                  <View style={styles.resultsGrid}>
                    <View style={styles.resultRow}>
                      <Text
                        style={[
                          styles.resultLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        date:
                      </Text>
                      <Text
                        style={[styles.resultValue, { color: colors.text }]}
                      >
                        {detectedMetadata.date}
                      </Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text
                        style={[
                          styles.resultLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        location:
                      </Text>
                      <Text
                        style={[styles.resultValue, { color: colors.text }]}
                      >
                        {detectedMetadata.location}
                      </Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text
                        style={[
                          styles.resultLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        era:
                      </Text>
                      <Text
                        style={[styles.resultValue, { color: colors.text }]}
                      >
                        {detectedMetadata.era}
                      </Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text
                        style={[
                          styles.resultLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        confidence:
                      </Text>
                      <Text
                        style={[styles.resultValue, { color: colors.text }]}
                      >
                        {(detectedMetadata.confidence * 100).toFixed(0)}%
                      </Text>
                    </View>
                  </View>
                </View>
                <Text
                  style={[
                    styles.processingSubtext,
                    {
                      color: colors.textSecondary,
                      textAlign: "center",
                      marginTop: 16,
                    },
                  ]}
                >
                  adding to archive...
                </Text>
              </View>
            ) : (
              <>
                {/* Camera Option */}
                {onCameraClick && (
                  <Pressable
                    onPress={() => {
                      onClose();
                      onCameraClick();
                    }}
                    style={({ pressed }) => [
                      styles.option,
                      {
                        borderColor: pressed ? colors.accent : colors.border,
                        backgroundColor: pressed
                          ? colors.cardAlt
                          : "transparent",
                      },
                    ]}
                  >
                    <Feather name="camera" size={24} color={colors.accent} />
                    <View style={styles.optionText}>
                      <Text
                        style={[styles.optionTitle, { color: colors.text }]}
                      >
                        capture with camera
                      </Text>
                      <Text
                        style={[
                          styles.optionSubtitle,
                          { color: colors.textSecondary },
                        ]}
                      >
                        take a new photo
                      </Text>
                    </View>
                  </Pressable>
                )}

                {/* Upload Option */}
                <Pressable
                  onPress={pickImage}
                  style={({ pressed }) => [
                    styles.uploadArea,
                    {
                      borderColor: pressed ? colors.accent : colors.border,
                      backgroundColor: pressed ? colors.cardAlt : "transparent",
                    },
                  ]}
                >
                  <Feather
                    name="upload"
                    size={40}
                    color={colors.textSecondary}
                    style={{ opacity: 0.5, marginBottom: 16 }}
                  />
                  <Text style={[styles.uploadTitle, { color: colors.text }]}>
                    tap to select photographs
                  </Text>
                  <Text
                    style={[
                      styles.uploadSubtitle,
                      { color: colors.textSecondary },
                    ]}
                  >
                    supports jpg, png, tiff • automatic metadata detection
                  </Text>
                </Pressable>

                {/* Info Panel */}
                <View
                  style={[
                    styles.infoPanel,
                    {
                      backgroundColor: colors.cardAlt,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.infoPanelTitle,
                      { color: colors.textSecondary },
                    ]}
                  >
                    detection features
                  </Text>
                  <Text
                    style={[
                      styles.infoPanelText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    • automatic date extraction from exif data{"\n"}• ai-powered
                    era classification{"\n"}• location detection and geocoding
                    {"\n"}• catalog number auto-generation
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.95)",
  },
  modalContent: {
    width: "100%",
    maxWidth: 600,
    borderWidth: 1,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontFamily: "Cinzel-Regular",
    fontSize: 18,
    fontWeight: "400",
    textTransform: "lowercase",
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    opacity: 0.7,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    padding: 24,
  },
  processingContainer: {
    paddingVertical: 48,
    alignItems: "center",
  },
  processingText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  processingSubtext: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    opacity: 0.6,
  },
  resultsContainer: {
    paddingVertical: 24,
  },
  resultsCard: {
    padding: 20,
    borderWidth: 1,
  },
  resultsTitle: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    opacity: 0.7,
    marginBottom: 16,
  },
  resultsGrid: {
    gap: 8,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resultLabel: {
    fontFamily: "System",
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    opacity: 0.7,
  },
  resultValue: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 11,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  optionSubtitle: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    opacity: 0.6,
  },
  uploadArea: {
    padding: 48,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 16,
  },
  uploadTitle: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    opacity: 0.6,
    textAlign: "center",
  },
  infoPanel: {
    padding: 16,
    borderWidth: 1,
  },
  infoPanelTitle: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    opacity: 0.7,
    marginBottom: 8,
  },
  infoPanelText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    opacity: 0.7,
    lineHeight: 16,
  },
});
