import { NextResponse } from "next/server";
import { getColumns } from "@/lib/store";
import { generateMockData } from "@/lib/mock-generator";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cols = getColumns(id);
  if (cols.length === 0) return NextResponse.json([]);
  const data = generateMockData(cols);
  return NextResponse.json(data);
}
