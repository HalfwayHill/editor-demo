<template>
  <div class="bg" v-if="show">
    <el-button @click="close" class="close">关闭</el-button>
    <div class="canvas" :style="{ width: state.canvasStyleData.width + 'px', height: state.canvasStyleData.height + 'px' }">
      <ComponentWrapper
          v-for="(item, index) in state.componentData"
          :key="index"
          :config="item"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import store from "@/store";
import ComponentWrapper from "@/components/Editor/ComponentWrapper.vue";

const state = store.editorStore.editorState;
interface Prop {
  show: boolean
}

const props = defineProps<Prop>()
const emit = defineEmits(['update:show'])

const close = () => {
  emit('update:show', false);
}
</script>

<style scoped lang="scss">
.bg {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  background: rgb(0, 0, 0, .5);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 20px;

  .canvas {
    background: #fff;
    position: relative;
  }

  .close {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
</style>