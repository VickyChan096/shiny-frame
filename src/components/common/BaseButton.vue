<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

const emits = defineEmits(['click'])
withDefaults(
  defineProps<{
    text: string
    active?: boolean
  }>(),
  {
    text: 'Text',
    active: false
  }
)

const handleClick = () => {
  emits('click')
}
</script>

<template>
  <button type="button" :class="{ active: active }" @click="handleClick">
    {{ text }}
  </button>
</template>

<style lang="scss" scoped>
button {
  padding: 6px 12px;
  color: $white;
  background: transparent;
  border: 1px solid $gray;
  border-radius: 2px;
  transition: $transition;
  cursor: pointer;

  &:hover {
    border-color: $white;
  }
  &.active {
    color: $black;
    background: $white;
    border-color: $white;
  }
}
</style>
