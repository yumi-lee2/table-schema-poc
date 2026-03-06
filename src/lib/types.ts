export interface TableDef {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface ColumnDef {
  id: string;
  tableId: string;
  key: string;
  label: string;
  type: "string" | "number" | "date" | "select" | "boolean";
  sequence: number;
  filterable: boolean;
  visible: boolean;
}
