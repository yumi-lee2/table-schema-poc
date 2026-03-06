"use client";

import { useState, useEffect, ReactNode } from "react";
import { Card, Input, Button, Typography, message } from "antd";
import { LockOutlined } from "@ant-design/icons";

const PASSWORD = "nhn";

export default function AuthGate({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const auth = sessionStorage.getItem("auth");
    if (auth === "true") setAuthenticated(true);
    setLoading(false);
  }, []);

  const handleLogin = () => {
    if (password === PASSWORD) {
      sessionStorage.setItem("auth", "true");
      setAuthenticated(true);
    } else {
      message.error("패스워드가 올바르지 않습니다.");
    }
  };

  if (loading) return null;

  if (!authenticated) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f0f2f5" }}>
        <Card style={{ width: 360, textAlign: "center" }}>
          <LockOutlined style={{ fontSize: 48, color: "#1677ff", marginBottom: 16 }} />
          <Typography.Title level={4}>Table Schema POC</Typography.Title>
          <Typography.Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
            접근하려면 패스워드를 입력하세요.
          </Typography.Text>
          <Input.Password
            placeholder="패스워드"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onPressEnter={handleLogin}
            style={{ marginBottom: 16 }}
          />
          <Button type="primary" block onClick={handleLogin}>
            입장
          </Button>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
