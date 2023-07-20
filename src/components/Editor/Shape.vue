<template>
  <div ref="thisRef" class="shape" :class="{ active: active }" @click="selectCurComponent" @mousedown="handleMouseDown"
       @contextmenu="handleContextMenu">
    <div
        class="shape-point"
        v-for="(item, index) in (active? data.pointList : [])"
        @mousedown="handleMouseDownOnPoint(item)"
        :key="index"
        :style="getPointStyle(item)">
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import {nextTick, onMounted, reactive, ref} from "vue";
import runAnimation from "@/utils/runAnimation";
import store from "@/store";
import emitter from "@/utils/mitt";

const editorStore = store.editorStore;

// 获取当前Dom
const thisRef = ref<Element>();

const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
  element: {
    require: true,
    type: Object,
  },
  defaultStyle: {
    require: true,
    type: Object,
  },
  zIndex: {
    require: true,
    type: [Number, String],
  },
});

const data = reactive({
  pointList: ['t', 'r', 'b', 'l', 'lt', 'rt', 'lb', 'rb'],
  directionKey: { // 光标显示样式
    t: 'n',
    b: 's',
    l: 'w',
    r: 'e',
  },
});

onMounted(() => {
  emitter.on('runAnimation', () => {
    if (props.element === editorStore.getCurComponent) {
      runAnimation(thisRef, editorStore.getCurComponent.animations)
    }
  })
});

const getPointStyle = (point: any) => {
  const height = props.defaultStyle?.height
  const width = props.defaultStyle?.width
  const hasT = /t/.test(point)
  const hasB = /b/.test(point)
  const hasL = /l/.test(point)
  const hasR = /r/.test(point)
  let newLeft = 0
  let newTop = 0

  // 四个角的点
  if (point.length === 2) {
    newLeft = hasL? 0 : width
    newTop = hasT? 0 : height
  } else {
    // 上下两点的点，宽度居中
    if (hasT || hasB) {
      newLeft = width / 2
      newTop = hasT? 0 : height
    }

    // 左右两边的点，高度居中
    if (hasL || hasR) {
      newLeft = hasL? 0 : width
      newTop = Math.floor(height / 2)
    }
  }

  const style = {
    marginLeft: hasR? '-4px' : '-3px',
    marginTop: '-3px',
    left: `${newLeft}px`,
    top: `${newTop}px`,
    cursor: point.split('').reverse().map((m:'t'|'r'|'b'|'l') => data.directionKey[m]).join('') + '-resize',
  }

  return style
};

const handleMouseDown = (e: any) => {
  if (props.element?.component != 'v-text') {
    e.preventDefault()
  }

  e.stopPropagation();
  editorStore.setCurComponent({ component: props.element, zIndex: props.zIndex as number });

  const pos = { ...props.defaultStyle };
  const startY = e.clientY;
  const startX = e.clientX;
  // 如果直接修改属性，值的类型会变为字符串，所以要转为数值型
  const startTop = Number(pos.top);
  const startLeft = Number(pos.left);

  // 如果元素没有移动，则不保存快照
  let hasMove = false;
  const move = (moveEvent: any) => {
    hasMove = true;
    const currX = moveEvent.clientX;
    const currY = moveEvent.clientY;
    pos.top = currY - startY + startTop;
    pos.left = currX - startX + startLeft;

    // 修改当前组件样式
    editorStore.setShapeStyle(pos as { top:number, left: number, width: number, height: number });
    // 等更新完当前组件的样式并绘制到屏幕后再判断是否需要吸附
    // 如果不使用 $nextTick，吸附后将无法移动
    nextTick(() => {
      // 触发元素移动事件，用于显示标线、吸附功能
      // 后面两个参数代表鼠标移动方向
      // currY - startY > 0 true 表示向下移动 false 表示向上移动
      // currX - startX > 0 true 表示向右移动 false 表示向左移动
      emitter.emit('move', {dragNode: thisRef.value! as Element, isDownward:currY - startY > 0, isRightward: currX - startX > 0});
    })
  }

  const up = () => {
    hasMove && editorStore.recordSnapshot();
    // 触发元素停止移动事件，用于隐藏标线
    emitter.emit('unMove');
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', up);
  }

  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', up);
};

const selectCurComponent = (e: any) => {
  // 阻止向父组件冒泡
  e.stopPropagation();
  e.preventDefault();
  editorStore.hideContextMenu();
}

const handleMouseDownOnPoint = (point: any) => {
  const downEvent = window.event
  downEvent?.stopPropagation()
  downEvent?.preventDefault()

  const pos = { ...props.defaultStyle }
  const height = Number(pos.height)
  const width = Number(pos.width)
  const top = Number(pos.top)
  const left = Number(pos.left)
  const startX = (downEvent as MouseEvent).clientX
  const startY = (downEvent as MouseEvent).clientY

  // 是否需要保存快照
  let needSave = false
  const move = (moveEvent: MouseEvent) => {
    needSave = true
    const currX = moveEvent.clientX;
    const currY = moveEvent.clientY;
    const disY = currY - startY;
    const disX = currX - startX;
    const hasT = /t/.test(point);
    const hasB = /b/.test(point);
    const hasL = /l/.test(point);
    const hasR = /r/.test(point);
    const newHeight = height + (hasT? -disY : hasB? disY : 0);
    const newWidth = width + (hasL? -disX : hasR? disX : 0);
    pos.height = newHeight > 0? newHeight : 0;
    pos.width = newWidth > 0? newWidth : 0;
    pos.left = left + (hasL? disX : 0);
    pos.top = top + (hasT? disY : 0);
    editorStore.setShapeStyle(pos as { top:number, left: number, width: number, height: number });
  }

  const up = () => {
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', up);
    needSave && editorStore.recordSnapshot();
  }

  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', up);
};

const handleContextMenu = (e: any) => {
  e.stopPropagation()
  e.preventDefault()

  // 计算菜单相对于编辑器的位移
  let target = e.target
  let top = e.offsetY
  let left = e.offsetX
  while (!target.className.includes('editor')) {
    left += target.offsetLeft
    top += target.offsetTop
    target = target.parentNode
  }

  editorStore.showContextMenu({ top, left })
}
</script>

<style scoped lang="scss">
.shape {
  position: absolute;
}
.active {
  border: 1px solid #70c0ff;
}
.shape-point {
  position: absolute;
  background: #fff;
  border: 1px solid #59c7f9;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
</style>