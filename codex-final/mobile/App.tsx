import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View
} from "react-native";
import { AiAdvice, Appointment, api, Doctor, DrugStock, Prescription } from "./src/api";

type TabKey = "home" | "rx" | "notifications" | "profile";

const today = new Date().toISOString().slice(0, 10);

const fallbackDoctors: Doctor[] = [
  { id: "doc-1", name: "Dr. Jeanne EVOUNA", specialty: "Pediatre", city: "Douala", nextSlot: "11h00", status: "Disponible", dutyDoctor: false },
  { id: "doc-2", name: "Dr. Mballa", specialty: "Cardiologue", city: "Douala", nextSlot: "10h00", status: "Urgence", dutyDoctor: true },
  { id: "doc-3", name: "Dr. Kamdem", specialty: "Generaliste", city: "Yaounde", nextSlot: "14h30", status: "Disponible", dutyDoctor: false }
];

const fallbackStocks: DrugStock[] = [
  { id: "stk-1", drug: "OBH Combi", pharmacyId: "pha-1", pharmacyName: "Pharmacie du soleil", city: "Douala", quantity: 42, price: 5750 },
  { id: "stk-2", drug: "Betadine", pharmacyId: "pha-2", pharmacyName: "Pharmacie de la lune", city: "Yaounde", quantity: 18, price: 2600 },
  { id: "stk-3", drug: "Bodrexin", pharmacyId: "pha-3", pharmacyName: "Pharmacie Mvog enyege", city: "Douala", quantity: 25, price: 1500 }
];

export default function App() {
  const { width } = useWindowDimensions();
  const isWide = width > 520;
  const [tab, setTab] = useState<TabKey>("home");
  const [apiOnline, setApiOnline] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>(fallbackDoctors);
  const [stocks, setStocks] = useState<DrugStock[]>(fallbackStocks);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedStock, setSelectedStock] = useState<DrugStock | null>(null);
  const [deliveryStep, setDeliveryStep] = useState(0);
  const [consultationLive, setConsultationLive] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<AiAdvice | null>(null);
  const [symptoms, setSymptoms] = useState("Fievre et toux depuis deux jours");
  const [search, setSearch] = useState("");
  const [phone, setPhone] = useState("+237 6XX XXX XXX");
  const [deliverable, setDeliverable] = useState("Les supports du projet seront generes ici.");
  const [appointmentForm, setAppointmentForm] = useState({
    patient: "Sophie",
    specialty: "Pediatre",
    city: "Douala",
    date: today,
    time: "11h00",
    reminder: "SMS + push"
  });
  const [rxForm, setRxForm] = useState({
    patient: "Sophie",
    doctor: "Dr. Jeanne EVOUNA",
    drug: "OBH Combi",
    dosage: "1 dose matin et soir",
    pharmacy: "Pharmacie du soleil",
    signature: "SIG-MED-2026"
  });

  const dutyDoctor = useMemo(() => doctors.find((doctor) => doctor.dutyDoctor) || doctors[0], [doctors]);
  const upcoming = appointments[0] || {
    id: "demo-rdv",
    patient: "Sophie",
    specialty: "Pediatre",
    city: "Douala",
    date: "23 fevrier 2026",
    time: "11h00",
    reminder: "SMS + push",
    status: "CONFIRME"
  };

  useEffect(() => {
    Promise.all([api.doctors(), api.stocks(), api.appointments(), api.prescriptions()])
      .then(([doctorData, stockData, appointmentData, prescriptionData]) => {
        setDoctors(doctorData.length ? doctorData : fallbackDoctors);
        setStocks(stockData.length ? stockData : fallbackStocks);
        setAppointments(appointmentData);
        setPrescriptions(prescriptionData);
        setApiOnline(true);
      })
      .catch(() => setApiOnline(false));
  }, []);

  async function withApi<T>(action: () => Promise<T>, fallback: () => T) {
    try {
      const result = await action();
      setApiOnline(true);
      return result;
    } catch {
      setApiOnline(false);
      return fallback();
    }
  }

  async function bookAppointment() {
    const created = await withApi(
      () => api.bookAppointment(appointmentForm),
      () => ({ ...appointmentForm, id: String(Date.now()), status: "CONFIRME" })
    );
    setAppointments((current) => [created, ...current]);
    Alert.alert("Rendez-vous confirme", "Le rappel SMS/push est programme.");
  }

  async function rescheduleAppointment() {
    if (!upcoming.id) return;
    const updated = await withApi(
      () => api.rescheduleAppointment(upcoming.id),
      () => {
        const current = appointments.find((item) => item.id === upcoming.id) || upcoming;
        return { ...current, time: "16h00", status: "RE_PLANIFIE" };
      }
    );
    setAppointments((current) => current.length ? current.map((item) => item.id === upcoming.id ? updated : item) : [updated]);
  }

  async function cancelAppointment() {
    if (!upcoming.id) return;
    const updated = await withApi(
      () => api.cancelAppointment(upcoming.id),
      () => {
        const current = appointments.find((item) => item.id === upcoming.id) || upcoming;
        return { ...current, status: "ANNULE" };
      }
    );
    setAppointments((current) => current.length ? current.map((item) => item.id === upcoming.id ? updated : item) : [updated]);
  }

  async function createPrescription() {
    const created = await withApi(
      () => api.createPrescription(rxForm),
      () => ({ ...rxForm, id: String(Date.now()), qrCode: `QR-${Date.now().toString().slice(-5)}` })
    );
    setPrescriptions((current) => [created, ...current]);
    Alert.alert("Ordonnance envoyee", "QR code, signature et transmission pharmacie effectues.");
  }

  async function payOrder() {
    if (!selectedStock) {
      Alert.alert("Commande", "Selectionnez un medicament avant de payer.");
      return;
    }
    await withApi(
      () => api.order({
        drug: selectedStock.drug,
        pharmacyName: selectedStock.pharmacyName,
        price: selectedStock.price,
        mobileMoneyPhone: phone
      }),
      () => ({ status: "PAIEMENT_VALIDE" })
    );
    setDeliveryStep(1);
    setTimeout(() => setDeliveryStep(2), 700);
    setTimeout(() => setDeliveryStep(3), 1400);
    Alert.alert("Paiement valide", "La livraison GPS est lancee.");
  }

  async function analyzeSymptoms() {
    const advice = await withApi(
      () => api.analyze(symptoms),
      () => ({
        symptoms,
        advice: symptoms.toLowerCase().includes("thoracique")
          ? "Activez le SOS ou contactez un medecin de garde."
          : "Prenez rendez-vous avec un generaliste pour clarifier les symptomes.",
        recommendedSpecialty: symptoms.toLowerCase().includes("thoracique") ? "Urgences / cardiologue" : "Generaliste",
        urgent: symptoms.toLowerCase().includes("thoracique")
      })
    );
    setAiAdvice(advice);
  }

  async function startConsultation() {
    await withApi(
      () => api.startConsultation({ patient: appointmentForm.patient, doctor: dutyDoctor.name }),
      () => ({ status: "SALLE_ATTENTE" })
    );
    setConsultationLive(true);
  }

  async function triggerSos() {
    await withApi(
      () => api.sos({ patient: appointmentForm.patient, latitude: 4.0524, longitude: 9.7066, contacts: ["Famille", "Ami", "Ambulance"] }),
      () => ({ status: "ALERTE_ACTIVE" })
    );
    Alert.alert("SOS urgence", "Position envoyee, contacts alertes et medecin de garde connecte.");
  }

  async function loadDeliverable(type: string) {
    const result = await withApi(
      () => api.deliverable(type),
      () => ({
        type,
        content: type === "uml"
          ? "Patient 1..* RendezVous; ConsultationVideo 0..1 Ordonnance; Pharmacie 1..* StockMedicament; Patient 0..* AlerteSOS."
          : "RDV -> Salle attente -> WebRTC -> Compte-rendu -> Ordonnance -> Pharmacie -> Livraison GPS."
      })
    );
    setDeliverable(result.content);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={[styles.phone, isWide && styles.phoneWide]}>
        <View style={styles.softCircleA} />
        <View style={styles.softCircleB} />
        <Header apiOnline={apiOnline} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {tab === "home" && (
            <HomeScreen
              search={search}
              setSearch={setSearch}
              appointmentForm={appointmentForm}
              setAppointmentForm={setAppointmentForm}
              upcoming={upcoming}
              stocks={stocks}
              triggerSos={triggerSos}
              bookAppointment={bookAppointment}
              rescheduleAppointment={rescheduleAppointment}
              cancelAppointment={cancelAppointment}
              setTab={setTab}
              setSelectedStock={setSelectedStock}
            />
          )}

          {tab === "rx" && (
            <PrescriptionScreen
              rxForm={rxForm}
              setRxForm={setRxForm}
              prescriptions={prescriptions}
              createPrescription={createPrescription}
            />
          )}

          {tab === "notifications" && (
            <CareScreen
              consultationLive={consultationLive}
              setConsultationLive={setConsultationLive}
              startConsultation={startConsultation}
              dutyDoctor={dutyDoctor}
              symptoms={symptoms}
              setSymptoms={setSymptoms}
              analyzeSymptoms={analyzeSymptoms}
              aiAdvice={aiAdvice}
              deliverable={deliverable}
              loadDeliverable={loadDeliverable}
            />
          )}

          {tab === "profile" && (
            <PharmacyScreen
              stocks={stocks}
              selectedStock={selectedStock}
              setSelectedStock={setSelectedStock}
              phone={phone}
              setPhone={setPhone}
              payOrder={payOrder}
              deliveryStep={deliveryStep}
            />
          )}
        </ScrollView>

        <BottomNav tab={tab} setTab={setTab} />
      </View>
    </SafeAreaView>
  );
}

function Header({ apiOnline }: { apiOnline: boolean }) {
  return (
    <View style={styles.header}>
      <Text style={styles.time}>09:41</Text>
      <View style={styles.signalGroup}>
        <Ionicons name="cellular" size={18} color="#17191f" />
        <Ionicons name="wifi" size={18} color="#17191f" />
        <Ionicons name="battery-full" size={20} color="#17191f" />
      </View>
      <View style={[styles.apiPill, apiOnline ? styles.apiOnline : styles.apiDemo]}>
        <Text style={styles.apiText}>{apiOnline ? "API" : "Demo"}</Text>
      </View>
    </View>
  );
}

function HomeScreen(props: {
  search: string;
  setSearch: (value: string) => void;
  appointmentForm: {
    patient: string;
    specialty: string;
    city: string;
    date: string;
    time: string;
    reminder: string;
  };
  setAppointmentForm: (value: {
    patient: string;
    specialty: string;
    city: string;
    date: string;
    time: string;
    reminder: string;
  }) => void;
  upcoming: Appointment;
  stocks: DrugStock[];
  triggerSos: () => void;
  bookAppointment: () => void;
  rescheduleAppointment: () => void;
  cancelAppointment: () => void;
  setTab: (tab: TabKey) => void;
  setSelectedStock: (stock: DrugStock) => void;
}) {
  return (
    <View>
      <View style={styles.welcomeRow}>
        <View style={styles.avatar}>
          <Ionicons name="medical" size={24} color="#2f80ed" />
        </View>
        <Text style={styles.welcome}>Bonjour, {props.appointmentForm.patient}</Text>
        <Ionicons name="notifications-outline" size={22} color="#2f80ed" />
      </View>

      <SearchBar value={props.search} onChangeText={props.setSearch} placeholder="Comment pouvons nous vous aider ?" />

      <View style={styles.quickGrid}>
        <QuickAction label="SOS urgence" color="#55d87a" icon="alert-circle" onPress={props.triggerSos} />
        <QuickAction label="Recherche rapide" color="#437fe8" icon="search" onPress={() => props.setTab("profile")} />
        <QuickAction label="Assistance medicale" color="#437fe8" icon="chatbubble-ellipses" onPress={() => props.setTab("notifications")} />
        <QuickAction label="Loisirs curatifs" color="#437fe8" icon="heart" onPress={() => Alert.alert("Conseil sante", "Respirez, hydratez-vous et suivez vos traitements.")} />
      </View>

      <View style={styles.banner}>
        <View style={styles.bannerText}>
          <Text style={styles.bannerTitle}>Commandez rapidement avec Ordonnance</Text>
          <Pressable style={styles.smallBlueButton} onPress={() => props.setTab("rx")}>
            <Text style={styles.smallBlueText}>Telecharger l'ordonnance</Text>
          </Pressable>
        </View>
        <View style={styles.pillsPack}>
          {[0, 1, 2, 3, 4, 5].map((item) => <View key={item} style={styles.pillDot} />)}
        </View>
      </View>

      <View style={styles.sectionLine}>
        <Text style={styles.sectionTitle}>Vos Rendez-vous a venir</Text>
        <Text style={styles.linkText}>Voir tout</Text>
      </View>
      <View style={styles.appointmentCard}>
        <View style={styles.doctorAvatar}>
          <Ionicons name="person" size={30} color="#fff" />
        </View>
        <View style={styles.appointmentInfo}>
          <Text style={styles.cardTitle}>Dr. Jeanne EVOUNA</Text>
          <Text style={styles.cardMuted}>Pediatre - Hopital de la caisse</Text>
          <Text style={styles.cardStrong}>{props.upcoming.date} - {props.upcoming.time}</Text>
        </View>
        <Ionicons name="chevron-forward-circle-outline" size={30} color="#87a7cf" />
      </View>
      <View style={styles.dualActions}>
        <Pressable style={styles.roundBlueButton} onPress={props.rescheduleAppointment}>
          <Text style={styles.roundBlueText}>Reprogrammer</Text>
        </Pressable>
        <Pressable style={styles.roundOutlineButton} onPress={props.cancelAppointment}>
          <Text style={styles.roundOutlineText}>Annuler</Text>
        </Pressable>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Prise de RDV rapide</Text>
        <View style={styles.twoInputs}>
          <SoftInput label="Specialite" value={props.appointmentForm.specialty} onChangeText={(specialty) => props.setAppointmentForm({ ...props.appointmentForm, specialty })} />
          <SoftInput label="Ville" value={props.appointmentForm.city} onChangeText={(city) => props.setAppointmentForm({ ...props.appointmentForm, city })} />
        </View>
        <View style={styles.twoInputs}>
          <SoftInput label="Date" value={props.appointmentForm.date} onChangeText={(date) => props.setAppointmentForm({ ...props.appointmentForm, date })} />
          <SoftInput label="Heure" value={props.appointmentForm.time} onChangeText={(time) => props.setAppointmentForm({ ...props.appointmentForm, time })} />
        </View>
        <Pressable style={styles.primaryButton} onPress={props.bookAppointment}>
          <Ionicons name="calendar" size={18} color="#fff" />
          <Text style={styles.primaryText}>Confirmer le RDV</Text>
        </Pressable>
      </View>

      <View style={styles.sectionLine}>
        <Text style={styles.sectionTitle}>Medicaments en vente</Text>
        <Text style={styles.linkText}>See all</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productRow}>
        {props.stocks.map((stock) => (
          <ProductCard key={stock.id} stock={stock} onPress={() => {
            props.setSelectedStock(stock);
            props.setTab("profile");
          }} />
        ))}
      </ScrollView>
    </View>
  );
}

function PrescriptionScreen(props: {
  rxForm: {
    patient: string;
    doctor: string;
    drug: string;
    dosage: string;
    pharmacy: string;
    signature: string;
  };
  setRxForm: (value: {
    patient: string;
    doctor: string;
    drug: string;
    dosage: string;
    pharmacy: string;
    signature: string;
  }) => void;
  prescriptions: Prescription[];
  createPrescription: () => void;
}) {
  return (
    <View>
      <ScreenTitle title="Ordonnances" subtitle="Signature electronique, QR code et transmission pharmacie" />
      <View style={styles.rxPreview}>
        <View>
          <Text style={styles.rxTitle}>MediCare+ RX</Text>
          <Text style={styles.cardMuted}>Ordonnance numerique securisee</Text>
        </View>
        <View style={styles.fakeQr}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((item) => <View key={item} style={item % 2 ? styles.qrLight : styles.qrDark} />)}
        </View>
      </View>
      <View style={styles.formCard}>
        <SoftInput label="Patient" value={props.rxForm.patient} onChangeText={(patient) => props.setRxForm({ ...props.rxForm, patient })} />
        <SoftInput label="Medecin" value={props.rxForm.doctor} onChangeText={(doctor) => props.setRxForm({ ...props.rxForm, doctor })} />
        <SoftInput label="Medicament" value={props.rxForm.drug} onChangeText={(drug) => props.setRxForm({ ...props.rxForm, drug })} />
        <SoftInput label="Posologie" value={props.rxForm.dosage} onChangeText={(dosage) => props.setRxForm({ ...props.rxForm, dosage })} />
        <SoftInput label="Pharmacie" value={props.rxForm.pharmacy} onChangeText={(pharmacy) => props.setRxForm({ ...props.rxForm, pharmacy })} />
        <Pressable style={styles.primaryButton} onPress={props.createPrescription}>
          <Ionicons name="qr-code" size={18} color="#fff" />
          <Text style={styles.primaryText}>Generer l'ordonnance</Text>
        </Pressable>
      </View>
      <Text style={styles.sectionTitle}>Historique prescriptions</Text>
      {props.prescriptions.length === 0 ? (
        <EmptyCard text="Aucune ordonnance generee pour le moment." />
      ) : props.prescriptions.map((rx) => (
        <View key={rx.id} style={styles.listCard}>
          <Ionicons name="document-text" size={28} color="#2f80ed" />
          <View style={styles.flex}>
            <Text style={styles.cardTitle}>{rx.drug}</Text>
            <Text style={styles.cardMuted}>{rx.patient} - {rx.qrCode}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function CareScreen(props: {
  consultationLive: boolean;
  setConsultationLive: (value: boolean) => void;
  startConsultation: () => void;
  dutyDoctor: Doctor;
  symptoms: string;
  setSymptoms: (value: string) => void;
  analyzeSymptoms: () => void;
  aiAdvice: AiAdvice | null;
  deliverable: string;
  loadDeliverable: (type: string) => void;
}) {
  return (
    <View>
      <ScreenTitle title="Health care" subtitle="Consultation video, assistant IA et supports jury" />
      <View style={[styles.videoPanel, props.consultationLive && styles.videoPanelLive]}>
        <Ionicons name={props.consultationLive ? "videocam" : "time-outline"} size={48} color="#fff" />
        <Text style={styles.videoTitle}>{props.consultationLive ? `En ligne avec ${props.dutyDoctor.name}` : "Salle d'attente virtuelle"}</Text>
        <Text style={styles.videoText}>{props.consultationLive ? "WebRTC chiffre actif, chat et documents disponibles." : "Le medecin de garde vous rejoint bientot."}</Text>
      </View>
      <Pressable style={styles.primaryButton} onPress={() => props.consultationLive ? props.setConsultationLive(false) : props.startConsultation()}>
        <Ionicons name={props.consultationLive ? "call" : "videocam"} size={18} color="#fff" />
        <Text style={styles.primaryText}>{props.consultationLive ? "Terminer la consultation" : "Demarrer la consultation"}</Text>
      </Pressable>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Assistant IA sante</Text>
        <SoftInput label="Symptomes" value={props.symptoms} onChangeText={props.setSymptoms} multiline />
        <View style={styles.chips}>
          {["Fievre", "Toux", "Douleur thoracique", "Fatigue"].map((chip) => (
            <Pressable key={chip} style={styles.chip} onPress={() => props.setSymptoms(`${props.symptoms}, ${chip}`)}>
              <Text style={styles.chipText}>{chip}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable style={styles.primaryButton} onPress={props.analyzeSymptoms}>
          <Ionicons name="sparkles" size={18} color="#fff" />
          <Text style={styles.primaryText}>Analyser</Text>
        </Pressable>
      </View>

      {props.aiAdvice && (
        <View style={[styles.adviceCard, props.aiAdvice.urgent && styles.adviceUrgent]}>
          <Text style={styles.cardTitle}>{props.aiAdvice.recommendedSpecialty}</Text>
          <Text style={styles.cardMuted}>{props.aiAdvice.advice}</Text>
        </View>
      )}

      <View style={styles.sectionLine}>
        <Text style={styles.sectionTitle}>Livrables jury</Text>
      </View>
      <View style={styles.dualActions}>
        <Pressable style={styles.roundBlueButton} onPress={() => props.loadDeliverable("uml")}>
          <Text style={styles.roundBlueText}>UML</Text>
        </Pressable>
        <Pressable style={styles.roundOutlineButton} onPress={() => props.loadDeliverable("sequence")}>
          <Text style={styles.roundOutlineText}>Sequence video</Text>
        </Pressable>
      </View>
      <View style={styles.noteCard}>
        <Text style={styles.cardMuted}>{props.deliverable}</Text>
      </View>
    </View>
  );
}

function PharmacyScreen(props: {
  stocks: DrugStock[];
  selectedStock: DrugStock | null;
  setSelectedStock: (stock: DrugStock) => void;
  phone: string;
  setPhone: (value: string) => void;
  payOrder: () => void;
  deliveryStep: number;
}) {
  return (
    <View>
      <View style={styles.pharmacyHeader}>
        <Ionicons name="chevron-back" size={24} color="#17191f" />
        <Text style={styles.pharmacyTitle}>Pharmacies proches</Text>
        <View style={styles.headerSpacer} />
      </View>
      <SearchBar value="" onChangeText={() => undefined} placeholder="Chercher une localisation..." />
      <View style={styles.mapPanel}>
        <View style={styles.mapCircle} />
        <View style={styles.mapMarker}>
          <Ionicons name="location" size={26} color="#fff" />
        </View>
        <Text style={styles.mapCenterText}>WESTERN EDITION</Text>
        <Text style={[styles.street, styles.streetA]}>Laguna St</Text>
        <Text style={[styles.street, styles.streetB]}>McAllister St</Text>
        <Text style={[styles.street, styles.streetC]}>Market St</Text>
        <View style={styles.deliveryBike}>
          <Ionicons name="bicycle" size={18} color="#2f80ed" />
        </View>
      </View>

      <View style={styles.pharmacySheet}>
        <Text style={styles.sectionTitle}>Pharmacies de Confiance</Text>
        {props.stocks.slice(0, 3).map((stock, index) => (
          <Pressable key={stock.id} style={styles.pharmacyRow} onPress={() => props.setSelectedStock(stock)}>
            <Ionicons name="location" size={28} color="#ea4f60" />
            <View style={styles.flex}>
              <Text style={styles.cardTitle}>{stock.pharmacyName}</Text>
              <Text style={styles.rating}>★ {(4.8 - index * 0.3).toFixed(1)}</Text>
              <Text style={styles.cardMuted}>a {index === 0 ? "800m" : `${index + 1},${index + 1}km`}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Commande Mobile Money</Text>
        <Text style={styles.cardMuted}>{props.selectedStock ? `${props.selectedStock.drug} - ${props.selectedStock.price.toLocaleString("fr-FR")} XAF` : "Selectionnez une pharmacie ou un medicament."}</Text>
        <SoftInput label="Telephone" value={props.phone} onChangeText={props.setPhone} />
        <Pressable style={styles.primaryButton} onPress={props.payOrder}>
          <Ionicons name="cash" size={18} color="#fff" />
          <Text style={styles.primaryText}>Confirmer la location</Text>
        </Pressable>
        <View style={styles.steps}>
          {["Commande", "Preparation", "Livreur", "Livree"].map((step, index) => (
            <Text key={step} style={[styles.step, index <= props.deliveryStep && styles.stepActive]}>{step}</Text>
          ))}
        </View>
      </View>
    </View>
  );
}

function BottomNav({ tab, setTab }: { tab: TabKey; setTab: (tab: TabKey) => void }) {
  return (
    <View style={styles.bottomNav}>
      <NavItem label="Accueil" icon="home" active={tab === "home"} onPress={() => setTab("home")} />
      <NavItem label="Ordonnances" icon="document-text-outline" active={tab === "rx"} onPress={() => setTab("rx")} />
      <NavItem label="Notification" icon="notifications-outline" active={tab === "notifications"} onPress={() => setTab("notifications")} />
      <NavItem label="Profil" icon="person-outline" active={tab === "profile"} onPress={() => setTab("profile")} />
    </View>
  );
}

function NavItem({ label, icon, active, onPress }: { label: string; icon: keyof typeof Ionicons.glyphMap; active: boolean; onPress: () => void }) {
  const iconName = (active ? String(icon).replace("-outline", "") : icon) as keyof typeof Ionicons.glyphMap;

  return (
    <Pressable style={styles.navItem} onPress={onPress}>
      <Ionicons name={iconName} size={24} color={active ? "#437fe8" : "#7d8291"} />
      <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
    </Pressable>
  );
}

function SearchBar({ value, onChangeText, placeholder }: { value: string; onChangeText: (value: string) => void; placeholder: string }) {
  return (
    <View style={styles.searchBar}>
      <Ionicons name="search" size={20} color="#9aa6b5" />
      <TextInput style={styles.searchInput} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#9aa6b5" />
      <Ionicons name="mic-outline" size={20} color="#21c2db" />
      <Ionicons name="camera" size={20} color="#21c2db" />
    </View>
  );
}

function QuickAction({ label, color, icon, onPress }: { label: string; color: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void }) {
  return (
    <Pressable style={styles.quickCard} onPress={onPress}>
      <Ionicons name={icon} size={28} color={color} />
      <Text style={[styles.quickText, { color }]}>{label}</Text>
    </Pressable>
  );
}

function ProductCard({ stock, onPress }: { stock: DrugStock; onPress: () => void }) {
  return (
    <View style={styles.productCard}>
      <View style={styles.productImage}>
        <Ionicons name="medkit" size={34} color="#2f80ed" />
      </View>
      <Text style={styles.productName}>{stock.drug}</Text>
      <Text style={styles.productSize}>{stock.quantity} unites</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>XAF {stock.price.toLocaleString("fr-FR")}</Text>
        <Pressable style={styles.addButton} onPress={onPress}>
          <Ionicons name="add" size={18} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

function SoftInput(props: { label: string; value: string; onChangeText: (value: string) => void; multiline?: boolean }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{props.label}</Text>
      <TextInput
        style={[styles.softInput, props.multiline && styles.textArea]}
        value={props.value}
        onChangeText={props.onChangeText}
        multiline={props.multiline}
        placeholderTextColor="#9aa6b5"
      />
    </View>
  );
}

function ScreenTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.screenTitleBlock}>
      <Text style={styles.screenTitle}>{title}</Text>
      <Text style={styles.screenSubtitle}>{subtitle}</Text>
    </View>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <View style={styles.noteCard}>
      <Text style={styles.cardMuted}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffdcae",
    alignItems: "center"
  },
  phone: {
    flex: 1,
    width: "100%",
    maxWidth: 430,
    backgroundColor: "#f8fdff",
    overflow: "hidden"
  },
  phoneWide: {
    marginVertical: 18,
    borderRadius: 28,
    maxHeight: 900
  },
  softCircleA: {
    position: "absolute",
    top: 70,
    right: -40,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "rgba(188, 226, 255, 0.45)"
  },
  softCircleB: {
    position: "absolute",
    bottom: 120,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(186, 246, 240, 0.35)"
  },
  header: {
    height: 52,
    paddingHorizontal: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(248, 253, 255, 0.75)"
  },
  time: {
    color: "#17191f",
    fontSize: 16,
    fontWeight: "700"
  },
  signalGroup: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center"
  },
  apiPill: {
    position: "absolute",
    right: 26,
    top: 44,
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  apiOnline: {
    backgroundColor: "#d7f8e5"
  },
  apiDemo: {
    backgroundColor: "#fff1d6"
  },
  apiText: {
    color: "#437fe8",
    fontSize: 10,
    fontWeight: "900"
  },
  content: {
    paddingHorizontal: 26,
    paddingTop: 18,
    paddingBottom: 112
  },
  welcomeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 26,
    marginTop: 48
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#77ef9d"
  },
  welcome: {
    flex: 1,
    color: "#20222c",
    fontSize: 18,
    fontWeight: "900"
  },
  searchBar: {
    minHeight: 48,
    borderRadius: 24,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d8e1ef",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#6d8fb8",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 2
  },
  searchInput: {
    flex: 1,
    color: "#20222c",
    fontWeight: "700"
  },
  quickGrid: {
    marginTop: 84,
    marginBottom: 34,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 42
  },
  quickCard: {
    width: "42%",
    aspectRatio: 1,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.82)",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#9bb3d2",
    shadowColor: "#47719e",
    shadowOpacity: 0.26,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5
  },
  quickText: {
    maxWidth: 105,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "900"
  },
  banner: {
    minHeight: 136,
    borderRadius: 8,
    backgroundColor: "#eef4ff",
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26
  },
  bannerText: {
    flex: 1,
    gap: 14
  },
  bannerTitle: {
    color: "#20222c",
    fontSize: 20,
    lineHeight: 27,
    fontWeight: "900"
  },
  smallBlueButton: {
    alignSelf: "flex-start",
    backgroundColor: "#437fe8",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  smallBlueText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900"
  },
  pillsPack: {
    width: 95,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "center",
    gap: 8,
    transform: [{ rotate: "-18deg" }]
  },
  pillDot: {
    width: 20,
    height: 12,
    borderRadius: 8,
    backgroundColor: "#d8c9a8",
    borderWidth: 2,
    borderColor: "#f6f0e3"
  },
  sectionLine: {
    marginTop: 8,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  sectionTitle: {
    color: "#20222c",
    fontSize: 20,
    fontWeight: "900"
  },
  linkText: {
    color: "#5e8dc9",
    fontSize: 13,
    fontWeight: "700"
  },
  appointmentCard: {
    minHeight: 104,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#edf1f7"
  },
  doctorAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#86c6d8",
    alignItems: "center",
    justifyContent: "center"
  },
  appointmentInfo: {
    flex: 1,
    gap: 3
  },
  cardTitle: {
    color: "#31323b",
    fontSize: 15,
    fontWeight: "900"
  },
  cardMuted: {
    color: "#8b93a5",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700"
  },
  cardStrong: {
    color: "#31323b",
    fontSize: 12,
    fontWeight: "900"
  },
  dualActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    marginBottom: 22
  },
  roundBlueButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#437fe8"
  },
  roundBlueText: {
    color: "#fff",
    fontWeight: "900"
  },
  roundOutlineButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#437fe8"
  },
  roundOutlineText: {
    color: "#437fe8",
    fontWeight: "900"
  },
  formCard: {
    gap: 12,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    padding: 15,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#ecf1f7"
  },
  formTitle: {
    color: "#20222c",
    fontSize: 17,
    fontWeight: "900"
  },
  twoInputs: {
    flexDirection: "row",
    gap: 10
  },
  inputGroup: {
    flex: 1,
    gap: 6
  },
  inputLabel: {
    color: "#687589",
    fontSize: 12,
    fontWeight: "900"
  },
  softInput: {
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: "#f8fbff",
    borderWidth: 1,
    borderColor: "#dfe8f4",
    paddingHorizontal: 12,
    color: "#20222c",
    fontWeight: "700"
  },
  textArea: {
    minHeight: 96,
    paddingTop: 12,
    textAlignVertical: "top"
  },
  primaryButton: {
    minHeight: 50,
    borderRadius: 24,
    backgroundColor: "#437fe8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  primaryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900"
  },
  productRow: {
    gap: 14,
    paddingBottom: 10
  },
  productCard: {
    width: 122,
    minHeight: 154,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#edf1f7"
  },
  productImage: {
    height: 64,
    borderRadius: 10,
    backgroundColor: "#f2f7ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8
  },
  productName: {
    color: "#31323b",
    fontSize: 12,
    fontWeight: "900"
  },
  productSize: {
    color: "#8b93a5",
    fontSize: 11,
    fontWeight: "700"
  },
  priceRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  price: {
    color: "#31323b",
    fontSize: 11,
    fontWeight: "900"
  },
  addButton: {
    width: 22,
    height: 22,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#437fe8"
  },
  screenTitleBlock: {
    marginTop: 28,
    marginBottom: 18
  },
  screenTitle: {
    color: "#20222c",
    fontSize: 26,
    fontWeight: "900"
  },
  screenSubtitle: {
    color: "#8b93a5",
    marginTop: 5,
    fontWeight: "700"
  },
  rxPreview: {
    borderRadius: 20,
    backgroundColor: "#eef4ff",
    padding: 18,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  rxTitle: {
    color: "#20222c",
    fontSize: 22,
    fontWeight: "900"
  },
  fakeQr: {
    width: 82,
    height: 82,
    borderRadius: 10,
    padding: 8,
    backgroundColor: "#fff",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  qrDark: {
    width: "33.33%",
    height: "33.33%",
    backgroundColor: "#1b2935"
  },
  qrLight: {
    width: "33.33%",
    height: "33.33%",
    backgroundColor: "#fff"
  },
  listCard: {
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 14,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#edf1f7"
  },
  flex: {
    flex: 1
  },
  videoPanel: {
    minHeight: 240,
    borderRadius: 24,
    backgroundColor: "#86c6d8",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    marginBottom: 14
  },
  videoPanelLive: {
    backgroundColor: "#437fe8"
  },
  videoTitle: {
    color: "#fff",
    marginTop: 12,
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center"
  },
  videoText: {
    color: "#edf7ff",
    marginTop: 8,
    textAlign: "center",
    fontWeight: "700"
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  chip: {
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#eef4ff"
  },
  chipText: {
    color: "#437fe8",
    fontWeight: "900"
  },
  adviceCard: {
    borderRadius: 18,
    backgroundColor: "#eafff2",
    padding: 16,
    marginBottom: 16
  },
  adviceUrgent: {
    backgroundColor: "#fff0f0"
  },
  noteCard: {
    borderRadius: 18,
    backgroundColor: "#fff",
    padding: 16,
    borderWidth: 1,
    borderColor: "#edf1f7"
  },
  pharmacyHeader: {
    marginTop: 28,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  pharmacyTitle: {
    color: "#20222c",
    fontSize: 20,
    fontWeight: "900"
  },
  headerSpacer: {
    width: 24
  },
  mapPanel: {
    height: 360,
    marginTop: 14,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#edf2f7"
  },
  mapCircle: {
    position: "absolute",
    left: 68,
    top: 86,
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 2,
    borderColor: "#8ab2de",
    backgroundColor: "rgba(67, 127, 232, 0.04)"
  },
  mapMarker: {
    position: "absolute",
    left: 152,
    top: 160,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#437fe8",
    alignItems: "center",
    justifyContent: "center"
  },
  mapCenterText: {
    position: "absolute",
    left: 128,
    top: 146,
    color: "#b2bac8",
    fontWeight: "900",
    letterSpacing: 1
  },
  street: {
    position: "absolute",
    color: "#a8b0bf",
    fontWeight: "800"
  },
  streetA: {
    top: 72,
    left: 45,
    transform: [{ rotate: "-55deg" }]
  },
  streetB: {
    top: 152,
    right: 34,
    transform: [{ rotate: "58deg" }]
  },
  streetC: {
    bottom: 54,
    left: 90,
    transform: [{ rotate: "-12deg" }]
  },
  deliveryBike: {
    position: "absolute",
    bottom: 46,
    left: 175,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#dce8f8"
  },
  pharmacySheet: {
    marginTop: -36,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: "#fff",
    padding: 18,
    borderWidth: 1,
    borderColor: "#edf1f7"
  },
  pharmacyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#edf1f7"
  },
  rating: {
    color: "#437fe8",
    fontWeight: "900"
  },
  steps: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6
  },
  step: {
    flexGrow: 1,
    minWidth: 74,
    borderRadius: 12,
    paddingVertical: 8,
    backgroundColor: "#edf2f7",
    color: "#8b93a5",
    textAlign: "center",
    fontSize: 11,
    fontWeight: "900"
  },
  stepActive: {
    backgroundColor: "#55d87a",
    color: "#fff"
  },
  bottomNav: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 18,
    minHeight: 68,
    borderRadius: 22,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#8aa0bd",
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    minWidth: 70
  },
  navText: {
    color: "#7d8291",
    fontSize: 10,
    fontWeight: "800"
  },
  navTextActive: {
    color: "#437fe8"
  }
});
