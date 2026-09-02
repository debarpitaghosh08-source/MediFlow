import { NextRequest, NextResponse } from "next/server";
import {
  getAppointments,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  createAppointment,
  updateAppointment,
} from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get("patientId");
  const doctorId = searchParams.get("doctorId");

  if (patientId) {
    return NextResponse.json(getAppointmentsByPatient(patientId));
  }

  if (doctorId) {
    return NextResponse.json(getAppointmentsByDoctor(doctorId));
  }

  return NextResponse.json(getAppointments());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const appointment = createAppointment(body);
  return NextResponse.json(appointment, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "Appointment ID required" }, { status: 400 });
  }

  const appointment = updateAppointment(id, updates);
  if (!appointment) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  return NextResponse.json(appointment);
}
