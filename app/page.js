import Link from "next/link";

const btn = {
  display: "inline-block",
  padding: "14px 28px",
  borderRadius: 10,
  color: "#fff",
  textDecoration: "none",
  fontWeight: 600,
};

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 24,
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2.4rem", margin: 0, color: "#c0392b" }}>
        🍣 Sushihana (ซูชิฮานะ)
      </h1>
      <p style={{ margin: "0 0 16px", color: "#666" }}>
        ระบบ POS และสั่งอาหารผ่าน QR Code
      </p>

      <nav
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "center",
        }}
      >
        <Link href="/generate-qr" style={{ ...btn, background: "#c0392b" }}>
          สร้าง QR Code โต๊ะ
        </Link>
        <Link href="/kitchen" style={{ ...btn, background: "#2c3e50" }}>
          หน้าจอครัว
        </Link>
      </nav>
    </main>
  );
}
