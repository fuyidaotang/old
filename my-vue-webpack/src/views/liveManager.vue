<template>
    <div class="liveManager">
        <div class="mainContent">
            <h1 class="comm_title">直播管理</h1>
            <audio :src="message_vol" style="display:none" id="messageAudio"></audio>
            <audio :src="order_vol" style="display:none" id="orderAudio"></audio>
            <div class="live_window">
                <div class="model"></div>
                <div class="content">
                    <div class="fl">
                        <div class="show_area">
                            <div class="top">
                                <div class="part_1">
                                    <img class="fl" :src="userInfo.headPic" alt="">
                                    <span class="fl name">{{userInfo.userName}}</span>
                                    <div class="fr"><span class="red">{{userInfo.audiences}}</span><span>人在看</span></div>
                                </div>
                                <div class="part_2">
                                    <div class="fl">
                                        <span class="bold">{{userInfo.userFocus}}</span><br>
                                        <span>关注</span>
                                    </div>
                                    <div class="fl">
                                        <span class="bold">{{userInfo.userFans}}</span><br>
                                        <span>粉丝</span>
                                    </div>
                                </div>
                            </div>
                            <div class="middle">
                                <section v-for="(item,index) in liveInfo" @click="changeVideo(item.rtmpPlayUrl,index)" :class="{'active':index == currentIndex}">
                                    <span>{{item.cameraName || '手机直播'}}</span>
                                </section>
                            </div>
                            <div class="footer">
                                <img src="../images/position.png" alt="">
                                <span>{{userInfo.address}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="videoContainer">
                        <div class="poster" v-if="!liveInfo">直播未开启</div>
                        <div class="no_flash" v-if="noFlash">您需要安装Flash Player后才能观看精彩直播～<br>
                            请您<a target="_blank" href="http://www.adobe.com/go/getflashplayer_cn">安装</a>后刷新本页面</div>
                        <video id="videoPlayer" autoplay class="video-js vjs-default-skin" v-if="liveInfo" v-initVideo>
                            <source :src="liveInfo[0].rtmpPlayUrl" type="rtmp/flv">
                            <!--<source src="rtmp://push1.hongdoujiao.tv/live/206827-0-4291?token=TXJjcXhrQmNBWnNNYjlqUjdFUlFJWVJmeFVUYkxmb3FVa205NTAxR2hncz0=" type="rtmp/flv">-->
                        </video>
                    </div>
                    <div class="fr">
                        <div class="show_area">
                            <span class="top" @click.stop="getAdminList()">管理员/禁言列表</span>
                            <div class="no_scroll">
                                <div class="chatArea" id="chatContainer">
                                    <div class="chat_wrap">
                                        <p class="message" v-for="item in messageList">
                                            <span :style="{color: item.usernameColor}"
                                                 v-show="item.username">{{item.username}}:
                                            </span>
                                            <span :style="{color:item.color}">{{item.content}}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="editArea">
                                <input type="text" placeholder="说点什么吧" v-model="message" @keyup.enter="sendMessageHandle()">
                                <button @click="sendMessageHandle()">发送</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="ceng" v-if="adminBoxShow"></div>
        <div class="admin_list" v-if="adminBoxShow">
            <p class="admin_header">管理员/禁言列表 <img @click.stop="adminBoxShow=false" src="../images/close1.png" alt=""></p>
            <div class="admin_content">
                <div class="admin_nav">
                    <div :class="{ 'action': navAction }" @click.stop="navAction=!navAction">管理员列表 <span v-if="navAction"></span></div>
                    <div :class="{ 'action': !navAction }" @click.stop="getRrportList">禁言列表 <span v-if="!navAction"></span></div>
                </div>
                <ul class="admins" v-show="navAction">
                    <li v-for="(list,index) in adminList">
                        <img class="head_img" :src="list.headPic" alt="">
                        <span class="username" v-text="list.userName"></span>
                        <img v-if="list.sex==1" src="../images/girl.png" alt="" class="sexy">
                        <img v-else src="../images/boy@.png" alt=""  class="sexy">
                        <span class="level" v-text="list.authLevel"></span>
                        <button class="btn" @click.stop="cancelAdmin(list.userId,index)">取消管理</button>
                    </li>
                </ul>
                <ul class="reports" v-show="!navAction">
                    <li v-for="(list,index) in reportList">
                        <img class="head_img" :src="list.headPic" alt="">
                        <span class="username" v-text="list.userName"></span>
                        <img v-if="list.sex==1" src="../images/girl.png" alt="" class="sexy">
                        <img v-else src="../images/boy@.png" alt=""  class="sexy">
                        <span class="level" v-text="list.authLevel"></span>
                        <button class="btn" @click.stop="cancelReport(list.userId,index)">取消禁言</button>
                    </li>
                </ul>
                <paginate
                        v-if="paginateType"
                        :page-count="20"
                        :click-handler="getMoreReport"
                        :prev-text="'上一页'"
                        :next-text="'下一页'"
                        :container-class="'paginate_box'">
                </paginate>

            </div>
        </div>
        <div v-show="showAdminSmall" :style="style" class="admin-box">
            <p class="set_title">管理 <img @click="hideSmall" src="../images/close1.png" alt=""></p>
            <p class="title">请选择您要进行的操作</p>
            <input type="radio" name="admin" class="set_admin" value="set_admin" v-model="setType" id="set_admin"><label for="set_admin">设为管理</label>
            <input type="radio" name="admin" class="set_report" value="set_report" v-model="setType" id="set_report"><label for="set_report">举报</label>
            <input type="radio" name="admin" class="set_speak" value="set_speak" v-model="setType" id="set_speak"><label for="set_speak">禁言</label>
            <button class="btn" @click="subSet">确定</button>
        </div>
    </div>
</template>
<script>
    import Paginate from 'vuejs-paginate'
    import * as Ps from 'perfect-scrollbar';
    import 'perfect-scrollbar/dist/css/perfect-scrollbar.min.css'
    var videojs = require('video.js');
    videojs.options.flash.swf = require('../video-js.swf')
    require('videojs-flash');
    require('video.js/dist/video-js.min.css')
    export default {
      data(){
        return {
          noFlash:false,
          setType:'set_admin',
          showAdminSmall:false,
          showAdminBig:false,
          liveInfo: false,
          videoObj: {},
          userInfo: {},
          message_vol: require('../audios/message.mp3'),
          order_vol: require('../audios/order.mp3'),
          spaceInfo: JSON.parse(sessionStorage.getItem('userInfo')),
          currentIndex: 0,
          message: '',
          messageList:[{
              usernameColor: '#f0df1c',
              color: '#09d8da',
              username: '',
              content: '直播消息： 我们提倡绿色直播，封面和直播内容含吸烟、低俗、引诱、暴露等都将会被封停账号，网警24小时在线巡查。'
            }],
          token: '',
          style:{
              left:'',
              top:''
          },
          adminId:'',
          adminContent:'',
          adminBoxShow:false,
          navAction:true,
          adminList:[],
          reportList:[],
          paginateType:false
        }
      },
      mounted(){
        this.$nextTick(function(){
          const container = document.querySelector('#chatContainer');
          Ps.initialize(container);
          let fls = this.flashChecker();
          let s = "";
          if(!fls.f) {
            this.noFlash=true;
          }else{
            this.noFlash=false;
          }
        })
      },
      methods: {
        /*判断是否已经安装flash*/
        flashChecker() {
          var hasFlash = 0;　　　　 //是否安装了flash
          var flashVersion = 0;　　 //flash版本

          if(document.all) {
            var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
            if(swf) {
              hasFlash = 1;
              VSwf = swf.GetVariable("$version");
              flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
            }
          } else {
            if(navigator.plugins && navigator.plugins.length > 0) {
              var swf = navigator.plugins["Shockwave Flash"];
              if(swf) {
                hasFlash = 1;
                var words = swf.description.split(" ");
                for(var i = 0; i < words.length; ++i) {
                  if(isNaN(parseInt(words[i]))) continue;
                  flashVersion = parseInt(words[i]);
                }
              }
            }
          }
          return { f: hasFlash, v: flashVersion };
        },
        subSet(){
          if(this.setType=='set_admin'){
            this.setAdmin();
          }else if(this.setType=='set_report'){
            this.setReport();
          }else{
            this.noSpeak();
          }
        },
        cancelReport(id,index){
              let self=this;
              console.log(id,index)
              axios({
                  method: 'post',
                  url: '/tvshop/live/setRoomBan',
                  params:{
                      toUserId:id,
                      type:0
                  }
              }).then(function(res){
                  self.$store.commit("setToast", res.data.msg);
                  self.reportList.splice(index,1)
              })
          },
        cancelAdmin(id,index){
              let self=this;
              console.log(id,index)
              axios({
                  method: 'post',
                  url: '/tvshop/live/setRoomManager',
                  params:{
                      toUserId:id,
                      type:0
                  }
              }).then(function(res){
                  self.$store.commit("setToast", res.data.msg);
                  self.adminList.splice(index,1);

              })
          },
        getMoreReport(pageNum){
            let self=this;
            axios({
                method: 'get',
                url: '/tvshop/live/roomBanList',
                params:{
                    pageIndex:pageNum,
                    pageSize:5
                }
            }).then(function(res){
                if(res.data.code!=20000){
                    self.$store.commit("setToast", res.data.msg);
                }else{
                    if(res.data.resp.banList.objectList.length>0){
                        for(let i=0;i<res.data.resp.banList.objectList.length;i++){
                            self.reportList.push(res.data.resp.banList.objectList[i])
                        }
                    }
                }
            })
        },
        getRrportList(){
            let self=this;
            self.navAction=!self.navAction;
            axios({
                method: 'get',
                url: '/tvshop/live/roomBanList',
                params:{
                    pageIndex:1,
                    pageSize:5
                }
            }).then(function(res){
                if(res.data.code!=20000){
                    self.$store.commit("setToast", res.data.msg);
                }else{
                    if(res.data.resp.banList.pagination<2){
                        self.paginateType=false;
                    }
                    self.reportList=res.data.resp.banList.objectList;
                }
            })
        },
        getAdminList(){
              let self=this;
              axios({
                  method: 'get',
                  url: '/tvshop/live/roomManagerList',
              }).then(function(res){
                  console.log(res.data)
                  if(res.data.code!=20000){
                      self.$store.commit("setToast", res.data.msg);
                  }else{
                        self.adminBoxShow=true;
                        self.adminList=res.data.resp.managerList
                  }
              })
          },
        setAdmin(){
            let self=this;
            axios({
                method: 'post',
                url: '/tvshop/live/setRoomManager',
                params:{
                    toUserId:self.adminId,
                    type:1
                }
            }).then(function(res){
                self.$store.commit("setToast", res.data.msg);
                self.showAdminSmall=false;
            })
        },
        setReport(content){
            let self=this;
            axios({
                method: 'post',
                url: '/tvshop/live/report',
                params:{
                    toUserId:self.adminId,
                    msg:self.adminContent
                }
            }).then(function(res){
                self.$store.commit("setToast", res.data.msg);
                self.showAdminSmall=false;
                self.set_admin='set_admin';
            })
        },
        noSpeak(id){
            let self=this;
            axios({
                method: 'post',
                url: '/tvshop/live/setRoomBan',
                params:{
                    toUserId:self.adminId,
                    type:1
                }
            }).then(function(res){
                self.$store.commit("setToast", res.data.msg);
                self.showAdminSmall=false;
                self.set_admin='set_admin';
            })
        },
        hideSmall() {
            this.showAdminSmall=false;
            this.set_admin='set_admin';
          },
        admin(e,id,content) {
            this.adminId=id;
            this.adminContent=content;
            this.showAdminSmall=true;
          },
        ryConnect: function () {
          var _this = this
          var successCallback = function (userId) {
            _this.joinChartRoom()
          }
          var tokenIncorrectCallback = function () {
            console.log('token无效')
          }
          var errorCallBack = function (errorCode) {
            var info = ''
            switch (errorCode) {
              case RongIMLib.ErrorCode.TIMEOUT:
                info = '超时'
                console.log('连接超时,正在重新连接')
                break
              case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                info = '未知错误'
                break
              case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                info = '不可接受的协议版本'
                break
              case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                info = 'appkey不正确'
                break
              case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                info = '服务器不可用'
                break
            }
            console.log(info)
          }
          RongIMClient.connect(_this.token, {
            onSuccess: successCallback,
            onTokenIncorrect: tokenIncorrectCallback,
            onError: errorCallBack
          })
        },
        changeVideo: function (url,index) {
          this.currentIndex = index
          this.videoObj.src(url)
          this.videoObj.play()
        },
        joinChartRoom: function () {
          var _this = this
          var count = 0
          var successCallback = function () {
            // 加入聊天室成功。
            console.log('加入聊天室')
            _this.sendMessage(_this.spaceInfo.username + ' 进入直播间', 11, _this.spaceInfo.userId, false, _this.spaceInfo.spaceId)
          }
          var errorCallback = function (error) {
            // 加入聊天室失败
            RongIMClient.getInstance().joinChatRoom(_this.spaceInfo.spaceId + '', count, {
              onSuccess: successCallback,
              onError: errorCallback
            })
            console.log('正在重新加入')
            console.log(error)
          }
          RongIMClient.getInstance().joinChatRoom(_this.spaceInfo.spaceId + '', count, {
            onSuccess: successCallback,
            onError: errorCallback
          })
        },
        // 初始化融云
        initRY: function () {
        var _this = this
        // 设置自定义消息,创建普通消息
        RongIMClient.RegisterMessage.HDJCommonMessage = function (message) {
        this.messageName = 'HDJCommonMessage'
      }
      RongIMClient.registerMessageType('HDJCommonMessage', 'HDJCommonMessage', new RongIMLib.MessageTag(true, true), ['extra', 'content', 'user'])
    // 连接状态监听器
    RongIMClient.setConnectionStatusListener({
      onChanged: function (status) {
        var mesg = ''
        switch (status) {
          case RongIMLib.ConnectionStatus.CONNECTED:
            mesg = '连接成功'
            _this.isInChatroom = true
            break
          case RongIMLib.ConnectionStatus.CONNECTING:
            _this.isInChatroom = false
            mesg = '正在连接'
            break
          case RongIMLib.ConnectionStatus.DISCONNECTED:
            _this.isInChatroom = false
            mesg = '断开连接'
            break
          case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
            mesg = '其他设备登录'
            break
          case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
            _this.isInChatroom = false
            mesg = '域名不正确'
            break
          case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
            mesg = '网络不可用'
            break
        }
        console.log(mesg)
        if (mesg === '') return
      }
    })
    // 消息监听器
    RongIMClient.setOnReceiveMessageListener({
      // 接收到的消息
      onReceived: function (message) {
        console.log(message)
        // 判断消息类型
        switch (message.objectName) {
          case 'HDJSystemMessage':
            // 自定义系统消息
            if (message.content.message.content.extra === '12') {
              _this.getMessage(message.content.message.content)
              return
            }
            _this.messageList.push(_this.getMessage(message.content.message.content))
            _this.goBottom()
            break
          case 'HDJCommonMessage':
            // 自定义普通消息
            if (message.content.extra === '12') {
              _this.getMessage(message.content)
              return
            }
            _this.messageList.push(_this.getMessage(message.content))
            _this.goBottom()
            break
          default:
            console.log('异常错误')
        }
      }
    })
    },
    // 处理收到的消息
        getMessage: function (content) {
          var _this = this
          var extra = content.extra
          var showMessage = {}
          content.content = content.content.split('&hdj&')[0]
          switch (parseInt(extra)) {
            case 10:
              console.log(_this.getMessage())
              showMessage.usernameColor = '#f0df1c'
              showMessage.color = '#ffffff'
              showMessage.username = content.user.name
              showMessage.content = content.content
              showMessage.userId = content.user.id
              $('#messageAudio')[0].play()
              break
            // 进入房间消息
            case 11:
              showMessage.usernameColor = '#ffffff'
              showMessage.color = '#ffffff'
              showMessage.content = content.content
              showMessage.userId = content.user.id
              _this.userInfo.audiences ++
              break
            // 退出房间消息
            case 12:
              // 此处移除观众
              _this.userInfo.audiences --
              break
            case 20:
              showMessage.color = '#fb4575'
              showMessage.username = ''
              showMessage.content = content.content
              showMessage.userId = content.user.id
              break
            case 21:
              showMessage.color = '#09d8da'
              showMessage.username = ''
              showMessage.content = content.content
              showMessage.userId = content.user.id
              break
            case 22:
              showMessage.usernameColor = '#f0df1c'
              showMessage.color = '#208dff'
              showMessage.username = content.user.name
              showMessage.content = content.content
              showMessage.userId = content.user.id
              $('#messageAudio')[0].play()
              break
            // 礼物
            case 23:
              showMessage.color = '#9ee425'
              showMessage.username = ''
              showMessage.content = content.content
              showMessage.userId = content.user.id
              $('#messageAudio')[0].play()
              break
            // 订单
            case 24:
              showMessage.color = '#f3a12d'
              showMessage.username = ''
              showMessage.content = content.content
              showMessage.userId = content.user.id
              $('#orderAudio')[0].play()
              break
            case 25:
              showMessage.color = '#feffa5'
              showMessage.username = ''
              showMessage.userId = content.user.id
              showMessage.content = content.content
              break
            case 26:
              showMessage.usernameColor = '#f0df1c'
              showMessage.color = '#dcffa6'
              showMessage.username = content.user.name
              showMessage.userId = content.user.id
              showMessage.content = content.content
              break
            case 27:
              alert('直播已结束')
              location.reload()
              break
            // 直播结束
            case 99:
              alert('直播已结束')
              location.reload()
              break
            default:
              showMessage.usernameColor = '#fff'
              showMessage.color = '#ffffff'
              showMessage.userId = content.user.id
              showMessage.username = content.user.name
              showMessage.content = content.content
              break
          }
          return showMessage
        },
        // 点击发送的事件句柄
        sendMessageHandle: function () {
          var content = this.message
          this.message = ''
            if(content!==''){
                this.sendMessage(content, 22, this.spaceInfo.userId, this.userInfo.userName, this.spaceInfo.spaceId)
            }else{
                this.$store.commit("setToast", "不能发送空信息!");
            }
        },
        // 发送消息
        sendMessage: function (ms, extra, id, username, chatroomId) {
          var _this = this
          var MESSAGE = {
            'content': ms,
            'extra': extra + '',
            'user': {
              'icon': this.userInfo.headPic || 'http://upload.hongdoujiao.com/xiaotao/thum//user/userdefault.jpg',
              'id': id + '',
              'name': !username ? '红豆角' : username
            }
          }
          var msg = new RongIMClient.RegisterMessage.HDJCommonMessage(MESSAGE)
          var conversationtype = RongIMLib.ConversationType.CHATROOM // 聊天室
          var targetId = chatroomId + '' // 目标 Id
          RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
            onSuccess: function (message) {
              if (message.content.extra === '25') {
                _this.messageList.push({
                  'color': '#feffa5',
                  'username': '',
                  'content': ms,
                    'id':id
                })
              } else if(message.content.extra === '11') {
                _this.messageList.push({
                  'color': '#fff',
                  'username': '',
                  'content': ms,
                  'id':id
                })
              } else {
                // message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
                _this.messageList.push({
                  'color': '#208dff',
                  'username': username,
                  'usernameColor': '#f0df1c',
                  'content': ms,
                    'id':id
                })
              }
              _this.goBottom()
            },
            onError: function (errorCode, message) {
              var info = ''
              switch (errorCode) {
                case RongIMLib.ErrorCode.TIMEOUT:
                  info = '超时'
                  break
                case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                  info = '未知错误'
                  break
                case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                  info = '在黑名单中，无法向对方发送消息'
                  break
                case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                  info = '不在讨论组中'
                  break
                case RongIMLib.ErrorCode.NOT_IN_GROUP:
                  info = '不在群组中'
                  break
                case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                  info = '不在聊天室中'
                  break
                default:
                  info = ''
                  break
              }
              console.log('发送失败:' + info)
              if (errorCode === 23408) {
                _this.messageList.push({
                  'color': '#fff000',
                  'username': '系统',
                  'usernameColor': '#f0df1c',
                  'content': '你已被禁言'
                })
                _this.goBottom()
              }
            }
          })
        },
        goBottom: function () {
          try {
            var el = document.getElementById('chatContainer')
            var startHeight = el.scrollHeight
            this.$nextTick(function () {
              var distance = el.scrollHeight - startHeight
              var i = 0
              var timer = setInterval(function () {
                i++
                if (!el) {
                  clearInterval(timer)
                }
                el.scrollTop = distance / 50 * i + startHeight - el.offsetHeight
                if (i === 50) {
                  clearInterval(timer)
                }
              }, 1)
            })
          } catch (error) {}
        }
      },
      created: function(){
        var self = this
        axios({
          method: 'get',
          url: '/tvshop/user/getLiveInfo'
        }).then(function(res){
          if(res.data.code === 20000) {
            self.liveInfo = res.data.resp.object.liveInfo
            self.userInfo = res.data.resp.object.userInfo
          }
        })
        axios({
          method: 'get',
          url: '/tvshop/user/rongyunToken'
        }).then(function(res){
          if(res.data.code === 20000) {
            self.token = res.data.resp.token
            self.ryConnect()
          }
        })
        RongIMLib.RongIMClient.init('4z3hlwrv3vhjt')
        this.initRY()
      },
      directives: {
        initVideo: {
          inserted: function (el, binding, vnode) {
            vnode.context.videoObj = videojs('videoPlayer');
            $("#videoPlayer").width($("#videoPlayer").height() / 16 * 9)
            $("#videoPlayer").css({
              'margin-left': -$("#videoPlayer").height() / 16 * 9 / 2 + 'px'
            })
          }
        }
      },
      beforeRouteLeave: function (from, to, next) {
        if(this.videoObj.dispose){
          this.videoObj.dispose()
        }
        next()
      },
      components:{
            'paginate': Paginate
        }
    }
</script>
<style lang="scss">
    .live_window{
        min-width:1080px;
        width:86%;
        height:86%;
        top:9%;
        left:7%;
        border-radius:5px;
        position:absolute;
        background:url(../images/video_window_bg.png) no-repeat center center;
        background-size:100% 100%;
        overflow:hidden;
        div.chat_wrap{
            p.message{
                span{
                    position:relative;
                    cursor:pointer;
                    display:inline-block;
                }
            }
        }
        .model{
            position:absolute;
            width:100%;
            height:100%;
            top:0;
            left:0;
            background:rgba(0,0,0,0.75);
        }
        .video-js{
            position:absolute;
            height:100%;
            left:50%;
        }
        .poster{
            position:absolute;
            height:100%;
            width:34%;
            color:#fff;
            left:33%;
            text-align:center;
            line-height:540px;
            background:#000;
            font-size:30px;
        }
        .content{
            width:100%;
            height:100%;
            position:absolute;
            z-index:2;
            .show_area{
                width:314px;
                margin:0 auto;
                height:100%;
                position:relative;
            }
            &>.fl{
                width:33%;
                height:100%;
                .top{
                    width:100%;
                    height:111px;
                    .part_1{
                        margin-top:50px;
                        border-bottom:1px solid rgba(255,255,255,0.2);
                        padding-bottom:10px;
                        overflow:hidden;
                        img{
                            width:36px;
                            height:36px;
                            border:1px solid #fff;
                            border-radius:50%;
                        }
                        .name{
                            height:38px;
                            font-size:16px;
                            color:#fff;
                            line-height:38px;
                            margin-left:10px;
                        }
                        .fr{
                            height:38px;
                            line-height:38px;
                            span{
                                color:#fff;
                                font-size:16px;
                            }
                            .red{
                                color:#ff5050;
                            }
                        }
                    }
                    .part_2{
                        overflow:hidden;
                        margin-top:14px;
                        .fl:nth-of-type(1){
                            text-align:center;
                            width:150px;
                            border-right:1px solid rgba(255,255,255,0.2);
                        }
                        .fl:nth-of-type(2){
                            text-align:center;
                            width:149px;
                        }
                        span{
                            color:rgba(255,255,255,0.2);
                            font-size:12px;
                        }
                        .bold{
                            font-size:18px;
                            color:#fff;
                        }
                    }
                }
                .middle{
                    margin-top:46px;
                    padding-left:32px;
                    section{
                        margin-bottom:31px;
                        cursor:pointer;
                    }
                    section:hover,section.active{
                        span{
                            color:#ff5050;
                        }
                    }
                    span{
                        color:#fff;
                        font-size:14px;
                        line-height:18px;
                    }
                }
                .footer{
                    position:absolute;
                    bottom:80px;
                    img{
                        display:inline-block;
                        vertical-align: middle;
                    }
                    span{
                        color:#fff;
                        vertical-align: middle;
                        font-size:12px;
                    }
                }
            }
            &>.fr{
                width:33%;
                height:100%;
                .top{
                    font-size:14px;
                    color:#fff;
                    float:right;
                    margin-top:50px;
                    cursor:pointer;
                }
                .no_scroll{
                    position:absolute;
                    top:100px;
                    bottom:73px;
                    width:100%;
                    div#chatContainer{
                        overflow: hidden;
                    }
                    .chat_wrap{
                        height:520px;
                    }
                    .chatArea{
                        position:relative;
                        height:100%;
                        width:100%;
                        padding-right:17px;
                        p{
                            margin:10px 0;
                        }
                        span{
                            font-size:12px;
                        }
                    }
                }
                .editArea{
                    position:absolute;
                    bottom:30px;
                    input{
                        width:236px;
                        height:30px;
                        font-size:14px;
                        line-height:34px;
                        border-radius:3px;
                        vertical-align: middle;
                        padding-left:10px;
                    }
                    button{
                        width:60px;
                        height:30px;
                        background:#ff3958;
                        border-radius:3px;
                        color:#fff;
                        vertical-align: middle;
                        cursor:pointer;
                    }
                }
            }
        }
    }
    div.liveManager{
        div.no_flash{
            width:340px;
            position: absolute;
            top:100px;
            left:39%;
            color:#fff;
            text-align: center;
            z-index: 999999;
            line-height: 26px;
            a{
                color:#fff;
                background: #00cdbf;
                margin:0 10px;
            }
        }
        div.admin-box{
            position:absolute;
            top:80px;
            left:37.5%;
            z-index: 999;
            background:#fff;
            width:400px;
            height:240px;
            border-radius: 8px;
            p.set_title{
                font-size: 16px;
                color:#323232;
                padding:10px 20px;
                border-bottom:1px solid #e3e3e3;
                img{
                    float:right;
                    cursor:pointer;
                }
            }
            p.title{
                font-size: 16px;
                color:#323232;
                padding-left:20px;
                margin:20px 0;
            }

            label{
                display:inline;
                text-align:center;
                padding:10px  0;
                width:100%;
                cursor:pointer;
                font-size: 16px;
                color:#323232;
                margin-right:20px;
            }
            button.btn{
                display:block;
                width:260px;
                height:40px;
                color:#fff;
                background: #a90f0f;
                font-size: 20px;
                border-radius: 4px;
                margin:40px auto;
                cursor:pointer;
            }
            input:nth-child(3){
                margin-left:40px;
            }
            input[type=radio]{
                -webkit-appearance: none;
                appearance: none;
                width: 18px;
                height:18px;
                border-radius: 50%!important;
                margin-right:10px;
                cursor: pointer;
                vertical-align: bottom;
                background: #fff;
                border: 1px solid #B9BBBE;
                -webkit-border-radius: 1px;
                -moz-border-radius: 1px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                position: relative;
            }
            input[type=radio]:checked,
            input[type=radio]:checked {
                background: #fff;
                outline: none;
            }

            input[type=radio]:checked::after {
                content: url('../images/tick1.png');
                display: block;
                position: absolute;
                top:-1px;
                right:0;
                left:-1px;
            }

            input[type=radio]:focus {
                outline: none;
                border-color:#4d90fe;
            }
            span{
                display:block;
                width: 0;
                height: 0;
                border-top: 5px solid transparent;
                border-left: 10px solid #fff;
                border-bottom: 5px solid transparent;
                position:absolute;
                right:-10px;
                top:4px;
            }
        }
        div.ceng{
            position: absolute;
            left:-60px;
            top:-90px;
            bottom:0;
            right:0;
            z-index: 9999;
            background: #000;
            background: rgba(0,0,0,.5);
            filter:alpha(opacity=50);
            -moz-opacity:0.5;
            -khtml-opacity: 0.5;
            opacity: 0.5;
        }
        div.admin_list{
            width:670px;
            height:400px;
            border-radius:6px;
            background: #fff;
            position: absolute;
            top:70px;
            left:370px;
            z-index: 99999;
            p.admin_header{
                padding:12px 20px;
                color:#323232;
                font-size: 16px;
                border-bottom:1px solid #eee;
                img{
                    float:right;
                    cursor:pointer;
                }
            }
            div.admin_content{
                width:546px;
                margin:30px auto 0 auto;
                div.admin_nav{
                    width:100%;
                    div{
                        width:273px;
                        float:left;
                        color:#323232;
                        font-size: 16px;
                        text-align: center;
                        background: #f3f3f3;
                        padding:6px 0;
                        position: relative;
                        cursor:pointer;
                        span{
                            position: absolute;
                            width: 0;
                            height: 0;
                            border-left: 8px solid transparent;
                            border-right: 8px solid transparent;
                            border-top: 8px solid #a90f0f;
                            right:132px;
                            bottom:-8px;
                        }
                    }
                    div.action{
                        background: #a90f0f;
                        color:#fff;
                    }
                }
                ul.admins,ul.reports{
                    li{
                        width:100%;
                        border-bottom:1px solid #ddd;
                        overflow: hidden;
                        padding:20px 0;
                        button.btn{
                            width:70px;
                            height:26px;
                            background: #a90f0f;
                            border-radius: 4px;
                            font-size: 14px;
                            color:#fff;
                            float:right;
                            margin-top:14px;
                            cursor:pointer;
                        }
                        img,span{
                            display:inline;
                        }
                        img.head_img{
                            width:50px;
                            height:50px;
                            border-radius: 50%;
                            vertical-align: middle;
                        }
                        span.username{
                            vertical-align: middle;
                            color:#323232;
                            font-size: 14px;
                            margin:0 10px;
                        }
                        img.sexy{
                            height:14px;
                            vertical-align: middle;
                        }
                        span.level{
                            vertical-align: middle;
                            background: #11aaea;
                            color:#fff;
                            width:30px;
                            height:14px;
                            line-height:14px;
                            font-size: 12px;
                            text-align: center;
                            padding:4px 10px;
                            border-radius:4px;
                        }
                    }
                }
                ul.paginate_box{
                    overflow:hidden;
                    display:block;
                    margin:50px auto 0 auto;
                    li{
                        float:left;
                        border:1px solid #a90f0f;
                        padding:4px 12px;
                    }
                }
            }
        }
    }
</style>