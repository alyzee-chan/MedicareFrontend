import React, { useEffect, useState } from "react";
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
import { api } from "../services/api";
import { colors, shadows } from "../theme";

// Coded Background consistency
const PremiumBackground = () => (
  <View style={StyleSheet.absoluteFill}>
    <View style={[StyleSheet.absoluteFill, { backgroundColor: "#F8FBFF" }]} />
    <View style={[styles.blob, { top: -50, right: -50, width: 250, height: 250, backgroundColor: "#E3EEFF", opacity: 0.6 }]} />
    <View style={[styles.blob, { bottom: 100, left: -80, width: 300, height: 300, backgroundColor: "#EAFFF4", opacity: 0.4 }]} />
    <View style={[styles.blob, { top: "40%", right: -100, width: 200, height: 200, backgroundColor: "#FFF4E8", opacity: 0.3 }]} />
  </View>
);

export function MedicinesScreen({ dashboard, loading, onNavigate, params }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const pharmacies = dashboard?.pharmacies || [];

  useEffect(() => {
    if (dashboard?.medicines) {
      setResults(dashboard.medicines);
    }
  }, [dashboard]);

  useEffect(() => {
    if (params?.query) {
      setSearchQuery(params.query);
      triggerSearch(params.query);
    }
  }, [params]);

  const triggerSearch = (query) => {
    setSearching(true);
    api
      .searchMedicines(query)
      .then((data) => {
        setResults(data || []);
        setSearching(false);
      })
      .catch(() => {
        setSearching(false);
        Alert.alert("Erreur", "Impossible de rechercher les médicaments.");
      });
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      if (dashboard?.medicines) setResults(dashboard.medicines);
      return;
    }
    triggerSearch(searchQuery);
  };

  const handleAskAI = () => {
    if (!searchQuery.trim()) {
      Alert.alert("Info", "Entrez vos symptômes pour obtenir un avis.");
      return;
    }
    setAiLoading(true);
    api
      .askGroq(searchQuery)
      .then((response) => {
        setAiResponse(response);
        setAiLoading(false);
      })
      .catch(() => {
        setAiLoading(false);
        Alert.alert("Erreur", "L'assistant IA n'est pas disponible.");
      });
  };

  const handleOrder = (medicine) => {
    Alert.alert(
      "🛒 Commander",
      `Ajouter ${medicine.name} (${medicine.price}) au panier ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Commander",
          onPress: () => {
            api
              .createOrder({ medicineId: medicine.id, quantity: 1 })
              .then(() =>
                Alert.alert("✅ Commandé", `${medicine.name} ajouté au panier !`)
              )
              .catch(() =>
                Alert.alert("Erreur", "Impossible de passer la commande.")
              );
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <PremiumBackground />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>MÉDICAMENTS</Text>
        <Text style={styles.title}>Recherchez et commandez en quelques secondes.</Text>

        <View style={styles.banner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Gestion simplifiée du stock.</Text>
            <Text style={styles.bannerSub}>Recherche par nom ou symptômes.</Text>
          </View>
          <Image source={require("../../assets/images/HealthCare.png")} style={styles.bannerImg} />
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={colors.muted} />
          <TextInput
            placeholder="Nom ou symptômes..."
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <Pressable onPress={handleSearch} style={styles.searchBtn}>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </Pressable>
        </View>

        <Pressable style={styles.aiBtn} onPress={handleAskAI}>
          {aiLoading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <Ionicons name="sparkles" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.aiBtnText}>Demander à l'assistant IA</Text>
            </>
          )}
        </Pressable>

        {aiResponse && (
          <View style={styles.aiCard}>
            <View style={styles.aiCardHeader}>
              <Ionicons name="sparkles" size={18} color="#8A5CFF" />
              <Text style={styles.aiCardTitle}>Réponse de l'assistant</Text>
            </View>
            <Text style={styles.aiCardText}>{aiResponse}</Text>
            <Pressable onPress={() => setAiResponse(null)} style={styles.aiDismiss}>
              <Text style={styles.aiDismissText}>Fermer</Text>
            </Pressable>
          </View>
        )}

        <Text style={styles.sectionTitle}>{searching ? "Recherche..." : "Résultats en stock"}</Text>

        {searching ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 20 }} />
        ) : results.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="cube-outline" size={32} color={colors.muted} />
            <Text style={styles.emptyText}>Aucun médicament trouvé.</Text>
          </View>
        ) : (
          results.map((med) => (
            <Pressable key={med.id} style={styles.medCard} onPress={() => handleOrder(med)}>
              <View style={styles.medLeft}>
                <View style={styles.medIconWrap}>
                  <Ionicons name="medkit-outline" size={24} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.medName}>{med.name}</Text>
                  <Text style={styles.medForm}>{med.form}</Text>
                </View>
              </View>
              <View style={styles.medRight}>
                <Text style={styles.medPrice}>{med.price}</Text>
                <View style={[styles.stockBadge, { backgroundColor: med.stock === "En stock" ? "#E0F8EC" : "#FFF4E0" }]}>
                  <Text style={[styles.stockText, { color: med.stock === "En stock" ? colors.success : colors.warning }]}>{med.stock}</Text>
                </View>
              </View>
            </Pressable>
          ))
        )}

        <Pressable style={styles.ctaBtn} onPress={() => onNavigate("appointments")}>
          <Ionicons name="document-text-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.ctaBtnText}>Commander depuis une ordonnance</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 52, paddingBottom: 20 },
  blob: { position: "absolute", borderRadius: 150 },

  kicker: { color: colors.primary, fontWeight: "800", fontSize: 12, letterSpacing: 1.5, marginBottom: 6 },
  title: { fontSize: 22, fontWeight: "800", color: colors.text, lineHeight: 30, marginBottom: 16 },

  banner: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", borderRadius: 20, padding: 18, borderWidth: 1, borderColor: "rgba(0,0,0,0.03)", marginBottom: 20, ...shadows.soft },
  bannerTitle: { fontSize: 16, fontWeight: "800", color: colors.text, lineHeight: 22 },
  bannerSub: { fontSize: 12, color: colors.muted, marginTop: 6, lineHeight: 18 },
  bannerImg: { width: 72, height: 72, borderRadius: 18, marginLeft: 12 },

  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 18, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: "rgba(52, 120, 246, 0.15)", marginBottom: 12, ...shadows.card },
  searchInput: { flex: 1, fontSize: 14, color: colors.text, marginLeft: 10 },
  searchBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },

  aiBtn: { flexDirection: "row", backgroundColor: "#8A5CFF", borderRadius: 18, paddingVertical: 14, alignItems: "center", justifyContent: "center", marginBottom: 20, ...shadows.card },
  aiBtnText: { color: "#FFF", fontWeight: "700", fontSize: 15 },
  aiCard: { backgroundColor: "#FFF", borderRadius: 20, padding: 18, borderWidth: 1, borderColor: "#DDD6FE", marginBottom: 20, ...shadows.soft },
  aiCardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  aiCardTitle: { fontSize: 15, fontWeight: "800", color: "#5B21B6", marginLeft: 8 },
  aiCardText: { fontSize: 14, color: colors.text, lineHeight: 22 },
  aiDismiss: { alignSelf: "flex-end", marginTop: 10 },
  aiDismissText: { color: "#7C3AED", fontWeight: "700", fontSize: 13 },

  sectionTitle: { fontSize: 18, fontWeight: "800", color: colors.text, marginTop: 8, marginBottom: 12 },
  emptyCard: { backgroundColor: "#FFF", borderRadius: 20, padding: 32, alignItems: "center", justifyContent: "center", marginBottom: 12, ...shadows.soft },
  emptyText: { color: colors.muted, fontSize: 14, textAlign: "center", marginTop: 12 },

  medCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 20, borderWidth: 1, borderColor: "rgba(0,0,0,0.03)", padding: 16, marginBottom: 10, ...shadows.soft },
  medLeft: { flexDirection: "row", alignItems: "center", flex: 1, gap: 14 },
  medIconWrap: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" },
  medName: { fontSize: 16, fontWeight: "700", color: colors.text },
  medForm: { fontSize: 12, color: colors.muted, marginTop: 2 },
  medRight: { alignItems: "flex-end" },
  medPrice: { fontSize: 15, fontWeight: "800", color: colors.primary, marginBottom: 6 },
  stockBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  stockText: { fontSize: 11, fontWeight: "700" },

  ctaBtn: { flexDirection: "row", backgroundColor: colors.primary, borderRadius: 20, paddingVertical: 18, alignItems: "center", justifyContent: "center", marginTop: 10, ...shadows.card },
  ctaBtnText: { color: "#FFF", fontWeight: "800", fontSize: 16 },
});
