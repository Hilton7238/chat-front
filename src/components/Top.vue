<template>
  <div :class="{'fixed':isFixed}">
    <section class="left">
      <slot name="left"></slot>
    </section>
    <section class="center">
      <slot name="center"></slot>
    </section>
    <section class="right">
      <slot name="right"></slot>
    </section>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';

@Options({
  name: 'Top',
  props: {
    isFixed: false
  }
})
export default class Top extends Vue {
}
</script>

<style scoped lang="scss">
div {
  height: 48px;
  position: relative;
  width: 100%;
  backdrop-filter: saturate(180%) blur(20px);
  z-index: 5;
}

div section {
  position: absolute;
  top: 50%;
}

.left {
  left: 10px;
  transform: translateY(-50%);
}

.center {
  left: 50%;
  transform: translate(-50%, -50%);
}

.right {
  right: 10px;
  transform: translateY(-50%);
}

.fixed {
  position: fixed;
  top: 0;
  width: 100%;
}
</style>
