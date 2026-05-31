import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, shadows } from "../theme";

const BaseHeader = ({ title, navigation }) => (
  <View style={styles.header}>
    <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={24} color={colors.text} />
    </Pressable>
    <Text style={styles.title}>{title}</Text>
    <View style={{ width: 44 }} />
  </View>
);

const PremiumBackground = () => (
  <View style={StyleSheet.absoluteFill}>
    <View style={[StyleSheet.absoluteFill, { backgroundColor: "#F8FBFF" }]} />
    <View style={[styles.blob, { top: -50, right: -50, width: 250, height: 250, backgroundColor: "#E3EEFF", opacity: 0.6 }]} />
  </View>
);

// ─── 1. DOSSIER MÉDICAL ───
export function MedicalRecordScreen({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <PremiumBackground />
      <BaseHeader title="Dossier Médical" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Allergies connues</Text>
          <Text style={styles.textData}>- Pénicilline (réaction modérée)</Text>
          <Text style={styles.textData}>- Arachides</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Traitements en cours</Text>
          <Text style={styles.textData}>- OBH Combi (1x par jour)</Text>
          <Text style={styles.textData}>- Vitamine D</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Vaccinations</Text>
          <Text style={styles.textData}>- Hépatite B (à jour - 2024)</Text>
          <Text style={styles.textData}>- Fièvre Jaune (valide 2030)</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── 2. ASSURANCE SANTÉ ───
export function InsuranceScreen({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <PremiumBackground />
      <BaseHeader title="Assurance Santé" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.card, { backgroundColor: colors.accent }]}>
          <Text style={{ color: "#FFF", fontSize: 13, fontWeight: "700", opacity: 0.8 }}>CARTE D'ASSURE MATHCA SANTÉ</Text>
          <Text style={{ color: "#FFF", fontSize: 24, fontWeight: "900", marginTop: 8, letterSpacing: 2 }}>0394 4892 1032 4492</Text>
          <Text style={{ color: "#FFF", marginTop: 16 }}>Sophie Mbarga</Text>
          <Text style={{ color: "#FFF", fontSize: 12, opacity: 0.8 }}>Valide jusqu'au 12/2026</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Couvertures principales</Text>
          <Text style={styles.textData}>• Prise en charge 80% (Pharmacie)</Text>
          <Text style={styles.textData}>• Consultations Généralistes (100%)</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── 3. BIOMÉTRIE & SOMMEIL ───
export function BiometricsScreen({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <PremiumBackground />
      <BaseHeader title="Biométrie & Sommeil" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ flexDirection: "row", gap: 14, marginBottom: 14 }}>
          <View style={[styles.card, { flex: 1, alignItems: "center" }]}>
            <Ionicons name="heart" size={32} color={colors.danger} />
            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>72 bpm</Text>
            <Text style={styles.textData}>Rythme moyen</Text>
          </View>
          <View style={[styles.card, { flex: 1, alignItems: "center" }]}>
            <Ionicons name="moon" size={32} color="#8A5CFF" />
            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>7h 12m</Text>
            <Text style={styles.textData}>Sommeil</Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dernière pesée (Fév 2026)</Text>
          <Text style={styles.textData}>68 kg — IMC: 22.4 (Normal)</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── 4. HISTORIQUE PAIEMENTS ───
export function PaymentsScreen({ navigation }) {
  const transactions = [
    { id: 1, type: "Pharmacie", desc: "Achat OBH Combi", date: "24 Fév 2026", amount: "-3,500 FCFA", color: colors.danger },
    { id: 2, type: "Remboursement", desc: "Assurance", date: "20 Fév 2026", amount: "+2,800 FCFA", color: "#21D07A" },
    { id: 3, type: "Scanner", desc: "Imagerie Centre", date: "15 Jan 2026", amount: "-15,000 FCFA", color: colors.danger },
  ];

  return (
    <View style={{ flex: 1 }}>
      <PremiumBackground />
      <BaseHeader title="Historique Paiements" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.container}>
        {transactions.map(t => (
          <View key={t.id} style={[styles.card, { flexDirection: "row", alignItems: "center", gap: 16 }]}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "700", color: colors.text }}>{t.desc}</Text>
              <Text style={{ fontSize: 13, color: colors.muted, marginTop: 4 }}>{t.type} · {t.date}</Text>
            </View>
            <Text style={{ fontWeight: "800", color: t.color }}>{t.amount}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── 5. PARAMÈTRES ───
export function SettingsScreen({ navigation }) {
  const [notif, setNotif] = React.useState(true);
  const [dark, setDark] = React.useState(false);

  return (
    <View style={{ flex: 1 }}>
      <PremiumBackground />
      <BaseHeader title="Paramètres" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <Text style={styles.textData}>Notifications Push</Text>
            <Switch value={notif} onValueChange={setNotif} trackColor={{ true: colors.primary }} />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <Text style={styles.textData}>Mode Sombre</Text>
            <Switch value={dark} onValueChange={setDark} trackColor={{ true: colors.primary }} />
          </View>
        </View>
        <Text style={{ textAlign: "center", color: colors.muted, fontSize: 12 }}>Medicare+ v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

// ─── STYLES ───
const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
  blob: { position: "absolute", borderRadius: 150 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backBtn: { width: 44, height: 44, borderRadius: 16, backgroundColor: "#FFF", alignItems: "center", justifyContent: "center", ...shadows.soft },
  title: { fontSize: 20, fontWeight: "800", color: colors.text },

  card: { backgroundColor: "#FFF", borderRadius: 24, padding: 20, marginBottom: 16, ...shadows.soft, borderWidth: 1, borderColor: "rgba(0,0,0,0.03)" },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: colors.text, marginBottom: 8 },
  textData: { fontSize: 14, color: colors.text, lineHeight: 22, fontWeight: "500" },

  settingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 },
  divider: { height: 1, backgroundColor: "#F1F5F9", marginVertical: 8 }
});
