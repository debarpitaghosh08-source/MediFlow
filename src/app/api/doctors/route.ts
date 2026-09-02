import { NextRequest, NextResponse } from "next/server";
import { getDoctors, getDoctorById } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const specialization = searchParams.get("specialization");
  const branch = searchParams.get("branch");

  if (id) {
    const doctor = getDoctorById(id);
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }
    return NextResponse.json(doctor);
  }

  let doctors = getDoctors();

  if (specialization && specialization !== "all") {
    doctors = doctors.filter((d) =>
      d.specialization.toLowerCase().includes(specialization.toLowerCase())
    );
  }

  if (branch && branch !== "all") {
    doctors = doctors.filter((d) => d.branch === branch);
  }

  return NextResponse.json(doctors);
}
