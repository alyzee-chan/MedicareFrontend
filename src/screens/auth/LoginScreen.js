import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../services/api";
import { saveToken, saveUser } from "../../services/storage";
import { colors, shadows } from "../../theme";

export default function LoginScreen({ navigation, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erreur", "Format d'email invalide.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.login(email.trim().toLowerCase(), password);
      await saveToken(res.token);
      await saveUser(res);
      if (onLoginSuccess) onLoginSuccess(res);
    } catch (err) {
      Alert.alert("Erreur de connexion", err.message || "Identifiants incorrects.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.primaryDark} />
          </Pressable>

          <View style={styles.logoWrap}>
            <Image
              source={require("../../../assets/images/logo.jpg")}
              style={styles.logo}
            />
          </View>

          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>
            Bienvenue ! Connectez-vous à votre compte MediCare+
          </Text>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={20} color={colors.muted} />
              <TextInput
                style={styles.input}
                placeholder="votreemail@exemple.cm"
                placeholderTextColor={colors.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.muted} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={colors.muted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.muted}
                />
              </Pressable>
            </View>
          </View>

          {/* Forgot */}
          <Pressable
            style={styles.forgotWrap}
            onPress={() =>
              Alert.alert(
                "🔒 Mot de passe oublié",
                "La récupération de mot de passe n'est pas encore implémentée."
              )
            }
          >
            <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
          </Pressable>

          {/* Login Button */}
          <Pressable
            style={({ pressed }) => [
              styles.loginBtn,
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
              loading && { opacity: 0.7 },
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.loginBtnText}>Se connecter</Text>
            )}
          </Pressable>

          {/* Register link */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Pas encore de compte ? </Text>
            <Pressable onPress={() => navigation.replace("Register")}>
              <Text style={styles.registerLink}>S'inscrire</Text>
            </Pressable>
          </View>

          {/* Demo hint */}
          <View style={styles.demoCard}>
            <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
            <Text style={styles.demoText}>
              Compte démo : demo@medicare.cm / Medicare2026!
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFF" },
  container: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 40,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primaryPale,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  logoWrap: {
    alignSelf: "center",
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.primaryPale,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    ...shadows.soft,
  },
  logo: { width: 50, height: 50, borderRadius: 16 },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.primaryDark,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  inputGroup: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryPale,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  forgotWrap: { alignSelf: "flex-end", marginBottom: 28 },
  forgotText: { fontSize: 13, fontWeight: "700", color: colors.primary },
  loginBtn: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 20,
    ...shadows.card,
  },
  loginBtnText: { color: "#FFF", fontSize: 17, fontWeight: "800" },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  registerText: { fontSize: 14, color: colors.muted },
  registerLink: { fontSize: 14, fontWeight: "800", color: colors.primary },
  demoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.primaryPale,
    borderRadius: 14,
    padding: 14,
    alignSelf: "center",
  },
  demoText: { fontSize: 12, color: colors.textSecondary, fontWeight: "600" },
});
