import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import {
  Doctor, Patient, Appointment, Prescription,
  VisitHistory, Bed, RosterEntry, Notification, User
} from "@/types";
import * as mockData from "./mockData";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile<T>(filename: string, defaultData: T[]): T[] {
  ensureDataDir();
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(filepath, "utf-8"));
}

function writeJsonFile<T>(filename: string, data: T[]) {
  ensureDataDir();
  const filepath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

// Doctors
export function getDoctors(): Doctor[] {
  return readJsonFile("doctors.json", mockData.doctors);
}

export function getDoctorById(id: string): Doctor | undefined {
  return getDoctors().find((d) => d.id === id);
}

// Patients
export function getPatients(): Patient[] {
  return readJsonFile("patients.json", mockData.patients);
}

export function getPatientById(id: string): Patient | undefined {
  return getPatients().find((p) => p.id === id);
}

export function createPatient(patient: Omit<Patient, "id"> & { id?: string }): Patient {
  const patients = getPatients();
  const newPatient: Patient = {
    ...patient,
    id: patient.id || `pat-${uuidv4().slice(0, 8)}`,
    admissionStatus: patient.admissionStatus || "Outpatient",
  };

  patients.push(newPatient);
  writeJsonFile("patients.json", patients);
  return newPatient;
}

export function updatePatient(id: string, updates: Partial<Patient>): Patient | undefined {
  const patients = getPatients();
  const index = patients.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  patients[index] = { ...patients[index], ...updates };
  writeJsonFile("patients.json", patients);
  return patients[index];
}

// Appointments
export function getAppointments(): Appointment[] {
  return readJsonFile("appointments.json", mockData.appointments);
}

export function getAppointmentsByPatient(patientId: string): Appointment[] {
  return getAppointments().filter((a) => a.patientId === patientId);
}

export function getAppointmentsByDoctor(doctorId: string): Appointment[] {
  return getAppointments().filter((a) => a.doctorId === doctorId);
}

export function createAppointment(apt: Omit<Appointment, "id" | "createdAt">): Appointment {
  const appointments = getAppointments();
  const newApt: Appointment = {
    ...apt,
    id: `apt-${uuidv4().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
  };
  appointments.push(newApt);
  writeJsonFile("appointments.json", appointments);
  return newApt;
}

export function updateAppointment(id: string, updates: Partial<Appointment>): Appointment | undefined {
  const appointments = getAppointments();
  const index = appointments.findIndex((a) => a.id === id);
  if (index === -1) return undefined;
  appointments[index] = { ...appointments[index], ...updates };
  writeJsonFile("appointments.json", appointments);
  return appointments[index];
}

// Prescriptions
export function getPrescriptions(): Prescription[] {
  return readJsonFile("prescriptions.json", mockData.prescriptions);
}

export function getPrescriptionsByPatient(patientId: string): Prescription[] {
  return getPrescriptions().filter((p) => p.patientId === patientId);
}

// Visit History
export function getVisitHistories(): VisitHistory[] {
  return readJsonFile("visitHistories.json", mockData.visitHistories);
}

export function getVisitHistoriesByPatient(patientId: string): VisitHistory[] {
  return getVisitHistories().filter((v) => v.patientId === patientId);
}

// Beds
export function getBeds(): Bed[] {
  return readJsonFile("beds.json", mockData.beds);
}

export function updateBed(id: string, updates: Partial<Bed>): Bed | undefined {
  const beds = getBeds();
  const index = beds.findIndex((b) => b.id === id);
  if (index === -1) return undefined;
  beds[index] = { ...beds[index], ...updates };
  writeJsonFile("beds.json", beds);
  return beds[index];
}

// Roster
export function getRoster(): RosterEntry[] {
  return readJsonFile("roster.json", mockData.roster);
}

export function getRosterByDoctor(doctorId: string): RosterEntry[] {
  return getRoster().filter((r) => r.doctorId === doctorId);
}

export function createRosterEntry(entry: Omit<RosterEntry, "id">): RosterEntry {
  const roster = getRoster();
  const newEntry: RosterEntry = {
    ...entry,
    id: `ros-${uuidv4().slice(0, 8)}`,
  };
  roster.push(newEntry);
  writeJsonFile("roster.json", roster);
  return newEntry;
}

// Notifications
export function getNotifications(): Notification[] {
  return readJsonFile("notifications.json", mockData.notifications);
}

export function getNotificationsByUser(userId: string): Notification[] {
  return getNotifications().filter((n) => n.userId === userId);
}

export function markNotificationRead(id: string): Notification | undefined {
  const notifications = getNotifications();
  const index = notifications.findIndex((n) => n.id === id);
  if (index === -1) return undefined;
  notifications[index].read = true;
  writeJsonFile("notifications.json", notifications);
  return notifications[index];
}

// Users
export function getUsers(): User[] {
  return readJsonFile("users.json", mockData.users);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email === email);
}

export function getUserByHospitalId(hospitalId: string): User | undefined {
  return getUsers().find((u) => u.hospitalId === hospitalId);
}

export function getUserByPhone(phone: string): User | undefined {
  return getUsers().find((u) => u.phone === phone);
}
