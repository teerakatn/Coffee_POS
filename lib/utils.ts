import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { OrderItem } from './store'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format integer Thai Baht price to display string (e.g. 1500 → "฿1,500")
 * All prices are stored as integer Baht to avoid floating-point errors.
 */
export function formatPrice(amount: number): string {
  return `฿${amount.toLocaleString('th-TH')}`
}

/**
 * Compute the subtotal for a single OrderItem.
 * Calculated on-the-fly instead of stored on the object to avoid data inconsistency.
 */
export function computeItemSubtotal(item: OrderItem): number {
  const modTotal = item.modifiers.reduce((s, m) => s + m.price, 0)
  return item.quantity * (item.menuItem.price + modTotal)
}
