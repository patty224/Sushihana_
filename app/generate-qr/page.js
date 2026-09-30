"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const inputStyle = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
  fontSize: 16,
  width: "100%",
};

const btnStyle = {
  padding: "12px 20px",
  borderRadius: 8,
  border: "none",
  background: "#c0392b",
  color: "#fff",
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
};

export default function GenerateQrPage() {
  const [tableNumber, setTableNumber] = useState("");
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasOpenSession, setHasOpenSession] = useState(false);
  const [qr, setQr] = useState(null); // { table, orderUrl, imgUrl }

  async function createSession(table) {
    const { error: insertError } = await supabase.from("sessions").insert({
      table_number: table,
      adult_count: Number(adultCount),
      child_count: Number(childCount),
      status: "open",
    });

    if (insertError) {
      setError("สร้าง session ไม่สำเร็จ: " + insertError.message);
      return;
    }

    const orderUrl = `${window.location.origin}/order/${encodeURIComponent(table)}`;
    const imgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(orderUrl)}`;
    setQr({ table, orderUrl, imgUrl });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setQr(null);
    setHasOpenSession(false);

    const table = tableNumber.trim();
    if (!table) {
      setError("กรุณาใส่เลขโต๊ะ");
      return;
    }

    setLoading(true);

    const { data, error: selectError } = await supabase
      .from("sessions")
      .select("id")
      .eq("table_number", table)
      .eq("status", "open")
      .limit(1);

    if (selectError) {
      setError("ตรวจสอบโต๊ะไม่สำเร็จ: " + selectError.message);
      setLoading(false);
      return;
    }

    if (data && data.length > 0) {
      setHasOpenSession(true);
      setLoading(false);
      return;
    }

    await createSession(table);
    setLoading(false);
  }

  async function handleCloseOld() {
    const table = tableNumber.trim();
    const ok = window.confirm(
      `ยืนยันปิดออเดอร์เก่าของโต๊ะ ${table} และเปิดโต๊ะใหม่?`
    );
    if (!ok) return;

    setLoading(true);
    setError("");

    const { error: closeError } = await supabase
      .from("sessions")
      .update({ status: "closed" })
      .eq("table_number", table)
      .eq("status", "open"); // ปิดเฉพาะที่ยัง open อยู่

    if (closeError) {
      setError("ปิดออเดอร์เก่าไม่สำเร็จ: " + closeError.message);
      setLoading(false);
      return;
    }

    setHasOpenSession(false);
    await createSession(table);
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 420, margin: "0 auto", padding: 24 }}>
      <h1 style={{ color: "#c0392b" }}>สร้าง QR Code โต๊ะ</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <label>
          เลขโต๊ะ
          <input
            style={inputStyle}
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="เช่น 5"
          />
        </label>

        <label>
          จำนวนผู้ใหญ่
          <input
            style={inputStyle}
            type="number"
            min="0"
            value={adultCount}
            onChange={(e) => setAdultCount(e.target.value)}
          />
        </label>

        <label>
          จำนวนเด็ก
          <input
            style={inputStyle}
            type="number"
            min="0"
            value={childCount}
            onChange={(e) => setChildCount(e.target.value)}
          />
        </label>

        <button type="submit" style={btnStyle} disabled={loading}>
          {loading ? "กำลังทำงาน..." : "เปิดโต๊ะและสร้าง QR"}
        </button>
      </form>

      {error && <p style={{ color: "#c0392b" }}>{error}</p>}

      {hasOpenSession && (
        <div
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 10,
            background: "#fff3cd",
            border: "1px solid #ffe08a",
          }}
        >
          <p style={{ marginTop: 0 }}>
            ⚠️ โต๊ะ {tableNumber.trim()} มีออเดอร์ที่ยังเปิดอยู่
          </p>
          <button
            style={{ ...btnStyle, background: "#2c3e50" }}
            onClick={handleCloseOld}
            disabled={loading}
          >
            ปิดออเดอร์เก่า
          </button>
        </div>
      )}

      {qr && (
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <h2>โต๊ะ {qr.table}</h2>
          <img src={qr.imgUrl} alt={`QR โต๊ะ ${qr.table}`} width={300} height={300} />
          <p style={{ wordBreak: "break-all", color: "#666" }}>{qr.orderUrl}</p>
        </div>
      )}
    </main>
  );
}
