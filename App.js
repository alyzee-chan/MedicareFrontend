import React, { useEffect, useState } from "react";
import { Image, ImageBackground, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";

import { BottomTabs } from "./src/components/BottomTabs";
import { AppointmentsScreen } from "./src/screens/AppointmentsScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { MedicinesScreen } from "./src/screens/MedicinesScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { SosScreen } from "./src/screens/SosScreen";
import { api } from "./src/services/api";
import { colors } from "./src/theme";

const tabs = [
  { key: "home", label: "Accueil", symbol: "HOME" },
  { key: "appointments", label: "RDV", symbol: "RDV" },
  { key: "medicines", label: "Medicaments", symbol: "MED" },
  { key: "sos", label: "SOS", symbol: "SOS" },
  { key: "profile", label: "Profil", symbol: "PRO" },
];

export default function App() {
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let mounted = true;
    api
      .getDashboard()
      .then((payload) => {
        if (mounted) {
          setDashboard(payload);
        }
      })
      .catch(() => {
        if (mounted) {
          setDashboard(null);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) {
    return (
      <SafeAreaView style={styles.splashWrap}>
        <StatusBar barStyle="dark-content" />
        <ImageBackground
          source={require("./assets/images/LoadingPage.png")}
          style={styles.splashCard}
          imageStyle={styles.splashImage}
        >
          <View style={styles.splashOverlay}>
            <View style={styles.logoFrame}>
              <Image source={require("./assets/images/logo.jfif")} style={styles.logo} />
            </View>
            <Text style={styles.brand}>MediCare +</Text>
            <Text style={styles.splashText}>Votre super-app sante, consultation, pharmacie et SOS.</Text>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.screen}>
        {activeTab === "home" && <HomeScreen dashboard={dashboard} onNavigate={setActiveTab} />}
        {activeTab === "appointments" && <AppointmentsScreen dashboard={dashboard} onNavigate={setActiveTab} />}
        {activeTab === "medicines" && <MedicinesScreen dashboard={dashboard} onNavigate={setActiveTab} />}
        {activeTab === "sos" && <SosScreen onNavigate={setActiveTab} />}
        {activeTab === "profile" && <ProfileScreen dashboard={dashboard} onNavigate={setActiveTab} />}
      </View>
      <BottomTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  screen: {
    flex: 1,
  },
  splashWrap: {
    flex: 1,
    backgroundColor: colors.warm,
    padding: 12,
  },
  splashCard: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 28,
    backgroundColor: "#EAF7FF",
  },
  splashImage: {
    borderRadius: 28,
  },
  splashOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "rgba(255,255,255,0.28)",
  },
  logoFrame: {
    width: 138,
    height: 138,
    borderRadius: 69,
    borderWidth: 2,
    borderColor: "#54D3A2",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
    marginBottom: 18,
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 22,
  },
  brand: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.8,
  },
  splashText: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    maxWidth: 280,
  },
});
