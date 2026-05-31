import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../services/api";
import { colors, shadows } from "../theme";

const MARKER_COLORS = ["#2F80ED", "#6ED3A3", "#FF4D5E", "#FFB547", "#8A5CFF"];

// Helper for real distance
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`;
};

export default function NearbyPharmaciesScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [locationText, setLocationText] = useState("");
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(true);

  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission refusée", "Accès à la localisation requis.");
        setLocationLoading(false);
        setLoading(false);
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setLocation(loc.coords);

        const addresses = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        if (addresses.length > 0) {
          const addr = addresses[0];
          setLocationText([addr.street, addr.district, addr.city].filter(Boolean).join(", "));
        }
      } catch (err) {
        console.log(err);
      }
      setLocationLoading(false);
    })();

    api.getPharmacies()
      .then((data) => {
        setPharmacies(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [location?.latitude]);

  const selectPharmacy = (p) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: p.lat,
        longitude: p.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  const openPharmacyDetail = (p) => {
    navigation.navigate("PharmacyDetail", { pharmacy: p, userLocation: location });
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={["#F8FBFF", "#FFF"]} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={colors.primaryDark} />
          </Pressable>
          <Text style={styles.headerTitle}>Pharmacies</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="location-sharp" size={20} color={colors.primary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Chercher une zone..."
              placeholderTextColor={colors.muted}
              value={locationText}
              onChangeText={setLocationText}
            />
            {locationLoading && <ActivityIndicator size="small" color={colors.primary} />}
          </View>
        </View>

        <View style={styles.mapCard}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: Number(location?.latitude) || 4.0511,
              longitude: Number(location?.longitude) || 9.7679,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            region={location ? {
              latitude: Number(location.latitude),
              longitude: Number(location.longitude),
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            } : null}
            showsUserLocation
          >
            {location && (
              <Marker coordinate={{ latitude: Number(location.latitude), longitude: Number(location.longitude) }}>
                <View style={styles.userMarker}>
                  <View style={styles.userMarkerPulse} />
                  <View style={styles.userMarkerCore}>
                    <Ionicons name="checkmark" size={14} color="#FFF" />
                  </View>
                </View>
              </Marker>
            )}

            {pharmacies.map((p, idx) => (
              p.lat && p.lng && (
                <Marker
                  key={p.id}
                  coordinate={{
                    latitude: Number(p.lat),
                    longitude: Number(p.lng),
                  }}
                  title={p.name}
                  description={p.label}
                >
                  <View style={[styles.pharmIcon, { backgroundColor: MARKER_COLORS[idx % MARKER_COLORS.length] }]}>
                    <Ionicons name="medical" size={12} color="#FFF" />
                  </View>
                </Marker>
              )
            ))}
          </MapView>

          <Pressable style={styles.gpsFab} onPress={async () => {
            setLocationLoading(true);
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            setLocation(loc.coords);
            setLocationLoading(false);
          }}>
            <Ionicons name="locate" size={24} color={colors.primary} />
          </Pressable>
        </View>

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>À proximité de vous</Text>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
          ) : (
            pharmacies.map((p, idx) => (
              <Pressable key={p.id} style={styles.card} onPress={() => openPharmacyDetail(p)}>
                <View style={[styles.cardIconBox, { backgroundColor: MARKER_COLORS[idx % MARKER_COLORS.length] + "15" }]}>
                  <Ionicons name="business" size={24} color={MARKER_COLORS[idx % MARKER_COLORS.length]} />
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{p.name}</Text>
                  <Text style={styles.cardLabel}>{p.label}</Text>

                  <View style={styles.cardMeta}>
                    <View style={styles.badge}>
                      <Ionicons name="star" size={12} color={colors.warning} />
                      <Text style={styles.badgeText}>{p.rating}</Text>
                    </View>
                    <View style={styles.badge}>
                      <Ionicons name="walk" size={12} color={colors.muted} />
                      <Text style={styles.badgeText}>
                        {location ? getDistance(location.latitude, location.longitude, p.lat, p.lng) : p.distance}
                      </Text>
                    </View>
                    <Text style={[styles.statusText, { color: p.open.includes("Fermé") ? colors.danger : colors.success }]}>
                      • {p.open}
                    </Text>
                  </View>
                </View>

                <View style={styles.goBtn}>
                  <Ionicons name="chevron-forward" size={20} color={colors.primary} />
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFF" },
  container: { paddingBottom: 40 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 52, paddingBottom: 15 },
  backBtn: { width: 44, height: 44, borderRadius: 15, backgroundColor: "#FFF", ...shadows.soft, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 20, fontWeight: "900", color: colors.primaryDark },

  searchContainer: { paddingHorizontal: 20, marginBottom: 20 },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", borderRadius: 18, paddingHorizontal: 16, paddingVertical: 14, ...shadows.card, gap: 12 },
  searchInput: { flex: 1, fontSize: 15, color: colors.text, fontWeight: "600" },

  mapCard: { marginHorizontal: 20, height: 260, borderRadius: 30, overflow: "hidden", ...shadows.card, marginBottom: 25 },
  map: { width: "100%", height: "100%" },
  gpsFab: { position: "absolute", bottom: 15, right: 15, width: 50, height: 50, borderRadius: 25, backgroundColor: "#FFF", ...shadows.card, alignItems: "center", justifyContent: "center" },

  userMarker: { alignItems: "center", justifyContent: "center" },
  userMarkerPulse: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(33, 208, 122, 0.15)", position: "absolute" },
  userMarkerCore: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#21D07A", borderWidth: 3, borderColor: "#FFF", alignItems: "center", justifyContent: "center", ...shadows.soft },

  pharmIcon: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#FFF" },

  listSection: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: colors.primaryDark, marginBottom: 15 },

  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", borderRadius: 24, padding: 16, marginBottom: 12, ...shadows.soft, borderWidth: 1, borderColor: "rgba(0,0,0,0.02)" },
  cardIconBox: { width: 56, height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  cardInfo: { flex: 1, marginLeft: 16 },
  cardName: { fontSize: 16, fontWeight: "800", color: colors.text, marginBottom: 2 },
  cardLabel: { fontSize: 11, color: colors.muted, fontWeight: "600", marginBottom: 6 },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 10 },
  badge: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8FAFC", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 },
  badgeText: { fontSize: 11, fontWeight: "800", color: colors.primaryDark },
  statusText: { fontSize: 11, fontWeight: "700" },
});
