import { atom } from 'nanostores';
// import type { Reservation, ReservationDetails } from '../types/Reservation';
import { generateId } from '../utils/generateId';

// export const _reservationActions = {
//   addReservation(old: Reservation[], content: ReservationDetails) {
//     if (!Object.keys(content).length || Object.keys(content).length < 2) {
//       return old;
//     }

//     const { name, range } = content;

//     const newReservation = {
//       // id: Math.max(...old.map((reservation) => reservation.id), 0) + 1,
//       id: generateId(),
//       name,
//       range,
//     };
//     return [...old, newReservation];
//   },
//   changeReservation(old: Reservation[], id: Reservation['id'], content: string) {
//     return old.map((reservation) => (reservation.id === id ? { ...reservation, content } : reservation));
//   },
//   deleteReservation(old: Reservation[], id: Reservation['id']) {
//     return old.filter((reservation) => reservation.id !== id);
//   },
// };

const month = new Date().getMonth();
const year = new Date().getFullYear();

const testReservations = [
  {
    id: 1,
    name: 'Lunch with mom.',
    dates: {
      start: new Date(year, month, 1),
      end: new Date(year, month, 1),
    },
  },
  {
    id: 2,
    name: 'Take Noah to basketball practice',
    dates: {
      start: new Date(year, month, 2),
      end: new Date(year, month, 2),
    },
  },
  {
    id: 3,
    name: "Noah's basketball game.",
    dates: {
      start: new Date(year, month, 5),
      end: new Date(year, month, 5),
    },
  },
  {
    id: 4,
    name: 'Take car to the shop',
    dates: {
      start: new Date(year, month, 5),
      end: new Date(year, month, 5),
    },
  },
  {
    id: 4,
    name: 'Meeting with new client.',
    dates: {
      start: new Date(year, month, 7),
      end: new Date(year, month, 7),
    },
  },
  {
    id: 5,
    name: "Mia's gymnastics practice.",
    dates: {
      start: new Date(year, month, 11),
      end: new Date(year, month, 12),
    },
  },
  {
    id: 6,
    name: 'Cookout with friends.',
    dates: {
      start: new Date(year, month, 13),
      end: new Date(year, month, 16),
    },
  },
  {
    id: 7,
    name: "Mia's gymnastics recital.",
    dates: {
      start: new Date(year, month, 22),
      end: new Date(year, month, 22),
    },
  },
  {
    id: 8,
    name: 'Visit great grandma.',
    dates: {
      start: new Date(year, month, 25),
      end: new Date(year, month, 25),
    },
  },
];

// export const reservations = atom<Reservation[]>(testReservations.length ? testReservations : []);
export const reservations = atom(testReservations.length ? testReservations : []);

// export const update = (reservation: Reservation) => {
export const update = (reservation) => {
  reservations.set(reservations.get().map((r) => (r.name === reservation.name ? reservation : r)));
};

// export const add = (reservation: ReservationDetails) => {
export const add = (reservation) => {
  const newReservation = {
    id: generateId(),
    ...reservation,
  };
  reservations.set([...reservations.get(), newReservation]);
};

// export const set = (reservationsList: Reservation[]) => {
export const set = (reservationsList) => {
  reservations.set(reservationsList);
};

// export const remove = (reservation: Reservation) => {
export const remove = (reservation) => {
  reservations.set(reservations.get().filter((r) => r.id !== reservation.id));
};

export const listReservations = () => {
  return reservations.get();
};
