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
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { api } from "../services/api";
import { PaymentModal } from "../components/PaymentModal";
import { colors, shadows } from "../theme";

const PremiumHeader = () => (
  <View style={styles.header}>
    <View>
      <Text style={styles.kicker}>BASE DE DONNÉES</Text>
      <Text style={styles.headerTitle}>Médicaments</Text>
    </View>
    <Pressable style={styles.cartBtn}>
      <Ionicons name="cart-outline" size={24} color={colors.primary} />
    </Pressable>
  </View>
);

export default function MedicinesScreen({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const query = route.params?.query || "";
    setSearchQuery(query);
    triggerSearch(query);
  }, [route.params]);

  const triggerSearch = async (query) => {
    setSearching(true);
    try {
      const data = await api.searchMedicines(query);
      setResults(data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setSearching(false);
    }
  };

  const handleOrder = (medicine) => {
    setSelectedMed(medicine);
    setShowPayment(true);
  };

  const onPaymentSuccess = async (method) => {
    try {
      await api.createOrder({
        customerName: "Utilisateur",
        medicineName: selectedMed.name,
        quantity: 1,
        paymentMethod: method,
        pharmacyName: "Pharmacie de la Paix",
        fulfillmentMode: "Livraison"
      });
      Alert.alert("Succès", `${selectedMed.name} est en cours de préparation.`);
    } catch (e) {
      Alert.alert("Erreur", "Une erreur est survenue.");
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={["#FFF", "#F5F9FF"]} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <PremiumHeader />

        <View style={styles.searchStack}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={colors.muted} />
            <TextInput
              placeholder="Rechercher (ex: Aspirine, Rhume...)"
              placeholderTextColor={colors.muted}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => triggerSearch(searchQuery)}
            />
          </View>

          <Pressable style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color="#FFF" />
          </Pressable>
        </View>

        <Pressable style={styles.aiLuxuryBtn} onPress={() => navigation.navigate("Assistant")}>
          <LinearGradient colors={["#8A5CFF", "#6C38E0"]} style={styles.aiGradient}>
            <Ionicons name="sparkles" size={20} color="#FFF" />
            <Text style={styles.aiBtnText}>Assistant IA Médical</Text>
            <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.7)" />
          </LinearGradient>
        </Pressable>

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>
            {searching ? "Chargement..." : results.length > 0 ? "Résultats disponibles" : "En vedette"}
          </Text>
        </View>

        {searching ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : results.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={colors.line} />
            <Text style={styles.emptyText}>Aucun résultat pour "{searchQuery}"</Text>
          </View>
        ) : (
          results.map((med) => (
            <Pressable key={med.id} style={styles.medCard} onPress={() => handleOrder(med)}>
              <View style={styles.medIconBox}>
                <Image source={require("../../assets/images/HealthCare.png")} style={styles.medImg} />
              </View>

              <View style={styles.medContent}>
                <Text style={styles.medName}>{med.name}</Text>
                <Text style={styles.medForm}>{med.form} • {med.note}</Text>

                <View style={styles.medFooter}>
                  <Text style={styles.medPrice}>{med.price}</Text>
                  <View style={[styles.stockBadge, { backgroundColor: med.stock.includes("En stock") ? "#EEF9F1" : "#FFF8F0" }]}>
                    <Text style={[styles.stockText, { color: med.stock.includes("En stock") ? colors.success : colors.warning }]}>
                      {med.stock}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.orderBtn}>
                <Ionicons name="add" size={24} color="#FFF" />
              </View>
            </Pressable>
          ))
        )}

        <View style={styles.prescriptionBox}>
          <Text style={styles.prescriptionTitle}>Avez-vous une ordonnance ?</Text>
          <Text style={styles.prescriptionSub}>Téléchargez une photo pour une analyse automatique.</Text>

          <Pressable style={styles.uploadBtn} onPress={async () => {
            const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.8 });
            if (!result.canceled) {
              Alert.alert("Analyse...", "Analyse de votre ordonnance par l'IA en cours.");
            }
          }}>
            <Ionicons name="camera" size={24} color={colors.primary} />
            <Text style={styles.uploadBtnText}>Scanner l'ordonnance</Text>
          </Pressable>
        </View>
      </ScrollView>

      {selectedMed && (
        <PaymentModal
          visible={showPayment}
          onClose={() => setShowPayment(false)}
          amount={selectedMed.price}
          metadata={`Commande: ${selectedMed.name}`}
          onSuccess={onPaymentSuccess}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFF" },
  container: { paddingBottom: 40 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 52, marginBottom: 20 },
  kicker: { fontSize: 11, fontWeight: "900", color: colors.primary, letterSpacing: 2, marginBottom: 4 },
  headerTitle: { fontSize: 28, fontWeight: "900", color: colors.primaryDark },
  cartBtn: { width: 50, height: 50, borderRadius: 18, backgroundColor: "#FFF", ...shadows.soft, alignItems: "center", justifyContent: "center" },

  searchStack: { flexDirection: "row", gap: 12, paddingHorizontal: 20, marginBottom: 20 },
  searchBar: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", borderRadius: 20, paddingHorizontal: 16, height: 60, ...shadows.soft, gap: 12 },
  searchInput: { flex: 1, fontSize: 15, fontWeight: "600", color: colors.text },
  filterBtn: { width: 60, height: 60, borderRadius: 20, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", ...shadows.card },

  aiLuxuryBtn: { marginHorizontal: 20, borderRadius: 22, overflow: "hidden", ...shadows.card, marginBottom: 30 },
  aiGradient: { flexDirection: "row", alignItems: "center", paddingVertical: 18, paddingHorizontal: 20, gap: 12 },
  aiBtnText: { flex: 1, color: "#FFF", fontWeight: "800", fontSize: 16 },

  sectionHead: { paddingHorizontal: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: colors.primaryDark },

  emptyState: { alignItems: "center", paddingVertical: 60 },
  emptyText: { marginTop: 15, color: colors.muted, fontWeight: "600" },

  medCard: { flexDirection: "row", backgroundColor: "#FFF", marginHorizontal: 20, borderRadius: 28, padding: 16, marginBottom: 15, ...shadows.soft, borderWidth: 1, borderColor: "rgba(0,0,0,0.02)" },
  medIconBox: { width: 80, height: 80, borderRadius: 22, backgroundColor: "#F1F5F9", overflow: "hidden" },
  medImg: { width: "100%", height: "100%", resizeMode: "cover" },
  medContent: { flex: 1, marginLeft: 16, justifyContent: "center" },
  medName: { fontSize: 17, fontWeight: "800", color: colors.text, marginBottom: 2 },
  medForm: { fontSize: 12, color: colors.muted, fontWeight: "600", marginBottom: 10 },
  medFooter: { flexDirection: "row", alignItems: "center", gap: 12 },
  medPrice: { fontSize: 15, fontWeight: "900", color: colors.primary },
  stockBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  stockText: { fontSize: 10, fontWeight: "800" },
  orderBtn: { width: 44, height: 44, borderRadius: 18, backgroundColor: colors.primaryDark, alignItems: "center", justifyContent: "center", alignSelf: "center" },

  prescriptionBox: { marginHorizontal: 20, marginTop: 20, backgroundColor: colors.primaryPale, borderRadius: 30, padding: 24, borderStyle: "dashed", borderWidth: 2, borderColor: colors.primarySoft },
  prescriptionTitle: { fontSize: 18, fontWeight: "900", color: colors.primaryDark, marginBottom: 6 },
  prescriptionSub: { fontSize: 13, color: colors.muted, lineHeight: 20, marginBottom: 20 },
  uploadBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12, backgroundColor: "#FFF", paddingVertical: 15, borderRadius: 20, ...shadows.soft },
  uploadBtnText: { fontSize: 15, fontWeight: "800", color: colors.primary },
});
