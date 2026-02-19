import React, { useState } from "react";
import { 
  View, 
  StyleSheet, 
  Pressable,
  Switch,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface SettingRowProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value?: string;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
  isDestructive?: boolean;
}

function SettingRow({
  icon,
  label,
  value,
  isSwitch,
  switchValue,
  onSwitchChange,
  onPress,
  isDestructive,
}: SettingRowProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={isSwitch}
      style={({ pressed }) => [
        styles.settingRow,
        { 
          backgroundColor: theme.backgroundDefault,
          opacity: onPress && pressed ? 0.8 : 1,
        },
      ]}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: theme.sepiaLight }]}>
          <Feather
            name={icon}
            size={18}
            color={isDestructive ? theme.error : theme.sepia}
          />
        </View>
        <ThemedText
          type="body"
          style={[styles.settingLabel, isDestructive && { color: theme.error }]}
        >
          {label}
        </ThemedText>
      </View>
      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: theme.backgroundTertiary, true: theme.sepia }}
          thumbColor="#FFFFFF"
        />
      ) : value ? (
        <View style={styles.settingRight}>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {value}
          </ThemedText>
          <Feather name="chevron-right" size={18} color={theme.textSecondary} />
        </View>
      ) : onPress ? (
        <Feather name="chevron-right" size={18} color={theme.textSecondary} />
      ) : null}
    </Pressable>
  );
}

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <View style={styles.section}>
      <ThemedText type="caption" style={[styles.sectionTitle, { color: theme.textSecondary }]}>
        {title}
      </ThemedText>
      <View style={[styles.sectionContent, { backgroundColor: theme.backgroundDefault }]}>
        {children}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  
  const [notifications, setNotifications] = useState(true);
  const [communityUpdates, setCommunityUpdates] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", style: "destructive", onPress: () => {
          Alert.alert("Logged Out", "You have been logged out.");
        }},
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all your photos. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete Account", 
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Confirm Deletion",
              "Are you absolutely sure? All your memories will be lost forever.",
              [
                { text: "Cancel", style: "cancel" },
                { 
                  text: "Yes, Delete Everything", 
                  style: "destructive",
                  onPress: () => {
                    Alert.alert("Account Deleted", "Your account has been deleted.");
                  }
                },
              ]
            );
          }
        },
      ]
    );
  };

  return (
    <ScreenScrollView>
      <SettingSection title="Notifications">
        <SettingRow
          icon="bell"
          label="Push Notifications"
          isSwitch
          switchValue={notifications}
          onSwitchChange={setNotifications}
        />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <SettingRow
          icon="users"
          label="Community Updates"
          isSwitch
          switchValue={communityUpdates}
          onSwitchChange={setCommunityUpdates}
        />
      </SettingSection>

      <SettingSection title="Appearance">
        <SettingRow
          icon="moon"
          label="Theme"
          value="System"
          onPress={() => Alert.alert("Theme", "Theme follows your system settings.")}
        />
      </SettingSection>

      <SettingSection title="Privacy">
        <SettingRow
          icon="eye-off"
          label="Private Profile"
          isSwitch
          switchValue={false}
          onSwitchChange={() => Alert.alert("Privacy", "Profile visibility updated.")}
        />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <SettingRow
          icon="shield"
          label="Data & Privacy"
          onPress={() => Alert.alert("Privacy Policy", "View our privacy policy at chronolens.app/privacy")}
        />
      </SettingSection>

      <SettingSection title="Account">
        <SettingRow
          icon="log-out"
          label="Log Out"
          onPress={handleLogout}
        />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <SettingRow
          icon="trash-2"
          label="Delete Account"
          onPress={handleDeleteAccount}
          isDestructive
        />
      </SettingSection>

      <SettingSection title="About">
        <SettingRow
          icon="info"
          label="Version"
          value="1.0.0"
        />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <SettingRow
          icon="heart"
          label="Rate ChronoLens"
          onPress={() => Alert.alert("Rate", "Thank you for using ChronoLens!")}
        />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <SettingRow
          icon="help-circle"
          label="Help & Support"
          onPress={() => Alert.alert("Support", "Contact us at support@chronolens.app")}
        />
      </SettingSection>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
    textTransform: "uppercase",
  },
  sectionContent: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  settingLabel: {
    flex: 1,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  divider: {
    height: 1,
    marginLeft: 56,
  },
});
