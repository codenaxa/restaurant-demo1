function compact(values: Array<string | undefined>) {
  return values.map((value) => value?.trim()).filter((value): value is string => Boolean(value));
}

function generateHourlyReservationTimes() {
  return Array.from({ length: 15 }, (_, index) => {
    const hour24 = index + 9;
    const meridiem = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

    return `${hour12}:00 ${meridiem}`;
  });
}

function parseTableNumbers() {
  const rawValue = process.env.NEXT_PUBLIC_TABLE_NUMBERS;

  if (!rawValue?.trim()) {
    return [1, 2, 3, 4, 5, 6, 7, 8];
  }

  const tableNumbers = rawValue
    .split(",")
    .map((value) => Number.parseInt(value.trim(), 10))
    .filter((value) => Number.isInteger(value) && value > 0);

  return tableNumbers.length > 0 ? tableNumbers : [1, 2, 3, 4, 5, 6, 7, 8];
}

function parseReservationTimes() {
  const rawValue = process.env.NEXT_PUBLIC_RESERVATION_TIMES;

  if (!rawValue?.trim()) {
    return generateHourlyReservationTimes();
  }

  const reservationTimes = compact(rawValue.split(","));

  return reservationTimes.length > 0 ? reservationTimes : generateHourlyReservationTimes();
}

export const siteConfig = {
  restaurantName: process.env.NEXT_PUBLIC_RESTAURANT_NAME || "Maison Elite",
  location:
    process.env.NEXT_PUBLIC_RESTAURANT_LOCATION || "17 Rue de Lumiere, Downtown Quarter",
  reservationPhone:
    process.env.NEXT_PUBLIC_RESTAURANT_PHONE || "+1 (555) 123-4567",
  contactEmail:
    process.env.NEXT_PUBLIC_RESTAURANT_EMAIL || "reservations@maisonelite.com",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "15551234567",
  hours: (() => {
    const envHours = compact([
      process.env.NEXT_PUBLIC_RESTAURANT_HOURS_1,
      process.env.NEXT_PUBLIC_RESTAURANT_HOURS_2,
      process.env.NEXT_PUBLIC_RESTAURANT_HOURS_3
    ]);

    return envHours.length > 0 ? envHours : ["Daily 9:00 AM - 11:00 PM"];
  })(),
  reservationTimes: parseReservationTimes(),
  tableNumbers: parseTableNumbers()
};
