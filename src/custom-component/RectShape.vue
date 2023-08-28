<template>
  <div class="rect-shape">
    <v-text :propValue="element.propValue" :element="element" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  propValue: {
    type: String,
    require: true,
  },
  element: {
    type: Object,
  },
});

</script>

<style scoped lang="scss">
.rect-shape {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>