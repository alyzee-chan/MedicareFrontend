export const quickActions = [
  {
    id: "sos",
    title: "SOS urgence",
    subtitle: "Aide immediate",
    icon: "!",
    accent: "#21D07A",
  },
  {
    id: "search",
    title: "Recherche rapide",
    subtitle: "Nom, symptomes, photo",
    icon: "⌕",
    accent: "#3E78FF",
  },
  {
    id: "assistant",
    title: "Assistance medicale",
    subtitle: "Chatbot et tri",
    icon: "✦",
    accent: "#FF7A45",
  },
  {
    id: "family",
    title: "Profils famille",
    subtitle: "Enfant et senior",
    icon: "◔",
    accent: "#8A5CFF",
  },
];

export const upcomingAppointments = [
  {
    id: 1,
    name: "Dr. Jeanne EVOUNA",
    specialty: "Pediatre - Hopital de la Casse",
    date: "23 fevrier 2026",
    time: "10h00",
    status: "Confirme",
  },
  {
    id: 2,
    name: "Dr. Marc NGO",
    specialty: "Cardiologue - Teleconsultation",
    date: "24 fevrier 2026",
    time: "14h30",
    status: "En attente",
  },
];

export const medicines = [
  {
    id: 1,
    name: "OBH Combi",
    form: "75 ml",
    price: "XAF 5,750",
    stock: "En stock",
    alternative: "Gen. disponible",
  },
  {
    id: 2,
    name: "Bodetoline",
    form: "10 ml",
    price: "XAF 2,900",
    stock: "Stock faible",
    alternative: "Equivalent propose",
  },
  {
    id: 3,
    name: "Badrexin",
    form: "300 mg",
    price: "XAF 1,500",
    stock: "En stock",
    alternative: "Prix compare",
  },
];

export const pharmacies = [
  {
    id: 1,
    name: "Pharmacie du soleil",
    rating: 4.8,
    distance: "800 m",
    label: "Confiance",
    open: "Ouverte jusqu'a 22h",
  },
  {
    id: 2,
    name: "Pharmacie de la lune",
    rating: 4.7,
    distance: "1.2 km",
    label: "SOS+",
    open: "Garde de nuit",
  },
  {
    id: 3,
    name: "Pharmacie Mvogo Enyegue",
    rating: 4.9,
    distance: "2.0 km",
    label: "Stock fort",
    open: "Livraison active",
  },
];

export const profiles = [
  {
    id: 1,
    name: "Sophie",
    role: "Patient principal",
    tone: "#2F63FF",
  },
  {
    id: 2,
    name: "Ava",
    role: "Enfant",
    tone: "#1BC5BD",
  },
  {
    id: 3,
    name: "Maman",
    role: "Aidant",
    tone: "#FF7A45",
  },
  {
    id: 4,
    name: "Papa",
    role: "Senior",
    tone: "#8A5CFF",
  },
];

export const emergencySteps = [
  "Verifiez la conscience et la respiration.",
  "Mettez l'enfant en securite et degagez l'espace.",
  "Lancez l'appel secours et activez la geolocalisation.",
  "Si besoin, envoyez le SOS aux 3 pharmacies proches.",
];

export const searchModes = [
  "Par nom",
  "Par symptomes",
  "Par photo",
  "Par description",
];

export const dashboardStats = [
  { label: "RDV actifs", value: "08" },
  { label: "Ordonnances", value: "14" },
  { label: "Pharmacies", value: "32" },
  { label: "SOS traites", value: "03" },
];
