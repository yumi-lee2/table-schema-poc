"use client";

import { useState, useEffect } from "react";
import { Table, Tag, Typography, Spin } from "antd";
import type { ColumnDef } from "@/lib/types";
import type { ColumnsType } from "antd/es/table";

interface Props {
  tableId: string;
}

export default function DynamicTable({ tableId }: Props) {
  const [columns, setColumns] = useState<ColumnDef[]>([]);
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableName, setTableName] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [colRes, dataRes, tableRes] = await Promise.all([
        fetch(`/api/columns?tableId=${tableId}`),
        fetch(`/api/tables/${tableId}/mock-data`),
        fetch(`/api/tables/${tableId}`),
      ]);
      const cols: ColumnDef[] = await colRes.json();
      const rows = await dataRes.json();
      const table = await tableRes.json();
      setColumns(cols);
      setData(rows);
      setTableName(table.name || tableId);
      setLoading(false);
    };
    load();
  }, [tableId]);

  const visibleCols = columns
    .filter((c) => c.visible)
    .sort((a, b) => a.sequence - b.sequence);

  const antdColumns: ColumnsType<Record<string, unknown>> = visibleCols.map((col) => {
    const base: ColumnsType<Record<string, unknown>>[number] = {
      title: col.label,
      dataIndex: col.key,
      key: col.key,
    };

    // Render by type
    if (col.type === "boolean") {
      base.render = (val: unknown) => (
        <Tag color={val ? "green" : "red"}>{val ? "Y" : "N"}</Tag>
      );
    } else if (col.type === "number") {
      base.render = (val: unknown) => {
        if (typeof val === "number") return val.toLocaleString();
        return val as string;
      };
    } else if (col.type === "select") {
      base.render = (val: unknown) => <Tag>{val as string}</Tag>;
    }

    // Filter support
    if (col.filterable) {
      const uniqueValues = [...new Set(data.map((row) => String(row[col.key])))];
      base.filters = uniqueValues.map((v) => ({ text: v, value: v }));
      base.onFilter = (value, record) => String(record[col.key]) === String(value);
    }

    return base;
  });

  if (loading) {
    return (
      <div style={{ textAlign: "center", paddingTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        {tableName}
      </Typography.Title>
      <Table
        dataSource={data}
        columns={antdColumns}
        rowKey="key"
        size="middle"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
