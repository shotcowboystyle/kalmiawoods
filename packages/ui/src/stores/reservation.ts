import { nanoid } from 'nanoid';
import { action, atom, onMount, task } from 'nanostores';
import type { ReservationValues } from '../../types/Reservation';

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

interface FetchReservations {
  isLoading: boolean;
  data: ReservationValues[];
}

// export const reservations = map<Record<string, ReservationValues>>(testReservations);
export const reservations = atom<FetchReservations>({ isLoading: false, data: [] });

onMount(reservations, () => {
  reservations.set({ isLoading: true, data: [] });

  task(async () => {
    try {
      const response = await fetch(
        'https://my-json-server.typicode.com/shotcowboystyle/json-placeholder-data/reservations?albumId=5&_start=0&_limit=20',
      );
      reservations.set({ isLoading: false, data: await response.json() });
    } catch (e) {
      console.log(e);
    }
  });
});

export const addReservation = action(reservations, 'addReservation', (store, reservation) => {
  const allReservations = store.get();
  reservation.id = allReservations.data?.at(-1)?.id ?? 0 + 1;
  reservation.reservation_id = nanoid();
  const updatedReservations = allReservations.data.concat(reservation);
  store.set({ isLoading: false, data: updatedReservations });
  return true;
});

export const removeReservation = action(reservations, 'removeReservation', (store, id) => {
  if (getReservationById(id)) {
    const allReservations = store.get();
    const updatedReservations = allReservations.data.filter((r) => r.id !== id);
    store.set({ isLoading: false, data: updatedReservations });
    return true;
  }
  return false;
});

export const getReservationById = (reservationId: string) => {
  const allReservations = reservations.get();
  const reservation = allReservations.data.find(({ reservation_id }) => reservation_id === reservationId);
  return reservation;
};

// export const update = (id: string, updatedValue: ReservationDetails) => {
//   const matchingReservation = reservations.get()[id];
//   const { id: matchingReservationId, ...currentValue } = matchingReservation;
//   reservations.setKey(id, {
//     id,
//     ...currentValue,
//     ...updatedValue,
//   });
// };

// export const add = (reservation: ReservationDetails) => {
//   const id = nanoid();
//   const newReservation = {
//     id: {
//       id,
//       ...reservation,
//     },
//   };
//   reservations.set({ ...reservations.get(), ...newReservation });
// };

// export const set = (reservationsList: ReservationValues[]) => {
//   reservations.set(reservationsList);
// };

// export const remove = (reservation: ReservationValues) => {
//   reservations.set(reservations.get().filter((r) => r.id !== reservation.id));
// };

// export const listReservations = () => {
//   return Object.values(reservations.get());
// };
