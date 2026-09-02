import { NextRequest, NextResponse } from "next/server";
import { createPatient, getDoctors, getBeds, updateBed } from "@/lib/db";
import { createAiCareSummary, findAvailableBed, findAvailableDoctor, generatePatientId, getDepartmentFromSymptoms, getPriorityFromPatient } from "@/lib/aiWorkflow";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const {
    name,
    phone,
    email,
    age,
    gender,
    address,
    branch,
    symptoms,
    medicalHistory,
    allergies,
    currentMedications,
    bloodType,
    emergencyContact,
    vitals,
  } = body;

  if (!name || !phone || !branch) {
    return NextResponse.json({ error: "Name, phone, and branch are required" }, { status: 400 });
  }

  const patientId = generatePatientId();
  const department = getDepartmentFromSymptoms(symptoms || "");
  const patientRecord = createPatient({
    id: patientId,
    name,
    email: email || `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    phone,
    bloodType: bloodType || "N/A",
    admissionStatus: "Outpatient",
    branch,
    age: Number(age || 0),
    gender: gender || "Not specified",
    address: address || "Not provided",
    emergencyContact: emergencyContact || "Not provided",
    symptoms: symptoms || "",
    medicalHistory: medicalHistory || "",
    allergies: allergies || "",
    currentMedications: currentMedications || "",
    vitals: vitals || {},
    triageStatus: "Pending",
    aiDepartment: department,
  });

  const priority = getPriorityFromPatient(patientRecord);
  const aiSummary = createAiCareSummary(patientRecord, priority, department);

  const doctors = getDoctors();
  const beds = getBeds();
  const recommendedDoctor = findAvailableDoctor(doctors, department, branch);
  const assignedBed = findAvailableBed(beds, branch, priority);

  const { id: _patientIdIgnored, ...patientWithoutId } = patientRecord;
  const patientWithAi = {
    ...patientWithoutId,
    aiPriority: priority,
    aiDepartment: department,
    aiSummary,
    triageStatus: priority === "Emergency" ? "In Assessment" : "Awaiting Doctor",
    assignedDoctorId: recommendedDoctor?.id,
  };

  const updatedPatient = await fetch(`${request.nextUrl.origin}/api/patients`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: patientId, ...patientWithAi }),
  }).then((res) => res.json());

  let bedAllocation = null;
  if (priority !== "Routine" && assignedBed) {
    bedAllocation = updateBed(assignedBed.id, {
      status: "Occupied",
      patientId: patientId,
    });
  }

  return NextResponse.json({
    patient: updatedPatient,
    ai: {
      priority,
      department,
      summary: aiSummary,
      doctor: recommendedDoctor,
      bed: bedAllocation,
      workflow: priority === "Emergency"
        ? "Emergency department escalation"
        : "OPD route + appointment generation",
    },
    nextStep: priority === "Emergency"
      ? "Redirect to emergency evaluation queue"
      : "Generate OPD token/appointment",
  });
}
