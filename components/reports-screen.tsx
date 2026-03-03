"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { dailySalesData, monthlySalesData, topProducts } from "@/lib/store"
import { formatPrice } from "@/lib/utils"
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
  PieChart,
  Pie,
  Cell,
} from "recharts"

const COLORS = [
  "oklch(0.42 0.08 55)",
  "oklch(0.55 0.10 55)",
  "oklch(0.65 0.08 75)",
  "oklch(0.75 0.06 85)",
  "oklch(0.85 0.04 80)",
]

const pieData = topProducts.map((p) => ({
  name: p.name,
  value: p.orders,
}))

export function ReportsScreen() {
  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Reports & Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Track your sales performance and trends</p>
      </div>

      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mt-4">
            {/* Summary cards */}
            <Card>
              <CardContent className="p-5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Sales</p>
                <p className="text-2xl font-bold mt-1 tabular-nums">฿73,600</p>
                <p className="text-xs text-muted-foreground mt-1">วันนี้ (จนถึงตอนนี้)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Peak Hour</p>
                <p className="text-2xl font-bold mt-1">9:00 AM</p>
                <p className="text-xs text-muted-foreground mt-1">฿10,250 ยอดขาย</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Transactions</p>
                <p className="text-2xl font-bold mt-1 tabular-nums">163</p>
                <p className="text-xs text-muted-foreground mt-1">เฉลี่ยเฉลี่ ฿451 ต่อรายการ</p>
              </CardContent>
            </Card>

            {/* Chart */}
            <Card className="lg:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Hourly Sales</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailySalesData}>
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
                      <Bar dataKey="sales" fill="oklch(0.42 0.08 55)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mt-4">
            <Card>
              <CardContent className="p-5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Monthly Revenue</p>
                <p className="text-2xl font-bold mt-1 tabular-nums">฿652,500</p>
                <p className="text-xs text-muted-foreground mt-1">เดือนนี้</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Growth</p>
                <p className="text-2xl font-bold mt-1 tabular-nums text-success">+17.0%</p>
                <p className="text-xs text-muted-foreground mt-1">vs last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">6-Month Total</p>
                <p className="text-2xl font-bold mt-1 tabular-nums">฿3,312,500</p>
                <p className="text-xs text-muted-foreground mt-1">ต..ค. - มี.ค.</p>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlySalesData}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="oklch(0.42 0.08 55)" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="oklch(0.42 0.08 55)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                      <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" tickFormatter={(v) => `฿${(v / 1000).toLocaleString('th-TH')}K`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-card)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        formatter={(value: number) => [`฿${value.toLocaleString('th-TH')}`, "รายได้"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="oklch(0.42 0.08 55)"
                        strokeWidth={2}
                        fill="url(#revenueGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Top Products by Orders</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={50}
                        strokeWidth={2}
                        stroke="var(--color-card)"
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-card)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        formatter={(value: number) => [`${value} orders`]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-2">
                  {pieData.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <div className="size-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-xs text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  {topProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-md text-xs font-bold tabular-nums bg-muted text-muted-foreground">
                        #{index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-sm font-semibold tabular-nums">{formatPrice(product.revenue)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${(product.orders / topProducts[0].orders) * 100}%`,
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground tabular-nums">{product.orders}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
