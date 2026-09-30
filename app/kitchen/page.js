"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

// สมมติสถานะ: pending -> cooking -> served (ปรับให้ตรงกับที่ใช้จริงได้)
const NEXT_STATUS = { pending: "cooking", cooking: "served" };
const STATUS_LABEL = { pending: "รอทำ", cooking: "กำลังทำ" };
const ACTION_LABEL = { pending: "เริ่มทำ", cooking: "เสิร์ฟแล้ว" };

function formatItems(items) {
  if (!Array.isArray(items)) return [JSON.stringify(items)];
  return items.map((it) => {
    const name = it?.name ?? "ไม่ระบุชื่อ";
    const qty = it?.qty ?? it?.quantity ?? 1;
    return `${name} × ${qty}`;
  });
}

export default function KitchenPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .in("status", ["pending", "cooking"])
      .order("created_at", { ascending: true });

    if (fetchError) {
      setError("โหลดออเดอร์ไม่สำเร็จ: " + fetchError.message);
      return;
    }
    setError("");
    setOrders(data || []);
  }, []);

  useEffect(() => {
    loadOrders();

    const channel = supabase
      .channel("kitchen-orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => loadOrders()
      )
      .subscribe();

    const timer = setInterval(loadOrders, 10000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(timer);
    };
  }, [loadOrders]);

  async function advance(order) {
    const next = NEXT_STATUS[order.status];
    if (!next) return;

    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: next })
      .eq("id", order.id);

    if (updateError) {
      setError("อัปเดตสถานะไม่สำเร็จ: " + updateError.message);
      return;
    }
    loadOrders();
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ color: "#c0392b" }}>🍳 หน้าจอครัว</h1>
      {error && <p style={{ color: "#c0392b" }}>{error}</p>}
      {orders.length === 0 && !error && <p>ยังไม่มีออเดอร์ค้าง</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {orders.map((order) => (
          <div
            key={order.id}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 16,
              border: "1px solid #eee",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ margin: "0 0 4px" }}>โต๊ะ {order.table_number}</h2>
            <p style={{ margin: "0 0 8px", color: "#666" }}>
              {STATUS_LABEL[order.status] || order.status} ·{" "}
              {new Date(order.created_at).toLocaleTimeString("th-TH", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <ul style={{ paddingLeft: 18, margin: "0 0 12px" }}>
              {formatItems(order.items).map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
            <button
              onClick={() => advance(order)}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "none",
                background: "#2c3e50",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {ACTION_LABEL[order.status]}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
