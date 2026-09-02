import { Bed, Doctor, Patient } from "@/types";

export type TriagePriority = "Emergency" | "Urgent" | "Routine";

export function generatePatientId() {
  return `PAT-${Date.now().toString().slice(-6)}`;
}

export function getDepartmentFromSymptoms(symptoms: string): string {
  const normalized = symptoms.toLowerCase();

  if (/(accident|trauma|fracture|fall|injury|bleeding|burn|road traffic|major trauma)/.test(normalized)) {
    return "Emergency";
  }
  if (/(chest pain|palpitation|shortness of breath|heart|cardiac)/.test(normalized)) {
    return "Cardiology";
  }
  if (/(skin|rash|eczema|allergy|derma)/.test(normalized)) {
    return "Dermatology";
  }
  if (/(bone|joint|knee|hip|back pain|orthopedic|fracture|sprain)/.test(normalized)) {
    return "Orthopedics";
  }
  if (/(eye|vision|blur|red eye|glaucoma|retina)/.test(normalized)) {
    return "Ophthalmology";
  }
  if (/(fever|cough|cold|migraine|headache|weakness|infection|general)/.test(normalized)) {
    return "General Medicine";
  }

  return "General Medicine";
}

export function getPriorityFromPatient(patient: Partial<Patient>): TriagePriority {
  const symptoms = `${patient.symptoms || ""} ${patient.medicalHistory || ""}`.toLowerCase();
  const vitals = patient.vitals || {};
  const oxygen = vitals.oxygenLevel;
  const heartRate = vitals.heartRate;
  const bloodPressure = vitals.bloodPressure || "";

  const emergencySignals = [
    /(accident|trauma|severe bleeding|unconscious|stroke|seizure|cardiac arrest|chest pain)/,
    /(shortness of breath|very severe|critical)/,
  ];

  if (oxygen !== undefined && oxygen < 90) return "Emergency";
  if (heartRate !== undefined && heartRate > 130) return "Emergency";
  if (bloodPressure && /\b[0-9]{1,2}\s*\/\s*0?\d{1,2}\b/.test(bloodPressure)) {
    const [systolic] = bloodPressure.split("/").map(Number);
    if (!Number.isNaN(systolic) && systolic < 90) return "Emergency";
  }
  if (emergencySignals.some((pattern) => pattern.test(symptoms))) return "Emergency";
  if (/(urgent|severe pain|high fever|persistent vomiting|major infection|dizziness|worsening)/.test(symptoms)) return "Urgent";
  if (oxygen !== undefined && oxygen < 94) return "Urgent";

  return "Routine";
}

export function findAvailableDoctor(doctors: Doctor[], department: string, branch: string) {
  const specializationMatch = doctors.filter((doctor) => {
    if (department === "Emergency") return doctor.specialization.toLowerCase().includes("emergency") || doctor.specialization.toLowerCase().includes("general");
    return doctor.specialization.toLowerCase().includes(department.toLowerCase()) || doctor.branch === branch;
  });

  const available = specializationMatch.filter((doctor) => doctor.isAvailable);
  return available[0] || doctors.find((doctor) => doctor.isAvailable) || null;
}

export function findAvailableBed(beds: Bed[], branch: string, priority: TriagePriority) {
  const wardPreference = priority === "Emergency" ? "Emergency" : "General";

  const preferred = beds.filter((bed) => {
    const matchesBranch = bed.branch === branch;
    const isAvailable = bed.status === "Available";
    if (priority === "Emergency") {
      return matchesBranch && isAvailable && /ICU|Emergency|Critical/i.test(bed.ward);
    }
    return matchesBranch && isAvailable && !/ICU|Emergency/i.test(bed.ward);
  });

  if (preferred.length) return preferred[0];

  return beds.find((bed) => bed.branch === branch && bed.status === "Available") || null;
}

export function createAiCareSummary(patient: Partial<Patient>, priority: TriagePriority, department: string) {
  const summary = [
    `Priority: ${priority}`,
    `Department recommendation: ${department}`,
    `Symptoms: ${patient.symptoms || "Not provided"}`,
    `Vitals: ${patient.vitals ? JSON.stringify(patient.vitals) : "Not entered"}`,
  ].join(" | ");

  return summary;
}
