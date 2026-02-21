import React, { useState } from "react";
import { 
  View, 
  StyleSheet, 
  Image, 
  Pressable, 
  TextInput, 
  Alert,
  ScrollView,
  ActivityIndicator 
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { ProfileStackParamList } from "@/navigation/ProfileStackNavigator";
import { useAuth } from "@/contexts/AuthContext";
import { usePhotoStore } from "@/store/photoStore";

interface StatItemProps {
  label: string;
  value: number | string;
}

function StatItem({ label, value }: StatItemProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.statItem}>
      <ThemedText type="h3" style={{ color: theme.accent }}>
        {value}
      </ThemedText>
      <ThemedText type="caption" style={{ color: theme.textSecondary }}>
        {label}
      </ThemedText>
    </View>
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { theme, fonts } = useTheme();
  const { user, updateProfile, logout } = useAuth();
  const { photos } = usePhotoStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  
  const [editedName, setEditedName] = useState(user?.name || "");
  const [editedEmail, setEditedEmail] = useState(user?.email || "");
  const [editedBirthdate, setEditedBirthdate] = useState(user?.birthdate || "");
  const [editedLocation, setEditedLocation] = useState(user?.location || "");
  const [editedAvatar, setEditedAvatar] = useState(user?.avatar);

  const cataloguedCount = photos.filter((p) => p.isShared).length;
  const memberSince = "January 2024"; // TODO: Calculate from user.createdAt

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Please grant photo library access to change your profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setEditedAvatar({ uri: result.assets[0].uri });
    }
  };

  const handleDetectLocation = async () => {
    setIsDetectingLocation(true);
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== "granted") {
        Alert.alert("Permission Required", "Please grant location access to detect your location.");
        setIsDetectingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address) {
        const locationString = [address.city, address.region, address.country]
          .filter(Boolean)
          .join(", ");
        setEditedLocation(locationString);
      }
    } catch (error) {
      console.error("Location detection error:", error);
      Alert.alert("Error", "Failed to detect location. Please try again.");
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      await updateProfile({
        name: editedName,
        email: editedEmail,
        birthdate: editedBirthdate,
        location: editedLocation,
        avatar: editedAvatar,
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Save profile error:", error);
      Alert.alert("Error", "Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedName(user?.name || "");
    setEditedEmail(user?.email || "");
    setEditedBirthdate(user?.birthdate || "");
    setEditedLocation(user?.location || "");
    setEditedAvatar(user?.avatar);
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            await logout();
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundDefault }]}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText 
          style={[styles.headerTitle, { fontFamily: fonts.primary, color: theme.text }]}
        >
          Profile
        </ThemedText>
        {!isEditing && (
          <Pressable
            onPress={() => setIsEditing(true)}
            style={({ pressed }) => [
              styles.headerButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Feather name="edit-2" size={20} color={theme.accent} />
          </Pressable>
        )}
      </View>

      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <Pressable
          onPress={isEditing ? handlePickImage : undefined}
          disabled={!isEditing}
          style={({ pressed }) => [
            styles.avatarContainer,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          {editedAvatar ? (
            <Image source={editedAvatar} style={styles.avatar} />
          ) : (
            <View 
              style={[
                styles.avatarPlaceholder, 
                { backgroundColor: theme.backgroundSecondary }
              ]}
            >
              <Feather name="user" size={48} color={theme.textSecondary} />
            </View>
          )}
          {isEditing && (
            <View style={[styles.avatarEditBadge, { backgroundColor: theme.accent }]}>
              <Feather name="camera" size={16} color="#FFFFFF" />
            </View>
          )}
        </Pressable>
      </View>

      {/* Profile Fields */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <View style={styles.field}>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            NAME
          </ThemedText>
          {isEditing ? (
            <TextInput
              value={editedName}
              onChangeText={setEditedName}
              style={[
                styles.input,
                { 
                  color: theme.text, 
                  borderColor: theme.border,
                  fontFamily: fonts.mono,
                },
              ]}
              placeholderTextColor={theme.textSecondary}
            />
          ) : (
            <ThemedText 
              style={[styles.fieldValue, { fontFamily: fonts.mono }]}
            >
              {user?.name}
            </ThemedText>
          )}
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.field}>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            EMAIL
          </ThemedText>
          {isEditing ? (
            <TextInput
              value={editedEmail}
              onChangeText={setEditedEmail}
              style={[
                styles.input,
                { 
                  color: theme.text, 
                  borderColor: theme.border,
                  fontFamily: fonts.mono,
                },
              ]}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={theme.textSecondary}
            />
          ) : (
            <ThemedText 
              style={[styles.fieldValue, { fontFamily: fonts.mono }]}
            >
              {user?.email}
            </ThemedText>
          )}
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.field}>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            BIRTHDATE
          </ThemedText>
          {isEditing ? (
            <TextInput
              value={editedBirthdate}
              onChangeText={setEditedBirthdate}
              style={[
                styles.input,
                { 
                  color: theme.text, 
                  borderColor: theme.border,
                  fontFamily: fonts.mono,
                },
              ]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.textSecondary}
            />
          ) : (
            <ThemedText 
              style={[styles.fieldValue, { fontFamily: fonts.mono }]}
            >
              {user?.birthdate || "Not set"}
            </ThemedText>
          )}
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.field}>
          <View style={styles.fieldHeader}>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              LOCATION
            </ThemedText>
            {isEditing && (
              <Pressable
                onPress={handleDetectLocation}
                disabled={isDetectingLocation}
                style={({ pressed }) => [
                  styles.detectButton,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                {isDetectingLocation ? (
                  <ActivityIndicator size="small" color={theme.accent} />
                ) : (
                  <Feather name="map-pin" size={16} color={theme.accent} />
                )}
              </Pressable>
            )}
          </View>
          {isEditing ? (
            <TextInput
              value={editedLocation}
              onChangeText={setEditedLocation}
              style={[
                styles.input,
                { 
                  color: theme.text, 
                  borderColor: theme.border,
                  fontFamily: fonts.mono,
                },
              ]}
              placeholder="City, Country"
              placeholderTextColor={theme.textSecondary}
            />
          ) : (
            <ThemedText 
              style={[styles.fieldValue, { fontFamily: fonts.mono }]}
            >
              {user?.location || "Not set"}
            </ThemedText>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      {isEditing && (
        <View style={styles.actionButtons}>
          <Pressable
            onPress={handleCancel}
            disabled={isSaving}
            style={({ pressed }) => [
              styles.cancelButton,
              { 
                borderColor: theme.border,
                opacity: pressed || isSaving ? 0.7 : 1,
              },
            ]}
          >
            <ThemedText style={{ color: theme.text }}>Cancel</ThemedText>
          </Pressable>
          
          <Pressable
            onPress={handleSave}
            disabled={isSaving}
            style={({ pressed }) => [
              styles.saveButton,
              { 
                backgroundColor: theme.accent,
                opacity: pressed || isSaving ? 0.7 : 1,
              },
            ]}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <ThemedText style={{ color: "#FFFFFF" }}>Save</ThemedText>
            )}
          </Pressable>
        </View>
      )}

      {/* Stats */}
      <View style={[styles.statsSection, { backgroundColor: theme.card }]}>
        <ThemedText 
          type="small" 
          style={[styles.sectionTitle, { color: theme.textSecondary }]}
        >
          STATISTICS
        </ThemedText>
        <View style={styles.statsRow}>
          <StatItem label="Photos" value={photos.length} />
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <StatItem label="Catalogued" value={cataloguedCount} />
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <StatItem label="Member Since" value={memberSince} />
        </View>
      </View>

      {/* Account Actions */}
      {!isEditing && (
        <View style={[styles.actionsSection, { backgroundColor: theme.card }]}>
          <Pressable
            onPress={() => navigation.navigate("Settings")}
            style={({ pressed }) => [
              styles.actionItem,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <View style={styles.actionLeft}>
              <Feather name="settings" size={20} color={theme.text} />
              <ThemedText style={[styles.actionText, { fontFamily: fonts.mono }]}>
                Settings
              </ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.actionItem,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <View style={styles.actionLeft}>
              <Feather name="log-out" size={20} color={theme.error} />
              <ThemedText 
                style={[styles.actionText, { fontFamily: fonts.mono, color: theme.error }]}
              >
                Logout
              </ThemedText>
            </View>
          </Pressable>
        </View>
      )}

      <View style={{ height: Spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "600",
  },
  headerButton: {
    padding: Spacing.sm,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarEditBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  field: {
    paddingVertical: Spacing.md,
  },
  fieldHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  fieldValue: {
    fontSize: 16,
    marginTop: Spacing.xs,
  },
  input: {
    marginTop: Spacing.xs,
    padding: Spacing.md,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    fontSize: 16,
  },
  detectButton: {
    padding: Spacing.xs,
  },
  divider: {
    height: 1,
  },
  actionButtons: {
    flexDirection: "row",
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: "center",
  },
  saveButton: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  statsSection: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  actionsSection: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  actionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  actionText: {
    fontSize: 16,
  },
});

