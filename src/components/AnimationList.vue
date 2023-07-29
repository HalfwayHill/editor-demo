<template>
<div class="animation-list">
  <div v-if="editorStore.editorState.curComponent" class="div-animation">
    <el-button @click="data.isShowAnimation = true;">添加动画</el-button>
    <el-button @click="previewAnimate">预览动画</el-button>
    <div>
      <el-tag
          v-for="(tag, index) in editorStore.editorState.curComponent.animations"
          :key="index"
          closable
          @close="removeAnimation(index)"
      >
        {{ tag.label }}
      </el-tag>
    </div>
  </div>

  <!-- 选择动画 -->
  <Modal v-model:show="data.isShowAnimation">
    <el-tabs type="card" v-model="data.animationActiveName">
      <el-tab-pane v-for="item in animationClassData" :key="item.label" :label="item.label" :name="item.label">
        <el-scrollbar class="animate-container">
          <div class="el-scrollbar-view">
            <div
                class="animate"
                v-for="(animate, index) in item.children"
                :key="index"
                @mouseover="data.hoverPreviewAnimate = animate.value"
                @click="addAnimation(animate)"
            >
              <div
                  :class="[data.hoverPreviewAnimate === animate.value && 'animate__animated animate__' + animate.value]">
                {{ animate.label }}
              </div>
            </div>
          </div>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
  </Modal>
</div>
</template>

<script setup lang="ts">
import {reactive} from "vue";
import animationClassData from "@/utils/animationClassData";
import appStore from "@/store";
import emitter from "@/utils/mitt";

const editorStore = appStore.editorStore;

const data = reactive({
  isShowAnimation: false,
  animationClassData,
  animationActiveName: '进入',
  showAnimatePanel: false,
  hoverPreviewAnimate: '',
});

/**
 * 画布元素添加一个动画
 * @param animate
 */
const addAnimation = (animate: any) => {
  editorStore.addAnimation(animate);
  data.isShowAnimation = false;
}

/**
 * 预览元素动画
 */
const previewAnimate = () => {
  emitter.emit('runAnimation');
}

/**
 * 移除元素某个动画
 * @param index 元素内动画索引
 */
const removeAnimation = (index: any) => {
  editorStore.removeAnimation(index);
}
</script>

<style scoped lang="scss">
.animation-list {
  .div-animation {
    text-align: center;

    & > div {
      margin-top: 20px;
    }

    .el-tag {
      display: block;
      width: 50%;
      margin: auto;
      margin-bottom: 10px;
    }
  }

  .el-scrollbar-view {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding-left: 14px;


    .animate > div {
      width: 100px;
      height: 60px;
      background: #f5f8fb;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 12px;
      margin-bottom: 10px;
      font-size: 12px;
      color: #333;
      border-radius: 3px;
      user-select: none;
      cursor: pointer;
    }
  }
}
</style>