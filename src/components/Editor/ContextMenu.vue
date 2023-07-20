<template>
  <div class="contextmenu" v-show="editorStore.editorState.menuShow"
       :style="{ top: editorStore.editorState.menuTop + 'px', left: editorStore.editorState.menuLeft + 'px' }">
    <ul>
      <li @click="deleteComponent">删除</li>
      <li @click="topComponent">置顶</li>
      <li @click="bottomComponent">置底</li>
      <li @click="upComponent">上移</li>
      <li @click="downComponent">下移</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import store from "@/store";

const editorStore = store.editorStore;

const deleteComponent = () => {
  editorStore.deleteComponent();
  editorStore.recordSnapshot();
}

const upComponent = () => {
  editorStore.upComponent();
  editorStore.recordSnapshot();
}

const downComponent = () => {
  editorStore.downComponent();
  editorStore.recordSnapshot();
}

const topComponent = () => {
  editorStore.topComponent();
  editorStore.recordSnapshot();
}

const bottomComponent = () => {
  editorStore.bottomComponent();
  editorStore.recordSnapshot();
}

</script>

<style scoped lang="scss">

</style>