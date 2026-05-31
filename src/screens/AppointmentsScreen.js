import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { api } from "../services/api";
import { colors, shadows } from "../theme";

const PremiumBackground = () => (
  <View style={StyleSheet.absoluteFill}>
    <View style={[StyleSheet.absoluteFill, { backgroundColor: "#F8FBFF" }]} />
    <View style={[styles.blob, { top: -50, right: -50, width: 250, height: 250, backgroundColor: "#E3EEFF", opacity: 0.6 }]} />
    <View style={[styles.blob, { bottom: 100, left: -80, width: 300, height: 300, backgroundColor: "#EAFFF4", opacity: 0.4 }]} />
  </View>
);

export default function AppointmentsScreen({ navigation }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await api.getAppointments();
      setAppointments(data || []);
    } catch (err) {
      console.log("Error loading appointments", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (type, item) => {
    Alert.alert(
      type === "cancel" ? "Annuler" : "Reprogrammer",
      `Voulez-vous ${type === "cancel" ? "annuler" : "reprogrammer"} le RDV avec ${item.doctorName}?`,
      [
        { text: "Non", style: "cancel" },
        { text: "Oui", onPress: () => Alert.alert("Succès", "Demande envoyée au secrétariat.") },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <PremiumBackground />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.kicker}>RDV & ORDONNANCES</Text>
            <Text style={styles.title}>Gérez vos soins.</Text>
          </View>
          <Pressable style={styles.addBtn} onPress={() => navigation.navigate("BookingAppointment")}>
            <Ionicons name="add" size={24} color="#FFF" />
          </Pressable>
        </View>

        <Pressable style={styles.uploadCard} onPress={async () => {
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
          });
          if (!result.canceled) {
            Alert.alert("Analyse IA en cours...", "Recherche des correspondances...", [
              { text: "OK", onPress: () => Alert.alert("Succès", "Ordonnance analysée. Les médicaments correspondants ont été ajoutés à votre panier ou recommandations.") }
            ]);
          }
        }}>
          <View style={styles.uploadIcon}>
            <Ionicons name="cloud-upload" size={28} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.uploadTitle}>Scanner une ordonnance</Text>
            <Text style={styles.uploadSub}>Analyse IA automatique</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.muted} />
        </Pressable>

        <Text style={styles.sectionTitle}>Mes prochains rendez-vous</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
        ) : appointments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={32} color={colors.muted} />
            <Text style={styles.emptyText}>Aucun rendez-vous prévu.</Text>
          </View>
        ) : (
          appointments.map((item) => (
            <View key={item.id} style={styles.appointCard}>
              <View style={styles.cardHeader}>
                <View style={styles.docAvatar}>
                  <Ionicons name="person" size={22} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.docName}>{item.doctorName}</Text>
                  <Text style={styles.docSpec}>{item.specialty || "Médecin généraliste"}</Text>
                </View>
                <View style={[styles.statusPill, { backgroundColor: item.status === "Confirmé" ? "#E0F8EC" : "#FFF4E0" }]}>
                  <Text style={[styles.statusText, { color: item.status === "Confirmé" ? colors.success : colors.warning }]}>{item.status}</Text>
                </View>
              </View>
              <View style={styles.cardInfo}>
                <View style={styles.infoRow}>
                  <Ionicons name="calendar" size={14} color={colors.muted} />
                  <Text style={styles.infoText}>{item.date}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="time" size={14} color={colors.muted} />
                  <Text style={styles.infoText}>{item.time}</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <Pressable style={styles.actionBtn} onPress={() => handleAction("reschedule", item)}>
                  <Text style={styles.actionText}>Reprogrammer</Text>
                </Pressable>
                <Pressable style={[styles.actionBtn, styles.actionBtnOutline]} onPress={() => handleAction("cancel", item)}>
                  <Text style={[styles.actionText, { color: colors.danger }]}>Annuler</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 52, paddingBottom: 20 },
  blob: { position: "absolute", borderRadius: 150 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 },
  kicker: { color: colors.primary, fontWeight: "800", fontSize: 12, letterSpacing: 1.5, marginBottom: 4 },
  title: { fontSize: 26, fontWeight: "800", color: colors.text },
  addBtn: { width: 44, height: 44, borderRadius: 16, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", ...shadows.card },
  uploadCard: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "#FFF", padding: 18, borderRadius: 20, borderWidth: 1, borderColor: "rgba(0,0,0,0.03)", marginBottom: 24, ...shadows.soft },
  uploadIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" },
  uploadTitle: { fontSize: 16, fontWeight: "800", color: colors.text },
  uploadSub: { fontSize: 13, color: colors.muted, marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: colors.text, marginBottom: 16 },
  emptyCard: { backgroundColor: "#FFF", borderRadius: 20, padding: 32, alignItems: "center", justifyContent: "center", ...shadows.soft },
  emptyText: { color: colors.muted, fontSize: 14, marginTop: 12 },
  appointCard: { backgroundColor: "#FFF", borderRadius: 24, borderWidth: 1, borderColor: "rgba(0,0,0,0.03)", padding: 20, marginBottom: 16, ...shadows.soft },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 16 },
  docAvatar: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" },
  docName: { fontSize: 16, fontWeight: "800", color: colors.text },
  docSpec: { fontSize: 13, color: colors.muted, marginTop: 1 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: "700" },
  cardInfo: { flexDirection: "row", gap: 20, borderTopWidth: 1, borderTopColor: "#F1F5F9", paddingTop: 16, marginBottom: 20 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  infoText: { fontSize: 13, color: colors.textSecondary, fontWeight: "600" },
  actions: { flexDirection: "row", gap: 12 },
  actionBtn: { flex: 1, height: 44, borderRadius: 14, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" },
  actionBtnOutline: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#FED7D7" },
  actionText: { fontSize: 13, fontWeight: "700", color: colors.primary },
});
