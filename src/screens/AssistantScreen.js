import React, { useState, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
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
import * as ImagePicker from "expo-image-picker";
import { colors, shadows } from "../theme";
import { api } from "../services/api";

export default function AssistantScreen({ navigation }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Bonjour, je suis l'IA médicale de Medicare. Comment puis-je vous aider aujourd'hui ?", sender: "ai", time: "10:00" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), text: input.trim(), sender: "user", time: "Maintenant" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.askGroq(userMsg.text);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: response,
        sender: "ai",
        time: "Maintenant"
      }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Désolé, je rencontre des difficultés pour joindre le réseau neural Groq.",
        sender: "ai",
        time: "Maintenant"
      }]);
    } finally {
      setLoading(false);
    }
  };

  const simulatePhotoScan = async () => {
    Alert.alert(
      "Ajouter une image",
      "Voulez-vous prendre une photo ou choisir depuis la galerie ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Caméra", onPress: async () => {
            const res = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.5 });
            if (!res.canceled) processImage(res.assets[0].uri);
          }
        },
        {
          text: "Galerie", onPress: async () => {
            const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.5 });
            if (!res.canceled) processImage(res.assets[0].uri);
          }
        }
      ]
    );
  };

  const processImage = (uri) => {
    setMessages(prev => [...prev, { id: Date.now(), text: "📷 Image envoyée pour analyse...", sender: "user", time: "Maintenant" }]);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "D'après l'analyse visuelle, il semble y avoir une irritation cutanée légère. Veuillez consulter un généraliste pour obtenir une crème appropriée si cela persiste.",
        sender: "ai",
        time: "Maintenant"
      }]);
    }, 2500);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F8FBFF" }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.aiHeaderIcon}>
          <Ionicons name="sparkles" size={20} color="#FFF" />
        </View>
        <View>
          <Text style={styles.headerTitle}>Assistant IA</Text>
          <Text style={styles.headerSub}>Propulsé par Groq Llama</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.chatContainer}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(msg => (
          <View key={msg.id} style={msg.sender === "user" ? styles.bubbleUser : styles.bubbleAi}>
            <Text style={[styles.msgText, msg.sender === "ai" && { color: colors.text }]}>
              {msg.text}
            </Text>
            <Text style={styles.msgTime}>{msg.time}</Text>
          </View>
        ))}
        {loading && (
          <View style={[styles.bubbleAi, { width: 60 }]}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputArea}>
        <Pressable style={styles.attachBtn} onPress={simulatePhotoScan}>
          <Ionicons name="camera" size={24} color={colors.muted} />
        </Pressable>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Décrivez vos symptômes..."
            placeholderTextColor={colors.muted}
            value={input}
            onChangeText={setInput}
            multiline
          />
        </View>
        <Pressable
          style={[styles.sendBtn, !input.trim() && { backgroundColor: colors.muted }]}
          onPress={sendMessage}
          disabled={!input.trim() || loading}
        >
          <Ionicons name="send" size={18} color="#FFF" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 14, paddingTop: 52, paddingHorizontal: 20, paddingBottom: 20, backgroundColor: "#FFF", borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.05)" },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#F8FBFF", alignItems: "center", justifyContent: "center" },
  aiHeaderIcon: { width: 44, height: 44, borderRadius: 16, backgroundColor: "#8A5CFF", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: colors.text },
  headerSub: { fontSize: 12, color: colors.muted },

  chatContainer: { paddingHorizontal: 20, paddingBottom: 30, paddingTop: 20, gap: 16 },
  bubbleAi: { backgroundColor: "#FFF", borderRadius: 24, borderTopLeftRadius: 4, padding: 16, maxWidth: "80%", alignSelf: "flex-start", ...shadows.soft },
  bubbleUser: { backgroundColor: colors.primary, borderRadius: 24, borderTopRightRadius: 4, padding: 16, maxWidth: "80%", alignSelf: "flex-end", ...shadows.soft },
  msgText: { fontSize: 14, color: "#FFF", lineHeight: 22 },
  msgTime: { fontSize: 10, alignSelf: "flex-end", marginTop: 4, color: "rgba(255,255,255,0.6)" },

  inputArea: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#FFF", gap: 12, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.05)" },
  attachBtn: { padding: 8 },
  inputWrap: { flex: 1, backgroundColor: "#F8FBFF", borderRadius: 20, paddingHorizontal: 16, minHeight: 46, justifyContent: "center" },
  input: { fontSize: 14, color: colors.text, maxHeight: 100 },
  sendBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", marginLeft: 4, paddingLeft: 4 },
});
