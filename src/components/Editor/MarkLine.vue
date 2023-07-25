<template>
  <div class="mark-line">
    <div
        v-for="line in data.lines"
        :key="line"
        class="line"
        :class="line.includes('x')? 'xline' : 'yline'"
        :ref="(el) => setItemRef(el, line)"
        v-show="data.lineStatus[line] || false"
    ></div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive} from "vue";
import store from "@/store";
import emitter from "@/utils/mitt";

const editorStore = store.editorStore;

const lines: Map<string, any> = new Map<string, any>();
const setItemRef = (el: any, key: string) => {
  if (el) {
    lines.set(key, el);
  }
}

const data = reactive<{
  lines: ('xt'|'xc'|'xb'|'yl'|'yc'|'yr')[];
  diff: number;
  lineStatus: {
    xt: boolean;
    xc: boolean;
    xb: boolean;
    yl: boolean;
    yc: boolean;
    yr: boolean;
  };
  editor: any;
}>({
  lines: ['xt', 'xc', 'xb', 'yl', 'yc', 'yr'], // 分别对应三条横线和三条竖线
  diff: 3, // 相距 dff 像素将自动吸附
  lineStatus: {
    xt: false,
    xc: false,
    xb: false,
    yl: false,
    yc: false,
    yr: false,
  },
  editor: null,
})

onMounted(() => {
  data.editor = document.querySelector('#editor') as Element;
  // 监听元素移动和不移动的事件
  emitter.on('move', (data) => {
    showLine(data.isDownward, data.isRightward)
  });

  emitter.on('unMove', () => {
    hideLine()
  });
})

/**
 * 隐藏线条
 */
const hideLine = () => {
  Object.keys(data.lineStatus).forEach(line => {
    data.lineStatus[line as keyof typeof data.lineStatus] = false
  })
}

/**
 * 显示线条
 * @param isDownward
 * @param isRightward
 */
const showLine = (isDownward: boolean, isRightward: boolean) => {
  // 获取当前画布中的所有元素
  // const components = document.querySelectorAll('.shape');
  const components = editorStore.editorState.componentData;
  const dragNodeRectInfo = { ...editorStore.editorState.curComponent.style }
  // const dragNodeRectInfo = getNodeRelativePosition(dragNode);
  const dragNodeHalfWidth = dragNodeRectInfo.width / 2;
  const dragNodeHalfHeight = dragNodeRectInfo.height / 2;
  dragNodeRectInfo.bottom = dragNodeRectInfo.top + dragNodeRectInfo.height
  dragNodeRectInfo.right = dragNodeRectInfo.left + dragNodeRectInfo.width

  hideLine();

  components.forEach(component => {
    if (component === editorStore.editorState.curComponent) return;
    const { top, height, left, width } = component.style;
    const bottom = top + height;
    const right = left + width;
    const nodeHalfWidth = width / 2;
    const nodeHalfHeight = height / 2;

    const conditions = {
      top: [
        {
          isNearly: isNearly(dragNodeRectInfo.top, top),
          lineNode: lines.get("xt"), // xt
          line: 'xt',
          dragShift: top,
          lineShift: top,
        },
        {
          isNearly: isNearly(dragNodeRectInfo.bottom, top),
          lineNode: lines.get("xt"), // xt
          line: 'xt',
          dragShift: top - dragNodeRectInfo.height,
          lineShift: top,
        },
        {
          // 组件与拖拽节点的中间是否对齐
          isNearly: isNearly(dragNodeRectInfo.top + dragNodeHalfHeight, top + nodeHalfHeight),
          lineNode: lines.get("xc"), // xc
          line: 'xc',
          dragShift: top + nodeHalfHeight - dragNodeHalfHeight,
          lineShift: top + nodeHalfHeight,
        },
        {
          isNearly: isNearly(dragNodeRectInfo.top, bottom),
          lineNode: lines.get("xb"), // xb
          line: 'xb',
          dragShift: bottom,
          lineShift: bottom,
        },
        {
          isNearly: isNearly(dragNodeRectInfo.bottom, bottom),
          lineNode: lines.get("xb"), // xb
          line: 'xb',
          dragShift: bottom - dragNodeRectInfo.height,
          lineShift: bottom,
        },
      ],
      left: [
        {
          isNearly: isNearly(dragNodeRectInfo.left, left),
          lineNode: lines.get("yl"), // yl
          line: 'yl',
          dragShift: left,
          lineShift: left,
        },
        {
          isNearly: isNearly(dragNodeRectInfo.right, left),
          lineNode: lines.get("yl"), // yl
          line: 'yl',
          dragShift: left - dragNodeRectInfo.width,
          lineShift: left,
        },
        {
          // 组件与拖拽节点的中间是否对齐
          isNearly: isNearly(dragNodeRectInfo.left + dragNodeHalfWidth, left + nodeHalfWidth),
          lineNode: lines.get("yc"), // yc
          line: 'yc',
          dragShift: left + nodeHalfWidth - dragNodeHalfWidth,
          lineShift: left + nodeHalfWidth,
        },
        {
          isNearly: isNearly(dragNodeRectInfo.left, right),
          lineNode: lines.get("yr"), // yr
          line: 'yr',
          dragShift: right,
          lineShift: right,
        },
        {
          isNearly: isNearly(dragNodeRectInfo.right, right),
          lineNode: lines.get("yr"), // yr
          line: 'yr',
          dragShift: right - dragNodeRectInfo.width,
          lineShift: right,
        },
      ],
    };

    const needToShow: any[] = [];
    Object.keys(conditions).forEach(key => {
      // 遍历符合的条件并处理
      conditions[key as keyof typeof conditions].forEach((condition) => {
        if (!condition.isNearly) return
        // 修改当前组件位移
        editorStore.setShapePosStyle({key, value: condition.dragShift});
        condition.lineNode.style[key] = `${condition.lineShift}px`;
        needToShow.push(condition.line);
      })
    });

    // 同一方向上同时显示三条线可能不太美观，因此才有了这个解决方案
    // 同一方向上的线只显示一条，例如多条横条只显示一条横线
    if (needToShow.length) {
      chooseTheTureLine(needToShow, isDownward, isRightward);
    }
  })
}

/**
 * 根据鼠标移动方向选择一条正确的线条显示
 * @param needToShow 需要显示的线条组
 * @param isDownward 是否向下移动
 * @param isRightward 是否向右移动
 */
const chooseTheTureLine = (needToShow: any[], isDownward: boolean, isRightward: boolean) => {
  // 如果鼠标向右移动 则按从右到左的顺序显示竖线 否则按相反顺序显示
  // 如果鼠标向下移动 则按从下到上的顺序显示横线 否则按相反顺序显示
  if (isRightward) {
    if (needToShow.includes('yr')) {
      data.lineStatus.yr = true
    } else if (needToShow.includes('yc')) {
      data.lineStatus.yc = true
    } else if (needToShow.includes('yl')) {
      data.lineStatus.yl = true
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (needToShow.includes('yl')) {
      data.lineStatus.yl = true
    } else if (needToShow.includes('yc')) {
      data.lineStatus.yc = true
    } else if (needToShow.includes('yr')) {
      data.lineStatus.yr = true
    }
  }

  if (isDownward) {
    if (needToShow.includes('xb')) {
      data.lineStatus.xb = true
    } else if (needToShow.includes('xc')) {
      data.lineStatus.xc = true
    } else if (needToShow.includes('xt')) {
      data.lineStatus.xt = true
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (needToShow.includes('xt')) {
      data.lineStatus.xt = true
    } else if (needToShow.includes('xc')) {
      data.lineStatus.xc = true
    } else if (needToShow.includes('xb')) {
      data.lineStatus.xb = true
    }
  }
}

/**
 * 节点元素是否相近
 * @param dragValue 拖拽元素方位值
 * @param targetValue 目标元素方位值
 */
const isNearly = (dragValue: any, targetValue: any) => {
  return Math.abs(dragValue - targetValue) <= data.diff
}

/**
 * 获取节点相对编辑器的位置
 * @param node 节点元素
 */
const getNodeRelativePosition = (node: Element) => {
  let {top, height, bottom, left, width, right} = node.getBoundingClientRect()
  const editorRectInfo = data.editor.getBoundingClientRect()

  left -= editorRectInfo.left
  top -= editorRectInfo.top
  right -= editorRectInfo.left
  bottom -= editorRectInfo.top

  return {top, height, bottom, left, width, right}
}
</script>

<style scoped lang="scss">
.mark-line {
  height: 100%;
}

.line {
  background: #59c7f9;
  position: absolute;
  z-index: 1000;
}

.xline {
  width: 100%;
  height: 1px;
}

.yline {
  width: 1px;
  height: 100%;
}
</style>