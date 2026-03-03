"use client"

import { useState, useEffect } from "react"
import { type Order } from "@/lib/store"
import { useAppStore } from "@/lib/app-store"
import { formatPrice, computeItemSubtotal } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Receipt,
  Printer,
  Check,
  CreditCard,
  Banknote,
  QrCode,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function ReceiptScreen() {
  const orders      = useAppStore((s) => s.orders)
  const lastOrderId = useAppStore((s) => s.lastOrderId)

  const completedOrders = orders.filter((o) => o.status === "done" || o.status === "paid")
  const allOrders = [
    ...completedOrders,
    ...orders.filter((o) => o.status !== "done" && o.status !== "paid"),
  ]

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Auto-select the most recently paid order when navigating from POS
  useEffect(() => {
    if (lastOrderId) {
      const last = orders.find((o) => o.id === lastOrderId)
      if (last) setSelectedOrder(last)
    }
  }, [lastOrderId, orders])

  function formatTime(date: Date) {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex h-[calc(100svh-3.5rem)]">
      {/* Order list */}
      <div className="w-80 border-r bg-card flex flex-col lg:w-96">
        <div className="border-b px-4 py-3">
          <h2 className="text-sm font-semibold">Recent Orders</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{allOrders.length} orders</p>
        </div>
        <div className="flex-1 overflow-auto">
          {allOrders.map((order) => (
            <button
              key={order.id}
              className={cn(
                "flex w-full items-center justify-between border-b px-4 py-3 text-left transition-colors hover:bg-muted/50",
                selectedOrder?.id === order.id && "bg-muted/50"
              )}
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary font-bold text-sm tabular-nums">
                  #{order.number}
                </div>
                <div>
                  <p className="text-sm font-medium">{formatPrice(order.total)}</p>
                  <p className="text-xs text-muted-foreground">{formatTime(order.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    order.status === "done" && "border-success bg-success/10 text-success",
                    order.status === "waiting" && "border-warning bg-warning/10 text-warning-foreground",
                    order.status === "making" && "border-primary bg-primary/10 text-primary"
                  )}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
                <ChevronRight className="size-3.5 text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Receipt preview */}
      <div className="flex-1 flex items-center justify-center bg-muted/30 p-6">
        {!selectedOrder ? (
          <div className="text-center">
            <Receipt className="size-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Select an order to view its receipt</p>
          </div>
        ) : (
          <div className="w-full max-w-sm">
            {/* Receipt card */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                {/* Header */}
                <div className="text-center mb-5">
                  <h3 className="text-lg font-bold">BBPOS Coffee</h3>
                  <p className="text-xs text-muted-foreground">123 Coffee Street</p>
                  <p className="text-xs text-muted-foreground">Main Branch</p>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Order #{selectedOrder.number}</span>
                    <span>{formatTime(selectedOrder.createdAt)}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-2 mb-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between text-sm">
                        <span>
                          {item.quantity}x {item.menuItem.name}
                        </span>
                        <span className="tabular-nums font-medium">{formatPrice(computeItemSubtotal(item))}</span>
                      </div>
                      {item.modifiers.length > 0 && (
                        <p className="text-xs text-muted-foreground ml-4">
                          {item.modifiers.map((m) => m.label).join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <Separator className="my-3" />

                {/* Totals */}
                <div className="flex flex-col gap-1.5 text-sm">
                  <div className="flex justify-between font-bold text-base">
                    <span>ยอดสุทธิ</span>
                    <span className="tabular-nums">{formatPrice(selectedOrder.total)}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground text-right mt-0.5">
                    ราคาทุกรายการรวม VAT 5% 
                  </p>
                </div>

                <Separator className="my-3" />

                {/* Payment status */}
                <div className="text-center">
                  {selectedOrder.paymentMethod ? (
                    <div className="flex flex-col items-center gap-1">
                      <Badge className="bg-success/15 text-success border-0 gap-1">
                        <Check className="size-3" />
                        Paid via {selectedOrder.paymentMethod === "card" ? "Card" : selectedOrder.paymentMethod === "cash" ? "Cash" : "QR"}
                      </Badge>
                    </div>
                  ) : (
                    <Badge variant="outline" className="border-warning bg-warning/10 text-warning-foreground">
                      Payment Pending
                    </Badge>
                  )}
                </div>

                <Separator className="my-3" />

                <p className="text-[10px] text-center text-muted-foreground">
                  Thank you for visiting BBPOS Coffee!
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4">
              <Button variant="outline" className="flex-1 gap-1.5">
                <Printer className="size-4" />
                Print Receipt
              </Button>
              {!selectedOrder.paymentMethod && (
                <Button className="flex-1 gap-1.5">
                  <CreditCard className="size-4" />
                  Process Payment
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
