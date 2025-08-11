<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

const emits = defineEmits(['update:modelValue'])
const props = withDefaults(
  defineProps<{
    value: string
    modelValue: string
    label: string
  }>(),
  {
    value: '',
    modelValue: '',
    label: 'Label'
  }
)

const handleChange = () => {
  emits('update:modelValue', props.value)
}
</script>

<template>
  <label class="radio-label">
    <input type="radio" :value="value" :checked="modelValue === value" @change="handleChange" />
    <span class="radio-button"></span>
    {{ label }}
  </label>
</template>

<style lang="scss" scoped>
.radio-label {
  display: flex;
  align-items: center;
  gap: 4px;
  color: $white;
  cursor: pointer;

  &:hover .radio-button {
    border-color: $white;
  }

  input[type='radio'] {
    display: none;
  }
  input[type='radio']:checked + .radio-button {
    border-color: $white;

    &::after {
      opacity: 1;
    }
  }

  .radio-button {
    position: relative;
    width: 16px;
    height: 16px;
    border: 2px solid $gray;
    border-radius: 50%;
    transition: $transition;

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $white;
      transition: $transition;
      transform: translate(-50%, -50%);
      opacity: 0;
    }
  }
}
</style>
