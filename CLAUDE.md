# CLAUDE.md — Sushihana POS

## Project
ระบบ POS และสั่งอาหารผ่าน QR Code สำหรับร้านอาหารญี่ปุ่น "Sushihana" (ซูชิฮานะ)

## Stack
- Next.js (App Router) — **JavaScript เท่านั้น ห้ามใช้ TypeScript**
- Supabase (ฐานข้อมูล) · Deploy บน Vercel (auto-build จาก GitHub)
- ไม่มี `jsconfig.json` → ใช้ **relative import** (เช่น `../../lib/supabaseClient`) ห้ามใช้ `@/`

## กฎสำคัญ (ห้ามลืม)
- **Next.js เวอร์ชันล่าสุด: `params` ของ Dynamic Route เป็น Promise ต้อง unwrap ด้วย `use()` จาก React เสมอ**
  ```js
  "use client";
  import { use } from "react";
  export default function Page({ params }) {
    const { table } = use(params);
  }
  ```
- หน้าที่มี state / useEffect / event handler ต้องขึ้นต้นด้วย `"use client"`
- ตอบและเขียน UI เป็นภาษาไทย

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

`.env.local` ไม่ถูก commit — บน Vercel ต้องตั้งค่าใน Project Settings → Environment Variables แล้ว Redeploy

## Database Schema (Supabase)
- `sessions` (id, table_number, adult_count, child_count, status, created_at)
- `menu_categories` (id, name, sort_order)
- `menu_items` (id, category_id, name)
- `orders` (id, session_id, table_number, items jsonb, status, created_at)

## Routes
- `/` หน้าโฮม
- `/generate-qr` พนักงานเปิดโต๊ะ: ถ้าโต๊ะนั้นมี session `status='open'` อยู่ → เตือน + ปุ่มปิดออเดอร์เก่า (confirm ก่อน, อัปเดตเฉพาะแถวที่ยัง `open`) ไม่เช่นนั้นสร้าง session ใหม่ + QR ชี้ไป `/order/<เลขโต๊ะ>`
- `/kitchen` หน้าจอครัว: แสดง orders ที่ `pending`/`cooking` เลื่อนสถานะได้
- `/order/[table]` หน้าสั่งอาหารลูกค้า (ยังไม่ได้ทำ)

## Workflow การ deploy
เพิ่มไฟล์ผ่านหน้าเว็บ GitHub (Add file → Create new file → พิมพ์ path เต็ม → วางโค้ด → Commit) แล้ว Vercel จะ build ให้อัตโนมัติ
