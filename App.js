import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

import { BottomTabs } from "./src/components/BottomTabs";
import { AppointmentsScreen } from "./src/screens/AppointmentsScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { MedicinesScreen } from "./src/screens/MedicinesScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { SosScreen } from "./src/screens/SosScreen";
import { api } from "./src/services/api.js";
import { colors, shadows } from "./src/theme";

const tabs = [
  { key: "home", label: "Accueil" },
  { key: "appointments", label: "Ordonnances" },
  { key: "medicines", label: "Notification" },
  { key: "profile", label: "Profil" },
];

export default function App() {
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screenParams, setScreenParams] = useState({});

  useEffect(() => {
    // Shorter splash for better UX, will proceed once data is ready or after 1.5s max
    const timer = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // auto-ready when data is loaded
  useEffect(() => {
    if (!loading && dashboard) {
      setReady(true);
    }
  }, [loading, dashboard]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .getDashboard()
      .then((payload) => {
        if (mounted) { setDashboard(payload); setLoading(false); }
      })
      .catch((err) => {
        console.log("API Error:", err.message);
        if (mounted) { setDashboard(null); setLoading(false); }
      });
    return () => { mounted = false; };
  }, []);

  const handleNavigate = (tab, params = {}) => {
    if (tab === "sos") {
      Alert.alert("SOS Urgence", "Voulez-vous déclencher le mode SOS ?", [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer SOS",
          style: "destructive",
          onPress: () => {
            api.sendSos({ type: "urgence", latitude: 3.866, longitude: 11.5167, description: "Alerte SOS" })
              .then(() => Alert.alert("SOS envoyé", "Les pharmacies proches ont été notifiées."))
              .catch(() => Alert.alert("Erreur", "Impossible d'envoyer le SOS."));
          },
        },
      ]);
    } else {
      setScreenParams(params);
      setActiveTab(tab);
    }
  };

  // ─── Splash (LOGO CENTERED ON NEW BACKGROUND) ───
  if (!ready) {
    return (
      <View style={styles.splashRoot}>
        <StatusBar hidden />
        <ImageBackground
          source={require("./assets/images/LoadingPage.png")}
          style={styles.splashBg}
          resizeMode="cover"
        >
          <View style={styles.splashContent}>
            <View style={styles.logoRing}>
              <Image
                source={require("./assets/images/logo.jpg")}
                style={styles.splashLogo}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  // ─── App ───
  return (
    <View style={styles.appRoot}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.container}>
        <View style={styles.screen}>
          {activeTab === "home" && (
            <HomeScreen
              dashboard={dashboard}
              loading={loading}
              onNavigate={handleNavigate}
            />
          )}
          {activeTab === "appointments" && (
            <AppointmentsScreen
              dashboard={dashboard}
              loading={loading}
              onNavigate={handleNavigate}
            />
          )}
          {activeTab === "medicines" && (
            <MedicinesScreen
              dashboard={dashboard}
              loading={loading}
              onNavigate={handleNavigate}
              params={screenParams}
            />
          )}
          {activeTab === "profile" && (
            <ProfileScreen
              dashboard={dashboard}
              loading={loading}
              onNavigate={handleNavigate}
            />
          )}
        </View>
        <BottomTabs tabs={tabs} activeTab={activeTab} onChange={(tab) => handleNavigate(tab)} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  appRoot: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  screen: { flex: 1 },

  // Splash
  splashRoot: { flex: 1, backgroundColor: "#FFFFFF" },
  splashBg: { flex: 1 },
  splashContent: { flex: 1, alignItems: "center", justifyContent: "center" },
  logoRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#21D07A", // Subtle green ring as in your image
    ...shadows.soft,
  },
  splashLogo: { width: 110, height: 110, borderRadius: 55, resizeMode: "contain" },
});
