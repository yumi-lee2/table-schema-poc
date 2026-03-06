import { TableDef, ColumnDef } from "./types";

let tables: TableDef[] = [
  {
    id: "users",
    name: "사용자 관리",
    description: "사용자 정보 관리 테이블",
    createdAt: new Date().toISOString(),
  },
  {
    id: "orders",
    name: "주문 관리",
    description: "주문 내역 관리 테이블",
    createdAt: new Date().toISOString(),
  },
];

let columns: ColumnDef[] = [
  // 사용자 관리 칼럼
  { id: "col-u1", tableId: "users", key: "userName", label: "이름", type: "string", sequence: 1, filterable: true, visible: true },
  { id: "col-u2", tableId: "users", key: "email", label: "이메일", type: "string", sequence: 2, filterable: true, visible: true },
  { id: "col-u3", tableId: "users", key: "age", label: "나이", type: "number", sequence: 3, filterable: true, visible: true },
  { id: "col-u4", tableId: "users", key: "joinDate", label: "가입일", type: "date", sequence: 4, filterable: false, visible: true },
  { id: "col-u5", tableId: "users", key: "active", label: "활성상태", type: "boolean", sequence: 5, filterable: true, visible: true },
  // 주문 관리 칼럼
  { id: "col-o1", tableId: "orders", key: "orderNo", label: "주문번호", type: "string", sequence: 1, filterable: true, visible: true },
  { id: "col-o2", tableId: "orders", key: "orderer", label: "주문자", type: "string", sequence: 2, filterable: true, visible: true },
  { id: "col-o3", tableId: "orders", key: "amount", label: "금액", type: "number", sequence: 3, filterable: true, visible: true },
  { id: "col-o4", tableId: "orders", key: "orderDate", label: "주문일", type: "date", sequence: 4, filterable: false, visible: true },
  { id: "col-o5", tableId: "orders", key: "status", label: "상태", type: "select", sequence: 5, filterable: true, visible: true },
];

let nextColId = 10;

export function getTables(): TableDef[] {
  return [...tables];
}

export function getTable(id: string): TableDef | undefined {
  return tables.find((t) => t.id === id);
}

export function createTable(data: Omit<TableDef, "createdAt">): TableDef {
  const table: TableDef = { ...data, createdAt: new Date().toISOString() };
  tables.push(table);
  return table;
}

export function updateTable(id: string, data: Partial<TableDef>): TableDef | null {
  const idx = tables.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  tables[idx] = { ...tables[idx], ...data, id };
  return tables[idx];
}

export function deleteTable(id: string): boolean {
  const len = tables.length;
  tables = tables.filter((t) => t.id !== id);
  columns = columns.filter((c) => c.tableId !== id);
  return tables.length < len;
}

export function getColumns(tableId: string): ColumnDef[] {
  return columns.filter((c) => c.tableId === tableId).sort((a, b) => a.sequence - b.sequence);
}

export function createColumn(data: Omit<ColumnDef, "id">): ColumnDef {
  const col: ColumnDef = { ...data, id: `col-${++nextColId}` };
  columns.push(col);
  return col;
}

export function updateColumn(id: string, data: Partial<ColumnDef>): ColumnDef | null {
  const idx = columns.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  columns[idx] = { ...columns[idx], ...data, id };
  return columns[idx];
}

export function deleteColumn(id: string): boolean {
  const len = columns.length;
  columns = columns.filter((c) => c.id !== id);
  return columns.length < len;
}
