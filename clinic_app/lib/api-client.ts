// API Client for Clinical AI Agent Backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Types
export interface PatientQuery {
  patient_id: string;
  question: string;
}

export interface DoctorSearch {
  specialty?: string;
  available_day?: string;
}

export interface AppointmentRequest {
  patient_id: string;
  doctor_id: string;
  appointment_time: string;
  reason: string;
  appointment_type?: string;
}

export interface MedicationCheck {
  medication1: string;
  medication2: string;
}

export interface AgentAction {
  patient_id: string;
  action_type: string;
  details: Record<string, any>;
}

// API Client Class
export class ClinicalAgentAPI {
  static async healthCheck() {
    return fetch(`${API_BASE_URL}/health`).then((r) => r.json());
  }

  // Agent Query
  static async queryAgent(query: PatientQuery) {
    const response = await fetch(`${API_BASE_URL}/api/agent/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    });
    if (!response.ok) throw new Error("Agent query failed");
    return response.json();
  }

  // Patient Search
  static async searchPatients(patientId?: string, lastName?: string) {
    const params = new URLSearchParams();
    if (patientId) params.append("patient_id", patientId);
    if (lastName) params.append("last_name", lastName);

    const response = await fetch(
      `${API_BASE_URL}/api/patients/search?${params}`,
      { method: "POST" }
    );
    if (!response.ok) throw new Error("Patient search failed");
    return response.json();
  }

  // Patient History
  static async getPatientHistory(patientId: string) {
    const response = await fetch(
      `${API_BASE_URL}/api/patients/${patientId}/history`,
      { method: "POST" }
    );
    if (!response.ok) throw new Error("Failed to fetch patient history");
    return response.json();
  }

  // Doctor Search
  static async searchDoctors(search: DoctorSearch) {
    const response = await fetch(`${API_BASE_URL}/api/doctors/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(search),
    });
    if (!response.ok) throw new Error("Doctor search failed");
    return response.json();
  }

  // Schedule Appointment
  static async scheduleAppointment(appointment: AppointmentRequest) {
    const response = await fetch(`${API_BASE_URL}/api/appointments/schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointment),
    });
    if (!response.ok) throw new Error("Failed to schedule appointment");
    return response.json();
  }

  // Check Drug Interactions
  static async checkDrugInteractions(check: MedicationCheck) {
    const response = await fetch(
      `${API_BASE_URL}/api/medications/check-interactions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(check),
      }
    );
    if (!response.ok) throw new Error("Drug interaction check failed");
    return response.json();
  }

  // Log Agent Action
  static async logAgentAction(action: AgentAction) {
    const response = await fetch(`${API_BASE_URL}/api/agent/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action),
    });
    if (!response.ok) throw new Error("Failed to log action");
    return response.json();
  }

  // Get Agent Actions for Patient
  static async getAgentActions(patientId: string) {
    const response = await fetch(
      `${API_BASE_URL}/api/agent/actions/${patientId}`
    );
    if (!response.ok) throw new Error("Failed to fetch actions");
    return response.json();
  }

  // Get Dashboard Summary
  static async getDashboardSummary() {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/summary`);
    if (!response.ok) throw new Error("Failed to fetch dashboard summary");
    return response.json();
  }
}

export default ClinicalAgentAPI;
