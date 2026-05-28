// ─── MediCare+ API Service ───
// Remplacez par l'IP de votre PC si vous testez sur un appareil physique.
const BASE_URL = "http://10.139.160.94:8087/api";

// ─── Groq AI ───
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

async function request(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json", ...options.headers },
        ...options,
    });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
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
    // Dashboard
    getDashboard: () => request("/dashboard"),

    // Rendez-vous
    getAppointments: () => request("/appointments"),
    createAppointment: (data) =>
        request("/appointments", { method: "POST", body: JSON.stringify(data) }),

    // Médicaments
    searchMedicines: (query = "") =>
        request(`/medicines/search?query=${encodeURIComponent(query)}`),

    // Pharmacies
    getPharmacies: () => request("/pharmacies"),

    // Profils
    getProfiles: () => request("/profiles"),

    // Dossier médical
    getMedicalRecord: () => request("/medical-record"),

    // Commandes
    getOrders: () => request("/orders"),
    createOrder: (data) =>
        request("/orders", { method: "POST", body: JSON.stringify(data) }),

    // Assistant / Triage (backend)
    triage: (input = "") =>
        request(`/assistant/triage?input=${encodeURIComponent(input)}`),

    // SOS
    sendSos: (data) =>
        request("/sos/alerts", { method: "POST", body: JSON.stringify(data) }),

    // Health check
    health: () => request("/health"),

    // ─── Groq AI Assistant ───
    askGroq: (message) => askGroqAI(message),
};
