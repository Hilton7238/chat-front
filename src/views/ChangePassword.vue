<template>
  <div class="bg">
    <button class="change-back" @click="back">返&nbsp;&nbsp;回</button>
    <PopWindow ref="pop" @Confirm="confirm"></PopWindow>
    <div class="container shadow text-center">
      <h3>修改密码</h3>
      <div class="input-group flex-nowrap">
        <span class="input-group-text" id="addon-wrapping">
        <label for="uid">
          <i class="bi-person-fill"></i>
        </label>
      </span>
        <input id="uid" type="text" class="form-control" placeholder="用户" aria-label="用户"
               aria-describedby="addon-wrapping" ref="uid" :value="user.uid" readonly>
      </div>
      <div class="input-group flex-nowrap pwd">
        <span class="msg">密码应包含字母数字特殊符号且大于8位(不含空格)</span>
        <span ref="errpwd" class="err" style="display: none">密码不规范</span>
        <span class="input-group-text" id="addon-wrapping">
        <label for="pwd">
          <i class="bi-shield-lock-fill"></i>
        </label>
      </span>
        <input id="pwd" type="password" class="form-control" placeholder="密码" aria-label="密码"
               aria-describedby="addon-wrapping" ref="pwd">
      </div>
      <div class="input-group flex-nowrap spwd">
        <span ref="errspwd" class="err" style="display: none">两次密码不一致</span>
        <span class="input-group-text" id="addon-wrapping">
        <label for="spwd">
          <i class="bi-file-earmark-lock-fill"></i>
        </label>
      </span>
        <input id="spwd" type="password" class="form-control" placeholder="确认密码" aria-label="确认密码"
               aria-describedby="addon-wrapping" ref="spwd">
      </div>
      <div class="input-group flex-nowrap">
        <span class="input-group-text" id="addon-wrapping">
        <label for="mail">
          <i class="bi-voicemail"></i>
        </label>
      </span>
        <input id="mail" type="e-mail" class="form-control" placeholder="邮箱" aria-label="邮箱"
               aria-describedby="addon-wrapping" ref="mail" @keydown="keyDown" @keyup="keyUp" :value="user.mail"
               readonly>
        <button type="button" class="btn-code" @mousedown="mouseDown" @mouseup="mouseUp" ref="sendCode"
                @click="sendCode"
        >发送验证码
        </button>
      </div>
      <div class="input-group flex-nowrap">
        <span class="err" style="display: none" ref="errCode">验证码错误</span>
        <span class="input-group-text" id="addon-wrapping">
        <label for="code">
          <i class="bi-voicemail"></i>
        </label>
      </span>
        <input type="text" class="form-control" placeholder="验证码" aria-label="验证码"
               aria-describedby="addon-wrapping" ref="code">
      </div>
      <button type="button" class="bt" @mousedown="mouseDown" @mouseup="mouseUp" ref="change">修&nbsp;&nbsp;改
      </button>
    </div>
  </div>

</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import debounce from '@/util/debounce';
import throttle from '@/util/throttle';
import axios from 'axios';
import PopWindow from '@/components/PopWindow.vue';

axios.defaults.withCredentials = true;
@Options({
  name: 'ChangePassword',
  components: {PopWindow},
  data() {
    return {
      user: {}
    };
  },
  methods: {
    getUser() {
      axios({
        method: 'get',
        url: 'api/user/getUserInf',
        params: {
          uid: window.localStorage.getItem('uid')
        }
      }).then(res => {
        this.user = res.data.data.user;
        console.log(this.user);
      });
    },
    back() {
      this.$router.push(
          'chat/user/' + window.localStorage.getItem('uid')
      );
    },
    confirm() {
      this.change();
    },
    showPop() {
      this.$refs.pop.show('是否确定修改');
    },
    isErrorCode(): boolean {
      this.$refs.errCode.style.display = 'none';
      if (this.$refs.code.value == '') {
        this.$refs.errCode.innerText = '验证码不能为空';
        this.$refs.errCode.style.display = 'block';
        return false;
      }
      return true;
    },
    isErrorPwd(): boolean {
      let b: boolean = true;
      this.$refs.errpwd.style.display = 'none';
      let str: string = this.$refs.pwd.value;
      if (str.length > 25) {
        this.$refs.pwd.value = str.substring(0, 25);
      }
      let reg = /^(\w*([A-Za-z])+\w*(\d)+\w*[@#$%^&*]+\w*)|(\w*([A-Za-z])+\w*[@#$%^&*]+\w*(\d)+\w*)|(\w*(\d)+\w*[a-zA-Z]+\w*[@#$%^&*]+\w*)|(\w*(\d)+\w*[@#$%^&*]+\w*[a-zA-Z]+\w*)|(\w*[@#$%^&*]+\w*(\d)+\w*[a-zA-Z]+\w*)|(\w*[@#$%^&*]+\w*[a-zA-Z]+\w*(\d)+\w*)$/;
      if (str == '') {
        this.$refs.errpwd.innerText = '密码不能为空';
        this.$refs.errpwd.style.display = 'block';
        b = false;
      } else if (str.indexOf(' ') != -1) {
        this.$refs.errpwd.innerText = '密码不能含有空格';
        this.$refs.errpwd.style.display = 'block';
        b = false;
      } else if (str.length < 8) {
        this.$refs.errpwd.innerText = '密码过短';
        this.$refs.errpwd.style.display = 'block';
        b = false;
      } else if (!reg.test(str)) {
        this.$refs.errpwd.innerText = '密码不规范';
        this.$refs.errpwd.style.display = 'block';
        b = false;
      }
      return b;
    },
    isSame(): boolean {
      this.$refs.errspwd.style.display = 'none';
      if (this.$refs.spwd.value != this.$refs.pwd.value) {
        this.$refs.errspwd.innerText = '两次密码不一致';
        this.$refs.errspwd.style.display = 'block';
        return false;
      }
      return true;
    },
    mouseDown(event: Event) {
      let element = event.srcElement as HTMLElement;
      element.style.background = '#297561';
    },
    mouseUp(event: Event) {
      let element = event.srcElement as HTMLElement;
      element.style.background = '#7BA4A0';
    },
    keyDown(event: any) {
      if (event.keyCode == 13) {
        this.$refs.sendCode.style.background = '#297561';
      }
    },
    keyUp(event: any) {
      if (this.$refs.sendCode.style.background == 'rgb(41, 117, 97)') {
        this.$refs.sendCode.style.background = '#7BA4A0';
        this.sendCode();
      }
    },
    sendCode() {
      if (this.$refs.uid.value == '') {
        this.$refs.erruid.innerText = '用户名不能为空';
        this.$refs.erruid.style.display = 'block';
        return;
      }
      axios.request({
        url: 'api/user/changePasswordGetCode',
        method: 'get',
        params: {
          uid: this.$refs.uid.value,
          mail: this.$refs.mail.value,
          state: 'update'
        }
      }).then(res => {
        if (res.data.code == 210) {
          this.$refs.erruid.innerText = '用户名与邮箱不一致';
          this.$refs.erruid.style.display = 'block';
        } else {
          this.$refs.sendCode.classList.add('notallow');
          this.$refs.mail.classList.add('notallow');
          let timer: number;
          let s = 59;
          timer = setInterval(() => {
            this.$refs.sendCode.innerText = '发送验证码' + s + 's';
            s--;
          }, 1000);
          setTimeout(() => {
            clearInterval(timer);
            this.$refs.sendCode.innerText = '发送验证码';
            this.$refs.sendCode.classList.remove('notallow');
            this.$refs.mail.classList.remove('notallow');
          }, 60000);
        }
      });
    },
    change(event: Event) {
      //修改
      if (this.isErrorPwd() && this.isSame() && this.isErrorCode()) {
        //请求
        this.$showLoading('修改中');
        axios({
          headers: {'Content-Type': 'multipart/form-data'},
          url: 'api/user/update/changePassword',
          method: 'post',
          data: {
            password: this.$refs.pwd.value,
            code: this.$refs.code.value,
          },
        }).then(res => {
          this.$hideLoading();
          if (res.data.code == 200) {
            //修改成功
            this.$popMsg({
              type: 'success',
              msg: '修改成功'
            });
            setTimeout(() => {
              this.back();
            }, 500);
          } else if (res.data.code == 406) {
            this.$popMsg({
              type: 'error',
              msg: '验证码错误'
            });
            this.$refs.erruid.innerText = '验证码错误';
            this.$refs.erruid.style.display = 'block';
          } else if (res.data.code == 400) {
            this.$popMsg({
              type: 'error',
              msg: '验证码过期'
            });
          }
        });
      }
    }
  },
  mounted() {
    this.$refs.spwd.oninput = this.$refs.spwd.onblur = this.$refs.spwd.onfocus = debounce(this.isSame, 100);
    this.$refs.pwd.oninput = this.$refs.pwd.onblur = this.$refs.pwd.onfocus = debounce(this.isErrorPwd, 100);
    this.$refs.code.oninput = this.$refs.code.onblur = this.$refs.code.onfocus = debounce(this.isErrorCode, 100);
    this.$refs.code.onkeydown = (event: any) => {
      if (event.keyCode == 13) {
        this.$refs.change.style.background = '#297561';
      }
    };
    this.$refs.code.onkeyup = () => {
      if (this.$refs.change.style.background == 'rgb(41, 117, 97)') {
        this.$refs.change.style.background = '#7BA4A0';
        this.showPop();
      }
    };
    this.$refs.change.onclick = throttle(this.showPop, 200);
    this.getUser();
  },
})
export default class ChangePassword extends Vue {

}
</script>

<style scoped lang="scss">
.change-back {
  border: none;
  border-radius: 0.2rem;
  padding: 5px 10px;
  position: absolute;
  left: 5px;
  top: 2px;
  font-size: 14px;
  color: black;
  background-color: #ffffff;
  box-shadow: 0px 2px 3px 0px #959191;
  transition: all 0.4s cubic-bezier(0.2, 0.25, 0.7, 0.75);
}

.change-back:hover {
  background-color: #c9c0c0;
}

.input-group {
  position: relative;
  margin-top: 30px;
}

.msg {
  position: absolute;
  right: 2px;
  top: -1.6em;
  font-size: 0.7em;
  color: #9b4f4f;
}

.err {
  position: absolute;
  left: 5px !important;
  top: -1.6em;
  font-size: 0.7em;
  color: #9b4f4f;
}

.fileError {
  font-size: 0.7em;
  color: #9b4f4f;
}

.container {
  background: rgba(243, 243, 243, 0.62);
  border-radius: 0.8rem;
  color: #114B5F !important;
  font-size: 19px;
  padding: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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

.btn-code {
  @extend .bt;
  margin-top: 0;

}

.notallow {
  cursor: not-allowed;
  pointer-events: none;
  background: #777575 !important;
}

@media only screen and (max-width: 500px) {
  .container {
    font-size: 14px;
  }

  input {
    font-size: 12px;
  }
}

.bg {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: url("../assets/img/bg.png") no-repeat;
  background-size: cover;
}
</style>
