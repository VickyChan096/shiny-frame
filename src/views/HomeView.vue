<script lang="ts" setup>
import { ref, computed } from 'vue'
import ShinyFrame from '@/components/common/ShinyFrame.vue'

const gridSize = ref(1)
const animationMode = ref<'all' | 'random'>('all')
const currentShape = ref<'square' | 'heart'>('square')

// 根據網格大小計算總數量
const totalShapes = computed(() => gridSize.value * gridSize.value)
// 生成網格數據
const shapes = computed(() => {
  const result = []
  for (let i = 0; i < totalShapes.value; i++) {
    result.push({
      id: i,
      shouldAnimate: animationMode.value === 'all' ? true : Math.random() > 0.5,
      key: `${gridSize.value}-${animationMode.value}-${currentShape.value}-${i}`
    })
  }
  return result
})

// 設置網格大小
const setGridSize = (size: number) => {
  gridSize.value = size
}
// 設置動畫模式
const setAnimationMode = (mode: 'all' | 'random') => {
  animationMode.value = mode
}
// 設置形狀
const setShape = (shape: 'square' | 'heart') => {
  currentShape.value = shape
}
</script>

<template>
  <main>
    <div class="grid-container" :style="{ '--grid-size': gridSize }">
      <ShinyFrame v-for="shape in shapes" :key="shape.key" :shape="currentShape" :shouldAnimate="shape.shouldAnimate" />
    </div>

    <div class="controls">
      <div class="grid-buttons">
        <button @click="setGridSize(1)" :class="{ active: gridSize === 1 }">1x1</button>
        <button @click="setGridSize(3)" :class="{ active: gridSize === 3 }">3x3</button>
        <button @click="setGridSize(5)" :class="{ active: gridSize === 5 }">5x5</button>
        <button @click="setGridSize(10)" :class="{ active: gridSize === 10 }">10x10</button>
      </div>
      <div class="mode-buttons">
        <button @click="setShape('heart')" :class="{ active: currentShape === 'heart' }">Heart</button>
        <button @click="setShape('square')" :class="{ active: currentShape === 'square' }">Square</button>

        <div class="radio-group">
          <label class="radio-label">
            <input type="radio" value="all" v-model="animationMode" @change="setAnimationMode('all')" />
            <span class="radio-button"></span>
            All
          </label>
          <label class="radio-label">
            <input type="radio" value="random" v-model="animationMode" @change="setAnimationMode('random')" />
            <span class="radio-button"></span>
            Random
          </label>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
main {
  height: 100vh;
  background-color: $black;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(var(--grid-size), 1fr);
  grid-template-rows: repeat(var(--grid-size), 1fr);
  gap: 4px;
  width: 390px;
  height: 390px; // 明確設定高度等於寬度
  margin: 0 auto;

  // 讓每個 ShinyFrame 都能自適應寬度
  :deep(.box-wrapper) {
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
  }
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;

  .grid-buttons,
  .mode-buttons {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  button {
    padding: 8px 16px;
    border: 2px solid #666;
    background: transparent;
    color: white;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.3s ease;

    &:hover {
      border-color: white;
    }

    &.active {
      border-color: white;
      background: white;
      color: black;
    }
  }

  .radio-group {
    display: flex;
    gap: 15px;
    margin-left: 20px;

    .radio-label {
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
      cursor: pointer;
      font-size: 14px;

      input[type='radio'] {
        display: none;
      }

      .radio-button {
        width: 16px;
        height: 16px;
        border: 2px solid #666;
        border-radius: 50%;
        position: relative;
        transition: all 0.3s ease;

        &::after {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: white;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
      }

      &:hover .radio-button {
        border-color: white;
      }

      input[type='radio']:checked + .radio-button {
        border-color: white;

        &::after {
          opacity: 1;
        }
      }
    }
  }
}
</style>
