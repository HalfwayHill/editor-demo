<template>
  <div>
    <div class="toolbar">
      <el-button @click="undo">撤消</el-button>
      <el-button @click="redo">重做</el-button>
      <label for="input" class="insert">插入图片</label>
      <input type="file" @change="handleFileChange" id="input" hidden/>
      <el-button @click="previewClick" style="margin-left: 10px;">预览</el-button>
      <el-button @click="save">保存</el-button>
      <el-button @click="clearCanvas">清空画布</el-button>
      <el-button @click="compose">组合</el-button>
      <el-button @click="decompose">拆分</el-button>
      <div class="canvas-config">
        <span>画布大小</span>
        <input v-model="editorStore.editorState.canvasStyleData.width">
        <span>*</span>
        <input v-model="editorStore.editorState.canvasStyleData.height">
      </div>
      <div class="canvas-config">
        <span>画布比例</span>
        <input v-model="editorStore.editorState.canvasStyleData.scale"> %
      </div>
    </div>

    <!-- 预览 -->
    <Preview v-model:show="data.isShowPreview" @change="handlePreviewChange"/>
  </div>
</template>

<script setup lang="ts">
import Preview from "@/components/Editor/Preview.vue";
import appStore from "@/store";
import {reactive} from "vue";
import toast from "@/utils/toast";
import generateID from "@/utils/generateID";
import {ElMessage} from "element-plus";
import { commonStyle, commonAttr } from '@/custom-component/component-list';

const editorStore = appStore.editorStore;

const data = reactive({
  isShowPreview: false,
});

const compose = () => {
  editorStore.compose();
};

const decompose = () => {
  editorStore.decompose();
};

const undo = () => {
  editorStore.undo();
};

const redo = () => {
  editorStore.redo();
};

const handleFileChange = (e: any) => {
  const file = e.target.files[0];
  if (!file.type.includes('image')) {
    toast('只能插入图片');
    return
  }

  const reader = new FileReader()
  reader.onload = (res: any) => {
    const fileResult = res.target.result;
    const img = new Image();
    img.onload = () => {
      editorStore.addComponent({
        component: {
          ...commonAttr,
          id: generateID(),
          component: 'v-picture',
          label: '图片',
          icon: '',
          propValue: fileResult,
          style: {
            ...commonStyle,
            top: 0,
            left: 0,
            width: img.width,
            height: img.height,
          },
        },
        index: undefined
      })
    };

    img.src = fileResult;
  }

  reader.readAsDataURL(file);
};

const previewClick = () => {
  data.isShowPreview = true;
  editorStore.setEditMode('read');
};

const handlePreviewChange = () => {
  editorStore.setEditMode('edit');
};

/**
 * 保存画布数据
 */
const save = () => {
  localStorage.setItem('canvasData', JSON.stringify(editorStore.editorState.componentData));
  localStorage.setItem('canvasStyle', JSON.stringify(editorStore.editorState.canvasStyleData));
  ElMessage.success('保存成功');
};

/**
 * 清空画布
 */
const clearCanvas = () => {
  editorStore.setComponentData([]);
};
</script>

<style scoped lang="scss">
.toolbar {
  height: 35px;
  background: #fff;
  border-bottom: 1px solid #ddd;

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
}
</style>