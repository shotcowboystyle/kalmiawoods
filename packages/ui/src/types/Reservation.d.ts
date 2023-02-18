export type ReservationDates = {
  start: Date | null | undefined;
  end?: Date | null | undefined;
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

export type Guests = {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

export interface ReservationDetails {
  name: string;
  dates: {
    start: Date;
    end: Date | undefined;
  }
  // guests?: Guests;
  guests?: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  }
}

export interface Reservation extends ReservationDetails {
  id: number;
}
