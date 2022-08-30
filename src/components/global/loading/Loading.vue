<template>
  <div class="box">
    <div>
      <img src="../../../assets/img/connect.png">
      <p>{{ msg }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';

@Options({
  name: 'Loading',
  props: {
    msg: {
      default: '',
      type: String
    }
  }
})
export default class Loading extends Vue {
}
</script>

<style scoped lang="scss">
.box {
  position: absolute;
  text-align: center;
  width: 100vw;
  height: 100%;
  z-index: 10;
  top: 0;
  background-color: rgba(64, 64, 64, .6);
  backdrop-filter: saturate(100%) blur(5px);
  font-size: 18px;
  color: #114B5F;
  font-weight: 800
}

.box div {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

img {
  width: 40%;
  animation: move 0.8s cubic-bezier(0.4, 0.4, 0.6, 0.6) infinite alternate !important;
}

@keyframes move {
  from {
    transform: translate(0, 0) scale(1);
  }
  to {
    transform: translate(0, -30px) scale(1.2)
  }
}
</style>
