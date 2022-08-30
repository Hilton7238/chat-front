import {createApp} from 'vue';
import App from './App.vue';
import '../public/css/bootstrap.min.css';
import '../public/css/common.css';
import 'nprogress/nprogress.css';
import loading from './components/global/loading';
import msg from './components/global/msgpop';
import router from './router';
import webSQL from './webSQL';
import axios from 'axios';
import Modal from '@/components/global/modal';

const NProgress = require('nprogress/nprogress');
axios.interceptors.response.use((res) => {
  NProgress.done();
  if (res.data.code == 401) {
    window.localStorage.clear();
    router.push({
      path: '/chat/index',
      query: {
        msg: 'authorizeFail'
      }
    });
    return;
  } else if (res.data.code == 204) {
    window.localStorage.setItem('uid', res.data.data.uid);
    window.localStorage.setItem('exp', res.data.data.exp);
    window.localStorage.setItem('token', res.data.data.token);
    window.localStorage.setItem('userCode', res.data.data.userCode);
  }
  return res;
}, error => {
  console.log('error:' + error);
});
axios.interceptors.request.use(config => {
  NProgress.start();
  if (window.localStorage.getItem('token') != null) {
    // @ts-ignore
    config.headers.token = window.localStorage.getItem('token');
  }
  return config;
});
createApp(App).use(loading).use(msg).use(router).use(webSQL).use(Modal).mount('#app');

