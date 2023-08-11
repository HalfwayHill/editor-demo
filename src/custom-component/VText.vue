<template>
  <div v-if="editorStore.editorState.editMode == 'edit'" class="v-text" @keydown="handleKeydown" @keyup="handleKeyup">
    <!-- tabindex >= 0 使得双击时聚集该元素 -->
    <div :contenteditable="data.canEdit" :class="{ canEdit: data.canEdit }" @dblclick="setEdit" :tabindex="element?.id" @paste="clearStyleFn"
         @mousedown="handleMousedown" @blur="handleBlur" ref="text" v-html="element?.propValue" @input="handleInput"
         :style="{ verticalAlign: element?.style.verticalAlign }"
    ></div>
  </div>
  <div v-else class="v-text">
    <div v-html="element?.propValue" :style="{ verticalAlign: element?.style.verticalAlign }"></div>
  </div>
</template>

<script setup lang="ts">
import appStore from "@/store";
import {reactive, ref} from "vue";
import {keycodes} from "@/utils/shortcutKey";

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
  ctrlKey: 'Control',
  deleteKey: 'Delete',
  isCtrlDown: false,
});

const emit = defineEmits(['input:show'])

const handleInput = (e: any) => {
  emit('input:show', props.element, e.target.innerHTML)
}

const handleKeydown = (e: any) => {
  if (e.key === data.ctrlKey) {
    data.isCtrlDown = true;
  } else if (data.isCtrlDown && data.canEdit && keycodes.includes(e.key)) {
    e.stopPropagation();
  } else if (e.key === data.deleteKey) {
    e.stopPropagation();
  }
};

const handleKeyup = (e: any) => {
  if (e.key === data.ctrlKey) {
    data.isCtrlDown = false
  }
};

const handleMousedown = (e: any) => {
  if (data.canEdit) {
    e.stopPropagation()
  }
};

const clearStyleFn = (e: any) => {
  e.preventDefault();
  const clp = e.clipboardData;
  const text = clp.getData('text/plain') || '';
  if (text !== '') {
    document.execCommand('insertText', false, text);
  }
  emit('input:show', props.element, e.target.innerHTML)
};

const handleBlur = (e: any) => {
  if (props.element !== undefined) {
    (props.element as any).propValue = e.target.innerHTML || '&nbsp;';
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
    height: 100%;
  }
}
</style>