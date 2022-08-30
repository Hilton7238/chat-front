<template>
  <div class="bg">
    <button class="change-back" @click="back">返&nbsp;&nbsp;回</button>
    <PopWindow ref="pop" @Confirm="confirm"></PopWindow>
    <div class="container shadow text-center">
      <h3>修&nbsp;&nbsp;&nbsp;改</h3>
      <div class="text-center" style="margin-bottom:40px;">
        <label for="pic" style="cursor: pointer;">
          <img :src="user.imgUrl" ref="pic"><br>
          <span class="fileError" ref="fileError" style="display: block;margin-top: 10px">要修改，请上传图片，且小于5MB('gif', 'jpg', 'jpeg', 'png', 'svg')</span>
        </label>
        <input type="file" id="pic" style="display: none" accept="image/*" @change="uploadPic" ref="file">
      </div>
      <div class="input-group flex-nowrap">
        <span ref="erruid" class="err" style="display: none">用户名不规范</span>
        <span class="input-group-text" id="addon-wrapping">
        <label for="uid">
          <i class="bi-person-fill"></i>
        </label>
      </span>
        <input id="uid" type="text" class="form-control" placeholder="用户" aria-label="用户"
               aria-describedby="addon-wrapping" ref="uid" readonly>
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
      <div class="input-group flex-nowrap">
        <span class="err" style="display: none" ref="errMail">邮箱格式错误</span>
        <span class="input-group-text" id="addon-wrapping">
        <label for="mail">
          <i class="bi-voicemail"></i>
        </label>
      </span>
        <input id="mail" type="e-mail" class="form-control" :placeholder="user.mail" aria-label="邮箱"
               aria-describedby="addon-wrapping" ref="mail" @keydown="keyDown" @keyup="keyUp">
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
        <input id="code" type="text" class="form-control" placeholder="验证码" aria-label="验证码"
               aria-describedby="addon-wrapping" ref="code">
      </div>
      <button type="button" class="bt" @mousedown="mouseDown" @mouseup="mouseUp" ref="update">修&nbsp;&nbsp;改
      </button>
    </div>
  </div>

</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import axios from 'axios';
import debounce from '@/util/debounce';
import throttle from '@/util/throttle';
import PopWindow from '@/components/PopWindow.vue';

@Options({
  name: 'ChangeUserInf',
  data() {
    return {
      user: {}
    };
  },
  components: {
    PopWindow
  },
  methods: {
    back() {
      this.$router.push(
          'chat/user/' + window.localStorage.getItem('uid')
      );
    },
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
    isErrorMail(): boolean {
      if (this.$refs.mail.value == '') {
        this.$refs.errMail.style.display = 'none';
        return true;
      }
      let b = true;
      this.$refs.errMail.style.display = 'none';
      if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.$refs.mail.value)) {
        this.$refs.errMail.style.display = 'block';
        b = false;
      }
      return b;
    },
    isErrorCode(): boolean {
      this.$refs.errCode.style.display = 'none';
      if (this.$refs.code.value == '' && this.$refs.mail.value != '') {
        this.$refs.errCode.innerText = '验证码不能为空';
        this.$refs.errCode.style.display = 'block';
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
        url: 'api/user/update/getCode',
        method: 'get',
        params: {
          to: this.$refs.mail.value,
          uid: window.localStorage.getItem('uid')
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
    update() {
      const data = new FormData();
      data.append('mail', this.$refs.mail.value);
      data.append('code', this.$refs.code.value);
      data.append('file', this.$refs.file.files[0]);
      data.append('name', this.$refs.name.value);
      this.$showLoading('修改中');
      axios({
        url: 'api/user/updateInf',
        method: 'post',
        data: data,
      }).then(res => {
        console.log(res);
        this.$hideLoading();
        if (res.data.code == 406) {
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
        } else if (res.data.code == 200) {
          this.$popMsg({
            msg: '修改成功',
            type: 'success'
          });
          setTimeout(() => {
            this.$router.push(
                'chat/user/' + window.localStorage.getItem('uid')
            );
          }, 500);
        }
      });
    },
    showPopWindow() {
      if (this.isErrorName() && (this.$refs.mail.value == '' || this.isErrorCode())) {
        this.$refs.pop.show('确定要修改吗？');
      }
    },
    confirm() {
      this.update();
    }
  },
  mounted() {
    this.$refs.mail.oninput = this.$refs.mail.onblur = this.$refs.mail.onfocus = debounce(this.isErrorMail, 100);
    this.$refs.name.oninput = this.$refs.name.onblur = this.$refs.name.onfocus = debounce(this.isErrorName, 100);
    this.$refs.code.oninput = this.$refs.code.onblur = this.$refs.code.onfocus = debounce(this.isErrorCode, 100);
    this.$refs.update.onclick = throttle(this.showPopWindow, 100);
    this.$refs.uid.value = window.localStorage.getItem('_uid');
    this.getUser();
  },
})
export default class ChangeUserInf extends Vue {
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
