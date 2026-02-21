import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";

const ONBOARDING_STEPS = [
  {
    id: "welcome",
    title: "Welcome to ChronoLens",
    description: "Your personal photo archiving and analysis companion",
    icon: "camera",
    historianDetails:
      "Preserve your memories with the care and precision of a master archivist. Every photograph tells a story.",
    cyberpunkDetails:
      "Scan, analyze, and catalog your temporal memories with cutting-edge detection technology.",
  },
  {
    id: "catalog",
    title: "Automatic Cataloging",
    description: "Each photo receives a unique reference number",
    icon: "archive",
    historianDetails:
      "Every entry is assigned a catalog number (REF.2026-001-A format) for proper archival organization.",
    cyberpunkDetails:
      "Neural networks automatically assign unique identification codes to each scanned image.",
  },
  {
    id: "metadata",
    title: "Smart Metadata Detection",
    description: "Automatic date and location detection",
    icon: "clock",
    historianDetails:
      "ChronoLens reads EXIF data to automatically extract dates, locations, and camera information.",
    cyberpunkDetails:
      "AI-powered scanners extract temporal coordinates and geographic metadata from image signatures.",
  },
  {
    id: "timeline",
    title: "Timeline & Explore Views",
    description: "Browse your archive by date or discover memories",
    icon: "grid",
    historianDetails:
      "Navigate through time with decade markers and contact sheet grids. Explore archival entries.",
    cyberpunkDetails:
      "Multi-dimensional browsing through temporal grids and neural network exploration feeds.",
  },
  {
    id: "themes",
    title: "Dual Theme System",
    description: "Choose between Historian and Cyberpunk aesthetics",
    icon: "droplet",
    historianDetails:
      "Warm archival paper with gold accents, inspired by vintage photo albums and ledgers.",
    cyberpunkDetails:
      "Neon cyan and magenta with scan lines, inspired by futuristic temporal scanners.",
  },
  {
    id: "profile",
    title: "Complete Your Profile",
    description: "Help us personalize your archiving experience",
    icon: "user",
    historianDetails:
      "Your profile information enables better organization and automatic location tagging for your photos.",
    cyberpunkDetails:
      "Profile data enhances AI-powered metadata detection and temporal coordinate assignment.",
  },
];

export default function OnboardingScreen() {
  const { colors, skin, setSkin } = useTheme();
  const { completeOnboarding } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState<"historian" | "cyberpunk">(
    skin,
  );
  const [birthdate, setBirthdate] = useState("");
  const [location, setLocation] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
  const isFirstStep = currentStep === 0;
  const isThemeStep = step.id === "themes";
  const isProfileStep = step.id === "profile";
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  const handleThemeSelect = (theme: "historian" | "cyberpunk") => {
    setSelectedTheme(theme);
    setSkin(theme);
  };

  const handleGetLocation = async () => {
    try {
      setIsGettingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to auto-detect your location.",
        );
        setIsGettingLocation(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (geocode[0]) {
        const addr = geocode[0];
        const locationStr =
          `${addr.city || ""}, ${addr.region || ""} ${addr.country || ""}`.trim();
        setLocation(locationStr);
      } else {
        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      }

      setIsGettingLocation(false);
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert(
        "Error",
        "Unable to get your location. Please enter it manually.",
      );
      setIsGettingLocation(false);
    }
  };

  const handleNext = async () => {
    if (isLastStep) {
      setSkin(selectedTheme);
      try {
        await completeOnboarding(
          birthdate || "1990-01-01",
          location || "Not specified",
        );
        // Navigation will happen automatically via RootNavigator watching hasCompletedOnboarding
      } catch {
        Alert.alert(
          "Error",
          "Failed to complete onboarding. Please try again.",
        );
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = async () => {
    setSkin(selectedTheme);
    try {
      await completeOnboarding("1990-01-01", "Not specified");
    } catch {
      Alert.alert("Error", "Failed to complete onboarding. Please try again.");
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.backgroundDefault }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text
              style={[styles.progressText, { color: colors.textSecondary }]}
            >
              STEP {currentStep + 1} OF {ONBOARDING_STEPS.length}
            </Text>
            <Text
              style={[styles.progressText, { color: colors.textSecondary }]}
            >
              {Math.round(progress)}%
            </Text>
          </View>
          <View
            style={[
              styles.progressBar,
              { backgroundColor: colors.backgroundSecondary },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                { backgroundColor: colors.accent, width: `${progress}%` },
              ]}
            />
          </View>
        </View>

        {/* Main Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.backgroundDefault,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: colors.accent + "1A",
                borderColor: colors.accent,
              },
            ]}
          >
            <Feather name={step.icon as any} size={40} color={colors.accent} />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>
            {step.title}
          </Text>

          {/* Description */}
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {step.description}
          </Text>

          {/* Theme-specific details (for info steps) */}
          {!isThemeStep && !isProfileStep && (
            <View
              style={[
                styles.detailsCard,
                {
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.detailsText, { color: colors.text }]}>
                {skin === "historian"
                  ? step.historianDetails
                  : step.cyberpunkDetails}
              </Text>
            </View>
          )}

          {/* Theme Selector */}
          {isThemeStep && (
            <View style={styles.themeSelectorContainer}>
              <Text style={[styles.selectorLabel, { color: colors.text }]}>
                CHOOSE YOUR THEME
              </Text>

              <View style={styles.themeGrid}>
                {/* Historian */}
                <Pressable
                  onPress={() => handleThemeSelect("historian")}
                  style={[
                    styles.themeOption,
                    {
                      borderColor:
                        selectedTheme === "historian"
                          ? colors.accent
                          : colors.border,
                      borderWidth: selectedTheme === "historian" ? 2 : 1,
                      backgroundColor:
                        selectedTheme === "historian"
                          ? colors.accent + "1A"
                          : "transparent",
                    },
                  ]}
                >
                  <View style={styles.themeOptionHeader}>
                    <Feather name="archive" size={24} color="#C9A063" />
                    {selectedTheme === "historian" && (
                      <Feather name="check" size={20} color={colors.accent} />
                    )}
                  </View>
                  <Text
                    style={[styles.themeOptionTitle, { color: colors.text }]}
                  >
                    Historian
                  </Text>
                  <Text
                    style={[
                      styles.themeOptionDesc,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Warm archival aesthetic with elegant transitions
                  </Text>
                </Pressable>

                {/* Cyberpunk */}
                <Pressable
                  onPress={() => handleThemeSelect("cyberpunk")}
                  style={[
                    styles.themeOption,
                    {
                      borderColor:
                        selectedTheme === "cyberpunk"
                          ? "#00F0FF"
                          : colors.border,
                      borderWidth: selectedTheme === "cyberpunk" ? 2 : 1,
                      backgroundColor:
                        selectedTheme === "cyberpunk"
                          ? "#00F0FF1A"
                          : "transparent",
                    },
                  ]}
                >
                  <View style={styles.themeOptionHeader}>
                    <Feather name="zap" size={24} color="#00F0FF" />
                    {selectedTheme === "cyberpunk" && (
                      <Feather name="check" size={20} color="#00F0FF" />
                    )}
                  </View>
                  <Text
                    style={[styles.themeOptionTitle, { color: colors.text }]}
                  >
                    Cyberpunk
                  </Text>
                  <Text
                    style={[
                      styles.themeOptionDesc,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Futuristic scanner with fast glitch effects
                  </Text>
                </Pressable>
              </View>

              <Text style={[styles.themeNote, { color: colors.textSecondary }]}>
                Theme changes instantly so you can preview it
              </Text>
            </View>
          )}

          {/* Profile Form */}
          {isProfileStep && (
            <View style={styles.profileForm}>
              {/* Birthdate */}
              <View style={styles.formField}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <Feather
                    name="calendar"
                    size={14}
                    color={colors.textSecondary}
                  />
                  <Text style={[styles.fieldLabel, { color: colors.text }]}>
                    BIRTHDATE (OPTIONAL)
                  </Text>
                </View>
                <TextInput
                  value={birthdate}
                  onChangeText={setBirthdate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textSecondary}
                  style={[
                    styles.formInput,
                    {
                      color: colors.text,
                      backgroundColor: colors.backgroundSecondary,
                      borderColor: colors.border,
                    },
                  ]}
                />
                <Text
                  style={[styles.fieldHelp, { color: colors.textSecondary }]}
                >
                  Helps with organizing photos by life stages
                </Text>
              </View>

              {/* Location */}
              <View style={styles.formField}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <Feather
                    name="map-pin"
                    size={14}
                    color={colors.textSecondary}
                  />
                  <Text style={[styles.fieldLabel, { color: colors.text }]}>
                    DEFAULT LOCATION (OPTIONAL)
                  </Text>
                </View>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TextInput
                    value={location}
                    onChangeText={setLocation}
                    placeholder="e.g. San Francisco, CA"
                    placeholderTextColor={colors.textSecondary}
                    style={[
                      styles.formInput,
                      {
                        flex: 1,
                        color: colors.text,
                        backgroundColor: colors.backgroundSecondary,
                        borderColor: colors.border,
                      },
                    ]}
                  />
                  <Pressable
                    onPress={handleGetLocation}
                    disabled={isGettingLocation}
                    style={[
                      styles.locationButton,
                      { borderColor: colors.border },
                    ]}
                  >
                    {isGettingLocation ? (
                      <ActivityIndicator size="small" color={colors.text} />
                    ) : (
                      <Feather name="map-pin" size={16} color={colors.text} />
                    )}
                  </Pressable>
                </View>
                <Text
                  style={[styles.fieldHelp, { color: colors.textSecondary }]}
                >
                  Auto-tags photos without location data. Tap pin to use current
                  location.
                </Text>
              </View>

              {/* Info Box */}
              <View
                style={[
                  styles.infoBox,
                  {
                    backgroundColor: colors.backgroundSecondary,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.infoBoxText, { color: colors.text }]}>
                  <Text style={{ color: colors.accent, fontWeight: "600" }}>
                    Why we ask:
                  </Text>
                  {"\n"}
                  {skin === "historian"
                    ? "Your profile information enables better organization and automatic location tagging for your archival collection."
                    : "Profile data enhances AI-powered metadata detection and temporal coordinate assignment for your scanned memories."}
                </Text>
              </View>

              <Text
                style={[styles.profileNote, { color: colors.textSecondary }]}
              >
                You can skip this or change it later in Settings
              </Text>
            </View>
          )}
        </View>

        {/* Navigation */}
        <View style={styles.navigation}>
          <Pressable
            onPress={handleBack}
            disabled={isFirstStep}
            style={[
              styles.navButton,
              {
                borderColor: colors.border,
                opacity: isFirstStep ? 0.5 : 1,
              },
            ]}
          >
            <Feather name="arrow-left" size={16} color={colors.text} />
            <Text style={[styles.navButtonText, { color: colors.text }]}>
              Back
            </Text>
          </Pressable>

          {/* Step Indicators */}
          <View style={styles.stepIndicators}>
            {ONBOARDING_STEPS.map((_, index) => (
              <Pressable
                key={index}
                onPress={() => setCurrentStep(index)}
                style={[
                  styles.stepDot,
                  {
                    backgroundColor:
                      index === currentStep ? colors.accent : colors.border,
                    width: index === currentStep ? 32 : 8,
                  },
                ]}
              />
            ))}
          </View>

          <View style={{ flexDirection: "row", gap: 8 }}>
            {!isLastStep && (
              <Pressable onPress={handleSkip} style={styles.skipButton}>
                <Text
                  style={[
                    styles.skipButtonText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Skip
                </Text>
              </Pressable>
            )}
            <Pressable
              onPress={handleNext}
              style={[styles.nextButton, { backgroundColor: colors.accent }]}
            >
              <Text
                style={[
                  styles.nextButtonText,
                  { color: colors.backgroundDefault },
                ]}
              >
                {isLastStep ? "Get Started" : "Next"}
              </Text>
              {!isLastStep && (
                <Feather
                  name="arrow-right"
                  size={16}
                  color={colors.backgroundDefault}
                />
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    justifyContent: "center",
  },
  progressSection: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    marginBottom: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontFamily: "Cinzel-Regular",
    fontSize: 24,
    fontWeight: "400",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },
  detailsCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  detailsText: {
    fontSize: 13,
    lineHeight: 20,
  },
  themeSelectorContainer: {
    gap: 16,
  },
  selectorLabel: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  themeGrid: {
    gap: 12,
  },
  themeOption: {
    padding: 20,
    borderRadius: 16,
  },
  themeOptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  themeOptionTitle: {
    fontFamily: "Cinzel-Regular",
    fontSize: 18,
    fontWeight: "400",
    marginBottom: 4,
  },
  themeOptionDesc: {
    fontSize: 12,
  },
  themeNote: {
    fontSize: 11,
    textAlign: "center",
    opacity: 0.7,
  },
  profileForm: {
    gap: 20,
  },
  formField: {
    gap: 4,
  },
  fieldLabel: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  formInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
  },
  fieldHelp: {
    fontSize: 10,
    opacity: 0.7,
  },
  locationButton: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoBoxText: {
    fontSize: 12,
    lineHeight: 18,
  },
  profileNote: {
    fontSize: 11,
    textAlign: "center",
    opacity: 0.7,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  navButtonText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  stepIndicators: {
    flexDirection: "row",
    gap: 4,
  },
  stepDot: {
    height: 8,
    borderRadius: 4,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  skipButtonText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  nextButtonText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    fontWeight: "600",
  },
});
