import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme";
import { profiles } from "../data/demo";

export function ProfileScreen({ dashboard }) {
  const profileList = dashboard?.profiles?.length ? dashboard.profiles : profiles;
  const medicalRecord = dashboard?.medicalRecord;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Image source={require("../../assets/images/logo.jpg")} style={styles.avatarImage} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.kicker}>Profil famille</Text>
          <Text style={styles.title}>Sophie, dossier medical centralise et multi-profils.</Text>
          <Text style={styles.subtitle}>Allergies, vaccins, traitements en cours, partage securise et export PDF.</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Profils disponibles</Text>
      <View style={styles.profileGrid}>
        {profileList.map((profile) => (
          <View key={profile.id} style={[styles.profileCard, { borderColor: profile.tone }]}>
            <View style={[styles.profileDot, { backgroundColor: profile.tone }]} />
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileRole}>{profile.role}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Dossier de sante</Text>
      <View style={styles.recordCard}>
        <RecordItem label="Allergies" value={medicalRecord ? medicalRecord.allergies.join(", ") : "Penicilline, arachides"} />
        <RecordItem label="Traitements" value={medicalRecord ? medicalRecord.treatments.join(", ") : "Vitamine D, antihistaminique"} />
        <RecordItem label="Vaccins" value={medicalRecord ? medicalRecord.vaccines.join(", ") : "Calendrier a jour"} />
        <RecordItem label="Notes" value={medicalRecord ? medicalRecord.notes.join(", ") : "Acces temporaire actif"} />
      </View>

      <Text style={styles.sectionTitle}>Options rapides</Text>
      <View style={styles.quickRow}>
        <QuickAction label="Exporter PDF" />
        <QuickAction label="Biometrie" />
        <QuickAction label="Paiements" />
      </View>

      <View style={styles.familyCard}>
        <Text style={styles.familyTitle}>Pack Premium Famille</Text>
        <Text style={styles.familyText}>
          Un seul compte pour les rendez-vous, l'aide d'urgence, les suivis enfants et les rappels medicaux.
        </Text>
        <Pressable style={styles.familyButton}>
          <Text style={styles.familyButtonText}>Activer le pack</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function RecordItem({ label, value }) {
  return (
    <View style={styles.recordItem}>
      <Text style={styles.recordLabel}>{label}</Text>
      <Text style={styles.recordValue}>{value}</Text>
    </View>
  );
}

function QuickAction({ label }) {
  return (
    <View style={styles.quickAction}>
      <Text style={styles.quickActionText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 28,
    padding: 16,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 26,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 62,
    height: 62,
    borderRadius: 20,
  },
  kicker: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    color: colors.text,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "800",
    marginTop: 6,
  },
  subtitle: {
    color: colors.muted,
    marginTop: 8,
    lineHeight: 20,
    fontSize: 13,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 18,
    marginBottom: 12,
  },
  profileGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  profileCard: {
    width: "48%",
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    padding: 14,
  },
  profileDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  profileName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  profileRole: {
    color: colors.muted,
    marginTop: 4,
    fontSize: 12,
  },
  recordCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 24,
    padding: 16,
  },
  recordItem: {
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  recordLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  recordValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },
  quickRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  quickAction: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.primarySoft,
  },
  quickActionText: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 12,
  },
  familyCard: {
    marginTop: 18,
    backgroundColor: "#EEF8FF",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#D2E4FF",
    padding: 18,
  },
  familyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  familyText: {
    color: colors.muted,
    lineHeight: 21,
    marginTop: 8,
    fontSize: 13,
  },
  familyButton: {
    marginTop: 14,
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  familyButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
