export type PaymentFormData = {
  cardName: string;
  cardNumber: number | string;
  cardMonth: number | string;
  cardYear: number | string;
  cardCvv: number | string;
};

export type CreditCardLabels = {
  cardName: string;
  cardNumber: number | string;
  cardMonth: number | string;
  cardYear: number | string;
  cardCvv: number | string;
};

export type CreditCardFormFields = {
  cardNumber: 'v-card-number';
  cardName: 'v-card-name';
  cardMonth: 'v-card-month';
  cardYear: 'v-card-year';
  cardCvv: 'v-card-cvv';
};
