import { NextRequest, NextResponse } from "next/server";
import { getRoster, getRosterByDoctor, createRosterEntry } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get("doctorId");

  if (doctorId) {
    return NextResponse.json(getRosterByDoctor(doctorId));
  }

  return NextResponse.json(getRoster());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const entry = createRosterEntry(body);
  return NextResponse.json(entry, { status: 201 });
}
