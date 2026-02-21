import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  TextInput,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";

interface Photo {
  id: string;
  catalogNumber: string;
  url: string;
  date: string;
  location?: string;
  era?: string;
  edited?: boolean;
  title?: string;
  description?: string;
  detectedDate?: string;
  detectedLocation?: string;
}

interface PhotoDetailModalProps {
  photo: Photo | null;
  visible: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Photo>) => void;
}

export function PhotoDetailModal({
  photo,
  visible,
  onClose,
  onUpdate,
}: PhotoDetailModalProps) {
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<Photo>>({});

  if (!photo) return null;

  const handleSave = () => {
    onUpdate(photo.id, { ...editedData, edited: true });
    setIsEditing(false);
    setEditedData({});
  };

  const currentData = { ...photo, ...editedData };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: colors.backgroundDefault,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Header */}
          <View
            style={[
              styles.header,
              {
                backgroundColor: colors.backgroundSecondary,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={[styles.title, { color: colors.text }]}
                numberOfLines={1}
              >
                {currentData.title || "photograph detail"}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={[
                    styles.catalogNumber,
                    { color: colors.textSecondary },
                  ]}
                >
                  {photo.catalogNumber}
                </Text>
                {photo.edited && (
                  <Text
                    style={[styles.editedIndicator, { color: colors.accent }]}
                  >
                    {" "}
                    *
                  </Text>
                )}
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable
                onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
                style={styles.iconButton}
              >
                <Feather
                  name={isEditing ? "check" : "edit-2"}
                  size={18}
                  color={colors.text}
                />
              </Pressable>
              <Pressable onPress={onClose} style={styles.iconButton}>
                <Feather name="x" size={18} color={colors.text} />
              </Pressable>
            </View>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={{ padding: 24 }}
          >
            {/* Image */}
            <Image
              source={{ uri: photo.url }}
              style={[styles.image, { borderColor: colors.border }]}
              resizeMode="cover"
            />

            {/* AI Detection Info */}
            {(photo.detectedDate || photo.detectedLocation) && (
              <View
                style={[
                  styles.detectionCard,
                  {
                    backgroundColor: colors.accent + "1A",
                    borderColor: colors.accent + "4D",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.detectionTitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  ai detection
                </Text>
                {photo.detectedDate && (
                  <Text style={[styles.detectionText, { color: colors.text }]}>
                    date: {photo.detectedDate}
                  </Text>
                )}
                {photo.detectedLocation && (
                  <Text style={[styles.detectionText, { color: colors.text }]}>
                    location: {photo.detectedLocation}
                  </Text>
                )}
              </View>
            )}

            {/* Editable Fields */}
            <View style={styles.fields}>
              {/* Title */}
              <View style={styles.field}>
                <Text
                  style={[styles.fieldLabel, { color: colors.textSecondary }]}
                >
                  title
                </Text>
                {isEditing ? (
                  <TextInput
                    value={currentData.title || ""}
                    onChangeText={(text) =>
                      setEditedData({ ...editedData, title: text })
                    }
                    style={[
                      styles.input,
                      {
                        color: colors.text,
                        backgroundColor: colors.backgroundSecondary,
                        borderColor: colors.border,
                      },
                    ]}
                  />
                ) : (
                  <Text style={[styles.fieldValue, { color: colors.text }]}>
                    {currentData.title || "untitled"}
                  </Text>
                )}
              </View>

              {/* Date */}
              <View style={styles.field}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Feather
                    name="calendar"
                    size={12}
                    color={colors.textSecondary}
                  />
                  <Text
                    style={[styles.fieldLabel, { color: colors.textSecondary }]}
                  >
                    date
                  </Text>
                </View>
                {isEditing ? (
                  <TextInput
                    value={currentData.date || ""}
                    onChangeText={(text) =>
                      setEditedData({ ...editedData, date: text })
                    }
                    style={[
                      styles.input,
                      styles.inputMono,
                      {
                        color: colors.text,
                        backgroundColor: colors.backgroundSecondary,
                        borderColor: colors.border,
                      },
                    ]}
                  />
                ) : (
                  <Text
                    style={[
                      styles.fieldValue,
                      styles.fieldValueMono,
                      { color: colors.text },
                    ]}
                  >
                    {currentData.date}
                  </Text>
                )}
              </View>

              {/* Location */}
              <View style={styles.field}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Feather
                    name="map-pin"
                    size={12}
                    color={colors.textSecondary}
                  />
                  <Text
                    style={[styles.fieldLabel, { color: colors.textSecondary }]}
                  >
                    location
                  </Text>
                </View>
                {isEditing ? (
                  <TextInput
                    value={currentData.location || ""}
                    onChangeText={(text) =>
                      setEditedData({ ...editedData, location: text })
                    }
                    style={[
                      styles.input,
                      styles.inputMono,
                      {
                        color: colors.text,
                        backgroundColor: colors.backgroundSecondary,
                        borderColor: colors.border,
                      },
                    ]}
                  />
                ) : (
                  <Text
                    style={[
                      styles.fieldValue,
                      styles.fieldValueMono,
                      { color: colors.text },
                    ]}
                  >
                    {currentData.location || "unknown"}
                  </Text>
                )}
              </View>

              {/* Era */}
              <View style={styles.field}>
                <Text
                  style={[styles.fieldLabel, { color: colors.textSecondary }]}
                >
                  era / period
                </Text>
                {isEditing ? (
                  <TextInput
                    value={currentData.era || ""}
                    onChangeText={(text) =>
                      setEditedData({ ...editedData, era: text })
                    }
                    style={[
                      styles.input,
                      styles.inputMono,
                      {
                        color: colors.text,
                        backgroundColor: colors.backgroundSecondary,
                        borderColor: colors.border,
                      },
                    ]}
                  />
                ) : (
                  <Text
                    style={[
                      styles.fieldValue,
                      styles.fieldValueMono,
                      { color: colors.text },
                    ]}
                  >
                    {currentData.era || "uncategorized"}
                  </Text>
                )}
              </View>

              {/* Description */}
              <View style={styles.field}>
                <Text
                  style={[styles.fieldLabel, { color: colors.textSecondary }]}
                >
                  description
                </Text>
                {isEditing ? (
                  <TextInput
                    value={currentData.description || ""}
                    onChangeText={(text) =>
                      setEditedData({ ...editedData, description: text })
                    }
                    multiline
                    numberOfLines={4}
                    style={[
                      styles.input,
                      styles.textArea,
                      {
                        color: colors.text,
                        backgroundColor: colors.backgroundSecondary,
                        borderColor: colors.border,
                      },
                    ]}
                  />
                ) : (
                  <Text style={[styles.fieldValue, { color: colors.text }]}>
                    {currentData.description || "no description available"}
                  </Text>
                )}
              </View>
            </View>
          </ScrollView>
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
    maxWidth: 800,
    maxHeight: "90%",
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
  catalogNumber: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    opacity: 0.7,
  },
  editedIndicator: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 14,
  },
  iconButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderWidth: 1,
    marginBottom: 16,
  },
  detectionCard: {
    padding: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  detectionTitle: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    opacity: 0.7,
    marginBottom: 8,
  },
  detectionText: {
    fontFamily: "System",
    fontSize: 11,
    marginBottom: 4,
  },
  fields: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    opacity: 0.7,
  },
  fieldValue: {
    fontSize: 13,
  },
  fieldValueMono: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 11,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    fontSize: 13,
  },
  inputMono: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 11,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
});
