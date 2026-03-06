"use client";

import { useState } from "react";
import { Layout, Card } from "antd";
import Sidebar from "@/components/Sidebar";
import AuthGate from "@/components/AuthGate";
import TableDefList from "@/components/TableDefList";
import ColumnDefList from "@/components/ColumnDefList";

const { Content } = Layout;

export default function Home() {
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  return (
    <AuthGate>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Layout>
          <Content style={{ padding: 24, background: "#f5f5f5" }}>
            <div style={{ display: "flex", gap: 24 }}>
              <Card style={{ flex: 1 }}>
                <TableDefList
                  selectedTableId={selectedTableId}
                  onSelect={setSelectedTableId}
                />
              </Card>
              <Card style={{ flex: 1 }}>
                <ColumnDefList tableId={selectedTableId} />
              </Card>
            </div>
          </Content>
        </Layout>
      </Layout>
    </AuthGate>
  );
}
