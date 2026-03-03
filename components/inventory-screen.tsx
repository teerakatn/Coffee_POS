"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/app-store"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Package, Search, AlertTriangle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function InventoryScreen() {
  const inventory = useAppStore((s) => s.inventory)
  const updateInventoryQuantity = useAppStore((s) => s.updateInventoryQuantity)

  const [filterCategory, setFilterCategory] = useState("all")
  const [searchQuery,    setSearchQuery]    = useState("")

  const inventoryCategories = [...new Set(inventory.map((i) => i.category))]
  const lowStockCount = inventory.filter((i) => i.quantity <= i.minQuantity).length

  const filtered = inventory.filter((item) => {
    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    const matchesSearch   = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Inventory</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {inventory.length} ingredients tracked
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Package className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Items</p>
              <p className="text-lg font-bold tabular-nums">{inventory.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
              <Package className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Categories</p>
              <p className="text-lg font-bold tabular-nums">{inventoryCategories.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="size-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Low Stock</p>
              <p className="text-lg font-bold tabular-nums">{lowStockCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 bg-secondary border-0"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40 h-9">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {inventoryCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Ingredient</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => {
              const isLowStock = item.quantity <= item.minQuantity
              return (
                <TableRow key={item.id}>
                  <TableCell className="pl-4">
                    <p className="text-sm font-medium">{item.name}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm tabular-nums font-semibold ${isLowStock ? "text-destructive" : ""}` }>
                      {item.quantity} {item.unit}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={isLowStock ? "destructive" : "outline"}
                      className="text-xs"
                    >
                      {isLowStock ? "Low Stock" : "In Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <Button
                      size="sm"
                      variant={isLowStock ? "default" : "outline"}
                      className="h-7 text-xs gap-1"
                      onClick={() => {
                        const restockAmount = item.minQuantity * 2 - item.quantity
                        updateInventoryQuantity(item.id, restockAmount)
                      }}
                    >
                      <Plus className="size-3" />
                      Restock
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
