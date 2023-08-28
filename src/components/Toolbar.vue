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
      <el-button @click="compose" :disabled="!editorStore.editorState.areaData.components.length">组合</el-button>
      <el-button @click="decompose"
                 :disabled="!editorStore.editorState.curComponent || editorStore.editorState.curComponent.isLock || editorStore.editorState.curComponent.component != 'VGroup'">拆分</el-button>
      <el-button @click="lock" :disabled="!editorStore.editorState.curComponent || editorStore.editorState.curComponent.isLock">锁定</el-button>
      <el-button @click="unlock" :disabled="!editorStore.editorState.curComponent || !editorStore.editorState.curComponent.isLock">解锁</el-button>
      <div class="canvas-config">
        <span>画布大小</span>
        <input v-model="editorStore.editorState.canvasStyleData.width">
        <span>*</span>
        <input v-model="editorStore.editorState.canvasStyleData.height">
      </div>
      <div class="canvas-config">
        <span>画布比例</span>
        <input v-model="data.scale" @input="handleScaleChange"> %
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
import emitter from "@/utils/mitt";
import {cloneDeep} from "lodash";

const editorStore = appStore.editorStore;

const data = reactive<{
  isShowPreview: boolean;
  needToChange: string[];
  scale: number;
  timer: any;
}>({
  isShowPreview: false,
  needToChange: [
    'top',
    'left',
    'width',
    'height',
    'fontSize',
    'borderWidth',
  ],
  scale: 100,
  timer: null,
});

const format = (value: number) => {
  return value * data.scale / 100;
};

const getOriginStyle = (value:number): number => {
  const scale = editorStore.editorState.canvasStyleData.scale;
  const result = value / (scale / 100);
  return result;
};

const handleScaleChange = () => {
  clearTimeout(data.timer);
  data.timer = setTimeout(() => {
    // 画布比例设一个最小值，不能为 0
    // eslint-disable-next-line no-bitwise
    data.scale = (~~data.scale) || 1;
    const componentData = cloneDeep(editorStore.editorState.componentData)
    componentData.forEach(component => {
      Object.keys(component.style).forEach(key => {
        if (data.needToChange.includes(key)) {
          // 根据原来的比例获取样式原来的尺寸
          // 再用原来的尺寸 * 现在的比例得出新的尺寸
          // 不能用 Math.round 防止 1 px 的边框变 0
          component.style[key] = Math.ceil(format(getOriginStyle(component.style[key])));
        }
      });
    });

    editorStore.setComponentData(componentData);
    editorStore.setCanvasStyle({
      ...editorStore.editorState.canvasStyleData,
      scale: data.scale,
    })
  }, 1000)
};

const lock = () => {
  editorStore.lock();
};

const unlock = () => {
  editorStore.unlock();
};

const compose = () => {
  editorStore.compose();
  editorStore.recordSnapshot();
};

const decompose = () => {
  editorStore.decompose();
  editorStore.recordSnapshot();
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

      editorStore.recordSnapshot();

      // 修复重复上传同一文件，@change 不触发的问题
      document.querySelector('#input')?.setAttribute('type', 'text');
      document.querySelector('#input')?.setAttribute('type', 'file');
    };

    img.src = fileResult;
  }

  reader.readAsDataURL(file);
};

const previewClick = () => {
  data.isShowPreview = true;
  editorStore.setEditMode('preview');
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
  editorStore.setCurComponent({ component: null, index: null });
  editorStore.setComponentData([]);
  editorStore.recordSnapshot();
};

emitter.on('preview', previewClick);
emitter.on('save', save);
emitter.on('clearCanvas', clearCanvas);

data.scale = editorStore.editorState.canvasStyleData.scale;
</script>

<style scoped lang="scss">
.toolbar {
  padding: 1px 1px;
  white-space: nowrap;
  overflow-x: auto;
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