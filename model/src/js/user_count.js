var Highcharts = require('highcharts');
var userCountVue;
require('highcharts/modules/exporting')(Highcharts);
var flatpickr = require("flatpickr");
var Chinese = require("flatpickr/dist/l10n/zh.js").zh;
var activeUserChart;
var newUserChart;
var orderUserChart;
var liveUserChart;
function initialize() {
    $(".pic_container").removeClass("hidden");
    userCountVue = new Vue({
        el:".user_count",
        data:{
            activeCurrentCount:0,
            activeBeforeCount:0,
            addCurrentCount:0,
            addBeforeCount:0,
            orderCurrentCount:0,
            orderBeforeCount:0,
            liveCurrentCount:0,
            liveBeforeCount:0,
            iconUp : require("../img/up_arrow.png"),
            iconDown : require("../img/down_arrow.png")
        },
        methods:{
            getPercent:function(a,b){
                if(b==0){
                    return "∞";
                }
                var c = (a-b)/b;
                c=c>0?c:-c;
                return (c*100).toFixed(2);
            },
            getType:function(a,b){
                return a>=b;
            }
        }
    })
    Vue.nextTick(function(){
        $(".flatpickr").flatpickr({
            locale: Chinese,
            onChange:function(selectedDates, dateStr, instance){
                var el = $(instance.element).parent();
                var startTime = Date.parse(el.children('.startTime').val());
                var endTime = Date.parse(el.children('.endTime').val());
                if(startTime>endTime){
                    alert("结束日期不能比开始日期早,请重新选择");
                    instance.clear();
                    return;
                }else if(startTime == endTime){
                    //相差时间在24小时内才返回一天的数据,相等选择当天数据
                    endTime = endTime;
                }
                //都有值则刷新图表
                if(startTime && endTime){
                    var module = el.parents(".chart_container");
                    updateCharts(module,startTime,endTime);
                }
            }
          });
    });
    getDefaultDate();
    Highcharts.setOptions({
        lang: {
            contextButtonTitle: "表格导出",
            printChart: "打印图表",
            downloadPNG: "下载PNG",
            downloadJPEG: "下载JPEG",
            downloadPDF: "下载PDF",
            downloadSVG: "下载SVG"
        }
    });
    addEvent();
}
function getDefaultDate(){
    var current = new Date();
    //当天时间
    var startTime = new Date(current.getFullYear(),current.getMonth(),current.getDate());
    var endTime = new Date(current.getFullYear(),current.getMonth(),current.getDate()+1);
    var para = {};
    para.startTime = Date.parse(startTime);
    para.endTime = Date.parse(endTime)-1000;
    $.ajax({
        type:"get",
        data:para,
        url:"/tvmanager/sta/allStatistics",
        success:function(data){
            if (!$(".pic_container").hasClass("hidden")) {
                $(".pic_container").addClass("hidden");
            }
            data = JSON.parse(data);
            //初始化图表
            //初始化活跃用户图表
            var activeUser = getXY(data.resp.activeUsers);
            userCountVue.activeCurrentCount = data.resp.activeUsers.all;
            userCountVue.activeBeforeCount = data.resp.activeUsers.yesterdayall;
            var activeUserChartOption = {
                xArray:activeUser.xArray,
                yArray:activeUser.yArray,
                container:"active_user_chart",
                color:"rgba(255,39,64,0.5)",
                fillColor:"rgba(255,39,64,0.5)",
                pointColor:"red",
                title:"活跃用户数"
            };
            activeUserChart = createCharts(activeUserChartOption);
            activeUserChart.chartUrl = "userLoginStatistics";
            //初始化新增用户图表
            var newUser = getXY(data.resp.newUsers);
            userCountVue.addCurrentCount = data.resp.newUsers.all;
            userCountVue.addBeforeCount = data.resp.newUsers.yesterdayall;
            var newUserChartOption = {
                xArray:newUser.xArray,
                yArray:newUser.yArray,
                container:"new_user_chart",
                color:"rgba(70,100,255,0.5)",
                fillColor:"rgba(70,100,255,0.5)",
                pointColor:"blue",
                title:"新增用户数"
            };
            newUserChart = createCharts(newUserChartOption);
            newUserChart.chartUrl = "userRegStatistics";
             //初始化下单用户图表
            var orderUser = getXY(data.resp.placeAnOrder);
            userCountVue.orderCurrentCount = data.resp.placeAnOrder.all;
            userCountVue.orderBeforeCount = data.resp.placeAnOrder.yesterdayall;
            var orderUserChartOption = {
                xArray:orderUser.xArray,
                yArray:orderUser.yArray,
                container:"order_user_chart",
                color:"rgba(255,173,30,0.5)",
                fillColor:"rgba(255,173,30,0.5)",
                pointColor:"yellow",
                title:"下单用户数"
            };
            orderUserChart =createCharts(orderUserChartOption);
            orderUserChart.chartUrl = "orderStatistics";
             //初始化在线用户图表
            var watchUser = getXY(data.resp.watchUsers);
            userCountVue.liveCurrentCount = data.resp.watchUsers.all;
            userCountVue.liveBeforeCount = data.resp.watchUsers.yesterdayall;
            var liveUserChartOption = {
                xArray:watchUser.xArray,
                yArray:watchUser.yArray,
                container:"live_user_chart",
                color:"rgba(7,224,181,0.5)",
                fillColor:"rgba(7,224,181,0.5)",
                pointColor:"green",
                title:"观看直播用户数"
            };
            liveUserChart = createCharts(liveUserChartOption);
            liveUserChart.chartUrl = "userWatchStatistics";
        }
    });
}
function getXY(obgTemp){
    var newObj = {
        xArray : [],
        yArray : []
    };
    for(var key in obgTemp){
        if(key == "all" || key == "yesterdayall"){
            continue;
        }
        newObj.xArray.push(key);
        newObj.yArray.push(obgTemp[key]);
    }
    return newObj;
}
function createCharts(optionObj){
    var chart = Highcharts.chart(optionObj.container, { 
            loading: {
                labelStyle: {
                    color: 'black',
                    fontSize: '16px'
                }
            },
            chart: {
                type: 'areaspline',
                marginTop: "20"
            },
            title: {
                text: ''
            },
            legend: {
                enabled: false
            },
            xAxis: {
                categories: optionObj.xArray,
                title: {
                    align: "high",
                    text: '时间/时',
                    rotation: "0",
                    style: { "color": "#494949", "fontSize": "12px" }
                },
                gridLineColor: "#f1f1f1",
                lineColor: "#dbdbdb",
                lineWidth: "1",
                endOnTick: true,
                tickWidth: 0
            },
            yAxis: {
                title: {
                    align: "high",
                    text: '人数/人',
                    rotation: "0",
                    style: { "color": "#494949", "fontSize": "12px" }
                },
                labels: {
                    style: { "color": "#494949", "cursor": "default", "fontSize": "16px" }
                },
                gridLineColor: "#f1f1f1",
                gridLineDashStyle: "dash",
                lineColor: "#dbdbdb",
                lineWidth: "1"
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                areaspline: {
                    color: optionObj.color,
                    fillColor: optionObj.fillColor,
                    states:{
                        hover:{
                            lineWidth:"2",
                            lineWidthPlus:"0"
                        }
                    }
                },
                series:{
                    marker:{
                        symbol:"url("+require('../img/chart_point_'+optionObj.pointColor+'.png')+")",
                        width:"11"
                    }
                }
            },
            series: [{
                name: optionObj.title,
                data: optionObj.yArray
            }]
        });
    return chart;
}
function getTimeByIndex(index){
    var timeObj = {};
    //当前时间
    var current = new Date();
    var day = current.getDay();
    day = (day == 0?7:day);
    //周一时间
    var mondayTime = new Date(current.getFullYear(),current.getMonth(),current.getDate()-day+1);
    var sundayTime = new Date(current.getFullYear(),current.getMonth(),current.getDate()-day+7);
    //上周一
    var lastMondayTime = new Date(current.getFullYear(),current.getMonth(),current.getDate()-day-6);
    var lastSundayTime = new Date(current.getFullYear(),current.getMonth(),current.getDate()-day);
    //一号
    var monthDayFirst = new Date(current.getFullYear(),current.getMonth());
    var monthDayLast = new Date(current.getFullYear(),current.getMonth()+1,0);
    //上月一号
    var lastMonthDayFirst = new Date(current.getFullYear(),current.getMonth()-1);
    var lastMonthDayLast = new Date(current.getFullYear(),current.getMonth(),0);
    switch(index){
        //当天
        case 0:{
            timeObj.endTime = timeObj.startTime = new Date(current.getFullYear(),current.getMonth(),current.getDate());
            break;
        }
        //昨天
        case 1:{
            timeObj.endTime = timeObj.startTime = new Date(current.getFullYear(),current.getMonth(),current.getDate()-1);
            break;
        }
        //最近7天
        case 2:{
            timeObj.startTime = new Date(current.getFullYear(),current.getMonth(),current.getDate()-6);
            timeObj.endTime = new Date(current.getFullYear(),current.getMonth(),current.getDate());
            break;
        }
        //最近30天
        case 3:{
            timeObj.startTime = new Date(current.getFullYear(),current.getMonth(),current.getDate()-29);
            timeObj.endTime = new Date(current.getFullYear(),current.getMonth(),current.getDate());
            break;
        }
        //本周
        case 4:{
            timeObj.startTime = mondayTime;
            timeObj.endTime = sundayTime;
            break;
        }
        //上周
        case 5:{
            timeObj.startTime = lastMondayTime;
            timeObj.endTime = lastSundayTime;
            break;
        }
        //本月
        case 6:{
            timeObj.startTime = monthDayFirst;
            timeObj.endTime = monthDayLast;
            break;
        }
        //上月
        case 7:{
            timeObj.startTime = lastMonthDayFirst;
            timeObj.endTime = lastMonthDayLast;
            break;
        }
        default:{
            timeObj.startTime = new Date(current.getFullYear(),current.getMonth(),current.getDate());
            timeObj.endTime = new Date(current.getFullYear(),current.getMonth(),current.getDate()+1);
            break;
        }
    }
    return timeObj;
}
function addEvent(){
    //菜单切换
    $(".chart_nav li").click(function(){
        //选中样式
        $(this).siblings(".active").removeClass("active");
        $(this).addClass("active");
        var dataUqeryEl = $(this).parents(".chart_nav").find(".date_query");
        //如果选择自定义,则显示时间选择框
        if($(this).index() == 8){
            dataUqeryEl.removeClass("hidden");
            return;
        }else if(!dataUqeryEl.hasClass("hidden")){
            $(this).parents(".chart_nav").find(".date_query").addClass("hidden");
        }
        //获取时间对象
        var timeObj = getTimeByIndex($(this).index());
        //更新图表
        var module = $(this).parents(".chart_container");
        updateCharts(module,Date.parse(timeObj.startTime),Date.parse(timeObj.endTime));
    });
}
function updateCharts(module,startTime,endTime){
        if(module.hasClass("active_user_chart")){
            updateChart(activeUserChart,startTime,endTime);
        }else if(module.hasClass("new_user_chart")){
            updateChart(newUserChart,startTime,endTime);
        }else if(module.hasClass("order_user_chart")){
            updateChart(orderUserChart,startTime,endTime);
        }else if(module.hasClass("live_user_chart")){
            updateChart(liveUserChart,startTime,endTime);
        }
}
function updateChart(chart,startTime,endTime){
    chart.showLoading();
    var para = {};
    para.startTime = startTime;
    para.endTime = endTime;
    $.ajax({
        type:"get",
        data:para,
        url:"/tvmanager/sta/"+chart.chartUrl,
        success:function(data){
            data = JSON.parse(data);
            console.log(data);
            if(data.code == 20004){
                alert("登录失效,请重新登录");
                sessionStorage.removeItem("loginInfo");
                location.href="login.html";
            }
            if(data.resp){
                var userDate;
                switch(chart.chartUrl){
                    case "userLoginStatistics":userDate = getXY(data.resp.activeUsers);break;
                    case "orderStatistics":userDate = getXY(data.resp.placeAnOrder);break;
                    case "userWatchStatistics":userDate = getXY(data.resp.watchUsers);break;
                    case "userRegStatistics":userDate = getXY(data.resp.newUsers);break;
                    default:alert("未知错误");
                }
                chart.xAxis[0].update({
                    categories:userDate.xArray
                });
                chart.series[0].setData(userDate.yArray);
                chart.hideLoading();
            }else{
                alert(data.msg);
            }
        }
    });
}
module.exports = {
    init: initialize
}
