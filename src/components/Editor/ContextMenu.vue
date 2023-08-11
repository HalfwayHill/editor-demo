<template>
  <div class="contextmenu" v-show="editorStore.editorState.menuShow"
       :style="{ top: editorStore.editorState.menuTop + 'px', left: editorStore.editorState.menuLeft + 'px' }">
    <ul @mouseup="handleMouseUp">
      <template v-if="editorStore.editorState.curComponent">
        <template v-if="!editorStore.editorState.curComponent.isLock">
          <li @click="copy">复制</li>
          <li @click="paste">粘贴</li>
          <li @click="cut">剪切</li>
          <li @click="deleteComponent">删除</li>
          <li @click="lock">锁定</li>
          <li @click="topComponent">置顶</li>
          <li @click="bottomComponent">置底</li>
          <li @click="upComponent">上移</li>
          <li @click="downComponent">下移</li>
        </template>
        <li v-else @click="unlock">解锁</li>
      </template>
      <li v-else @click="paste">粘贴</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import store from "@/store";
import {reactive} from "vue";

const editorStore = store.editorStore;

reactive<{
  copyData: any
}>({
  copyData: null
});

/**
 * 点击菜单时不取消当前组件的选中状态
 */
const handleMouseUp = () => {
  editorStore.setClickComponentStatus(true);
};

const lock = () => {
  editorStore.lock();
};

const unlock = () => {
  editorStore.unlock();
};

const copy = () => {
  editorStore.copy();
}

const paste = () => {
  editorStore.paste(true);
  editorStore.recordSnapshot();
}

const cut = () => {
  editorStore.cut();
}

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
.contextmenu {
  position: absolute;
  z-index: 1000;

  ul {
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    box-sizing: border-box;
    margin: 5px 0;
    padding: 6px 0;

    li {
      font-size: 14px;
      padding: 0 20px;
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #606266;
      height: 34px;
      line-height: 34px;
      box-sizing: border-box;
      cursor: pointer;

      &:hover {
        background-color: #f5f7fa;
      }
    }
  }
}
</style>