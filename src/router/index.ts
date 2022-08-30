import {createRouter, createWebHashHistory} from 'vue-router';

const NProgress = require('nprogress/nprogress');
const Index = () => import('@/views/Index.vue');
const Forget = () => import('@/views/ForgetView.vue');
const ChatView = () => import('@/views/ChatView.vue');
const ChangeInf = () => import('@/views/ChangeUserInf.vue');
const Admin = () => import('@/views/Admin.vue');
const NotFound = () => import('@/views/NotFound.vue');
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/chat/index',
    },
    {
      path: '/chat',
      redirect: '/chat/index'
    },
    {
      path: '/index',
      redirect: '/chat/index'
    },
    {
      path: '/chat/index',
      name: 'index',
      component: Index,
      meta: {
        type: 'index',
        title: '首页'
      }
    },
    {
      path: '/chat/forget',
      name: 'forget',
      component: Forget,
      meta: {
        type: 'common',
        title: '忘记密码'
      }
    },
    {
      path: '/chat/user/:uid',
      name: 'userChat',
      component: ChatView,
      meta: {
        type: 'auth',
        title: '聊天'
      }
    },
    {
      path: '/chat/user/updateInf/:uid',
      name: 'updateInf',
      component: ChangeInf,
      meta: {
        type: 'auth',
        title: '修改信息'
      }
    },
    {
      path: '/chat/admin',
      name: 'manageUsers',
      component: Admin,
      meta: {
        type: 'auth',
        user: 'admin',
        title: '管理'
      }
    },
    {
      path: '/404',
      name: '404',
      meta: {
        title: '404'
      },
      component: NotFound
    },
    {
      path: '/:pathMatch(.*)',
      redirect: {
        name: '404'
      }
    },
  ]
});
router.beforeEach((to, from, next) => {
  let uid: string;
  // @ts-ignore
  if (window.localStorage.getItem('uid') != null && window.localStorage.getItem('uid').indexOf('/') != -1) {
    //@ts-ignore
    if (to.name == undefined && to.path.indexOf(window.localStorage.getItem('uid')) != -1) {
      let str = window.localStorage.getItem('uid');
      //@ts-ignore
      let newStr = str.replace('/', '');
      //@ts-ignore
      to.path = to.path.replace(str, newStr);
      next({
        path: to.path,
      });
      console.log(to.path);
      return;
    }
  }
  if (to.name == 'userChat' || to.name == 'updateInf' || to.name == 'index') {
    uid = window.localStorage.getItem('uid') as string;
    uid = uid.replace('/', '');
  }
  // @ts-ignore
  NProgress.start();
  let exp: number = Number.parseInt(window.localStorage.getItem('exp') as string);
  let userCode: number = Number.parseInt(window.localStorage.getItem('userCode') as string);
  //用户验证
  if (to.meta.type == 'auth' && (new Date().getTime() > exp || window.localStorage.getItem('token') == null)) {
    window.localStorage.clear();
    next({
      path: '/chat/index'
    });
  } else if (to.meta.type == 'index' && new Date().getTime() <= exp && window.localStorage.getItem('token') != null) {
    next({
      //@ts-ignore
      path: '/chat/user/' + uid
    });
  } else if (to.meta.user == 'admin' && userCode != 1) {
    next({
      path: from.path
    });
    //@ts-ignore
  } else if (to.name == 'userChat' && to.path != '/chat/user/' + uid) {
    next({
      //@ts-ignore
      path: '/chat/user/' + uid
    });
    //@ts-ignore
  } else if (to.name == 'updateInf' && to.path != '/chat/user/updateInf/' + uid) {
    next({
      // @ts-ignore
      path: '/chat/user/updateInf/' + uid
    });
  } else if (to.meta.user == 'admin' && (window.localStorage.getItem('userCode') == null || window.localStorage.getItem('userCode') != '1')) {
    next({
      path: from.path
    });
  } else {
    document.title = to.meta.title as string;
    next();
  }
});
router.afterEach(() => {
  NProgress.done();
});
export default router;


