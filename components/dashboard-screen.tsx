"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import {
  dailySalesData,
  topProducts,
} from "@/lib/store"
import { useAppStore } from "@/lib/app-store"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

export function DashboardScreen() {
  const orders    = useAppStore((s) => s.orders)

  const todayRevenue  = 71200
  const todayOrders   = 156
  const avgOrderValue = Math.round(todayRevenue / todayOrders)
  const activeOrders  = orders.filter((o) => o.status === "waiting" || o.status === "making")

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Revenue Today</p>
                <p className="text-2xl font-bold mt-1 tabular-nums">{formatPrice(todayRevenue)}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <ArrowUpRight className="size-3 text-success" />
                  <span className="text-xs font-medium text-success">12.5%</span>
                  <span className="text-xs text-muted-foreground">vs yesterday</span>
                </div>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <DollarSign className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Orders Today</p>
                <p className="text-2xl font-bold mt-1 tabular-nums">{todayOrders}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <ArrowUpRight className="size-3 text-success" />
                  <span className="text-xs font-medium text-success">8.2%</span>
                  <span className="text-xs text-muted-foreground">vs yesterday</span>
                </div>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <ShoppingCart className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg Order Value</p>
                <p className="text-2xl font-bold mt-1 tabular-nums">{formatPrice(avgOrderValue)}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <ArrowDownRight className="size-3 text-destructive" />
                  <span className="text-xs font-medium text-destructive">2.1%</span>
                  <span className="text-xs text-muted-foreground">vs yesterday</span>
                </div>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Orders</p>
                <p className="text-2xl font-bold mt-1 tabular-nums">{activeOrders.length}</p>
                <p className="text-xs text-muted-foreground mt-1.5">orders in queue</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <ShoppingCart className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sales Today</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailySalesData}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.42 0.08 55)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="oklch(0.42 0.08 55)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`฿${value.toLocaleString('th-TH')}`, "ยอดขาย"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="oklch(0.42 0.08 55)"
                    strokeWidth={2}
                    fill="url(#salesGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Best sellers */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Best Sellers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical" margin={{ left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    className="text-muted-foreground"
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="orders" fill="oklch(0.42 0.08 55)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-4">
        {/* Active orders */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <Badge variant="secondary" className="text-xs">{activeOrders.length} orders</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {activeOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary font-bold text-sm tabular-nums">
                      #{order.number}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{order.items.map((i) => i.menuItem.name).join(", ")}</p>
                      <p className="text-xs text-muted-foreground">{order.items.reduce((s, i) => s + i.quantity, 0)} items</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      order.status === "waiting"
                        ? "border-warning bg-warning/10 text-warning-foreground"
                        : "border-primary bg-primary/10 text-primary"
                    }
                  >
                    {order.status === "waiting" ? "Waiting" : "Making"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
