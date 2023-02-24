import { format } from 'date-fns';
import type { Guests } from '../../types/Reservation';

export const formatGuests = (guests: Guests): string => {
  if (!guests) {
    return 'Select guests';
  }

  const { children, adults, infants, pets } = guests;
  const total = Number(adults) + Number(children);

  if (!total) {
    return '';
  }

  let template = `${total} guest`;

  if (total >= 2) {
    template = `${total} guests`;
  }

  if (infants) {
    template += `, ${infants} ${Number(infants) >= 2 ? 'infants' : 'infant'}`;
  }

  if (pets) {
    template += `, ${pets} ${Number(pets) >= 2 ? 'pets' : 'pet'}`;
  }

  return template;
};

export const formatDateLongLocalized = (date: Date) => date && format(date, 'PP');
export const formatDateCalendar = (date: Date) => date && format(date, 'MM/dd/yyyy');

export const formatMonthValue = (n: number) => (n < 10 ? `0${n}` : n);
