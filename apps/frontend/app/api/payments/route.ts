import { NextResponse } from "next/server";

export function POST() {
  return NextResponse.json(
    { success: false, message: "Payments are not implemented yet." },
    { status: 501 },
  );
}
