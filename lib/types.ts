export const menuCategories = [
  "Starters",
  "Mains",
  "Desserts",
  "Drinks",
  "Tasting Menu"
] as const;

export type MenuCategory = (typeof menuCategories)[number];

export interface MenuItemRecord {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  emoji: string;
  tag?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem extends MenuItemRecord {
  quantity: number;
}

export interface MenuStats {
  totalItems: number;
  featuredItems: number;
  categories: number;
  lastUpdated: string | null;
}

export interface ReservationRecord {
  id: string;
  name: string;
  date: string;
  guests: number;
  tableNumber: number;
  time: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationStats {
  totalReservations: number;
  upcomingReservations: number;
}
