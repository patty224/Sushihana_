export const metadata = {
  title: "Sushihana POS",
  description: "ระบบ POS และสั่งอาหารผ่าน QR Code ร้านซูชิฮานะ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body
        style={{
          margin: 0,
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", "Noto Sans Thai", sans-serif',
          background: "#fff7f0",
          color: "#2b2b2b",
        }}
      >
        {children}
      </body>
    </html>
  );
}
