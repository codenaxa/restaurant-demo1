import { z } from "zod";

import { siteConfig } from "@/lib/site";

export const reservationGuestOptions = [1, 2, 4, 6, 8] as const;

function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, "0");
  const day = `${today.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isValidReservationDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  return !Number.isNaN(new Date(`${value}T12:00:00`).getTime());
}

export const reservationSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  date: z
    .string()
    .trim()
    .min(1, "Please select a reservation date.")
    .refine(isValidReservationDate, "Please choose a valid reservation date.")
    .refine(
      (value) => value >= getTodayDateString(),
      "Please choose today or a future date."
    ),
  guests: z.coerce
    .number()
    .int()
    .refine(
      (value) =>
        reservationGuestOptions.includes(
          value as (typeof reservationGuestOptions)[number]
        ),
      "Please choose a valid guest count."
    ),
  tableNumber: z.coerce
    .number()
    .int()
    .refine(
      (value) => siteConfig.tableNumbers.includes(value),
      "Please choose a valid table number."
    ),
  time: z
    .string()
    .trim()
    .refine(
      (value) => siteConfig.reservationTimes.includes(value),
      "Please choose a valid reservation slot."
    )
});

export type ReservationInput = z.output<typeof reservationSchema>;
export type ReservationFieldErrors = Partial<Record<keyof ReservationInput, string>>;

export function getReservationFieldErrors(
  error: z.ZodError<ReservationInput>
): ReservationFieldErrors {
  const fieldErrors = error.flatten().fieldErrors;

  return {
    name: fieldErrors.name?.[0],
    date: fieldErrors.date?.[0],
    guests: fieldErrors.guests?.[0],
    tableNumber: fieldErrors.tableNumber?.[0],
    time: fieldErrors.time?.[0]
  };
}
