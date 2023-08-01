<template>
  <div class="editor" id="editor"
       :class="{ edit: isEdit }"
       :style="{ width: editorStore.editorState.canvasStyleData.width + 'px', height: editorStore.editorState.canvasStyleData.height + 'px' }"
       @contextmenu="handleContextMenu"
  >
    <!--页面组件列表展示-->
    <Shape v-for="(item, index) in editorStore.editorState.componentData"
           :defaultStyle="item.style"
           :style="getShapeStyle(item.style)"
           :key="item.id"
           :active="item === editorStore.editorState.curComponent"
           :element="item"
           :index="index"
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
import Shape from "@/components/Editor/ShapeComponent.vue";
import store from "@/store";
import getStyle from "@/utils/style";

defineProps({
  isEdit: {
    type: Boolean,
    default: true,
  },
})

const editorStore = store.editorStore;

/**
 * 显示下拉菜单
 * @param e
 */
const handleContextMenu = (e: any) => {
  e.stopPropagation();
  e.preventDefault();

  // 计算菜单相对于编辑器的位移
  let target = e.target;
  let top = e.offsetY;
  let left = e.offsetX;
  while (!target.className.includes('editor')) {
    left += target.offsetLeft;
    top += target.offsetTop;
    target = target.parentNode;
  }

  editorStore.showContextMenu({ top, left });
};

const getShapeStyle = (style: any) => {
  const result: any = {};
  ['width', 'height', 'top', 'left', 'rotate'].forEach(attr => {
    if (attr != 'rotate') {
      result[attr] = style[attr] + 'px';
    } else {
      result.transform = 'rotate(' + style[attr] + 'deg)';
    }
  });

  return result;
}

const getComponentStyle = (style: any) => {
  return getStyle(style, ['top', 'left', 'width', 'height', 'rotate']);
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
  flex-shrink: 0;
}
.edit {
  .component {
    outline: none;
    width: 100%;
    height: 100%;
  }
}
</style>