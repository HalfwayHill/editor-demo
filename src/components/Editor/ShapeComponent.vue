<template>
  <div ref="thisRef" class="shape" :class="{ active: active }" @click="selectCurComponent" @mousedown="handleMouseDownOnShape">
    <el-icon class="el-icon-refresh-right" v-show="active" @mousedown="handleRotate">
      <RefreshRight />
    </el-icon>
    <div
        class="shape-point"
        v-for="item in (active? data.pointList : [])"
        @mousedown="handleMouseDownOnPoint(item, $event)"
        :key="item"
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
import calculateComponentPositionAndSize from '@/utils/calculateComponentPositionAndSize';

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
  index: {
    require: true,
    type: [Number, String],
  },
});

const data = reactive<{
  pointList: string[];
  initialAngle: any;
  angleToCursor: { start: number, end: number, cursor: string }[];
  cursors: any;
}>({
  pointList: ['lt', 't', 'rt', 'r', 'rb', 'b', 'lb', 'l'], // 八个方向
  initialAngle: { // 每个点对应的初始角度
    lt: 0,
    t: 45,
    rt: 90,
    r: 135,
    rb: 180,
    b: 225,
    lb: 270,
    l: 315,
  },
  angleToCursor: [ // 每个范围的角度对应的光标
    { start: 338, end: 23, cursor: 'nw' },
    { start: 23, end: 68, cursor: 'n' },
    { start: 68, end: 113, cursor: 'ne' },
    { start: 113, end: 158, cursor: 'e' },
    { start: 158, end: 203, cursor: 'se' },
    { start: 203, end: 248, cursor: 's' },
    { start: 248, end: 293, cursor: 'sw' },
    { start: 293, end: 338, cursor: 'w' },
  ],
  cursors: {},
});

onMounted(() => {
  emitter.on('runAnimation', () => {
    if (props.element === editorStore.getCurComponent && thisRef.value !== undefined) {
      runAnimation(thisRef.value, editorStore.getCurComponent.animations);
    }
  })
});

/**
 * 处理旋转
 * @param e
 */
const handleRotate = (e: any) => {
  e.preventDefault();
  e.stopPropagation();
  // 初始坐标和初始角度
  const pos = { ...props.defaultStyle };
  const startY = e.clientY;
  const startX = e.clientX;
  const startRotate = pos.rotate;

  // 获取元素中心点位置
  const rect = thisRef.value?.getBoundingClientRect();
  const centerX = rect?.left as number + (rect?.width as number) / 2;
  const centerY = rect?.top as number + (rect?.height as number) / 2;

  // 旋转前的角度
  const rotateDegreeBefore = Math.atan2(startY - centerY, startX - centerX) / (Math.PI / 180);

  // 如果元素没有移动，则不保存快照
  let hasMove = false;
  const move = (moveEvent: any) => {
    hasMove = true;
    const curX = moveEvent.clientX;
    const curY = moveEvent.clientY;
    // 旋转后的角度
    const rotateDegreeAfter = Math.atan2(curY - centerY, curX - centerX) / (Math.PI / 180);
    // 获取旋转的角度值
    pos.rotate = startRotate + rotateDegreeAfter - rotateDegreeBefore;
    // 修改当前组件样式
    editorStore.setShapeStyle(pos);
  }

  const up = () => {
    hasMove && editorStore.recordSnapshot();
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', up);
    data.cursors = getCursor(); // 根据旋转角度获取光标位置
  }

  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', up)
};

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
    marginLeft: hasR? '-4px' : '-4px',
    marginTop: '-4px',
    left: `${newLeft}px`,
    top: `${newTop}px`,
    cursor: data.cursors[point],
  }

  return style
};

const getCursor = () => {
  // 防止角度有负数，所以 + 360
  const rotate = (editorStore.editorState.curComponent.style.rotate + 360) % 360;
  const result:any = {};
  let lastMatchIndex = -1; // 从上一个命中的角度的索引开始匹配下一个，降低时间复杂度
  data.pointList.forEach(point => {
    const angle = (data.initialAngle[point] + rotate) % 360;
    const len = data.angleToCursor.length;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      lastMatchIndex = (lastMatchIndex + 1) % len;
      const angleLimit = data.angleToCursor[lastMatchIndex];
      if (angle < 23 || angle >= 338) {
        result[point] = 'nw-resize';
        return;
      }

      if (angleLimit.start <= angle && angle < angleLimit.end) {
        result[point] = angleLimit.cursor + '-resize';
        return;
      }
    }
  });

  return result;
}

const handleMouseDownOnShape = (e: any) => {
  if (props.element?.component != 'v-text') {
    e.preventDefault();
  }

  e.stopPropagation();
  editorStore.setCurComponent({ component: props.element, index: props.index as number });
  data.cursors = getCursor(); // 根据旋转角度获取光标位置

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
    const curX = moveEvent.clientX;
    const curY = moveEvent.clientY;
    pos.top = curY - startY + startTop;
    pos.left = curX - startX + startLeft;

    // 修改当前组件样式
    editorStore.setShapeStyle(pos as { top:number, left: number, width: number, height: number });
    // 等更新完当前组件的样式并绘制到屏幕后再判断是否需要吸附
    // 如果不使用 $nextTick，吸附后将无法移动
    nextTick(() => {
      // 触发元素移动事件，用于显示标线、吸附功能
      // 后面两个参数代表鼠标移动方向
      // curY - startY > 0 true 表示向下移动 false 表示向上移动
      // curX - startX > 0 true 表示向右移动 false 表示向左移动
      emitter.emit('move', {isDownward:curY - startY > 0, isRightward: curX - startX > 0});
    });
  };

  const up = () => {
    hasMove && editorStore.recordSnapshot();
    // 触发元素停止移动事件，用于隐藏标线
    emitter.emit('unMove');
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', up);
  };

  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', up);
};

const selectCurComponent = (e: any) => {
  // 阻止向父组件冒泡
  e.stopPropagation();
  e.preventDefault();
  editorStore.hideContextMenu();
};

const handleMouseDownOnPoint = (point: any, e: any) => {
  const downEvent = window.event;
  downEvent?.stopPropagation();
  downEvent?.preventDefault();

  const style = { ...props.defaultStyle };
  const center = {
    x: style.left + style.width / 2,
    y: style.top + style.height / 2,
  };

  // 获取画布位移信息
  const editorRectInfo = editorStore.editorState.editor.getBoundingClientRect();

  // 当前点击坐标
  const curPoint = {
    x: e.clientX - (editorRectInfo?.left as number),
    y: e.clientY - (editorRectInfo?.top as number),
  };

  // 获取对称点的坐标
  const symmetricPoint = {
    x: center.x - (curPoint.x - center.x),
    y: center.y - (curPoint.y - center.y),
  };

  // 是否需要保存快照
  let needSave = false;
  let isFirst = true;
  const move = (moveEvent: MouseEvent) => {
    // 第一次点击时也会触发 move，所以会有“刚点击组件但未移动，组件的大小却改变了”的情况发生
    // 因此第一次点击时不触发 move 事件
    if (isFirst) {
      isFirst = false;
      return;
    }

    needSave = true;

    const curPosition = {
      x: moveEvent.clientX - (editorRectInfo?.left as number),
      y: moveEvent.clientY - (editorRectInfo?.top as number),
    };

    calculateComponentPositionAndSize(point, style, curPosition, {
      center,
      curPoint,
      symmetricPoint,
    });

    editorStore.setShapeStyle(style);
  };

  const up = () => {
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', up);
    needSave && editorStore.recordSnapshot();
  };

  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', up);
};
</script>

<style scoped lang="scss">
.shape {
  position: absolute;

  &:hover {
    cursor: move;
  }
}
.active {
  outline: 1px solid #70c0ff;
  user-select: none;
}
.shape-point {
  position: absolute;
  background: #fff;
  border: 1px solid #59c7f9;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.el-icon-refresh-right {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  font-weight: 600;
  cursor: grab;
  color: #59c7f9;
  font-size: 22px;
  font-weight: normal;

  &:active {
    cursor: grabbing;
  }
}
</style>