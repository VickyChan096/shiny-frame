<script setup lang="ts">
import ShinyFrame from '@/components/common/ShinyFrame.vue'
</script>

<template>
  <main>
    <ShinyFrame
      shapePath="M77 0L94.9611 55.2786H153.085L106.062 89.4427L124.023 144.721L77 110.557L29.9772 144.721L47.9383 89.4427L0.915482 55.2786H59.0389L77 0Z"
      :width="190"
      :height="190"
    >
      你的內容
    </ShinyFrame>
    <!-- <div class="arrow-border-anim">
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <mask id="rect-mask">
            <rect x="0" y="0" width="120" height="120" rx="12" fill="white" />
            <g transform="translate(6 6) scale(0.9) translate(0 0)">
              <rect x="0" y="0" width="120" height="120" rx="12" fill="black" />
            </g>
          </mask>
        </defs>
        <g mask="url(#rect-mask)">
          <rect x="0" y="0" width="120" height="120" fill="gray" />
          <rect class="rotating-bar" x="-45" y="45" width="200" height="30" fill="#fff" />
        </g>
      </svg>
    </div> -->
  </main>
</template>
<style scoped>
main {
  background-color: black;
}
/* .arrow-border-anim {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
}
.rotating-bar {
  transform-origin: 60px 60px;
  animation: rotate-bar 2s linear infinite;
  opacity: 0.8;
}
@keyframes rotate-bar {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
} */
</style>
