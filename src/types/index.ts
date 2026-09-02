export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  branch: string;
  experience: number;
  opdTimings: string;
  photo: string;
  email: string;
  phone: string;
  about: string;
  rating: number;
  patientsCount: number;
  isAvailable: boolean;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodType: string;
  admissionStatus: "Admitted" | "Outpatient";
  branch: string;
  ward?: string;
  bedNumber?: string;
  age: number;
  gender: string;
  address: string;
  emergencyContact: string;
  assignedDoctorId?: string;
  symptoms?: string;
  medicalHistory?: string;
  allergies?: string;
  currentMedications?: string;
  vitals?: {
    bloodPressure?: string;
    heartRate?: number;
    oxygenLevel?: number;
    temperature?: number;
    respiratoryRate?: number;
  };
  aiPriority?: "Emergency" | "Urgent" | "Routine";
  aiDepartment?: string;
  aiSummary?: string;
  triageStatus?: "Pending" | "In Assessment" | "Awaiting Doctor" | "Admitted" | "Discharged";
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  timeSlot: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  type: string;
  notes?: string;
  createdAt: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  medicines: Medicine[];
  diagnosis: string;
  notes: string;
  date: string;
  validUntil: string;
}

export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  timing: string[];
  duration: string;
}

export interface VisitHistory {
  id: string;
  patientId: string;
  date: string;
  doctorId: string;
  diagnosis: string;
  symptoms: string[];
  notes: string;
}

export interface Bed {
  id: string;
  ward: string;
  bedNumber: string;
  status: "Available" | "Occupied" | "Maintenance";
  patientId?: string;
  branch: string;
}

export interface RosterEntry {
  id: string;
  doctorId: string;
  date: string;
  shift: "Morning" | "Evening" | "Night";
  startTime: string;
  endTime: string;
  type: "OPD" | "Surgery" | "Ward Round" | "Break";
  room?: string;
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  timestamp: string;
  read: boolean;
}

export type UserRole = "patient" | "doctor" | "receptionist";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  hospitalId?: string;
}
