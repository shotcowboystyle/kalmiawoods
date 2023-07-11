import { z } from 'zod';

import { BuildingEnum, ReservationSchema } from '@/schemas/reservation';

export type Reservation = z.infer<typeof ReservationSchema>;
export type BuildingEnum = z.infer<typeof BuildingEnum>;

export interface DisabledReservationDates {
  // start: Date | string | number | null | undefined;
  // end: Date | string | number | null | undefined;
  start: Date | string;
  end: Date | string;
}

// export type ReservationValues = ReservationDetails & {
//   id?: number;
//   reservation_id?: string;
// };

export interface ReservationForm {
  id?: string;
  userId?: string;
  checkInDate: string;
  checkOutDate: string;
  buildings: BuildingEnum[];
}
