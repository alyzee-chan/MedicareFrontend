import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, shadows } from "../theme";
import { api } from "../services/api";

const PremiumBackground = () => (
  <View style={StyleSheet.absoluteFill}>
    <View style={[StyleSheet.absoluteFill, { backgroundColor: "#F8FBFF" }]} />
    <View style={[styles.blob, { top: -50, right: -50, width: 250, height: 250, backgroundColor: "#E3EEFF", opacity: 0.6 }]} />
  </View>
);

const DOCTORS = [
  { id: 1, name: "Dr. Jeanne EVOUNA", spec: "Pediatrie", clinic: "Hopital de la Casse", rating: 4.8 },
  { id: 2, name: "Dr. Marc NGO", spec: "Cardiologie", clinic: "Teleconsultation", rating: 4.9 },
  { id: 3, name: "Dr. Aissatou MBEA", spec: "Vaccination", clinic: "Centre medical Douala", rating: 4.7 },
  { id: 4, name: "Dr. Paul ATANGANA", spec: "Généraliste", clinic: "Clinique Muna", rating: 4.6 },
];

export default function BookingAppointmentScreen({ navigation }) {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const confirmBooking = async () => {
    if (!selectedDoc || !date || !time || !reason) {
      Alert.alert("Désolé", "Veuillez remplir tous les champs !");
      return;
    }

    setLoading(true);
    try {
      await api.createAppointment({
        patientName: "Moi", // or get from specific profile
        doctorName: selectedDoc.name,
        specialty: selectedDoc.spec,
        clinic: selectedDoc.clinic,
        date: date,
        time: time,
        reason: reason,
      });
      Alert.alert("✅ Rendez-vous Confirmé", "Votre réservation a été enregistrée avec succès.", [
        { text: "Super", onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert("Erreur", "Impossible de valider le RDV");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <PremiumBackground />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.title}>Nouveau RDV</Text>
        </View>

        <Text style={styles.sectionTitle}>1. Choisissez un praticien</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.docList}>
          {DOCTORS.map(doc => (
            <Pressable
              key={doc.id}
              style={[styles.docCard, selectedDoc?.id === doc.id && styles.docCardActive]}
              onPress={() => setSelectedDoc(doc)}
            >
              <View style={styles.docAvatar}>
                <Ionicons name="person" size={24} color={selectedDoc?.id === doc.id ? "#FFF" : colors.primary} />
              </View>
              <Text style={[styles.docName, selectedDoc?.id === doc.id && { color: "#FFF" }]}>{doc.name}</Text>
              <Text style={[styles.docSpec, selectedDoc?.id === doc.id && { color: "rgba(255,255,255,0.8)" }]}>{doc.spec}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>2. Date & Heure (jj/mm/aaaa, hh:mm)</Text>
        <View style={styles.rowGrid}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Ex: 27/02/2026"
            value={date}
            onChangeText={setDate}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Ex: 14h30"
            value={time}
            onChangeText={setTime}
          />
        </View>

        <Text style={styles.sectionTitle}>3. Motif de la consultation</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Décrivez vos symptômes ou votre besoin..."
          value={reason}
          onChangeText={setReason}
          multiline
        />

        <Pressable
          style={[styles.btn, loading && { opacity: 0.7 }]}
          onPress={confirmBooking}
          disabled={loading}
        >
          <Text style={styles.btnText}>{loading ? "Validation..." : "Confirmer le RDV"}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 52, paddingBottom: 40 },
  blob: { position: "absolute", borderRadius: 150 },
  header: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 28 },
  backBtn: { width: 44, height: 44, borderRadius: 16, backgroundColor: "#FFF", alignItems: "center", justifyContent: "center", ...shadows.soft },
  title: { fontSize: 24, fontWeight: "800", color: colors.text },

  sectionTitle: { fontSize: 16, fontWeight: "800", color: colors.text, marginBottom: 16, marginTop: 20 },
  docList: { gap: 14, paddingRight: 20 },
  docCard: { width: 140, backgroundColor: "#FFF", borderRadius: 20, padding: 16, alignItems: "center", borderWidth: 2, borderColor: "transparent", ...shadows.soft },
  docCardActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  docAvatar: { width: 56, height: 56, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  docName: { fontSize: 14, fontWeight: "800", color: colors.text, textAlign: "center" },
  docSpec: { fontSize: 12, color: colors.muted, textAlign: "center", marginTop: 4 },

  rowGrid: { flexDirection: "row", gap: 14 },
  input: { backgroundColor: "#FFF", borderRadius: 16, padding: 18, fontSize: 15, color: colors.text, borderWidth: 1, borderColor: "rgba(0,0,0,0.05)", ...shadows.soft },
  textArea: { minHeight: 120, textAlignVertical: "top" },

  btn: { backgroundColor: colors.primary, borderRadius: 18, paddingVertical: 18, alignItems: "center", marginTop: 32, ...shadows.card },
  btnText: { color: "#FFF", fontWeight: "800", fontSize: 16 },
});
