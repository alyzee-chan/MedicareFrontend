import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Modal,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { api } from "../services/api";
import { clearSession, getUser } from "../services/storage";
import { colors, shadows } from "../theme";
import { useAppContext } from "../context/AppContext";

const PremiumBackground = () => (
  <View style={StyleSheet.absoluteFill}>
    <View style={[StyleSheet.absoluteFill, { backgroundColor: "#F8FBFF" }]} />
    <View style={[styles.blob, { top: -50, right: -50, width: 250, height: 250, backgroundColor: "#E3EEFF", opacity: 0.6 }]} />
    <View style={[styles.blob, { bottom: 100, left: -80, width: 300, height: 300, backgroundColor: "#EAFFF4", opacity: 0.4 }]} />
  </View>
);

export default function ProfileScreen({ onLogout, navigation }) {
  const { t, isDarkMode, toggleTheme, language, toggleLanguage } = useAppContext();
  const [user, setUser] = useState(null);
  const [family, setFamily] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageUri, setImageUri] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: "", phone: "", dateOfBirth: "", bloodGroup: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const currentUser = await getUser();
      if (currentUser) {
        setUser(currentUser);
      }
      const data = await api.getMyFamilyProfiles();
      setFamily(data || []);
    } catch (err) {
      console.log("Erreur chargement profil", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Voulez-vous vraiment vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Déconnexion",
          style: "destructive",
          onPress: async () => {
            await clearSession();
            if (onLogout) onLogout();
          }
        }
      ]
    );
  };

  const handleOpenEdit = () => {
    setEditForm({
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      dateOfBirth: user?.dateOfBirth || "",
      bloodGroup: user?.bloodGroup || ""
    });
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updatedUser = await api.updateProfile(editForm);
      setUser(updatedUser);
      setIsEditing(false);
      Alert.alert("Succès", "Vos informations ont été mises à jour.");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de mettre à jour le profil.");
    } finally {
      setSaving(false);
    }
  };

  const profileItems = [
    { id: "health", title: t("health_record") || "Dossier Médical", icon: "clipboard-outline", color: colors.primary, route: "MedicalRecord" },
    { id: "insurance", title: t("insurance") || "Assurance Santé", icon: "shield-checkmark-outline", color: colors.accent, route: "Insurance" },
    { id: "biometrics", title: t("biometrics") || "Biométrie", icon: "pulse", color: colors.danger, route: "Biometrics" },
    { id: "payment", title: t("payment") || "Paiements", icon: "card-outline", color: colors.warning, route: "Payments" },
  ];

  if (loading && !user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <PremiumBackground isDarkMode={isDarkMode} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>MON PROFIL</Text>

        {/* Profile Card */}
        <View style={styles.card}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarWrap}>
              <Image
                source={{ uri: imageUri || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || "A")}&background=2F80ED&color=fff&size=128` }}
                style={styles.avatarImg}
              />
              <Pressable style={styles.editBadge} onPress={async () => {
                const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1] });
                if (!result.canceled) {
                  setImageUri(result.assets[0].uri);
                  Alert.alert("Succès", "Photo de profil mise à jour.");
                }
              }}>
                <Ionicons name="camera" size={12} color="#FFF" />
              </Pressable>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{user?.fullName || "Utilisateur"}</Text>
              <Text style={styles.userMeta}>Groupe {user?.bloodGroup || "O+"} · {user?.phone || (user?.role === "PATIENT" ? "Patient principal" : user?.role)}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Membre Premium</Text>
                </View>
                <Pressable style={styles.inlineEditBtn} onPress={handleOpenEdit}>
                  <Ionicons name="create-outline" size={14} color={colors.primary} />
                  <Text style={styles.inlineEditBtnText}>Modifier</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        {/* Family Section */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>{t("family")}</Text>
          <Pressable onPress={() => {
            const newMember = { id: Date.now(), name: "Léa", role: "Fille" };
            setFamily([...family, newMember]);
            Alert.alert("Succès", "Léa a été ajoutée à votre profil famille.");
          }}>
            <Text style={styles.sectionLink}>Ajouter</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 10 }}>
          {family.length > 0 ? (
            family.map((f, i) => (
              <View key={f.id || i} style={styles.familyCard}>
                <View style={[styles.familyAvatar, { backgroundColor: colors.primarySoft }]}>
                  <Text style={{ color: colors.primaryDark, fontWeight: "bold" }}>{f.name.charAt(0)}</Text>
                </View>
                <Text style={styles.familyName}>{f.name}</Text>
                <Text style={styles.familyRole}>{f.role}</Text>
              </View>
            ))
          ) : (
            <Text style={{ color: colors.muted, fontSize: 13, fontStyle: "italic" }}>Aucun membre ajouté pour le moment.</Text>
          )}
        </ScrollView>

        {/* Menu Items */}
        <View style={styles.menuBox}>
          {profileItems.map((item, i) => (
            <Pressable key={item.id} style={[styles.menuItem, i === profileItems.length - 1 && { borderBottomWidth: 0 }]} onPress={() => navigation.navigate(item.route)}>
              <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </Pressable>
          ))}

          <View style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: colors.primarySoft }]}>
              <Ionicons name="moon-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuText}>{t("dark_mode")}</Text>
            <Pressable onPress={toggleTheme}>
              <Ionicons name={isDarkMode ? "toggle" : "toggle-outline"} size={32} color={isDarkMode ? colors.success : colors.muted} />
            </Pressable>
          </View>

          <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={[styles.menuIcon, { backgroundColor: colors.primarySoft }]}>
              <Ionicons name="language-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuText}>{t("language_label")}</Text>
            <Pressable onPress={toggleLanguage} style={styles.langBadge}>
              <Text style={styles.langText}>{language.toUpperCase()}</Text>
            </Pressable>
          </View>
        </View>

        {/* Premium Banner */}
        <View style={styles.premiumCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.premiumTitle}>Passez à l'offre Family</Text>
            <Text style={styles.premiumSub}>Accès illimité pour 5 profils</Text>
          </View>
          <Pressable style={styles.premiumBtn} onPress={() => Alert.alert("Offre Family", "L'offre Family n'est pas encore implémentée.")}>
            <Text style={styles.premiumBtnText}>Découvrir</Text>
          </Pressable>
        </View>

        {/* Logout */}
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </Pressable>

        <Pressable
          style={[styles.logoutBtn, { marginTop: 10, borderTopWidth: 0, backgroundColor: "#FFF5F5" }]}
          onPress={async () => {
            const { removeToken } = require("../services/storage");
            await removeToken();
            Alert.alert("Session Réinitialisée", "Veuillez vous reconnecter.");
            onLogout();
          }}
        >
          <Ionicons name="refresh-circle-outline" size={24} color={colors.danger} />
          <Text style={[styles.logoutText, { color: colors.danger }]}>Réinitialiser la session (Debug)</Text>
        </Pressable>
      </ScrollView>

      {/* MODAL EDITION */}
      <Modal visible={isEditing} transparent animationType="slide" onRequestClose={() => setIsEditing(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier mon profil</Text>

            <Text style={styles.inputLabel}>Nom complet</Text>
            <TextInput style={styles.modalInput} value={editForm.fullName} onChangeText={(t) => setEditForm({ ...editForm, fullName: t })} />

            <Text style={styles.inputLabel}>Téléphone</Text>
            <TextInput style={styles.modalInput} value={editForm.phone} keyboardType="phone-pad" onChangeText={(t) => setEditForm({ ...editForm, phone: t })} />

            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Groupe Sanguin</Text>
                <TextInput style={styles.modalInput} value={editForm.bloodGroup} onChangeText={(t) => setEditForm({ ...editForm, bloodGroup: t })} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Date (JJ/MM/AAAA)</Text>
                <TextInput style={styles.modalInput} value={editForm.dateOfBirth} onChangeText={(t) => setEditForm({ ...editForm, dateOfBirth: t })} />
              </View>
            </View>

            <View style={styles.modalBtnRow}>
              <Pressable style={[styles.modalBtn, { backgroundColor: "#F1F5F9" }]} onPress={() => setIsEditing(false)}>
                <Text style={[styles.modalBtnText, { color: colors.muted }]}>Annuler</Text>
              </Pressable>
              <Pressable style={[styles.modalBtn, { backgroundColor: colors.primary }]} onPress={handleSaveProfile} disabled={saving}>
                {saving ? <ActivityIndicator color="#FFF" /> : <Text style={[styles.modalBtnText, { color: "#FFF" }]}>Enregistrer</Text>}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 52, paddingBottom: 40 },
  blob: { position: "absolute", borderRadius: 150 },

  kicker: { color: colors.primary, fontWeight: "800", fontSize: 12, letterSpacing: 1.5, marginBottom: 12 },

  card: { backgroundColor: "#FFF", borderRadius: 28, padding: 20, borderWidth: 1, borderColor: "rgba(0,0,0,0.03)", marginBottom: 24, ...shadows.soft },
  avatarRow: { flexDirection: "row", alignItems: "center", gap: 18 },
  avatarWrap: { position: "relative" },
  avatarImg: { width: 72, height: 72, borderRadius: 24 },
  editBadge: { position: "absolute", bottom: -4, right: -4, width: 24, height: 24, borderRadius: 12, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#FFF" },
  userName: { fontSize: 20, fontWeight: "800", color: colors.text },
  userMeta: { fontSize: 13, color: colors.muted, marginTop: 2 },
  tag: { backgroundColor: "#1C3D5A", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start", marginTop: 8 },
  tagText: { color: "#FFF", fontSize: 10, fontWeight: "800", textTransform: "uppercase" },

  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: colors.text },
  sectionLink: { fontSize: 13, fontWeight: "700", color: colors.primary },

  familyCard: { width: 90, backgroundColor: "#FFF", borderRadius: 20, padding: 14, alignItems: "center", ...shadows.soft, borderWidth: 1, borderColor: "rgba(0,0,0,0.03)" },
  familyAvatar: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  familyName: { fontSize: 12, fontWeight: "700", color: colors.text, textAlign: "center" },
  familyRole: { fontSize: 10, color: colors.muted, textAlign: "center", marginTop: 2 },

  menuBox: { backgroundColor: "#FFF", borderRadius: 24, paddingVertical: 8, marginTop: 12, borderWidth: 1, borderColor: "rgba(0,0,0,0.03)", ...shadows.soft },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  menuIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  menuText: { flex: 1, fontSize: 15, fontWeight: "700", color: colors.text },

  premiumCard: { flexDirection: "row", alignItems: "center", backgroundColor: colors.primary, borderRadius: 24, padding: 22, marginTop: 24, gap: 14, ...shadows.card },
  premiumTitle: { color: "#FFF", fontSize: 16, fontWeight: "800" },
  premiumSub: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2 },
  premiumBtn: { backgroundColor: "#FFF", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  premiumBtnText: { color: colors.primary, fontWeight: "800", fontSize: 13 },

  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 32, padding: 16, backgroundColor: "#FFF5F6", borderRadius: 18, alignSelf: "center", paddingHorizontal: 32 },
  logoutText: { color: colors.danger, fontWeight: "800", fontSize: 15 },

  inlineEditBtn: { flexDirection: "row", alignItems: "center", backgroundColor: colors.primarySoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, gap: 4 },
  inlineEditBtnText: { color: colors.primary, fontSize: 11, fontWeight: "800" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#FFF", borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, paddingBottom: 40, ...shadows.card },
  modalTitle: { fontSize: 20, fontWeight: "800", color: colors.text, marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: "700", color: colors.text, marginBottom: 6, marginTop: 12 },
  modalInput: { backgroundColor: "#F8FBFF", borderRadius: 14, padding: 16, fontSize: 15, color: colors.text, borderWidth: 1, borderColor: "rgba(0,0,0,0.05)" },
  modalBtnRow: { flexDirection: "row", gap: 12, marginTop: 30 },
  modalBtn: { flex: 1, paddingVertical: 18, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  modalBtnText: { fontSize: 15, fontWeight: "800" },
  langBadge: { backgroundColor: colors.primarySoft, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  langText: { color: colors.primary, fontWeight: "900", fontSize: 12 },
});
