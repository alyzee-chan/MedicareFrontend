import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    Pressable,
    Platform,
    Dimensions,
    SafeAreaView,
    Linking,
    Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, shadows } from "../theme";
import { useAppContext } from "../context/AppContext";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

const { width } = Dimensions.get("window");

export default function PharmacyDetailScreen({ route, navigation }) {
    const { t, isDarkMode } = useAppContext();
    const { pharmacy, userLocation } = route.params;
    const [activeTab, setActiveTab] = useState("Aperçu");
    const [showPath, setShowPath] = useState(false);

    const tabs = ["Aperçu", "Produits", "Avis", "Photos"];

    const handleItinerary = () => {
        setShowPath(true);
        Alert.alert(
            "Itinéraire trouvé",
            `La pharmacie ${pharmacy.name} est à environ ${pharmacy.distance}. Voulez-vous lancer le guidage GPS ?`,
            [
                { text: "Plus tard", style: "cancel" },
                {
                    text: "Lancer GPS",
                    onPress: () => {
                        const url = Platform.select({
                            ios: `maps:0,0?q=${pharmacy.name}@${pharmacy.lat},${pharmacy.lng}`,
                            android: `geo:0,0?q=${pharmacy.lat},${pharmacy.lng}(${pharmacy.name})`
                        });
                        Linking.openURL(url);
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.root, { backgroundColor: isDarkMode ? "#121212" : "#FFF" }]}>
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                {/* Header Title Bar */}
                <View style={styles.headerTitleContainer}>
                    <Pressable onPress={() => navigation.goBack()} style={[styles.topBack, { backgroundColor: isDarkMode ? "#333" : "#F1F5F9" }]}>
                        <Ionicons name="chevron-back" size={24} color={isDarkMode ? "#FFF" : "#111"} />
                    </Pressable>
                    <View style={styles.headerIcons}>
                        <Ionicons name="share-social-outline" size={22} color={isDarkMode ? "#FFF" : "#111"} style={styles.hIcon} />
                        <Pressable onPress={() => navigation.goBack()}>
                            <Ionicons name="close" size={24} color={isDarkMode ? "#FFF" : "#111"} style={styles.hIcon} />
                        </Pressable>
                    </View>
                </View>

                {/* Map Focus Section */}
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: Number(pharmacy.lat) || 4.0511,
                            longitude: Number(pharmacy.lng) || 9.7679,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        {pharmacy.lat && pharmacy.lng && (
                            <Marker
                                coordinate={{
                                    latitude: Number(pharmacy.lat),
                                    longitude: Number(pharmacy.lng)
                                }}
                                title={pharmacy.name}
                            >
                                <View style={styles.customMarker}>
                                    <Ionicons name="medical" size={16} color="#FFF" />
                                </View>
                            </Marker>
                        )}

                        {showPath && userLocation && (
                            <>
                                <Marker coordinate={userLocation}>
                                    <View style={styles.userDot} />
                                </Marker>
                                <Polyline
                                    coordinates={[userLocation, { latitude: pharmacy.lat, longitude: pharmacy.lng }]}
                                    strokeColor={colors.primary}
                                    strokeWidth={4}
                                    lineDashPattern={[5, 10]}
                                />
                            </>
                        )}
                    </MapView>
                </View>

                <View style={styles.mainHeader}>
                    <Text style={[styles.pharmName, { color: isDarkMode ? "#FFF" : "#111" }]}>{pharmacy.name}</Text>
                    <View style={styles.ratingRow}>
                        <Text style={styles.ratingText}>{pharmacy.rating}</Text>
                        <View style={styles.stars}>
                            {[1, 2, 3, 4, 5].map(s => (
                                <Ionicons key={s} name="star" size={14} color="#FFB547" />
                            ))}
                        </View>
                        <Text style={styles.reviewsText}>(12 avis)</Text>
                        <Text style={styles.dot}> • </Text>
                        <Ionicons name="navigate" size={16} color={colors.primary} />
                        <Text style={styles.timeText}> {pharmacy.distance}</Text>
                    </View>
                    <Text style={styles.categoryText}>Pharmacie • {pharmacy.city}</Text>
                    <Text style={styles.openText}>
                        <Text style={{ color: colors.success, fontWeight: "800" }}>{pharmacy.open}</Text>
                    </Text>
                </View>

                {/* Action Buttons */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsBox}>
                    <Pressable style={[styles.actionBtn, styles.actionBtnPrimary]} onPress={handleItinerary}>
                        <Ionicons name="navigate-circle" size={20} color="#FFF" />
                        <Text style={styles.actionBtnTextPrimary}>Itinéraire</Text>
                    </Pressable>
                    <Pressable style={[styles.actionBtn, { backgroundColor: isDarkMode ? "#222" : "#FFF", borderColor: isDarkMode ? "#333" : "#E0E0E0" }]} onPress={() => Linking.openURL(`tel:${pharmacy.phone || "691234567"}`)}>
                        <Ionicons name="call" size={18} color={colors.primary} />
                        <Text style={[styles.actionBtnText, { color: colors.primary }]}>Appeler</Text>
                    </Pressable>
                    <Pressable style={[styles.actionBtn, { backgroundColor: isDarkMode ? "#222" : "#FFF", borderColor: isDarkMode ? "#333" : "#E0E0E0" }]} onPress={() => navigation.navigate("Medicines", { pharmacyId: pharmacy.id })}>
                        <Ionicons name="cart" size={18} color={colors.primary} />
                        <Text style={[styles.actionBtnText, { color: colors.primary }]}>Commander</Text>
                    </Pressable>
                </ScrollView>

                {/* Tabs */}
                <View style={[styles.tabsBorder, { borderBottomColor: isDarkMode ? "#333" : "#EEE" }]}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
                        {tabs.map(t => (
                            <Pressable key={t} style={[styles.tab, activeTab === t && styles.tabActive]} onPress={() => setActiveTab(t)}>
                                <Text style={[styles.tabText, activeTab === t && styles.tabTextActive, { color: activeTab === t ? (isDarkMode ? "#FFF" : "#111") : "#888" }]}>{t}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                {/* Info List */}
                <View style={styles.infoSection}>
                    <View style={[styles.infoRow, { backgroundColor: isDarkMode ? "#1A1A1A" : "#F7F9FB" }]}>
                        <Ionicons name="location-outline" size={22} color={colors.primary} />
                        <View style={styles.infoLabels}>
                            <Text style={[styles.infoMainText, { color: isDarkMode ? "#EEE" : "#111" }]}>{pharmacy.city}, Cameroun</Text>
                            <Text style={styles.infoSubText}>{pharmacy.label}</Text>
                        </View>
                    </View>

                    <View style={[styles.infoRow, { backgroundColor: isDarkMode ? "#1A1A1A" : "#F7F9FB" }]}>
                        <Ionicons name="shield-checkmark-outline" size={22} color={colors.success} />
                        <View style={styles.infoLabels}>
                            <Text style={[styles.infoMainText, { color: isDarkMode ? "#EEE" : "#111" }]}>Pharmacie Agréée</Text>
                            <Text style={styles.infoSubText}>Vérifiée par le Ministère de la Santé</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    headerTitleContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 15, paddingTop: 10, paddingBottom: 10 },
    topBack: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    headerIcons: { flexDirection: "row", alignItems: "center", gap: 15 },
    hIcon: { padding: 5 },

    mapContainer: { height: 250, marginHorizontal: 20, borderRadius: 24, overflow: "hidden", ...shadows.card, marginBottom: 20 },
    map: { width: "100%", height: "100%" },
    customMarker: { backgroundColor: colors.danger, padding: 8, borderRadius: 20, borderWidth: 3, borderColor: "#FFF", ...shadows.soft },
    userDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.primary, borderWidth: 2, borderColor: "#FFF" },

    mainHeader: { paddingHorizontal: 20, paddingBottom: 20 },
    pharmName: { fontSize: 24, fontWeight: "900", letterSpacing: -0.5 },
    ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 5 },
    ratingText: { fontSize: 13, fontWeight: "600", color: "#666" },
    stars: { flexDirection: "row", gap: 1 },
    reviewsText: { fontSize: 13, color: "#666" },
    dot: { color: "#AAA" },
    timeText: { fontSize: 13, color: "#666" },
    categoryText: { fontSize: 14, color: "#666", marginTop: 4 },
    openText: { fontSize: 14, color: "#666", marginTop: 4 },

    actionsBox: { paddingHorizontal: 20, gap: 12, paddingBottom: 20 },
    actionBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25, borderWidth: 1 },
    actionBtnPrimary: { backgroundColor: colors.primary, borderColor: colors.primary },
    actionBtnTextPrimary: { color: "#FFF", fontWeight: "800", fontSize: 14 },
    actionBtnText: { fontWeight: "800", fontSize: 14 },

    tabsBorder: { borderBottomWidth: 1 },
    tabsContainer: { paddingHorizontal: 20, gap: 24 },
    tab: { paddingVertical: 15, borderBottomWidth: 3, borderBottomColor: "transparent" },
    tabActive: { borderBottomColor: colors.primary },
    tabText: { fontSize: 14, fontWeight: "800" },

    infoSection: { padding: 20, gap: 12 },
    infoRow: { flexDirection: "row", alignItems: "center", padding: 18, borderRadius: 20, gap: 15 },
    infoLabels: { flex: 1 },
    infoMainText: { fontSize: 15, fontWeight: "800" },
    infoSubText: { fontSize: 12, color: "#888", marginTop: 2 },
});
