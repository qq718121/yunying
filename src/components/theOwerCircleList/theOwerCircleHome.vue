<template>
     <div class="theOwerCircleHome displayFlex flexColumn">
          <Subnav2 :navList="navList"></Subnav2>
          <audio id="qq_" src="/static/6005.mp3" autoplay controls="controls" v-show="false"></audio>
          <span v-if="this.userList[tokens].userName" style="margin-left:20px">{{`当前用户：${this.userList[tokens].userName}`}}</span>
          <div class="m-theOwerCircleHome displayFlex">
               <!-- <div class="g-theOwerCircleHome-userList" v-if="false">
                    <ul>
                         <li class="displayFlex flexAlignItemsCenter" v-for="(item,index) in userList" :key="index">
                              <span class="u-userImg"></span>
                              <span class="u-userName">{{item.name}}</span>
                         </li>
                    </ul>
                    <div class="u-moban"></div>
               </div> -->
               <div class="g-theOwerCircleHome-userHome" v-loading="tabLoading">
                    <div class="g-theOwerCircleHome-userHome-home">
                         <div class="u-moban"></div>
                         <div class="loadMore" v-if="isMore">
                              <span class="el-icon-loading"></span>
                         </div>
                         <div class="loadMore" v-else @click="moreHandler">
                              <span class="el-icon-more"></span>
                         </div>
                         <div class="historyMsg" v-for="(val,index) of historyData" :key="index">
                              <div class="historyMsgTime">{{val.createTime}}</div>
                              <div v-for="(item,index) of val.circleList" :key="index">
                                   <div class="clientMsgs clearfix">
                                        <div v-if="item.uid == userList[0].uid || item.uid == userList[1].uid|| item.uid == userList[2].uid" class='self'>
                                             <div class="bubble">
                                                  <div class="chatBubble" v-if="item.type == 1">
                                                       <div class="texts" v-html="item.message"></div>
                                                  </div>
                                                  <div class="chatBubble" v-else-if="item.type == 2">
                                                       <img :src="item.image" alt="">
                                                  </div>
                                                  <div class="chatBubble" v-else-if="item.type == 3">
                                                       <div class="xg-module">
                                                            <h2>{{item.conbutionData.propertyName}}</h2>
                                                            <h3>{{item.conbutionData.conbutionTitle}}</h3>
                                                            <p>{{item.conbutionData.conbutionDes}}</p>
                                                            <div class="xg-img">
                                                                 <span v-if="item.conbutionData.isVideo == 1"><img src="/static/icon_zanting_n@3x.png" alt=""></span>
                                                                 <img :src="item.conbutionData.conbutionImage" alt="">
                                                            </div>
                                                       </div>
                                                  </div>
                                                  <div class="chatBubble" v-else-if="item.type == 4">
                                                       <div class="imgLink displayFlex flexAlignItemsCenter">
                                                            <div class="imgLink_img">
                                                                 <img :src="item.propertyDetailData.shareImageUrl" alt="">
                                                            </div>
                                                            <div class="imgLink_text">
                                                                 <h2>{{item.propertyDetailData.shareTitle}}</h2>
                                                                 <p>{{item.propertyDetailData.shareDesc}}</p>
                                                            </div>
                                                       </div>
                                                  </div>
                                                  <div class="triangle"></div>
                                             </div>
                                             <div class="user">{{item.from+'-'+item.date}}</div>
                                        </div>
                                        <div v-else class="others clearfix">
                                             <div class="user">{{new Date(item.date*1).toLocaleString()}}-{{item.from}}</div>
                                             <div class="bubble">
                                                  <div class="chatBubble" v-if="item.type == 1">
                                                       <div class="texts" v-html="item.message"></div>
                                                  </div>
                                                  <div class="chatBubble" v-else-if="item.type == 2">
                                                       <img :src="item.image" alt="">
                                                  </div>
                                                  <div class="chatBubble" v-else-if="item.type == 3">
                                                       <div class="xg-module">
                                                            <h2>{{item.conbutionData.propertyName}}</h2>
                                                            <h3>{{item.conbutionData.conbutionTitle}}</h3>
                                                            <p>{{item.conbutionData.conbutionDes}}</p>
                                                            <div class="xg-img">
                                                                 <span v-if="item.conbutionData.isVideo == 1"><img src="/static/icon_zanting_n@3x.png" alt=""></span>
                                                                 <img :src="item.conbutionData.conbutionImage" alt="">
                                                            </div>
                                                       </div>
                                                  </div>
                                                  <div class="chatBubble" v-else-if="item.type == 4">
                                                       <div class="imgLink displayFlex flexAlignItemsCenter">
                                                            <div class="imgLink_img">
                                                                 <img :src="item.propertyDetailData.shareImageUrl" alt="">
                                                            </div>
                                                            <div class="imgLink_text">
                                                                 <h2>{{item.propertyDetailData.shareTitle}}</h2>
                                                                 <p>{{item.propertyDetailData.shareDesc}}</p>
                                                            </div>
                                                       </div>
                                                  </div>
                                                  <div class="triangle"></div>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                         <div v-for="(item,index) of msgs">
                              <div class="clientMsgs clearfix">
                                   <div v-if="item.token == userList[0].token || item.token == userList[1].token|| item.token == userList[2].token" class='self'>
                                        <div class="bubble">
                                             <div class="chatBubble" v-if="item.type == 1">
                                                  <div class="texts" v-html="item.message"></div>
                                             </div>
                                             <div class="chatBubble" v-else-if="item.type == 2">
                                                  <img :src="item.image" alt="">
                                             </div>
                                             <div class="chatBubble" v-else-if="item.type == 3">
                                                  <div class="xg-module">
                                                       <h2>{{item.conbutionData.propertyName}}</h2>
                                                       <h3>{{item.conbutionData.conbutionTitle}}</h3>
                                                       <p>{{item.conbutionData.conbutionDes}}</p>
                                                       <div class="xg-img">
                                                            <span v-if="item.conbutionData.isVideo == 1"><img src="/static/icon_zanting_n@3x.png" alt=""></span>
                                                            <img :src="item.conbutionData.conbutionImage" alt="">
                                                       </div>
                                                  </div>
                                             </div>
                                             <div class="chatBubble" v-else-if="item.type == 4">
                                                  <div class="imgLink displayFlex flexAlignItemsCenter">
                                                       <div class="imgLink_img">
                                                            <img :src="item.propertyDetailData.shareImageUrl" alt="">
                                                       </div>
                                                       <div class="imgLink_text">
                                                            <h2>{{item.propertyDetailData.shareTitle}}</h2>
                                                            <p>{{item.propertyDetailData.shareDesc}}</p>
                                                       </div>
                                                  </div>
                                             </div>
                                             <div class="triangle"></div>
                                        </div>
                                        <div class="user">{{item.from+'-'+item.date}}</div>
                                   </div>
                                   <div v-else class="others clearfix">
                                        <div class="user">{{item.date+'-'+item.from}}</div>
                                        <div class="bubble">
                                             <div class="chatBubble" v-if="item.type == 1">
                                                  <div class="texts" v-html="item.message"></div>
                                             </div>
                                             <div class="chatBubble" v-else-if="item.type == 2">
                                                  <img :src="item.image" alt="">
                                             </div>
                                             <div class="chatBubble" v-else-if="item.type == 3">
                                                  <div class="xg-module">
                                                       <h2>{{item.conbutionData.propertyName}}</h2>
                                                       <h3>{{item.conbutionData.conbutionTitle}}</h3>
                                                       <p>{{item.conbutionData.conbutionDes}}</p>
                                                       <div class="xg-img">
                                                            <span v-if="item.conbutionData.isVideo == 1"><img src="/static/icon_zanting_n@3x.png" alt=""></span>
                                                            <img :src="item.conbutionData.conbutionImage" alt="">
                                                       </div>
                                                  </div>
                                             </div>
                                             <div class="chatBubble" v-else-if="item.type == 4">
                                                  <div class="imgLink displayFlex flexAlignItemsCenter">
                                                       <div class="imgLink_img">
                                                            <img :src="item.propertyDetailData.shareImageUrl" alt="">
                                                       </div>
                                                       <div class="imgLink_text">
                                                            <h2>{{item.propertyDetailData.shareTitle}}</h2>
                                                            <p>{{item.propertyDetailData.shareDesc}}</p>
                                                       </div>
                                                  </div>
                                             </div>
                                             <div class="triangle"></div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
                    <div class="g-theOwerCircleHome-userHome-handle">
                         <div class="g-theOwerCircleHome-userHome-handle-top displayFlex flexJustifybetween flexAlignItemsCenter">
                              <transition name="fade">
                                   <!-- <ul class="emojiList">
                                        <li :id="`emjo${index}`" v-for="(item,index) in 132" :key="index" @click="emjoClick(`emjo${index}`,$event)"><img :src="`/static/img/QQ/${item}.gif`" alt=""></li>
                                   </ul> -->
                                   <div class="emoji-box" v-if="showEmoji">
                                        <el-button class="pop-close" :plain="true" type="danger" size="mini" icon="close" @click="showEmoji = false"></el-button>
                                        <vue-emoji @select="selectEmoji"></vue-emoji>
                                        <span class="pop-arrow arrow"></span>
                                   </div>

                              </transition>
                              <div class="u-icon-l displayFlex flexJustifyAround flexAlignItemsCenter">
                                   <span class="photo_ el-icon-more" @click="showEmoji = !showEmoji"></span>
                                   <div id="container">
                                        <span @click="imgUploader" id="upbtn" class="photo_ el-icon-picture"></span>
                                   </div>
                              </div>
                              <div class="u-icon-r displayFlex flexJustifyAround flexAlignItemsCenter">
                                   <div class="g-user-list" v-for="(item,index) in userList" :key="index" @click="userClick(index)">
                                        <div class="userImg">
                                             <img :src="item.userAvatar" alt="">
                                        </div>
                                        <span>{{item.userName}}</span>
                                   </div>
                              </div>
                         </div>
                         <div class="g-theOwerCircleHome-userHome-handle-input" @keyup.enter="send({data:msg,type:'1',tokens:'',cmid:3})">
                              <el-input placeholder="" v-model="msg" class="input-with-select">
                                   <el-button slot="append" @click="send(msg)">Enter</el-button>
                              </el-input>
                              <!-- <p contenteditable="true" @input="inutFunction" class="input_ input-with-select" id="input_conta" @keyup.enter="send(msg,'1')"></p> -->
                         </div>
                    </div>
               </div>
          </div>
     </div>
</template>

<script>
var moment = require("moment");
import Subnav2 from '../Subnav2/Subnav2'
import ImgUploader from '../Common/ImgUploader/ImgUploader'
import message from '../../common/message'
import uploader from '../../common/uploader.js'
import { getDAesString, desc } from '../../common/des.js'
import Chat from './chat_pb.js'
import vueEmoji from './emoji.vue'

export default {
     name: 'managers',
     components: {
          Subnav2,
          ImgUploader,
          vueEmoji
     },
     data() {
          return {
               userList: [
                    { userName: '' }
               ],
               tokens: 0,
               token: '',
               isMore: false,
               showEmoji: false,
               uploader: null,
               websock: null,
               image: '',
               pageSize: 20,
               tabLoading: true,
               moreNum: 0,
               lockReconnect: false,
               timer: null,
               timer2: null,
               msg: '',
               wsUrl: 'ws://192.168.1.243:9300/ws',
               preImgSrc: '',
               msgs: [],
               historyData: [],
               navList: [
                    { path: '/activity/theOwerCircleList', name: '业主圈管理' },
                    { path: '/activity/theOwerCircleList', name: '业主圈聊天室' }
               ],
               value: ''
          };
     },

     beforeRouteLeave(to, from, next) {
          // this.send('', '6');
          let sendObj = {
               data: '',
               type: '6',
               tokens: '',
               cmid: 5
          };
          this.send(sendObj);
          next();

     },

     watch: {
          'tokens': function (val, old) {
               let sendObj = {
                    data: '',
                    type: '6',
                    tokens: old,
                    cmid: 5
               };
               this.send(sendObj);
               setTimeout(() => {
                    let sendObj = {
                         data: '',
                         type: '5',
                         tokens: val,
                         cmid: 4
                    };
                    this.send(sendObj);
               }, 500)

          }
     },
     methods: {
          scrollHeight() {
               this.$nextTick(function () {

                    var scrollHeight = $('.g-theOwerCircleHome-userHome-home').prop("scrollHeight");
                    $('.g-theOwerCircleHome-userHome-home').scrollTop(scrollHeight, 2000);

               });
          },
          messages({ message = '', type = 'success' }) {
               this.$message({
                    message,
                    type
               });
          },
          selectEmoji(code) {
               this.showEmoji = false
               this.value += code
          },
          getUser() {

               let _this = this,
                    body = {};
               this.$http('/buildingOperate/getWaistcoatUser', { body }, {}, {}, 'post').then(res => {

                    if (res.data.code == 0) {
                         this.userList = res.data.response.list;
                         console.log(this.userList);

                         this.$nextTick(() => {
                              this.initWebSocket();
                         });
                    }

               }).catch(err => {
                    console.log(err)
               })

          },
          moreHandler(type) {
               this.isMore = true;
               let id = setTimeout(() => {
                    let _this = this,
                         url = '/buildingOperate/getHistoryCircleInfo',
                         body = {
                              buildingId: this.$route.query.buildingId,
                              pageNum: this.moreNum,
                              pageSize: this.pageSize
                         };
                    this.$http(url, { body }, {}, {}, 'post').then(res => {

                         if (res.data.code == 0) {
                              let i;
                              let list = res.data.response.list;
                              let len = list.length;
                              this.isMore = false;
                              if (!len && len <= 0) {

                                   let obj = {
                                        message: '无更多历史消息',
                                        type: 'warning'
                                   };
                                   this.messages(obj);
                                   return;

                              }
                              for (i = 0; i < len; i++) {
                                   this.historyData.unshift(res.data.response.list[i]);
                              }
                              this.moreNum += 1;
                         }
                         if (type == 'one') {
                              this.$nextTick(() => {
                                   this.scrollHeight();
                              });
                         }
                         clearTimeout(id);
                    }).catch(err => {
                         console.log(err)
                    })

               }, 1000);

          },
          protobufferDeserialization(bytes) {

               // 反序列化
               return Chat.SendMessageRequest.deserializeBinary(bytes);

          },

          protobufferSerialize(messages, tokens, cmid) {

               var message = new Chat.SendMessageRequest(); // 调用Person对象  实例化
               message.setFrom((this.userList[(tokens || tokens === 0) ? tokens : this.tokens].userId).toString());
               message.setText(this.msg);
               message.setTopic(messages);
               message.setAccesstoken(this.userList[(tokens || tokens === 0) ? tokens : this.tokens].token)
               message.setTo("all");

               // 序列化
               var bytes = message.serializeBinary();

               var len = bytes.byteLength + 20;
               var arrayBuffer = new ArrayBuffer(len);
               if (arrayBuffer.byteLength == len) {
                    var view = new DataView(arrayBuffer);
                    view.setInt32(0, 20);
                    view.setInt32(4, 200);
                    view.setInt32(8, cmid ? cmid : 3);
                    view.setInt32(12, 1);
                    view.setInt32(16, bytes.byteLength);
                    for (let i = 0; i < bytes.length; i++) {
                         view.setUint8(i + 20, bytes[i]);
                    }
               }
               return view.buffer;

          },

          send({ data, type = '1', tokens = '', cmid = 3 }) {

               // if ((data == 0 || data * 1 == 0) && type == 1) {
               //      this.$message({
               //           message: '发送消息不能为空(╯▔皿▔)╯大猪蹄子',
               //           type: 'warning'
               //      });
               //      $("#input_conta").html('');
               //      return;
               // }

               let keys = "yhgt!d%sd*aw%dSDSFSsa#mng~dsq";
               let obj = {

                    date: '',
                    type: type,
                    date: (new Date()).toLocaleString(),
                    avatar: '',
                    message: data,
                    image: this.image,
                    conbutionData: {
                         contributionId: '',
                         propertyName: this.$route.query.buildingName,
                         isVideo: '',
                         conbutionTitle: '',
                         conbutionDes: '',
                         conbutionDes: ''
                    },

                    propertyDetailData: {
                         propertyId: this.$route.query.buildingId,
                         shareTitle: '',
                         shareDesc: '',
                         shareImageUrl: ''
                    },

                    isSend: '1',
                    imageWidth: '',
                    imageHeight: '',
                    uid: this.userList[(tokens || tokens === 0) ? tokens : this.tokens].userId

               };

               let messages = desc(JSON.stringify(obj), keys);
               let msgs = this.protobufferSerialize(messages, tokens, cmid);
               this.websocketsend(msgs);
               this.msg = "";
               $("#input_conta").html('');

          },
          imgUpload(src) {

               return new Promise(resolve => {
                    let img = document.createElement('img');
                    img.onload = function () {
                         resolve();
                    }
                    img.src = src;
               });

          },
          autioPlay(t) {

               if (t != this.userList[0].token && t != this.userList[1].token && t != this.userList[2].token) {
                    $('#qq_').load();
               }

          },
          getMessage(ab) {
               if (ab.toLocaleString() != '[object ArrayBuffer]') {
                    let obj = {
                         message: '数据类型错误',
                         type: 'warning'
                    };
                    this.messages(obj);
                    return;
               }
               // let view = new DataView(ab);
               // console.log(view.getInt32(8), 12);
               let abs = ab.slice(20, ab.byteLength);
               let u8 = new Uint8Array(abs);
               let res = this.protobufferDeserialization(u8);
               let jsons = this.getDAesString(res);

               let obj = Object.assign({}, jsons, { token: res.getAccesstoken(), from: res.getFrom() });
               console.log(obj);
               if (obj.type == '5') {

                    let objs = {
                         message: `欢迎（${obj.from}）大猪蹄子进入房间__╰(*°▽°*)╯`,
                         type: 'success'
                    };
                    this.messages(objs);
                    return;

               } else if (obj.type == '6') {

                    let objs = {
                         message: `（${obj.from}）__离开了房间__┭┮﹏┭┮`,
                         type: 'success'
                    };
                    this.messages(objs);
                    return;

               }
               this.msgs.push(obj);
               if (obj.type == '2') {
                    this.imgUpload(obj.image).then(() => {
                         this.scrollHeight();
                    });
                    return;
               }

               this.scrollHeight();
               this.autioPlay(res.getAccesstoken());

          },
          getDAesString(res) {

               let keys = "yhgt!d%sd*aw%dSDSFSsa#mng~dsq";
               let data = getDAesString(res.getTopic(), keys);
               let jsons = JSON.parse(data);
               // console.log('截取消息体后反序列化二进制数组后得到数据text=' + res.getText());
               // console.log('解析JSON字符串', JSON.parse(data));
               return jsons;

          },
          uploaders(btn) {

               let _this = this;
               uploader(function (src) {

                    let sendObj = {
                         data: '',
                         type: '2',
                         tokens: '',
                         cmid: 3
                    };
                    _this.image = src;
                    _this.send(sendObj);

               }, function (key) {
                    console.log(key);
               }, function () {

               }, function (uploader) {
                    _this.uploader = uploader
               }, btn)

          },
          emjoClick(ids, e) {

               // if (e.target.nodeName == "IMG") {
               //      var choice = e.target;
               //      var cEle = choice.cloneNode(true);
               //      $("p#input_conta").append(cEle);
               //      this.showEmoji = false;
               //      this.inutFunction();
               // }

          },

          userClick(index) {
               this.tokens = index;
          },
          //开始上传
          imgUploader() {

               this.uploader.start();

          },

          // inutFunction() {

          //      this.msg = $("p#input_conta").html().replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/<div><br><\/div>/g, ' ').replace(/<br>/g, ' ');

          // },
          initWebSocket() { //初始化weosocket 

               if (!window.WebSocket) {
                    window.WebSocket = window.MozWebSocket;
               }
               if (window.WebSocket) {
                    this.websock = new WebSocket(this.wsUrl);
                    this.websock.binaryType = 'arraybuffer';
                    this.websock.onopen = this.websocketonopen;
                    this.websock.onerror = this.websocketonerror;
                    this.websock.onmessage = this.websocketonmessage;
                    this.websock.onclose = this.websocketclose;
               }

          },
          websocketonopen() {

               this.tabLoading = false;
               let obj = {
                    message: '已连接',
                    type: 'success'
               };
               this.messages(obj);
               this.moreHandler('one');
               let sendObj = {
                    data: '',
                    type: '5',
                    tokens: '',
                    cmid: 4
               };
               this.send(sendObj);

               // this.reset();
               // this.start();

          },
          websocketonerror(e) { //错误

               let obj = {
                    message: '房间连接断开，正在尝试重新链接',
                    type: 'warning'
               };
               this.messages(obj);

               this.tabLoading = true;
               this.reconnect(this.wsUrl);

          },
          websocketonmessage(e) { //数据接收 

               console.log('收到消息了');
               // this.reset();
               // this.start();
               this.getMessage(e.data);

          },

          websocketsend(agentData) {//数据发送

               this.websock.send(agentData);

          },

          websocketclose(e) { //关闭 

               let obj = {
                    message: '房间连接断开，正在尝试重新链接',
                    type: 'warning'
               };
               this.messages(obj);
               this.tabLoading = true;
               this.reconnect(this.wsUrl);

          },
          reconnect(url) {

               let this_ = this;
               if (this.lockReconnect) return;
               this.lockReconnect = true;
               setTimeout(function () {
                    this_.initWebSocket();
                    this_.lockReconnect = false;
               }, 2000);

          },
          //心跳检测
          reset() {

               clearTimeout(this.timer);
               clearTimeout(this.timer2);

          },
          start() {

               let this_ = this;
               this.timer = setTimeout(() => {
                    let sendObj = {
                         data: '',
                         type: '',
                         tokens: '',
                         cmid: 6
                    };
                    this.send(sendObj);
               }, 6000);

          }
     },

     created() {
          this.getUser();
     },
     mounted() {

          this.$store.dispatch('defaultIndexAction', '/activity/theOwerCircleList');
          this.uploaders();

     }
}
</script>

<style scoped>
.theOwerCircleHome {
      height: 100%;
}
.m-theOwerCircleHome {
      position: relative;
      height: 100%;
      padding-top: 10px;
}
.g-theOwerCircleHome-userList {
      position: relative;
      width: 400px;
      height: 500px;
}
.g-theOwerCircleHome-userList ul {
      padding: 20px 0;
      height: 100%;
      overflow: auto; /* winphone8和android4+ */
      -webkit-overflow-scrolling: touch; /* ios5+ */
}
.g-theOwerCircleHome-userList ul li {
      margin-top: 5px;
      height: 50px;
      line-height: 50px;
      -moz-box-shadow: 1px 1px 1px #d8d3d3;
      -webkit-box-shadow: 1px 1px 1px #d8d3d3;
      box-shadow: 1px 1px 1px #d8d7d3;
}
.g-theOwerCircleHome-userList ul li:hover {
      background: #47cbd4;
      cursor: pointer;
}
.g-theOwerCircleHome-userHome-handle-top span:hover,
.imgLink:hover,
.g-theOwerCircleHome-userHome-home .loadMore {
      cursor: pointer;
}
.g-theOwerCircleHome-userList ul li .u-userImg {
      margin-left: 5%;
      display: inline-block;
      width: 40px;
      height: 40px;
      border-radius: 40px;
}
.g-theOwerCircleHome-userList ul li .u-userName {
      margin-left: 20px;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      height: 100%;
      line-height: 50px;
}

.u-moban {
      position: absolute;
      top: 0;
      right: 0;
      background: #fff;
      width: 17px;
      height: 540px;
}
.g-theOwerCircleHome-userHome {
      position: relative;
      padding-bottom: 200px;
      margin-left: 20px;
      width: 80%;
}
.g-theOwerCircleHome-userHome-handle {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 200px;
      background: #000000;
      background: -moz-linear-gradient(bottom, #000000 0%, #ffffff 100%);
      background: -webkit-gradient(
            linear,
            left bottom,
            left top,
            color-stop(0%, #000000),
            color-stop(100%, #ffffff)
      );
      background: -webkit-linear-gradient(bottom, #000000 0%, #ffffff 100%);
      background: -o-linear-gradient(bottom, #000000 0%, #ffffff 100%);
      background: -ms-linear-gradient(bottom, #000000 0%, #ffffff 100%);
      background: linear-gradient(to top, #000000 0%, #ffffff 100%);
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#000000', endColorstr='#ffffff',GradientType=0 );
}
.g-theOwerCircleHome-userHome-home {
      /* padding-bottom: 200px; */
      height: 100%; /*写给不支持calc()的浏览器*/
      background: #000;
      color: #fff;
      overflow: auto; /* winphone8和android4+ */
      -webkit-overflow-scrolling: touch; /* ios5+ */
      border: 1px dotted #f1eaea;
      background: -moz-linear-gradient(bottom, #000000 0%, #5e5a5a 100%);
      background: -webkit-gradient(
            linear,
            left bottom,
            left top,
            color-stop(0%, #000000),
            color-stop(100%, #5e5a5a)
      );
      background: -webkit-linear-gradient(bottom, #000000 0%, #5e5a5a 100%);
      background: -o-linear-gradient(bottom, #000000 0%, #5e5a5a 100%);
      background: -ms-linear-gradient(bottom, #000000 0%, #5e5a5a 100%);
      background: linear-gradient(to top, #000000 0%, #5e5a5a 100%);
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#000000', endColorstr='#5e5a5a',GradientType=0 );
}
.g-theOwerCircleHome-userHome-home .historyMsg {
      position: relative;
      margin: 20px auto;
}
.g-theOwerCircleHome-userHome-home .historyMsg .historyMsgTime {
      width: 100%;
      text-align: center;
}
.g-theOwerCircleHome-userHome-home .loadMore {
      width: 100%;
      text-align: center;
      line-height: 30px;
}
.g-theOwerCircleHome-userHome-handle-top {
      padding: 0 25px;
      height: 60px;
}
.g-theOwerCircleHome-userHome-handle-top .g-user-list {
      display: inline-block;
      width: 50px;
      height: 50px;
}
.g-theOwerCircleHome-userHome-handle-top .g-user-list .userImg {
      display: inline-block;
      width: 50px;
      height: 50px;
      border-radius: 50px;
      overflow: hidden;
}
.g-theOwerCircleHome-userHome-handle-top .g-user-list img {
      width: 100%;
}
.g-theOwerCircleHome-userHome-handle-top .g-user-list span {
      color: #fff;
}
.g-theOwerCircleHome-userHome-handle-top .u-icon-l {
      width: 130px;
}
.g-theOwerCircleHome-userHome-handle-top .u-icon-l .photo_ {
      color: #fff;
      font-size: 50px;
}
.g-theOwerCircleHome-userHome-handle-top .u-icon-r {
      width: 200px;
}
.g-theOwerCircleHome-userHome-handle-input {
      width: 90%;
      margin: 30px auto 0;
      height: 80px;
}
.g-theOwerCircleHome-userHome-handle-input .input_ {
      width: 100%;
      height: 80px;
      background: #fff;
      border: none;
      overflow: auto; /* winphone8和android4+ */
      -webkit-overflow-scrolling: touch; /* ios5+ */
}
.clientMsgs {
      position: relative;
      color: #adb0b3;
      padding: 5px 0;
}
.clearfix:after {
      content: "";
      height: 0;
      line-height: 0;
      display: block;
      visibility: hidden;
      clear: both;
}

.clearfix {
      zoom: 1;
}

.online,
.offline {
      display: inline-block;
      height: 23px;
      padding-left: 10px;
      padding-right: 10px;
      border-radius: 3px;
      color: #999;
      text-align: center;
      line-height: 23px;
      background-color: rgb(209, 209, 209);
      font-size: 16px;
      box-sizing: border-box;
}
.sysTime {
      text-align: center;
      color: #999;
      font-size: 13px;
      margin-bottom: 3px;
}
.self {
      float: right;
      margin-right: 50px;
}
.others {
      float: left;
      margin-left: 50px;
}
.self .user {
      float: right;
      display: inline-block;
      margin-left: 10px;
}
.others .user {
      float: left;
      display: inline-block;
      margin-right: 10px;
}
.bubble {
      display: inline-block;
      position: relative;
      margin: 0 10px;
}
.chatBubble {
      margin-bottom: 30px;
      max-width: 300px;
      line-height: 15px;
      background-color: #fafbfc;
      font-size: 16px;
      color: rgb(99, 85, 85);
      border-radius: 10px;
      padding: 10px;
      color: rgb(56, 11, 11);
}
.chatBubble img {
      width: 100%;
}
.chatBubble .texts {
      line-height: 20px;
      word-wrap: break-word;
      overflow: hidden;
      overflow-wrap: break-word;
}
.chatBubble .texts img {
      width: 24px;
      height: 24px;
}
.xg-module h2 {
      line-height: 25px;
}
.xg-module h3 {
      line-height: 25px;
}
.xg-module p {
      line-height: 25px;
}
.self .triangle {
      position: absolute;
      right: -10px;
      top: 10px;
      border-left: 10px solid #fafbfc;
      border-bottom: 10px solid transparent;
}
.others .triangle {
      position: absolute;
      left: -10px;
      top: 10px;
      border-right: 10px solid #fafbfc;
      border-bottom: 10px solid transparent;
}
.imgLink {
      width: 300px;
      height: 100px;
      background: #f1eaea;
      border-radius: 10px;
}
.imgLink_img {
      margin-left: 20px;
      width: 70px;
      height: 70px;
      overflow: hidden;
}
.imgLink_img img {
      width: 100%;
      height: 100%;
}
.imgLink_text {
      width: 180px;
      overflow: hidden;
      margin-left: 20px;
}
.imgLink_text p,
.imgLink_text h2 {
      padding-right: 18px;
      line-height: 20px;
      color: #000;
}
.imgLink_text h2 {
      font-size: 18px;
      line-height: 30px;
}
.imgLink_text h2 {
      position: relative;
      line-height: 20px;
      overflow: hidden;
      max-height: 20px;
}
.imgLink_text h2::after {
      content: "...";
      position: absolute;
      bottom: 0;
      right: 1px;
      padding-left: 40px;
}
.imgLink_text p {
      position: relative;
      line-height: 20px;
      overflow: hidden;
      max-height: 40px;
}
.imgLink_text p::after {
      content: "...";
      position: absolute;
      bottom: 0;
      right: 15px;
      padding-left: 40px;
}
.fade-enter-active,
.fade-leave-active {
      transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
      opacity: 0;
}
.emojiList {
      width: 400px;
      height: 145px;
      position: absolute;
      left: 0;
      top: -155px;
      border: 1px solid #ccc;
      background-color: rgb(244, 248, 250);
      box-sizing: border-box;
      display: inline;
      padding: 0px;
      overflow: auto;
      /* winphone8和android4+ */
      -webkit-overflow-scrolling: touch; /* ios5+ */
}
.emojiList li {
      display: inline-block;
      margin: 0;
      cursor: pointer;
      width: 24px;
      height: 24px;
      box-sizing: border-box;
}
.emojiList li:hover {
      border: 1px solid #ccc;
}
.xg-img {
      position: relative;
}
.xg-img span {
      position: absolute;
      left: 50%;
      margin-left: -25px;
      top: 50%;
      margin-top: -25px;
      display: inline-block;
      width: 50px;
      height: 50px;
}
.xg-img span img {
      width: 100%;
}
</style>

<style>
.g-theOwerCircleHome-userHome-handle-input .el-button {
      width: 100%;
      margin-left: 0px !important;
}
.g-theOwerCircleHome-userHome-handle-input .el-input-group__append {
      margin-left: 10px;
      width: 100px;
      text-align: center;
      border: none;
      border-radius: 0;
}
.g-theOwerCircleHome-userHome-handle-input .el-input-group,
.g-theOwerCircleHome-userHome-handle-input .el-input__inner {
      border: none;
      border-radius: 0;
      height: 80px !important;
}
.displayFlex {
      display: -webkit-box;
      /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
      display: -moz-box;
      /* 老版本语法: Firefox (buggy) */
      display: -ms-flexbox;
      /* 混合版本语法: IE 10 */
      display: -webkit-flex;
      /* 新版本语法: Chrome 21+ */
      display: flex;
      /* 新版本语法: Opera 12.1, Firefox 22+ */
}

.flexColumn {
      -moz-box-orient: vertical;
      -moz-box-direction: normal;
      flex-direction: column;
      -webkit-flex-direction: column;
}

.flexRow {
      -moz-box-orient: horizontal;
      -moz-box-direction: normal;
      flex-direction: row;
      -webkit-flex-direction: row;
}

.flexWrap {
      -webkit-flex-wrap: wrap;
      -webkit-box-lines: multiple;
      -moz-flex-wrap: wrap;
      flex-wrap: wrap;
}

.flexNoWrap {
      -webkit-flex-wrap: nowrap;
      -webkit-box-lines: single;
      -moz-flex-wrap: nowrap;
      flex-wrap: nowrap;
}

.flexJustifybetween {
      -webkit-justify-content: space-between;
      justify-content: space-between;
      -moz-box-pack: space-between;
      -webkit--moz-box-pack: space-between;
      box-pack: space-between;
}

.flexJustifyAround {
      -webkit-justify-content: space-around;
      justify-content: space-around;
      -moz-box-pack: space-around;
      -webkit--moz-box-pack: space-around;
      box-pack: space-around;
}

.flexAlignItemsBetween {
      align-items: space-between;
      -webkit-align-items: space-between;
      box-align: space-between;
      -moz-box-align: space-between;
      -webkit-box-align: space-between;
}

.flexAlignJustifyCenter {
      -webkit-justify-content: center;
      justify-content: center;
      -moz-box-pack: center;
      -webkit--moz-box-pack: center;
      box-pack: center;
}

.flexAlignItemsCenter {
      align-items: center;
      -webkit-align-items: center;
      box-align: center;
      -moz-box-align: center;
      -webkit-box-align: center;
}

.flexNum {
      box-flex: 1;
      -webkit-box-flex: 1;
      -moz-box-flex: 1;
      flex: 1;
      -webkit-flex: 1;
}

.clearfix:after {
      content: "";
      height: 0;
      line-height: 0;
      display: block;
      visibility: hidden;
      clear: both;
}

.clearfix {
      zoom: 1;
}

.fl {
      float: left;
}

.fr {
      float: right;
}
</style>


<style lang="scss">
ul {
      margin: 0;
      padding: 0;
      list-style: none;
}

.iconfont {
      cursor: pointer;
      color: #f7ba2a;
}
.emoji-box {
      position: absolute;
      z-index: 10;
      left: 0;
      bottom: 200px;
      box-shadow: 0 4px 20px 1px rgba(0, 0, 0, 0.2);
      background: white;
      .el-button {
            position: absolute;
            border: none;
            color: #ff4949;
            right: 12px;
            top: 12px;
            z-index: 10;
      }
      .arrow {
            left: 10px;
      }
}

.comment {
      margin-top: 20px;
      .item {
            margin-top: 20px;
            padding: 10px;
            margin: 0;
            border-top: 1px solid #bfcbd9;
      }
}

.clearfix {
      &:after {
            content: "";
            display: block;
            height: 0;
            clear: both;
            visibility: hidden;
      }
}

.fade-enter-active,
.fade-leave-active {
      transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-active {
      opacity: 0;
}
.fade-move {
      transition: transform 0.4s;
}

.list-enter-active,
.list-leave-active {
      transition: all 0.5s;
}
.list-enter,
.list-leave-active {
      opacity: 0;
      transform: translateX(30px);
}
.list-leave-active {
      position: absolute !important;
}
.list-move {
      transition: all 0.5s;
}
</style>
