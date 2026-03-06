import { NextResponse } from "next/server";
import { getColumns, createColumn } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tableId = searchParams.get("tableId");
  if (!tableId) return NextResponse.json({ error: "tableId required" }, { status: 400 });
  return NextResponse.json(getColumns(tableId));
}

export async function POST(request: Request) {
  const body = await request.json();
  const col = createColumn(body);
  return NextResponse.json(col, { status: 201 });
}
