"use client";

import { useState, useEffect, useCallback } from "react";
import { Table, Button, Input, Select, Switch, Popconfirm, message, Space } from "antd";
import { PlusOutlined, DeleteOutlined, HolderOutlined } from "@ant-design/icons";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import type { ColumnDef } from "@/lib/types";
import React from "react";

interface Props {
  tableId: string | null;
}

const typeOptions = [
  { label: "문자열", value: "string" },
  { label: "숫자", value: "number" },
  { label: "날짜", value: "date" },
  { label: "선택", value: "select" },
  { label: "불리언", value: "boolean" },
];

interface SortableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

const DragHandleContext = React.createContext<{
  listeners?: ReturnType<typeof useSortable>["listeners"];
  attributes?: ReturnType<typeof useSortable>["attributes"];
}>({});

function SortableRow(props: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props["data-row-key"],
  });
  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 9999, background: "#fafafa" } : {}),
  };
  return (
    <DragHandleContext.Provider value={{ listeners, attributes }}>
      <tr {...props} ref={setNodeRef} style={style} />
    </DragHandleContext.Provider>
  );
}

function DragHandle() {
  const { listeners, attributes } = React.useContext(DragHandleContext);
  return <HolderOutlined style={{ cursor: "grab", color: "#999" }} {...listeners} {...attributes} />;
}

export default function ColumnDefList({ tableId }: Props) {
  const [columns, setColumns] = useState<ColumnDef[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [editValues, setEditValues] = useState<Partial<ColumnDef>>({});

  const fetchColumns = useCallback(async () => {
    if (!tableId) { setColumns([]); return; }
    setLoading(true);
    const res = await fetch(`/api/columns?tableId=${tableId}`);
    const data = await res.json();
    setColumns(data);
    setLoading(false);
  }, [tableId]);

  useEffect(() => {
    fetchColumns();
  }, [fetchColumns]);

  const handleAdd = async () => {
    if (!tableId) return;
    const seq = columns.length > 0 ? Math.max(...columns.map((c) => c.sequence)) + 1 : 1;
    await fetch("/api/columns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tableId,
        key: `field${seq}`,
        label: `새 칼럼 ${seq}`,
        type: "string",
        sequence: seq,
        filterable: false,
        visible: true,
      }),
    });
    await fetchColumns();
    message.success("칼럼이 추가되었습니다.");
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/columns/${id}`, { method: "DELETE" });
    await fetchColumns();
    message.success("칼럼이 삭제되었습니다.");
  };

  const handleToggle = async (id: string, field: "visible" | "filterable", value: boolean) => {
    await fetch(`/api/columns/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    await fetchColumns();
  };

  const startEdit = (record: ColumnDef) => {
    setEditingKey(record.id);
    setEditValues({ key: record.key, label: record.label, type: record.type });
  };

  const saveEdit = async (id: string) => {
    await fetch(`/api/columns/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editValues),
    });
    setEditingKey("");
    await fetchColumns();
  };

  const onDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const oldIndex = columns.findIndex((c) => c.id === active.id);
    const newIndex = columns.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(columns, oldIndex, newIndex);
    setColumns(reordered);
    await Promise.all(
      reordered.map((col, idx) =>
        fetch(`/api/columns/${col.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sequence: idx + 1 }),
        })
      )
    );
    await fetchColumns();
  };

  const tableCols = [
    {
      title: "",
      dataIndex: "drag",
      key: "drag",
      width: 40,
      render: () => <DragHandle />,
    },
    {
      title: "Key",
      dataIndex: "key",
      key: "key",
      width: 120,
      render: (text: string, record: ColumnDef) => {
        if (editingKey === record.id) {
          return <Input size="small" value={editValues.key} onChange={(e) => setEditValues((v) => ({ ...v, key: e.target.value }))} onPressEnter={() => saveEdit(record.id)} />;
        }
        return <code>{text}</code>;
      },
    },
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
      width: 120,
      render: (text: string, record: ColumnDef) => {
        if (editingKey === record.id) {
          return <Input size="small" value={editValues.label} onChange={(e) => setEditValues((v) => ({ ...v, label: e.target.value }))} onPressEnter={() => saveEdit(record.id)} />;
        }
        return text;
      },
    },
    {
      title: "타입",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (text: string, record: ColumnDef) => {
        if (editingKey === record.id) {
          return <Select size="small" value={editValues.type} onChange={(val) => setEditValues((v) => ({ ...v, type: val }))} options={typeOptions} style={{ width: "100%" }} />;
        }
        return typeOptions.find((o) => o.value === text)?.label || text;
      },
    },
    {
      title: "표시",
      dataIndex: "visible",
      key: "visible",
      width: 70,
      render: (val: boolean, record: ColumnDef) => (
        <Switch size="small" checked={val} onChange={(v) => handleToggle(record.id, "visible", v)} />
      ),
    },
    {
      title: "필터",
      dataIndex: "filterable",
      key: "filterable",
      width: 70,
      render: (val: boolean, record: ColumnDef) => (
        <Switch size="small" checked={val} onChange={(v) => handleToggle(record.id, "filterable", v)} />
      ),
    },
    {
      title: "액션",
      key: "action",
      width: 100,
      render: (_: unknown, record: ColumnDef) => {
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

  if (!tableId) {
    return (
      <div style={{ color: "#999", textAlign: "center", paddingTop: 60 }}>
        왼쪽에서 테이블을 선택하세요.
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>칼럼 정의</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="small">
          칼럼 추가
        </Button>
      </div>
      <DndContext modifiers={[restrictToVerticalAxis]} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={columns.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <Table
            dataSource={columns}
            columns={tableCols}
            rowKey="id"
            loading={loading}
            size="small"
            pagination={false}
            components={{ body: { row: SortableRow } }}
          />
        </SortableContext>
      </DndContext>
    </div>
  );
}
