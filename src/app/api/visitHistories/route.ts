import { NextRequest, NextResponse } from "next/server";
import { getVisitHistories, getVisitHistoriesByPatient } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get("patientId");
  if (patientId) return NextResponse.json(getVisitHistoriesByPatient(patientId));
  return NextResponse.json(getVisitHistories());
}
