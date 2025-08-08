<script lang="ts" setup>
import { onMounted } from 'vue'

onMounted(() => {
  const spinnerEl = document.querySelector('.spinner-border') as HTMLElement | null
  const heartEl = document.querySelector('.heart') as HTMLElement | null

  spinnerEl?.style.setProperty('--border-angle', '0turn')
  heartEl?.style.setProperty('--border-angle', '0turn')

  const animate = () => {
    const now = performance.now() / 2000
    const angle = now % 1 // 1秒為一圈
    spinnerEl?.style.setProperty('--border-angle', `${angle}turn`)
    heartEl?.style.setProperty('--border-angle', `${angle}turn`)
    requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
})
</script>

<template>
  <main>
    <div class="spinner-border">111</div>
    <div class="star-border-anim">
      <svg width="154" height="145" viewBox="0 0 154 145" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <mask id="star-mask">
            <!-- 外層星星 -->
            <path
              d="M77 0L94.9611 55.2786H153.085L106.062 89.4427L124.023 144.721L77 110.557L29.9772 144.721L47.9383 89.4427L0.915482 55.2786H59.0389L77 0Z"
              fill="white"
            />
            <!-- 內層等比縮小星星，中心縮放 -->
            <g transform="translate(77 72.5) scale(0.9) translate(-77 -71.5)">
              <path
                d="M77 0L94.9611 55.2786H153.085L106.062 89.4427L124.023 144.721L77 110.557L29.9772 144.721L47.9383 89.4427L0.915482 55.2786H59.0389L77 0Z"
                fill="black"
              />
            </g>
          </mask>
        </defs>
        <g mask="url(#star-mask)">
          <path
            d="M77 0L94.9611 55.2786H153.085L106.062 89.4427L124.023 144.721L77 110.557L29.9772 144.721L47.9383 89.4427L0.915482 55.2786H59.0389L77 0Z"
            fill="#333"
          />
          <rect class="star-rotating-bar" x="-20" y="60" width="190" height="16" fill="#fff" fill-opacity="0.7" />
        </g>
      </svg>
      <div class="star-center-content">你的內容</div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
main {
  padding: 50px;
  background-color: black;
}
.spinner-border {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  background:
    conic-gradient(
      from calc(var(--border-angle) + 45deg),
      white 0deg 30deg,
      transparent 30deg 180deg,
      white 180deg 210deg,
      transparent 210deg 360deg
    ),
    #333;
  -webkit-mask:
    linear-gradient(#333 0 0) content-box,
    linear-gradient(#333 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#333 0 0) content-box,
    linear-gradient(#333 0 0);
  mask-composite: exclude;
  padding: 2px;
}

.star-border-anim {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 145px;
}
.star-rotating-bar {
  transform-origin: 77px 72.5px;
  animation: rotate-star-bar 2.5s linear infinite;
  opacity: 0.8;
}
@keyframes rotate-star-bar {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.star-center-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 18px;
  font-weight: bold;
  pointer-events: none; // 如需互動可移除
  text-align: center;
}
</style>
