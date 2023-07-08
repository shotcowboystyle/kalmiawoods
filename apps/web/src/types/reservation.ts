import { z } from 'zod';

import { ReservationDetailsSchema, ReservationSchema } from '@/schemas/reservation';

export type Reservation = z.infer<typeof ReservationSchema>;
export type ReservationDetails = z.infer<typeof ReservationDetailsSchema>;

export interface ReservationUser {
  email: string;
  address?: string;
  firstName?: string;
  lastName?: string;
  mobilePhone?: string;
  avatar?: string;
}

// export interface Reservation {
//   reservationId: string;
//   checkInDate: Date;
//   checkOutDate: Date;
//   userId: string;
//   user: ReservationUser;
// }

export interface DisabledReservationDates {
  start: Date | string | number | null | undefined;
  end: Date | string | number | null | undefined;
}

// export type Guest = {
//   [key: string]: number;
// };

// export type Guests = {
//   adults: Guest;
//   children: Guest;
//   infants: Guest;
//   pets: Guest;
// };

export interface Guests {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

// export type ReservationDetails = {
//   name: string;
//   dates: ReservationDates;
//   // dates: {
//   //   start: Date;
//   //   end: Date | undefined;
//   // };
//   guests?: Guests;
//   // guests?: {
//   //   adults: number;
//   //   children: number;
//   //   infants: number;
//   //   pets: number;
//   // };
// };

export type ReservationValues = ReservationDetails & {
  id?: number;
  reservation_id?: string;
};

export interface ReservationForm {
  checkInDate: string;
  checkOutDate: string;
}
