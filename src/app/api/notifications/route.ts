import { NextRequest, NextResponse } from "next/server";
import { getNotifications, getNotificationsByUser, markNotificationRead } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (userId) return NextResponse.json(getNotificationsByUser(userId));
  return NextResponse.json(getNotifications());
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: "Notification ID required" }, { status: 400 });
  const notification = markNotificationRead(id);
  if (!notification) return NextResponse.json({ error: "Notification not found" }, { status: 404 });
  return NextResponse.json(notification);
}
