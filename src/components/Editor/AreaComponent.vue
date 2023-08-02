<template>
  <div :style="{
        left: start.x + 'px',
        top: start.y + 'px',
        width: width + 'px',
        height: height + 'px',
    }" class="area"></div>
</template>

<script setup lang="ts">
defineProps({
  start: {
    type: Object,
  },
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },
});
</script>

<style scoped lang="scss">
.area {
  border: 1px solid #70c0ff;
  position: absolute;
}
</style>