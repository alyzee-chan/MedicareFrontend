import React from "react";
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { colors } from "../theme";
import { dashboardStats, pharmacies, quickActions, upcomingAppointments } from "../data/demo";

function SectionHeader({ title, action }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  );
}

export function HomeScreen({ onNavigate, dashboard }) {
  const stats = dashboard?.metrics?.length ? dashboard.metrics : dashboardStats;
  const appointments = dashboard?.appointments?.length ? dashboard.appointments : upcomingAppointments;
  const pharmacyList = dashboard?.pharmacies?.length ? dashboard.pharmacies : pharmacies;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.topRow}>
        <View style={styles.brandRow}>
          <View style={styles.logoFrame}>
            <Image source={require("../../assets/images/logo.jfif")} style={styles.logo} />
          </View>
          <View>
            <Text style={styles.eyebrow}>MediCare +</Text>
            <Text style={styles.greeting}>Bienvenue sur votre espace sante</Text>
          </View>
        </View>
        <View style={styles.bell}>
          <Text style={styles.bellText}>0</Text>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput placeholder="Comment pouvons-nous vous aider ?" placeholderTextColor="#9AA5BD" style={styles.searchInput} />
        <Text style={styles.searchMic}>◌</Text>
      </View>

      <ImageBackground source={require("../../assets/images/Accueil.png")} style={styles.hero} imageStyle={styles.heroImage}>
        <View style={styles.heroOverlay}>
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroTitle}>Prenez soin de tout le parcours de soin en un seul endroit.</Text>
            <Text style={styles.heroCopy}>Rendez-vous, telemedecine, ordonnances, pharmacies et SOS urgent.</Text>
            <Pressable style={styles.heroButton} onPress={() => onNavigate("sos")}>
              <Text style={styles.heroButtonText}>Ouvrir le mode SOS</Text>
            </Pressable>
          </View>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>24h/24</Text>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.statsRow}>
        {stats.map((item) => (
          <View key={item.label} style={styles.statCard}>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <SectionHeader title="Acces rapides" action="Explorer" />
      <View style={styles.quickGrid}>
        {quickActions.map((action) => (
          <Pressable
            key={action.id}
            style={[styles.quickCard, { borderColor: action.accent }]}
            onPress={() => {
              if (action.id === "sos") onNavigate("sos");
              if (action.id === "search") onNavigate("medicines");
              if (action.id === "family") onNavigate("profile");
            }}
          >
            <View style={[styles.quickIcon, { backgroundColor: action.accent }]}>
              <Text style={styles.quickIconText}>{action.icon}</Text>
            </View>
            <Text style={styles.quickTitle}>{action.title}</Text>
            <Text style={styles.quickSubtitle}>{action.subtitle}</Text>
          </Pressable>
        ))}
      </View>

      <SectionHeader title="Rendez-vous a venir" action="Voir tout" />
      {appointments.map((item) => (
        <AppointmentCard key={item.id} item={item} />
      ))}

      <SectionHeader title="Pharmacies de confiance" action="A proximite" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pharmacyScroll}>
        {pharmacyList.map((pharmacy) => (
          <View key={pharmacy.id} style={styles.pharmacyCard}>
            <View style={styles.pharmacyTop}>
              <View style={styles.pharmacyDot} />
              <View style={styles.pharmacyLabel}>
                <Text style={styles.pharmacyLabelText}>{pharmacy.label}</Text>
              </View>
            </View>
            <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
            <Text style={styles.pharmacyMeta}>
              {pharmacy.rating} note - {pharmacy.distance}
            </Text>
            <Text style={styles.pharmacyMeta}>{pharmacy.open}</Text>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

function AppointmentCard({ item }) {
  const displayName = item.name || item.doctorName;
  const displayLocation = item.specialty || item.clinic;

  return (
        <View key={item.id} style={styles.appointmentCard}>
          <View style={styles.appointmentAvatar}>
            <Text style={styles.appointmentAvatarText}>DR</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.appointmentName}>{displayName}</Text>
            <Text style={styles.appointmentMeta}>{displayLocation}</Text>
            <Text style={styles.appointmentMeta}>
              {item.date} - {item.time}
            </Text>
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 120,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoFrame: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.line,
  },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 12,
  },
  eyebrow: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 1.3,
    textTransform: "uppercase",
  },
  greeting: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 2,
  },
  bell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.line,
  },
  bellText: {
    color: colors.primary,
    fontWeight: "800",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 16,
  },
  searchIcon: {
    color: colors.muted,
    fontSize: 18,
    marginRight: 10,
  },
  searchMic: {
    color: colors.primary,
    fontSize: 18,
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
  },
  hero: {
    minHeight: 230,
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.line,
  },
  heroImage: {
    borderRadius: 28,
  },
  heroOverlay: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.34)",
  },
  heroTextBlock: {
    flex: 1,
    paddingRight: 12,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "800",
  },
  heroCopy: {
    marginTop: 10,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  heroButton: {
    marginTop: 14,
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 16,
  },
  heroButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  heroBadge: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.primarySoft,
  },
  heroBadgeText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "800",
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 8,
  },
  statCard: {
    flexBasis: "48%",
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
  },
  statValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
  },
  statLabel: {
    color: colors.muted,
    marginTop: 4,
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  sectionAction: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickCard: {
    width: "48%",
    minHeight: 132,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    padding: 14,
    justifyContent: "space-between",
    elevation: 1,
  },
  quickIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  quickIconText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  quickTitle: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "800",
    marginTop: 8,
  },
  quickSubtitle: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  appointmentCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 10,
  },
  appointmentAvatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primarySoft,
  },
  appointmentAvatarText: {
    color: colors.primary,
    fontWeight: "800",
  },
  appointmentName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  appointmentMeta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 3,
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#EAF9F0",
  },
  statusText: {
    color: colors.success,
    fontWeight: "700",
    fontSize: 11,
  },
  pharmacyScroll: {
    gap: 12,
    paddingRight: 12,
  },
  pharmacyCard: {
    width: 220,
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
  },
  pharmacyTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  pharmacyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
  },
  pharmacyLabel: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
  },
  pharmacyLabelText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 11,
  },
  pharmacyName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },
  pharmacyMeta: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
  },
});
