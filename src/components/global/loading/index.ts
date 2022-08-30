import {App, createVNode, render, VNode} from 'vue';
import Loading from '@/components/global/loading/Loading.vue';

let loading: VNode;
let div = document.createElement('div');
div.style.position = 'absolute';
div.style.width = '100%';
div.style.height = '100%';
div.style.zIndex = '99';

function showLoading(msg: string) {
  loading = createVNode(Loading, {
    msg: msg
  });
  render(loading, div);
  document.body.prepend(div);
}

function hideLoading() {
  if (loading.el) {
    render(null, div);
    document.body.removeChild(div);
  }
}

export default {
  install(vue: App) {
    vue.config.globalProperties.$showLoading = showLoading;
    vue.config.globalProperties.$hideLoading = hideLoading;
  }
};

