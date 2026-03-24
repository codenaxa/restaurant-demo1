import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import {
  createReservation,
  listReservations,
  ReservationConflictError
} from "@/lib/reservation-store";
import {
  getReservationFieldErrors,
  reservationSchema
} from "@/lib/validators/reservation";

const reservationDateQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (date) {
    const parsedDate = reservationDateQuerySchema.safeParse({ date });

    if (!parsedDate.success) {
      return NextResponse.json({ error: "Invalid reservation date." }, { status: 400 });
    }

    const reservations = await listReservations({ date: parsedDate.data.date });

    return NextResponse.json({
      bookedSlots: reservations.map((reservation) => ({
        tableNumber: reservation.tableNumber,
        time: reservation.time
      }))
    });
  }

  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reservations = await listReservations({ upcomingOnly: true, limit: 20 });

  return NextResponse.json({ reservations });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const parsed = reservationSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please correct the reservation form.",
          fieldErrors: getReservationFieldErrors(parsed.error)
        },
        { status: 400 }
      );
    }

    const reservation = await createReservation(parsed.data);

    return NextResponse.json({ reservation }, { status: 201 });
  } catch (error) {
    if (error instanceof ReservationConflictError) {
      return NextResponse.json(
        {
          error: `Table ${error.tableNumber} is sold out for ${error.time} on ${error.date}.`,
          fieldErrors: {
            tableNumber: `Table ${error.tableNumber} is already booked for this time.`,
            time: "This slot is sold out for the selected table."
          }
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Unable to create the reservation right now." },
      { status: 500 }
    );
  }
}
