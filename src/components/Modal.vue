<template>
  <div class="modal-bg" v-if="show" @click="hide">
    <div class="fadeInLeft animated modal" @click="stopPropagation">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">

interface Prop {
  show: boolean
}

defineProps<Prop>();
const emit = defineEmits(['update:show'])

const hide = () => {
  emit('update:show');
}

const stopPropagation = (e: MouseEvent) => {
  e.stopPropagation();
}
</script>

<style scoped lang="scss">
.modal-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.5);
  z-index: 1001;

  .modal {
    width: 400px;
    background: #fff;
    height: 100%;
  }
}
</style>