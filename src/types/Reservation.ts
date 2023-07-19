import { z } from 'zod';

import { BuildingEnum, ReservationSchema } from '@/schemas/reservation';

export type Reservation = z.infer<typeof ReservationSchema>;
export type BuildingEnum = z.infer<typeof BuildingEnum>;

export interface DisabledReservationDates {
  start: Date | string;
  end: Date | string;
}

export interface ReservationForm {
  reservationId?: string;
  title?: string;
  userId: string;
  checkInDate: string;
  checkOutDate: string;
  buildings: BuildingEnum[];
}
