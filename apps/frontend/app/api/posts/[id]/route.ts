import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import getDbConnection from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) {
    return NextResponse.redirect("/sign-in");
  }

  const { content } = await request.json();
  if (typeof content !== "string") {
    return NextResponse.json(
      { success: false, message: "Invalid content" },
      { status: 400 },
    );
  }

  const sql = await getDbConnection();
  await sql`
    UPDATE posts
    SET content = ${content}
    WHERE id = ${id} AND user_id = ${user.id}
  `;

  return NextResponse.json({ success: true });
}
