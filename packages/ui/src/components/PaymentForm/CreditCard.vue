<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import type { CreditCardFormFields, CreditCardLabels } from '../../../types/CreditCard';
import { formatMonthValue } from '../../utils/formatters';

const props = defineProps<{
  labels: CreditCardLabels;
  fields: CreditCardFormFields;
  isCardNumberMasked: boolean;
}>();

const amexCardPlaceholder = '#### ###### #####';
const dinersCardPlaceholder = '#### ###### ####';
const defaultCardPlaceholder = '#### #### #### ####';

const currentFocus = ref('');
const isFocused = ref(false);
const isCardFlipped = ref(false);
const currentPlaceholder = ref('');

const cardName = ref(null);
const cardNumber = ref(null);
const cardDate = ref(null);
const cardCvv = ref(null);
const cardElements = {
  // [props.fields.cardName]: cardName,
  // [props.fields.cardNumber]: cardNumber,
  // cardDate,
  // [props.fields.cardCvv]: cardCvv,
  'v-card-name': cardName,
  'v-card-number': cardNumber,
  cardDate,
  'v-card-cvv': cardCvv,
};

const focusElementStyle = reactive({});
const focusElement = ref(null);

const cardType = computed(() => {
  let number = props.labels.cardNumber.toString();
  let re = new RegExp('^4');
  if (number.match(re) != null) {
    return 'visa';
  }

  re = new RegExp('^(34|37)');
  if (number.match(re) != null) {
    return 'amex';
  }

  re = new RegExp('^5[1-5]');
  if (number.match(re) != null) {
    return 'mastercard';
  }

  re = new RegExp('^6011');
  if (number.match(re) != null) {
    return 'discover';
  }

  re = new RegExp('^62');
  if (number.match(re) != null) {
    return 'unionpay';
  }

  re = new RegExp('^9792');
  if (number.match(re) != null) {
    return 'troy';
  }

  re = new RegExp('^3(?:0([0-5]|9)|[689]\\d?)\\d{0,11}');
  if (number.match(re) != null) {
    return 'dinersclub';
  }

  re = new RegExp('^35(2[89]|[3-8])');
  if (number.match(re) != null) {
    return 'jcb';
  }

  return ''; // default type
});

const currentCardBackground = computed(() => {
  const random = Math.floor(Math.random() * 25 + 1);
  return `https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${random}.jpeg`;
});

const resetFocus = () => Object.keys(focusElementStyle).forEach((key) => delete focusElementStyle[key]);

const changeFocus = () => {
  const target = cardElements[currentFocus.value];
  if (target) {
    Object.assign(focusElementStyle, {
      width: `${target.value.offsetWidth}px`,
      height: `${target.value.offsetHeight}px`,
      transform: `translateX(${target.value.offsetLeft}px) translateY(${target.value.offsetTop}px)`,
    });
  } else {
    resetFocus();
  }
};

const getIsNumberMasked = (index: number, n: string) => {
  return (
    index > 4 &&
    index < 14 &&
    props.labels.cardNumber.toString().length > index &&
    n.trim() !== '' &&
    props.isCardNumberMasked
  );
};

const changePlaceholder = async () => {
  if (cardType.value === 'amex') {
    currentPlaceholder.value = amexCardPlaceholder;
  } else if (cardType.value === 'dinersclub') {
    currentPlaceholder.value = dinersCardPlaceholder;
  } else {
    currentPlaceholder.value = defaultCardPlaceholder;
  }

  await nextTick();
  changeFocus();
};

watch(currentFocus, (focused) => {
  if (focused) {
    changeFocus();
  } else {
    resetFocus();
  }
});

onMounted(() => {
  changePlaceholder();

  const fields = document.querySelectorAll('[data-card-field]');
  fields.forEach((element) => {
    element.addEventListener(
      'focus',
      () => {
        isFocused.value = true;
        if (element.id === props.fields.cardYear || element.id === props.fields.cardMonth) {
          currentFocus.value = 'cardDate';
        } else {
          currentFocus.value = element.id;
        }

        isCardFlipped.value = element.id === props.fields.cardCvv;
      },
      { passive: true },
    );

    element.addEventListener(
      'blur',
      () => {
        isCardFlipped.value = !!(element.id === props.fields.cardCvv);
        setTimeout(() => {
          if (!isFocused.value) {
            currentFocus.value = '';
          }
        }, 300);
        isFocused.value = false;
      },
      { passive: true },
    );
  });
});
</script>

<template>
  <div class="card-item" :class="{ '-active': isCardFlipped }">
    <div class="card-item__side -front">
      <div
        ref="focusElement"
        class="card-item__focus"
        :class="{ '-active': focusElementStyle }"
        :style="focusElementStyle"
      ></div>

      <div class="card-item__cover">
        <img v-if="currentCardBackground" :src="currentCardBackground" class="card-item__bg" />
      </div>

      <div class="card-item__wrapper">
        <div class="card-item__top">
          <img
            src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/chip.png"
            class="card-item__chip"
          />

          <div class="card-item__type">
            <Transition name="slide-fade-up">
              <img
                v-if="cardType"
                :key="cardType"
                :src="
                  'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/' +
                  cardType +
                  '.png'
                "
                :alt="cardType"
                class="card-item__typeImg"
              />
            </Transition>
          </div>
        </div>

        <label ref="cardNumber" :for="fields.cardNumber" class="card-item__number">
          <template v-for="(n, $index) in currentPlaceholder" :key="$index">
            <Transition name="slide-fade-up">
              <span v-if="getIsNumberMasked($index, n)" class="card-item__numberItem">*</span>
              <span
                v-else-if="labels.cardNumber.toString().length > $index"
                :key="currentPlaceholder"
                class="card-item__numberItem"
                :class="{ '-active': n.trim() === '' }"
              >
                {{ labels.cardNumber[$index] }}
              </span>

              <span
                v-else
                :key="currentPlaceholder + 1"
                class="card-item__numberItem"
                :class="{ '-active': n.trim() === '' }"
              >
                {{ n }}
              </span>
            </Transition>
          </template>
        </label>

        <div class="card-item__content">
          <label ref="cardName" :for="fields.cardName" class="card-item__info">
            <span class="card-item__holder">Card Holder</span>
            <Transition name="slide-fade-up">
              <span v-if="labels.cardName.length" key="1" class="card-item__name">
                <TransitionGroup name="slide-fade-right">
                  <span
                    v-for="(n, $index) in labels.cardName.replace(/\s\s+/g, ' ')"
                    :key="$index + 1"
                    class="card-item__nameItem"
                  >
                    {{ n }}
                  </span>
                </TransitionGroup>
              </span>
              <span v-else key="2" class="card-item__name">Full Name</span>
            </Transition>
          </label>

          <div ref="cardDate" class="card-item__date">
            <label :for="fields.cardMonth" class="card-item__dateTitle">Expires</label>
            <label :for="fields.cardMonth" class="card-item__dateItem">
              <transition name="slide-fade-up">
                <span v-if="labels.cardMonth" :key="labels.cardMonth">{{
                  formatMonthValue(Number(labels.cardMonth))
                }}</span>
                <span v-else key="2">MM</span>
              </transition>
            </label>
            /
            <label for="cardYear" class="card-item__dateItem">
              <transition name="slide-fade-up">
                <span v-if="labels.cardYear" :key="labels.cardYear">{{ String(labels.cardYear).slice(2, 4) }}</span>
                <span v-else key="2">YY</span>
              </transition>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="card-item__side -back">
      <div class="card-item__cover">
        <img v-if="currentCardBackground" :src="currentCardBackground" class="card-item__bg" />
      </div>
      <div class="card-item__band"></div>
      <label ref="cardCvv" class="card-item__cvv">
        <span class="card-item__cvvTitle">CVV</span>
        <span class="card-item__cvvBand">
          <span v-for="(n, $index) in labels.cardCvv" :key="$index">{{ n }}</span>
        </span>
        <span class="card-item__type">
          <img
            v-if="cardType"
            :src="
              'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/' +
              cardType +
              '.png'
            "
            class="card-item__typeImg"
          />
        </span>
      </label>
    </div>
  </div>
</template>

<style scoped>
.card-item {
  max-width: 430px;
  height: 270px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 2;
  width: 100%;
}
@media screen and (max-width: 480px) {
  .card-item {
    max-width: 310px;
    height: 220px;
    width: 100%;
  }
}
@media screen and (max-width: 360px) {
  .card-item {
    height: 180px;
  }
}

.card-item__side.-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transform: perspective(2000px) rotateY(-180deg) rotateX(0deg) rotate(0deg);
  z-index: 2;
  padding: 0;
  height: 100%;
}

.card-item__cover {
  height: 100%;
  position: absolute;
  background-color: #1c1d27;
  background-image: linear-gradient(147deg, #354fce 0%, #0c296b 74%);
  left: 0;
  top: 0;
  width: 100%;
  border-radius: 15px;
  overflow: hidden;
}

.card-item__cover:after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(6, 2, 29, 0.45);
}

.card-item__side.-back .card-item__cover {
  transform: rotateY(-180deg);
}

.card-item.-active .card-item__side.-front {
  transform: perspective(1000px) rotateY(180deg) rotateX(0deg) rotateZ(0deg);
}
.card-item.-active .card-item__side.-back {
  transform: perspective(1000px) rotateY(0) rotateX(0deg) rotateZ(0deg);
}
.card-item__focus {
  position: absolute;
  z-index: 3;
  border-radius: 5px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: all 0.35s cubic-bezier(0.71, 0.03, 0.56, 0.85);
  opacity: 0;
  pointer-events: none;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.65);
}
.card-item__focus:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: #08142f;
  height: 100%;
  border-radius: 5px;
  filter: blur(25px);
  opacity: 0.5;
}
.card-item__focus.-active {
  opacity: 1;
}
.card-item__side {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 20px 60px 0 rgba(14, 42, 90, 0.55);
  transform: perspective(2000px) rotateY(0deg) rotateX(0deg) rotate(0deg);
  transform-style: preserve-3d;
  transition: all 0.8s cubic-bezier(0.71, 0.03, 0.56, 0.85);
  backface-visibility: hidden;
  height: 100%;
}
.card-item__bg {
  max-width: 100%;
  display: block;
  max-height: 100%;
  height: 100%;
  width: 100%;
  object-fit: cover;
}
.card-item__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 40px;
  padding: 0 10px;
}
@media screen and (max-width: 480px) {
  .card-item__top {
    margin-bottom: 25px;
  }
}
@media screen and (max-width: 360px) {
  .card-item__top {
    margin-bottom: 15px;
  }
}
.card-item__chip {
  width: 60px;
}
@media screen and (max-width: 480px) {
  .card-item__chip {
    width: 50px;
  }
}
@media screen and (max-width: 360px) {
  .card-item__chip {
    width: 40px;
  }
}
.card-item__type {
  height: 45px;
  position: relative;
  display: flex;
  justify-content: flex-end;
  max-width: 100px;
  margin-left: auto;
  width: 100%;
}
@media screen and (max-width: 480px) {
  .card-item__type {
    height: 40px;
    max-width: 90px;
  }
}
@media screen and (max-width: 360px) {
  .card-item__type {
    height: 30px;
  }
}
.card-item__typeImg {
  max-width: 100%;
  object-fit: contain;
  max-height: 100%;
  object-position: top right;
}
.card-item__info {
  color: #fff;
  width: 100%;
  max-width: calc(100% - 85px);
  padding: 10px 15px;
  font-weight: 500;
  display: block;
  cursor: pointer;
}
@media screen and (max-width: 480px) {
  .card-item__info {
    padding: 10px;
  }
}
.card-item__holder {
  opacity: 0.7;
  font-size: 13px;
  padding-bottom: 10px;
  display: block;
}
@media screen and (max-width: 480px) {
  .card-item__holder {
    font-size: 12px;
    padding-bottom: 5px;
  }
}
.card-item__wrapper {
  font-family: 'Source Code Pro', monospace;
  padding: 25px 15px;
  position: relative;
  z-index: 4;
  height: 100%;
  text-shadow: 7px 6px 10px rgba(14, 42, 90, 0.8);
  user-select: none;
}
@media screen and (max-width: 480px) {
  .card-item__wrapper {
    padding: 20px 10px;
  }
}
.card-item__name {
  display: block;
  font-size: 18px;
  line-height: 1;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
}
@media screen and (max-width: 480px) {
  .card-item__name {
    font-size: 16px;
  }
}
.card-item__nameItem {
  display: inline-block;
  min-width: 8px;
  position: relative;
}
.card-item__number {
  font-weight: 500;
  line-height: 1;
  color: #fff;
  font-size: 27px;
  margin-bottom: 25px;
  display: inline-block;
  padding: 10px 15px;
  cursor: pointer;
}
@media screen and (max-width: 480px) {
  .card-item__number {
    font-size: 21px;
    margin-bottom: 15px;
    padding: 10px 10px;
  }
}
@media screen and (max-width: 360px) {
  .card-item__number {
    font-size: 19px;
    margin-bottom: 10px;
    padding: 10px 10px;
  }
}
.card-item__numberItem {
  width: 16px;
  display: inline-block;
}
.card-item__numberItem.-active {
  width: 30px;
}
@media screen and (max-width: 480px) {
  .card-item__numberItem {
    width: 13px;
  }
  .card-item__numberItem.-active {
    width: 16px;
  }
}
@media screen and (max-width: 360px) {
  .card-item__numberItem {
    width: 12px;
  }
  .card-item__numberItem.-active {
    width: 8px;
  }
}
.card-item__content {
  color: #fff;
  display: flex;
  align-items: flex-start;
}
.card-item__date {
  flex-wrap: wrap;
  font-size: 18px;
  margin-left: auto;
  padding: 10px;
  display: inline-flex;
  width: 80px;
  white-space: nowrap;
  flex-shrink: 0;
  cursor: pointer;
}
@media screen and (max-width: 480px) {
  .card-item__date {
    font-size: 16px;
  }
}
.card-item__dateItem {
  position: relative;
}
.card-item__dateItem span {
  width: 22px;
  display: inline-block;
}
.card-item__dateTitle {
  opacity: 0.7;
  font-size: 13px;
  padding-bottom: 6px;
  width: 100%;
}
@media screen and (max-width: 480px) {
  .card-item__dateTitle {
    font-size: 12px;
    padding-bottom: 5px;
  }
}
.card-item__band {
  background: rgba(0, 0, 19, 0.8);
  width: 100%;
  height: 50px;
  margin-top: 30px;
  position: relative;
  z-index: 2;
}
@media screen and (max-width: 480px) {
  .card-item__band {
    margin-top: 20px;
  }
}
@media screen and (max-width: 360px) {
  .card-item__band {
    height: 40px;
    margin-top: 10px;
  }
}
.card-item__cvv {
  text-align: right;
  position: relative;
  z-index: 2;
  padding: 15px;
}
.card-item__cvv .card-item__type {
  opacity: 0.7;
}
@media screen and (max-width: 360px) {
  .card-item__cvv {
    padding: 10px 15px;
  }
}
.card-item__cvvTitle {
  display: block;
  padding-right: 60px;
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 5px;
  text-align: right;
  width: 100%;
}
.card-item__cvvBand {
  height: 45px;
  background: #fff;
  margin-bottom: 30px;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  margin-left: 10px;
  margin-right: 60px;
  color: #1a3b5d;
  font-size: 18px;
  border-radius: 4px;
  box-shadow: 0px 10px 20px -7px rgba(32, 56, 117, 0.35);
}
@media screen and (max-width: 480px) {
  .card-item__cvvBand {
    height: 40px;
    margin-bottom: 20px;
  }
}
@media screen and (max-width: 360px) {
  .card-item__cvvBand {
    margin-bottom: 15px;
  }
}
.card-list {
  margin-bottom: -130px;
}
@media screen and (max-width: 480px) {
  .card-list {
    margin-bottom: -120px;
  }
}
.slide-fade-up-enter-active {
  position: relative;
  transition: all 0.25s ease-in-out;
  transition-delay: 0.1s;
}

.slide-fade-up-leave-active {
  position: absolute;
  transition: all 0.25s ease-in-out;
}

.slide-fade-up-enter {
  pointer-events: none;
  opacity: 0;
  transform: translateY(15px);
}

.slide-fade-up-leave-to {
  pointer-events: none;
  opacity: 0;
  transform: translateY(-15px);
}

.slide-fade-right-enter-active {
  position: relative;
  transition: all 0.25s ease-in-out;
  transition-delay: 0.1s;
}

.slide-fade-right-leave-active {
  position: absolute;
  transition: all 0.25s ease-in-out;
}

.slide-fade-right-enter {
  pointer-events: none;
  opacity: 0;
  transform: translateX(10px) rotate(45deg);
}

.slide-fade-right-leave-to {
  pointer-events: none;
  opacity: 0;
  transform: translateX(-10px) rotate(45deg);
}
</style>
