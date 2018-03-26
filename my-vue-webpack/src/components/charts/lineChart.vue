<template>
    <div class="chart_container">
        <h2 class="chart_title">{{chartTitle}}</h2>
        <div class="chart_nav">
            <ul>
                <li :class="{'active':choose==0}" @click="update(0)">今天</li>
                <li :class="{'active':choose==1}" @click="update(1)">昨天</li>
                <li :class="{'active':choose==2}" @click="update(2)">最近7天</li>
                <li :class="{'active':choose==3}" @click="update(3)">最近30天</li>
                <li :class="{'active':choose==4}" @click="update(4)">本周</li>
                <li :class="{'active':choose==5}" @click="update(5)">上周</li>
                <li :class="{'active':choose==6}" @click="update(6)">本月</li>
                <li :class="{'active':choose==7}" @click="update(7)">上月</li>
                <li :class="{'active':choose==8}" @click="update(8)">自定义</li>
            </ul>
            <div class="date_query">
                <datepicker class="startTime" v-model="startTime2" language="zh" :format="'yyyy-MM-dd'"
                            :clear-button="true" @cleared="beginTime=''"></datepicker>
                至
                <datepicker class="endTime" v-model="endTime2" language="zh" :format="'yyyy-MM-dd'" :clear-button="true"
                            @cleared="beginTime=''"></datepicker>
            </div>
        </div>
        <div :id="chartContainer" class="user_chart"></div>
    </div>
</template>
<script type="text/ecmascript-6">
    var Highcharts = require('highcharts');
    require('highcharts/modules/exporting')(Highcharts);
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
    var current = new Date();
    export default {
        props: ["url", "chartTitle", "chartContainer"],
        data() {
            return {
                //对对象进行运算会调用valueOf方法
                startTime: +new Date(new Date().setHours(0, 0, 0, 0)),
                endTime: +new Date(new Date().setHours(0, 0, 0, 0)),
                startTime2: "",
                endTime2: "",
                choose: 0,
                chart: {}
            }
        },
        watch: {
            endTime2: function () {
                this.update(8);
            },
            startTime2: function () {
                this.update(8);
            }
        },
        methods: {
            getXY: function (obgTemp) {
                var newObj = {
                    xArray: [],
                    yArray: []
                };
                for (var key in obgTemp) {
                    if (key == "all" || key == "yesterdayall") {
                        continue;
                    }
                    newObj.xArray.push(key);
                    newObj.yArray.push(obgTemp[key]);
                }
                return newObj;
            },
            createCharts: function (optionObj) {
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
                            style: {
                                "color": "#494949",
                                "fontSize": "12px"
                            }
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
                            style: {
                                "color": "#494949",
                                "fontSize": "12px"
                            }
                        },
                        labels: {
                            style: {
                                "color": "#494949",
                                "cursor": "default",
                                "fontSize": "16px"
                            }
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
                            states: {
                                hover: {
                                    lineWidth: "2",
                                    lineWidthPlus: "0"
                                }
                            }
                        },
                        series: {
                            marker: {
                                symbol: "url(" + require('../../images/chart_point_red.png') + ")",
                                width: "11"
                            }
                        }
                    },
                    series: [{
                        name: optionObj.title,
                        data: optionObj.yArray
                    }]
                });
                return chart;
            },
            getTimeByIndex: function (index) {
                var timeObj = {};
                //当前时间
                var current = new Date();
                var day = current.getDay();
                day = (day == 0 ? 7 : day);
                //周一时间
                var mondayTime = new Date(current.getFullYear(), current.getMonth(), current.getDate() - day + 1);
                var sundayTime = new Date(current.getFullYear(), current.getMonth(), current.getDate() - day + 7);
                //上周一
                var lastMondayTime = new Date(current.getFullYear(), current.getMonth(), current.getDate() - day - 6);
                var lastSundayTime = new Date(current.getFullYear(), current.getMonth(), current.getDate() - day);
                //一号
                var monthDayFirst = new Date(current.getFullYear(), current.getMonth());
                var monthDayLast = new Date(current.getFullYear(), current.getMonth() + 1, 0);
                //上月一号
                var lastMonthDayFirst = new Date(current.getFullYear(), current.getMonth() - 1);
                var lastMonthDayLast = new Date(current.getFullYear(), current.getMonth(), 0);
                switch (index) {
                    //当天
                    case 0: {
                        timeObj.endTime = timeObj.startTime = new Date(current.getFullYear(), current.getMonth(), current.getDate());
                        break;
                    }
                    //昨天
                    case 1: {
                        timeObj.endTime = timeObj.startTime = new Date(current.getFullYear(), current.getMonth(), current.getDate() - 1);
                        break;
                    }
                    //最近7天
                    case 2: {
                        timeObj.startTime = new Date(current.getFullYear(), current.getMonth(), current.getDate() - 6);
                        timeObj.endTime = new Date(current.getFullYear(), current.getMonth(), current.getDate());
                        break;
                    }
                    //最近30天
                    case 3: {
                        timeObj.startTime = new Date(current.getFullYear(), current.getMonth(), current.getDate() - 29);
                        timeObj.endTime = new Date(current.getFullYear(), current.getMonth(), current.getDate());
                        break;
                    }
                    //本周
                    case 4: {
                        timeObj.startTime = mondayTime;
                        timeObj.endTime = sundayTime;
                        break;
                    }
                    //上周
                    case 5: {
                        timeObj.startTime = lastMondayTime;
                        timeObj.endTime = lastSundayTime;
                        break;
                    }
                    //本月
                    case 6: {
                        timeObj.startTime = monthDayFirst;
                        timeObj.endTime = monthDayLast;
                        break;
                    }
                    //上月
                    case 7: {
                        timeObj.startTime = lastMonthDayFirst;
                        timeObj.endTime = lastMonthDayLast;
                        break;
                    }
                    default: {
                        timeObj.startTime = new Date(current.getFullYear(), current.getMonth(), current.getDate());
                        timeObj.endTime = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1);
                        break;
                    }
                }
                return timeObj;
            },
            update: function (index) {
                this.choose = index;
                var params = {};
                if (index == 8) {
                    if (this.startTime2 && this.endTime2) {
                        params = {
                            startTime: +this.startTime2,
                            endTime: this.endTime2 - 1
                        }
                    } else {
                        return;
                    }
                } else {
                    var timeObj = this.getTimeByIndex(index);
                    params = {
                        startTime: +timeObj.startTime,
                        endTime: +timeObj.endTime
                    }
                }
                this.chart.showLoading();
                let self = this;
                axios({
                    method: "get",
                    url: this.url,
                    params: params
                }).then(function (res) {
                    if (res.data.code === 20000) {
                        console.log(res);
                        let userDate = self.getXY(res.data.resp.statistic);
                        self.chart.xAxis[0].update({
                            categories: userDate.xArray
                        });
                        self.chart.series[0].setData(userDate.yArray);
                        self.chart.hideLoading();
                    } else {
                        self.$dealRes(res.data.code, res.data.msg);
                    }
                });
            }
        },
        mounted() {
            let self = this;
            axios({
                method: "get",
                url: this.url,
                params: {
                    startTime: this.startTime,
                    endTime: this.endTime
                }
            }).then(function (res) {
                var statistic = self.getXY(res.data.resp.statistic);
                var chartOption = {
                    xArray: statistic.xArray,
                    yArray: statistic.yArray,
                    container: self.chartContainer,
                    color: "rgba(255,39,64,0.5)",
                    fillColor: "rgba(255,39,64,0.5)",
                    pointColor: "red",
                    title: self.title
                };
                self.chart = self.createCharts(chartOption);
            });
        }
    }
</script>
<style type="text/css" lang="scss">
    .chart_container {
        .startTime,
        .endTime {
            width: 125px;
            display: inline-block;
        }
        .endTime .calendar {
            right: 0
        }
    }
</style>