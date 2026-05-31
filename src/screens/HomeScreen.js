import React, { useEffect, useState, useRef } from "react";
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
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { colors, shadows } from "../theme";
import { api } from "../services/api";
import { useAppContext } from "../context/AppContext";
import { LinearGradient } from "expo-linear-gradient";

const PremiumBackground = () => {
  const { isDarkMode } = useAppContext();
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={isDarkMode ? ["#00050D", "#000000"] : ["#FFFFFF", "#F0F5FF"]}
        style={StyleSheet.absoluteFill}
      />
      {isDarkMode && (
        <View style={[styles.blob, { top: -150, right: -100, width: 400, height: 400, backgroundColor: "#00A8E1", opacity: 0.05 }]} />
      )}
    </View>
  );
};

export default function HomeScreen({ navigation }) {
  const { t, isDarkMode } = useAppContext();
  const [search, setSearch] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadDashboard();
    Animated.parallel([
      Animated.spring(logoScale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.timing(logoOpacity, { toValue: 1, duration: 800, useNativeDriver: true })
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoFloat, { toValue: -8, duration: 2500, useNativeDriver: true }),
          Animated.timing(logoFloat, { toValue: 0, duration: 2500, useNativeDriver: true })
        ])
      ).start();
    });
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await api.getDashboard();
      setDashboard(data);
    } catch (err) {
      console.log("Error loading dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (queryStr = search) => {
    if (queryStr.trim()) {
      navigation.navigate("Medicines", { query: queryStr });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? "#00050D" : "#FFFFFF" }}>
      <PremiumBackground />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Animated.View style={[styles.logoWrap, { transform: [{ scale: logoScale }, { translateY: logoFloat }], opacity: logoOpacity, backgroundColor: isDarkMode ? "#1A1D23" : "#FFF" }]}>
            <Image source={require("../../assets/images/logo.jpg")} style={styles.logo} />
          </Animated.View>
          <View style={styles.greetingBox}>
            <Text style={[styles.greetingTitle, { color: isDarkMode ? "#FFF" : "#002366" }]}>Bonjour !</Text>
            <Text style={[styles.greetingSub, { color: isDarkMode ? "#AAA" : "#666" }]}>Bienvenue sur Medicare +</Text>
          </View>
        </View>

        {/* Search Bar - Style Prime Video */}
        <View style={[styles.searchContainer, { backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "#FFF", borderColor: isDarkMode ? "#333" : "#E0E0E0" }]}>
          <Ionicons name="search" size={20} color={isDarkMode ? "#00A8E1" : "#007AFF"} />
          <TextInput
            placeholder="Comment puis-je vous aider ?"
            placeholderTextColor={isDarkMode ? "#666" : "#999"}
            style={[styles.searchInput, { color: isDarkMode ? "#FFF" : "#000" }]}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={() => handleSearchSubmit()}
          />
          <View style={styles.searchGlowIcons}>
            <Pressable style={styles.glowIcon}>
              <Ionicons name="mic" size={20} color={isDarkMode ? "#00A8E1" : "#007AFF"} style={isDarkMode && styles.iconGlowCyan} />
            </Pressable>
            <Pressable style={styles.glowIcon}>
              <Ionicons name="camera" size={20} color={isDarkMode ? "#00A8E1" : "#007AFF"} style={isDarkMode && styles.iconGlowCyan} />
            </Pressable>
          </View>
        </View>

        {/* Action Grid */}
        <View style={styles.quickGrid}>
          {[
            { title: "SOS urgence", sub: "Aide immédiate", icon: "alert-circle", color: "#21D07A", bg: isDarkMode ? "rgba(33, 208, 122, 0.1)" : "#EFFFF6", route: "SosFlow" },
            { title: "Recherche rapide", sub: "Nom, symptômes", icon: "search", color: "#007AFF", bg: isDarkMode ? "rgba(0, 122, 255, 0.1)" : "#F0F7FF", route: "Medicines" },
            { title: "Pharmacies", sub: "Autour de moi", icon: "location", color: "#007AFF", bg: isDarkMode ? "rgba(0, 122, 255, 0.1)" : "#F0F7FF", route: "NearbyPharmacies" },
            { title: "Loisirs curatifs", sub: "Bien-être et santé", icon: "leaf", color: "#007AFF", bg: isDarkMode ? "rgba(0, 122, 255, 0.1)" : "#F0F7FF", route: "LoisirsCuratifs" },
          ].map((a, i) => (
            <Pressable
              key={i}
              style={[styles.quickCard, { backgroundColor: a.bg, borderColor: isDarkMode ? `${a.color}30` : `${a.color}20`, borderWidth: 1 }]}
              onPress={() => navigation.navigate(a.route)}
            >
              <View style={[styles.actionIconCircle, { backgroundColor: isDarkMode ? "#000" : "#FFF" }]}>
                <Ionicons name={a.icon} size={28} color={a.color} />
              </View>
              <Text style={[styles.quickCardTitle, { color: a.color }]}>{a.title}</Text>
              <Text style={styles.quickCardSub}>{a.sub}</Text>
            </Pressable>
          ))}
        </View>

        {/* Stats Preview */}
        <View style={styles.statsPreview}>
          <View style={[styles.statItem, { backgroundColor: isDarkMode ? "#1A1D23" : "#FFF" }]}>
            <Text style={[styles.statVal, { color: isDarkMode ? "#FFF" : "#002366" }]}>08</Text>
            <Text style={styles.statLabel}>RDV actifs</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: isDarkMode ? "#1A1D23" : "#FFF" }]}>
            <Text style={[styles.statVal, { color: isDarkMode ? "#FFF" : "#002366" }]}>14</Text>
            <Text style={styles.statLabel}>Ordonnances</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  blob: { position: "absolute", borderRadius: 200 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 25, paddingTop: 60, gap: 15 },
  logoWrap: { width: 56, height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center", ...shadows.card },
  logo: { width: 38, height: 38, borderRadius: 10 },
  greetingBox: { flex: 1 },
  greetingTitle: { fontSize: 26, fontWeight: "900", letterSpacing: -0.5 },
  greetingSub: { fontSize: 15, fontWeight: "600", marginTop: 2 },

  searchContainer: { marginHorizontal: 25, marginTop: 30, borderRadius: 20, padding: 12, flexDirection: "row", alignItems: "center", borderWidth: 1, ...shadows.soft },
  searchInput: { flex: 1, fontSize: 16, fontWeight: "700", marginLeft: 12 },
  searchGlowIcons: { flexDirection: "row", gap: 10 },
  glowIcon: { padding: 5 },
  iconGlowCyan: { textShadowColor: "rgba(0, 168, 225, 0.6)", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },

  quickGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 20, marginTop: 30, gap: 12 },
  quickCard: { width: "47.4%", borderRadius: 28, padding: 22, ...shadows.soft, alignItems: "center", justifyContent: "center" },
  actionIconCircle: { width: 56, height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center", marginBottom: 15 },
  quickCardTitle: { fontSize: 16, fontWeight: "900", textAlign: "center", lineHeight: 22 },
  quickCardSub: { fontSize: 12, color: "#888", textAlign: "center", marginTop: 5, fontWeight: "600" },

  statsPreview: { flexDirection: "row", paddingHorizontal: 25, marginTop: 30, gap: 15 },
  statItem: { flex: 1, padding: 25, borderRadius: 24, alignItems: "center", ...shadows.soft },
  statVal: { fontSize: 28, fontWeight: "900" },
  statLabel: { fontSize: 12, color: "#888", marginTop: 5, fontWeight: "700" },
});
