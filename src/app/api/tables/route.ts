import { NextResponse } from "next/server";
import { getTables, createTable } from "@/lib/store";

export function GET() {
  return NextResponse.json(getTables());
}

export async function POST(request: Request) {
  const body = await request.json();
  const table = createTable(body);
  return NextResponse.json(table, { status: 201 });
}
