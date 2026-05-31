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

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function RegisterScreen({ navigation, onLoginSuccess }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+237 ");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showBloodPicker, setShowBloodPicker] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erreur", "Format d'email invalide.");
      return;
    }
    if (!phone.startsWith("+237") || phone.replace(/\s/g, "").length < 13) {
      Alert.alert("Erreur", "Le numéro doit être au format camerounais (+237 6XX XXX XXX).");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Erreur", "Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim(),
        dateOfBirth: dateOfBirth.trim() || null,
        bloodGroup: bloodGroup || null,
        role: "PATIENT",
      });
      await saveToken(res.token);
      // Instead of logging in immediately, navigate to OTP screen
      navigation.navigate("OtpVerification", {
        phone: phone.trim()
      });
    } catch (err) {
      Alert.alert("Erreur d'inscription", err.message || "Impossible de créer le compte.");
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

          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>
            Rejoignez MediCare+ et profitez de tous les services de santé
          </Text>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom complet *</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={20} color={colors.muted} />
              <TextInput
                style={styles.input}
                placeholder="Ex: Jean-Pierre Mbarga"
                placeholderTextColor={colors.muted}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Téléphone *</Text>
            <View style={styles.inputWrap}>
              <View style={styles.flagBox}>
                <Ionicons name="call-outline" size={18} color={colors.primary} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="+237 6XX XXX XXX"
                placeholderTextColor={colors.muted}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={(text) => {
                  if (!text.startsWith("+237")) {
                    setPhone("+237 ");
                  } else {
                    setPhone(text);
                  }
                }}
              />
            </View>
          </View>

          {/* Date of Birth */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date de naissance</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="calendar-outline" size={20} color={colors.muted} />
              <TextInput
                style={styles.input}
                placeholder="JJ/MM/AAAA"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                maxLength={10}
                value={dateOfBirth}
                onChangeText={(text) => {
                  // Supprime tout ce qui n'est pas un chiffre
                  let cleaned = text.replace(/\D/g, "");
                  // Ajoute les slashes automatiquement
                  let formatted = cleaned;
                  if (cleaned.length > 2) {
                    formatted = cleaned.slice(0, 2) + "/" + cleaned.slice(2);
                  }
                  if (cleaned.length > 4) {
                    formatted = formatted.slice(0, 5) + "/" + cleaned.slice(4, 8);
                  }
                  setDateOfBirth(formatted);
                }}
              />
            </View>
          </View>

          {/* Blood Group */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Groupe sanguin</Text>
            <Pressable
              style={styles.inputWrap}
              onPress={() => setShowBloodPicker(!showBloodPicker)}
            >
              <Ionicons name="water-outline" size={20} color={colors.muted} />
              <Text
                style={[
                  styles.input,
                  { paddingVertical: 0 },
                  !bloodGroup && { color: colors.muted },
                ]}
              >
                {bloodGroup || "Sélectionner"}
              </Text>
              <Ionicons name="chevron-down" size={18} color={colors.muted} />
            </Pressable>

            {showBloodPicker && (
              <View style={styles.pickerGrid}>
                {BLOOD_GROUPS.map((bg) => (
                  <Pressable
                    key={bg}
                    style={[
                      styles.pickerItem,
                      bloodGroup === bg && styles.pickerItemActive,
                    ]}
                    onPress={() => {
                      setBloodGroup(bg);
                      setShowBloodPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerText,
                        bloodGroup === bg && styles.pickerTextActive,
                      ]}
                    >
                      {bg}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe *</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.muted} />
              <TextInput
                style={styles.input}
                placeholder="Minimum 6 caractères"
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

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmer le mot de passe *</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.muted} />
              <TextInput
                style={styles.input}
                placeholder="Retapez le mot de passe"
                placeholderTextColor={colors.muted}
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          </View>

          {/* Register Button */}
          <Pressable
            style={({ pressed }) => [
              styles.registerBtn,
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
              loading && { opacity: 0.7 },
            ]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.registerBtnText}>Créer mon compte</Text>
            )}
          </Pressable>

          {/* Login link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Déjà un compte ? </Text>
            <Pressable onPress={() => navigation.replace("Login")}>
              <Text style={styles.loginLink}>Se connecter</Text>
            </Pressable>
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
    marginBottom: 20,
  },
  logoWrap: {
    alignSelf: "center",
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primaryPale,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    ...shadows.soft,
  },
  logo: { width: 44, height: 44, borderRadius: 14 },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.primaryDark,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  inputGroup: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
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
  flagBox: {
    width: 28,
    height: 20,
    backgroundColor: colors.primary + "15",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  pickerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 4,
  },
  pickerItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.primaryPale,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  pickerItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pickerText: { fontSize: 14, fontWeight: "700", color: colors.text },
  pickerTextActive: { color: "#FFF" },
  registerBtn: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    ...shadows.card,
  },
  registerBtnText: { color: "#FFF", fontSize: 17, fontWeight: "800" },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: { fontSize: 14, color: colors.muted },
  loginLink: { fontSize: 14, fontWeight: "800", color: colors.primary },
});
