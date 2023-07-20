<template>
  <div class="editor" id="editor"
       :class="{ edit: isEdit }"
       :style="{ width: editorStore.editorState.canvasStyleData.width + 'px', height: editorStore.editorState.canvasStyleData.height + 'px' }">
    <!--页面组件列表展示-->
    <Shape v-for="(item, index) in editorStore.editorState.componentData"
           :defaultStyle="item.style"
           :style="getShapeStyle(item.style, index)"
           :key="item.id"
           :active="item === editorStore.editorState.curComponent"
           :element="item"
           :zIndex="index"
    >
      <component
          v-if="item.component != 'v-text'"
          class="component"
          :is="item.component"
          :style="getComponentStyle(item.style)"
          :propValue="item.propValue"
      />

      <component
          v-else
          class="component"
          :is="item.component"
          :style="getComponentStyle(item.style)"
          :propValue="item.propValue"
          @input="handleInput"
          :element="item"
      />
    </Shape>
    <!-- 右击菜单 -->
    <ContextMenu />
    <!-- 标线 -->
    <MarkLine />
  </div>
</template>

<script setup lang="ts">
import ContextMenu from "@/components/Editor/ContextMenu.vue";
import MarkLine from "@/components/Editor/MarkLine.vue";
import Shape from "@/components/Editor/Shape.vue";
import store from "@/store";
import getStyle from "@/utils/style";

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: true,
  },
})

const editorStore = store.editorStore;

const getShapeStyle = (style: any, index: number) => {
  const result = { ...style }
  if (result.width) {
    result.width += 'px';
  }

  if (result.height) {
    result.height += 'px';
  }

  if (result.top) {
    result.top += 'px';
  }

  if (result.left) {
    result.left += 'px';
  }

  if (result.rotate) {
    result.transform = 'rotate(' + result.rotate + 'deg)';
  }
  // 按顺序添加 z-index 层级
  result.zIndex = index;

  return result;
}

const getComponentStyle = (style: any) => {
  return getStyle(style, ['top', 'left', 'width', 'height', 'zIndex', 'rotate']);
}

const handleInput = (element: any, value: any) => {
  element.propValue = value;
  // 根据文本组件高度调整 shape 高度
  editorStore.setShapeStyle({ height: getTextareaHeight(element, value) });
}

const getTextareaHeight = (element: any, text: any) => {
  let { lineHeight, fontSize, height } = element.style;
  if (lineHeight === '') {
    lineHeight = 1.5;
  }

  const newHeight = text.split('\n').length * lineHeight * fontSize;
  return height > newHeight? height : newHeight;
}
</script>

<style scoped lang="scss">
.editor {
  position: relative;
  background: #fff;
}
.edit {
  .component {
    outline: none;
    width: 100%;
    height: 100%;
  }
}
</style>