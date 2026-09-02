import { NextRequest, NextResponse } from "next/server";
import { getBeds, updateBed } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const branch = searchParams.get("branch");

  let beds = getBeds();
  if (branch && branch !== "all") {
    beds = beds.filter((b) => b.branch === branch);
  }

  return NextResponse.json(beds);
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "Bed ID required" }, { status: 400 });
  }

  const bed = updateBed(id, updates);
  if (!bed) {
    return NextResponse.json({ error: "Bed not found" }, { status: 404 });
  }

  return NextResponse.json(bed);
}
