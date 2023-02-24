// import { MIN_RESERVATION_DAYS } from '@kalmiawoods/constants';
// import { addDays } from 'date-fns';
import { action, atom, map } from 'nanostores';
import type { Guests, ReservationDates, ReservationDetails } from '../../types/Reservation';

type ReservationFormStep = number | 'complete';
export const reservationFormStep = atom<ReservationFormStep>(1);
type ReservationFormStepDirection = 'fade-right' | 'fade-left';
export const reservationFormStepDirection = atom<ReservationFormStepDirection>('fade-right');

// const unbindReservationFormStepListener = reservationFormStep.subscribe((value) => {
//   return value;
// });

export const nextStep = action(reservationFormStep, 'nextStep', (store) => {
  const currentStep = store.get();

  if (currentStep === 3 || typeof currentStep !== 'number') {
    store.set('complete');
  } else {
    store.set(currentStep + 1);
  }

  reservationFormStepDirection.set('fade-right');
  return store.get();
});

export const prevStep = action(reservationFormStep, 'prevStep', (store) => {
  const currentStep = store.get();

  if (typeof currentStep === 'number') {
    store.set(currentStep - 1);
  } else {
    store.set(3);
  }

  reservationFormStepDirection.set('fade-left');
  return store.get();
});

// export const reservationDates = map({
export const reservationDates = map<ReservationDates>({
  start: undefined,
  end: undefined,
  // end: addDays(new Date(), MIN_RESERVATION_DAYS),
});

// export const reservationGuests = map({
export const reservationGuests = map<Guests>({
  adults: 1,
  children: 0,
  infants: 0,
  pets: 0,
});

export const initReservationFormValues = {
  name: '',
  dates: {
    start: undefined,
    end: undefined,
  },
  guests: {
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  },
};

export const reservationFormValues = map<ReservationDetails>(initReservationFormValues);
// export const reservationFormValues = map(initReservationFormValues);

export const updateReservationDates = action(reservationDates, 'updateReservationDates', (store, value) => {
  return store.set(value);
});

export const updateReservationStartDate = action(reservationDates, 'updateReservationStartDate', (store, value) => {
  return store.setKey('start', value);
});

export const updateReservationEndDate = action(reservationDates, 'updateReservationEndDate', (store, value) => {
  return store.setKey('end', value);
});

export const updateReservationGuests = action(reservationGuests, 'updateReservationGuests', (store, value) => {
  return store.set(value);
});

export const updateReservationGuestsAdults = action(
  reservationGuests,
  'updateReservationGuestsAdults',
  (store, value) => {
    return store.setKey('adults', value);
  },
);

export const updateReservationGuestsChildren = action(
  reservationGuests,
  'updateReservationGuestsChildren',
  (store, value) => {
    return store.setKey('children', value);
  },
);

export const updateReservationGuestsInfants = action(
  reservationGuests,
  'updateReservationGuestsInfants',
  (store, value) => {
    return store.setKey('infants', value);
  },
);

export const updateReservationGuestsPets = action(reservationGuests, 'updateReservationGuestsPets', (store, value) => {
  return store.setKey('pets', value);
});

export const incrementGuestsCounter = action(reservationGuests, 'incrementGuestsCounter', (store, key) => {
  // if (validateMax(store.get() + add)) {
  //   store.set(store.get() + add)
  // }
  const currentValues = store.get();
  store.setKey(key, currentValues[key] + 1);
  console.log('NEW STORE VALUES', store.get());
  return store.get();
});

export const decrementGuestsCounter = action(reservationGuests, 'decrementGuestsCounter', (store, key) => {
  // if (validateMax(store.get() + add)) {
  //   store.set(store.get() + add)
  // }
  const currentValues = store.get();
  store.setKey(key, currentValues[key] - 1);
  return store.get();
});
