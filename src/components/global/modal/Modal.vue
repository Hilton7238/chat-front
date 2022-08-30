<template>
  <div class="modal-container">
    <div class="modal-box hide">
      <h5>{{ title }}</h5>
      <input class="modal-input">
      <div class="btns">
        <button class="modal-cancel" @click="cancel">取&nbsp;&nbsp;消</button>
        <button class="modal-confirm" @click="confirm">确&nbsp;&nbsp;定</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';

@Options({
  name: 'Modal',
  props: {
    confirm: {
      type: Function,
      default: () => {

      }
    },
    cancel: {
      type: Function,
      default: () => {

      }
    },
    title: {
      type: String,
      default: ''
    },
    msg: {
      type: String,
      default: ''
    }
  },
  methods: {
    show() {
      let container = document.getElementsByClassName('modal-container')[0] as HTMLElement;
      container.style.display = 'block';
      document.getElementsByClassName('modal-box')[0].classList.remove('hide');
    },
    hide() {
      let container = document.getElementsByClassName('modal-container')[0] as HTMLElement;
      document.getElementsByClassName('modal-box')[0].classList.add('hide');
      setTimeout(() => {
        container.style.display = 'none';
      }, 400);
    }
  },
})
export default class Modal extends Vue {
}
</script>

<style scoped lang="scss">
.modal-input {
  border: none;
  background: none;
  border-bottom: 1px solid #223252;
  width: 70%;
  outline: none;
  padding: 0 5px;
  color: #3b3939;
}

.modal-input:focus {
  border-bottom: 1px solid #195ed9;
}

.hide {
  opacity: 0;
  transform: translate(-50%, -50%) !important;
}

.modal-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  background-color: rgba(73, 72, 72, 0.8);
  backdrop-filter: saturate(180%) blur(20px)
}

.modal-box {
  padding: 5px 0;
  position: absolute;
  left: 50%;
  top: 2%;
  background-color: #efe6e6;
  text-align: center;
  width: 500px;
  transition: all 0.4s cubic-bezier(0.2, 0.25, 0.7, 0.75);
  transform: translate(-50%, 0);
  border-radius: 0.4rem;
}

.modal-box button {
  border: none;
  border-radius: 0.2rem;
  padding: 3px 10px;
  background-color: #2c7452;
  color: #282121;
  position: absolute;
  transition: all 0.2s cubic-bezier(0.2, 0.25, 0.7, 0.75);
}

.modal-cancel {
  left: 10px;
}

.modal-confirm {
  right: 10px;
}

.modal-cancel:hover, .modal-confirm:hover {
  color: #fffcfc;
}

.btns {
  position: relative;
  margin-top: 10px;
  height: 30px;
}

</style>
