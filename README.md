# ☕ BrewPOS — ระบบจัดการร้านกาแฟ

ระบบ Point-of-Sale สำหรับร้านกาแฟ พัฒนาด้วย Next.js, TypeScript, Tailwind CSS และ shadcn/ui

---

## 📋 สารบัญ

- [การติดตั้ง](#การติดตั้ง)
- [การเริ่มใช้งาน](#การเริ่มใช้งาน)
- [หน้าจอต่าง ๆ](#หน้าจอต่าง-ๆ)
  - [Point of Sale (POS)](#1-point-of-sale-pos)
  - [Checkout / ใบเสร็จ](#2-checkout--ใบเสร็จ)
  - [Dashboard](#3-dashboard)
  - [Reports](#4-reports)
  - [Menu Items](#5-menu-items)
  - [Inventory](#6-inventory)
  - [Promotions](#7-promotions)
- [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
- [เทคโนโลยีที่ใช้](#เทคโนโลยีที่ใช้)

---

## การติดตั้ง

ต้องการ **Node.js 18+** และ **npm** หรือ **yarn**

```bash
# 1. ติดตั้ง dependencies
npm install

# 2. รันในโหมด development
npm run dev
```

เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

### คำสั่งอื่น ๆ

| คำสั่ง | คำอธิบาย |
|---|---|
| `npm run dev` | รันในโหมด development (hot-reload) |
| `npm run build` | Build สำหรับ production |
| `npm run start` | รัน production build |
| `npm run lint` | ตรวจสอบ code ด้วย ESLint |

---

## การเริ่มใช้งาน

เมื่อเปิดแอปจะแสดง **Sidebar** ด้านซ้าย ประกอบด้วย 3 กลุ่ม:

| กลุ่ม | เมนู |
|---|---|
| **Operations** | Point of Sale, Checkout |
| **Analytics** | Dashboard, Reports |
| **Management** | Menu Items, Inventory, Promotions |

คลิกที่รายการใน Sidebar เพื่อสลับหน้าจอ — ข้อมูลในแต่ละหน้าจะ**ไม่สูญหาย**เมื่อเปลี่ยนหน้า

---

## หน้าจอต่าง ๆ

### 1. Point of Sale (POS)

หน้าจอหลักสำหรับรับออเดอร์

**ขั้นตอนการรับออเดอร์:**

1. เลือก **หมวดหมู่** เครื่องดื่มที่ด้านบน (All, Espresso, Filter, etc.)
2. คลิกรายการเมนูที่ต้องการ → กล่อง dialog จะขึ้นมาให้เลือก **ตัวเลือกพิเศษ** เช่น ขนาด, Extra Shot, นมทางเลือก
3. กด **เพิ่มในออเดอร์** เพื่อใส่ลงตะกร้า
4. ในส่วน **Order Summary** ด้านขวา:
   - ปรับจำนวน (+ / −) หรือลบรายการได้
   - ดูยอดรวม, VAT 5%, และยอดสุทธิ
5. เลือกวิธีชำระเงิน: **เงินสด / บัตร / QR**
6. ระบบจะสร้างออเดอร์อัตโนมัติ → นำทางไปหน้า **Checkout** เพื่อพิมพ์ใบเสร็จ

> ราคาทุกรายการแสดงเป็น **บาท (฿)** และ**รวม VAT 5% แล้ว**

---

### 2. Checkout / ใบเสร็จ

หน้าแสดงและพิมพ์ใบเสร็จ

- เมื่อชำระเงินจาก POS แล้ว ระบบจะนำทางมาหน้านี้อัตโนมัติและเลือกออเดอร์ล่าสุด
- เลือก order จาก dropdown ด้านบนเพื่อดูใบเสร็จย้อนหลัง
- ใบเสร็จแสดง: รายการสินค้า, ตัวเลือกพิเศษ, ราคา, ยอดสุทธิ, วิธีชำระ
- แสดงข้อความ **"ราคาทุกรายการรวม VAT 5% แล้ว"** บนใบเสร็จ

---

### 3. Dashboard

ภาพรวมยอดขายและสถานะร้าน

| การ์ด | ข้อมูลที่แสดง |
|---|---|
| Revenue Today | ยอดขายวันนี้ |
| Orders Today | จำนวนออเดอร์ทั้งหมด |
| Avg Order Value | ค่าเฉลี่ยต่อออเดอร์ |
| Low Stock Items | สินค้าที่ใกล้หมด (live จาก Inventory) |

- กราฟ **Sales Today** แสดงยอดขายรายชั่วโมง
- ส่วน **Active Orders** แสดงออเดอร์ที่ยังไม่เสร็จ (ดึงข้อมูลจริงจาก Zustand store)

---

### 4. Reports

รายงานยอดขายเชิงลึก

- **Today's Performance**: ยอดขายรวม, Peak Hour, Monthly Total, 6-Month Total
- **Hourly Sales Chart**: กราฟยอดขายรายชั่วโมง (Bar Chart)
- **Monthly Trend**: กราฟแนวโน้มรายเดือน (Line Chart)
- **Top Products**: สินค้าขายดี พร้อมรายได้และเปอร์เซ็นต์

---

### 5. Menu Items

จัดการรายการเมนู (เพิ่ม / แก้ไข / ลบ)

**เพิ่มเมนูใหม่:**
1. กรอกฟอร์มด้านขวา: ชื่อ, หมวดหมู่, ราคา (฿, จำนวนเต็มบวก), คำอธิบาย
2. กด **Add Item**

**แก้ไขเมนู:**
- คลิกไอคอนดินสอ (✏️) บนการ์ดเมนู → ฟอร์มจะโหลดข้อมูลเดิม → แก้ไข → กด **Update Item**

**ลบเมนู:**
- คลิกไอคอนถังขยะ (🗑️) บนการ์ดเมนู

**เปิด/ปิดเมนู:**
- Toggle สวิตช์ **Available** บนการ์ด → เมนูที่ปิดจะไม่แสดงใน POS

> ราคาต้องเป็น **จำนวนเต็มบวก** เท่านั้น เช่น `85`, `110` (ไม่รับทศนิยม)

---

### 6. Inventory

ตรวจสอบและจัดการสต็อกวัตถุดิบ

- ตาราง แสดงรายการ, จำนวนคงเหลือ, จำนวนขั้นต่ำ, หน่วย, Supplier
- รายการที่ **ต่ำกว่า minimum stock** จะแสดงสถานะ **Low Stock** (สีแดง/เหลือง)
- กด **Restock** เพื่อเติมสต็อก (+50 หน่วย)
- จำนวน Low Stock Items จะอัปเดต badge บน Sidebar และ Dashboard แบบ real-time

---

### 7. Promotions

จัดการโปรโมชัน/ส่วนลด

**ประเภทโปรโมชัน:**
| Type | ความหมาย |
|---|---|
| `percentage` | ลด % จากราคารวม |
| `fixed` | ลดจำนวนเงินคงที่ (฿) |
| `bogo` | Buy One Get One |

**เพิ่มโปรโมชัน:**
1. กรอก ชื่อ, ประเภท, มูลค่า, เงื่อนไข
2. กด **Add Promotion**

**เปิด/ปิดโปรโมชัน:**
- คลิก Toggle สวิตช์บนการ์ดโปรโมชัน

---

## โครงสร้างโปรเจกต์

```
Coffee_POS/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Entry point → AppShell
├── components/
│   ├── app-shell.tsx       # Layout หลัก + Sidebar navigation
│   ├── pos-screen.tsx      # หน้าจอ POS
│   ├── receipt-screen.tsx  # ใบเสร็จ
│   ├── dashboard-screen.tsx# Dashboard
│   ├── reports-screen.tsx  # รายงาน
│   ├── menu-management.tsx # จัดการเมนู
│   ├── inventory-screen.tsx# จัดการสต็อก
│   ├── promotions-screen.tsx # โปรโมชัน
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── app-store.ts        # Zustand global store (state หลักทั้งหมด)
│   ├── store.ts            # Type definitions + seed data
│   └── utils.ts            # formatPrice(), computeItemSubtotal()
└── hooks/                  # Custom React hooks
```

---

## เทคโนโลยีที่ใช้

| เทคโนโลยี | เวอร์ชัน | บทบาท |
|---|---|---|
| [Next.js](https://nextjs.org/) | 15 | React framework |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | 3 | Styling |
| [shadcn/ui](https://ui.shadcn.com/) | latest | UI components |
| [Zustand](https://zustand-demo.pmnd.rs/) | 5 | Global state management |
| [Recharts](https://recharts.org/) | 2 | Charts & graphs |
| [Lucide React](https://lucide.dev/) | latest | Icons |

---

## หมายเหตุสำหรับนักพัฒนา

- **ราคาสินค้า** เก็บเป็น `number` หน่วยบาท (จำนวนเต็ม) — **รวม VAT 5% แล้ว** ไม่มี floating-point
- **State** ทั้งหมดอยู่ใน `lib/app-store.ts` (Zustand) — ไม่สูญหายเมื่อสลับหน้า
- **`formatPrice(n)`** → แปลงตัวเลขเป็น `฿1,234` สำหรับแสดงผล
- **`computeItemSubtotal(item)`** → คำนวณยอดต่อรายการ (ราคา + modifier) × จำนวน
- ยอดสุทธิ = ยอดรวมราคา (ไม่บวก VAT เพิ่ม เนื่องจากราคาในเมนูรวม VAT แล้วทั้งหมด)
