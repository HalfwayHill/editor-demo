<template>
  <div class="event-list">
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

    <!-- 选择事件 -->
    <Modal v-model:show="data.isShowEvent">
      <el-tabs type="card" v-model="data.eventActiveName">
        <el-tab-pane v-for="item in data.eventList" :key="item.key" :label="item.label" :name="item.key"
                     style="padding: 0 20px">
          <el-input v-if="item.key == 'redirect'" v-model="item.param" type="textarea" placeholder="请输入完整的 URL"/>
          <el-input v-if="item.key == 'alert'" v-model="item.param" type="textarea"
                    placeholder="请输入要 alert 的内容"/>
          <el-button style="margin-top: 20px;" @click="addEvent(item.key, item.param)">确定</el-button>
        </el-tab-pane>
      </el-tabs>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import Modal from "@/components/Modal.vue";
import appStore from "@/store";
import {reactive} from "vue";
import {eventList} from "@/utils/events";

const editorStore = appStore.editorStore;

const data = reactive({
  isShowEvent: false,
  eventURL: '',
  eventActiveName: 'redirect',
  eventList,
});

/**
 * 为元素添加事件
 * @param event
 * @param param
 */
const addEvent = (event: any, param: any) => {
  data.isShowEvent = false;
  editorStore.addEvent({event, param});
}

/**
 * 为元素移除事件
 * @param event
 */
const removeEvent = (event: any) => {
  editorStore.removeEvent(event);
};
</script>

<style scoped lang="scss">
.event-list {
  .div-events {
    text-align: center;
    padding: 0 20px;

    .el-button {
      display: inline-block;
      margin-bottom: 10px;
    }

    .el-tag {
      display: block;
      width: 50%;
      margin: auto;
      margin-bottom: 10px;
    }
  }
}
</style>