import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { colors } from "../theme";
import { medicines, pharmacies, searchModes } from "../data/demo";

function ModeCard({ label, active }) {
  return (
    <View style={[styles.modeCard, active && styles.modeCardActive]}>
      <Text style={[styles.modeLabel, active && styles.modeLabelActive]}>{label}</Text>
    </View>
  );
}

export function MedicinesScreen({ onNavigate, dashboard }) {
  const medicineList = dashboard?.medicines?.length ? dashboard.medicines : medicines;
  const pharmacyList = dashboard?.pharmacies?.length ? dashboard.pharmacies : pharmacies;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.kicker}>Medicaments</Text>
      <Text style={styles.title}>Recherchez, comparez et commandez en quelques secondes.</Text>

      <View style={styles.hero}>
        <View style={styles.heroText}>
          <Text style={styles.heroHeadline}>Ordonnance, stock et alternatives au meme endroit.</Text>
          <Text style={styles.heroCopy}>
            La recherche fonctionne par nom, symptomes, photo ou description. Les resultats restent lisibles et rapides.
          </Text>
        </View>
        <Image source={require("../../assets/images/HealthCare.png")} style={styles.heroImage} />
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput placeholder="Nom commercial, symptomes ou description" placeholderTextColor="#97A4B9" style={styles.searchInput} />
      </View>

      <View style={styles.modeGrid}>
        {searchModes.map((mode, index) => (
          <ModeCard key={mode} label={mode} active={index === 0} />
        ))}
      </View>

      <Text style={styles.sectionTitle}>Resultats en stock</Text>
      {medicineList.map((medicine) => (
        <View key={medicine.id} style={styles.card}>
          <View style={styles.cardLeft}>
            <View style={styles.medIcon}>
              <Text style={styles.medIconText}>+</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{medicine.name}</Text>
              <Text style={styles.cardMeta}>{medicine.form}</Text>
              <Text style={styles.cardMeta}>{medicine.alternative}</Text>
            </View>
          </View>
          <View style={styles.cardRight}>
            <Text style={styles.price}>{medicine.price}</Text>
            <View style={[styles.stockBadge, medicine.stock === "En stock" ? styles.stockGood : styles.stockLow]}>
              <Text style={[styles.stockText, medicine.stock === "En stock" ? styles.stockTextGood : styles.stockTextLow]}>
                {medicine.stock}
              </Text>
            </View>
          </View>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Pharmacies de confiance</Text>
      <View style={styles.pharmacyBox}>
        {pharmacyList.map((pharmacy) => (
          <View key={pharmacy.id} style={styles.pharmacyRow}>
            <View style={styles.pin} />
            <View style={{ flex: 1 }}>
              <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
              <Text style={styles.pharmacyMeta}>
                {pharmacy.rating} note - {pharmacy.distance}
              </Text>
            </View>
            <Text style={styles.label}>{pharmacy.label}</Text>
          </View>
        ))}
      </View>

      <Pressable style={styles.cta} onPress={() => onNavigate("appointments")}>
        <Text style={styles.ctaText}>Commander depuis une ordonnance</Text>
      </Pressable>
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
  hero: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF4E8",
    borderRadius: 28,
    padding: 18,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#FFE1C4",
  },
  heroText: {
    flex: 1,
    paddingRight: 12,
  },
  heroHeadline: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 25,
    fontWeight: "800",
  },
  heroCopy: {
    color: colors.muted,
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
  },
  heroImage: {
    width: 92,
    height: 92,
    borderRadius: 24,
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
    marginTop: 16,
  },
  searchIcon: {
    color: colors.muted,
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
  },
  modeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },
  modeCard: {
    width: "48%",
    minHeight: 70,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  modeCardActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primarySoft,
  },
  modeLabel: {
    textAlign: "center",
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  modeLabelActive: {
    color: colors.primary,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 18,
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 10,
    gap: 12,
  },
  medIcon: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  medIconText: {
    color: colors.primary,
    fontSize: 20,
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
    marginTop: 3,
  },
  cardRight: {
    alignItems: "flex-end",
  },
  price: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
  },
  stockBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  stockGood: {
    backgroundColor: "#EAF9F0",
  },
  stockLow: {
    backgroundColor: "#FFF2E3",
  },
  stockText: {
    fontSize: 11,
    fontWeight: "700",
  },
  stockTextGood: {
    color: colors.success,
  },
  stockTextLow: {
    color: colors.warning,
  },
  pharmacyBox: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
  },
  pharmacyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  pin: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.danger,
  },
  pharmacyName: {
    color: colors.text,
    fontWeight: "800",
  },
  pharmacyMeta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 3,
  },
  label: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
  },
  cta: {
    marginTop: 18,
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  ctaText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
