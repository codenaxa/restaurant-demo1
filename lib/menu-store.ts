import MenuItem from "@/lib/models/MenuItem";
import { connectToDatabase } from "@/lib/mongodb";
import { seedMenu } from "@/lib/seed-menu";
import type { MenuItemRecord, MenuStats } from "@/lib/types";
import { createId } from "@/lib/utils";
import type { MenuItemInput, MenuItemUpdateInput } from "@/lib/validators/menu-item";

declare global {
  // eslint-disable-next-line no-var
  var maisonEliteMenuStore: MenuItemRecord[] | undefined;
}

function hasMongoConfig() {
  return Boolean((process.env.MONGODB_URI || process.env.MONGO_URI)?.trim());
}

function getMemoryStore() {
  if (!global.maisonEliteMenuStore) {
    global.maisonEliteMenuStore = seedMenu.map((item) => ({ ...item }));
  }

  return global.maisonEliteMenuStore;
}

function sortItems(items: MenuItemRecord[]) {
  return [...items].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }

    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

function serializeMenuItem(doc: {
  _id: { toString(): string };
  name: string;
  description: string;
  price: number;
  category: MenuItemRecord["category"];
  emoji: string;
  image?: string;
  tag?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}): MenuItemRecord {
  return {
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description,
    price: doc.price,
    category: doc.category,
    emoji: doc.emoji,
    image: doc.image,
    tag: doc.tag,
    isAvailable: doc.isAvailable,
    isFeatured: doc.isFeatured,
    sortOrder: doc.sortOrder,
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString()
  };
}

export async function listMenuItems(options?: {
  includeUnavailable?: boolean;
  featuredOnly?: boolean;
}) {
  const includeUnavailable = options?.includeUnavailable ?? false;
  const featuredOnly = options?.featuredOnly ?? false;

  if (hasMongoConfig()) {
    await connectToDatabase();

    const filter: Record<string, unknown> = {};

    if (!includeUnavailable) {
      filter.isAvailable = true;
    }

    if (featuredOnly) {
      filter.isFeatured = true;
    }

    const docs = await MenuItem.find(filter).sort({ sortOrder: 1, createdAt: 1 }).lean();

    return docs.map((doc) => serializeMenuItem(doc as never));
  }

  return sortItems(
    getMemoryStore().filter((item) => {
      if (!includeUnavailable && !item.isAvailable) {
        return false;
      }

      if (featuredOnly && !item.isFeatured) {
        return false;
      }

      return true;
    })
  );
}

export async function createMenuItem(input: MenuItemInput) {
  if (hasMongoConfig()) {
    await connectToDatabase();
    const doc = await MenuItem.create(input);
    return serializeMenuItem(doc.toObject());
  }

  const now = new Date().toISOString();
  const nextItem: MenuItemRecord = {
    id: createId("menu"),
    createdAt: now,
    updatedAt: now,
    ...input
  };

  getMemoryStore().push(nextItem);
  return nextItem;
}

export async function updateMenuItem(id: string, input: MenuItemUpdateInput) {
  if (hasMongoConfig()) {
    await connectToDatabase();
    const doc = await MenuItem.findByIdAndUpdate(id, input, {
      new: true,
      runValidators: true
    }).lean();

    return doc ? serializeMenuItem(doc as never) : null;
  }

  const store = getMemoryStore();
  const index = store.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  const updated: MenuItemRecord = {
    ...store[index],
    ...input,
    updatedAt: new Date().toISOString()
  };

  store[index] = updated;
  return updated;
}

export async function deleteMenuItem(id: string, hardDelete = false) {
  if (hasMongoConfig()) {
    await connectToDatabase();

    if (hardDelete) {
      const deleted = await MenuItem.findByIdAndDelete(id).lean();
      return deleted ? serializeMenuItem(deleted as never) : null;
    }

    const doc = await MenuItem.findByIdAndUpdate(
      id,
      { isAvailable: false },
      { new: true, runValidators: true }
    ).lean();

    return doc ? serializeMenuItem(doc as never) : null;
  }

  const store = getMemoryStore();
  const index = store.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  const current = store[index];

  if (hardDelete) {
    store.splice(index, 1);
    return current;
  }

  const updated = {
    ...current,
    isAvailable: false,
    updatedAt: new Date().toISOString()
  };

  store[index] = updated;
  return updated;
}

export async function getMenuStats(): Promise<MenuStats> {
  const items = await listMenuItems({ includeUnavailable: true });

  return {
    totalItems: items.length,
    featuredItems: items.filter((item) => item.isFeatured).length,
    categories: new Set(items.map((item) => item.category)).size,
    lastUpdated:
      items
        .slice()
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )[0]?.updatedAt || null
  };
}
