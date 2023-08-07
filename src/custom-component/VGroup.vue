<template>
  <div class="group">
    <div>
      <template :key="item.id" v-for="item in propValue">
        <component
            class="component"
            :is="item.component"
            :style="item.groupStyle"
            :propValue="item.propValue"
            :id="'component' + item.id"
            :element="item"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getStyle } from '@/utils/style'

const props = defineProps({
  propValue: {
    type: Array<any>,
    default: () => [],
  },
  element: {
    type: Object,
  },
});

const create = () => {
  const parentStyle = props.element?.style;
  props.propValue.forEach(component => {
    // component.groupStyle 的 top left 是相对于 group 组件的位置
    // 如果已存在 component.groupStyle，说明已经计算过一次了。不需要再次计算
    if (!Object.keys(component.groupStyle).length) {
      const style = { ...component.style };
      component.groupStyle = getStyle(style);
      component.groupStyle.left = toPercent((style.left - parentStyle.left) / parentStyle.width);
      component.groupStyle.top = toPercent((style.top - parentStyle.top) / parentStyle.height);
      component.groupStyle.width = toPercent(style.width / parentStyle.width);
      component.groupStyle.height = toPercent(style.height / parentStyle.height);
    }
  });
};

const toPercent = (val: number) => {
  return val * 100 + '%';
}

create();
</script>

<style scoped lang="scss">
.group {
  & > div {
    position: relative;
    width: 100%;
    height: 100%;

    .component {
      position: absolute;
    }
  }
}
</style>