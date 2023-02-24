<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { reservationFormStep } from '../../stores/reservationForm';

const step = useStore(reservationFormStep);
</script>

<template>
  <div v-if="step === 'complete'">
    <div class="mb-5">
      <div class="flex flex-col items-center content-center p-10 bg-white rounded-lg shadow">
        <h2 class="mb-4 text-2xl font-bold text-center text-gray-800">Registration Success</h2>
        <div class="trophy-container">
          <div class="action">
            <div class="trophy">
              <svg fill="#FFD600" width="100%" height="100%" viewBox="0 0 24 24">
                <path
                  d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"
                ></path>
              </svg>
            </div>
            <div class="confetti"></div>
            <div class="confetti two"></div>
            <div class="confetti three"></div>
            <div class="confetti four"></div>
            <div class="confetti--purple"></div>
            <div class="confetti--purple two"></div>
            <div class="confetti--purple three"></div>
            <div class="confetti--purple four"></div>
          </div>
        </div>
      </div>
      <a class="w-full btn btn-outline btn-success btn-lg" href="/"> Back to home </a>
    </div>
  </div>
</template>

<style scoped>
@keyframes trophy {
  0% {
    transform: translateY(500px);
    opacity: 0;
  }
  35% {
    opacity: 0;
  }
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}
@keyframes fly--up {
  0% {
    transform: translateY(10px);
    opacity: 0;
  }
  60% {
    opacity: 1;
  }
  80% {
    transform: translateY(-20vw);
  }
  100% {
    transform: translateY(-15vw);
    opacity: 0;
  }
}
@keyframes fly--down {
  0% {
    transform: translateY(-10px);
    opacity: 0;
  }
  60% {
    opacity: 1;
  }
  80% {
    transform: translateY(20vw);
  }
  100% {
    transform: translateY(15vw);
    opacity: 0;
  }
}
@keyframes fly--left {
  0% {
    transform: translateX(10px);
    opacity: 0;
  }
  60% {
    opacity: 1;
  }
  80% {
    transform: translateX(-35vw);
  }
  100% {
    transform: translateX(-180px);
    opacity: 0;
  }
}
@keyframes fly--right {
  0% {
    transform: translateX(-10px);
    opacity: 0;
  }
  60% {
    opacity: 1;
  }
  80% {
    transform: translateX(35vw);
  }
  100% {
    transform: translateX(180px);
    opacity: 0;
  }
}
@keyframes fly--up--left {
  0% {
    transform: rotate(135deg) translate(0vw, 0vw);
    opacity: 0;
  }
  60% {
    opacity: 1;
  }
  100% {
    transform: rotate(135deg) translate(-3vw, 20vw);
    opacity: 0;
  }
}
@keyframes fly--up--right {
  0% {
    transform: rotate(45deg);
    opacity: 0;
  }
  60% {
    opacity: 1;
  }
  100% {
    transform: rotate(45deg) translate(-3vw, -20vw);
    opacity: 0;
  }
}
@keyframes fly--down--left {
  0% {
    transform: rotate(45deg) translate(0vw, 0vw);
    opacity: 0;
  }
  60% {
    opacity: 1;
  }
  100% {
    transform: rotate(45deg) translate(-3vw, 20vw);
    opacity: 0;
  }
}
@keyframes fly--down--right {
  0% {
    transform: rotate(135deg) translate(0vw, 0vw);
    opacity: 0;
  }
  60% {
    opacity: 1;
  }
  100% {
    transform: rotate(135deg) translate(0vw, -20vw);
    opacity: 0;
  }
}
.trophy-container {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 25vh;
}
.trophy {
  z-index: 1;
  background-color: #fff;
  height: 100%;
  width: 100%;
  border-radius: 100%;
  animation: trophy 0.5s 1 forwards;
}
.action {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 300px;
  height: 25vw;
  max-width: 300px;
  width: 25vw;
}
.action .confetti,
.action .confetti--purple {
  z-index: -1;
  position: absolute;
  height: 50px;
  width: 10px;
  border-radius: 10px;
  animation-fill-mode: forwards;
  animation-duration: 0.75s;
  animation-iteration-count: 1;
  transform-origin: center middle;
  opacity: 0;
}
.action .confetti {
  top: 0;
  left: calc(50% - 5px);
  background-color: #ffea00;
  animation-name: fly--up;
  animation-delay: 0.35s;
}
.action .confetti.two {
  top: auto;
  bottom: 0;
  animation-name: fly--down;
}
.action .confetti.three,
.action .confetti.four {
  top: calc(50% - 5px);
  left: calc(50% - 25px);
  height: 10px;
  width: 50px;
  animation-name: fly--left;
}
.action .confetti.four {
  animation-name: fly--right;
}
.action .confetti--purple {
  background-color: #6200ea;
  animation-name: fly--up--left;
  transform: rotate(135deg);
  animation-delay: 0.5s;
  left: 20%;
  top: 20%;
}
.action .confetti--purple.two {
  animation-name: fly--up--right;
  left: auto;
  right: 20%;
  transform: rotate(45deg);
}
.action .confetti--purple.three {
  top: auto;
  bottom: 20%;
  transform: rotate(45deg);
  animation-name: fly--down--left;
}
.action .confetti--purple.four {
  top: auto;
  bottom: 20%;
  left: auto;
  right: 20%;
  transform: rotate(135deg);
  animation-name: fly--down--right;
}
</style>
