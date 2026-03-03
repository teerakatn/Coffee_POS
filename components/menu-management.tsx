"use client"

import { useState } from "react"
import { categories, type MenuItem, type Category } from "@/lib/store"
import { useAppStore } from "@/lib/app-store"
import { formatPrice } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Pencil, Trash2, Search } from "lucide-react"

export function MenuManagement() {
  // ── Global state (persists across page changes) ───────────────────────────
  const items                    = useAppStore((s) => s.menuItems)
  const addMenuItem              = useAppStore((s) => s.addMenuItem)
  const updateMenuItem           = useAppStore((s) => s.updateMenuItem)
  const deleteMenuItem           = useAppStore((s) => s.deleteMenuItem)
  const toggleMenuItemAvailability = useAppStore((s) => s.toggleMenuItemAvailability)

  // ── Ephemeral UI state ────────────────────────────────────────────────────
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [searchQuery,    setSearchQuery]    = useState("")
  const [dialogOpen,     setDialogOpen]     = useState(false)
  const [editingItem,    setEditingItem]    = useState<MenuItem | null>(null)
  const [priceError,     setPriceError]     = useState<string>("")
  const [form, setForm] = useState({ name: "", category: "espresso" as Category, price: "", description: "" })

  const filtered = items.filter((item) => {
    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  function openAdd() {
    setEditingItem(null)
    setForm({ name: "", category: "espresso", price: "", description: "" })
    setPriceError("")
    setDialogOpen(true)
  }

  function openEdit(item: MenuItem) {
    setEditingItem(item)
    setForm({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      description: item.description || "",
    })
    setPriceError("")
    setDialogOpen(true)
  }

  /** Validate and save — price must be a positive integer (Thai Baht, no satang) */
  function saveItem() {
    if (!form.name.trim()) return

    const parsedPrice = parseInt(form.price, 10)
    if (!form.price || isNaN(parsedPrice) || parsedPrice <= 0 || !Number.isInteger(parsedPrice)) {
      setPriceError("กรุณาใส่ราคาเป็นจำนวนเต็มบวก (฿) เช่น 85")
      return
    }
    setPriceError("")

    if (editingItem) {
      updateMenuItem({
        ...editingItem,
        name: form.name.trim(),
        category: form.category,
        price: parsedPrice,
        description: form.description.trim(),
      })
    } else {
      addMenuItem({
        name: form.name.trim(),
        category: form.category,
        price: parsedPrice,
        description: form.description.trim(),
        image: "",
        available: true,
      })
    }
    setDialogOpen(false)
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Menu Items</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{items.length} items total, {items.filter((i) => i.available).length} available</p>
        </div>
        <Button onClick={openAdd} className="gap-1.5">
          <Plus className="size-4" />
          Add Item
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
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
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
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
              <TableHead className="pl-4">Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="pl-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-md bg-muted text-sm font-medium text-muted-foreground">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {item.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium tabular-nums">{formatPrice(item.price)}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.available}
                      onCheckedChange={() => toggleMenuItemAvailability(item.id)}
                    />
                    <span className={`text-xs ${item.available ? "text-success" : "text-muted-foreground"}`}>
                      {item.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right pr-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => openEdit(item)}>
                      <Pencil className="size-3.5" />
                      <span className="sr-only">Edit {item.name}</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" onClick={() => deleteMenuItem(item.id)}>
                      <Trash2 className="size-3.5" />
                      <span className="sr-only">Delete {item.name}</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-sm">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Espresso"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="category" className="text-sm">Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as Category })}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="price" className="text-sm">ราคา (฿)</Label>
              <Input
                id="price"
                type="number"
                step="1"
                min="1"
                value={form.price}
                onChange={(e) => {
                  setForm({ ...form, price: e.target.value })
                  setPriceError("")
                }}
                placeholder="เช่น 85"
                className={priceError ? "border-destructive" : ""}
              />
              {priceError && (
                <p className="text-xs text-destructive">{priceError}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="desc" className="text-sm">Description</Label>
              <Input
                id="desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveItem}>{editingItem ? "Save Changes" : "Add Item"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
