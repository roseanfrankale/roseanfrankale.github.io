import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  TextInput,
  Switch,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { usePhotoStore } from "@/store/photoStore";
import { useUserStore } from "@/store/userStore";

interface UploadModalProps {
  visible: boolean;
  onClose: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DECADES = [
  "2020s", "2010s", "2000s", "1990s", "1980s", "1970s", "1960s", "1950s", "1940s", "Earlier"
];

const YEARS_BY_DECADE: Record<string, number[]> = {
  "2020s": [2024, 2023, 2022, 2021, 2020],
  "2010s": [2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010],
  "2000s": [2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000],
  "1990s": [1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991, 1990],
  "1980s": [1989, 1988, 1987, 1986, 1985, 1984, 1983, 1982, 1981, 1980],
  "1970s": [1979, 1978, 1977, 1976, 1975, 1974, 1973, 1972, 1971, 1970],
  "1960s": [1969, 1968, 1967, 1966, 1965, 1964, 1963, 1962, 1961, 1960],
  "1950s": [1959, 1958, 1957, 1956, 1955, 1954, 1953, 1952, 1951, 1950],
  "1940s": [1949, 1948, 1947, 1946, 1945, 1944, 1943, 1942, 1941, 1940],
  "Earlier": [1939, 1935, 1930, 1925, 1920, 1915, 1910, 1905, 1900],
};

interface SourceButtonProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}

function SourceButton({ icon, label, onPress }: SourceButtonProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      }}
      style={[
        styles.sourceButton,
        { backgroundColor: theme.backgroundDefault },
        Shadows.card,
        animatedStyle,
      ]}
    >
      <View style={[styles.sourceIconContainer, { backgroundColor: theme.sepiaLight }]}>
        <Feather name={icon} size={32} color={theme.sepia} />
      </View>
      <ThemedText type="body" style={styles.sourceLabel}>
        {label}
      </ThemedText>
    </AnimatedPressable>
  );
}

export default function UploadModal({ visible, onClose }: UploadModalProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { addPhoto } = usePhotoStore();
  const { addPoints } = useUserStore();

  const [step, setStep] = useState<"source" | "details">("source");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedDecade, setSelectedDecade] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [isShared, setIsShared] = useState(false);

  const reset = () => {
    setStep("source");
    setImageUri(null);
    setSelectedDecade(null);
    setSelectedYear(null);
    setCaption("");
    setTags("");
    setIsShared(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Camera permission is needed to take photos. Please enable it in Settings."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setStep("details");
    }
  };

  const handleChooseFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Photo library access is needed to select photos. Please enable it in Settings."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setStep("details");
    }
  };

  const handleSave = () => {
    if (!imageUri || !selectedYear) {
      Alert.alert("Missing Information", "Please select a photo and year.");
      return;
    }

    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    addPhoto({
      uri: imageUri,
      year: selectedYear,
      caption: caption.trim() || undefined,
      tags: tagList.length > 0 ? tagList : undefined,
      isShared,
    });

    const points = isShared ? 15 : 10;
    addPoints(points);

    Alert.alert(
      "Photo Saved",
      `Your memory has been added to your timeline! You earned ${points} points.`,
      [{ text: "OK", onPress: handleClose }]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable
            onPress={step === "details" ? () => setStep("source") : handleClose}
            style={({ pressed }) => [
              styles.headerButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Feather
              name={step === "details" ? "arrow-left" : "x"}
              size={24}
              color={theme.text}
            />
          </Pressable>
          <ThemedText type="h4" style={styles.headerTitle}>
            {step === "source" ? "Add Photo" : "Photo Details"}
          </ThemedText>
          <View style={styles.headerButton} />
        </View>

        {step === "source" ? (
          <View style={styles.sourceContainer}>
            <ThemedText type="h2" style={styles.sourceTitle}>
              Choose Photo Source
            </ThemedText>
            <ThemedText type="body" style={[styles.sourceSubtitle, { color: theme.textSecondary }]}>
              Take a new photo or select one from your library
            </ThemedText>
            <View style={styles.sourceButtons}>
              <SourceButton
                icon="camera"
                label="Take Photo"
                onPress={handleTakePhoto}
              />
              <SourceButton
                icon="image"
                label="Choose from Library"
                onPress={handleChooseFromLibrary}
              />
            </View>
          </View>
        ) : (
          <ScrollView
            style={styles.detailsScroll}
            contentContainerStyle={[
              styles.detailsContent,
              { paddingBottom: insets.bottom + Spacing.xl },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : null}

            <View style={styles.fieldSection}>
              <ThemedText type="h4" style={styles.fieldLabel}>
                Time Period
              </ThemedText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.decadeRow}
              >
                {DECADES.map((decade) => (
                  <Pressable
                    key={decade}
                    onPress={() => {
                      setSelectedDecade(decade);
                      setSelectedYear(null);
                    }}
                    style={[
                      styles.decadeChip,
                      {
                        backgroundColor:
                          selectedDecade === decade ? theme.sepia : theme.sepiaLight,
                      },
                    ]}
                  >
                    <ThemedText
                      type="caption"
                      style={{
                        color: selectedDecade === decade ? "#FFFFFF" : theme.sepia,
                      }}
                    >
                      {decade}
                    </ThemedText>
                  </Pressable>
                ))}
              </ScrollView>

              {selectedDecade ? (
                <View style={styles.yearGrid}>
                  {YEARS_BY_DECADE[selectedDecade]?.map((year) => (
                    <Pressable
                      key={year}
                      onPress={() => setSelectedYear(year)}
                      style={[
                        styles.yearChip,
                        {
                          backgroundColor:
                            selectedYear === year ? theme.sepia : theme.backgroundSecondary,
                        },
                      ]}
                    >
                      <ThemedText
                        type="body"
                        style={{
                          color: selectedYear === year ? "#FFFFFF" : theme.text,
                          fontWeight: selectedYear === year ? "600" : "400",
                        }}
                      >
                        {year}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>

            <View style={styles.fieldSection}>
              <ThemedText type="h4" style={styles.fieldLabel}>
                Caption (optional)
              </ThemedText>
              <TextInput
                style={[
                  styles.textInput,
                  styles.multilineInput,
                  { backgroundColor: theme.backgroundSecondary, color: theme.text },
                ]}
                placeholder="Tell the story behind this photo..."
                placeholderTextColor={theme.textSecondary}
                value={caption}
                onChangeText={setCaption}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.fieldSection}>
              <ThemedText type="h4" style={styles.fieldLabel}>
                Tags (optional)
              </ThemedText>
              <TextInput
                style={[
                  styles.textInput,
                  { backgroundColor: theme.backgroundSecondary, color: theme.text },
                ]}
                placeholder="family, vacation, birthday (comma-separated)"
                placeholderTextColor={theme.textSecondary}
                value={tags}
                onChangeText={setTags}
              />
            </View>

            <View style={[styles.fieldSection, styles.switchRow]}>
              <View style={styles.switchLabel}>
                <Feather name="globe" size={20} color={theme.sepia} />
                <View style={styles.switchLabelText}>
                  <ThemedText type="body" style={styles.switchTitle}>
                    Share with Community
                  </ThemedText>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    Earn extra points by sharing
                  </ThemedText>
                </View>
              </View>
              <Switch
                value={isShared}
                onValueChange={setIsShared}
                trackColor={{ false: theme.backgroundTertiary, true: theme.sepia }}
                thumbColor="#FFFFFF"
              />
            </View>

            <Pressable
              onPress={handleSave}
              disabled={!selectedYear}
              style={({ pressed }) => [
                styles.saveButton,
                {
                  backgroundColor: selectedYear ? theme.sepia : theme.backgroundTertiary,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <ThemedText type="body" style={styles.saveButtonText}>
                Save to Timeline
              </ThemedText>
            </Pressable>
          </ScrollView>
        )}
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    textAlign: "center",
  },
  sourceContainer: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing["4xl"],
  },
  sourceTitle: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  sourceSubtitle: {
    textAlign: "center",
    marginBottom: Spacing["3xl"],
  },
  sourceButtons: {
    gap: Spacing.lg,
  },
  sourceButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  sourceIconContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.xl,
  },
  sourceLabel: {
    fontWeight: "600",
  },
  detailsScroll: {
    flex: 1,
  },
  detailsContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  previewImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  fieldSection: {
    marginBottom: Spacing.xl,
  },
  fieldLabel: {
    marginBottom: Spacing.md,
  },
  decadeRow: {
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  decadeChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  yearGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  yearChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  textInput: {
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchLabel: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  switchLabelText: {
    marginLeft: Spacing.md,
  },
  switchTitle: {
    fontWeight: "600",
  },
  saveButton: {
    height: 56,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.lg,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 17,
  },
});
