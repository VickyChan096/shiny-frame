<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'

const props = defineProps<{
  shouldAnimate?: boolean
  shape?: 'square' | 'heart'
  aspectRatio?: number // 寬高比，默認為 1 (正方形)
}>()

const wrapper = ref<HTMLElement | null>(null)
const shapeElement = ref<SVGElement | null>(null)
const size = ref(200)

const strokeWidth = 2
const radius = 6
const speed = 0.5 // 每秒轉幾圈（比例速度）
const currentShape = computed(() => props.shape || 'square')
const currentAspectRatio = computed(() => props.aspectRatio || 1)

const pathLength = ref(0)
const dashLength = ref(0) // 亮條長度，邊長的1/3
const offset1 = ref(0)
const offset2 = ref(0)

// 控制是否顯示動畫線條
const showAnimatedLines = computed(() => props.shouldAnimate ?? true)

// 根據形狀生成 SVG 路徑
const shapePath = computed(() => {
  const width = size.value - strokeWidth
  const height = width / currentAspectRatio.value
  const x = strokeWidth / 2
  const y = strokeWidth / 2

  switch (currentShape.value) {
    case 'heart':
      // 使用使用者提供的新愛心 SVG 路徑並自動縮放置中
      // 原始路徑座標範圍
      const rawCoords = { minX: -92.1667, maxX: 66.1667, minY: 0.364258, maxY: 145.635 }
      const rawWidth = rawCoords.maxX - rawCoords.minX
      const rawHeight = rawCoords.maxY - rawCoords.minY

      // 保留一點邊距 (90% 區域)
      const targetW = width * 0.9
      const targetH = height * 0.9

      // 等比縮放
      const scale = Math.min(targetW / rawWidth, targetH / rawHeight)

      // 置中偏移
      const offsetX = x + (width - rawWidth * scale) / 2
      const offsetY = y + (height - rawHeight * scale) / 2

      const sx = (v: number) => offsetX + (v - rawCoords.minX) * scale
      const sy = (v: number) => offsetY + (v - rawCoords.minY) * scale

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
      return `M ${x + radius} ${y}
              L ${x + width - radius} ${y}
              Q ${x + width} ${y} ${x + width} ${y + radius}
              L ${x + width} ${y + height - radius}
              Q ${x + width} ${y + height} ${x + width - radius} ${y + height}
              L ${x + radius} ${y + height}
              Q ${x} ${y + height} ${x} ${y + height - radius}
              L ${x} ${y + radius}
              Q ${x} ${y} ${x + radius} ${y} Z`
  }
})

// 創建虛擬路徑元素來計算長度
const getPathLength = () => {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', shapePath.value)
  return path.getTotalLength()
}

let rafId: number
let ro: ResizeObserver | null = null
let animationStartTime: number | null = null

// 重置動畫狀態
const resetAnimation = () => {
  animationStartTime = null
  offset1.value = 0
  offset2.value = pathLength.value > 0 ? -(pathLength.value / 2) : 0
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

const animate = (time: number) => {
  // 只有在需要動畫時才計算偏移
  if (showAnimatedLines.value) {
    // 初始化動畫開始時間
    if (animationStartTime === null) {
      animationStartTime = time
    }

    const elapsedTime = (time - animationStartTime) / 1000 // 轉換為秒

    if (pathLength.value === 0) {
      rafId = requestAnimationFrame(animate)
      return
    }

    // 基本週期進度
    const baseCycleProgress = (elapsedTime * speed) % 1

    // 計算動態速度：在水平邊（0-0.25 和 0.5-0.75）時加速
    function getAdjustedProgress(progress: number): number {
      const segment = progress * 4 // 將 0-1 映射到 0-4，每個邊佔 1
      const segmentIndex = Math.floor(segment)
      const segmentProgress = segment - segmentIndex

      let adjustedSegmentProgress
      // 在上邊（0-1）和下邊（2-3）時加速
      if (segmentIndex === 0 || segmentIndex === 2) {
        // 使用二次函數加速：y = x^0.7（比線性快，但不會太突兀）
        adjustedSegmentProgress = Math.pow(segmentProgress, 0.5)
      } else {
        // 左邊和右邊保持正常速度
        adjustedSegmentProgress = segmentProgress
      }

      return (segmentIndex + adjustedSegmentProgress) / 4
    }

    const adjustedProgress = getAdjustedProgress(baseCycleProgress)
    const rotationOffset = adjustedProgress * pathLength.value

    // 第一條線：沿著邊框順時針移動（使用負偏移）
    offset1.value = -rotationOffset

    // 第二條線：從相反位置開始
    const secondProgress = getAdjustedProgress((baseCycleProgress + 0.5) % 1)
    offset2.value = -(secondProgress * pathLength.value)
  } else {
    // 如果不需要動畫，重置偏移值和時間
    animationStartTime = null
    offset1.value = 0
    offset2.value = -(pathLength.value / 2)
  }

  rafId = requestAnimationFrame(animate)
}
onMounted(() => {
  const updateSize = () => {
    if (!wrapper.value) return
    size.value = wrapper.value.clientWidth

    const oldPathLength = pathLength.value
    pathLength.value = getPathLength()
    // 線條長度 = 邊長的1/3，邊長 = 總周長/4，所以線條長度 = 總周長/12
    dashLength.value = pathLength.value / 12

    // 如果路徑長度改變了，重置動畫
    if (oldPathLength !== pathLength.value) {
      resetAnimation()
    }
  }
  updateSize()

  ro = new ResizeObserver(() => {
    updateSize()
  })
  if (wrapper.value) ro.observe(wrapper.value)

  rafId = requestAnimationFrame(animate)
})

onBeforeUnmount(() => {
  if (ro) ro.disconnect()
  cancelAnimationFrame(rafId)
})
</script>

<template>
  <div ref="wrapper" class="box-wrapper">
    <svg :width="size" :height="size / currentAspectRatio" :viewBox="`0 0 ${size} ${size / currentAspectRatio}`">
      <!-- 背景邊框 -->
      <path ref="shapeElement" :d="shapePath" fill="none" stroke="#666" :stroke-width="strokeWidth" />
      <!-- 亮條 1 -->
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
      <!-- 亮條 2 -->
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
  aspect-ratio: v-bind(currentAspectRatio);

  svg {
    width: 100%;
    height: 100%;
  }
}
</style>
