"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { siteConfig } from "@/lib/site";
import {
  getReservationFieldErrors,
  reservationGuestOptions,
  reservationSchema,
  type ReservationFieldErrors
} from "@/lib/validators/reservation";

function buildPhoneHref(value: string) {
  const sanitized = value.replace(/[^\d+]/g, "");
  return `tel:${sanitized}`;
}

export function ReservationStrip() {
  const defaultTime = siteConfig.reservationTimes[2] || siteConfig.reservationTimes[0] || "";
  const defaultTableNumber = siteConfig.tableNumbers[0]?.toString() || "";
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("2");
  const [tableNumber, setTableNumber] = useState(defaultTableNumber);
  const [time, setTime] = useState(defaultTime);
  const [errors, setErrors] = useState<ReservationFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<Array<{ tableNumber: number; time: string }>>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  const selectedTableNumber = Number.parseInt(tableNumber, 10);
  const soldOutTimes = new Set(
    bookedSlots
      .filter((slot) => slot.tableNumber === selectedTableNumber)
      .map((slot) => slot.time)
  );
  const firstAvailableTime =
    siteConfig.reservationTimes.find((slot) => !soldOutTimes.has(slot)) || "";

  useEffect(() => {
    let cancelled = false;

    if (!date) {
      setBookedSlots([]);
      return () => {
        cancelled = true;
      };
    }

    const loadAvailability = async () => {
      try {
        setLoadingAvailability(true);

        const response = await fetch(`/api/reservations?date=${encodeURIComponent(date)}`, {
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error("Unable to check sold-out tables.");
        }

        const data = (await response.json()) as {
          bookedSlots?: Array<{ tableNumber: number; time: string }>;
        };

        if (!cancelled) {
          setBookedSlots(data.bookedSlots || []);
        }
      } catch {
        if (!cancelled) {
          setBookedSlots([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingAvailability(false);
        }
      }
    };

    void loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [date]);

  useEffect(() => {
    if (!time || soldOutTimes.has(time)) {
      setTime(firstAvailableTime);
    }
  }, [bookedSlots, firstAvailableTime, selectedTableNumber, time]);

  return (
    <section id="reservations" className="section-shell bg-ink">
      <div className="section-content grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="editorial-card shape-a p-8 sm:p-10">
          <p className="section-kicker">Restaurant Reservations</p>
          <h2 className="font-display text-4xl leading-none text-cream sm:text-5xl">
            A reservation section framed like the rest of the dining room.
          </h2>
          <div className="gold-divider" />
          <p className="max-w-xl text-base leading-8 text-cream-muted">
            Stage a booking request with your preferred date, guest count, and service
            time, or contact the restaurant directly through the lines below.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <a
              href={buildPhoneHref(siteConfig.reservationPhone)}
              className="border border-gold/15 bg-ink-3/70 px-5 py-4 transition-colors hover:border-gold/40"
            >
              <p className="text-[0.62rem] uppercase tracking-[0.34em] text-gold">Call</p>
              <p className="mt-3 text-lg text-cream">{siteConfig.reservationPhone}</p>
            </a>
          </div>
        </div>

        <form
          className="reservation-grid editorial-card shape-c border border-gold/20 p-6 sm:p-8"
          onSubmit={async (event) => {
            event.preventDefault();
            setErrors({});

            const parsed = reservationSchema.safeParse({
              name,
              date,
              guests,
              tableNumber,
              time
            });

            if (!parsed.success) {
              setErrors(getReservationFieldErrors(parsed.error));
              return;
            }

            try {
              setSubmitting(true);

              const response = await fetch("/api/reservations", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(parsed.data)
              });

              const data = (await response.json()) as {
                error?: string;
                fieldErrors?: ReservationFieldErrors;
              };

              if (!response.ok) {
                if (data.fieldErrors) {
                  setErrors(data.fieldErrors);
                }

                toast.error("Unable to reserve the table", {
                  description: data.error || "Please review the booking details and try again."
                });
                return;
              }

              toast.success("Reservation request staged", {
                description: `${parsed.data.name} booked table ${parsed.data.tableNumber} for ${parsed.data.guests} guests on ${parsed.data.date} at ${parsed.data.time}.`
              });

              setName("");
              setDate("");
              setGuests("2");
              setTableNumber(defaultTableNumber);
              setBookedSlots([]);
              setTime(defaultTime);
            } catch {
              toast.error("Unable to reserve the table", {
                description: "Please try again in a moment."
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <p className="text-[0.62rem] uppercase tracking-[0.36em] text-gold">
            Booking Request
          </p>
          <h3 className="mt-4 max-w-lg font-display text-3xl leading-none text-cream sm:text-4xl">
            Choose your service window and we&apos;ll stage the table.
          </h3>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <input
                aria-label="Reservation name"
                className="input-dark"
                placeholder="Name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (errors.name) {
                    setErrors((current) => ({ ...current, name: undefined }));
                  }
                }}
              />
              {errors.name ? <p className="text-sm text-danger">{errors.name}</p> : null}
            </div>
            <div className="space-y-2">
              <input
                aria-label="Reservation date"
                type="date"
                className="input-dark"
                value={date}
                onChange={(event) => {
                  setDate(event.target.value);
                  if (errors.date) {
                    setErrors((current) => ({ ...current, date: undefined }));
                  }
                }}
              />
              {errors.date ? <p className="text-sm text-danger">{errors.date}</p> : null}
            </div>
            <div className="space-y-2">
              <select
                aria-label="Table number"
                className="select-dark"
                value={tableNumber}
                onChange={(event) => {
                  setTableNumber(event.target.value);
                  if (errors.tableNumber) {
                    setErrors((current) => ({ ...current, tableNumber: undefined }));
                  }
                }}
              >
                {siteConfig.tableNumbers.map((value) => (
                  <option key={value} value={value}>
                    Table {value}
                  </option>
                ))}
              </select>
              {errors.tableNumber ? (
                <p className="text-sm text-danger">{errors.tableNumber}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <select
                aria-label="Number of guests"
                className="select-dark"
                value={guests}
                onChange={(event) => {
                  setGuests(event.target.value);
                  if (errors.guests) {
                    setErrors((current) => ({ ...current, guests: undefined }));
                  }
                }}
              >
                {reservationGuestOptions.map((value) => (
                  <option key={value} value={value}>
                    {value} Guests
                  </option>
                ))}
              </select>
              {errors.guests ? <p className="text-sm text-danger">{errors.guests}</p> : null}
            </div>
            <div className="space-y-2">
              <select
                aria-label="Reservation time"
                className="select-dark"
                value={time}
                disabled={!firstAvailableTime}
                onChange={(event) => {
                  setTime(event.target.value);
                  if (errors.time) {
                    setErrors((current) => ({ ...current, time: undefined }));
                  }
                }}
              >
                {siteConfig.reservationTimes.map((slot) => (
                  <option key={slot} value={slot} disabled={soldOutTimes.has(slot)}>
                    {soldOutTimes.has(slot) ? `${slot} - Sold Out` : slot}
                  </option>
                ))}
              </select>
              {errors.time ? <p className="text-sm text-danger">{errors.time}</p> : null}
              {!errors.time && !firstAvailableTime ? (
                <p className="text-sm text-danger">
                  All slots are sold out for table {tableNumber || "?"} on this date.
                </p>
              ) : null}
              {!errors.time && firstAvailableTime && loadingAvailability ? (
                <p className="text-sm text-cream-muted">Checking sold-out tables...</p>
              ) : null}
            </div>
          </div>

          <button
            type="submit"
            className="gold-button mt-6 min-h-[54px] w-full md:w-auto"
            disabled={submitting || !firstAvailableTime}
          >
            {submitting ? "Booking..." : "Reserve My Table"}
          </button>
        </form>
      </div>
    </section>
  );
}
