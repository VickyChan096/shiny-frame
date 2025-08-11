<script lang="ts" setup>
import { ref, computed } from 'vue'
import ShinyFrame from '@/components/common/ShinyFrame.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseRadio from '@/components/common/BaseRadio.vue'
import FlexBox from '@/components/layouts/FlexBox.vue'

const gridSize = ref(1)
const animationMode = ref<'all' | 'random'>('all')
const currentShape = ref<'square' | 'heart'>('square')

const totalShapes = computed(() => gridSize.value * gridSize.value)
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

const setShape = (shape: 'square' | 'heart') => {
  currentShape.value = shape
}
const setGridSize = (size: number) => {
  gridSize.value = size
}
const setAnimationMode = (mode: 'all' | 'random') => {
  animationMode.value = mode
}
</script>

<template>
  <main>
    <div class="page-container">
      <div class="shapes" :style="{ '--grid-size': gridSize }">
        <ShinyFrame
          v-for="shape in shapes"
          :key="shape.key"
          :shape="currentShape"
          :shouldAnimate="shape.shouldAnimate"
        />
      </div>
      <FlexBox gap="20px">
        <FlexBox>
          <BaseButton text="Square" :active="currentShape === 'square'" @click="setShape('square')" />
          <BaseButton text="Heart" :active="currentShape === 'heart'" @click="setShape('heart')" />
        </FlexBox>
        <FlexBox>
          <BaseButton
            v-for="size in [1, 3, 5, 10]"
            :key="size"
            :text="`${size}x${size}`"
            :active="gridSize === size"
            @click="setGridSize(size)"
          />
        </FlexBox>
        <FlexBox>
          <BaseRadio v-model="animationMode" value="all" label="All" @change="setAnimationMode('all')" />
          <BaseRadio v-model="animationMode" value="random" label="Random" @change="setAnimationMode('random')" />
        </FlexBox>
      </FlexBox>
    </div>
  </main>
</template>

<style lang="scss" scoped>
main {
  min-height: 100svh;
  background-color: $black;
}
.page-container {
  margin: 0 auto;
  width: 100%;
  padding: 20px;

  @include mobile {
    max-width: 390px;
  }
}
.shapes {
  display: grid;
  grid-template-columns: repeat(var(--grid-size), 1fr);
  grid-template-rows: repeat(var(--grid-size), 1fr);
  gap: 4px;
  margin-bottom: 20px;

  // 讓每個 ShinyFrame 都能自適應寬度
  :deep(.box-wrapper) {
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
  }
}
</style>
