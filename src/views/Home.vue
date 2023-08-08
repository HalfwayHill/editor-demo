<template>
  <div class="home">
    <Toolbar />

    <main>
      <!-- 左侧组件列表 -->
      <section class="left">
        <ComponentList/>
      </section>
      <!-- 中间画布 -->
      <section class="center">
        <div class="content" @drop="handleDrop" @dragover="handleDragOver" @mousedown="handleMouseDown" @mouseup="deselectCurComponent">
          <Editor/>
        </div>
      </section>
      <!-- 右侧属性列表 -->
      <section class="right">
        <el-tabs v-model="data.activeName" type="card">
          <el-tab-pane label="属性" name="attr">
            <AttrList v-if="editorStore.editorState.curComponent"/>
            <p v-else class="placeholder">请选择组件</p>
          </el-tab-pane>
          <el-tab-pane label="动画" name="animation">
            <AnimationList v-if="editorStore.editorState.curComponent" />
            <p v-else class="placeholder">请选择组件</p>
          </el-tab-pane>
          <el-tab-pane label="事件" name="events">
            <EventList v-if="editorStore.editorState.curComponent" />
            <p v-else class="placeholder">请选择组件</p>
          </el-tab-pane>
        </el-tabs>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import ComponentList from "@/components/ComponentList.vue";
import AttrList from "@/components/AttrList.vue";
import Editor from '@/components/EditorComponent.vue';
import {reactive} from "vue";
import appStore from "@/store";
import generateID from "@/utils/generateID";
import {cloneDeep} from "lodash";
import compList from '@/custom-component/component-list';
import Toolbar from "@/components/Toolbar.vue";
import AnimationList from "@/components/AnimationList.vue";
import EventList from "@/components/EventList.vue";
import {listenGlobalKeyDown} from "@/utils/shortcutKey";

const editorStore = appStore.editorStore;

const data = reactive({
  activeName: 'attr',
  reSelectAnimateIndex: undefined,
});

/**
 * 重置数据
 */
const restore = () => {
  // 用保存的数据恢复画布
  if (localStorage.getItem('canvasData')) {
    editorStore.setComponentData(resetID(JSON.parse(localStorage.getItem('canvasData')!)));
  }

  if (localStorage.getItem('canvasStyle')) {
    editorStore.setCanvasStyle(JSON.parse(localStorage.getItem('canvasStyle')!));
  }
};

/**
 * 重新设置ID
 * @param jsonData
 */
const resetID = (jsonData: any): any => {
  jsonData.forEach((value: any) => {
    value.id = generateID();
  });

  return jsonData;
};

/**
 * 拖拽结束事件
 * @param event
 */
const handleDrop = (event: any) => {
  event.preventDefault();
  event.stopPropagation();
  const component = cloneDeep(compList[event.dataTransfer.getData('index')]);
  component.style.top = event.offsetY;
  component.style.left = event.offsetX;
  component.id = generateID();
  editorStore.addComponent({component, index: undefined});
  editorStore.recordSnapshot();
};

/**
 * 拖拽中事件
 * @param e event
 */
const handleDragOver = (e: any) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
};

const handleMouseDown = () => {
  editorStore.setClickComponentStatus(false);
};

const deselectCurComponent = () => {
  if (!editorStore.editorState.isClickComponent) {
    editorStore.setCurComponent({component: null, index: null});
    editorStore.hideContextMenu();
  }
};

// 执行初始化
restore();
// 监听复制粘贴
listenGlobalKeyDown();

</script>

<style scoped lang="scss">
.home {
  height: 100vh;
  background: #fff;

  main {
    height: calc(100% - 64px);
    position: relative;

    .left {
      position: absolute;
      height: 100%;
      width: 200px;
      left: 0;
      top: 0;
      padding-top: 10px;
    }

    .right {
      position: absolute;
      height: 100%;
      width: 262px;
      right: 0;
      top: 0;
    }

    .center {
      margin-left: 200px;
      margin-right: 262px;
      background: #f5f5f5;
      height: 100%;
      overflow: auto;
      padding: 20px;

      .content {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
    }
  }

  .placeholder {
    text-align: center;
    color: #333;
  }
}
</style>