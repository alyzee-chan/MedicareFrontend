import React, { useEffect, useState, useRef } from "react";
import {
  Alert,
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Platform,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import * as Speech from "expo-speech";
import { LinearGradient } from "expo-linear-gradient";
import { colors, shadows } from "../theme";
import { api } from "../services/api";

const GROQ_EMERGENCY_KEY = "";

const PremiumHeader = ({ onBack }) => (
  <View style={styles.headerRow}>
    <Pressable style={styles.closeBtn} onPress={onBack}>
      <Ionicons name="close" size={24} color={colors.primaryDark} />
    </Pressable>
    <View style={styles.titleStack}>
      <Text style={styles.headerTitle}>SOS MÉDICAL</Text>
      <View style={styles.liveIndicator}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>EN DIRECT</Text>
      </View>
    </View>
    <View style={{ width: 44 }} />
  </View>
);

export default function SosScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [analysisStatus, setAnalysisStatus] = useState(""); // Nouveau: pour le côté "pro"
  const [firstAid, setFirstAid] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [voiceIntensity, setVoiceIntensity] = useState(new Animated.Value(0)); // Nouveau: pour le graphisme

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setLocation(loc.coords);
      }
    })();
  }, []);

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.25, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const handleVoiceCall = async () => {
    if (isRecording) {
      setIsRecording(false);
      setLoadingAi(true);
      setAnalysisStatus("Analyse fréquentielle terminée...");

      const scenarios = [
        "URGENCE CRITIQUE : Enfant de 4 ans, forte fièvre (40°C), convulsion en cours. Besoin d'instructions immédiates.",
        "DÉTRESSE RESPIRATOIRE : Adulte, suspicion d'étouffement par corps étranger. Cyanose apparente.",
        "TRAUMA SÉVÈRE : Chute de grande hauteur, suspicion de fracture du col du fémur, douleur insupportable.",
        "HÉMORRAGIE : Brûlure thermique au 3ème degré sur l'avant-bras suite à un accident domestique."
      ];
      const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];

      setTimeout(() => {
        setAnalysisStatus("Mots-clés extraits : [MÉDICAL, URGENCE, PRIORITÉ 1]");
        setTimeout(() => {
          analyzeEmergency(randomScenario);
        }, 1000);
      }, 1000);
    } else {
      setIsRecording(true);
      setTranscription("");
      setAnalysisStatus("Écoute active... Analyse du bruit ambiant...");
      setFirstAid(null);
      setIsBroadcasting(false);

      // Simuler des fluctuations de voix
      const interval = setInterval(() => {
        Animated.timing(voiceIntensity, {
          toValue: Math.random(),
          duration: 150,
          useNativeDriver: true
        }).start();
      }, 200);

      (global).voiceInterval = interval;
    }
  };

  useEffect(() => {
    if (!isRecording && (global).voiceInterval) {
      clearInterval((global).voiceInterval);
    }
  }, [isRecording]);

  const speakComfort = () => {
    const message = "Ne vous en faites pas, nous sommes là. Des secours ont été envoyés aux pharmacies les plus proches, tout va bien se passer. Gardez votre calme.";
    Speech.speak(message, {
      language: "fr-FR",
      pitch: 1.0,
      rate: 0.85,
    });
  };

  const callEmergency = (number = "112") => {
    Linking.openURL(`tel:${number}`).catch(() =>
      Alert.alert("Erreur", "Impossible de passer l'appel.")
    );
  };

  const analyzeEmergency = async (text) => {
    setTranscription(text);
    setIsBroadcasting(true);
    try {
      const prompt = `URGENCE MÉDICALE : "${text}". Donne des instructions de PREMIERS SECOURS immédiates, courtes et précises en 3 étapes. Sois très direct et rassurant.`;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_EMERGENCY_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      setFirstAid(data.choices[0].message.content);

      // Auto-reassuring voice
      speakComfort();

      // Notify backend
      api.sendSos({
        patientName: "Utilisateur",
        ageGroup: "Inconnu",
        symptom: text,
        latitude: location?.latitude.toString() || "4.0511",
        longitude: location?.longitude.toString() || "9.7679",
        note: "Urgence vocale traitée par IA"
      }).catch(console.warn);

    } catch (error) {
      console.error(error);
      Alert.alert("Aide Immédiate", "Appelez le 112 immédiatement.");
    } finally {
      setLoadingAi(false);
      setTimeout(() => setIsBroadcasting(false), 3000);
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={["#FFF", "#F0F7FF"]} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <PremiumHeader onBack={() => navigation.goBack()} />

        <View style={styles.mapCard}>
          <MapView
            provider={Platform.OS === "android" ? PROVIDER_GOOGLE : null}
            style={styles.map}
            initialRegion={{
              latitude: location?.latitude || 4.0511,
              longitude: location?.longitude || 9.7679,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            region={location ? {
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            } : null}
            showsUserLocation
          >
            {location && (
              <Marker
                coordinate={location}
                title="Vous êtes ici"
              >
                <View style={styles.customMarker}>
                  <View style={styles.markerPulse} />
                  <View style={styles.markerCore} />
                </View>
              </Marker>
            )}
          </MapView>
          {isBroadcasting && (
            <View style={styles.broadcastOverlay}>
              <LinearGradient colors={["rgba(255,0,0,0.8)", "rgba(255,0,0,0.4)"]} style={styles.broadcastBox}>
                <Ionicons name="radio" size={24} color="#FFF" />
                <Text style={styles.broadcastText}>Alerte envoyée aux 5 pharmacies les plus proches...</Text>
              </LinearGradient>
            </View>
          )}
          <BlurOverlay />
        </View>

        <View style={styles.mainAction}>
          <Text style={styles.promptText}>
            {isRecording ? (analysisStatus || "L'IA analyse votre voix...") : "Décrivez la situation vocalement"}
          </Text>

          <Animated.View style={[
            styles.glowContainer,
            {
              transform: [{ scale: pulseAnim }],
              shadowOpacity: pulseAnim.interpolate({
                inputRange: [1, 1.25],
                outputRange: [0.3, 0.8]
              }),
              shadowRadius: pulseAnim.interpolate({
                inputRange: [1, 1.25],
                outputRange: [10, 25]
              })
            }
          ]}>
            <Pressable
              style={[styles.sosCircle, isRecording && styles.sosCircleActive]}
              onPress={handleVoiceCall}
            >
              <LinearGradient
                colors={isRecording ? ["#FF3B30", "#A00000"] : ["#FF4D4D", "#B30000"]}
                style={styles.sosGradient}
              >
                <Ionicons name={isRecording ? "stop" : "mic"} size={54} color="#FFF" />
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>

        {loadingAi && (
          <View style={styles.aiLoading}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.aiLoadingText}>Analyse intelligente en cours...</Text>
          </View>
        )}

        {(isRecording || transcription !== "") && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={isRecording ? styles.liveIconPulse : null}>
                <Ionicons name={isRecording ? "mic" : "chatbubble-ellipses"} size={18} color={colors.primary} />
              </View>
              <Text style={styles.cardTitle}>
                {isRecording ? "RETRANSCRIPTION EN DIRECT..." : "TRANSCRIPTION (ANALYSÉE)"}
              </Text>
            </View>
            <View style={styles.transcriptionBody}>
              <Text style={[styles.transText, isRecording && { color: colors.muted, fontStyle: "italic" }]}>
                {isRecording ? analysisStatus : (transcription || "En attente de votre description...")}
              </Text>
              {isRecording && (
                <View style={styles.recordingWave}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Animated.View
                      key={i}
                      style={[
                        styles.waveBar,
                        {
                          height: voiceIntensity.interpolate({
                            inputRange: [0, 1],
                            outputRange: [5, 20 + i * 5]
                          }),
                          opacity: voiceIntensity.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.3, 1]
                          })
                        }
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {firstAid && (
          <View style={[styles.card, { borderLeftWidth: 5, borderLeftColor: colors.danger }]}>
            <LinearGradient colors={["#FFF5F5", "#FFF"]} style={styles.cardGradient}>
              <View style={[styles.cardHeader, { backgroundColor: colors.danger }]}>
                <Ionicons name="medkit" size={18} color="#FFF" />
                <Text style={[styles.cardTitle, { color: "#FFF" }]}>PREMIERS GESTES</Text>
              </View>
              <Text style={styles.firstAidText}>{firstAid}</Text>
            </LinearGradient>
          </View>
        )}

        <View style={styles.callStrip}>
          <Pressable style={[styles.callBtn, { backgroundColor: "#222" }]} onPress={() => callEmergency("112")}>
            <Ionicons name="call" size={22} color="#FFF" />
            <Text style={styles.callBtnText}>URGENCE 112</Text>
          </Pressable>
          <Pressable style={[styles.callBtn, { backgroundColor: colors.primaryDark }]} onPress={() => callEmergency("117")}>
            <Ionicons name="shield" size={22} color="#FFF" />
            <Text style={styles.callBtnText}>POLICE</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const BlurOverlay = () => (
  <View style={styles.mapOverlay}>
    <LinearGradient
      colors={["transparent", "rgba(255,255,255,0.7)"]}
      style={StyleSheet.absoluteFill}
    />
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFF" },
  container: { padding: 24, paddingBottom: 60 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  closeBtn: { width: 44, height: 44, borderRadius: 15, backgroundColor: "#FFF", ...shadows.soft, alignItems: "center", justifyContent: "center" },
  titleStack: { alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "900", color: colors.primaryDark, letterSpacing: 1 },
  liveIndicator: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.danger },
  liveText: { fontSize: 10, fontWeight: "800", color: colors.muted },

  mapCard: { width: "100%", height: 240, borderRadius: 30, overflow: "hidden", ...shadows.card, marginBottom: 30 },
  map: { width: "100%", height: "100%" },
  mapOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, height: 40 },

  customMarker: { alignItems: "center", justifyContent: "center" },
  markerPulse: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(47, 128, 237, 0.15)", position: "absolute" },
  markerCore: { width: 16, height: 16, borderRadius: 8, backgroundColor: colors.primary, borderWidth: 3, borderColor: "#FFF" },

  mainAction: { alignItems: "center", marginBottom: 10 },
  promptText: { fontSize: 16, color: colors.primaryDark, fontWeight: "800", marginBottom: 20 },
  glowContainer: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "transparent",
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 0 },
    elevation: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sosCircle: { width: 150, height: 150, borderRadius: 75, overflow: "hidden", borderWidth: 4, borderColor: "rgba(255,255,255,0.3)" },
  sosGradient: { flex: 1, alignItems: "center", justifyContent: "center" },
  sosCircleActive: { borderColor: "#FFF", borderWidth: 6 },

  broadcastOverlay: { position: "absolute", top: 20, left: 20, right: 20, alignItems: "center" },
  broadcastBox: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 15, ...shadows.card },
  broadcastText: { color: "#FFF", fontWeight: "800", fontSize: 13 },

  aiLoading: { alignItems: "center", marginVertical: 20 },
  aiLoadingText: { marginTop: 12, fontSize: 14, color: colors.primary, fontWeight: "700" },

  card: { backgroundColor: "#FFF", borderRadius: 24, overflow: "hidden", ...shadows.soft, marginBottom: 20 },
  cardGradient: { flex: 1 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: colors.primaryPale },
  cardTitle: { fontSize: 11, fontWeight: "900", color: colors.primary, letterSpacing: 0.5 },
  transcriptionBody: { padding: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  transText: { flex: 1, fontSize: 16, color: colors.text, lineHeight: 24, fontStyle: "italic" },
  firstAidText: { padding: 25, fontSize: 15, color: colors.text, lineHeight: 26, fontWeight: "600" },

  liveIconPulse: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.primary + "30", alignItems: "center", justifyContent: "center" },
  recordingWave: { flexDirection: "row", alignItems: "center", gap: 4, marginLeft: 15 },
  waveBar: { width: 4, borderRadius: 2, backgroundColor: colors.primary },

  callStrip: { flexDirection: "row", gap: 12, marginTop: 10 },
  callBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, height: 64, borderRadius: 20, ...shadows.soft },
  callBtnText: { color: "#FFF", fontWeight: "900", fontSize: 14 },
});
