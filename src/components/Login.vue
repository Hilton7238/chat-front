<template>
  <div class="container shadow text-center">
    <h3>登&nbsp;&nbsp;&nbsp;录</h3>
    <div class="input-group flex-nowrap">
      <span class="empty" ref="emptyUid" style="display: none">用户不能为空</span>
      <span class="input-group-text" id="addon-wrapping">
        <label for="uid">
          <i class="bi-person-fill"></i>
        </label>
      </span>
      <input type="text" class="form-control" placeholder="用户" aria-label="用户"
             aria-describedby="addon-wrapping" ref="uid">
    </div>
    <div class="input-group flex-nowrap pwd">
      <span class="empty" ref="emptyPwd" style="display: none">密码不能为空</span>
      <span class="input-group-text" id="addon-wrapping">
        <label for="pwd">
          <i class="bi-shield-lock-fill"></i>
        </label>
      </span>
      <input type="password" class="form-control" placeholder="密码" aria-label="密码"
             aria-describedby="addon-wrapping" ref="pwd">
      <a class="inf" @click="goForget">忘记密码?</a>
    </div>
    <button type="button" class="bt" ref="login" @mouseup="mouseUp" @mousedown="mouseDown">登&nbsp;&nbsp;录</button>
    <a class="inf reg" @click="goRegister">立即注册</a>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import debounce from '@/util/debounce';
import throttle from '@/util/throttle';
import axios from 'axios';

@Options({
  name: 'Login',
  methods: {
    isUidEmpty(event: Event | null): boolean {
      this.$refs.emptyUid.style.display = 'none';
      if (this.$refs.uid.value == '') {
        this.$refs.emptyUid.innerText = '用户名不能为空';
        this.$refs.emptyUid.style.display = 'block';
        return false;
      } else {
        this.$refs.emptyUid.style.display = 'none';
        return true;
      }
    },
    isPwdEmpty(event: Event | null): boolean {
      this.$refs.emptyPwd.style.display = 'none';
      if (this.$refs.pwd.value == '') {
        this.$refs.emptyPwd.style.display = 'block';
        return false;
      } else {
        this.$refs.emptyPwd.style.display = 'none';
        return true;
      }
    },
    login(event: Event | null) {
      if (this.isUidEmpty() && this.isPwdEmpty()) {
        this.$showLoading('登录中');
        //登录验证
        axios({
          url: 'api/user/login',
          method: 'post',
          data: {
            uid: this.$refs.uid.value,
            password: this.$refs.pwd.value
          }
        }).then(res => {
          this.$hideLoading();
          if (res.data.code == 402) {
            this.$refs.pwd.value = '';
            this.$refs.uid.value = '';
            this.$refs.emptyUid.innerText = '用户名或密码错误';
            this.$refs.emptyUid.style.display = 'block';
            this.$popMsg({
              type: 'error',
              msg: '用户名或密码错误'
            });
          } else if (res.data.code == 200) {
            window.localStorage.setItem('token', res.data.data.token);
            window.localStorage.setItem('uid', res.data.data.uid);
            window.localStorage.setItem('exp', res.data.data.exp);
            window.localStorage.setItem('userCode', res.data.data.userCode);
            window.localStorage.setItem('_uid', res.data.data._uid);
            this.$router.push('/chat/user/' + window.localStorage.getItem('uid'));
          }
        });
      }

    },
    goRegister() {
      this.$emit('goRegister');
    },
    mouseDown() {
      this.$refs.login.style.background = '#297561';
    },
    mouseUp() {
      this.$refs.login.style.background = '#7BA4A0';
    },
    goForget() {
      this.$emit('goForget');
    }
  },
  mounted() {
    this.$refs.uid.oninput = this.$refs.uid.onfocus = this.$refs.uid.onblur = debounce(this.isUidEmpty, 100);
    this.$refs.pwd.oninput = this.$refs.pwd.onfocus = this.$refs.pwd.onblur = debounce(this.isPwdEmpty, 100);
    this.$refs.pwd.onkeydown = (event: any) => {
      if (event.keyCode == 13) {
        this.$refs.login.style.background = '#297561';
      }
    };
    this.$refs.pwd.onkeyup = () => {
      if (this.$refs.login.style.background == 'rgb(41, 117, 97)') {
        this.$refs.login.style.background = '#7BA4A0';
        this.login();
      }
    };
    this.$refs.login.onclick = throttle(this.login, 200);
  },
})
export default class Login extends Vue {
}
</script>

<style scoped lang="scss">


.empty {
  position: absolute;
  left: 50px;
  top: -20px;
  font-size: 0.7em;
  color: #9b4f4f;
}

.input-group {
  position: relative;
  margin-top: 30px;
}

.container {
  background: rgba(243, 243, 243, 0.62);
  border-radius: 0.8rem;
  color: #114B5F !important;
  font-size: 19px;
  padding: 10px;
  position: relative;
}

.inf {
  position: absolute;
  right: 10px;
  color: #25A5D0;
  font-size: 0.8em;
  bottom: -25px;
  cursor: pointer;
}

.reg {
  bottom: 2px;
}

h3 {
  font-size: 1.2em;
  font-weight: 800;
}

.input-group-text {
  font-size: 1.2em;
  color: #114B5F;
  background-color: #7BA4A0
}


input {
  color: #114B5F;
  font-size: 0.8em;
}

input:focus {
  border-color: #7BA4A0 !important;
  box-shadow: none !important;
}

.bt {
  margin-top: 30px;
  background-color: #7BA4A0;
  font-size: 1em;
  padding: 5px 40px;
  color: #114B5F;
  border: none;
  border-radius: 0.3rem;
  transition: all 0.6s ease-out;
}

@media only screen and (max-width: 500px) {
  .container {
    font-size: 14px;
  }
  input {
    font-size: 12px;
  }
}

</style>
