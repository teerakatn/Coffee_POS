"use client"

import { useState } from "react"
import { type Promotion } from "@/lib/store"
import { useAppStore } from "@/lib/app-store"
import { formatPrice } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Tag, Calendar, Percent, Gift } from "lucide-react"

export function PromotionsScreen() {
  // ── Global state ─────────────────────────────────────────────────────────
  const promos       = useAppStore((s) => s.promotions)
  const addPromotion = useAppStore((s) => s.addPromotion)
  const togglePromo  = useAppStore((s) => s.togglePromotion)

  // ── Ephemeral UI state ───────────────────────────────────────────────
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    type: "percentage" as Promotion["type"],
    value: "",
    startDate: "",
    endDate: "",
    conditions: "",
  })

  function togglePromotion(id: string) {
    togglePromo(id)
  }

  function addPromo() {
    if (!form.name) return
    addPromotion({
      name: form.name,
      type: form.type,
      value: parseFloat(form.value) || 0,
      active: true,
      startDate: form.startDate,
      endDate: form.endDate,
      conditions: form.conditions,
    })
    setDialogOpen(false)
    setForm({ name: "", type: "percentage", value: "", startDate: "", endDate: "", conditions: "" })
  }

  function getIcon(type: Promotion["type"]) {
    switch (type) {
      case "bogo": return Gift
      case "discount": return Tag
      case "percentage": return Percent
    }
  }

  function getTypeLabel(type: Promotion["type"]) {
    switch (type) {
      case "bogo": return "Buy 1 Get 1"
      case "discount": return "Fixed Discount"
      case "percentage": return "Percentage Off"
    }
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Promotions</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {promos.filter((p) => p.active).length} active promotions
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-1.5">
          <Plus className="size-4" />
          New Promotion
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Tag className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Promotions</p>
              <p className="text-lg font-bold tabular-nums">{promos.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-success/10">
              <Tag className="size-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="text-lg font-bold tabular-nums">{promos.filter((p) => p.active).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <Tag className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Inactive</p>
              <p className="text-lg font-bold tabular-nums">{promos.filter((p) => !p.active).length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Promotions list */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {promos.map((promo) => {
          const Icon = getIcon(promo.type)
          return (
            <Card key={promo.id} className={promo.active ? "" : "opacity-60"}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{promo.name}</p>
                      <Badge variant="secondary" className="text-[10px] mt-0.5">{getTypeLabel(promo.type)}</Badge>
                    </div>
                  </div>
                  <Switch checked={promo.active} onCheckedChange={() => togglePromotion(promo.id)} />
                </div>
                {promo.value > 0 && (
                  <p className="text-lg font-bold text-primary mb-2">
                    {promo.type === "percentage" ? `${promo.value}% Off` : `${formatPrice(promo.value)} Off`}
                  </p>
                )}
                {promo.conditions && (
                  <p className="text-xs text-muted-foreground mb-3">{promo.conditions}</p>
                )}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="size-3" />
                  <span>{promo.startDate} - {promo.endDate}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add promotion dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Promotion</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label className="text-sm">Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Weekend Special"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm">Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Promotion["type"] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bogo">Buy 1 Get 1</SelectItem>
                  <SelectItem value="discount">Fixed Discount</SelectItem>
                  <SelectItem value="percentage">Percentage Off</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.type !== "bogo" && (
              <div className="flex flex-col gap-2">
                <Label className="text-sm">{form.type === "percentage" ? "Percentage" : "Discount Amount"}</Label>
                <Input
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  placeholder={form.type === "percentage" ? "e.g. 10" : "e.g. 2.50"}
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label className="text-sm">Start Date</Label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-sm">End Date</Label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm">Conditions</Label>
              <Input
                value={form.conditions}
                onChange={(e) => setForm({ ...form, conditions: e.target.value })}
                placeholder="e.g. Valid on weekdays only"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={addPromo}>Create Promotion</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
