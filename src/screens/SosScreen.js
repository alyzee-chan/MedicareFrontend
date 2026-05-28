import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme";
import { emergencySteps, pharmacies } from "../data/demo";

export function SosScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Mode critique</Text>
        <Text style={styles.title}>SOS urgence visible partout, meme en situation de stress.</Text>
      </View>

      <View style={styles.alertCard}>
        <View style={styles.alertTop}>
          <View style={styles.alertCircle}>
            <Text style={styles.alertCircleText}>30</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>Enfant qui convulse</Text>
            <Text style={styles.alertText}>
              Affichez d'abord les gestes de secours puis declenchez les secours, medecins de garde et pharmacies proches.
            </Text>
          </View>
        </View>
        <View style={styles.alertButtons}>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Appeler secours</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Je n'y arrive pas</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Gestes prioritaires</Text>
      {emergencySteps.map((step, index) => (
        <View key={step} style={styles.stepCard}>
          <View style={styles.stepIndex}>
            <Text style={styles.stepIndexText}>{index + 1}</Text>
          </View>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Cas couverts</Text>
      <View style={styles.caseGrid}>
        {["Convulsions", "Etouffement", "Brulures", "Perte de connaissance", "Douleur thoracique", "Allergie severe"].map((item) => (
          <View key={item} style={styles.caseChip}>
            <Text style={styles.caseChipText}>{item}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Pharmacies SOS proches</Text>
      {pharmacies.slice(0, 3).map((pharmacy) => (
        <View key={pharmacy.id} style={styles.pharmacyCard}>
          <View style={styles.pharmacyDot} />
          <View style={{ flex: 1 }}>
            <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
            <Text style={styles.pharmacyMeta}>{pharmacy.distance} - {pharmacy.open}</Text>
          </View>
          <Text style={styles.pharmacyScore}>{pharmacy.rating}</Text>
        </View>
      ))}

      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Version hors ligne</Text>
        <Text style={styles.noticeText}>
          Les fiches d'urgence restent accessibles sans connexion, puis le fallback SMS prend le relais si le reseau est indisponible.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 14,
  },
  kicker: {
    color: colors.danger,
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "800",
    marginTop: 8,
  },
  alertCard: {
    backgroundColor: "#FFF1F3",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#FFC7D0",
    padding: 18,
  },
  alertTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  alertCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.danger,
  },
  alertCircleText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },
  alertTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  alertText: {
    color: colors.muted,
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
  },
  alertButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.danger,
    borderRadius: 18,
    paddingVertical: 13,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFC7D0",
  },
  secondaryButtonText: {
    color: colors.danger,
    fontWeight: "800",
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 18,
    marginBottom: 12,
  },
  stepCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    marginBottom: 10,
  },
  stepIndex: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFE7EA",
  },
  stepIndexText: {
    color: colors.danger,
    fontWeight: "800",
  },
  stepText: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "600",
  },
  caseGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  caseChip: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  caseChipText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  pharmacyCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    marginBottom: 10,
  },
  pharmacyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
  },
  pharmacyName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  pharmacyMeta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 3,
  },
  pharmacyScore: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 16,
  },
  notice: {
    marginTop: 16,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 24,
    padding: 16,
  },
  noticeTitle: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 16,
  },
  noticeText: {
    color: colors.muted,
    lineHeight: 21,
    marginTop: 8,
    fontSize: 13,
  },
});
