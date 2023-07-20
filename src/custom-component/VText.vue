<template>
    <textarea 
        v-if="editorStore.editorState.editMode == 'edit'"
        :value="propValue"
        class="text textarea"
        @input="handleInput"
        ref="v-text"
    ></textarea>
    <div v-else class="text disabled">
        <div v-for="(text, index) in propValue!.split('\n')" :key="index">{{ text }}</div>
    </div>
</template>

<script setup lang="ts">
import appStore from "@/store";

const editorStore = appStore.editorStore;

const props = defineProps({
  propValue: {
    type: String,
  },
  element: {
    type: Object,
  },
});

const emit = defineEmits(['input:show'])

const handleInput = (e: any) => {
  emit('input:show', props.element, e.target.value)
}
</script>

<style lang="scss" scoped>
.text {
    border: 1px solid #ddd;
    padding: 5px 10px;
    white-space: normal;
    word-break: break-all;
}
.textarea {
    overflow: hidden;
    resize: none;
}
.disabled {
    border: none;
}
</style>