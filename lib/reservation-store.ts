import Reservation from "@/lib/models/Reservation";
import { connectToDatabase } from "@/lib/mongodb";
import { siteConfig } from "@/lib/site";
import type { ReservationRecord, ReservationStats } from "@/lib/types";
import { createId } from "@/lib/utils";
import type { ReservationInput } from "@/lib/validators/reservation";

declare global {
  // eslint-disable-next-line no-var
  var maisonEliteReservationStore: ReservationRecord[] | undefined;
}

function hasMongoConfig() {
  return Boolean((process.env.MONGODB_URI || process.env.MONGO_URI)?.trim());
}

function getMemoryStore() {
  if (!global.maisonEliteReservationStore) {
    global.maisonEliteReservationStore = [];
  }

  return global.maisonEliteReservationStore;
}

function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, "0");
  const day = `${today.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getReservationTimeOrder(value: string) {
  const index = siteConfig.reservationTimes.indexOf(value);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function sortReservations(items: ReservationRecord[]) {
  return [...items].sort((a, b) => {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }

    const timeOrder = getReservationTimeOrder(a.time) - getReservationTimeOrder(b.time);

    if (timeOrder !== 0) {
      return timeOrder;
    }

    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

function serializeReservation(doc: {
  _id: { toString(): string };
  name: string;
  date: string;
  guests: number;
  tableNumber?: number;
  time: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}): ReservationRecord {
  return {
    id: doc._id.toString(),
    name: doc.name,
    date: doc.date,
    guests: doc.guests,
    tableNumber: typeof doc.tableNumber === "number" ? doc.tableNumber : 1,
    time: doc.time,
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString()
  };
}

export class ReservationConflictError extends Error {
  constructor(
    public readonly date: string,
    public readonly time: string,
    public readonly tableNumber: number
  ) {
    super(`Table ${tableNumber} is already booked for ${date} at ${time}.`);
    this.name = "ReservationConflictError";
  }
}

export async function listReservations(options?: {
  upcomingOnly?: boolean;
  limit?: number;
  date?: string;
}) {
  const upcomingOnly = options?.upcomingOnly ?? false;
  const limit = options?.limit;
  const selectedDate = options?.date;
  const today = getTodayDateString();

  if (hasMongoConfig()) {
    await connectToDatabase();

    const filter: Record<string, unknown> = {};

    if (selectedDate) {
      filter.date = selectedDate;
    }

    if (upcomingOnly) {
      filter.date = { $gte: today };
    }

    const docs = await Reservation.find(filter).sort({ date: 1, createdAt: 1 }).lean();
    const reservations = sortReservations(docs.map((doc) => serializeReservation(doc as never)));

    return typeof limit === "number" ? reservations.slice(0, limit) : reservations;
  }

  const reservations = sortReservations(
    getMemoryStore().filter((item) => {
      if (selectedDate && item.date !== selectedDate) {
        return false;
      }

      if (upcomingOnly && item.date < today) {
        return false;
      }

      return true;
    })
  );

  return typeof limit === "number" ? reservations.slice(0, limit) : reservations;
}

async function assertReservationSlotAvailability(input: ReservationInput) {
  if (hasMongoConfig()) {
    await connectToDatabase();

    const existing = await Reservation.findOne({
      date: input.date,
      time: input.time,
      tableNumber: input.tableNumber
    })
      .select({ _id: 1 })
      .lean();

    if (existing) {
      throw new ReservationConflictError(input.date, input.time, input.tableNumber);
    }

    return;
  }

  const existing = getMemoryStore().find(
    (item) =>
      item.date === input.date &&
      item.time === input.time &&
      item.tableNumber === input.tableNumber
  );

  if (existing) {
    throw new ReservationConflictError(input.date, input.time, input.tableNumber);
  }
}

export async function createReservation(input: ReservationInput) {
  await assertReservationSlotAvailability(input);

  if (hasMongoConfig()) {
    try {
      const doc = await Reservation.create(input);
      return serializeReservation(doc.toObject());
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000
      ) {
        throw new ReservationConflictError(input.date, input.time, input.tableNumber);
      }

      throw error;
    }
  }

  const now = new Date().toISOString();
  const nextReservation: ReservationRecord = {
    id: createId("reservation"),
    createdAt: now,
    updatedAt: now,
    ...input
  };

  getMemoryStore().push(nextReservation);
  return nextReservation;
}

export async function getReservationStats(): Promise<ReservationStats> {
  const reservations = await listReservations();
  const today = getTodayDateString();

  return {
    totalReservations: reservations.length,
    upcomingReservations: reservations.filter((item) => item.date >= today).length
  };
}
