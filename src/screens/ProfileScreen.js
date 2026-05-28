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

export function ProfileScreen() {
  const profileItems = [
    { id: "health", title: "Dossier Médical", icon: "clipboard-outline", color: colors.primary },
    { id: "insurance", title: "Assurance Santé", icon: "shield-checkmark-outline", color: colors.accent },
    { id: "biometrics", title: "Biométrie & Sommeil", icon: "pulse", color: colors.danger },
    { id: "payment", title: "Paiements & Factures", icon: "card-outline", color: colors.warning },
    { id: "settings", title: "Paramètres", icon: "settings-outline", color: colors.muted },
  ];

  return (
    <View style={{ flex: 1 }}>
      <PremiumBackground />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>MON PROFIL</Text>

        {/* Profile Card */}
        <View style={styles.card}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarWrap}>
              <Image
                source={{ uri: "https://ui-avatars.com/api/?name=Alyzee+User&background=3478F6&color=fff&size=128" }}
                style={styles.avatarImg}
              />
              <View style={styles.editBadge}>
                <Ionicons name="camera" size={12} color="#FFF" />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>Alyzee User</Text>
              <Text style={styles.userMeta}>Groupe O+ · 24 ans</Text>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Membre Premium</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Family Section */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Ma Famille</Text>
          <Text style={styles.sectionLink}>Ajouter</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 10 }}>
          {["Maman", "Papa", "Soeur"].map((role, i) => (
            <View key={i} style={styles.familyCard}>
              <View style={styles.familyAvatar}>
                <Ionicons name="person" size={18} color={colors.primary} />
              </View>
              <Text style={styles.familyName}>{role}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Menu Items */}
        <View style={styles.menuBox}>
          {profileItems.map((item, i) => (
            <Pressable key={item.id} style={[styles.menuItem, i === profileItems.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </Pressable>
          ))}
        </View>

        {/* Premium Banner */}
        <View style={styles.premiumCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.premiumTitle}>Passez à l'offre Family</Text>
            <Text style={styles.premiumSub}>Accès illimité pour 5 profils</Text>
          </View>
          <Pressable style={styles.premiumBtn}>
            <Text style={styles.premiumBtnText}>Découvrir</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 52, paddingBottom: 20 },
  blob: { position: "absolute", borderRadius: 150 },

  kicker: { color: colors.primary, fontWeight: "800", fontSize: 12, letterSpacing: 1.5, marginBottom: 12 },

  card: { backgroundColor: "#FFF", borderRadius: 28, padding: 20, borderWidth: 1, borderColor: "rgba(0,0,0,0.03)", marginBottom: 24, ...shadows.soft },
  avatarRow: { flexDirection: "row", alignItems: "center", gap: 18 },
  avatarWrap: { position: "relative" },
  avatarImg: { width: 72, height: 72, borderRadius: 24 },
  editBadge: { position: "absolute", bottom: -4, right: -4, width: 24, height: 24, borderRadius: 12, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#FFF" },
  userName: { fontSize: 20, fontWeight: "800", color: colors.text },
  userMeta: { fontSize: 13, color: colors.muted, marginTop: 2 },
  tag: { backgroundColor: "#1A2138", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start", marginTop: 8 },
  tagText: { color: "#FFF", fontSize: 10, fontWeight: "800", textTransform: "uppercase" },

  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: colors.text },
  sectionLink: { fontSize: 13, fontWeight: "700", color: colors.primary },

  familyCard: { width: 90, backgroundColor: "#FFF", borderRadius: 20, padding: 14, alignItems: "center", ...shadows.soft, borderWidth: 1, borderColor: "rgba(0,0,0,0.03)" },
  familyAvatar: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  familyName: { fontSize: 12, fontWeight: "700", color: colors.text },

  menuBox: { backgroundColor: "#FFF", borderRadius: 24, paddingVertical: 8, marginTop: 12, borderWidth: 1, borderColor: "rgba(0,0,0,0.03)", ...shadows.soft },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  menuIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  menuText: { flex: 1, fontSize: 15, fontWeight: "700", color: colors.text },

  premiumCard: { flexDirection: "row", alignItems: "center", backgroundColor: colors.primary, borderRadius: 24, padding: 22, marginTop: 24, gap: 14, ...shadows.card },
  premiumTitle: { color: "#FFF", fontSize: 16, fontWeight: "800" },
  premiumSub: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2 },
  premiumBtn: { backgroundColor: "#FFF", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  premiumBtnText: { color: colors.primary, fontWeight: "800", fontSize: 13 },
});
