"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Layout, Menu } from "antd";
import { TableOutlined, SettingOutlined } from "@ant-design/icons";
import type { TableDef } from "@/lib/types";

const { Sider } = Layout;

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [tables, setTables] = useState<TableDef[]>([]);

  const fetchTables = () => {
    fetch("/api/tables")
      .then((r) => r.json())
      .then(setTables)
      .catch(() => {});
  };

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 3000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    {
      key: "/",
      icon: <SettingOutlined />,
      label: "스키마 정의",
    },
    {
      key: "tables",
      icon: <TableOutlined />,
      label: "테이블 뷰",
      children: tables.map((t) => ({
        key: `/tables/${t.id}`,
        label: t.name,
      })),
    },
  ];

  const selectedKey = pathname === "/" ? "/" : pathname;

  return (
    <Sider width={220} style={{ background: "#fff", borderRight: "1px solid #f0f0f0" }}>
      <div style={{ padding: "16px 24px", fontWeight: 700, fontSize: 16, borderBottom: "1px solid #f0f0f0" }}>
        Table Schema POC
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={["tables"]}
        items={menuItems}
        onClick={({ key }) => router.push(key)}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
}
