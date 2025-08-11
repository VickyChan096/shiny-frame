<script lang="ts" setup>
withDefaults(
  defineProps<{
    display?: 'flex' | 'grid'
    justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'
    align?: 'start' | 'center' | 'end' | ' stretch'
    wrap?: 'nowrap' | 'wrap' | ' wrap-reverse'
    width?: string
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
    gap?: number | string
  }>(),
  {
    display: 'flex',
    justify: 'center',
    align: 'center',
    wrap: 'wrap',
    width: '100%',
    direction: 'row',
    gap: '8px'
  }
)
</script>

<template>
  <div class="flex-box">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.flex-box {
  display: v-bind(display);
  justify-content: v-bind(justify);
  align-items: v-bind(align);
  flex-wrap: v-bind(wrap);
  flex-direction: v-bind(direction);
  gap: v-bind(gap);
  width: v-bind(width);
}
</style>
