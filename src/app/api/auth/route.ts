import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, getUserByHospitalId, getUserByPhone, getDoctorById, getPatientById } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { method, email, hospitalId, phone, role, name } = body;

  let user = null;

  if (method === "google" || method === "facebook") {
    user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "User not found. Please use Hospital ID or Phone login for prototype." }, { status: 404 });
    }
  } else if (method === "hospitalId") {
    user = getUserByHospitalId(hospitalId);
    if (!user) {
      return NextResponse.json({ error: "Invalid Hospital ID" }, { status: 401 });
    }
  } else if (method === "phone") {
    user = getUserByPhone(phone);
    if (!user) {
      return NextResponse.json({ error: "Phone number not registered" }, { status: 401 });
    }
  } else if (method === "demo") {
    // Demo login for any role
    const demoUsers = {
      patient: getUserByEmail("john.anderson@email.com"),
      doctor: getUserByEmail("sarah.mitchell@mediflow.com"),
      receptionist: getUserByEmail("admin@mediflow.com"),
    };
    user = demoUsers[role as keyof typeof demoUsers] || demoUsers.patient;
  }

  if (!user) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }

  // Get additional profile data
  let profile = null;
  if (user.role === "doctor") {
    const doctors = require("@/lib/db").getDoctors();
    profile = doctors.find((d: any) => d.email === user.email);
  } else if (user.role === "patient") {
    const patients = require("@/lib/db").getPatients();
    profile = patients.find((p: any) => p.email === user.email);
  }

  return NextResponse.json({
    user,
    profile,
    token: `demo-token-${user.id}-${Date.now()}`,
  });
}
