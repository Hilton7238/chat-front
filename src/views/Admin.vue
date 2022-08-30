<template>
  <div class="bg">
    <PopWindow ref="logoutPop" @confirm="logout"></PopWindow>
    <PopWindow ref="resetPassword" @confirm="reset"></PopWindow>
    <PopWindow ref="del" @confirm="del"></PopWindow>
    <PopWindow ref="bulkRest" @confirm="bulkRest"></PopWindow>
    <PopWindow ref="bulkDel" @confirm="bulkDel"></PopWindow>
    <span ref="uids" style="display: none"></span><!--存储选中地uid-->
    <span ref="bulkUids" style="display: none"></span>
    <span ref="mails" style="display: none"></span>
    <span ref="bulkMails" style="display: none"></span>
    <Top class="top top-hide">
      <template #left>
        <button type="button" class="btn" @click="back">返&nbsp;&nbsp;回</button>
      </template>
      <template #center>
        <span class="center-span">Admin</span>
      </template>
      <template #right>
        <div class="right-container" ref="rightContainer" @mouseenter="showInf" @mouseleave="hideInf">
          <div class="right-main">
            <img src="user.imgUrl" style="height: 35px;width:35px">
            <span class="right-i" ref="i">
            <i class="bi-arrow-down-circle"></i>
            </span>
          </div>
          <ul class="right-inf" ref="rightInf">
            <li @click="goUpdateInf">修改信息</li>
            <li @click="showLogoutPop">注销推出</li>
          </ul>
        </div>
      </template>
    </Top>
    <div class="container text-center container-hide">
      <div class="operation">
        <div class="btns">
          <button class="resetAll" type="button" @click="bulkRestClick">批量重置</button>
          <button class="delAll" type="button" @click="bulkDelClick">批量删除</button>
        </div>
        <div class="search">
          <input type="text" class="search-input" placeholder="Search..." @keyup="searchKeyUp" ref="searchInput">
          <i class="bi bi-search search-icon" @click="searchKeyUp"></i>
        </div>
      </div>
      <table class="table">
        <thead>
        <tr>
          <th><input type="checkbox" class="form-check-input" @click="isChecked"></th>
          <th>uid</th>
          <th>name</th>
          <th>mail</th>
          <th><i class="bi bi-mailbox"></i></th>
          <th><i class="bi bi-crop"></i></th>
          <th><i class="bi bi-x-octagon"></i></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in pageUsers" :uid="user.uid" :mail="user.mail">
          <td><input type="checkbox" class="form-check-input checkItem" @click="select"></td>
          <td>{{ user.uid }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.mail }}</td>
          <td><a href="" onclick="return false;" @click="changeMail">修改邮箱</a></td>
          <td><a href="" onclick="return false;" @click="resetClick">重置密码</a></td>
          <td><a href="" onclick="return false;" @click="delClick">删&nbsp;&nbsp;除</a></td>
        </tr>
        <!--        <tr uid="qwe1011" mail="595384262@qq.com">-->
        <!--          <td><input type="checkbox" class="form-check-input checkItem" @click="select"></td>-->
        <!--          <td>qwe1011</td>-->
        <!--          <td>hilton</td>-->
        <!--          <td>595384262@qq.com</td>-->
        <!--          <td><a href="" onclick="return false;" @click="changeMail">修改邮箱</a></td>-->
        <!--          <td><a href="" onclick="return false;" @click="resetClick">重置密码</a></td>-->
        <!--          <td><a href="" onclick="return false;" @click="delClick">删&nbsp;&nbsp;除</a></td>-->
        <!--        </tr>-->
        <!--        <tr uid="qwe10" mail="5953842@qq.com">-->
        <!--          <td><input type="checkbox" class="form-check-input checkItem" @click="select"></td>-->
        <!--          <td>qwe1011</td>-->
        <!--          <td>hilton</td>-->
        <!--          <td>595384262@qq.com</td>-->
        <!--          <td><a href="" onclick="return false;">修改邮箱</a></td>-->
        <!--          <td><a href="" onclick="return false;">重置密码</a></td>-->
        <!--          <td><a href="" onclick="return false;">删&nbsp;&nbsp;除</a></td>-->
        <!--        </tr>-->
        <!--        <tr uid="qwe101" mail="59538426@qq.com">-->
        <!--          <td><input type="checkbox" class="form-check-input checkItem" @click="select"></td>-->
        <!--          <td>qwe1011</td>-->
        <!--          <td>hilton</td>-->
        <!--          <td>595384262@qq.com</td>-->
        <!--          <td><a href="" onclick="return false;">修改邮箱</a></td>-->
        <!--          <td><a href="" onclick="return false;">重置密码</a></td>-->
        <!--          <td><a href="" onclick="return false;">删&nbsp;&nbsp;除</a></td>-->
        <!--        </tr>-->
        </tbody>
      </table>
      <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="pageIndex == 1?'disabled':''" @click="pre">
            <a class="page-link" aria-label="Previous" href="" onclick="return false;">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li v-for="index of nums" class="page-item" :class="[pageIndex == index?'active':'']" :index="index"
              @click="indexClick"><a class="page-link"
                                     href=""
                                     onclick="return false;">{{ index }}</a>
          </li>
          <!--          <li class="page-item" :class="[pageIndex == 1?'active':'']" index="1" @click="indexClick"><a class="page-link"-->
          <!--                                                                                                       href=""-->
          <!--                                                                                                       onclick="return false;">1</a>-->
          <!--          </li>-->
          <!--          <li class="page-item" :class="[pageIndex == 2?'active':'']" index="2" @click="indexClick"><a class="page-link"-->
          <!--                                                                                                       href=""-->
          <!--                                                                                                       onclick="return false;">2</a>-->
          <!--          </li>-->
          <!--          <li class="page-item" :class="[pageIndex == 3?'active':'']" index="3" @click="indexClick"><a class="page-link"-->
          <!--                                                                                                       href=""-->
          <!--                                                                                                       onclick="return false;">3</a>-->
          <!--          </li>-->
          <li class="page-item" :class="pageIndex == nums?'disabled':''" @click="next">
            <a class="page-link" href="" onclick="return false;" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import Top from '@/components/Top.vue';
import PopWindow from '@/components/PopWindow.vue';
import axios from 'axios';

@Options({
  name: 'Admin',
  components: {Top, PopWindow},
  data() {
    return {
      pageIndex: 1,
      nums: 1,//total pages
      users: [],//
      pageUsers: [],
      pageNum: 10,//一条显示几页
    };
  },

  methods: {
    getAllUsers() {
      axios({
        url: '/api/admin/getAllUsers',
        method: 'get',
      }).then(res => {
        this.pageIndex = 1;
        this.users = res.data.data;
        this.nums = Math.floor(this.users.length / this.pageNum);
        if (this.users.length % parseInt(this.pageNum) != 0) {
          this.nums++;
        }
        this.setPageUsers();
      });
    },
    setPageUsers() {
      this.pageUsers = [];
      let k = 0;
      for (let i = this.pageNum * (this.pageIndex - 1); i < this.pageNum * (this.pageIndex) && i < this.users.length; i++) {
        this.pageUsers[k++] = this.users[i];
      }
    },
    //批量删除点击方法
    bulkDelClick() {
      if (this.$refs.bulkUids.innerText == '') {
        this.$popMsg({
          type: 'error',
          msg: '你未选择任何元素'
        });
        return;
      }
      let str = this.$refs.bulkUids.innerText as string;
      this.$refs.bulkDel.show(`是否删除${str.substring(0, str.length - 1)}`);
    },
    bulkRestClick() {
      if (this.$refs.bulkUids.innerText == '') {
        this.$popMsg({
          type: 'error',
          msg: '你未选择任何元素'
        });
        return;
      }
      let str: string = this.$refs.bulkUids.innerText as string;
      this.$refs.bulkRest.show(`是否删除${str.substring(0, str.length - 1)}`);
    },
    bulkRest() {
      let uids: Array<string> = this.$refs.bulkUids.innerText.split(',');
      uids.pop();
      let mails: Array<string> = this.$refs.bulkMails.innerText.split(',');
      let users: Array<{ uid: string, mail: string }> = [];
      mails.pop();
      for (let index in uids) {
        let user = {uid: '', mail: ''};
        user.uid = uids[index];
        user.mail = mails[index];
        users.push(user);
      }
      this.resetPassword(users);
    },
    bulkDel() {
      let uids: Array<string> = this.$refs.bulkUids.innerText.split(',');
      uids.pop();
      let mails: Array<string> = this.$refs.bulkMails.innerText.split(',');
      let users: Array<{ uid: string, mail: string }> = [];
      mails.pop();
      for (let index in uids) {
        let user = {uid: '', mail: ''};
        user.uid = uids[index];
        user.mail = mails[index];
        users.push(user);
      }
      let lis: Array<HTMLElement> = [];
      let items = document.getElementsByClassName('checkItem') as any;
      for (let item of items) {
        if (item.checked) {
          lis.push(item.parentNode.parentNode);
        }
      }
      this.delUser(users, lis);
    },
    //选中元素打勾
    select(event: any) {
      let item = event.target;
      let tr = event.target.parentNode.parentNode;
      let uidStr = this.$refs.bulkUids.innerText as string;
      let mailStr = this.$refs.bulkMails.innerText as string;
      if (item.checked == true) {
        this.$refs.bulkUids.innerText += tr.getAttribute('uid') + ',';
        this.$refs.bulkMails.innerText += tr.getAttribute('mail') + ',';
      } else {
        let newUidStr = uidStr.replace(item.parentNode.parentNode.getAttribute('uid') + ',', '');
        let newMailStr = mailStr.replace(item.parentNode.parentNode.getAttribute('mail') + ',', '');
        this.$refs.bulkUids.innerText = newUidStr;
        this.$refs.bulkMails.innerText = newMailStr;
      }

    },
    //删除用户点击方法
    delClick(event: any) {
      this.$refs.uids.innerText = '';
      this.$refs.mails.innerText = '';
      let tr = event.target.parentNode.parentNode;
      this.$refs.uids.innerText = tr.getAttribute('uid');
      this.$refs.mails.innerText = tr.getAttribute('mail');
      this.$refs.del.show(`是否要删除${this.$refs.uids.innerText}`, event);
    },
    //重置密码点击方法
    resetClick(event: any) {
      this.$refs.uids.innerText = '';
      this.$refs.mails.innerText = '';
      let tr = event.target.parentNode.parentNode;
      this.$refs.uids.innerText = tr.getAttribute('uid');
      this.$refs.mails.innerText = tr.getAttribute('mail');
      this.$refs.resetPassword.show(`是否要重置${this.$refs.uids.innerText}的密码`);
    },
    del(event: any) {
      let uids: Array<string> = this.$refs.uids.innerText.split(',');
      let mails: Array<string> = this.$refs.mails.innerText.split(',');
      let users: Array<{ uid: string, mail: string }> = [];
      for (let index in uids) {
        let user = {uid: '', mail: ''};
        user.uid = uids[index];
        user.mail = mails[index];
        users.push(user);
      }
      let lis: Array<HTMLElement> = [];
      lis.push(event.target.parentNode.parentNode);
      this.delUser(users, lis);
    },
    reset() {
      let uids: Array<string> = this.$refs.uids.innerText.split(',');
      let mails: Array<string> = this.$refs.mails.innerText.split(',');
      let users: Array<{ uid: string, mail: string }> = [];
      for (let index in uids) {
        let user = {uid: '', mail: ''};
        user.uid = uids[index];
        user.mail = mails[index];
        users.push(user);
      }
      this.resetPassword(users);
    },
    //重置密码
    resetPassword(s: Array<{ uid: string, mail: string }>) {
      //发送请求
      console.log(s);
    },
    //删除账户
    delUser(s: Array<{ uid: string, mail: string }>, lis: Array<HTMLElement>) {
      //发送请求
      console.log(s);
      this.removeTr(lis);
    },
    removeTr(lis: Array<HTMLElement>) {
      for (let item of lis) {
        let tbody = item.parentNode;
        item.classList.add('tr-hide');
        setTimeout(() => {
          if (tbody) {
            tbody.removeChild(item);
          }
        }, 400);
      }

    },
    //修改邮箱
    changeMail(event: any) {
      let tr = event.target.parentNode.parentNode;
      this.$showModal({
        title: '修改' + tr.getAttribute('uid') + '邮箱'
      }).then((newMail: string) => {
        tr.getElementsByTagName('td')[3].innerText = newMail;
        tr.setAttribute('uid', newMail);
        //发送请求修改邮箱
      });
    },
    indexClick(event: any) {
      let elm: HTMLElement | null = event.target as HTMLElement;
      if (elm.nodeName != 'LI') {
        elm = elm.parentElement;
      }
      let index = elm?.getAttribute('index');
      this.pageIndex = index;
      this.setPageUsers();
    },
    pre(event: any) {
      let elm: HTMLElement | null = event.target as HTMLElement;
      if (elm.nodeName != 'LI') {
        elm = elm.parentElement;
      }
      if (elm?.classList.contains('disabled')) {
        return;
      }
      let items = document.getElementsByClassName('page-item');
      items[this.pageIndex].classList.remove('active');
      items[parseInt(this.pageIndex) - 1].classList.add('active');
      this.pageIndex--;
      this.setPageUsers();
    },
    next(event: any) {
      let elm: HTMLElement | null = event.target as HTMLElement;
      if (elm.nodeName != 'LI') {
        elm = elm.parentElement;
      }
      if (elm?.classList.contains('disabled')) {
        return;
      }
      let items = document.getElementsByClassName('page-item');
      console.log(items);
      console.log(this.pageIndex);
      items[this.pageIndex].classList.remove('active');
      items[parseInt(this.pageIndex) + 1].classList.add('active');
      this.pageIndex++;
      this.setPageUsers();
    },
    showLogoutPop() {
      this.$refs.logoutPop.show('确定要注销吗？');
    },
    logout() {
      window.localStorage.clear();
      this.$router.push('/');
    },
    goUpdateInf() {
      this.$router.push('/chat/user/updateInf/' + window.localStorage.getItem('uid'));
    },
    search(str: string) {
      //search
      axios({
        url: '/api/user/searchUsers',
        params: {
          uid: str
        }
      }).then(res => {
        this.pageIndex = 1;
        this.users = res.data.data;
        this.nums = Math.floor(this.users.length / this.pageNum);
        if (this.users.length % parseInt(this.pageNum) != 0) {
          this.nums++;
        }
        console.log(this.users);
        this.setPageUsers();
      });
    },
    back() {
      this.$router.push('/chat/user/' + window.localStorage.getItem('uid'));
    },
    searchKeyUp(event: any) {
      if (event.keyCode == 13) {
        //search
        let str = event.target.value as string;
        if (str == '') {
          this.getAllUsers();
          return;
        }
        this.search(str);
      }
    },
    showInf() {
      this.$refs.rightInf.style.height = '90px';
      let i: HTMLElement = this.$refs.i;
      i.classList.add('rotate');
    },
    hideInf() {
      this.$refs.rightInf.style.height = '0px';
      let i: HTMLElement = this.$refs.i;
      i.classList.remove('rotate');
    },
    isChecked(event: any) {
      if (event.target.checked) {
        this.selectAll();
      } else {
        this.cancelAll();
      }
    },
    selectAll() {
      this.$refs.bulkUids.innerText = '';
      this.$refs.bulkMails.innerText = '';
      let items = document.getElementsByClassName('checkItem') as any;
      for (let item of items) {
        let td = item.parentNode;
        let tr: HTMLElement = td?.parentNode as HTMLElement;
        if (tr) {
          this.$refs.bulkUids.innerText += tr.getAttribute('uid') + ',';
          this.$refs.bulkMails.innerText += tr.getAttribute('mail') + ',';
        }
        item.checked = true;
      }
    },
    cancelAll() {
      this.$refs.bulkUids.innerText = '';
      this.$refs.bulkMails.innerText = '';
      let items = document.getElementsByClassName('checkItem') as any;
      for (let item of items) {
        item.checked = false;
      }
    }
  },
  mounted() {
    setTimeout(() => {
      document.getElementsByClassName('top-hide')[0].classList.remove('top-hide');
      document.getElementsByClassName('container')[0].classList.remove('container-hide');
    }, 0);
    this.getAllUsers();
  }
})
export default class Admin extends Vue {
}
</script>

<style scoped lang="scss">
tr {
  transition: all 0.4s cubic-bezier(0.2, 0.25, 0.7, 0.75)
}

.tr-hide {
  transform: translateX(-100%);
  opacity: 0;
}

.operation {
  display: flex;
}

.resetAll {
  background-color: #265c6e;
  font-size: 14px;
  padding: 5px 15px;
  border: none;
  border-radius: 0.4rem;
  color: #fff;
  transition: all 0.4s cubic-bezier(0.2, 0.25, 0.7, 0.75)
}

.resetAll:hover, .del:hover {
  background-color: #267a91;
}

.delAll {
  @extend .resetAll;
  margin-left: 15px;
}

.btn {
  padding: 3px 15px;
  background-color: #ebebeb;
  border-radius: 0.4rem;
  box-shadow: 0 1px 3px 1px #c7c7c7;
  transition: all 0.4s cubic-bezier(0.2, 0.25, 0.7, 0.75);
}

.btn:hover {
  background-color: #d0cece;
}

.search {
  position: relative;
  margin-bottom: 10px;
  height: 30px;
  flex: 1
}

.search input {
  position: absolute;
  right: 0px;
  border-radius: 0.4rem;
  outline: none;
  height: 30px;
  font-size: 14px;
  padding: 15px 10px;
  border: 1px solid #31454c;
  width: 250px;
}

.search input:focus {
  border: 1px solid #2e7d9f;
}

.search .search-icon {
  position: absolute;
  right: 10px;
  top: 51%;
  font-size: 13px;
  transform: translateY(-50%);
  cursor: pointer;
}

td, th {
  color: #114B5F;
  text-align: center;
}

a {
  color: #26789f;
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
  transition: all 0.6s cubic-bezier(0.2, 0.25, 0.7, 0.75);
}

.container-hide {
  opacity: 0;
  transform: translate(-100%, -50%)
}

.right-container {
  position: relative;
  cursor: pointer;
  width: 120px;
  z-index: 3;
}


.rotate {
  transform: rotateZ(-180deg);
}

.right-inf {
  position: absolute;
  padding: 0;
  width: 100%;
  background-color: #114B5F;
  border-radius: 0.4rem;
  left: 0;
  top: 40px;
  transition: all 0.2s cubic-bezier(0.2, 0.45, 0.7, 0.75);
  overflow: hidden;
  height: 0;
  z-index: 3;
}

.right-inf li {
  padding: 10px;
  color: #7BA4A0;
  border-bottom: 1px solid #363636;
  transition: all 0.2s cubic-bezier(0.2, 0.45, 0.7, 0.75);
}

.right-inf li:hover {
  color: #25A5D0
}

.right-main {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.right-main img {
  margin-right: 10px;
  border-radius: 0.2rem;
}

.right-main .right-i {
  transition: all 0.6s cubic-bezier(0.2, 0.45, 0.7, 0.75);
}

.center-span, .right-i {
  color: #02000a;
  font-size: 18px;
}

.top, .chat-main {
  transition: all 0.6s cubic-bezier(0.2, 0.25, 0.7, 0.75);
}

.top-hide {
  opacity: 0;
  transform: translateY(-100%);
}

.bg {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: url("../assets/img/bg.png") no-repeat;
  background-size: cover;
}
</style>
