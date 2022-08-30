<template>
  <div class="bg">
    <p ref="type" class="type"></p>
    <Login class="login hide" @goRegister="goRegister" @goForget="goForget"></Login>
    <Register @goLogin="goLogin" class="register hide"></Register>
  </div>

</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';
import Forget from '@/components/Forget.vue';
import Loading from '@/components/global/loading/Loading.vue';
import Typed from 'typed.js';

@Options({
  name: 'Index',
  components: {Loading, Forget, Register, Login},
  methods: {
    type(option: any) {
      new Typed(this.$refs.type, option);
    },
    goLogin() {
      document.getElementsByClassName('login')[0].classList.remove('hide');
      document.getElementsByClassName('login')[0].classList.add('show');
      setTimeout(() => {
        document.getElementsByClassName('register')[0].classList.remove('show');
        document.getElementsByClassName('register')[0].classList.add('hide');
      }, 10);

    },
    goRegister() {
      document.getElementsByClassName('login')[0].classList.remove('show');
      document.getElementsByClassName('login')[0].classList.add('hide');
      setTimeout(() => {
        document.getElementsByClassName('register')[0].classList.remove('hide');
        document.getElementsByClassName('register')[0].classList.add('show');
      }, 10);
    },
    goForget() {
      this.$router.push('/chat/forget');
    },
  },
  mounted() {
    this.type({
      strings: ['Hi I\'m Hilton', 'Welcome come to Chat,you can chat with your friends in Chat!'],
      typeSpeed: 100,
      fadeOut: true,
      backDelay: 1500,
      loop: true
    });
    setTimeout(() => {
      document.getElementsByClassName('login')[0].classList.remove('hide');
      document.getElementsByClassName('login')[0].classList.add('show');
    }, 0);
    if (this.$route.query.msg == 'authorizeFail') {
      this.$popMsg({
        type: 'error',
        msg: '身份认证过期'
      });
    }
  }
})
export default class Index extends Vue {
}
</script>

<style scoped lang="scss">
.bg {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: url("../assets/img/bg.png") no-repeat;
  background-size: cover;
}

.login {
  position: absolute;
  left: 50%;
  top: 50%;
  transition: all 0.6s cubic-bezier(0.2, 0.4, 0.8, 1);
}

.register {
  @extend .login;
}

.show {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.hide {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0);
}

.type {
  position: absolute;
  left: 50%;
  top: 5%;
  transform: translateX(-50%);
  font-size: 25px;
  font-weight: 800;
  color: #376b5d;
}

@media screen and (max-width: 400px) {
  .type {
    font-size: 16px;
  }
}

@media screen and (max-width: 500px) and (min-width: 400px) {
  .type {
    font-size: 18px;
  }
}
</style>
