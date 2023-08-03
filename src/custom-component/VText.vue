<template>
  <div v-if="editorStore.editorState.editMode == 'edit'" class="v-text" @keydown="stopPropagation">
    <!-- tabindex >= 0 使得双击时聚集该元素 -->
    <div :contenteditable="data.canEdit" :class="{ canEdit: data.canEdit }" @dblclick="setEdit" :tabindex="element?.id" @paste="clearStyleFn"
         @mousedown="stopPropagation2" @blur="handleBlur" ref="text" v-html="element?.propValue" @input="handleInput"
         :style="{ verticalAlign: element?.style.verticalAlign }"
    ></div>
  </div>
  <div v-else class="v-text">
    <div v-html="element?.propValue" :style="{ verticalAlign: element?.style.verticalAlign }"></div>
  </div>
</template>

<script setup lang="ts">
import appStore from "@/store";
import { clearStyle } from '@/utils/style'
import {reactive, ref} from "vue";

const editorStore = appStore.editorStore;

const props = defineProps({
  propValue: {
    type: String,
    require: true,
  },
  element: {
    type: Object,
  },
});

const text = ref<Element>();

const data = reactive({
  canEdit: false,
  ctrlKey: 17,
  keys: [67, 68, 86, 88, 89, 90], // 复制 删除 撤销 重做 剪切 删除键
  isCtrlDown: false,
});

const emit = defineEmits(['input:show'])

const handleInput = (e: any) => {
  emit('input:show', props.element, e.target.innerHTML)
}

const stopPropagation = (e: any) => {
  if (e.keyCode == data.ctrlKey) {
    data.isCtrlDown = true
  } else if (data.isCtrlDown && data.keys.includes(e.keyCode)) {
    e.stopPropagation()
  }
};

const stopPropagation2 = (e: any) => {
  if (data.canEdit) {
    e.stopPropagation()
  }
};

const clearStyleFn = (e: any) => {
  clearStyle(e);
  emit('input:show', props.element, e.target.innerHTML)
};

const handleBlur = (e: any) => {
  if (props.element !== undefined) {
    (props.element as any).propValue = e.target.innerHTML;
    data.canEdit = false;
  }

};

const setEdit = () => {
  data.canEdit = true;
  // 全选
  selectText(text.value)
};

const selectText = (element: any) => {
  const selection = window.getSelection()
  const range = document.createRange()
  range.selectNodeContents(element)
  selection?.removeAllRanges()
  selection?.addRange(range)
};
</script>

<style lang="scss" scoped>
.v-text {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: table;
  padding: 0 5px;

  div {
    display: table-cell;
    width: 100%;
    height: 100%;
    outline: none;
    overflow: auto;
  }

  .canEdit {
    cursor: text;
  }

  .text {
    border: 1px solid #ddd;
    padding: 5px 10px;
    white-space: normal;
    word-break: break-all;
  }
}
</style>