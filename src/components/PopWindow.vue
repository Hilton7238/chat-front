<template>
  <div class="pop-container" ref="container">
    <span>{{ msg }}</span>
    <button class="pop-cancel" @click="cancel">取&nbsp;&nbsp;消</button>
    <button class="pop-confirm" @click="confirm">确&nbsp;&nbsp;认</button>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';

@Options({
  name: 'PopWindow',
  data() {
    return {
      msg: 'no message',
      event: {}
    };
  },
  methods: {
    cancel(event: any) {
      this.$refs.container.classList.add('pop-hide');
      this.$emit('cancel');
      setTimeout(() => {
        this.$refs.container.style.display = 'none';
      }, 400);
    },
    confirm(event: any) {
      this.$refs.container.classList.add('pop-hide');
      this.$emit('confirm', this.event);
      setTimeout(() => {
        this.$refs.container.style.display = 'none';
      }, 400);
    },
    show(msg: String = 'no message', event: any | null) {
      this.event = event;
      this.$refs.container.classList.remove('pop-hide');
      this.msg = msg;
      this.$refs.container.style.display = 'flex';
    }
  }
})
export default class PopWindow extends Vue {
}
</script>

<style scoped lang="scss">
.pop-container {
  display: none;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  min-height: 100px;
  transition: all 0.4s cubic-bezier(0.2, 0.45, 0.7, 0.75);
  background-color: #114B5F !important;
  color: #25A5D0 !important;
  font-size: 18px !important;
  font-weight: 800 !important;
  border-radius: 0.4rem !important;
  z-index: 100;
}

.pop-hide {
  opacity: 0;
}

.pop-cancel {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: #7BA4A0;
  font-size: 14px;
  padding: 3px;
  border-radius: 0.2rem;
  color: #0e4d62;
  transition: all 0.4s cubic-bezier(0.2, 0.45, 0.7, 0.75);
}

.pop-confirm {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: #7BA4A0;
  font-size: 14px;
  padding: 3px;
  border-radius: 0.2rem;
  color: #0e4d62;
  transition: all 0.2s cubic-bezier(0.2, 0.45, 0.7, 0.75);
}

.pop-cancel:hover, .confirm:hover {
  color: #0e6a89;
}
</style>
