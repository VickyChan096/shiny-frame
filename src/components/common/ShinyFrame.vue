<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    shape: 'square' | 'heart'
    radius?: number
    strokeWidth?: number
    shouldAnimate?: boolean
    revolutionsPerSecond?: number
    dashRatio?: number
    speedExponent?: number
  }>(),
  {
    shape: 'square',
    radius: 6,
    strokeWidth: 2, // 邊框寬度 2px
    shouldAnimate: true,
    revolutionsPerSecond: 0.5, // 每秒轉 0.5 圈
    dashRatio: 1 / 12, // 亮條長度佔路徑 1/12
    speedExponent: 0.5 // 亮條加速指數  0.5
  }
)

const wrapper = ref<HTMLElement | null>(null)
const aspectRatio = 1
const size = ref(0)
const pathLength = ref(0) // 路徑總長度
const dashLength = ref(0) // 亮條長度
const offset1 = ref(0) // 第一條亮條偏移
const offset2 = ref(0) // 第二條亮條偏移

const shape = computed(() => props.shape)
const radius = computed(() => props.radius)
const strokeWidth = computed(() => props.strokeWidth)
const revolutionsPerSecond = computed(() => props.revolutionsPerSecond)
const dashRatio = computed(() => props.dashRatio)
const speedExponent = computed(() => props.speedExponent)
const showAnimatedLines = computed(() => props.shouldAnimate)

// 根據形狀生成 SVG 路徑
const shapePath = computed(() => {
  const width = size.value - strokeWidth.value
  const height = width / aspectRatio
  const x = strokeWidth.value / 2
  const y = strokeWidth.value / 2

  switch (shape.value) {
    case 'heart':
      // 愛心路徑自動縮放置中
      const rawCoords = { minX: -92.1667, maxX: 66.1667, minY: 0.364258, maxY: 145.635 }
      const rawWidth = rawCoords.maxX - rawCoords.minX
      const rawHeight = rawCoords.maxY - rawCoords.minY
      const targetW = width * 0.9
      const targetH = height * 0.9
      const scale = Math.min(targetW / rawWidth, targetH / rawHeight)
      const offsetX = x + (width - rawWidth * scale) / 2
      const offsetY = y + (height - rawHeight * scale) / 2
      const sx = (v: number) => offsetX + (v - rawCoords.minX) * scale
      const sy = (v: number) => offsetY + (v - rawCoords.minY) * scale

      // 愛心 SVG 路徑
      return `M ${sx(-13)} ${sy(145.635)}
              L ${sx(-24.4792)} ${sy(135.185)}
              C ${sx(-65.25)} ${sy(98.2143)} ${sx(-92.1667)} ${sy(73.8309)} ${sx(-92.1667)} ${sy(43.9059)}
              C ${sx(-92.1667)} ${sy(19.5226)} ${sx(-73.0084)} ${sy(0.364258)} ${sx(-48.625)} ${sy(0.364258)}
              C ${sx(-34.85)} ${sy(0.364258)} ${sx(-21.6292)} ${sy(6.77676)} ${sx(-13)} ${sy(16.9101)}
              C ${sx(-4.37085)} ${sy(6.77676)} ${sx(8.84998)} ${sy(0.364258)} ${sx(22.625)} ${sy(0.364258)}
              C ${sx(47.0083)} ${sy(0.364258)} ${sx(66.1667)} ${sy(19.5226)} ${sx(66.1667)} ${sy(43.9059)}
              C ${sx(66.1667)} ${sy(73.8309)} ${sx(39.25)} ${sy(98.2143)} ${sx(-1.52085)} ${sy(135.264)}
              L ${sx(-13)} ${sy(145.635)}
              Z`

    case 'square':
    default:
      // 圓角方形路徑
      return `M ${x + radius.value} ${y}
              L ${x + width - radius.value} ${y}
              Q ${x + width} ${y} ${x + width} ${y + radius.value}
              L ${x + width} ${y + height - radius.value}
              Q ${x + width} ${y + height} ${x + width - radius.value} ${y + height}
              L ${x + radius.value} ${y + height}
              Q ${x} ${y + height} ${x} ${y + height - radius.value}
              L ${x} ${y + radius.value}
              Q ${x} ${y} ${x + radius.value} ${y} Z`
  }
})
// 計算路徑長度
const getPathLength = () => {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', shapePath.value)
  return path.getTotalLength()
}

// 儲存動畫的 requestAnimationFrame 回傳的 ID，方便後續取消動畫
let requestAnimationFrameId: number
// 監聽元素尺寸變化，當元素大小改變時可以自動更新 SVG 的尺寸與路徑
let resizeObserver: ResizeObserver | null = null
let animationStartTime: number | null = null

const resetAnimation = () => {
  animationStartTime = null
  offset1.value = 0
  offset2.value = pathLength.value > 0 ? -(pathLength.value / 2) : 0
}
const animate = (time: number) => {
  if (showAnimatedLines.value) {
    if (animationStartTime === null) {
      animationStartTime = time
    }
    const elapsedTime = (time - animationStartTime) / 1000

    // 確保路徑長度算出來後才開始動畫，避免一開始資料還沒準備好就執行動畫導致錯誤或閃爍
    if (pathLength.value === 0) {
      requestAnimationFrameId = requestAnimationFrame(animate)
      return
    }

    // 基本週期進度：計算動畫目前這一圈的進度（0 表示剛開始，1 表示一圈結束），用來控制亮條在邊框上的位置
    const baseCycleProgress = (elapsedTime * revolutionsPerSecond.value) % 1

    // 動態速度調整：在水平邊（0-0.25 和 0.5-0.75）時加速
    const getAdjustedProgress = (progress: number): number => {
      const segment = progress * 4 // 將 0~1 的進度映射到 0~4，每個邊佔 1
      const segmentIndex = Math.floor(segment) // 取得目前在第幾個邊（0,1,2,3）
      const segmentProgress = segment - segmentIndex // 取得在這個邊上的進度（0~1）

      let adjustedSegmentProgress
      if (segmentIndex === 0 || segmentIndex === 2) {
        // 在上邊（0~1）和下邊（2~3）時加速
        // 上邊和下邊加速，使用平方根來增加速度
        adjustedSegmentProgress = Math.pow(segmentProgress, speedExponent.value)
      } else {
        adjustedSegmentProgress = segmentProgress
      }
      return (segmentIndex + adjustedSegmentProgress) / 4
    }

    const adjustedProgress = getAdjustedProgress(baseCycleProgress)
    const rotationOffset = adjustedProgress * pathLength.value

    offset1.value = -rotationOffset

    const secondProgress = getAdjustedProgress((baseCycleProgress + 0.5) % 1)
    offset2.value = -(secondProgress * pathLength.value)
  } else {
    animationStartTime = null
    offset1.value = 0
    offset2.value = -(pathLength.value / 2)
  }

  requestAnimationFrameId = requestAnimationFrame(animate)
}

// 監聽動畫狀態變化
watch(
  showAnimatedLines,
  (newValue) => {
    if (newValue) {
      resetAnimation()
    }
  },
  { immediate: true }
)

onMounted(() => {
  const updateSize = () => {
    if (!wrapper.value) {
      return
    }
    size.value = wrapper.value.clientWidth

    const oldPathLength = pathLength.value
    pathLength.value = getPathLength()
    dashLength.value = pathLength.value * dashRatio.value

    // 如果路徑長度改變了，重置動畫
    if (oldPathLength !== pathLength.value) {
      resetAnimation()
    }
  }
  updateSize()

  // 監聽外層尺寸變化
  resizeObserver = new ResizeObserver(() => {
    updateSize()
  })

  if (wrapper.value) {
    resizeObserver.observe(wrapper.value)
  }

  requestAnimationFrameId = requestAnimationFrame(animate)
})

onBeforeUnmount(() => {
  // 元件卸載時清理
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  cancelAnimationFrame(requestAnimationFrameId)
})
</script>

<template>
  <div ref="wrapper" class="box-wrapper">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <!-- 邊框 -->
      <path :d="shapePath" fill="none" stroke="gray" :stroke-width="strokeWidth" />
      <!-- 邊框亮條 1 -->
      <path
        v-if="showAnimatedLines"
        :d="shapePath"
        fill="none"
        stroke="white"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :stroke-dasharray="`${dashLength} ${pathLength - dashLength}`"
        :stroke-dashoffset="offset1"
      />
      <!-- 邊框亮條 2 -->
      <path
        v-if="showAnimatedLines"
        :d="shapePath"
        fill="none"
        stroke="white"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :stroke-dasharray="`${dashLength} ${pathLength - dashLength}`"
        :stroke-dashoffset="offset2"
      />
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.box-wrapper {
  width: 100%;
  aspect-ratio: 1;

  svg {
    width: 100%;
    height: 100%;
  }
}
</style>
