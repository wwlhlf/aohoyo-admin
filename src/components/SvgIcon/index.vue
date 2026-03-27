<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  prefix?: string
  color?: string
  size?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  prefix: 'icon',
  size: 16
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)

const sizeStyle = computed(() => {
  const size = typeof props.size === 'number' ? `${props.size}px` : props.size
  return { width: size, height: size }
})
</script>

<template>
  <svg
    class="svg-icon"
    :style="sizeStyle"
    aria-hidden="true"
  >
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<style scoped>
.svg-icon {
  display: inline-block;
  overflow: hidden;
  vertical-align: -0.15em;
  fill: currentColor;
}
</style>