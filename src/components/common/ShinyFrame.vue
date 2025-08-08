<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  shapePath: { type: String, required: true },
  width: { type: Number, default: 154 },
  height: { type: Number, default: 145 },
  innerScale: { type: Number, default: 0.9 }
})
</script>

<template>
  <div class="star-border-anim" :style="{ width: width + 'px', height: height + 'px' }">
    <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" fill="none">
      <defs>
        <mask id="shape-mask">
          <path :d="shapePath" fill="white" />
          <g
            v-if="innerScale < 1"
            :transform="`translate(${width / 2} ${height / 2}) scale(${innerScale}) translate(-${width / 2} -${height / 2})`"
          >
            <path :d="shapePath" fill="black" />
          </g>
        </mask>
      </defs>
      <g mask="url(#shape-mask)">
        <path :d="shapePath" fill="#333" />
        <rect
          class="star-rotating-bar"
          :x="-width * 0.13"
          :y="height * 0.41"
          :width="width * 1.23"
          :height="height * 0.11"
          fill="#fff"
          fill-opacity="0.7"
        />
      </g>
    </svg>
    <div class="star-center-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.star-border-anim {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.star-rotating-bar {
  transform-origin: 50% 50%;
  animation: rotate-star-bar 2.5s linear infinite;
  opacity: 0.8;
}
.star-center-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  pointer-events: none;
}
@keyframes rotate-star-bar {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
