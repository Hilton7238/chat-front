<template>
  <div class="bg">
    <span ref="requestFriendImg" style="display: none"></span>
    <span ref="requestUid" style="display: none"></span>
    <span ref="requestName" style="display: none"></span>
    <PopWindow ref="delPopWindow" @confirm="confirmDel"></PopWindow>
    <PopWindow ref="addPopWindow" @confirm="confirmAdd"></PopWindow>
    <div class="request-pop">
      <!--      <div class="request-pop-item">-->
      <!--        <span>id:qwe1011,昵称为:hilton的朋友想添加你为好友，同意吗</span>-->
      <!--        <button class="request-pop-item-cancel">取&nbsp;&nbsp;消</button>-->
      <!--        <button class="request-pop-item-confirm">同&nbsp;&nbsp;意</button>-->
      <!--      </div>-->
    </div>
    <div class="menu" ref="menu" style="display: none">
      <ul>
        <li class="menu-top" @click="toTop" @mousedown="stopPropagation">置顶</li>
        <li class="menu-del" @click="del" @mousedown="stopPropagation">删除</li>
      </ul>
    </div>
    <Top class="top top-hide">
      <template #center>
        <span class="center-span">{{ user.name }}</span>
      </template>
      <template #right>
        <div class="right-container" ref="rightContainer" @mouseenter="showInf" @mouseleave="hideInf">
          <div class="right-main">
            <img :src="user.imgUrl" style="height: 35px;width:35px">
            <span class="right-i" ref="i">
            <i class="bi-arrow-down-circle"></i>
            </span>
          </div>
          <ul class="right-inf" ref="rightInf">
            <li v-if="userCode == 1" @click="this.$router.push('/chat/admin')">管理页面</li>
            <li @click="goUpdateInf">修改信息</li>
            <li @click="logout">注销退出</li>
          </ul>
        </div>
      </template>
    </Top>
    <div class="chat-main container chat-main-hide">
      <div class="users">
        <div class="search">
          <input ref="searchInput">
          <i class="bi-search search-icon"></i>
          <div class="search-inf">
            <ul>
              <li v-for="item in searchUsers" :name="item.name" :uid="item.uid" :imgUrl="item.imgUrl">
                <div class="search-inf-img">
                  <img :src="item.imgUrl">
                </div>
                <div class="search-inf-container">
                  <span class="search-inf-id">{{ item.uid }}</span>
                  <span class="search-inf-name">{{ item.name }}</span>
                </div>
                <i class="bi-plus-circle search-inf-add" @click="add" @mousedown="stopPropagation"></i>
                <div class="search-inf-line"></div>
              </li>
            </ul>
          </div>
        </div>
        <ul class="friends">
          <li v-for="item in friends" @mousedown="mouseDown" :name="item.name" :uid="item.uid" :imgUrl="item.imgUrl"
              class="friend">
             <span class="users-msg-num"
                   :style="{'display':item.nums && parseInt(item.nums) > 0?'flex':'none'}">{{ item.nums }}</span>
            <div class="users-img">
              <img :src="item.imgUrl">
            </div>
            <div class="users-inf">
              <div class="users-name">{{ item.name }}</div>
              <div class="users-text" v-html="item.lastMsg">
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="chat">
        <div class="chat-container chat-container-hide">
          <div class="chat-msg">
            <div v-for="item in messages">
              <p class="msg-from" v-if="item.from == user.uid">
                <img :src="user.imgUrl">
                <span class="msg" v-html="item.msg"></span>
                <span class="triangle"></span>
              </p>
              <p class="msg-to" v-if="item.from == el.getAttribute('uid')">
                <img :src="el.getAttribute('imgUrl')">
                <span class="msg" v-html="item.msg"></span>
                <span class="triangle"></span>
              </p>
            </div>
          </div>
          <div class="chat-send">
            <textarea ref="text" @keydown="textKeyDown" @keyup="textKeyUp"></textarea>
            <button class="send" ref="send" @click="sendMsg">发&nbsp;&nbsp;送</button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import Top from '@/components/Top.vue';
import PopWindow from '@/components/PopWindow.vue';
import throttle from '@/util/throttle';
import axios from 'axios';
import webSocketServe from '@/util/webSocketServe';

@Options({
  name: 'ChatView',
  components: {Top, PopWindow},
  data() {
    return {
      isSlide: false,
      el: null,
      ctrlKeyCode: null,
      msgLength: 0,
      friends: [],
      ws: null,
      user: {},
      messages: [],
      newMessageNode: [],
      searchUsers: [],
      userCode: 0
    };
  },
  methods: {
    goUpdateInf() {
      this.$router.push('/chat/user/updateInf/' + window.localStorage.getItem('uid'));
    },
    logout() {
      this.$router.push('/');
      window.localStorage.clear();
    },
    showInf() {
      if (this.userCode == 1) {
        this.$refs.rightInf.style.height = '135px';
      } else {
        this.$refs.rightInf.style.height = '90px';
      }
      let i: HTMLElement = this.$refs.i;
      i.classList.add('rotate');
    },
    hideInf() {

      this.$refs.rightInf.style.height = '0px';
      let i: HTMLElement = this.$refs.i;
      i.classList.remove('rotate');
    },
    //选中元素
    mouseDown(event: any) {
      event.stopPropagation();
      if (event.path[2].tagName != 'LI') {
        return;
      }
      if (this.el) {
        this.el.classList.remove('selected');
        let container = document.getElementsByClassName('chat-msg')[0];
        //移除新信息节点
        for (let item of this.newMessageNode) {
          container.removeChild(item);
        }
        this.newMessageNode = [];
      }
      //清空信息
      this.messages = [];
      let container = document.getElementsByClassName('chat-container')[0];
      let chatMsg = container.getElementsByClassName('chat-msg')[0];
      container.classList.remove('chat-container-hide');
      container.classList.add('chat-container-show');
      let li: HTMLElement = event.path[2] as HTMLElement;
      li.classList.add('selected');
      //更新未看信息数为0
      let spanNum = li.getElementsByClassName('users-msg-num')[0] as HTMLElement;
      if (spanNum.innerHTML != '0') {
        spanNum.innerHTML = '0';
        this.updateUnreadNumsToZero(li.getAttribute('uid'));
        spanNum.style.display = 'none';
      }
      //更新未看信息数为0
      this.el = li;
      this.getMessages(li.getAttribute('uid'));
      //保持在最底部
      setTimeout(() => {
        chatMsg.scrollTop = chatMsg.scrollHeight;
      }, 100);
      if (event.button == 2) {
        this.$refs.menu.style.left = event.pageX + 'px';
        this.$refs.menu.style.top = event.pageY + 'px';
        this.$refs.menu.style.display = 'block';
      } else if (event.button == 0) {
        this.$refs.menu.style.display = 'none';
        //置顶
        if (this.el.parentNode) {
          this.el.parentNode.prepend(this.el);
        }
      }
    },
    //置顶
    toTop(event: any) {
      event.stopPropagation();
      this.$refs.menu.style.display = 'none';
      let el: HTMLElement = this.el;
      if (el.parentNode) {
        el.parentNode.prepend(el);
      }
    },
    //删除按下提示方法
    del(event: any) {
      event.stopPropagation();
      this.$refs.menu.style.display = 'none';
      this.$refs.delPopWindow.show('你确定删除你的好友' + this.el.getAttribute('name') + '吗？');
    },
    //解决鼠标按下事件冒泡
    stopPropagation(event: Event) {
      event.stopPropagation();
    },
    confirmDel() {
      this.delUser();
    },
    confirmAdd() {
      this.addFriend();
    },
    //删除好友
    delUser() {
      let el: HTMLElement = this.el;
      //发送请求删除好友
      axios({
        url: 'api/user/deleteFriend',
        params: {
          uid: this.user.uid,
          friendUid: el.getAttribute('uid')
        }
      }).then(res => {
        el.classList.add('del');
        if (res.data.code == 200) {
          this.$popMsg({
            type: 'success',
            msg: '删除成功'
          });
          this.deleteMsgFromSQL(el.getAttribute('uid'));
          //this.delFriendFromFriends(el.getAttribute('uid'));
        } else if (res.data.code == 500) {
          this.$popMsg({
            type: 'error',
            msg: '删除失败,服务器异常'
          });
        } else if (res.data.code == 401) {
          console.log('验证失败');
        }
      });
      //数据库删除好友信息
      let container = document.getElementsByClassName('chat-container')[0];
      container.classList.remove('chat-container-show');
      container.classList.add('chat-container-hide');
      setTimeout(() => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
          this.el = null;
        }
      }, 200);
    },
    // delFriendFromFriends(uid: string) {
    //   for (let index in this.friends) {
    //     if (this.friends[index].uid == uid) {
    //       delete this.friends[index];
    //       return;
    //     }
    //   }
    // },
    deleteMsgFromSQL(uid: string) {
      const lastMsgTable = this.user.uid + '_last_message';
      const msgTable = this.user.uid + '_message';
      this.$db.transaction(function(tx: any) {
        tx.executeSql(`delete from "${msgTable}" where "to" = ?`, [uid], function(tx: any, e: any) {
          console.log(e);
        }, function(tx: any, e: any) {
          console.log(e);
        });
        tx.executeSql(`delete from "${msgTable}" where "from" = ?`, [uid], function(tx: any, e: any) {
          console.log(e);
        }, function(tx: any, e: any) {
          console.log(e);
        });
        tx.executeSql(`delete from ${lastMsgTable} where friend_uid = ?`, [uid]);
      });
    },
    textKeyDown(event: any) {
      if (event.keyCode == 17) {
        this.ctrlKeyCode = 17;
      } else if (this.ctrlKeyCode == 17 && event.keyCode == 13) {
        this.$refs.text.value += '\n';
      } else if (event.keyCode == 13) {
        event.preventDefault();
        this.$refs.send.style.color = '#25A5D0';
        this.sendMsg();
      }
    },
    textKeyUp(event: any) {
      if (event.keyCode == 17) {
        this.ctrlKeyCode = null;
      }
      this.$refs.send.style.color = '#7BA4A0';
    },
    sendMsg() {
      if (this.$refs.text.value == ' ' || this.$refs.text.value == '') {
        this.$popMsg({
          msg: '不能发送空信息',
          type: 'error'
        });
      } else {
        let str: string = this.$refs.text.value;
        str = str.replace(/\r\n/g, '<br>');
        str = str.replace(/\n/g, '<br>');
        this.el.getElementsByClassName('users-text')[0].innerHTML = str;
        //存入数据库
        this.insertMsgInSQL(this.user.uid, this.el.getAttribute('uid'), str);
        this.insertLastMsgInSQL(this.el.getAttribute('uid'), str, 0);
        //发送信息
        this.ws.send(JSON.stringify({
          to: this.el.getAttribute('uid'),
          msg: str,
          type: 'message',
          from: this.user.uid
        }));
        //创建标签
        this.createFromMsgTarget(str);
        this.$refs.text.value = '';
      }
    },
    //调整标签大小
    adjust() {
      let froms: any = document.getElementsByClassName('msg-from');
      for (let item of froms) {
        let msg = item.childNodes[1] as HTMLElement;
        if (msg.offsetHeight > 50) {
          item.style.height = msg.offsetHeight + 10 + 'px';
        }
      }
      let tos: any = document.getElementsByClassName('msg-from');
      for (let item of tos) {
        let msg = item.childNodes[1] as HTMLElement;
        if (msg.offsetHeight > 50) {
          item.style.height = msg.offsetHeight + 10 + 'px';
        }
      }
    },
    //添加好友点击方法
    add(event: any) {
      let e = event.target.parentNode;
      this.$refs.requestFriendImg.innerText = e.getAttribute('imgUrl');
      this.$refs.requestUid.innerText = e.getAttribute('uid');
      this.$refs.requestName.innerText = e.getAttribute('name');
      this.$refs.addPopWindow.show('你确定要添加uid:' + e.getAttribute('uid') + ' name:' + e.getAttribute('name') + '为好友吗？');
    },
    //添加好友方法
    addFriend() {
      //发请求添加好友
      let name = this.$refs.requestName.innerText;
      let uid = this.$refs.requestUid.innerText;
      let imgUrl = this.$refs.requestFriendImg.innerText;
      for (let item of this.friends) {
        if (item.uid == uid) {
          this.$popMsg({
            type: 'error',
            msg: `${name}已经是你的好友`
          });
          return;
        }
      }
      if (uid == this.user.uid) {
        this.$popMsg({
          type: 'error',
          msg: `不能添加自己为好友`
        });
        return;
      }
      this.$popMsg({
        msg: '请求已发出',
        type: 'success'
      });

      this.ws.send(JSON.stringify({
        type: 'friend_request',
        msg: this.user.name,
        from: this.user.uid + '?' + imgUrl,
        to: uid
      }));
    },
    //获取全部好友
    getFriends() {
      axios({
        url: 'api/user/getFriends',
        params: {
          uid: window.localStorage.getItem('uid')
        }
      }).then(res => {
        if (res.data.code == 401) {
          //token验证异常跳登录页
        } else if (res.data.code == 200) {
          this.friends = res.data.data.friends;
          let lastMsg: any = {};
          let that = this;
          const tableName = this.user.uid + '_last_message';
          this.$db.transaction(function(tx: any) {
            tx.executeSql(`select * from ${tableName}`, [], function(tx: any, res: any) {
              for (let item of res.rows) {
                lastMsg[item.friend_uid + 'Msg'] = item.msg;
                lastMsg[item.friend_uid + 'Nums'] = item.nums;
              }
              for (let friend of that.friends) {
                friend.lastMsg = lastMsg[friend.uid + 'Msg'] ? lastMsg[friend.uid + 'Msg'] : '';
                friend.nums = lastMsg[friend.uid + 'Nums'] ? lastMsg[friend.uid + 'Nums'] : 0;
              }
              //console.log(that.friends);
            });
          });
        }
      });
    },
    getUserInf() {
      axios({
        url: 'api/user/getUserInf',
        method: 'get',
        params: {
          uid: window.localStorage.getItem('uid')
        }
      }).then(res => {
        console.log(res.data);
        this.user = res.data.data.user;
        ;
      });
    },
    //发送信息创建节点
    createFromMsgTarget(msg: string) {
      let container = document.getElementsByClassName('chat-msg')[0];
      let div = document.createElement('div');
      let attr: string = container.getAttributeNames()[1];
      div.classList.add('msg-from-hide');
      div.setAttribute(attr, '');
      let p = document.createElement('p');
      p.classList.add('msg-from');
      p.setAttribute(attr, '');
      let img = document.createElement('img');
      img.setAttribute('src', this.user.imgUrl);
      img.setAttribute(attr, '');
      let span1 = document.createElement('span');
      span1.innerHTML = msg;
      span1.classList.add('msg');
      span1.setAttribute(attr, '');
      let span2 = document.createElement('span');
      span2.classList.add('triangle');
      span2.setAttribute(attr, '');
      p.appendChild(img);
      p.appendChild(span1);
      p.appendChild(span2);
      div.appendChild(p);
      container.appendChild(div);
      this.newMessageNode.push(div);
      setTimeout(() => {
        div.classList.remove('msg-from-hide');
        div.classList.add('msg-show');
      }, 10);
      if (span1.offsetHeight > 50) {
        p.style.height = span1.offsetHeight + 10 + 'px';
      }
      container.scrollTop = container.scrollHeight;
    },
    //收到信息创建节点
    createToMsgTarget(msg: string) {
      let container = document.getElementsByClassName('chat-msg')[0];
      let div = document.createElement('div');
      let attr: string = container.getAttributeNames()[1];
      div.classList.add('msg-from-hide');
      div.setAttribute(attr, '');
      let p = document.createElement('p');
      p.setAttribute(attr, '');
      p.classList.add('msg-to');
      let img = document.createElement('img');
      img.setAttribute('src', this.el.getAttribute('imgUrl'));
      img.setAttribute(attr, '');
      let span1 = document.createElement('span');
      span1.innerHTML = msg;
      span1.classList.add('msg');
      span1.setAttribute(attr, '');
      let span2 = document.createElement('span');
      span2.classList.add('triangle');
      span2.setAttribute(attr, '');
      p.appendChild(img);
      p.appendChild(span1);
      p.appendChild(span2);
      div.appendChild(p);
      this.newMessageNode.push(div);
      container.appendChild(div);
      setTimeout(() => {
        div.classList.remove('msg-to-hide');
        div.classList.add('msg-show');
      });
      if (span1.offsetHeight > 50) {
        p.style.height = span1.offsetHeight + 10 + 'px';
      }
      container.scrollTop = container.scrollHeight;
    },
    //创建本地数据库
    createDataBase() {
      const messageTable = window.localStorage.getItem('_uid') + '_message';
      const lastMessageTable = window.localStorage.getItem('_uid') + '_last_message';
      this.$db.transaction(function(tx: any) {
        tx.executeSql(`create table if not exists ${messageTable} ('from', 'to','msg', 'time')`);
        tx.executeSql(`create table if not exists ${lastMessageTable} ('friend_uid','msg','nums')`);
      });
    },
    //信息写入SQL
    insertMsgInSQL(from: string, to: string, msg: string) {
      const tableName = this.user.uid + '_message';
      const time = Date();
      this.$db.transaction(function(tx: any) {
        tx.executeSql(`insert into ${tableName} ("from","to","msg","time") values("${from}","${to}","${msg}","${time}")`);
      });
    },
    insertLastMsgInSQL(uid: string, msg: string, nums: number) {
      const tableName = this.user.uid + '_last_message';
      this.$db.transaction(function(tx: any) {
        tx.executeSql(`delete from '${tableName}' where friend_uid = ?`, [uid]);
        tx.executeSql(`insert into ${tableName} ("friend_uid","msg","nums") values(?,?,?)`, [uid, msg, nums]);
      });
    },
    //从SQL获取信息
    getMessages(to: String) {
      let that = this;
      let from = window.localStorage.getItem('_uid');
      const tableName = window.localStorage.getItem('_uid') + '_message';
      that.$db.transaction(function(tx: any) {
        tx.executeSql(`select * from ${tableName} where "from" = "${from}" and "to" = '${to}'`, [], function(tx: any, res: any) {
          for (let item of res.rows) {
            that.messages.push(item);
          }
          that.$db.transaction(function(tx: any) {
            tx.executeSql(`select * from ${tableName} where "from" = "${to}" and "to" = '${from}'`, [], function(tx: any, res: any) {
              for (let item of res.rows) {
                that.messages.push(item);
              }
              that.messages.sort((a: any, b: any) => {
                return Date.parse(a.time) - Date.parse(b.time);
              });
              that.$nextTick(() => {
                that.adjust();
              });
            });
          });
        });
      });
    },
    updateFriendMessage(msg: any, isOpen: boolean) {
      let friends = document.getElementsByClassName('friend');
      let nums = 0;
      for (let item of friends) {
        if (item.getAttribute('uid') == msg.from) {
          //好友列表更新为最新信息
          item.getElementsByClassName('users-text')[0].innerHTML = msg.msg;
          //置顶
          if (item.parentNode) {
            item.parentNode.prepend(item);
          }
          if (!isOpen) {
            //处理短信提示小圆点
            let spanNums = item.getElementsByClassName('users-msg-num')[0] as HTMLElement;
            if (spanNums.innerHTML == '') {
              nums = 1;
            } else {
              nums = parseInt(spanNums.innerHTML) + 1;
            }
            spanNums.innerHTML = nums.toString();
            spanNums.style.display = 'flex';
          }
          break;
        }
      }
      //存入数据库
      this.insertMsgInSQL(msg.from, window.localStorage.getItem('uid'), msg.msg);
      this.insertLastMsgInSQL(msg.from, msg.msg, nums);
    },
    updateUnreadNumsToZero(uid: string) {
      const tableName = this.user.uid + '_last_message';
      this.$db.transaction(function(tx: any) {
        tx.executeSql(`update ${tableName} set nums = ? where friend_uid = ?`, [0, uid]);
      });
    },
    createWebSocketConnect() {
      this.ws = webSocketServe('ws://127.0.0.1:7001/user/ws?uid=' + window.localStorage.getItem('uid') + '&token=' + window.localStorage.getItem('token')) as WebSocket;
      //建立连接
      this.ws.onopen = () => {
        console.log('connet with server');
      };
      //断开连接
      this.ws.onclose = (e: any) => {
        console.log('connect close' + ' ' + e.code + ' ' + e.reason);
        this.$popMsg({
          type: 'error',
          msg: '连接已断开'
        });
      };
      //收到信息
      this.ws.onmessage = (res: any) => {
        let msg = JSON.parse(res.data);
        let b: boolean = false;//判断是否打开相应朋友聊天界面 默认false为没打开
        if (msg.type == 'message') {
          //判断与相应朋友的聊天窗口是否打开
          if (this.el && msg.from == this.el.getAttribute('uid')) {
            this.createToMsgTarget(msg.msg);
            b = true;
          }
          this.updateFriendMessage(msg, b);
        } else if (msg.type == 'friend_request') {
          //添加好友请求
          this.createRequestItem(msg.from, msg.msg);
        } else if (msg.type == 'error') {
          this.$popMsg({
            type: 'error',
            msg: '连接已断开'
          });
        } else if (msg.type == 'friend_not_found') {
          this.$popMsg({
            type: 'error',
            msg: '对方貌似不是你的好友哦'
          });
        } else if (msg.type == 'friend_request_confirm') {
          //同意请求添加好友成功
          //发送请求添加数据库
          this.$popMsg({
            type: 'success',
            msg: `${msg.msg}已同意你的好友添加请求`
          });
          setTimeout(() => {
            this.getFriends();
          }, 100);

        }
      };
    },
    createRequestItem(uid: string, name: string) {
      //截取到? ?后面为图片路径
      let imgUrl = uid.substring(uid.indexOf('?') + 1); //图片路径
      uid = uid.substr(0, uid.indexOf('?'));
      let requestPop = document.getElementsByClassName('request-pop')[0];
      let str = requestPop.getAttributeNames()[1];
      let requestItem = document.createElement('div');
      requestItem.classList.add('request-pop-item');
      requestItem.classList.add('request-pop-item-hide');
      requestItem.setAttribute('uid', uid);
      let span = document.createElement('span');
      span.innerText = `id:${uid},昵称为:${name}的朋友想添加你为好友，同意吗`;
      let cancelButton = document.createElement('button');
      cancelButton.addEventListener('click', (event: any) => {
        let div = event.srcElement.parentNode as HTMLElement;
        div.classList.remove('request-pop-item-show');
        div.classList.add('request-pop-item-hide');
        setTimeout(() => {
          if (div.parentNode) {
            div.parentNode.removeChild(div);
          }
        }, 200);
      });
      cancelButton.classList.add('request-pop-item-cancel');
      cancelButton.innerText = '取  消';
      let confirmButton = document.createElement('button');
      confirmButton.addEventListener('click', (event: any) => {
        //同意请求
        let div = event.srcElement.parentNode;
        div.classList.remove('request-pop-item-show');
        div.classList.add('request-pop-item-hide');
        setTimeout(() => {
          if (div.parentNode) {
            div.parentNode.removeChild(div);
          }
        }, 200);
        //发送信息
        this.ws.send(JSON.stringify({
          type: 'friend_request_confirm',
          msg: name,
          from: this.user.uid,
          to: div.getAttribute('uid')
        }));
        //请求接口更新数据
        axios({
          url: 'api/user/addFriend',
          method: 'get',
          params: {
            uid: this.user.uid,
            friendUid: div.getAttribute('uid')
          }
        }).then(res => {
          if (res.data.code == 200) {
            this.$popMsg({
              type: 'success',
              msg: '添加成功'
            });
            this.getFriends();
          } else {
            this.$popMsg({
              type: 'error',
              msg: '添加失败，服务器异常',
            });
          }
        });
      });
      confirmButton.classList.add('request-pop-item-confirm');
      confirmButton.innerText = '同  意';
      requestItem.setAttribute(str, '');
      requestItem.setAttribute(str, '');
      cancelButton.setAttribute(str, '');
      confirmButton.setAttribute(str, '');
      requestItem.appendChild(span);
      requestItem.appendChild(cancelButton);
      requestItem.appendChild(confirmButton);
      requestPop.appendChild(requestItem);
      setTimeout(() => {
        requestItem.classList.remove('request-pop-item-hide');
        requestItem.classList.add('request-pop-item-show');
      }, 1);
    },
    heartCheck() {
      setInterval(() => {
        if (this.ws && this.ws.readyState == 1) {
          this.ws.send(JSON.stringify({
            type: 'heart',
            msg: 'check',
            from: this.user.uid,
            to: this.user.uid
          }));
        } else {
          this.createWebSocketConnect();
        }
      }, 1000 * 60);
    },
    //定时任务获取token是否过期
    checkToken() {
      setInterval(() => {
        axios({
          method: 'POST',
          url: '/api/authorizecenter/authorize?token=' + window.localStorage.getItem('token'),
        }).then(res => {
          console.log(res.data);
        });
      }, 110 * 60 * 1000);
    },
  },
  mounted() {
    document.oncontextmenu = function(e) {
      return false;
    };
    document.onmousedown = () => {
      //console.log('document mousedown');
      this.$refs.menu.style.display = 'none';
    };
    this.$refs.searchInput.oninput = throttle(() => {
      let str: string = this.$refs.searchInput.value;
      if (str.length > 25) {
        this.$refs.searchInput.value = str.substring(0, 25);
      }
      if (str != '') {
        axios({
          method: 'get',
          url: 'api/user/searchUsers',
          params: {
            uid: str
          }
        }).then(res => {
          this.searchUsers = res.data.data;
        });
      } else {
        this.searchUsers = [];
      }
    }, 100);
    this.getFriends();
    this.getUserInf();
    //创建数据库
    this.createDataBase();
    //创建websocket连接
    this.createWebSocketConnect();
    //心跳检测
    this.heartCheck();
    this.checkToken();
    setTimeout(() => {
      document.getElementsByClassName('top-hide')[0].classList.remove('top-hide');
      document.getElementsByClassName('chat-main-hide')[0].classList.remove('chat-main-hide');
    }, 10);
    this.userCode = window.localStorage.getItem('userCode');
  }
})
export default class ChatView extends Vue {
}
</script>

<style scoped lang="scss">
.request-pop {
  position: absolute;
  top: 10%;
  right: 10px;
  width: 450px;
  z-index: 5;
}

.request-pop-item-hide {
  transform: translateX(100%);
  opacity: 0;
}

.request-pop-item-show {
  transform: translateX(0);
  opacity: 1;
}

.request-pop-item:first-child {
  margin-top: 0;
}

.request-pop-item {
  background-color: #2e5c62;
  position: relative;
  margin-top: 20px;
  height: 120px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s cubic-bezier(0.2, 0.25, 0.7, 0.75);
  box-shadow: 0 2px 2px 2px rgba(116, 114, 114, 0.4);
  border-radius: 0.4rem;
  color: #fff;
}

.request-pop-item button {
  position: absolute;
  border: none;
  transition: all 0.4s cubic-bezier(0.2, 0.25, 0.7, 0.75);
  bottom: 3px;
  padding: 2px 5px;
  border-radius: 0.2rem;
  font-size: 14px;
  background-color: #32818d;
}

.request-pop-item button:hover {
  background-color: #149eb4;
}

.request-pop-item-cancel {
  left: 10px;
}

.request-pop-item-confirm {
  right: 10px;
}

.users-msg-num {
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  position: absolute;
  background-color: red;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #ffffff;
  font-size: 12px;
  transition: all 0.2s cubic-bezier(0.2, 0.35, 0.6, 0.75);
}

.users-msg-num-hide {
  transform: translateY(-50%) scale(0);
}

.search {
  padding: 5px 10px;
  height: 41px;
  position: relative;
  z-index: 5;
}

.search-icon {
  position: absolute;
  top: 50%;
  right: 20px;
  cursor: pointer;
  transform: translateY(-50%);
}

.search-inf {
  width: 100%;
  background-color: #d9d5d5;
  z-index: 3;
  border-radius: 0.4rem;
  margin-top: 2px;
  transition: all 0.2s cubic-bezier(0.4, 0.45, 0.7, 0.75);
}

.search-inf li {
  display: flex;
  position: relative;
  height: 48px !important;
  transition: all 0.2s cubic-bezier(0.4, 0.45, 0.7, 0.75);
}

.search-inf li:hover {
  background-color: #787b7c;
}

.search-inf-img {
  width: 15%;
  display: flex;
}

.search-inf-container {
  width: 75%
}

.search-inf-id {
  padding: 0px 8px;
  font-weight: 800;
  max-width: 100%;
  display: block;
  margin: 0 !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-inf-name {
  @extend .search-inf-id;
  font-weight: 500 !important;
  font-size: 14px;
  color: #302525;
}

.search-inf-line {
  width: 150px;
  height: 1px;
  background-color: #7696d1;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.search-inf-add {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.search-inf-img img {
  width: 100%;
  max-height: 48px;
  border-radius: 0.2rem;
}

input {
  padding: 2px 8px;
  outline: none;
  border: none;
  width: 100%;
  background-color: transparent;
  border: 1px solid #4a4545;
  border-radius: 0.4rem;
}

.msg-from-hide {
  transform: translateX(100%);
  opacity: 0;
}

.msg-to-hide {
  transform: translateX(-100%);
  opacity: 0;
}

.msg-show {
  opacity: 1;
  transform: translateX(0)
}

.chat-msg > div {
  margin-top: 30px;
  transition: all 0.2s cubic-bezier(0.4, 0.45, 0.7, 0.75);
}

.chat-msg > div:first-child {
  margin: 0;
}


.msg-from img, .msg-to img {
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 0.4rem;
}

.msg-from .msg, .msg-to .msg {
  position: absolute;
  padding: 8px;
  max-width: 40%;
  border-radius: 0.4rem;
  overflow: hidden;
  word-wrap: break-word;
}

.msg-from .msg {
  right: 65px;
  top: 5px;
  background-color: #33ad33;
}

.msg-to .msg {
  left: 65px;
  top: 5px;
  background-color: #a9a2a2;
}

.triangle {
  position: absolute
}

.msg-to .triangle {
  left: 45px;
  top: 13px;
  border-style: solid;
  border-color: transparent;
  border-width: 10px 10px 10px;
  border-right-color: #a9a2a2;
}

.msg-from .triangle {
  border-style: solid;
  border-color: transparent;
  border-width: 10px 10px 10px;
  border-left-color: #33ad33;
  right: 45px;
  top: 13px;
}

.msg-from, .msg-to {
  position: relative;
  height: 50px;
}

.msg-from img {
  top: 5px;
  right: 0px;
}

.msg-to img {
  top: 5px;
  left: 0px;
}

textarea {
  border: none;
  width: 100%;
  height: 100%;
  background-color: #edecec;
  outline: none;
  padding: 10px;
  resize: none;
}

.chat {
  overflow: hidden;
}

.chat-container {
  width: 100%;
  height: 100%;
  transition: all 0.2s cubic-bezier(0.4, 0.45, 0.7, 0.75);
}

.chat-container-hide {
  transform: translateX(100%);
}

.chat-container-show {
  transform: translateX(0);
}

.chat-msg {
  width: 100%;
  height: 80%;
  padding: 10px;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: #edecec;
  border-bottom: 20px solid #c9c6c6;
}

.chat-msg::-webkit-scrollbar {
  display: none;
}

textarea::-webkit-scrollbar {
  display: none;
}

.chat-send {
  position: relative;
  width: 100%;
  height: 20%;
  background-color: #edecec;
}

.send {
  position: absolute;
  bottom: 5px;
  right: 5px;
  font-size: 16px;
  color: #7BA4A0;
  background-color: #114B5F;
  border: none;
  padding: 10px;
  border-radius: 0.4rem;
  transition: all 0.2s cubic-bezier(0.4, 0.45, 0.7, 0.75);
}

.send:hover {
  color: #25A5D0;
}

.menu {
  position: absolute;
  width: 150px;
  z-index: 10;
}

.menu li {
  padding: 3px;
  font-size: 16px;
  border-radius: 0.2rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0.45, 0.7, 0.75);
}

.menu li:hover {
  color: #e2e3e2;
}

.menu-del {
  background-color: #b73636;
}

.menu-top {
  background-color: #4c4949;
  border-bottom: 1px solid #766f6f;
}

.users {
  display: block;
  width: 35%;
  background-color: rgba(241, 241, 241, 0.6);
  border-right: 1px solid gray;
}

.users ul {
  padding: 0 !important;
  width: 100%;
  z-index: 2;
}

.users li {
  display: flex;
  position: relative;
  width: 100%;
  height: 80px;
  padding-left: 10px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 0.6rem;
  transition: all 0.2s cubic-bezier(0.4, 0.45, 0.7, 0.75);
}

.selected {
  background-color: rgba(114, 113, 113, 0.6);
}

.del {
  transform: translateX(-100%);
  opacity: 0;
}

.users-img {
  width: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.users-inf {
  width: 85%;
  padding-top: 10px;
  padding-left: 10px;
  border-bottom: 1px solid #8b8787;
}

.users-img img {
  width: 100%;
  max-height: 60px;
  border-radius: 0.4rem;
  display: block;
}

.users-name {
  font-weight: 800;
  font-size: 20px;
}

.users-text {
  font-size: 16px;
  color: #545151;
  text-overflow: ellipsis; /* ellipsis:显示省略符号来代表被修剪的文本  string:使用给定的字符串来代表被修剪的文本*/
  white-space: nowrap; /* nowrap:规定段落中的文本不进行换行   */
  overflow: hidden; /*超出部分隐藏*/
}


.chat-main {
  display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
  height: 80%;
  transform: translate(-50%, -50%);
  border-radius: 0.4rem;
  padding: 0 !important;
}


.chat {
  width: 65%;
  border: none !important;
  @extend .users
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

.chat-main-hide {
  opacity: 0;
  transform: translate(-100%, -50%);
}

.bg {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: url("../assets/img/bg.png") no-repeat;
  background-size: cover;
}
</style>
