<template>
    <div style="overflow: hidden">
        <img :src="propValue">
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
  propValue: {
    type: String,
    require: true,
  },
});
</script>

<style lang="scss" scoped>
img {
    width: 100%;
    height: 100%;
}
</style>