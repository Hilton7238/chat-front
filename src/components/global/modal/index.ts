import {App, createVNode, render, VNode} from 'vue';
import {pop} from '../msgpop/index';
import Modal from './Modal.vue';

const div = document.createElement('div');
div.style.position = 'absolute';
div.style.zIndex = '10';
div.style.width = '100vw';
div.style.height = '100vh';
div.style.top = '0';
div.style.left = '0';
let showModal = (options: { title: string }) => {
  return new Promise((resolve, reject) => {
    const confirm = (event: any) => {
      let input = document.getElementsByClassName('modal-input')[0] as HTMLInputElement;
      if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(input.value)) {
        pop({
          type: 'error',
          msg: '邮件格式不正确'
        });
        return;
      }
      render(null, div);
      document.body.removeChild(div);
      resolve(input.value);
    };
    const cancel = () => {
      render(null, div);
      document.body.removeChild(div);
      reject('error');
    };
    let modalNode = createVNode(Modal, {confirm, cancel, title: options.title}) as VNode;
    let el: HTMLElement;
    render(modalNode, div);
    document.body.appendChild(div);
    el = modalNode.el as HTMLElement;
    let box = el.getElementsByClassName('modal-box')[0];
    setTimeout(() => {
      box.classList.remove('hide');
    }, 0);
  });
};
export default {
  install(vue: App) {
    vue.config.globalProperties.$showModal = showModal;
  }
};
