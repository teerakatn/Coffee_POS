"use client"

import { useState, useEffect } from "react"
import { type Order } from "@/lib/store"
import { useAppStore } from "@/lib/app-store"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ChefHat, Check, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function KitchenDisplay() {
  const globalOrders = useAppStore((s) => s.orders)
  // Kitchen keeps its own local copy so it can track status changes independently
  const [orders, setOrders] = useState<Order[]>(
    () => globalOrders.filter((o) => o.status !== "paid")
  )

  // Sync when new orders are added from the POS
  useEffect(() => {
    setOrders((prev) => {
      const prevIds = new Set(prev.map((o) => o.id))
      const newOrders = globalOrders.filter(
        (o) => !prevIds.has(o.id) && o.status !== "paid"
      )
      return newOrders.length > 0 ? [...newOrders, ...prev] : prev
    })
  }, [globalOrders])

  function advanceStatus(orderId: string) {
    setOrders(
      orders.map((o) => {
        if (o.id !== orderId) return o
        if (o.status === "waiting") return { ...o, status: "making" }
        if (o.status === "making") return { ...o, status: "done" }
        return o
      })
    )
  }

  function dismissOrder(orderId: string) {
    setOrders(orders.filter((o) => o.id !== orderId))
  }

  const waitingOrders = orders.filter((o) => o.status === "waiting")
  const makingOrders = orders.filter((o) => o.status === "making")
  const doneOrders = orders.filter((o) => o.status === "done")

  function getTimeSince(date: Date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m ago`
  }

  const columns = [
    { title: "Waiting", icon: Clock, orders: waitingOrders, color: "text-warning" },
    { title: "Making", icon: ChefHat, orders: makingOrders, color: "text-primary" },
    { title: "Done", icon: Check, orders: doneOrders, color: "text-success" },
  ]

  return (
    <div className="p-6 flex flex-col gap-6 h-[calc(100svh-3.5rem)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Kitchen Display</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Live order queue for the barista station</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1.5 py-1">
            <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" /><span className="relative inline-flex size-2 rounded-full bg-success" /></span>
            Live
          </Badge>
          <Badge variant="outline" className="py-1 tabular-nums">{orders.length} active orders</Badge>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
        {columns.map((col) => (
          <div key={col.title} className="flex flex-col rounded-xl border bg-card">
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <col.icon className={cn("size-4", col.color)} />
              <h2 className="text-sm font-semibold">{col.title}</h2>
              <Badge variant="secondary" className="ml-auto text-xs tabular-nums">{col.orders.length}</Badge>
            </div>
            <div className="flex-1 overflow-auto p-3 flex flex-col gap-3">
              {col.orders.length === 0 ? (
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-sm text-muted-foreground">No orders</p>
                </div>
              ) : (
                col.orders.map((order) => (
                  <Card key={order.id} className="border shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center rounded-md bg-primary/10 text-primary font-bold text-sm px-2 py-1 tabular-nums">
                            #{order.number}
                          </span>
                          <span className="text-xs text-muted-foreground">{getTimeSince(order.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 mb-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-start justify-between text-sm">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">
                                {item.quantity}x {item.menuItem.name}
                              </p>
                              {item.modifiers.length > 0 && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {item.modifiers.map((m) => m.label).join(", ")}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {order.status === "done" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-9 text-xs gap-1.5"
                          onClick={() => dismissOrder(order.id)}
                        >
                          <Check className="size-3.5" />
                          Picked Up
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="w-full h-9 text-xs gap-1.5"
                          onClick={() => advanceStatus(order.id)}
                        >
                          <ArrowRight className="size-3.5" />
                          {order.status === "waiting" ? "Start Making" : "Mark Done"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
