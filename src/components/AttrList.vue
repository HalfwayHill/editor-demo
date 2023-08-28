<template>
  <div class="attr-list">
    <el-form>
      <el-form-item v-for="({key,label}, index)  in styleKeys" :key="index" :label="label">
        <el-color-picker v-if="key == 'borderColor'" v-model="curComponent.style[key]"></el-color-picker>
        <el-color-picker v-else-if="key == 'color'" v-model="curComponent.style[key]"></el-color-picker>
        <el-color-picker v-else-if="key == 'backgroundColor'" v-model="curComponent.style[key]"></el-color-picker>
        <el-select v-else-if="attribute.selectKey.includes(key)" v-model="curComponent.style[key]">
          <template v-if="key == 'textAlign'">
            <el-option
                v-for="item in attribute.textAlignOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
          </template>
          <template v-else-if="key == 'borderStyle'">
            <el-option
                v-for="item in attribute.borderStyleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
          </template>
          <template v-else>
            <el-option
                v-for="item in attribute.verticalAlignOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
          </template>
        </el-select>
        <el-input type="number" v-else v-model.number="curComponent.style[key]" />
      </el-form-item>
      <el-form-item label="内容" v-if="curComponent && !attribute.excludes.includes(curComponent.component)">
        <el-input type="textarea" v-model="curComponent.propValue" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {computed, reactive} from "vue";
import store from "@/store";
import attributeNameData from "@/utils/attributeNameData";

const editorStore = store.editorStore;

const attribute = reactive({
  excludes: ['Picture', 'Group'], // 这些组件不显示内容
  textAlignOptions: [
    {
      label: '左对齐',
      value: 'left',
    },
    {
      label: '居中',
      value: 'center',
    },
    {
      label: '右对齐',
      value: 'right',
    },
  ],
  borderStyleOptions: [
    {
      label: '实线',
      value: 'solid',
    },
    {
      label: '虚线',
      value: 'dashed',
    },
  ],
  verticalAlignOptions: [
    {
      label: '上对齐',
      value: 'top',
    },
    {
      label: '居中对齐',
      value: 'middle',
    },
    {
      label: '下对齐',
      value: 'bottom',
    },
  ],
  selectKey: ['textAlign', 'borderStyle', 'verticalAlign'],
  attributeNameData,
});

const styleKeys = computed(() => {
  if (editorStore.editorState.curComponent) {
    const curComponentStyleKeys = Object.keys(editorStore.editorState.curComponent.style);
    return attribute.attributeNameData.filter(item => curComponentStyleKeys.includes(item.key));
  }
  return [];
});

const curComponent = computed(() => {
  return editorStore.editorState.curComponent
});
</script>

<style scoped lang="scss">
.attr-list {
  overflow: auto;
  padding: 20px;
  padding-top: 0;
  height: 100%;
}
</style>