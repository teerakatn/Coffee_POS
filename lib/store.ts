// Centralized mock data and types for the Coffee POS system
// All prices are stored as integer Thai Baht (฿) to avoid floating-point errors

export type Category = "espresso" | "brewed" | "cold" | "tea" | "pastry" | "other"

export interface MenuItem {
  id: string
  name: string
  category: Category
  price: number  // integer Thai Baht (฿)
  image: string
  available: boolean
  description?: string
}

export interface Modifier {
  id: string
  label: string
  group: string
  price: number  // integer Thai Baht (฿)
}

export interface OrderItem {
  menuItem: MenuItem
  quantity: number
  modifiers: Modifier[]
  // subtotal is computed via computeItemSubtotal() in utils — not stored to avoid data inconsistency
}

export interface Order {
  id: string
  number: number
  items: OrderItem[]
  total: number  // integer Thai Baht (฿)
  tax: number    // integer Thai Baht (฿)
  status: "waiting" | "making" | "done" | "paid"
  paymentMethod?: "cash" | "card" | "qr"
  createdAt: Date
}

export interface InventoryItem {
  id: string
  name: string
  unit: string
  quantity: number
  minQuantity: number
  category: string
}

export interface Promotion {
  id: string
  name: string
  type: "bogo" | "discount" | "percentage"
  value: number  // integer Thai Baht for discount, or plain number for percentage
  active: boolean
  startDate: string
  endDate: string
  conditions?: string
}

export const categories: { value: Category; label: string }[] = [
  { value: "espresso", label: "Espresso" },
  { value: "brewed", label: "Brewed" },
  { value: "cold", label: "Cold Drinks" },
  { value: "tea", label: "Tea" },
  { value: "pastry", label: "Pastry" },
  { value: "other", label: "Other" },
]

export const menuItems: MenuItem[] = [
  { id: "1",  name: "Espresso",     category: "espresso", price: 85,  image: "/images/menu/espresso.webp",     available: true,  description: "Rich double shot" },
  { id: "2",  name: "Americano",    category: "espresso", price: 90,  image: "/images/menu/americano.png",    available: true,  description: "Espresso with hot water" },
  { id: "3",  name: "Cappuccino",   category: "espresso", price: 100, image: "/images/menu/cappuccino.webp",   available: true,  description: "Equal parts foam and milk" },
  { id: "4",  name: "Latte",        category: "espresso", price: 110, image: "/images/menu/latte.webp",        available: true,  description: "Steamed milk and espresso" },
  { id: "5",  name: "Flat White",   category: "espresso", price: 105, image: "/images/menu/flat-white.webp",   available: true,  description: "Velvety microfoam" },
  { id: "6",  name: "Mocha",        category: "espresso", price: 120, image: "/images/menu/mocha.webp",        available: true,  description: "Chocolate and espresso" },
  { id: "7",  name: "Drip Coffee",  category: "brewed",   price: 75,  image: "/images/menu/drip.jpg",         available: true,  description: "House blend" },
  { id: "8",  name: "Pour Over",    category: "brewed",   price: 100, image: "/images/menu/pour.webp",     available: true,  description: "Single origin" },
  { id: "9",  name: "French Press", category: "brewed",   price: 90,  image: "/images/menu/french-press.png", available: false, description: "Full body" },
  { id: "10", name: "Cold Brew",    category: "cold",     price: 100, image: "/images/menu/cold-brewwebp.webp",    available: true,  description: "20hr steeped" },
  { id: "11", name: "Iced Latte",   category: "cold",     price: 115, image: "/images/menu/iced-latte.webp",   available: true,  description: "Cold milk + espresso" },
  { id: "12", name: "Matcha Latte", category: "tea",      price: 120, image: "/images/menu/matcha.webp",       available: true,  description: "Ceremonial grade" },
  { id: "13", name: "Chai Latte",   category: "tea",      price: 110, image: "/images/menu/chai.jpg",         available: true,  description: "Spiced milk tea" },
  { id: "14", name: "Earl Grey",    category: "tea",      price: 80,  image:"/images/menu/earl-grey.jpeg" ,    available:true , description:"Bergamot citrus"},
  { id:"15" ,name:"Croissant" ,category:"pastry" ,price :85,image:"/images/menu/croissant.webp" ,available:true ,description:"Butter pastry"},
{ id:"16" ,name:"Banana Bread" ,category:"pastry" ,price :90,image:"/images/menu/banana-bread.webp" ,available:true ,description:"Homemade slice"},
]

export const modifiers: Modifier[] = [
  { id: "m1",  label: "Small",         group: "size",      price: 0  },
  { id: "m2",  label: "Medium",        group: "size",      price: 10 },
  { id: "m3",  label: "Large",         group: "size",      price: 20 },
  { id: "m4",  label: "25%",           group: "sweetness", price: 0  },
  { id: "m5",  label: "50%",           group: "sweetness", price: 0  },
  { id: "m6",  label: "100%",          group: "sweetness", price: 0  },
  { id: "m7",  label: "Extra Shot",    group: "extras",    price: 15 },
  { id: "m8",  label: "Oat Milk",      group: "extras",    price: 15 },
  { id: "m9",  label: "Almond Milk",   group: "extras",    price: 15 },
  { id: "m10", label: "Whipped Cream", group: "extras",    price: 10 },
]

export const inventoryItems: InventoryItem[] = [
  { id: "i1",  name: "Espresso Beans",   unit: "kg",  quantity: 12,  minQuantity: 10,  category: "Coffee"    },
  { id: "i2",  name: "Whole Milk",        unit: "L",   quantity: 25,  minQuantity: 15,  category: "Dairy"     },
  { id: "i3",  name: "Oat Milk",          unit: "L",   quantity: 8,   minQuantity: 10,  category: "Dairy"     },
  { id: "i4",  name: "Almond Milk",       unit: "L",   quantity: 3,   minQuantity: 8,   category: "Dairy"     },
  { id: "i5",  name: "Matcha Powder",     unit: "g",   quantity: 200, minQuantity: 300, category: "Tea"       },
  { id: "i6",  name: "Chai Concentrate",  unit: "L",   quantity: 4,   minQuantity: 5,   category: "Tea"       },
  { id: "i7",  name: "Chocolate Syrup",   unit: "L",   quantity: 2,   minQuantity: 3,   category: "Syrups"    },
  { id: "i8",  name: "Vanilla Syrup",     unit: "L",   quantity: 6,   minQuantity: 3,   category: "Syrups"    },
  { id: "i9",  name: "Sugar",             unit: "kg",  quantity: 8,   minQuantity: 10,  category: "Dry Goods" },
  { id: "i10", name: "Cups (12oz)",       unit: "pcs", quantity: 150, minQuantity: 200, category: "Supplies"  },
  { id: "i11", name: "Cups (16oz)",       unit: "pcs", quantity: 80,  minQuantity: 200, category: "Supplies"  },
  { id: "i12", name: "Lids",              unit: "pcs", quantity: 200, minQuantity: 300, category: "Supplies"  },
]

export const promotions: Promotion[] = [
  { id: "p1", name: "Happy Hour BOGO", type: "bogo", value: 0, active: true, startDate: "2026-03-01", endDate: "2026-03-31", conditions: "ซื้อ 1 เมนู Espresso แถมฟรี 1 แก้ว (14:00-17:00)" },
  { id: "p2", name: "Morning 10% Off", type: "percentage", value: 10, active: true, startDate: "2026-03-01", endDate: "2026-04-30", conditions: "ลด 10% ทุกออร์เดอร์ก่อน 9 โมงเช้า" },
  { id: "p3", name: "Pastry Combo", type: "discount", value: 30, active: false, startDate: "2026-04-01", endDate: "2026-04-30", conditions: "ลด ฿30 เมื่อสั่ง Pastry พร้อมเครื่องดื่มใดก็ได้" },
]

// Latte(110) x2 + Medium(+10) + OatMilk(+15) = 270; Croissant(85) x1 = 85 → subtotal 355, tax 18, total 373
// Espresso(85) x1 + ExtraShot(+15) = 100 → subtotal 100, tax 5, total 105
// ColdBrew(100) + Large(+20) = 120; MatchaLatte(120) + Medium(+10) = 130 → subtotal 250, tax 13, total 263
// Cappuccino(100) + Small(+0) = 100 → subtotal 100, tax 5, total 105
// DripCoffee(75) x3 = 225 → subtotal 225, tax 11, total 236
export const sampleOrders: Order[] = [
  {
    id: "o1", number: 101,
    items: [
      { menuItem: menuItems[3], quantity: 2, modifiers: [modifiers[1], modifiers[7]] },
      { menuItem: menuItems[14], quantity: 1, modifiers: [] },
    ],
    total: 373, tax: 18, status: "waiting", createdAt: new Date(Date.now() - 120000),
  },
  {
    id: "o2", number: 102,
    items: [
      { menuItem: menuItems[0], quantity: 1, modifiers: [modifiers[6]] },
    ],
    total: 105, tax: 5, status: "making", createdAt: new Date(Date.now() - 300000),
  },
  {
    id: "o3", number: 103,
    items: [
      { menuItem: menuItems[9], quantity: 1, modifiers: [modifiers[2]] },
      { menuItem: menuItems[11], quantity: 1, modifiers: [modifiers[1]] },
    ],
    total: 263, tax: 13, status: "waiting", createdAt: new Date(Date.now() - 60000),
  },
  {
    id: "o4", number: 104,
    items: [
      { menuItem: menuItems[2], quantity: 1, modifiers: [modifiers[0]] },
    ],
    total: 105, tax: 5, status: "done", paymentMethod: "card", createdAt: new Date(Date.now() - 600000),
  },
  {
    id: "o5", number: 105,
    items: [
      { menuItem: menuItems[6], quantity: 3, modifiers: [] },
    ],
    total: 236, tax: 11, status: "done", paymentMethod: "cash", createdAt: new Date(Date.now() - 900000),
  },
]

export const dailySalesData = [
  { time: "7am",  sales: 3600  },
  { time: "8am",  sales: 8000  },
  { time: "9am",  sales: 10250 },
  { time: "10am", sales: 7000  },
  { time: "11am", sales: 5500  },
  { time: "12pm", sales: 8750  },
  { time: "1pm",  sales: 7250  },
  { time: "2pm",  sales: 4500  },
  { time: "3pm",  sales: 6500  },
  { time: "4pm",  sales: 5000  },
  { time: "5pm",  sales: 4250  },
  { time: "6pm",  sales: 3000  },
]

export const monthlySalesData = [
  { month: "ต.ค.", revenue: 455000 },
  { month: "พ.ย.", revenue: 537500 },
  { month: "ธ.ค.", revenue: 620000 },
  { month: "ม.ค.", revenue: 490000 },
  { month: "ก.พ.", revenue: 557500 },
  { month: "มี.ค.", revenue: 652500 },
]

export const topProducts = [
  { name: "Latte",      orders: 142, revenue: 15620 },
  { name: "Cappuccino", orders: 118, revenue: 11800 },
  { name: "Cold Brew",  orders: 96,  revenue: 9600  },
  { name: "Americano",  orders: 87,  revenue: 7830  },
  { name: "Croissant",  orders: 74,  revenue: 6290  },
]

export const TAX_RATE = 0.05
