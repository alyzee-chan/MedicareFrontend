import React, { useState, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, shadows } from "../../theme";

export default function OtpVerificationScreen({ navigation, route, onVerifySuccess }) {
  const [code, setCode] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  // Optional route prop from Registration screen
  const phone = route.params?.phone || "+237 6** *** ***";

  const handleInput = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const verifyOtp = () => {
    const fullCode = code.join("");
    if (fullCode.length < 4) return;

    setLoading(true);
    // Simulate API check
    setTimeout(() => {
      setLoading(false);
      if (onVerifySuccess) {
        onVerifySuccess();
      }
    }, 1500);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <View style={styles.container}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>

          <View style={styles.iconWrap}>
            <Ionicons name="shield-checkmark" size={40} color={colors.primary} />
          </View>

          <Text style={styles.title}>Vérification OTP</Text>
          <Text style={styles.subTitle}>Nous avons envoyé un code à 4 chiffres au numéro <Text style={{ color: colors.text, fontWeight: "700" }}>{phone}</Text></Text>

          <View style={styles.otpGrid}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                style={[styles.otpInput, digit && styles.otpInputActive]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleInput(text, index)}
                ref={(ref) => inputs.current[index] = ref}
              />
            ))}
          </View>

          <Text style={styles.resendText}>Vous n'avez pas reçu de code ? <Text style={styles.resendLink}>Renvoyer</Text></Text>

          <Pressable style={[styles.btn, code.join("").length < 4 && { opacity: 0.5 }]} onPress={verifyOtp} disabled={code.join("").length < 4 || loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Vérifier</Text>}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 28, paddingTop: 60 },
  backBtn: { width: 44, height: 44, borderRadius: 16, backgroundColor: "#F8FBFF", alignItems: "center", justifyContent: "center", marginBottom: 30 },

  iconWrap: { width: 80, height: 80, borderRadius: 24, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  title: { fontSize: 26, fontWeight: "800", color: colors.text, marginBottom: 8 },
  subTitle: { fontSize: 14, color: colors.muted, lineHeight: 22, paddingRight: 20, marginBottom: 40 },

  otpGrid: { flexDirection: "row", justifyContent: "center", gap: 14, marginBottom: 30 },
  otpInput: { width: 65, height: 65, backgroundColor: "#F8FBFF", borderRadius: 20, textAlign: "center", fontSize: 24, fontWeight: "800", color: colors.text, borderWidth: 1, borderColor: "rgba(0,0,0,0.05)" },
  otpInputActive: { borderColor: colors.primary, backgroundColor: "#EEF4FF" },

  resendText: { fontSize: 13, color: colors.muted, textAlign: "center", marginBottom: 20 },
  resendLink: { color: colors.primary, fontWeight: "700" },

  btn: { backgroundColor: colors.primary, borderRadius: 18, paddingVertical: 18, alignItems: "center", ...shadows.card },
  btnText: { color: "#FFF", fontWeight: "800", fontSize: 16 },
});
