"use client";

import { useState, useEffect } from "react";
import { Table, Button, Input, Popconfirm, message, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { TableDef } from "@/lib/types";

interface Props {
  selectedTableId: string | null;
  onSelect: (id: string) => void;
}

export default function TableDefList({ selectedTableId, onSelect }: Props) {
  const [tables, setTables] = useState<TableDef[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [editValues, setEditValues] = useState<{ name: string; description: string }>({ name: "", description: "" });

  const fetchTables = async () => {
    setLoading(true);
    const res = await fetch("/api/tables");
    const data = await res.json();
    setTables(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleAdd = async () => {
    const id = `table-${Date.now()}`;
    await fetch("/api/tables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name: "새 테이블", description: "" }),
    });
    await fetchTables();
    message.success("테이블이 추가되었습니다.");
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/tables/${id}`, { method: "DELETE" });
    await fetchTables();
    if (selectedTableId === id) onSelect("");
    message.success("테이블이 삭제되었습니다.");
  };

  const startEdit = (record: TableDef) => {
    setEditingKey(record.id);
    setEditValues({ name: record.name, description: record.description || "" });
  };

  const saveEdit = async (id: string) => {
    await fetch(`/api/tables/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editValues),
    });
    setEditingKey("");
    await fetchTables();
  };

  const columns = [
    {
      title: "이름",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: TableDef) => {
        if (editingKey === record.id) {
          return (
            <Input
              value={editValues.name}
              onChange={(e) => setEditValues((v) => ({ ...v, name: e.target.value }))}
              onPressEnter={() => saveEdit(record.id)}
              size="small"
            />
          );
        }
        return (
          <a onClick={() => onSelect(record.id)} style={{ fontWeight: selectedTableId === record.id ? 700 : 400 }}>
            {text}
          </a>
        );
      },
    },
    {
      title: "설명",
      dataIndex: "description",
      key: "description",
      render: (text: string, record: TableDef) => {
        if (editingKey === record.id) {
          return (
            <Input
              value={editValues.description}
              onChange={(e) => setEditValues((v) => ({ ...v, description: e.target.value }))}
              onPressEnter={() => saveEdit(record.id)}
              size="small"
            />
          );
        }
        return text || "-";
      },
    },
    {
      title: "액션",
      key: "action",
      width: 120,
      render: (_: unknown, record: TableDef) => {
        if (editingKey === record.id) {
          return (
            <Space>
              <Button size="small" type="link" onClick={() => saveEdit(record.id)}>저장</Button>
              <Button size="small" type="link" onClick={() => setEditingKey("")}>취소</Button>
            </Space>
          );
        }
        return (
          <Space>
            <Button size="small" type="link" onClick={() => startEdit(record)}>수정</Button>
            <Popconfirm title="삭제하시겠습니까?" onConfirm={() => handleDelete(record.id)}>
              <Button size="small" type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>테이블 정의</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="small">
          테이블 추가
        </Button>
      </div>
      <Table
        dataSource={tables}
        columns={columns}
        rowKey="id"
        loading={loading}
        size="small"
        pagination={false}
        onRow={(record) => ({
          onClick: () => {
            if (editingKey !== record.id) onSelect(record.id);
          },
          style: { cursor: "pointer", background: selectedTableId === record.id ? "#e6f4ff" : undefined },
        })}
      />
    </div>
  );
}
