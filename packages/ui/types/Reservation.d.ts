export type ReservationDates = {
  start: Date | string | number | null | undefined;
  end: Date | string | number | null | undefined;
};

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
};

export type ReservationDetails = {
  name: string;
  dates: ReservationDates;
  // dates: {
  //   start: Date;
  //   end: Date | undefined;
  // };
  guests?: Guests;
  // guests?: {
  //   adults: number;
  //   children: number;
  //   infants: number;
  //   pets: number;
  // };
};

export type ReservationValues = ReservationDetails & {
  id?: number;
  reservation_id?: string;
};
