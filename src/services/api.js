import Constants from "expo-constants";

const getBaseUrl = () => {
    // Récupère l'IP du serveur Metro (l'ordinateur de dev) de manière dynamique
    const debuggerHost = Constants.expoConfig?.hostUri || "";
    const address = debuggerHost.split(":")[0] || "localhost";
    return `http://${address}:8087/api`;
};

const BASE_URL = getBaseUrl();

// ─── Groq AI ───
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

import { getToken } from "./storage";

async function request(path, options = {}) {
    const token = await getToken();
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
    });
    if (!res.ok) {
        const errorText = await res.text();
        let errorMsg = `HTTP ${res.status}`;
        try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.error) errorMsg = errorJson.error;
        } catch (_) { }
        throw new Error(errorMsg);
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
}

async function askGroqAI(userMessage) {
    const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content:
                        "Tu es un assistant médical MediCare+. Tu donnes des conseils de santé généraux en français. " +
                        "Tu ne fais JAMAIS de diagnostic. Tu recommandes toujours de consulter un médecin. " +
                        "Réponds de manière concise et bienveillante. Maximum 3-4 phrases.",
                },
                {
                    role: "user",
                    content: userMessage,
                },
            ],
            temperature: 0.7,
            max_tokens: 300,
        }),
    });

    if (!res.ok) {
        throw new Error(`Groq API error: ${res.status}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "Pas de réponse disponible.";
}

export const api = {
    // ─── Auth ───
    register: (data) =>
        request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
    login: (email, password) =>
        request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
    getMe: () => request("/auth/me"),

    // ─── User Profile ───
    updateProfile: (data) =>
        request("/user/profile", { method: "PUT", body: JSON.stringify(data) }),
    getMyFamilyProfiles: () => request("/user/profiles"),
    createFamilyProfile: (data) =>
        request("/user/profiles", { method: "POST", body: JSON.stringify(data) }),
    deleteFamilyProfile: (profileId) =>
        request(`/user/profiles/${profileId}`, { method: "DELETE" }),

    // ─── Dashboard ───
    getDashboard: () => request("/dashboard"),

    // ─── Rendez-vous ───
    getAppointments: () => request("/appointments"),
    createAppointment: (data) =>
        request("/appointments", { method: "POST", body: JSON.stringify(data) }),

    // ─── Médicaments ───
    searchMedicines: (query = "") =>
        request(`/medicines/search?query=${encodeURIComponent(query)}`),

    // ─── Pharmacies ───
    getPharmacies: () => request("/pharmacies"),

    // ─── Profils (legacy) ───
    getProfiles: () => request("/profiles"),

    // ─── Dossier médical ───
    getMedicalRecord: () => request("/medical-record"),

    // ─── Commandes ───
    getOrders: () => request("/orders"),
    createOrder: (data) =>
        request("/orders", { method: "POST", body: JSON.stringify(data) }),

    // ─── Assistant / Triage (backend) ───
    triage: (input = "") =>
        request(`/assistant/triage?input=${encodeURIComponent(input)}`),

    // ─── SOS ───
    sendSos: (data) =>
        request("/sos/alerts", { method: "POST", body: JSON.stringify(data) }),

    // ─── Health check ───
    health: () => request("/health"),

    // ─── Groq AI Assistant ───
    askGroq: (message) => askGroqAI(message),
};
