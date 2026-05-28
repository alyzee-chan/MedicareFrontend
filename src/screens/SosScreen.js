import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, shadows } from "../theme";

const PremiumBackground = () => (
  <View style={StyleSheet.absoluteFill}>
    <View style={[StyleSheet.absoluteFill, { backgroundColor: "#F8FBFF" }]} />
    <View style={[styles.blob, { top: -50, right: -50, width: 250, height: 250, backgroundColor: "#E3EEFF", opacity: 0.6 }]} />
    <View style={[styles.blob, { bottom: 100, left: -80, width: 300, height: 300, backgroundColor: "#EAFFF4", opacity: 0.4 }]} />
  </View>
);

export function SosScreen({ onNavigate }) {
  const pharmacies = [
    { id: 1, name: "Pharmacie du Centre", distance: "0.8 km", time: "5 min", rating: 4.8 },
    { id: 2, name: "Pharmacie Saint-Jean", distance: "1.2 km", time: "8 min", rating: 4.5 },
    { id: 3, name: "Pharmacie Laquintinie", distance: "2.1 km", time: "15 min", rating: 4.7 },
  ];

  return (
    <View style={{ flex: 1 }}>
      <PremiumBackground />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>URGENCE & SOS</Text>
        <Text style={styles.title}>Pharmacies à proximité</Text>

        <View style={styles.mapContainer}>
          <Image
            source={require("../../assets/images/PharmacieProches.png")}
            style={styles.mapImg}
          />
          <View style={styles.mapOverlay}>
            <View style={styles.markerPulse}>
              <View style={styles.markerDot} />
            </View>
            <Text style={styles.markerLabel}>Ma position</Text>
          </View>
        </View>

        <View style={styles.sosRow}>
          <Pressable
            style={({ pressed }) => [styles.sosBtn, pressed && { transform: [{ scale: 0.96 }] }]}
            onPress={() => onNavigate("sos")}
          >
            <Ionicons name="medical" size={24} color="#FFF" />
            <Text style={styles.sosText}>LANCER SOS URGENCE</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Points d'aide disponibles</Text>

        {pharmacies.map(p => (
          <View key={p.id} style={styles.pharmCard}>
            <View style={styles.pharmIcon}>
              <Ionicons name="medical-outline" size={24} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pharmName}>{p.name}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 4 }}>
                <View style={styles.metaRow}>
                  <Ionicons name="navigate-circle-outline" size={14} color={colors.muted} />
                  <Text style={styles.metaText}>{p.distance}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Ionicons name="star" size={12} color={colors.warning} />
                  <Text style={styles.metaText}>{p.rating}</Text>
                </View>
              </View>
            </View>
            <Pressable style={styles.navBtn}>
              <Ionicons name="navigate" size={18} color="#FFF" />
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 52, paddingBottom: 20 },
  blob: { position: "absolute", borderRadius: 150 },

  kicker: { color: colors.danger, fontWeight: "800", fontSize: 12, letterSpacing: 1.5, marginBottom: 4 },
  title: { fontSize: 26, fontWeight: "800", color: colors.text, marginBottom: 20 },

  mapContainer: { width: "100%", height: 220, borderRadius: 28, overflow: "hidden", marginBottom: 24, ...shadows.soft, borderWidth: 1, borderColor: "rgba(0,0,0,0.05)" },
  mapImg: { width: "100%", height: "100%", resizeMode: "cover" },
  mapOverlay: { position: "absolute", top: "45%", left: "40%", alignItems: "center" },
  markerPulse: { width: 16, height: 16, borderRadius: 8, backgroundColor: "rgba(52, 120, 246, 0.3)", alignItems: "center", justifyContent: "center" },
  markerDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  markerLabel: { fontSize: 11, fontWeight: "700", color: colors.primary, marginTop: 4, backgroundColor: "#FFF", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },

  sosRow: { marginBottom: 28 },
  sosBtn: {
    flexDirection: "row",
    backgroundColor: colors.danger,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    ...shadows.card,
    shadowColor: colors.danger
  },
  sosText: { color: "#FFF", fontWeight: "900", fontSize: 16, letterSpacing: 0.5 },

  sectionTitle: { fontSize: 18, fontWeight: "800", color: colors.text, marginBottom: 16 },
  pharmCard: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "#FFF", padding: 16, borderRadius: 22, borderWidth: 1, borderColor: "rgba(0,0,0,0.03)", marginBottom: 12, ...shadows.soft },
  pharmIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.accentSoft, alignItems: "center", justifyContent: "center" },
  pharmName: { fontSize: 15, fontWeight: "800", color: colors.text },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, color: colors.muted, fontWeight: "600" },
  navBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
});
