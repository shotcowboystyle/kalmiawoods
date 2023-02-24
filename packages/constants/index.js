export const MIN_RESERVATION_DAYS = 3;

export const RESERVATION_DATES_OPTIONS = [
  { placeholder: 'Select date', key: 'start', title: 'Check in' },
  { placeholder: 'Select date', key: 'end', title: 'Check out' },
];

export const RESERVATION_GUESTS_OPTIONS = [
  {
    key: 'adults',
    description: 'Ages 13 or above',
    maxValue: 16,
  },
  {
    key: 'children',
    description: 'Ages 2-12',
    maxValue: 5,
  },
  {
    key: 'infants',
    description: 'Under 2',
    maxValue: 5,
  },
  {
    key: 'pets',
    description: 'Fury friends welcome',
    maxValue: 5,
  },
];

export const DEFAULT_CVC_LENGTH = 3;
export const DEFAULT_ZIP_LENGTH = 5;
export const DEFAULT_CARD_FORMAT = /(\d{1,4})/g;
export const CREDIT_CARD_FORM_FIELDS = {
  cardNumber: 'v-card-number',
  cardName: 'v-card-name',
  cardMonth: 'v-card-month',
  cardYear: 'v-card-year',
  cardCvv: 'v-card-cvv',
};
export const CARD_TYPES = {
  amex: {
    name: 'Amex',
    color: 'green',
  },
  visa: {
    name: 'Visa',
    color: 'lime',
  },
  diners: {
    name: 'Diners',
    color: 'orange',
  },
  discover: {
    name: 'Discover',
    color: 'purple',
  },
  jcb: {
    name: 'Jcb',
    color: 'red',
  },
  jcb15: {
    name: 'Jcb',
    color: 'red',
  },
  maestro: {
    name: 'Maestro',
    color: 'yellow',
  },
  mastercard: {
    name: 'Mastercard',
    color: 'lightblue',
  },
  unionpay: {
    name: 'Unipay',
    color: 'cyan',
  },
};
