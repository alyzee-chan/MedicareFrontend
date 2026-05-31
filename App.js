import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { colors } from "./src/theme";
import { getToken } from "./src/services/storage";
import { AppProvider } from "./src/context/AppContext";

// Screens
import SplashScreen from "./src/screens/SplashScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AppointmentsScreen from "./src/screens/AppointmentsScreen";
import MedicinesScreen from "./src/screens/MedicinesScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import SosScreen from "./src/screens/SosScreen";
import AssistantScreen from "./src/screens/AssistantScreen";
import BookingAppointmentScreen from "./src/screens/BookingAppointmentScreen";
import { MedicalRecordScreen, InsuranceScreen, BiometricsScreen, PaymentsScreen, SettingsScreen } from "./src/screens/MenuScreens";
import NearbyPharmaciesScreen from "./src/screens/NearbyPharmaciesScreen";
import PharmacyDetailScreen from "./src/screens/PharmacyDetailScreen";
import LoisirsCuratifsScreen from "./src/screens/LoisirsCuratifsScreen";

import WelcomeScreen from "./src/screens/auth/WelcomeScreen";
import LoginScreen from "./src/screens/auth/LoginScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";
import OtpVerificationScreen from "./src/screens/auth/OtpVerificationScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Auth Flow ───
function AuthStack({ onLoginSuccess }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {(props) => <RegisterScreen {...props} onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>
      <Stack.Screen name="OtpVerification">
        {(props) => <OtpVerificationScreen {...props} onVerifySuccess={onLoginSuccess} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
function MainTabNavigator({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "help-circle";
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Appointments") {
            iconName = focused ? "calendar-text" : "calendar-text-outline";
          } else if (route.name === "Medicines") {
            iconName = focused ? "medical-bag" : "pill";
          } else if (route.name === "Profile") {
            iconName = focused ? "account" : "account-outline";
          }
          return <MaterialCommunityIcons name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 70,
          paddingBottom: 15,
          borderTopWidth: 1,
          borderTopColor: "rgba(0,0,0,0.05)",
          backgroundColor: "#FFFFFF",
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: "Accueil" }} />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} options={{ tabBarLabel: "Ordonnances" }} />
      <Tab.Screen name="Medicines" component={MedicinesScreen} options={{ tabBarLabel: "Médicaments" }} />
      <Tab.Screen name="Profile">
        {(props) => (
          <ProfileScreen
            {...props}
            onLogout={onLogout}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// ... (AuthStack remains same)

// ─── Root App Box ───
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await getToken();
      setIsAuthenticated(!!token);
    } catch (e) {
      setIsAuthenticated(false);
    }
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (showSplash) {
    return (
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <SplashScreen onFinish={handleSplashFinish} />
      </SafeAreaProvider>
    );
  }

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <AppProvider>
      <SafeAreaProvider>
        <StatusBar style={isAuthenticated ? "dark" : "auto"} />
        <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom", "left", "right"]}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {isAuthenticated ? (
                // Connected Flow
                <>
                  <Stack.Screen name="MainTabs">
                    {(props) => <MainTabNavigator {...props} onLogout={() => setIsAuthenticated(false)} />}
                  </Stack.Screen>
                  <Stack.Screen name="SosFlow" component={SosScreen} options={{ presentation: "modal" }} />
                  <Stack.Screen name="NearbyPharmacies" component={NearbyPharmaciesScreen} />
                  <Stack.Screen name="PharmacyDetail" component={PharmacyDetailScreen} />
                  <Stack.Screen name="LoisirsCuratifs" component={LoisirsCuratifsScreen} />
                  <Stack.Screen name="Assistant" component={AssistantScreen} />
                  <Stack.Screen name="BookingAppointment" component={BookingAppointmentScreen} />
                  <Stack.Screen name="MedicalRecord" component={MedicalRecordScreen} />
                  <Stack.Screen name="Insurance" component={InsuranceScreen} />
                  <Stack.Screen name="Biometrics" component={BiometricsScreen} />
                  <Stack.Screen name="Payments" component={PaymentsScreen} />
                </>
              ) : (
                // Auth Flow
                <Stack.Screen name="AuthStack">
                  {(props) => <AuthStack {...props} onLoginSuccess={handleLoginSuccess} />}
                </Stack.Screen>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </AppProvider>
  );
}
