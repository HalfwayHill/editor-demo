<template>
  <div class="component-list">
    <div v-for="(item, index) in componentList" :key="index" class="item" draggable="true"
         @dragstart="handleDragStart($event)"
         :data-index="index">
      <component :is="item.icon" class="icon"></component>
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import componentList from '@/custom-component/component-list';

/**
 * 开始拖拽
 * @param event 拖拽事件
 */
const handleDragStart = (event: any) => {
  event.dataTransfer.setData('index', event.target.dataset.index);
}
</script>

<style scoped lang="scss">
.component-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 10px;

  .item {
    width: 45%;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    text-align: center;
    color: #333;
    padding: 2px 5px;

    .icon {
      width: 1em;
      height: 1em;
      margin-right: 8px;
      margin-top: 2px;
    }
  }

  // 当鼠标移动上去时
  .item:hover {
    cursor: grab;
    filter: brightness(90%);
  }

  // 当鼠标按上去时
  .item:active {
    cursor: grabbing;
  }
}
</style>