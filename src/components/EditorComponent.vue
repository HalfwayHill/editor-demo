<template>
  <div class="editor" id="editor"
       :class="{ edit: isEdit }"
       :style="{
          width: editorStore.editorState.canvasStyleData.width + 'px',
          height: editorStore.editorState.canvasStyleData.height + 'px',
          transform: 'scale(' + editorStore.editorState.canvasStyleData.scale / 100 + ')'
      }"
       @contextmenu="handleContextMenu"
       @mousedown="handleMouseDown"
  >
    <!--页面组件列表展示-->
    <Shape v-for="(item, index) in editorStore.editorState.componentData"
           :defaultStyle="item.style"
           :style="getShapeStyle(item.style)"
           :key="item.id"
           :active="item === editorStore.editorState.curComponent"
           :element="item"
           :index="index"
           :class="{ lock: item.isLock }"
    >
      <component
          v-if="item.component != 'v-text'"
          class="component"
          :is="item.component"
          :style="getComponentStyle(item.style)"
          :propValue="item.propValue"
          :element="item"
          :id="'component' + item.id"
      />

      <component
          v-else
          class="component"
          :is="item.component"
          :style="getComponentStyle(item.style)"
          :propValue="item.propValue"
          @input="handleInput"
          :element="item"
          :id="'component' + item.id"
      />
    </Shape>
    <!-- 右击菜单 -->
    <ContextMenu/>
    <!-- 标线 -->
    <MarkLine/>
    <!-- 选中区域 -->
    <AreaComponent :start="data.start" :width="data.width" :height="data.height" v-show="data.isShowArea"/>
  </div>
</template>

<script setup lang="ts">
import ContextMenu from "@/components/Editor/ContextMenu.vue";
import MarkLine from "@/components/Editor/MarkLine.vue";
import Shape from "@/components/Editor/ShapeComponent.vue";
import AreaComponent from "@/components/Editor/AreaComponent.vue";
import store from "@/store";
import {getStyle, getComponentRotatedStyle} from '@/utils/style';
import emitter from "@/utils/mitt";
import {onMounted, reactive} from "vue";
import { $ } from "@/utils/utils";

defineProps({
  isEdit: {
    type: Boolean,
    default: true,
  },
});

const data = reactive({
  editorX: 0,
  editorY: 0,
  start: { // 选中区域的起点
    x: 0,
    y: 0,
  },
  width: 0,
  height: 0,
  isShowArea: false,
})

const editorStore = store.editorStore;

onMounted(() => {
  // 获取编辑器元素
  editorStore.getEditor();


  emitter.on('hideArea', () => {
    hideArea();
  })
});

const handleMouseDown = (e: any) => {
  // 如果没有选中组件 在画布上点击时需要调用 e.preventDefault() 防止触发 drop 事件
  const curCom = editorStore.editorState.curComponent;
  if (!curCom || (curCom.component != 'v-text' && curCom.component != 'rect-shape')) {
    e.preventDefault();
  }
  hideArea();

  // 获取编辑器的唯一信息
  const rectInfo = editorStore.editorState.editor.getBoundingClientRect();
  data.editorX = rectInfo.x;
  data.editorY = rectInfo.y;

  const startX = e.clientX;
  const startY = e.clientY;
  data.start.x = startX - data.editorX;
  data.start.y = startY - data.editorY;
  data.isShowArea = true;

  const move = (moveEvent: any) => {
    data.width = Math.abs(moveEvent.clientX - startX);
    data.height = Math.abs(moveEvent.clientY - startY);
    if (moveEvent.clientX < startX) {
      data.start.x = moveEvent.clientX - data.editorX;
    }

    if (moveEvent.clientY < startY) {
      data.start.y = moveEvent.clientY - data.editorY;
    }
  }

  const up = (e: any) => {
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', up);

    if (e.clientX == startX && e.clientY == startY) {
      hideArea();
      return
    }

    createGroup()
  }

  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', up)
};

/**
 * 隐藏组合区域
 */
const hideArea = () => {
  data.isShowArea = false;
  data.width = 0;
  data.height = 0;
};

/**
 * 创造组合元素
 */
const createGroup = () => {
  // 获取选中区域的组件
  const areaData = getSelectArea();
  if (areaData.length <= 1) {
    hideArea();
    return;
  }

  // 根据选中区域和区域中每个组件的位移信息来创建 Group 组件
  // 要遍历选择区域的每个组件，获取它们的 left top right bottom 信息来进行比较
  let top = Infinity, left = Infinity;
  let right = -Infinity, bottom = -Infinity;
  areaData.forEach(component => {
    let style: any = {}
    if (component.component == 'VGroup') {
      (component.propValue as any[]).forEach(item => {
        const rectInfo = $(`#component${item.id}`).getBoundingClientRect()
        style.left = rectInfo.left - data.editorX
        style.top = rectInfo.top - data.editorY
        style.right = rectInfo.right - data.editorX
        style.bottom = rectInfo.bottom - data.editorY

        if (style.left < left) left = style.left
        if (style.top < top) top = style.top
        if (style.right > right) right = style.right
        if (style.bottom > bottom) bottom = style.bottom
      })
    } else {
      style = getComponentRotatedStyle(component.style)
    }

    if (style.left < left) left = style.left;
    if (style.top < top) top = style.top;
    if (style.right > right) right = style.right;
    if (style.bottom > bottom) bottom = style.bottom;
  })

  data.start.x = left;
  data.start.y = top;
  data.width = right - left;
  data.height = bottom - top;

  editorStore.setAreaData({
    style: {
      left,
      top,
      width: data.width,
      height: data.height,
    },
    components: areaData,
  });
};

const getSelectArea = () => {
  const result: any[] = [];
  const {x, y} = data.start;
  editorStore.editorState.componentData.forEach(component => {
    if (component.isLock) return
    const {left, top, width, height} = component.style;
    if (x <= left && y <= top && (left + width <= x + data.width) && (top + height <= y + data.height)) {
      result.push(component);
    }
  })

  return result;
};

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
  while (target instanceof SVGElement) {
    target = target.parentNode;
  }
  while (!target.className.includes('editor')) {
    left += target.offsetLeft;
    top += target.offsetTop;
    target = target.parentNode;
  }

  editorStore.showContextMenu({top, left});
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
  // 根据文本组件高度调整 shape 高度
  editorStore.setShapeStyle({height: getTextareaHeight(element, value)});
}

const getTextareaHeight = (element: any, text: any) => {
  let {lineHeight, fontSize, height} = element.style;
  if (lineHeight === '') {
    lineHeight = 1.5;
  }

  const newHeight = (text.split('<br>').length - 1) * lineHeight * fontSize;
  return height > newHeight ? height : newHeight;
}
</script>

<style scoped lang="scss">
.editor {
  position: relative;
  background: #fff;
  margin: auto;

  .lock {
    opacity: .5;
  }
}

.edit {
  .component {
    outline: none;
    width: 100%;
    height: 100%;
  }
}
</style>