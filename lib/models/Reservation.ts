import mongoose, { Document, Schema } from "mongoose";

export interface IReservation extends Document {
  name: string;
  date: string;
  guests: number;
  tableNumber: number;
  time: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema<IReservation>(
  {
    name: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    guests: { type: Number, required: true, min: 1 },
    tableNumber: { type: Number, required: true, min: 1, default: 1 },
    time: { type: String, required: true }
  },
  { timestamps: true }
);

ReservationSchema.index({ date: 1, time: 1, tableNumber: 1 }, { unique: true });

const Reservation =
  mongoose.models.Reservation ||
  mongoose.model<IReservation>("Reservation", ReservationSchema);

export default Reservation;
