<template>
  <div @click="handleClick" ref="wrapperDom">
    <component
        class="component"
        :is="config.component"
        :style="getStyle(config.style)"
        :propValue="config.propValue"
    />
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import runAnimation from "@/utils/runAnimation";
import getStyle from "@/utils/style";
import {events} from "@/utils/events";

interface Prop {
  config: any
}
const props = defineProps<Prop>()

// 获取当前Dom
const wrapperDom = ref(null);

onMounted(() => {
  runAnimation(wrapperDom, props.config.animations)
})

const handleClick = () => {
  const eventKeys = props.config.events
  Object.keys(eventKeys).forEach(eventKey => {
    events[eventKey as 'redirect' | 'alert'](eventKeys[eventKey]);
  })
}
</script>

<style scoped lang="scss">
.component {
  position: absolute;
}
</style>