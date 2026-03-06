import { NextResponse } from "next/server";
import { updateColumn, deleteColumn } from "@/lib/store";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const col = updateColumn(id, body);
  if (!col) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(col);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = deleteColumn(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
