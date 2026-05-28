import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, shadows } from "../theme";

// Coded Background "Image de fond 2" style - REFINED for maximum clarity
const PremiumBackground = () => (
  <View style={StyleSheet.absoluteFill}>
    {/* Clean White Base */}
    <View style={[StyleSheet.absoluteFill, { backgroundColor: "#FFFFFF" }]} />

    {/* Soft Blurred Coded Elements - mimicking fond 2 subtly */}
    <View style={[styles.blob, { top: -40, right: -40, width: 280, height: 280, backgroundColor: "#F0F7FF", opacity: 0.8 }]} />
    <View style={[styles.blob, { bottom: 80, left: -60, width: 320, height: 320, backgroundColor: "#F0FFF7", opacity: 0.6 }]} />
    <View style={[styles.blob, { top: "35%", right: -80, width: 220, height: 220, backgroundColor: "#FFF9F1", opacity: 0.5 }]} />
  </View>
);

const quickActions = [
  { id: "sos", title: "SOS urgence", subtitle: "Aide immédiate", icon: "alert-circle", iconColor: "#21D07A", bg: "#EAFFF4", border: "#C4F0DA" },
  { id: "search", title: "Recherche\nrapide", subtitle: "Nom, symptômes", icon: "search", iconColor: "#3478F6", bg: "#EEF4FF", border: "#D6E4FF" },
  { id: "assistant", title: "Assistance\nmédicale", subtitle: "Chatbot et tri", icon: "chatbubbles", iconColor: "#3478F6", bg: "#EEF4FF", border: "#D6E4FF" },
  { id: "family", title: "Loisirs\ncuratifs", subtitle: "Bien-être et santé", icon: "leaf", iconColor: "#3478F6", bg: "#EEF4FF", border: "#D6E4FF" },
];

export function HomeScreen({ onNavigate, dashboard, loading }) {
  const [search, setSearch] = useState("");

  const handleSearchSubmit = () => {
    if (search.trim()) {
      onNavigate("medicines", { query: search });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <PremiumBackground />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <Image source={require("../../assets/images/logo.jpg")} style={styles.logo} />
          </View>
          <View>
            <Text style={styles.greetingTitle}>Bonjour !</Text>
            <Text style={styles.greetingSub}>Bienvenue sur Medicare +</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={colors.muted} />
          <TextInput
            placeholder="Comment puis-je vous aider ?"
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          <Pressable onPress={() => Alert.alert("Recherche vocale", "La recherche vocale n'est pas encore active.")} style={{ padding: 4 }}>
            <Ionicons name="mic-outline" size={20} color={colors.primary} />
          </Pressable>
          <Pressable onPress={() => Alert.alert("Recherche visuelle", "La recherche par image n'est pas encore active.")} style={{ padding: 4, marginLeft: 4 }}>
            <Ionicons name="camera-outline" size={20} color={colors.primary} />
          </Pressable>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickGrid}>
          {quickActions.map((a) => (
            <Pressable
              key={a.id}
              style={({ pressed }) => [styles.quickCard, { backgroundColor: a.bg, borderColor: a.border }, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
              onPress={() => {
                if (a.id === "sos") onNavigate("sos");
                else if (a.id === "search") onNavigate("medicines");
                else if (a.id === "assistant") onNavigate("appointments");
                else onNavigate("profile");
              }}
            >
              <View style={[styles.quickIconWrap, { backgroundColor: `${a.iconColor}18` }]}>
                <Ionicons name={a.icon} size={26} color={a.iconColor} />
              </View>
              <Text style={[styles.quickTitle, { color: a.iconColor }]}>{a.title}</Text>
              <Text style={styles.quickSub}>{a.subtitle}</Text>
            </Pressable>
          ))}
        </View>

        {/* Loading / Content */}
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 32 }} />
        ) : (
          <>
            {/* Stats */}
            <View style={styles.statsGrid}>
              {(dashboard?.metrics || [
                { label: "RDV actifs", value: "08" },
                { label: "Ordonnances", value: "14" },
                { label: "Pharmacies", value: "32" },
                { label: "SOS traités", value: "03" },
              ]).map((s) => (
                <View key={s.label} style={styles.statCard}>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>

            {/* Appointments Card */}
            {dashboard?.appointments?.length > 0 && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionRow}>
                  <Text style={styles.sectionTitle}>Rendez-vous à venir</Text>
                  <Pressable onPress={() => onNavigate("appointments")}>
                    <Text style={styles.sectionLink}>Voir tout</Text>
                  </Pressable>
                </View>
                {dashboard.appointments.slice(0, 1).map((item) => (
                  <View key={item.id} style={styles.appointCard}>
                    <View style={styles.appointAvatar}>
                      <Ionicons name="person" size={20} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.appointName}>{item.doctorName || item.name}</Text>
                      <Text style={styles.appointMeta}>{item.clinic || item.specialty}</Text>
                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                        <Ionicons name="time-outline" size={12} color={colors.muted} />
                        <Text style={styles.appointTime}>{item.date} · {item.time}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 20 },
  blob: { position: "absolute", borderRadius: 160 },

  header: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 24 },
  logoWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.soft,
  },
  logo: { width: 36, height: 36, borderRadius: 10 },
  greetingTitle: { fontSize: 24, fontWeight: "800", color: colors.text },
  greetingSub: { fontSize: 15, color: colors.muted, marginTop: 2 },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: "rgba(52, 120, 246, 0.08)",
    marginBottom: 24,
    ...shadows.card
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.text, marginLeft: 10 },

  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 28 },
  quickCard: {
    width: "47%",
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    minHeight: 150,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(0,0,0,0.03)",
    ...shadows.soft,
  },
  quickIconWrap: { width: 52, height: 52, borderRadius: 18, alignItems: "center", justifyContent: "center", marginBottom: 14 },
  quickTitle: { fontSize: 16, fontWeight: "800", textAlign: "center", lineHeight: 22 },
  quickSub: { fontSize: 11, color: colors.muted, textAlign: "center", marginTop: 4, lineHeight: 18 },

  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 16 },
  statCard: {
    width: "47%",
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
    padding: 20,
    ...shadows.soft
  },
  statValue: { fontSize: 26, fontWeight: "900", color: colors.text },
  statLabel: { fontSize: 12, color: colors.muted, marginTop: 4, fontWeight: "600" },

  sectionContainer: { marginTop: 12 },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: colors.text },
  sectionLink: { fontSize: 14, fontWeight: "700", color: colors.primary },

  appointCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
    marginBottom: 10,
    ...shadows.soft
  },
  appointAvatar: { width: 50, height: 50, borderRadius: 16, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" },
  appointName: { fontSize: 16, fontWeight: "800", color: colors.text },
  appointMeta: { fontSize: 13, color: colors.muted, marginTop: 2 },
  appointTime: { fontSize: 12, color: colors.muted, marginLeft: 6 },
});
