<template>
  <div class="box">

  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';

@Options({
  name: 'MsgPop',
})
export default class MsgPop extends Vue {
}
</script>

<style scoped lang="scss">
.box {
  position: absolute;
  left: 50%;
  top: 5%;
  transform: translate(-50%, 0);
  z-index: 99;
}

.common {
  width: 300px;
  padding: 10px;
  font-size: 16px;
  border-radius: 0.6rem;
  margin-top: 20px;

}

.success {
  color: rgb(31, 94, 31);
  background-color: #179b60;
}

.error {
  background-color: #fde2e2;
  color: #cc2222;
}

.show {
  animation: show 0.4s cubic-bezier(0.2, 0.4, 0.8, 0.8) 1 forwards;
}

.hide {
  animation: hide 0.4s cubic-bezier(0.2, 0.4, 0.8, 0.8) 1 forwards;
}

@keyframes show {
  from {
    margin-top: -5px;
    opacity: 0;
  }
  to {
    margin-top: 20px;
    opacity: 1;
  }
}

@keyframes hide {
  to {
    margin-top: -38px;
    opacity: 0;
  }
  from {
    margin-top: 20px;
    opacity: 1;
  }
}

@media screen and (max-width: 500px) {
  .common {
    font-size: 12px;
    width: 150px;
  }
  @keyframes hide {
    to {
      margin-top: -44px;
      opacity: 0;
    }
    from {
      margin-top: 20px;
      opacity: 1;
    }
  }
}
</style>
