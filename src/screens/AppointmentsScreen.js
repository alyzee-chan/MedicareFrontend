import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme";
import { upcomingAppointments } from "../data/demo";

function Tag({ label, active }) {
  return (
    <View style={[styles.tag, active && styles.tagActive]}>
      <Text style={[styles.tagText, active && styles.tagTextActive]}>{label}</Text>
    </View>
  );
}

export function AppointmentsScreen({ dashboard }) {
  const appointments = dashboard?.appointments?.length ? dashboard.appointments : upcomingAppointments;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.kicker}>Rendez-vous</Text>
      <Text style={styles.title}>Planifiez, suivez et reprogrammez vos consultations.</Text>

      <View style={styles.filterRow}>
        <Tag label="Aujourd'hui" active />
        <Tag label="Semaine" />
        <Tag label="Teleconsultation" />
      </View>

      {appointments.map((item, index) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.cardTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>0{index + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.name || item.doctorName}</Text>
              <Text style={styles.cardMeta}>{item.specialty || item.clinic}</Text>
              <Text style={styles.cardMeta}>
                {item.date} - {item.time}
              </Text>
            </View>
            <Pressable style={styles.chevron}>
              <Text style={styles.chevronText}>›</Text>
            </Pressable>
          </View>
          <View style={styles.actionsRow}>
            <Pressable style={styles.primaryAction}>
              <Text style={styles.primaryActionText}>Reporter</Text>
            </Pressable>
            <Pressable style={styles.secondaryAction}>
              <Text style={styles.secondaryActionText}>Annuler</Text>
            </Pressable>
          </View>
        </View>
      ))}

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Telemedecine securisee</Text>
        <Text style={styles.panelText}>
          Session video WebRTC, chat prive, partage de documents et ordonnance numerique avec QR code.
        </Text>
        <View style={styles.panelSteps}>
          <Text style={styles.panelStep}>1. Ouvrir la salle d'attente</Text>
          <Text style={styles.panelStep}>2. Partager les pieces jointes</Text>
          <Text style={styles.panelStep}>3. Recueillir l'ordonnance PDF</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Historique recent</Text>
      <View style={styles.historyRow}>
        <View style={styles.historyStat}>
          <Text style={styles.historyValue}>14</Text>
          <Text style={styles.historyLabel}>Consultations</Text>
        </View>
        <View style={styles.historyStat}>
          <Text style={styles.historyValue}>08</Text>
          <Text style={styles.historyLabel}>Ordonnances</Text>
        </View>
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
  kicker: {
    color: colors.primary,
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
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  tagActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primarySoft,
  },
  tagText: {
    color: colors.muted,
    fontWeight: "700",
    fontSize: 12,
  },
  tagTextActive: {
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF4FF",
  },
  avatarText: {
    color: colors.primary,
    fontWeight: "800",
  },
  cardTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  cardMeta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  chevron: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  chevronText: {
    color: colors.primary,
    fontSize: 24,
    lineHeight: 24,
    fontWeight: "700",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  primaryAction: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryActionText: {
    color: colors.primary,
    fontWeight: "700",
  },
  panel: {
    marginTop: 8,
    backgroundColor: "#FFF7EE",
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: "#FFE2C0",
  },
  panelTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  panelText: {
    color: colors.muted,
    marginTop: 8,
    lineHeight: 21,
    fontSize: 13,
  },
  panelSteps: {
    marginTop: 14,
    gap: 8,
  },
  panelStep: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 18,
    marginBottom: 10,
  },
  historyRow: {
    flexDirection: "row",
    gap: 12,
  },
  historyStat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
  },
  historyValue: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 22,
  },
  historyLabel: {
    color: colors.muted,
    marginTop: 4,
    fontSize: 12,
  },
});
