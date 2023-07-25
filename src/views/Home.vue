<template>
  <div class="home">
    <header>
      <el-button @click="undo">撤消</el-button>
      <el-button @click="redo">重做</el-button>
      <label for="input" class="insert">插入图片</label>
      <input type="file" @change="handleFileChange" id="input" hidden />
      <el-button @click="previewClick" style="margin-left: 10px;">预览</el-button>
      <el-button @click="save">保存</el-button>
      <el-button @click="clearCanvas">清空画布</el-button>
      <div class="canvas-config">
        <span>画布大小</span>
        <input v-model="editorStore.editorState.canvasStyleData.width">
        <span>*</span>
        <input v-model="editorStore.editorState.canvasStyleData.height">
      </div>
    </header>

    <main>
      <!-- 左侧组件列表 -->
      <section class="left">
        <ComponentList />
      </section>
      <!-- 中间画布 -->
      <section class="center">
        <div class="content" @drop="handleDrop" @dragover="handleDragOver" @click="deselectCurComponent">
          <Editor />
        </div>
      </section>
      <!-- 右侧属性列表 -->
      <section class="right">
        <el-tabs v-model="data.activeName" type="card">
          <el-tab-pane label="属性" name="attr">
            <AttrList v-if="editorStore.editorState.curComponent" />
            <p v-else class="placeholder">请选择组件</p>
          </el-tab-pane>
          <el-tab-pane label="动画" name="animation">
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
            <p v-else class="placeholder">请选择组件</p>
          </el-tab-pane>
          <el-tab-pane label="事件" name="events">
            <div v-if="editorStore.editorState.curComponent" class="div-events">
              <el-button @click="data.isShowEvent = true">添加事件</el-button>
              <div>
                <el-tag
                    v-for="event in Object.keys(editorStore.editorState.curComponent.events)"
                    :key="event"
                    closable
                    @close="removeEvent(event)"
                >
                  {{ event }}
                </el-tag>
              </div>
            </div>
            <p v-else class="placeholder">请选择组件</p>
          </el-tab-pane>
        </el-tabs>
      </section>
    </main>

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
                <div :class="[data.hoverPreviewAnimate === animate.value && 'animate__animated animate__' + animate.value]">
                  {{ animate.label }}
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </Modal>

    <!-- 选择事件 -->
    <Modal v-model:show="data.isShowEvent">
      <el-tabs type="card" v-model="data.eventActiveName">
        <el-tab-pane v-for="item in data.eventList" :key="item.key" :label="item.label" :name="item.key" style="padding: 0 20px">
          <el-input v-if="item.key == 'redirect'" v-model="item.param" type="textarea" placeholder="请输入完整的 URL" />
          <el-input v-if="item.key == 'alert'" v-model="item.param" type="textarea" placeholder="请输入要 alert 的内容" />
          <el-button style="margin-top: 20px;" @click="addEvent(item.key, item.param)">确定</el-button>
        </el-tab-pane>
      </el-tabs>
    </Modal>

    <!-- 预览 -->
    <Preview v-model:show="data.isShowPreview" @change="handlePreviewChange" />
  </div>
</template>

<script setup lang="ts">
import Preview from "@/components/Editor/Preview.vue";
import Modal from "@/components/Modal.vue";
import ComponentList from "@/components/ComponentList.vue";
import AttrList from "@/components/AttrList.vue";
import Editor from '@/components/EditorComponent.vue';
import {reactive} from "vue";
import animationClassData from "@/utils/animationClassData";
import {eventList} from "@/utils/events";
import appStore from "@/store";
import generateID from "@/utils/generateID";
import {ElMessage} from "element-plus";
import toast from "@/utils/toast";
import {cloneDeep} from "lodash";
import emitter from "@/utils/mitt";
import compList from '@/custom-component/component-list';

const editorStore = appStore.editorStore;

const data = reactive({
  isShowPreview: false,
  isShowAnimation: false,
  isShowEvent: false,
  activeName: 'attr',
  animationClassData,
  animationActiveName: '进入',
  showAnimatePanel: false,
  reSelectAnimateIndex: undefined,
  hoverPreviewAnimate: '',
  eventURL: '',
  eventActiveName: 'redirect',
  eventList,
});

const init = () => {
  // 用保存的数据恢复画布
  if (localStorage.getItem('canvasData')) {
    editorStore.setComponentData(resetID(JSON.parse(localStorage.getItem('canvasData')!)));
  }

  if (localStorage.getItem('canvasStyle')) {
    editorStore.setCanvasStyle(resetID(JSON.parse(localStorage.getItem('canvasStyle')!)));
  }
}

const resetID = (jsonData: any): any => {
  jsonData.forEach((val: any, idx: number) => {
    val.id = generateID()
  })

  return data
}

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
  editorStore.addComponent(component);
  editorStore.recordSnapshot();
}

/**
 * 拖拽中事件
 * @param e event
 */
const handleDragOver = (e: any) => {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'copy'
}

const deselectCurComponent = () => {
  editorStore.setCurComponent({ component: null, zIndex: null });
  editorStore.hideContextMenu();
}

const undo = () => {
  editorStore.undo();
}

const redo = () => {
  editorStore.redo();
}

const handleFileChange = (e: any) => {
  const file = e.target.files[0]
  if (!file.type.includes('image')) {
    toast('只能插入图片', 'error')
    return
  }

  const reader = new FileReader()
  reader.onload = (res: any) => {
    const fileResult = res.target.result
    const img = new Image()
    img.onload = () => {
      editorStore.addComponent({
        id: generateID(),
        component: 'Picture',
        label: '图片',
        icon: '',
        propValue: fileResult,
        animations: [],
        events: [],
        style: {
          top: 0,
          left: 0,
          width: img.width,
          height: img.height,
          rotate: '',
        },
      })
    }

    img.src = fileResult
  }

  reader.readAsDataURL(file)
}

const addAnimation = (animate: any) => {
  editorStore.addAnimation(animate);
  data.isShowAnimation = false
}

const previewAnimate = () => {
  emitter.emit('runAnimation');
}

const removeAnimation = (index: any) => {
  editorStore.removeAnimation(index);
}

const previewClick = () => {
  data.isShowPreview = true
  editorStore.setEditMode('read');
}

const handlePreviewChange = () => {
  editorStore.setEditMode('edit');
}

/**
 * 保存
 */
const save = () => {
  localStorage.setItem('canvasData', JSON.stringify(editorStore.editorState.componentData))
  localStorage.setItem('canvasStyle', JSON.stringify(editorStore.editorState.canvasStyleData))
  ElMessage.success('保存成功');
}

const clearCanvas = () => {
  editorStore.setComponentData([]);
}

const addEvent = (event: any, param: any) => {
  data.isShowEvent = false;
  editorStore.addEvent({ event, param });
}

const removeEvent = (event: any) => {
  editorStore.removeEvent(event);
}

// 执行初始化
init();

</script>

<style scoped lang="scss">
.home {
  height: 100vh;
  background: #fff;

  header {
    height: 35px;
    background: #fff;
    border-bottom: 1px solid #ddd;
  }

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
        height: 100%;
        overflow: auto;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .placeholder {
    text-align: center;
    color: #333;
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

  .el-tag {
    display: block;
    width: 50%;
    margin: auto;
    margin-bottom: 10px;
  }

  .div-animation {
    text-align: center;

    & > div {
      margin-top: 20px;
    }
  }

  .insert {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #FFF;
    border: 1px solid #DCDFE6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    padding: 9px 15px;
    font-size: 12px;
    border-radius: 3px;
    margin-left: 10px;

    &:active {
      color: #3a8ee6;
      border-color: #3a8ee6;
      outline: 0;
    }

    &:hover {
      background-color: #ecf5ff;
      color: #3a8ee6;
    }
  }

  .canvas-config {
    display: inline-block;
    margin-left: 10px;
    font-size: 14px;
    color: #606266;

    input {
      width: 50px;
      margin-left: 10px;
      outline: none;
      padding: 0 5px;
      border: 1px solid #ddd;
      color: #606266;
    }

    span {
      margin-left: 10px;
    }
  }

  .div-events {
    text-align: center;
    padding: 0 20px;

    .el-button {
      display: inline-block;
      margin-bottom: 10px;
    }
  }
}
</style>