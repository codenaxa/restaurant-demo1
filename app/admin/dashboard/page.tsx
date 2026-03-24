import { redirect } from "next/navigation";

import { PageTransition } from "@/components/shared/PageTransition";
import { auth } from "@/lib/auth";
import { getMenuStats } from "@/lib/menu-store";
import { getReservationStats, listReservations } from "@/lib/reservation-store";
import { formatDateLabel, formatReservationDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const [stats, reservationStats, bookedSlots] = await Promise.all([
    getMenuStats(),
    getReservationStats(),
    listReservations({ upcomingOnly: true, limit: 8 })
  ]);

  const cards = [
    { label: "Total Items", value: stats.totalItems.toString() },
    { label: "Featured Items", value: stats.featuredItems.toString() },
    { label: "Categories", value: stats.categories.toString() },
    { label: "Last Updated", value: formatDateLabel(stats.lastUpdated) }
  ];

  const bookingCards = [
    { label: "Total Reservations", value: reservationStats.totalReservations.toString() },
    { label: "Upcoming Slots", value: reservationStats.upcomingReservations.toString() },
    {
      label: "Next Slot",
      value: bookedSlots[0]
        ? `${formatReservationDate(bookedSlots[0].date)} - ${bookedSlots[0].time} - Table ${bookedSlots[0].tableNumber}`
        : "No upcoming bookings"
    }
  ];

  return (
    <PageTransition>
      <div className="mb-8">
        <p className="section-kicker">Overview</p>
        <h1 className="section-title">Service dashboard</h1>
        <div className="gold-divider" />
        <p className="section-copy">
          A quick operating view over the current menu library, featured inventory, and
          the last editorial change pushed live.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <div
            key={card.label}
            className={`editorial-card p-6 ${index % 2 === 0 ? "shape-a" : "shape-b"}`}
          >
            <p className="text-[0.68rem] uppercase tracking-[0.34em] text-gold">{card.label}</p>
            <p className="mt-5 font-display text-4xl leading-none text-cream">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 mt-14">
        <p className="section-kicker">Reservations</p>
        <h2 className="font-display text-4xl leading-none text-cream sm:text-5xl">
          Booked slots from the public table form
        </h2>
        <div className="gold-divider" />
        <p className="section-copy">
          Every validated booking request appears here with the reserved date, service
          slot, party size, and the day the request was staged.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {bookingCards.map((card, index) => (
          <div
            key={card.label}
            className={`editorial-card p-6 ${index % 2 === 0 ? "shape-a" : "shape-b"}`}
          >
            <p className="text-[0.68rem] uppercase tracking-[0.34em] text-gold">{card.label}</p>
            <p className="mt-5 font-display text-3xl leading-tight text-cream">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="editorial-card shape-a mt-8 overflow-hidden">
        {bookedSlots.length === 0 ? (
          <div className="px-6 py-10">
            <p className="text-[0.68rem] uppercase tracking-[0.34em] text-gold">
              No Reservations Yet
            </p>
            <p className="mt-4 max-w-xl text-sm leading-7 text-cream-muted">
              Once guests submit the table booking form, their reserved slots will appear
              here automatically.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gold/10">
            {bookedSlots.map((booking) => (
              <div
                key={booking.id}
                className="grid gap-4 px-6 py-5 lg:grid-cols-[1.1fr_1fr_0.8fr_0.6fr_0.9fr] lg:items-center"
              >
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.3em] text-gold">
                    Guest
                  </p>
                  <p className="mt-2 font-display text-3xl leading-none text-cream">
                    {booking.name}
                  </p>
                </div>
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.3em] text-gold">
                    Slot
                  </p>
                  <p className="mt-2 text-sm leading-7 text-cream">
                    {formatReservationDate(booking.date)} - {booking.time}
                  </p>
                </div>
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.3em] text-gold">
                    Table
                  </p>
                  <p className="mt-2 text-sm leading-7 text-cream">{booking.tableNumber}</p>
                </div>
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.3em] text-gold">
                    Guests
                  </p>
                  <p className="mt-2 text-sm leading-7 text-cream">{booking.guests}</p>
                </div>
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.3em] text-gold">
                    Booked
                  </p>
                  <p className="mt-2 text-sm leading-7 text-cream-muted">
                    {formatDateLabel(booking.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
