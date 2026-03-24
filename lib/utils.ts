import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { CartItem } from "@/lib/types";
import { siteConfig } from "@/lib/site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDateLabel(value: string | null) {
  if (!value) return "No updates yet";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

export function formatReservationDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${value}T12:00:00`));
}

export function buildWhatsAppMessage(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const lines = items.map(
    (item) => `- ${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}`
  );

  return [
    `Hello ${siteConfig.restaurantName} 👋`,
    "",
    "I'd like to place the following order:",
    "",
    ...lines,
    "",
    `*Order Total: ${formatCurrency(subtotal)}*`,
    "",
    "Please confirm availability."
  ].join("\n");
}

export function buildWhatsAppLink(items: CartItem[]) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    buildWhatsAppMessage(items)
  )}`;
}

export function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
