import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightColors, darkColors } from "../theme";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [language, setLanguage] = useState("fr"); // 'fr' or 'en'

    const colors = isDarkMode ? darkColors : lightColors;

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const theme = await AsyncStorage.getItem("theme");
            const lang = await AsyncStorage.getItem("language");
            if (theme) setIsDarkMode(theme === "dark");
            if (lang) setLanguage(lang);
        } catch (e) {
            console.error(e);
        }
    };

    const toggleTheme = async () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        await AsyncStorage.setItem("theme", newTheme ? "dark" : "light");
    };

    const toggleLanguage = async () => {
        const newLang = language === "fr" ? "en" : "fr";
        setLanguage(newLang);
        await AsyncStorage.setItem("language", newLang);
    };

    const t = (key) => {
        return i18n[language][key] || key;
    };

    return (
        <AppContext.Provider value={{ isDarkMode, toggleTheme, colors, language, toggleLanguage, t }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);

// Simple i18n dictionary
const i18n = {
    fr: {
        home_welcome: "Bienvenue sur Medicare +",
        home_greeting: "Bonjour !",
        search_placeholder: "Recherche médicaments...",
        quick_sos: "URGENCE SOS",
        quick_appointments: "Ordonnances",
        quick_medicines: "Médicaments",
        quick_games: "Loisirs",
        logout: "Se déconnecter",
        profile: "Profil",
        settings: "Paramètres",
        dark_mode: "Mode Sombre",
        language_label: "Langue",
        family: "Ma Famille",
    },
    en: {
        home_welcome: "Welcome to Medicare +",
        home_greeting: "Hello!",
        search_placeholder: "Search medicines...",
        quick_sos: "SOS EMERGENCY",
        quick_appointments: "Prescriptions",
        quick_medicines: "Medicines",
        quick_games: "Leisure",
        logout: "Log Out",
        profile: "Profile",
        settings: "Settings",
        dark_mode: "Dark Mode",
        language_label: "Language",
        family: "My Family",
    }
};
