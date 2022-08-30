<template>
  <div class="container shadow text-center">
    <h3>注&nbsp;&nbsp;&nbsp;册</h3>
    <div class="text-center" style="margin-bottom:40px;">
      <label for="pic" style="cursor: pointer;">
        <img src="../assets/img/add.png" ref="pic"><br>
        <span class="fileError" ref="fileError" style="display: block;margin-top: 10px">请上传图片，且小于5MB('gif', 'jpg', 'jpeg', 'png', 'svg')</span>
      </label>
      <input type="file" id="pic" style="display: none" accept="image/*" @change="uploadPic" ref="file">
    </div>
    <div class="input-group flex-nowrap">
      <span class="msg">用户名不含空格且大于5位</span>
      <span ref="erruid" class="err" style="display: none">用户名不规范</span>
      <span class="input-group-text" id="addon-wrapping">
        <label for="uid">
          <i class="bi-person-fill"></i>
        </label>
      </span>
      <input id="uid" type="text" class="form-control" placeholder="用户" aria-label="用户"
             aria-describedby="addon-wrapping" ref="uid">
    </div>
    <div class="input-group flex-nowrap">
      <span class="err" style="display: none" ref="errname">昵称不能为空</span>
      <span class="input-group-text" id="addon-wrapping">
        <label for="name">
          <i class="bi-person-video"></i>
        </label>
      </span>
      <input id="name" type="type" class="form-control" placeholder="昵称" aria-label="昵称"
             aria-describedby="addon-wrapping" ref="name">
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
      <span class="err" style="display: none" ref="errMail">邮箱格式错误</span>
      <span class="input-group-text" id="addon-wrapping">
        <label for="mail">
          <i class="bi-voicemail"></i>
        </label>
      </span>
      <input id="mail" type="e-mail" class="form-control" placeholder="邮箱" aria-label="邮箱"
             aria-describedby="addon-wrapping" ref="mail" @keydown="keyDown" @keyup="keyUp">
      <button type="button" class="btn-code" @mousedown="mouseDown" @mouseup="mouseUp" ref="sendCode" @click="sendCode"
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
      <input id="code" type="text" class="form-control" placeholder="验证码" aria-label="验证码"
             aria-describedby="addon-wrapping" ref="code">
    </div>
    <button type="button" class="bt" @mousedown="mouseDown" @mouseup="mouseUp" ref="register">注&nbsp;&nbsp;册
    </button>
    <a class="inf reg" @click="goLogin">去登陆</a>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import debounce from '@/util/debounce';
import throttle from '@/util/throttle';
import axios from 'axios';

axios.defaults.withCredentials = true;
@Options({
  name: 'Register',
  methods: {
    isErrorCode(): boolean {
      this.$refs.errCode.style.display = 'none';
      if (this.$refs.code.value == '') {
        this.$refs.errCode.innerText = '验证码不能为空';
        this.$refs.errCode.style.display = 'block';
        return false;
      }
      return true;
    },

    isErrorUid(event: Event): boolean {
      let str: string = this.$refs.uid.value;
      if (str.length > 25) {
        this.$refs.uid.value = str.substring(0, 25);
      }
      this.$refs.erruid.style.display = 'none';
      let b: boolean = true;
      if (str == '') {
        this.$refs.erruid.innerText = '用户名不能为空';
        this.$refs.erruid.style.display = 'block';
        b = false;
      } else if (str.length < 5) {
        this.$refs.erruid.innerText = '用户名过短';
        this.$refs.erruid.style.display = 'block';
        b = false;
      } else if (str.indexOf(' ') != -1) {
        this.$refs.erruid.innerText = '用户名不能含空格';
        this.$refs.erruid.style.display = 'block';
        b = false;
      } else if (/.*[\u4e00-\u9fa5].*/.test(str)) {
        this.$refs.erruid.innerText = '用户名不规范';
        this.$refs.erruid.style.display = 'block';
        b = false;
      }
      return b;
    },
    isErrorName(): boolean {
      let b: boolean = true;
      this.$refs.errname.style.display = 'none';
      let str: string = this.$refs.name.value;
      if (str.indexOf(' ') != -1) {
        this.$refs.errname.style.display = 'block';
        this.$refs.errname.innerText = '昵称不能含空格';
        b = false;
      } else if (str == '') {
        this.$refs.errname.style.display = 'block';
        this.$refs.errname.innerText = '昵称不能为空';
        b = false;
      }
      return b;
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
    isErrorMail(): boolean {
      let b = true;
      this.$refs.errMail.style.display = 'none';
      if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.$refs.mail.value)) {
        this.$refs.errMail.style.display = 'block';
        b = false;
      }
      return b;
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
      if (!this.isErrorMail()) {
        return;
      }
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
      axios.request({
        url: 'api/user/getCode',
        method: 'get',
        params: {
          to: this.$refs.mail.value
        }
      });
    },
    //图片上传
    uploadPic(event: Event) {
      this.$refs.fileError.style.display = 'none';
      let imgTypes: Array<string> = ['gif', 'jpg', 'jpeg', 'png', 'svg'];
      let e: HTMLInputElement = event.srcElement as HTMLInputElement;
      let suffix = e.value.substring(e.value.lastIndexOf('.') + 1);
      let i = 0;
      for (i; i < imgTypes.length; i++) {
        if (imgTypes[i].toLowerCase() == suffix.toLowerCase()) {
          break;
        }
      }
      if (i == imgTypes.length) {
        this.$refs.fileError.style.display = 'block';
        this.$refs.pic.src = require('../assets/img/add.png');
        e.value = '';
        e.files = null;
      } else {
        if (e.files) {
          if (e.files[0].size > 1024 * 1024 * 5) {
            this.$refs.fileError.style.display = 'block';
            this.$refs.pic.src = require('../assets/img/add.png');
            e.value = '';
            e.files = null;
            this.$popMsg({
              type: 'error',
              msg: '上传图片过大'
            });
          } else {
            let src = window.URL.createObjectURL(e.files[0]);
            this.$refs.pic.src = src;
          }
        }
      }
    },
    goLogin() {
      this.$emit('goLogin');
    },
    register(event: Event) {
      //注册
      if (this.$refs.file.value == '') {
        this.$refs.fileError.style.display = 'block';
        this.$popMsg({
          type: 'error',
          msg: '请上传图片，且小于5MB(\'gif\', \'jpg\', \'jpeg\', \'png\', \'svg\')'
        });
        return;
      }
      if (this.isErrorUid() && this.isErrorName() && this.isErrorPwd() && this.isSame() && this.isErrorCode()) {
        //发送请求验证验证码是否正确
        const data = new FormData();
        data.append('uid', this.$refs.uid.value);
        data.append('password', this.$refs.pwd.value);
        data.append('mail', this.$refs.mail.value);
        data.append('code', this.$refs.code.value);
        data.append('file', this.$refs.file.files[0]);
        data.append('name', this.$refs.name.value);
        this.$showLoading('注册中');
        axios({
          url: 'api/user/register',
          method: 'post',
          data: data,
        }).then(res => {
          this.$hideLoading();
          if (res.data.code == 405) {
            this.$refs.erruid.style.display = 'block';
            this.$refs.erruid.innerText = '用户已存在';
            this.$popMsg({
              msg: '用户已存在',
              type: 'error'
            });
          } else if (res.data.code == 406) {
            this.$refs.errCode.innerText = '验证码错误';
            this.$refs.errCode.style.display = 'block';
            this.$popMsg({
              msg: '验证码错误',
              type: 'error'
            });
          } else if (res.data.code == 400) {
            this.$popMsg({
              msg: '验证码已经过期',
              type: 'error'
            });
          } else if (res.data.code == 408) {
            this.$popMsg({
              type: 'error',
              msg: '该邮箱已被使用'
            });
          } else if (res.data.code == 200) {
            this.$popMsg({
              msg: '注册成功',
              type: 'success'
            });
            setTimeout(() => {
              this.goLogin();
            }, 500);
          }
        });
      }
    }
  },
  mounted() {
    this.$refs.spwd.oninput = this.$refs.spwd.onblur = this.$refs.spwd.onfocus = debounce(this.isSame, 100);
    this.$refs.pwd.oninput = this.$refs.pwd.onblur = this.$refs.pwd.onfocus = debounce(this.isErrorPwd, 100);
    this.$refs.uid.oninput = this.$refs.uid.onblur = this.$refs.uid.onfocus = debounce(this.isErrorUid, 100);
    this.$refs.mail.oninput = this.$refs.mail.onblur = this.$refs.mail.onfocus = debounce(this.isErrorMail, 100);
    this.$refs.code.oninput = this.$refs.code.onblur = this.$refs.code.onfocus = debounce(this.isErrorCode, 100);
    this.$refs.name.oninput = this.$refs.name.onblur = this.$refs.name.onfocus = debounce(this.isErrorName, 100);
    this.$refs.code.onkeydown = (event: any) => {
      if (event.keyCode == 13) {
        this.$refs.register.style.background = '#297561';
      }
    };
    this.$refs.code.onkeyup = () => {
      if (this.$refs.register.style.background == 'rgb(41, 117, 97)') {
        this.$refs.register.style.background = '#7BA4A0';
        this.register();
      }
    };
    this.$refs.register.onclick = throttle(this.register, 200);
  },
})
export default class Register extends Vue {

}
</script>

<style scoped lang="scss">
.text-center img {
  width: 12em;
  border-radius: 0.6em;
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
</style>
