import {App, createVNode, render, VNode} from 'vue';
import MsgPop from '@/components/global/msgpop/MsgPop.vue';

let msg: VNode;

function pop(option: { type: string, msg: string }) {
  if (!msg) {
    msg = createVNode(MsgPop);
    render(msg, document.body);
  }
  if (msg.el != null) {
    let div = document.createElement('div');
    div.innerText = option.msg;
    if (option.type == 'success') {
      div.classList.add('common', 'show', 'success');
    } else {
      div.classList.add('common', 'show', 'error');
    }
    div.setAttribute(msg.el.getAttributeNames()[1], '');
    msg.el.append(div);
    setTimeout(() => {
      div.classList.remove('show');
      div.classList.add('hide');
      setTimeout(() => {
        // @ts-ignore
        msg.el.removeChild(div);
      }, 400);
    }, 4000);
  }


}

export {pop};
export default {
  install(vue: App) {
    vue.config.globalProperties.$popMsg = pop;
  }
};
