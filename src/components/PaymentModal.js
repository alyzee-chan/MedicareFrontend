import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, shadows } from "../theme";

export function PaymentModal({ visible, onClose, amount, metadata, onSuccess }) {
  const [step, setStep] = useState(1); // 1 = method, 2 = phone input, 3 = loading, 4 = success
  const [method, setMethod] = useState(null); // 'momo' | 'om'
  const [phone, setPhone] = useState("");

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setStep(1);
      setMethod(null);
      setPhone("+237 6");
    }
  }, [visible]);

  const startPayment = () => {
    if (phone.length < 9) return;
    setStep(3);
    // Simulate USSD Push delay
    setTimeout(() => {
      setStep(4);
    }, 2500);
  };

  const finish = () => {
    onClose();
    if (onSuccess) onSuccess(method === "momo" ? "MTN MoMo" : "Orange Money");
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Pressable style={styles.closeBtn} onPress={onClose} disabled={step === 3}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>

          {step === 1 && (
            <>
              <Text style={styles.title}>Choisissez un mode de paiement</Text>
              <Text style={styles.amount}>Total : {amount}</Text>
              
              <Text style={styles.subText}>{metadata || "Commande de pharmacie"}</Text>

              <View style={styles.methodsGrid}>
                <Pressable
                  style={[styles.methodCard, method === "momo" && styles.methodActive]}
                  onPress={() => { setMethod("momo"); setStep(2); }}
                >
                  <View style={[styles.methodIcon, { backgroundColor: "#FFCC00" }]}>
                    <Text style={{ fontWeight: "900", color: "#000" }}>MTN</Text>
                  </View>
                  <Text style={styles.methodTitle}>MoMo</Text>
                </Pressable>

                <Pressable
                  style={[styles.methodCard, method === "om" && styles.methodActive]}
                  onPress={() => { setMethod("om"); setStep(2); }}
                >
                  <View style={[styles.methodIcon, { backgroundColor: "#FF6600" }]}>
                    <Text style={{ fontWeight: "900", color: "#FFF" }}>OM</Text>
                  </View>
                  <Text style={styles.methodTitle}>Orange</Text>
                </Pressable>
              </View>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.title}>Confirmez votre numéro</Text>
              <Text style={styles.amount}>{method === "momo" ? "MTN Mobile Money" : "Orange Money"}</Text>
              
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoFocus
              />

              <Pressable style={styles.btn} onPress={startPayment}>
                <Text style={styles.btnText}>Payer {amount}</Text>
              </Pressable>
              <Pressable style={styles.backBtn} onPress={() => setStep(1)}>
                <Text style={styles.backBtnText}>Changer de méthode</Text>
              </Pressable>
            </>
          )}

          {step === 3 && (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color={method === "momo" ? "#FFCC00" : "#FF6600"} />
              <Text style={styles.loadingTitle}>Validation en cours...</Text>
              <Text style={styles.loadingSub}>Veuillez confirmer le paiement sur votre téléphone. Ne quittez pas cette page.</Text>
            </View>
          )}

          {step === 4 && (
            <View style={styles.centerBox}>
              <View style={styles.successCircle}>
                <Ionicons name="checkmark" size={40} color="#FFF" />
              </View>
              <Text style={styles.title}>Paiement validé !</Text>
              <Text style={styles.subText}>Votre achat a bien été enregistré.</Text>
              
              <Pressable style={styles.btn} onPress={finish}>
                <Text style={styles.btnText}>Continuer</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: { backgroundColor: "#FFF", borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, paddingBottom: 40, ...shadows.card },
  closeBtn: { alignSelf: "flex-end", padding: 8, backgroundColor: "rgba(0,0,0,0.05)", borderRadius: 16, marginBottom: 12 },
  
  title: { fontSize: 20, fontWeight: "800", color: colors.text, marginBottom: 8, textAlign: "center" },
  amount: { fontSize: 24, fontWeight: "900", color: colors.primary, textAlign: "center", marginBottom: 6 },
  subText: { fontSize: 13, color: colors.muted, textAlign: "center", marginBottom: 24 },
  
  methodsGrid: { flexDirection: "row", gap: 14 },
  methodCard: { flex: 1, backgroundColor: "#F8FBFF", borderRadius: 20, padding: 20, alignItems: "center", borderWidth: 2, borderColor: "transparent", ...shadows.soft },
  methodActive: { borderColor: colors.primary, backgroundColor: "#EEF4FF" },
  methodIcon: { width: 50, height: 50, borderRadius: 16, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  methodTitle: { fontSize: 15, fontWeight: "800", color: colors.text },
  
  input: { backgroundColor: "#F8FBFF", borderRadius: 16, padding: 18, fontSize: 18, fontWeight: "700", textAlign: "center", borderWidth: 1, borderColor: "rgba(0,0,0,0.05)", marginBottom: 20 },
  btn: { backgroundColor: colors.primary, borderRadius: 18, paddingVertical: 18, alignItems: "center", marginTop: 10, ...shadows.soft },
  btnText: { color: "#FFF", fontWeight: "800", fontSize: 16 },
  backBtn: { paddingVertical: 18, alignItems: "center", marginTop: 4 },
  backBtnText: { color: colors.muted, fontWeight: "700", fontSize: 14 },

  centerBox: { alignItems: "center", paddingVertical: 20 },
  loadingTitle: { fontSize: 18, fontWeight: "800", color: colors.text, marginTop: 24, marginBottom: 8 },
  loadingSub: { fontSize: 14, color: colors.muted, textAlign: "center", paddingHorizontal: 20 },
  successCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#21D07A", alignItems: "center", justifyContent: "center", marginBottom: 20, ...shadows.soft },
});
