import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    ActivityIndicator,
    TextInput,
    Alert,
    Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors, shadows } from "../theme";
import { api } from "../services/api";
import { useAppContext } from "../context/AppContext";

export default function LoisirsCuratifsScreen({ navigation }) {
    const { isDarkMode, t: translate } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [game, setGame] = useState(null);
    const [answer, setAnswer] = useState("");
    const [showAnswer, setShowAnswer] = useState(false);
    const [mode, setMode] = useState("menu"); // menu, ai, breathing

    const breathAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (mode === "breathing") {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(breathAnim, { toValue: 1.5, duration: 4000, useNativeDriver: true }),
                    Animated.timing(breathAnim, { toValue: 1, duration: 4000, useNativeDriver: true }),
                ])
            ).start();
        } else {
            breathAnim.setValue(1);
        }
    }, [mode]);

    const fetchNewGame = async (type = "devinette") => {
        setLoading(true);
        setAnswer("");
        setShowAnswer(false);
        setMode("ai");
        try {
            const prompt = type === "devinette"
                ? "Génère une énigme médicale sophistiquée et mystérieuse en français. Elle doit être complexe, basée sur des paradoxes cliniques ou des mythes de santé insolites pour stimuler l'intelligence. Donne UNIQUEMENT l'énigme et la réponse séparées par |. Format: [Énigme complexe] | [Réponse scientifique]"
                : "Partage une découverte médicale révolutionnaire ou un fait historique insolite et méconnu pour fasciner un esprit curieux.";

            const text = await api.askGroq(prompt);

            if (type === "devinette" && text.includes("|")) {
                const parts = text.split("|");
                setGame({ type, question: parts[0].trim(), response: parts[1].trim() });
            } else {
                setGame({ type, text: text.trim() });
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Erreur", "Impossible de charger le jeu. Réessayez.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.root, { backgroundColor: isDarkMode ? "#121212" : "#FFF" }]}>
            <LinearGradient colors={isDarkMode ? ["#000", "#1A202C"] : ["#FFF", "#F5F9FF"]} style={StyleSheet.absoluteFill} />

            <View style={styles.header}>
                <Pressable style={styles.backBtn} onPress={() => mode === "menu" ? navigation.goBack() : setMode("menu")}>
                    <Ionicons name="chevron-back" size={24} color={colors.primaryDark} />
                </Pressable>
                <Text style={styles.headerTitle}>LOISIRS CURATIFS</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {mode === "menu" && (
                    <>
                        <Text style={styles.heroTitle}>Cultivez votre bien-être.</Text>
                        <Text style={styles.heroSub}>Des activités conçues pour apaiser l'esprit et le corps.</Text>

                        <View style={styles.menuGrid}>
                            <Pressable style={styles.menuCard} onPress={() => setMode("breathing")}>
                                <LinearGradient colors={["#6ED3A3", "#21D07A"]} style={styles.menuIconBox}>
                                    <Ionicons name="leaf" size={28} color="#FFF" />
                                </LinearGradient>
                                <Text style={styles.menuTitle}>Respiration</Text>
                                <Text style={styles.menuText}>4-7-8 Cohérence</Text>
                            </Pressable>

                            <Pressable style={styles.menuCard} onPress={() => fetchNewGame("devinette")}>
                                <LinearGradient colors={["#8A5CFF", "#6C38E0"]} style={styles.menuIconBox}>
                                    <Ionicons name="extension-puzzle" size={28} color="#FFF" />
                                </LinearGradient>
                                <Text style={styles.menuTitle}>Détente IA</Text>
                                <Text style={styles.menuText}>Jeux de mots</Text>
                            </Pressable>
                        </View>

                        <View style={styles.infoCard}>
                            <Ionicons name="sparkles" size={24} color={colors.primary} />
                            <Text style={styles.infoText}>Le saviez-vous ? Le stress ralentit la guérison. Souriez, vous allez mieux !</Text>
                        </View>
                    </>
                )}

                {mode === "breathing" && (
                    <View style={styles.breathingRoot}>
                        <Text style={styles.breathTitle}>Respirez profondément...</Text>
                        <Text style={styles.breathSub}>Inspirez par le nez, expirez par la bouche.</Text>

                        <Animated.View style={[styles.breathCircle, { transform: [{ scale: breathAnim }] }]}>
                            <LinearGradient colors={["#6ED3A3", "#2F80ED"]} style={styles.breathGradient}>
                                <Ionicons name="heart" size={40} color="#FFF" />
                            </LinearGradient>
                        </Animated.View>

                        <Pressable style={styles.stopBtn} onPress={() => setMode("menu")}>
                            <Text style={styles.stopBtnText}>ARRÊTER</Text>
                        </Pressable>
                    </View>
                )}

                {mode === "ai" && (
                    <View style={styles.aiRoot}>
                        {loading ? (
                            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 100 }} />
                        ) : (
                            <View style={styles.gameContainer}>
                                <View style={styles.tag}>
                                    <Text style={styles.tagText}>{game?.type === "devinette" ? "DEVINETTE" : "ANECDOTE"}</Text>
                                </View>

                                <Text style={styles.gameContent}>
                                    {game?.type === "devinette" ? game?.question : game?.text}
                                </Text>

                                {game?.type === "devinette" && (
                                    <View style={styles.aiActionBox}>
                                        <TextInput
                                            style={styles.aiInput}
                                            placeholder="Tapez votre réponse ici..."
                                            value={answer}
                                            onChangeText={setAnswer}
                                        />
                                        <Pressable style={styles.revealBtn} onPress={() => setShowAnswer(!showAnswer)}>
                                            <Text style={styles.revealText}>{showAnswer ? "Cacher" : "Vérifier la réponse"}</Text>
                                        </Pressable>

                                        {showAnswer && (
                                            <View style={styles.answerBox}>
                                                <Text style={styles.answerVal}>{game?.response}</Text>
                                            </View>
                                        )}
                                    </View>
                                )}

                                <Pressable style={styles.nextBtn} onPress={() => fetchNewGame(game?.type)}>
                                    <Text style={styles.nextText}>ENCORE UN AUTRE !</Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#FFF" },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 52, paddingBottom: 15, backgroundColor: "#FFF" },
    backBtn: { width: 44, height: 44, borderRadius: 15, backgroundColor: "#FFF", ...shadows.soft, alignItems: "center", justifyContent: "center" },
    headerTitle: { fontSize: 16, fontWeight: "900", color: colors.primaryDark, letterSpacing: 1 },
    container: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },

    heroTitle: { fontSize: 28, fontWeight: "900", color: colors.primaryDark, marginBottom: 8 },
    heroSub: { fontSize: 15, color: colors.muted, lineHeight: 22, marginBottom: 30 },

    menuGrid: { flexDirection: "row", gap: 15, marginBottom: 30 },
    menuCard: { flex: 1, backgroundColor: "#FFF", borderRadius: 30, padding: 20, ...shadows.card, alignItems: "center" },
    menuIconBox: { width: 64, height: 64, borderRadius: 22, alignItems: "center", justifyContent: "center", marginBottom: 15 },
    menuTitle: { fontSize: 16, fontWeight: "800", color: colors.text, marginBottom: 4 },
    menuText: { fontSize: 11, color: colors.muted, fontWeight: "600" },

    infoCard: { flexDirection: "row", alignItems: "center", gap: 15, backgroundColor: colors.primaryPale, borderRadius: 24, padding: 20, borderLeftWidth: 5, borderLeftColor: colors.primary },
    infoText: { flex: 1, fontSize: 13, color: colors.primaryDark, fontWeight: "600", lineHeight: 20 },

    breathingRoot: { alignItems: "center", paddingTop: 40 },
    breathTitle: { fontSize: 24, fontWeight: "800", color: colors.primaryDark, marginBottom: 10 },
    breathSub: { fontSize: 16, color: colors.muted, marginBottom: 60 },
    breathCircle: { width: 200, height: 200, borderRadius: 100, ...shadows.card },
    breathGradient: { flex: 1, borderRadius: 100, alignItems: "center", justifyContent: "center" },
    stopBtn: { marginTop: 80, backgroundColor: "#FFF", paddingHorizontal: 30, paddingVertical: 15, borderRadius: 20, ...shadows.soft },
    stopBtnText: { fontWeight: "900", color: colors.danger, letterSpacing: 1 },

    aiRoot: { paddingTop: 20 },
    gameContainer: { backgroundColor: "#FFF", borderRadius: 35, padding: 30, ...shadows.card },
    tag: { alignSelf: "flex-start", backgroundColor: colors.primarySoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginBottom: 20 },
    tagText: { fontSize: 10, fontWeight: "900", color: colors.primary },
    gameContent: { fontSize: 20, fontWeight: "700", color: colors.text, lineHeight: 30, marginBottom: 30 },
    aiActionBox: { borderTopWidth: 1, borderTopColor: "#F1F5F9", paddingTop: 25 },
    aiInput: { backgroundColor: "#F8FAFC", borderRadius: 18, padding: 18, fontSize: 16, marginBottom: 15 },
    revealBtn: { alignItems: "center", padding: 10 },
    revealText: { color: colors.primary, fontWeight: "800", fontSize: 14 },
    answerBox: { backgroundColor: "#F0FDF4", padding: 20, borderRadius: 20, marginTop: 15, borderLeftWidth: 4, borderLeftColor: colors.success },
    answerVal: { fontSize: 18, fontWeight: "800", color: colors.success, textAlign: "center" },
    nextBtn: { backgroundColor: colors.primaryDark, paddingVertical: 18, borderRadius: 20, marginTop: 30, alignItems: "center" },
    nextText: { color: "#FFF", fontWeight: "900", fontSize: 14, letterSpacing: 1 },
});
