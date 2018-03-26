var initPagination;
var supervisionAndInspectionVue;
var videojs = require('video.js/es5/video.js');
var myPlayer;

function initialize() {
    supervisionAndInspectionVue = new Vue({
        el: ".supervision_and_inspection",
        data: {
            shopList: [],
            currentPage: 1,
            pageSize: 10,
            countNum: 0,
            pageArray: [],
            detailContent: {},
            noFlash: false,
            setType: 'set_admin',
            showAdminSmall: false,
            showAdminBig: false,
            liveInfo: false,
            videoObj: {},
            userInfo: {},
            message_vol: require('../audios/message.mp3'),
            order_vol: require('../audios/order.mp3'),
            spaceInfo: {},
            currentIndex: 0,
            message: '',
            messageList: [{
                usernameColor: '#f0df1c',
                color: '#09d8da',
                username: '',
                content: '直播消息： 我们提倡绿色直播，封面和直播内容含吸烟、低俗、引诱、暴露等都将会被封停账号，网警24小时在线巡查。'
            }],
            token: '',
            talkSpaceId: ''
        },
        computed: {
            pagesCount: function () {
                return Math.ceil(this.countNum / this.pageSize);
            },
            shopIndex: function () {
                return this.pageSize * (this.currentPage - 1) + 1;
            }
        },
        methods: {
            sendMessageHandle: function () {
                var content = this.message
                this.message = ''
                if (content !== '') {
                    this.sendMessage(content, 22, this.spaceInfo.userId, this.userInfo.userName, this.spaceInfo.spaceId)
                } else {
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
                var targetId = _this.talkSpaceId + '' // 目标 Id
                RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
                    onSuccess: function (message) {
                        if (message.content.extra === '25') {
                            _this.messageList.push({
                                'color': '#feffa5',
                                'username': '',
                                'content': ms,
                                'id': id
                            })
                        } else if (message.content.extra === '11') {
                            _this.messageList.push({
                                'color': '#fff',
                                'username': '',
                                'content': ms,
                                'id': id
                            })
                        } else {
                            // message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
                            _this.messageList.push({
                                'color': '#208dff',
                                'username': username,
                                'usernameColor': '#f0df1c',
                                'content': ms,
                                'id': id
                            })
                        }
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
            showDetail: function (live_item) {
                let self = this;
                self.messageList = [{
                    usernameColor: '#f0df1c',
                    color: '#09d8da',
                    username: '',
                    content: '直播消息： 我们提倡绿色直播，封面和直播内容含吸烟、低俗、引诱、暴露等都将会被封停账号，网警24小时在线巡查。'
                }]
                this.talkSpaceId = live_item.liveInfo.infodomain.spaceId;
                this.joinChartRoom()
                var liveInfo = live_item.liveInfo
                var liveInfo2 = live_item.liveInfoDtoes[0]
                var detailContent = {};
                detailContent.headPath = liveInfo.picPath;
                detailContent.userName = liveInfo2.userName;
                detailContent.liveNum = liveInfo2.liveId;
                sessionStorage.setItem("id", liveInfo2.liveId);
                detailContent.watchNum = liveInfo2.watchNumber;
                detailContent.address = liveInfo2.liveAddress;
                detailContent.poster = liveInfo2.liveCoverPicUrl;
                detailContent.src = liveInfo2.rtmpPlayUrl;
                this.detailContent = detailContent;
                Vue.nextTick(function () {
                    var html = '<video id="videoPlayer" class="video-js vjs-default-skin" autoplay preload="none" width="480" height="380"><source src="" type="rtmp/flv"/></video>';
                    $("#videoJsContainer").html(html);
                    $("#videoPlayer source").attr("src", detailContent.src);
                    myPlayer = videojs('videoPlayer');
                    $(".video_container").show();
                });
            },
            flashChecker() {
                var hasFlash = 0;　　　　 //是否安装了flash
                var flashVersion = 0;　　 //flash版本

                if (document.all) {
                    var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                    if (swf) {
                        hasFlash = 1;
                        VSwf = swf.GetVariable("$version");
                        flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
                    }
                } else {
                    if (navigator.plugins && navigator.plugins.length > 0) {
                        var swf = navigator.plugins["Shockwave Flash"];
                        if (swf) {
                            hasFlash = 1;
                            var words = swf.description.split(" ");
                            for (var i = 0; i < words.length; ++i) {
                                if (isNaN(parseInt(words[i]))) continue;
                                flashVersion = parseInt(words[i]);
                            }
                        }
                    }
                }
                return {f: hasFlash, v: flashVersion};
            },
            jumpPage: function (pageItem) {
                var data = {};
                data.SpaceNum = $("#SpaceNum").val();
                data.attention = $("#attention").val();
                data.contact = $("#contact").val();
                data.wapStatus = $("#wapStatus").val();
                jumpPage(supervisionAndInspectionVue, pageItem, data);
            },
            out: function (live_item) {
                sessionStorage.setItem("id", live_item.liveInfo.infodomain.liveId);
                $("#refuse_dialog").show();
            },
            ryConnect: function () {
                var _this = this
                var successCallback = function (userId) {
                    console.log('连接成功')
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
            changeVideo: function (url, index) {
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
                    RongIMClient.getInstance().joinChatRoom(_this.talkSpaceId + '', count, {
                        onSuccess: successCallback,
                        onError: errorCallback
                    })
                    console.log('正在重新加入')
                    console.log(error)
                }
                RongIMClient.getInstance().joinChatRoom(_this.talkSpaceId + '', count, {
                    onSuccess: successCallback,
                    onError: errorCallback
                })
            },
            quitChartRoom: function () {
                var _this = this
                RongIMClient.getInstance().quitChatRoom(this.spaceInfo.spaceId + '', {
                    onSuccess: function () {
                        // 退出聊天室成功。
                        console.log('退出聊天室成功')
                        _this.isInChatRoom = false
                    },
                    onError: function (error) {
                        console.log(error)
                        console.log('退出聊天室失败')
                    }
                })
            },
            // 初始化融云
            initRY: function () {
                console.log('初始化')
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
                        if (mesg === '') return
                    }
                })
                // 消息监听器
                RongIMClient.setOnReceiveMessageListener({
                    // 接收到的消息
                    onReceived: function (message) {
                        // 判断消息类型
                        switch (message.objectName) {
                            case 'HDJSystemMessage':
                                // 自定义系统消息
                                if (message.content.message.content.extra === '12') {
                                    _this.getMessage(message.content.message.content)
                                    return
                                }
                                _this.messageList.push(_this.getMessage(message.content.message.content))
                                break
                            case 'HDJCommonMessage':
                                // 自定义普通消息
                                if (message.content.extra === '12') {
                                    _this.getMessage(message.content)
                                    return
                                }
                                _this.messageList.push(_this.getMessage(message.content))
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
                        showMessage.usernameColor = '#f0df1c'
                        showMessage.color = '#ffffff'
                        showMessage.username = content.user.name
                        showMessage.content = content.content
                        break
                    // 进入房间消息
                    case 11:
                        showMessage.usernameColor = '#ffffff'
                        showMessage.color = '#ffffff'
                        showMessage.content = content.content
                        _this.userInfo.audiences++
                        break
                    // 退出房间消息
                    case 12:
                        // 此处移除观众
                        _this.userInfo.audiences--
                        break
                    case 20:
                        showMessage.color = '#fb4575'
                        showMessage.username = ''
                        showMessage.content = content.content
                        break
                    case 21:
                        showMessage.color = '#09d8da'
                        showMessage.username = ''
                        showMessage.content = content.content
                        break
                    case 22:
                        showMessage.usernameColor = '#f0df1c'
                        showMessage.color = '#208dff'
                        showMessage.username = content.user.name
                        showMessage.content = content.content
                        break
                    // 礼物
                    case 23:
                        showMessage.color = '#9ee425'
                        showMessage.username = ''
                        showMessage.content = content.content
                        break
                    // 订单
                    case 24:
                        showMessage.color = '#f3a12d'
                        showMessage.username = ''
                        showMessage.content = content.content
                        break
                    case 25:
                        showMessage.color = '#feffa5'
                        showMessage.username = ''
                        showMessage.content = content.content
                        break
                    case 26:
                        showMessage.usernameColor = '#f0df1c'
                        showMessage.color = '#dcffa6'
                        showMessage.username = content.user.name
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
                        showMessage.username = content.user.name
                        showMessage.content = content.content
                        break
                }
                return showMessage
            },
        },
        created() {
            var self = this
            $.ajax({
                dataType: 'json',
                method: 'get',
                url: '/tvmanager/user/rongyunToken',
                success: function (res) {
                    if (res.code === 20000) {
                        self.token = res.resp.token
                        RongIMLib.RongIMClient.init('4z3hlwrv3vhjt')
                        self.initRY()
                        self.ryConnect()
                        $.ajax({
                            dataType: 'json',
                            method: 'get',
                            url: '/tvmanager/user/adminInfo',
                            success: function (res) {
                                if (res.code === 20000) {
                                    self.spaceInfo = res.resp.adminInfo;
                                }
                            }
                        })
                    }
                }
            })
        }
    });
    var fls = supervisionAndInspectionVue.flashChecker();
    var s = "";
    if (!fls.f) {
        supervisionAndInspectionVue.noFlash = true;
    } else {
        supervisionAndInspectionVue.noFlash = false;
    }
    initPagination = require("./pagination.js");
    getDefaultPage();
    addEvent();
}

function getDefaultPage() {
    //默认一页6条数据,显示第一页
    var pageItem = {
        count: 1,
        isActive: true,
        isHidden: false
    };
    jumpPage(supervisionAndInspectionVue, pageItem);
}

function addEvent() {
    $(".page_button").click(function () {
        var pageItem = {
            count: $("#page_index").val(),
            isActive: true,
            isHidden: false
        };
        jumpPage(supervisionAndInspectionVue, pageItem);
    });
    $(".close").click(function () {
        myPlayer.dispose();
        $(this).parents(".video_container").hide();
        supervisionAndInspectionVue.quitChartRoom()
    });
    $(".b_close").click(function () {
        $(this).parents(".dialog_container").hide();
        supervisionAndInspectionVue.quitChartRoom()
    });
    $(".refuse").click(function () {
        var type = $("#refuse_dialog input:radio:checked").val();
        if (type == 0) {
            //正常关闭
            $.ajax({
                type: 'post',
                url: '/tvmanager/live/removeLive',
                data: {
                    liveId: sessionStorage.getItem("id"),
                    reason: $('#reason').val()
                },
                success: function (res) {
                    alert(res.msg)
                    $(".dialog_container").hide();
                }
            })
        } else {
            //封号一天
            $.ajax({
                type: 'post',
                url: '/tvmanager/live/shutdownLive',
                data: {
                    liveId: sessionStorage.getItem("id"),
                    reason: $('#reason').val(),
                    startTime: (new Date()) * 1,
                    endTime: (new Date()) * 1 + 24 * 60 * 60 * 1000
                },
                success: function (res) {
                    alert(res.msg)
                    $(".dialog_container").hide();
                }
            })
        }
    });
    $("#shop_verify_search").click(function () {
        var data = {};
        data.SpaceNum = $("#SpaceNum").val();
        data.attention = $("#attention").val();
        data.contact = $("#contact").val();
        data.wapStatus = $("#wapStatus").val();
        var pageItem = {
            count: 1,
            isActive: true,
            isHidden: false
        };
        jumpPage(supervisionAndInspectionVue, pageItem, data);
    })
}

function jumpPage(vue, pageItem, para) {
    var pageSize = 10;
    var pageIndex = pageItem.count;
    $.ajax({
        type: "get",
        data: para,
        url: "/tvmanager/live/getLivelist?liveType=2&pageSize=" + pageSize + "&pageIndex=" + pageIndex,
        success: function (data) {
            if (data && typeof data == "string") {
                data = JSON.parse(data);
            }
            if (data.code == 20004) {
                alert("登录失效,请重新登录");
                sessionStorage.removeItem("loginInfo");
                location.href = "login.html";
            } else if (data.code == 20000) {
                vue.currentPage = pageIndex;
                vue.pageSize = pageSize;
                vue.countNum = data.resp.liveList.countNum;
                vue.shopList = data.resp.liveList.objectList
                initPagination(vue);
            }
        }
    });
}

module.exports = {
    init: initialize
}
