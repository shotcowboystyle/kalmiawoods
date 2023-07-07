import { z } from 'zod';

import { NoIDUser } from './user';

export const ReservationDetailsSchema = z.object({
  reservationId: z.string(),
  checkInDate: z.date(),
  checkOutDate: z.date(),
});

const ReservationUser = z.object({
  userId: z.string(),
  user: NoIDUser,
});

export const ReservationSchema = ReservationDetailsSchema.merge(ReservationUser);

export const Reservations = ReservationSchema.array();
