"use client"

import { useState, useMemo, useCallback } from "react"
import Image from "next/image"
import { categories, modifiers, type MenuItem, type Modifier } from "@/lib/store"
import { useAppStore, selectCartSubtotal } from "@/lib/app-store"
import { formatPrice, computeItemSubtotal } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  QrCode,
  X,
  ShoppingBag,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Modifier groups split out once at module level — they never change
const sizeModifiers      = modifiers.filter((m) => m.group === "size")
const sweetnessModifiers = modifiers.filter((m) => m.group === "sweetness")
const extrasModifiers    = modifiers.filter((m) => m.group === "extras")

export function POSScreen() {
  // ── Ephemeral UI state (fine as local state — these don't need to survive page changes) ──
  const [activeCategory,    setActiveCategory]    = useState<string>("all")
  const [selectedItem,      setSelectedItem]      = useState<MenuItem | null>(null)
  const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>([])

  // ── Global state from Zustand ────────────────────────────────────────────
  const menuItems         = useAppStore((s) => s.menuItems)
  const cartItems         = useAppStore((s) => s.cartItems)
  const addToCart         = useAppStore((s) => s.addToCart)
  const updateCartQuantity = useAppStore((s) => s.updateCartQuantity)
  const removeFromCart    = useAppStore((s) => s.removeFromCart)
  const clearCart         = useAppStore((s) => s.clearCart)
  const handlePayment     = useAppStore((s) => s.handlePayment)

  // ── Derived total (VAT-inclusive pricing — tax is already in the price) ──
  const total = useAppStore(selectCartSubtotal)

  // ── Memoized filtered menu (recalculates only when category or menu list changes) ──
  const filteredItems = useMemo(
    () =>
      menuItems.filter(
        (i) =>
          i.available &&
          (activeCategory === "all" || i.category === activeCategory)
      ),
    [menuItems, activeCategory]
  )

  // ── Callbacks (stable references — won't cause child re-renders) ─────────
  const handleAddToOrder = useCallback((item: MenuItem) => {
    setSelectedItem(item)
    setSelectedModifiers([])
  }, [])

  const handleConfirmAdd = useCallback(() => {
    if (!selectedItem) return
    addToCart(selectedItem, selectedModifiers)
    setSelectedItem(null)
    setSelectedModifiers([])
  }, [selectedItem, selectedModifiers, addToCart])

  const handleToggleModifier = useCallback((mod: Modifier) => {
    if (mod.group === "size" || mod.group === "sweetness") {
      // Radio-style: only one per group
      const groupMods = modifiers.filter((m) => m.group === mod.group)
      setSelectedModifiers((prev) => [
        ...prev.filter((m) => !groupMods.find((gm) => gm.id === m.id)),
        mod,
      ])
    } else {
      // Checkbox-style: toggle individual modifier
      setSelectedModifiers((prev) =>
        prev.find((m) => m.id === mod.id)
          ? prev.filter((m) => m.id !== mod.id)
          : [...prev, mod]
      )
    }
  }, [])

  const handleDismissModal = useCallback(() => {
    setSelectedItem(null)
    setSelectedModifiers([])
  }, [])

  // ── Preview price for the modifier dialog ────────────────────────────────
  const modalTotalPrice = selectedItem
    ? selectedItem.price + selectedModifiers.reduce((s, m) => s + m.price, 0)
    : 0

  return (
    <div className="flex h-[calc(100svh-3.5rem)]">
      {/* Left: Categories + Products */}
      <div className="flex flex-1 flex-col">
        {/* Category bar */}
        <div className="flex items-center gap-2 border-b bg-card px-4 py-3 overflow-x-auto">
          <Button
            variant={activeCategory === "all" ? "default" : "secondary"}
            size="sm"
            className="shrink-0 rounded-full text-xs h-8"
            onClick={() => setActiveCategory("all")}
          >
            All Items
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={activeCategory === cat.value ? "default" : "secondary"}
              size="sm"
              className="shrink-0 rounded-full text-xs h-8"
              onClick={() => setActiveCategory(cat.value)}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Products grid */}
        <ScrollArea className="flex-1 p-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="cursor-pointer overflow-hidden border transition-all hover:shadow-md hover:border-primary/30 active:scale-[0.98]"
                onClick={() => handleAddToOrder(item)}
              >
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                </div>
                <CardContent className="p-3">
                  <p className="text-sm font-medium leading-tight truncate">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{item.description}</p>
                  <p className="text-sm font-semibold text-primary mt-1.5">{formatPrice(item.price)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right: Order panel */}
      <div className="flex w-80 flex-col border-l bg-card lg:w-96">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Current Order</h2>
          </div>
          {cartItems.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground hover:text-destructive"
              onClick={clearCart}
            >
              Clear
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1 px-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingBag className="size-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No items yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Tap a product to add it</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 py-3">
              {cartItems.map((item, index) => {
                // Use stable key based on item identity, not array index
                const itemKey = `${item.menuItem.id}-${item.modifiers.map((m) => m.id).join("-")}`
                return (
                  <div key={itemKey} className="flex flex-col gap-1.5 rounded-lg bg-secondary/50 p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.menuItem.name}</p>
                        {item.modifiers.length > 0 && (
                          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                            {item.modifiers.map((m) => m.label).join(", ")}
                          </p>
                        )}
                      </div>
                      {/* subtotal computed on-the-fly — no stale data possible */}
                      <p className="text-sm font-semibold ml-2 shrink-0">
                        {formatPrice(computeItemSubtotal(item))}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center rounded-md border bg-card">
                        <button
                          className="flex size-7 items-center justify-center hover:bg-muted transition-colors rounded-l-md"
                          onClick={() => updateCartQuantity(index, -1)}
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="flex size-7 items-center justify-center text-xs font-medium tabular-nums border-x">
                          {item.quantity}
                        </span>
                        <button
                          className="flex size-7 items-center justify-center hover:bg-muted transition-colors rounded-r-md"
                          onClick={() => updateCartQuantity(index, 1)}
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <button
                        className="ml-auto flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        onClick={() => removeFromCart(index)}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>

        {/* Order totals + payment */}
        <div className="border-t bg-card px-4 py-3">
          <div className="flex flex-col gap-1.5 text-sm mb-3">
            <div className="flex justify-between font-semibold text-base">
              <span>ยอดสุทธิ</span>
              <span>{formatPrice(total)}</span>
            </div>
            <p className="text-[11px] text-muted-foreground text-right">
              ราคารวม VAT 5% แล้ว
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button
              className="h-11 gap-1.5"
              disabled={cartItems.length === 0}
              onClick={() => handlePayment("cash")}
            >
              <Banknote className="size-4" />
              <span className="text-xs">เงินสด</span>
            </Button>
            <Button
              className="h-11 gap-1.5"
              disabled={cartItems.length === 0}
              onClick={() => handlePayment("card")}
            >
              <CreditCard className="size-4" />
              <span className="text-xs">บัตร</span>
            </Button>
            <Button
              className="h-11 gap-1.5"
              disabled={cartItems.length === 0}
              onClick={() => handlePayment("qr")}
            >
              <QrCode className="size-4" />
              <span className="text-xs">QR</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Modifier Modal Overlay */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40">
          <div className="w-full max-w-md rounded-xl bg-card border shadow-xl mx-4">
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <h3 className="font-semibold">{selectedItem.name}</h3>
                <p className="text-sm text-muted-foreground">{formatPrice(selectedItem.price)}</p>
              </div>
              <button
                className="flex size-8 items-center justify-center rounded-md hover:bg-muted transition-colors"
                onClick={handleDismissModal}
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="p-4 flex flex-col gap-4">
              {/* Size */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">ขนาด</p>
                <div className="flex gap-2">
                  {sizeModifiers.map((m) => (
                    <Button
                      key={m.id}
                      size="sm"
                      variant={selectedModifiers.find((sm) => sm.id === m.id) ? "default" : "outline"}
                      className="flex-1 h-9 text-xs"
                      onClick={() => handleToggleModifier(m)}
                    >
                      {m.label}
                      {m.price > 0 && ` +${formatPrice(m.price)}`}
                    </Button>
                  ))}
                </div>
              </div>
              {/* Sweetness */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">ความหวาน</p>
                <div className="flex gap-2">
                  {sweetnessModifiers.map((m) => (
                    <Button
                      key={m.id}
                      size="sm"
                      variant={selectedModifiers.find((sm) => sm.id === m.id) ? "default" : "outline"}
                      className="flex-1 h-9 text-xs"
                      onClick={() => handleToggleModifier(m)}
                    >
                      {m.label}
                    </Button>
                  ))}
                </div>
              </div>
              {/* Extras */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">เพิ่มเติม</p>
                <div className="grid grid-cols-2 gap-2">
                  {extrasModifiers.map((m) => (
                    <Button
                      key={m.id}
                      size="sm"
                      variant={selectedModifiers.find((sm) => sm.id === m.id) ? "default" : "outline"}
                      className="h-9 text-xs"
                      onClick={() => handleToggleModifier(m)}
                    >
                      {m.label} +{formatPrice(m.price)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t p-4">
              <Button className="w-full h-11" onClick={handleConfirmAdd}>
                <Plus className="size-4 mr-1.5" />
                เพิ่มในออร์เดอร์ — {formatPrice(modalTotalPrice)}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

