# Sushihana POS 🍣

ระบบ POS และสั่งอาหารผ่าน QR Code สำหรับร้านอาหารญี่ปุ่น "Sushihana" (ซูชิฮานะ)

**Stack:** Next.js (App Router, JavaScript) · Supabase · Vercel

> ⚠️ **Note: โปรเจกต์นี้ใช้ Next.js เวอร์ชันล่าสุด ซึ่ง params ของ Dynamic Route ทำงานเป็น Promise ดังนั้นต้อง unwrap ด้วย use() จาก React เสมอ**

ตัวอย่าง:

```js
"use client";
import { use } from "react";

export default function OrderPage({ params }) {
  const { table } = use(params);
  return <div>โต๊ะ {table}</div>;
}
```

## โครงสร้างโปรเจกต์

```
sushihana/
├── app/
│   ├── layout.js            # Root layout
│   ├── page.js              # หน้าแรก (/)
│   ├── generate-qr/
│   │   └── page.js          # พนักงานเปิดโต๊ะ + สร้าง QR
│   └── kitchen/
│       └── page.js          # หน้าจอครัว
├── lib/
│   └── supabaseClient.js    # Supabase client
├── CLAUDE.md                # โน้ตบริบทและกฎของโปรเจกต์
├── next.config.js
├── package.json
└── README.md
```

## หน้าเว็บ

| Route | หน้าที่ | สถานะ |
|---|---|---|
| `/` | หน้าโฮมของระบบ | ✅ พร้อมใช้ |
| `/generate-qr` | เปิดโต๊ะ + สร้าง QR Code (พนักงาน) | ✅ พร้อมใช้ |
| `/kitchen` | หน้าจอครัว | ✅ พร้อมใช้ |
| `/order/[table]` | หน้าสั่งอาหารของลูกค้า | ⏳ ขั้นถัดไป |

## Database (Supabase)

- `sessions` (id, table_number, adult_count, child_count, status, created_at)
- `menu_categories` (id, name, sort_order)
- `menu_items` (id, category_id, name)
- `orders` (id, session_id, table_number, items jsonb, status, created_at)

## Environment Variables

| ชื่อ | คำอธิบาย |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL ของโปรเจกต์ Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key ของ Supabase |

รันในเครื่องใส่ใน `.env.local` ส่วนบน Vercel ให้ตั้งที่ **Project Settings → Environment Variables**

## คำสั่งที่ใช้

```bash
npm install
npm run dev     # รันโหมดพัฒนา
npm run build   # build สำหรับ production
npm run start   # รัน production
```
