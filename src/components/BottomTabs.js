import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, metrics } from "../theme";

export function BottomTabs({ tabs, activeTab, onChange }) {
  return (
    <View style={styles.wrap}>
      {tabs.map((tab) => {
        const active = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={[styles.tab, active && styles.tabActive, tab.key === "sos" && styles.emergencyTab]}
          >
            <View style={[styles.symbolBubble, active && styles.symbolBubbleActive, tab.key === "sos" && styles.emergencyBubble]}>
              <Text style={[styles.symbol, active && styles.symbolActive]}>{tab.symbol}</Text>
            </View>
            <Text style={[styles.label, active && styles.labelActive]} numberOfLines={1}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 64,
    marginHorizontal: 3,
    borderRadius: 18,
  },
  tabActive: {
    backgroundColor: colors.primarySoft,
  },
  emergencyTab: {
    backgroundColor: "#FFE6E8",
  },
  symbolBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F5FB",
    marginBottom: 4,
  },
  symbolBubbleActive: {
    backgroundColor: colors.primary,
  },
  emergencyBubble: {
    backgroundColor: colors.danger,
  },
  symbol: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: "700",
  },
  symbolActive: {
    color: "#FFFFFF",
  },
  label: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: "600",
  },
  labelActive: {
    color: colors.primary,
  },
});
