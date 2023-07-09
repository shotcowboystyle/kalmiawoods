<script setup lang="ts">
import gsap from 'gsap';
import { ref } from 'vue';

const submitButton = ref();

const getStylePropValue = (variable: string) => getComputedStyle(submitButton.value).getPropertyValue(variable);

const animateSubmitButton = () => {
  if (!submitButton.value.classList.contains('active')) {
    submitButton.value.classList.add('active');

    gsap.to(submitButton.value, {
      keyframes: [
        {
          '--width': '150px',
          duration: 0.2,
        },
        {
          '--left-wing-first-x': 50,
          '--left-wing-first-y': 100,
          '--right-wing-second-x': 50,
          '--right-wing-second-y': 100,
          duration: 0.2,
          onComplete() {
            gsap.set(submitButton.value, {
              '--left-wing-first-y': 0,
              '--left-wing-second-x': 40,
              '--left-wing-second-y': 100,
              '--left-wing-third-x': 0,
              '--left-wing-third-y': 100,
              '--left-body-third-x': 40,
              '--right-wing-first-x': 50,
              '--right-wing-first-y': 0,
              '--right-wing-second-x': 60,
              '--right-wing-second-y': 100,
              '--right-wing-third-x': 100,
              '--right-wing-third-y': 100,
              '--right-body-third-x': 60,
            });
          },
        },
        {
          '--left-wing-third-x': 20,
          '--left-wing-third-y': 90,
          '--left-wing-second-y': 90,
          '--left-body-third-y': 90,
          '--right-wing-third-x': 80,
          '--right-wing-third-y': 90,
          '--right-body-third-y': 90,
          '--right-wing-second-y': 90,
          duration: 0.2,
        },
        {
          '--rotate': 50,
          '--left-wing-third-y': 95,
          '--left-wing-third-x': 27,
          '--right-body-third-x': 45,
          '--right-wing-second-x': 45,
          '--right-wing-third-x': 60,
          '--right-wing-third-y': 83,
          duration: 0.25,
        },
        {
          '--rotate': 55,
          '--plane-x': -8,
          '--plane-y': 24,
          duration: 0.2,
        },
        {
          '--rotate': 40,
          '--plane-x': 45,
          '--plane-y': -180,
          '--plane-opacity': 0,
          duration: 0.3,
          // onComplete() {
          //   setTimeout(() => {
          //     submitButton.value.removeAttribute('style');
          //     gsap.fromTo(
          //       submitButton.value,
          //       {
          //         opacity: 0,
          //         y: -8,
          //       },
          //       {
          //         opacity: 1,
          //         y: 0,
          //         clearProps: true,
          //         duration: 0.3,
          //         onComplete() {
          //           submitButton.value.classList.remove('active');
          //         },
          //       },
          //     );
          //   }, 2000);
          // },
        },
      ],
    });

    gsap.to(submitButton.value, {
      keyframes: [
        {
          '--text-opacity': 0,
          '--border-radius': 0,
          '--left-wing-background': getStylePropValue('--primary-darkest'),
          '--right-wing-background': getStylePropValue('--primary-darkest'),
          duration: 0.1,
        },
        {
          '--left-wing-background': getStylePropValue('--primary'),
          '--right-wing-background': getStylePropValue('--primary'),
          duration: 0.1,
        },
        {
          '--left-body-background': getStylePropValue('--primary-dark'),
          '--right-body-background': getStylePropValue('--primary-darkest'),
          duration: 0.4,
        },
        {
          '--success-opacity': 1,
          '--success-scale': 1,
          duration: 0.25,
          delay: 0.25,
        },
        {
          '--checkmark-box-shadow': `inset 0px 0px 0px 30px ${getStylePropValue('--primary')}`,
          duration: 0.4,
        },
        {
          transform: 'scale3d(1.1, 1.1, 1)',
          duration: 0.3,
          delay: 0.4,
        },
        {
          '--checkmark-circle-stroke-dash-offset': 0,
          duration: 0.1,
        },
        {
          '--checkmark-check-stroke-dash-offset': 0,
          duration: 0.3,
          delay: 0.3,
        },
        {
          '--success-text-opacity': 1,
          '--success-text-margin-left': '8px',
          // '--success-text-transform': `rotate(calc(var(${getStylePropValue('--rotate')}) * -1deg)) translateZ(0)`,
          duration: 0.3,
          delay: 0.4,
        },
      ],
    });
  }
};

const handleOnSubmit = () => {
  animateSubmitButton();
};
</script>

<template>
  <h2 class="mb-1 text-lg font-medium text-gray-800 title-font">Have a question?</h2>
  <p class="mb-4 leading-relaxed text-gray-800">Drop us a line and we'll get right back to you.</p>
  <div class="w-full mb-4 form-control">
    <label class="label" for="name">
      <span class="text-base text-gray-800 label-text">Name</span>
    </label>
    <input
      id="name"
      name="name"
      type="text"
      class="w-full text-gray-800 bg-white border-gray-300 input-bordered input"
    />
  </div>
  <div class="w-full mb-4 form-control">
    <label class="label" for="email">
      <span class="text-base text-gray-800 label-text">Email</span>
    </label>
    <input
      id="email"
      name="email"
      type="email"
      class="w-full text-gray-800 bg-white border-gray-300 input-bordered input"
    />
  </div>
  <div class="w-full mb-4 form-control">
    <label class="label" for="message">
      <span class="text-base text-gray-800 label-text">Message</span>
    </label>
    <textarea
      id="message"
      name="message"
      class="text-gray-800 bg-white border-gray-300 3w-full textarea-bordered textarea"
    ></textarea>
  </div>

  <button ref="submitButton" class="self-center btn-send-message" @click.once="() => handleOnSubmit()">
    <span class="default">Send Message</span>
    <span class="success">
      <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
        <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
      </svg>
      <span class="success-text">Message Sent</span>
    </span>
    <div class="left"></div>
    <div class="right"></div>
  </button>

  <p class="mt-3 text-sm text-gray-800">Give us one business day to respond before getting upset!</p>
</template>

<style scoped>
.btn-send-message {
  --primary: hsl(var(--p));
  --primary-dark: hsl(var(--pf));
  --primary-darkest: #1eb854;
  --text: #fff;
  --text-opacity: 1;
  --success: #2b3044;
  --success-scale: 0.2;
  --success-opacity: 0;
  --border-radius: 7;
  --overflow: hidden;
  --rotate: 0;
  --plane-x: 0;
  --plane-y: 0;
  --plane-opacity: 1;
  --left-wing-background: var(--primary);
  --left-wing-first-x: 0;
  --left-wing-first-y: 0;
  --left-wing-second-x: 50;
  --left-wing-second-y: 0;
  --left-wing-third-x: 0;
  --left-wing-third-y: 100;
  --left-body-background: var(--primary);
  --left-body-first-x: 50;
  --left-body-first-y: 0;
  --left-body-second-x: 50;
  --left-body-second-y: 100;
  --left-body-third-x: 0;
  --left-body-third-y: 100;
  --right-wing-background: var(--primary);
  --right-wing-first-x: 50;
  --right-wing-first-y: 0;
  --right-wing-second-x: 100;
  --right-wing-second-y: 0;
  --right-wing-third-x: 100;
  --right-wing-third-y: 100;
  --right-body-background: var(--primary);
  --right-body-first-x: 50;
  --right-body-first-y: 0;
  --right-body-second-x: 50;
  --right-body-second-y: 100;
  --right-body-third-x: 100;
  --right-body-third-y: 100;
  --width: 100%;

  --checkmark-scale: scale3d(1, 1, 1);
  --checkmark-circle-stroke-dash-offset: 166;
  --checkmark-check-stroke-dash-offset: 48;
  --checkmark-box-shadow: inset 0px 0px 0px var(--primary);

  --success-text-opacity: 0;
  --success-text-margin-left: 0;
  --success-text-transform: none;

  position: relative;
  display: block;
  min-width: 100px;
  padding: 8px 0;
  margin: 0;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  color: var(--text);
  text-align: center;
  cursor: pointer;
  background: none;
  border: 0;
  outline: none;
  transform: rotate(calc(var(--rotate) * 1deg)) translateZ(0);
  width: var(--width);
  -webkit-appearance: none;
  appearance: none;
  -webkit-tap-highlight-color: transparent;
}

.btn-send-message .left,
.btn-send-message .right {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: var(--plane-opacity);
  transform: translate(calc(var(--plane-x) * 1px), calc(var(--plane-y) * 1px)) translateZ(0);
}

.btn-send-message .left::before,
.btn-send-message .right::before,
.btn-send-message .left::after,
.btn-send-message .right::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: var(--z-index, 2);
  clip-path: polygon(
    calc(var(--first-x, var(--left-wing-first-x)) * 1%) calc(var(--first-y, var(--left-wing-first-y)) * 1%),
    calc(var(--second-x, var(--left-wing-second-x)) * 1%) calc(var(--second-y, var(--left-wing-second-y)) * 1%),
    calc(var(--third-x, var(--left-wing-third-x)) * 1%) calc(var(--third-y, var(--left-wing-third-y)) * 1%)
  );
  content: '';
  background: var(--background, var(--left-wing-background));
  border-radius: calc(var(--border-radius) * 1px);
  transform: translate(var(--x, 0.4%), var(--y, 0)) translateZ(0);
}

.btn-send-message .left::after {
  --x: 0;
  --z-index: 1;
  --background: var(--left-body-background);
  --first-x: var(--left-body-first-x);
  --first-y: var(--left-body-first-y);
  --second-x: var(--left-body-second-x);
  --second-y: var(--left-body-second-y);
  --third-x: var(--left-body-third-x);
  --third-y: var(--left-body-third-y);
}

.btn-send-message .right::before {
  --x: -0.4%;
  --z-index: 2;
  --background: var(--right-wing-background);
  --first-x: var(--right-wing-first-x);
  --first-y: var(--right-wing-first-y);
  --second-x: var(--right-wing-second-x);
  --second-y: var(--right-wing-second-y);
  --third-x: var(--right-wing-third-x);
  --third-y: var(--right-wing-third-y);
}

.btn-send-message .right::after {
  --x: 0;
  --z-index: 1;
  --background: var(--right-body-background);
  --first-x: var(--right-body-first-x);
  --first-y: var(--right-body-first-y);
  --second-x: var(--right-body-second-x);
  --second-y: var(--right-body-second-y);
  --third-x: var(--right-body-third-x);
  --third-y: var(--right-body-third-y);
}

.btn-send-message span {
  position: relative;
  z-index: 4;
  display: block;
  opacity: var(--text-opacity);
}

.btn-send-message span.success svg {
  display: inline;
}

.btn-send-message span.success .checkmark {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline;
  stroke-width: 2;
  stroke: var(--primary);
  stroke-miterlimit: 10;
  box-shadow: var(--checkmark-box-shadow);
  /* animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both; */
  position: relative;
  /* top: 5px;
  right: 5px; */
  margin: 0 auto;
  transform: rotate(calc(var(--rotate) * 1deg));
}
.btn-send-message span.success .checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: var(--checkmark-circle-stroke-dash-offset);
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: var(--primary);
  fill: #fff;
  /* animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards; */
}

.btn-send-message span.success .checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: var(--checkmark-check-stroke-dash-offset);
  /* animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards; */
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes scale {
  0%,
  100% {
    transform: none;
  }

  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}

@keyframes fill {
  100% {
    box-shadow: inset 0px 0px 0px 30px #4bb71b;
  }
}

.btn-send-message span.success {
  position: absolute;
  top: 8px;
  right: 0;
  left: 0;
  z-index: 0;
  color: var(--success);
  opacity: var(--success-opacity);
  transform: rotate(calc(var(--rotate) * -1deg)) scale(var(--success-scale)) translateZ(0);
}

.btn-send-message span.success .success-text {
  /* transform: var(--success-text-transform); */
  /* transform: rotate(calc(var(--rotate) * 1deg)) translateZ(0); */
  display: inline;
  margin-left: var(--success-text-margin-left);
  opacity: var(--success-text-opacity);
}
</style>
