import React from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors, shadows } from "../../theme";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.root}>
      <ImageBackground
        source={require("../../../assets/images/LoadingPage.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        {/* Overlay gradient effect */}
        <View style={styles.overlay} />

        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoRing}>
            <Image
              source={require("../../../assets/images/logo.jpg")}
              style={styles.logo}
            />
          </View>

          <Text style={styles.title}>MediCare+</Text>
          <Text style={styles.subtitle}>Votre santé, simplifiée.</Text>
          <Text style={styles.description}>
            Prenez rendez-vous, consultez en vidéo, commandez vos médicaments et
            gérez la santé de toute votre famille en un seul endroit.
          </Text>

          {/* Buttons */}
          <View style={styles.buttonsWrap}>
            <Pressable
              style={({ pressed }) => [
                styles.btnPrimary,
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
              ]}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.btnPrimaryText}>Se connecter</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.btnSecondary,
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
              ]}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.btnSecondaryText}>Créer un compte</Text>
            </Pressable>
          </View>

          <Text style={styles.footer}>
            En continuant, vous acceptez nos{" "}
            <Text style={styles.link}>conditions d'utilisation</Text>
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bg: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.55)",
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingBottom: 50,
  },
  logoRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.accent,
    marginBottom: 20,
    ...shadows.card,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: "contain",
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: colors.primaryDark,
    letterSpacing: 1,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 14,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 36,
    paddingHorizontal: 10,
  },
  buttonsWrap: {
    width: "100%",
    gap: 14,
    marginBottom: 20,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    ...shadows.card,
  },
  btnPrimaryText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  btnSecondary: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  btnSecondaryText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  footer: {
    fontSize: 12,
    color: colors.muted,
    textAlign: "center",
    marginTop: 10,
  },
  link: {
    color: colors.primary,
    fontWeight: "600",
  },
});
