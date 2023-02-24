<script setup lang="ts">
import { CREDIT_CARD_FORM_FIELDS } from '@kalmiawoods/constants';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import type { PaymentFormData } from '../../../types/CreditCard';
import { nextStep } from '../../stores/reservationForm';
import { formatMonthValue } from '../../utils/formatters';
import CreditCard from './CreditCard.vue';

const emit = defineEmits([
  'input-card-name',
  'input-card-number',
  'input-card-month',
  'input-card-year',
  'input-card-cvv',
  'change-parent',
  'handle-card',
]);

defineProps<{
  total: string;
}>();

const formData: PaymentFormData = reactive({
  cardName: '',
  cardNumber: '',
  cardMonth: '',
  cardYear: '',
  cardCvv: '',
});

const fields = CREDIT_CARD_FORM_FIELDS;
const minCardYear = new Date().getFullYear();
const isCardNumberMasked = ref(true);
const mainCardNumber = ref(formData.cardNumber);
const cardNumberMaxLength = ref(19);

const isSubmitting = ref(false);

const minCardMonth = computed(() => {
  if (formData.cardYear === minCardYear) {
    return new Date().getMonth() + 1;
  }
  return 1;
});

const maskCardNumber = () => {
  mainCardNumber.value = formData.cardNumber;
  let arr = formData.cardNumber.toString().split('');
  arr.forEach((element, index) => {
    if (index > 4 && index < 14 && element.trim() !== '') {
      arr[index] = '*';
    }
  });
  formData.cardNumber = arr.join('');
};

const unMaskCardNumber = () => {
  formData.cardNumber = mainCardNumber.value;
};

const focusCardNumber = () => {
  unMaskCardNumber();
};

const changeName = (event: Event) => {
  const { value } = event.target as HTMLInputElement;
  formData.cardName = value;
  emit('input-card-name', formData.cardName);
};

const changeNumber = (event: Event) => {
  const { value: eventValue } = event.target as HTMLInputElement;
  formData.cardNumber = eventValue;

  let value = formData.cardNumber.replace(/\D/g, '');

  // american express, 15 digits
  if (/^3[47]\d{0,13}$/.test(value)) {
    formData.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ');
    cardNumberMaxLength.value = 17;
  } else if (/^3(?:0[0-5]|[68]\d)\d{0,11}$/.test(value)) {
    // diner's club, 14 digits
    formData.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ');
    cardNumberMaxLength.value = 16;
  } else if (/^\d{0,16}$/.test(value)) {
    // regular cc number, 16 digits
    formData.cardNumber = value
      .replace(/(\d{4})/, '$1 ')
      .replace(/(\d{4}) (\d{4})/, '$1 $2 ')
      .replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ');
    cardNumberMaxLength.value = 19;
  }

  // eslint-disable-next-line
  if ((event as InputEvent).inputType == 'deleteContentBackward') {
    let lastChar = formData.cardNumber.substring(formData.cardNumber.length, formData.cardNumber.length - 1);

    // eslint-disable-next-line
    if (lastChar == ' ') {
      formData.cardNumber = formData.cardNumber.substring(0, formData.cardNumber.length - 1);
    }
  }

  emit('input-card-number', formData.cardNumber);
};

const changeMonth = () => {
  emit('input-card-month', formData.cardMonth);
};

const changeYear = () => {
  emit('input-card-year', formData.cardYear);
};

const changeCvv = (event: Event) => {
  const { value } = event.target as HTMLInputElement;
  formData.cardCvv = value;

  emit('input-card-cvv', formData.cardCvv);
};

// const invalidCard = () => {
//   const number = formData.cardNumber;
//   let sum = 0;
//   let isOdd = true;

//   for (let i = number.toString().length - 1; i >= 0; i--) {
//     let num: string | number = number.toString().charAt(i);

//     if (isOdd) {
//       sum += Number(num);
//     } else {
//       num = Number(num) * 2;
//       if (num > 9) {
//         num = num.toString().split('').join('+');
//       }
//       sum += Number(num);
//     }
//     isOdd = !isOdd;
//   }

//   if (sum % 10 !== 0) {
//     alert('invalid card number');
//     return false;
//   }

//   return true;
// };

const blurCardNumber = () => {
  if (isCardNumberMasked.value) {
    maskCardNumber();
  }
};

const finishPayment = () => {
  // if (!invalidCard()) {
  //   emit('change-parent');
  // }

  isSubmitting.value = true;
  setTimeout(() => nextStep(), 3000);
};

const vNumberOnly = {
  mounted: (el: HTMLInputElement) => {
    el.addEventListener(
      'keyup',
      () => {
        const regex = /^[0-9]*$/;
        if (!regex.test(el.value)) {
          el.value = el.value.slice(0, -1);
        }
      },
      { passive: true },
    );
  },
};

const vLetterOnly = {
  mounted: (el: HTMLInputElement) => {
    el.addEventListener(
      'keyup',
      () => {
        const regex = /^[a-zA-Z ]*$/;
        if (!regex.test(el.value)) {
          el.value = el.value.slice(0, -1);
        }
      },
      { passive: true },
    );
  },
};

const cardYear = ref(formData.cardYear);
watch(cardYear, () => {
  if (formData.cardMonth < minCardMonth.value) {
    formData.cardMonth = '';
  }
});

onMounted(() => {
  maskCardNumber();
  emit('handle-card');
});
</script>

<template>
  <div class="col-span-1 lg:col-span-6">
    <div class="px-0 pt-4 pb-0">
      <div class="mb-6">
        <CreditCard :fields="fields" :labels="formData" :is-card-number-masked="isCardNumberMasked" />
      </div>

      <div class="w-full mb-4 form-control">
        <label for="cardNumber" class="label">
          <span class="label-text">Card number</span>
        </label>
        <input
          :id="fields.cardNumber"
          :value="formData.cardNumber"
          :maxlength="cardNumberMaxLength"
          data-card-field
          type="tel"
          autocomplete="off"
          class="w-full input input-bordered input-md"
          @input="changeNumber"
          @focus="focusCardNumber"
          @blur="blurCardNumber"
        />
      </div>

      <div class="w-full mb-4 form-control">
        <label class="label" for="cardName">
          <span class="label-text">Name on card</span>
        </label>
        <input
          :id="fields.cardName"
          v-letter-only
          :value="formData.cardName"
          data-card-field
          type="text"
          autocomplete="off"
          class="w-full input input-bordered input-md"
          @input="changeName"
        />
      </div>

      <div class="flex flex-wrap gap-4 mb-6 md:flex-nowrap">
        <div class="w-full form-control sm:w-2/3">
          <label for="expirationDate" class="label">
            <span class="label-text">Expiration date</span>
          </label>

          <div class="flex flex-row gap-4">
            <select
              :id="fields.cardMonth"
              v-model.number="formData.cardMonth"
              data-card-field
              class="flex-grow select select-bordered"
              @change="changeMonth"
            >
              <option value disabled selected>Month</option>
              <option v-for="n in 12" :key="n" :value="n" :disabled="n < minCardMonth">
                {{ formatMonthValue(n) }}
              </option>
            </select>

            <select
              :id="fields.cardYear"
              v-model.number="formData.cardYear"
              data-card-field
              class="flex-grow select select-bordered"
              @change="changeYear"
            >
              <option value disabled selected>Year</option>
              <option v-for="(n, $index) in 12" :key="n" :value="$index + minCardYear">
                {{ $index + minCardYear }}
              </option>
            </select>
          </div>
        </div>

        <div class="w-full form-control sm:w-1/3">
          <label for="cvc" class="label">
            <span class="label-text">CVC</span>
          </label>
          <input
            :id="fields.cardCvv"
            v-number-only
            :value="formData.cardCvv"
            data-card-field
            type="tel"
            maxlength="4"
            autocomplete="off"
            class="flex-grow input input-bordered input-md"
            @input="changeCvv"
          />
        </div>
      </div>

      <div class="mb-6 text-right">
        <span class="font-bold text-right">{{ total }} USD</span>
      </div>

      <div>
        <button class="w-full btn btn-primary" :class="{ loading: isSubmitting }" @click="finishPayment">
          Confirm payment
        </button>
      </div>
    </div>
  </div>
</template>
