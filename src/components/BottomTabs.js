import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";

const ICON_MAP = {
  home: { active: "home", inactive: "home-outline" },
  appointments: { active: "document-text", inactive: "document-text-outline" },
  medicines: { active: "notifications", inactive: "notifications-outline" },
  profile: { active: "person", inactive: "person-outline" },
};

export function BottomTabs({ tabs, activeTab, onChange }) {
  return (
    <View style={styles.wrap}>
      {tabs.map((tab) => {
        const active = activeTab === tab.key;
        const icons = ICON_MAP[tab.key] || { active: "ellipse", inactive: "ellipse-outline" };
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={({ pressed }) => [styles.tab, pressed && styles.tabPressed]}
          >
            <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
              <Ionicons
                name={active ? icons.active : icons.inactive}
                size={22}
                color={active ? colors.primary : colors.muted}
              />
            </View>
            <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 6,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0.5,
    borderTopColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 8,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
    minWidth: 64,
  },
  tabPressed: {
    opacity: 0.7,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  iconWrapActive: {
    backgroundColor: colors.primarySoft,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.muted,
    letterSpacing: 0.2,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: "700",
  },
});
