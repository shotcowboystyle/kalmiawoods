import { action, atom, computed, map } from 'nanostores';

import { apiRoute } from '@/stores/routes';
import type { Reservation } from '@/types/Reservation';
import { convertArrayToObjectsByKey } from '@/utils/collection';
import { firstDayOfCurrentMonth, getFirstDayOfMonth, getLastDayOfMonth, lastDayOfCurrentMonth } from '@/utils/date';
import { createFetcherStore, isReady } from './fetcher';

const API_URL = apiRoute('reservations');

const monthStartDate = atom<string>(firstDayOfCurrentMonth().toDateString());
const setMonthStartDate = action(monthStartDate, 'setMonthStartDate', (date, payload: string) => date.set(payload));

const monthEndDate = atom<string>(lastDayOfCurrentMonth().toDateString());
const setMonthEndDate = action(monthEndDate, 'setMonthEndDate', (date, payload: string) => date.set(payload));

export const reservations = map<Record<string, Reservation | undefined>>({});

const reservationsPartial = createFetcherStore<Reservation[]>([
  API_URL,
  '?startDate=',
  monthStartDate,
  '&endDate=',
  monthEndDate,
]);
reservationsPartial.subscribe((r) => {
  if (isReady(r)) {
    const mappedReservations = convertArrayToObjectsByKey(r.data, 'reservationId');
    reservations.set(mappedReservations);
  }
});

export const fetchMonthReservations = (year: number, month: number) => {
  setMonthStartDate(getFirstDayOfMonth(year, month).toDateString());
  setMonthEndDate(getLastDayOfMonth(year, month).toDateString());
};

export const reservedDates = computed([reservations], (_reservations) =>
  Object.values(_reservations).reduce(
    (acc, cur) => {
      acc.push({
        start: cur!.checkInDate,
        end: cur!.checkOutDate,
      });
      return acc;
    },
    [] as { start: Date; end: Date }[],
  ),
);

export const addReservation = action(reservations, 'addReservation', async (store, newReservation) => {
  const { reservationId } = newReservation;
  const existingEntry = store.get()[reservationId];
  if (existingEntry) {
    store.setKey(reservationId, {
      ...existingEntry,
      ...newReservation,
    });
  } else {
    store.setKey(reservationId, newReservation);
  }
});

export const removeReservation = action(reservations, 'removeReservation', (store, reservationId) => {
  if (store.get()[reservationId]) {
    store.setKey(reservationId, undefined);
  }
});

const initReservationData = {
  reservationId: null,
  userId: null,
  title: null,
  buildings: null,
  checkInDate: null,
  checkOutDate: null,
};

export const activeReservationId = atom<string | null>(null);
export const setActiveReservationId = action(activeReservationId, 'setActiveReservationId', (id, newVal) =>
  id.set(newVal),
);

export const reservation = computed(
  [reservations, activeReservationId],
  (_reservations, _reservationId) =>
    Object.values(_reservations).find((r) => r?.reservationId === _reservationId) ?? initReservationData,
);

export const reservationDates = map({
  checkInDate: undefined,
  checkOutDate: undefined,
});

export const updateReservationDates = action(reservationDates, 'updateReservationDates', (store, value) =>
  store.set(value),
);

export const updateReservationStartDate = action(reservationDates, 'updateReservationStartDate', (store, value) =>
  store.setKey('checkInDate', value),
);

export const updateReservationEndDate = action(reservationDates, 'updateReservationEndDate', (store, value) =>
  store.setKey('checkOutDate', value),
);
