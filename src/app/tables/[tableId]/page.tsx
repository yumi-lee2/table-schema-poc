"use client";

import { use } from "react";
import { Layout, Card } from "antd";
import Sidebar from "@/components/Sidebar";
import AuthGate from "@/components/AuthGate";
import DynamicTable from "@/components/DynamicTable";

const { Content } = Layout;

export default function TableViewPage({ params }: { params: Promise<{ tableId: string }> }) {
  const { tableId } = use(params);

  return (
    <AuthGate>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Layout>
          <Content style={{ padding: 24, background: "#f5f5f5" }}>
            <Card>
              <DynamicTable tableId={tableId} />
            </Card>
          </Content>
        </Layout>
      </Layout>
    </AuthGate>
  );
}
