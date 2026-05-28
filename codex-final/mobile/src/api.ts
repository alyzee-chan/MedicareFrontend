export const API_BASE = "http://localhost:8080/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${await response.text()}`);
  }

  return response.json() as Promise<T>;
}

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  city: string;
  nextSlot: string;
  status: string;
  dutyDoctor: boolean;
};

export type Appointment = {
  id: string;
  patient: string;
  specialty: string;
  city: string;
  date: string;
  time: string;
  reminder: string;
  status: string;
};

export type DrugStock = {
  id: string;
  drug: string;
  pharmacyId: string;
  pharmacyName: string;
  city: string;
  quantity: number;
  price: number;
};

export type Prescription = {
  id: string;
  patient: string;
  doctor: string;
  drug: string;
  dosage: string;
  pharmacy: string;
  signature: string;
  qrCode: string;
};

export type AiAdvice = {
  symptoms: string;
  advice: string;
  recommendedSpecialty: string;
  urgent: boolean;
};

export const api = {
  doctors: () => request<Doctor[]>("/doctors"),
  appointments: () => request<Appointment[]>("/appointments"),
  bookAppointment: (payload: Omit<Appointment, "id" | "status">) =>
    request<Appointment>("/appointments", { method: "POST", body: JSON.stringify(payload) }),
  cancelAppointment: (id: string) => request<Appointment>(`/appointments/${id}/cancel`, { method: "PATCH" }),
  rescheduleAppointment: (id: string) => request<Appointment>(`/appointments/${id}/reschedule?time=16:00`, { method: "PATCH" }),
  startConsultation: (payload: { patient: string; doctor: string }) =>
    request("/consultations", { method: "POST", body: JSON.stringify(payload) }),
  createPrescription: (payload: Omit<Prescription, "id" | "qrCode">) =>
    request<Prescription>("/prescriptions", { method: "POST", body: JSON.stringify(payload) }),
  prescriptions: () => request<Prescription[]>("/prescriptions"),
  stocks: (query = "") => request<DrugStock[]>(`/stocks${query ? `?query=${encodeURIComponent(query)}` : ""}`),
  order: (payload: { drug: string; pharmacyName: string; price: number; mobileMoneyPhone: string }) =>
    request("/orders", { method: "POST", body: JSON.stringify(payload) }),
  analyze: (symptoms: string) =>
    request<AiAdvice>("/assistant/analyze", { method: "POST", body: JSON.stringify({ symptoms }) }),
  sos: (payload: { patient: string; latitude: number; longitude: number; contacts: string[] }) =>
    request("/sos", { method: "POST", body: JSON.stringify(payload) }),
  deliverable: (type: string) => request<{ type: string; content: string }>(`/deliverables/${type}`)
};
