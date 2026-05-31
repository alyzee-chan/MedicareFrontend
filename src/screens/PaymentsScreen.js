import React, { useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Animated,
    Dimensions,
    TextInput,
    Image,
    SafeAreaView,
    Alert,
    ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { colors, shadows } from "../theme";
import { useAppContext } from "../context/AppContext";

const { width, height } = Dimensions.get("window");

export default function PaymentsScreen({ navigation }) {
    const { isDarkMode, t } = useAppContext();
    const [selectedMethod, setSelectedMethod] = useState("card");
    const [isProcessing, setIsProcessing] = useState(false);

    const slideAnim = useRef(new Animated.Value(height)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const handlePay = () => {
        setIsProcessing(true);
        // Chic Animation Sequence
        Animated.parallel([
            Animated.timing(slideAnim, { toValue: 100, duration: 800, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true })
        ]).start();

        setTimeout(() => {
            setIsProcessing(false);
            Alert.alert(
                "Paiement Réussi",
                "Votre transaction a été traitée avec succès. Merci de votre confiance.",
                [{ text: "Super !", onPress: () => navigation.goBack() }]
            );
        }, 3000);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? "#000" : "#F8FBFF" }]}>
            <LinearGradient
                colors={isDarkMode ? ["#1A202C", "#000"] : ["#E3EEFF", "#F8FBFF"]}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={isDarkMode ? "#FFF" : colors.primaryDark} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: isDarkMode ? "#FFF" : colors.primaryDark }]}>Paiement Premium</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Total Amount Card */}
                <View style={styles.amountCard}>
                    <Text style={styles.amountLabel}>Total à payer</Text>
                    <Text style={styles.amountValue}>12,500 XAF</Text>
                    <View style={styles.orderTag}>
                        <Text style={styles.orderTagText}>Commande #MC-9928</Text>
                    </View>
                </View>

                <Text style={[styles.sectionTitle, { color: isDarkMode ? "#CCC" : "#1A202C" }]}>Méthode de paiement</Text>

                {/* Payment Options */}
                <View style={styles.methodGrid}>
                    {[
                        { id: "card", name: "Carte Bancaire", icon: "card", color: "#2F80ED" },
                        { id: "paypal", name: "PayPal", icon: "logo-paypal", color: "#003087" },
                        { id: "momo", name: "Mobile Money", icon: "phone-portrait", color: "#FFB547" }
                    ].map((m) => (
                        <Pressable
                            key={m.id}
                            style={[
                                styles.methodCard,
                                selectedMethod === m.id && { borderColor: m.color, borderWidth: 2, backgroundColor: `${m.color}08` },
                                { backgroundColor: isDarkMode ? "#1A1A1A" : "#FFF" }
                            ]}
                            onPress={() => setSelectedMethod(m.id)}
                        >
                            <View style={[styles.methodIcon, { backgroundColor: `${m.color}15` }]}>
                                <Ionicons name={m.icon} size={28} color={m.color} />
                            </View>
                            <Text style={[styles.methodName, { color: isDarkMode ? "#FFF" : "#111" }]}>{m.name}</Text>
                            {selectedMethod === m.id && (
                                <View style={[styles.checkCircle, { backgroundColor: m.color }]}>
                                    <Ionicons name="checkmark" size={14} color="#FFF" />
                                </View>
                            )}
                        </Pressable>
                    ))}
                </View>

                {/* Card Form Simulation */}
                {selectedMethod === "card" && (
                    <View style={[styles.formContainer, { backgroundColor: isDarkMode ? "#1A1A1A" : "#FFF" }]}>
                        <Text style={[styles.inputLabel, { color: isDarkMode ? "#AAA" : "#666" }]}>Numéro de carte</Text>
                        <View style={styles.inputWrap}>
                            <Ionicons name="card-outline" size={20} color={colors.muted} />
                            <TextInput
                                style={[styles.input, { color: isDarkMode ? "#FFF" : "#000" }]}
                                placeholder="**** **** **** 1234"
                                placeholderTextColor={colors.muted}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={{ flexDirection: "row", gap: 15 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.inputLabel, { color: isDarkMode ? "#AAA" : "#666" }]}>Expiration</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: isDarkMode ? "#222" : "#F8FBFF", color: isDarkMode ? "#FFF" : "#000" }]}
                                    placeholder="MM/YY"
                                    placeholderTextColor={colors.muted}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.inputLabel, { color: isDarkMode ? "#AAA" : "#666" }]}>CVV</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: isDarkMode ? "#222" : "#F8FBFF", color: isDarkMode ? "#FFF" : "#000" }]}
                                    placeholder="***"
                                    placeholderTextColor={colors.muted}
                                    secureTextEntry
                                />
                            </View>
                        </View>
                    </View>
                )}

                <Pressable
                    style={[styles.payBtn, { opacity: isProcessing ? 0.7 : 1 }]}
                    onPress={handlePay}
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <>
                            <Text style={styles.payBtnText}>Confirmer le Paiement</Text>
                            <Ionicons name="shield-checkmark" size={20} color="#FFF" />
                        </>
                    )}
                </Pressable>

                <Text style={styles.secureText}>
                    <Ionicons name="lock-closed" size={12} color={colors.muted} /> Paiement 256-bit SSL Sécurisé
                </Text>
            </ScrollView>

            {/* Chic Over Animation Overlay */}
            {isProcessing && (
                <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, { opacity: fadeAnim }]}>
                    <BlurView intensity={30} style={StyleSheet.absoluteFill} />
                    <Animated.View style={[styles.chicBox, { transform: [{ translateY: slideAnim }] }]}>
                        <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.chicGradient}>
                            <ActivityIndicator size="large" color="#FFF" />
                            <Text style={styles.processingText}>Traitement Sécurisé...</Text>
                            <Text style={styles.waitText}>Ne fermez pas l'application</Text>
                        </LinearGradient>
                    </Animated.View>
                </Animated.View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 20 },
    backBtn: { width: 44, height: 44, borderRadius: 15, backgroundColor: "rgba(255,255,255,0.8)", alignItems: "center", justifyContent: "center", ...shadows.soft },
    headerTitle: { fontSize: 18, fontWeight: "900" },
    scrollContent: { padding: 20, paddingBottom: 50 },

    amountCard: { backgroundColor: colors.primaryDark, borderRadius: 30, padding: 30, alignItems: "center", marginBottom: 30, ...shadows.card },
    amountLabel: { color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: "600", marginBottom: 8 },
    amountValue: { color: "#FFF", fontSize: 36, fontWeight: "900" },
    orderTag: { backgroundColor: "rgba(255,255,255,0.1)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginTop: 15 },
    orderTagText: { color: "#FFF", fontSize: 12, fontWeight: "700" },

    sectionTitle: { fontSize: 16, fontWeight: "800", marginBottom: 15, marginTop: 10 },

    methodGrid: { flexDirection: "row", gap: 12, marginBottom: 25 },
    methodCard: { flex: 1, padding: 15, borderRadius: 20, alignItems: "center", borderWidth: 2, borderColor: "transparent", position: "relative" },
    methodIcon: { width: 56, height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center", marginBottom: 10 },
    methodName: { fontSize: 12, fontWeight: "700", textAlign: "center" },
    checkCircle: { position: "absolute", top: 8, right: 8, width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },

    formContainer: { padding: 20, borderRadius: 24, marginBottom: 30, ...shadows.soft },
    inputLabel: { fontSize: 13, fontWeight: "700", marginBottom: 8 },
    inputWrap: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8FBFF", borderRadius: 14, paddingHorizontal: 15, marginBottom: 15 },
    input: { flex: 1, paddingVertical: 15, fontSize: 16, fontWeight: "600", paddingLeft: 10 },

    payBtn: { backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 20, borderRadius: 20, gap: 12, ...shadows.card },
    payBtnText: { color: "#FFF", fontSize: 18, fontWeight: "900" },
    secureText: { textAlign: "center", marginTop: 20, color: colors.muted, fontSize: 12, fontWeight: "600" },

    overlay: { justifyContent: "center", alignItems: "center", zIndex: 999 },
    chicBox: { width: width * 0.85, height: 220, borderRadius: 40, overflow: "hidden", ...shadows.card },
    chicGradient: { flex: 1, justifyContent: "center", alignItems: "center" },
    processingText: { color: "#FFF", fontSize: 20, fontWeight: "900", marginTop: 20 },
    waitText: { color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 5 },
});
