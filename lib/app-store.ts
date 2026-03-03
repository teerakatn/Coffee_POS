/**
 * Global Zustand store — solves the problem of state being lost when the user
 * navigates between pages (each component was previously unmounted/remounted,
 * destroying all local state inside it).
 *
 * Everything that must survive a page change lives here.
 */

import { create } from "zustand"
import {
  menuItems as initialMenuItems,
  modifiers,
  sampleOrders,
  inventoryItems as initialInventory,
  promotions as initialPromotions,
  type MenuItem,
  type Modifier,
  type OrderItem,
  type Order,
  type InventoryItem,
  type Promotion,
  type Category,
} from "./store"
import { computeItemSubtotal } from "./utils"

export type Page =
  | "pos"
  | "dashboard"
  | "menu"
  | "inventory"
  | "reports"
  | "promotions"
  | "receipt"

interface AppState {
  // ── Navigation ──────────────────────────────────────────────────────────
  activePage: Page
  setActivePage: (page: Page) => void

  // ── Menu Items ──────────────────────────────────────────────────────────
  menuItems: MenuItem[]
  addMenuItem: (item: Omit<MenuItem, "id">) => void
  updateMenuItem: (item: MenuItem) => void
  deleteMenuItem: (id: string) => void
  toggleMenuItemAvailability: (id: string) => void

  // ── Cart (current POS session) ──────────────────────────────────────────
  cartItems: OrderItem[]
  /**
   * Adds an item to the cart.
   * If the exact same item + modifiers already exists, increments quantity instead.
   */
  addToCart: (menuItem: MenuItem, mods: Modifier[]) => void
  updateCartQuantity: (index: number, delta: number) => void
  removeFromCart: (index: number) => void
  clearCart: () => void

  // ── Orders ──────────────────────────────────────────────────────────────
  orders: Order[]
  /**
   * Completes a payment: creates an Order from the current cart, saves it,
   * clears the cart, and navigates to the receipt screen.
   */
  handlePayment: (method: "cash" | "card" | "qr") => void
  /** The most recently created order (used by ReceiptScreen to auto-select). */
  lastOrderId: string | null

  // ── Inventory ───────────────────────────────────────────────────────────
  inventory: InventoryItem[]
  updateInventoryQuantity: (id: string, amount: number) => void

  // ── Promotions ──────────────────────────────────────────────────────────
  promotions: Promotion[]
  addPromotion: (promo: Omit<Promotion, "id">) => void
  togglePromotion: (id: string) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  // ── Navigation ──────────────────────────────────────────────────────────
  activePage: "pos",
  setActivePage: (page) => set({ activePage: page }),

  // ── Menu Items ──────────────────────────────────────────────────────────
  menuItems: initialMenuItems,

  addMenuItem: (item) =>
    set((state) => ({
      menuItems: [
        ...state.menuItems,
        { ...item, id: `menu-${Date.now()}` },
      ],
    })),

  updateMenuItem: (updated) =>
    set((state) => ({
      menuItems: state.menuItems.map((i) =>
        i.id === updated.id ? updated : i
      ),
    })),

  deleteMenuItem: (id) =>
    set((state) => ({
      menuItems: state.menuItems.filter((i) => i.id !== id),
    })),

  toggleMenuItemAvailability: (id) =>
    set((state) => ({
      menuItems: state.menuItems.map((i) =>
        i.id === id ? { ...i, available: !i.available } : i
      ),
    })),

  // ── Cart ────────────────────────────────────────────────────────────────
  cartItems: [],

  addToCart: (menuItem, mods) =>
    set((state) => {
      const modsKey = mods
        .map((m) => m.id)
        .sort()
        .join(",")

      const existingIndex = state.cartItems.findIndex((item) => {
        const itemKey = item.modifiers
          .map((m) => m.id)
          .sort()
          .join(",")
        return item.menuItem.id === menuItem.id && itemKey === modsKey
      })

      if (existingIndex !== -1) {
        // Same item + same modifiers → just increment quantity
        const updated = state.cartItems.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        return { cartItems: updated }
      }

      // New unique combination → add to cart
      return {
        cartItems: [
          ...state.cartItems,
          { menuItem, quantity: 1, modifiers: mods },
        ],
      }
    }),

  updateCartQuantity: (index, delta) =>
    set((state) => {
      const updated = state.cartItems
        .map((item, i) => {
          if (i !== index) return item
          const newQty = item.quantity + delta
          return newQty <= 0 ? null : { ...item, quantity: newQty }
        })
        .filter(Boolean) as OrderItem[]
      return { cartItems: updated }
    }),

  removeFromCart: (index) =>
    set((state) => ({
      cartItems: state.cartItems.filter((_, i) => i !== index),
    })),

  clearCart: () => set({ cartItems: [] }),

  // ── Orders ──────────────────────────────────────────────────────────────
  orders: sampleOrders,
  lastOrderId: null,

  handlePayment: (method) => {
    const { cartItems, orders } = get()
    if (cartItems.length === 0) return

    const subtotal = cartItems.reduce(
      (sum, item) => sum + computeItemSubtotal(item),
      0
    )
    const tax = 0
    const total = subtotal

    const newOrder: Order = {
      id: `o-${Date.now()}`,
      number: 100 + orders.length + 1,
      items: cartItems,
      total,
      tax,
      status: "paid",
      paymentMethod: method,
      createdAt: new Date(),
    }

    set((state) => ({
      orders: [newOrder, ...state.orders],
      lastOrderId: newOrder.id,
      cartItems: [],
      activePage: "receipt",
    }))
  },

  // ── Inventory ───────────────────────────────────────────────────────────
  inventory: initialInventory,
  updateInventoryQuantity: (id: string, amount: number) =>
    set((state) => ({
      inventory: state.inventory.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + amount) }
          : item
      ),
    })),

  // ── Promotions ──────────────────────────────────────────────────────────
  promotions: initialPromotions,

  addPromotion: (promo) =>
    set((state) => ({
      promotions: [
        ...state.promotions,
        { ...promo, id: `p-${Date.now()}` },
      ],
    })),

  togglePromotion: (id) =>
    set((state) => ({
      promotions: state.promotions.map((p) =>
        p.id === id ? { ...p, active: !p.active } : p
      ),
    })),
}))

// ── Derived selectors (keep components clean) ──────────────────────────────
export const selectActiveOrderCount = (state: AppState) =>
  state.orders.filter(
    (o) => o.status === "waiting" || o.status === "making"
  ).length

export const selectCartSubtotal = (state: AppState) =>
  state.cartItems.reduce((sum, item) => sum + computeItemSubtotal(item), 0)
