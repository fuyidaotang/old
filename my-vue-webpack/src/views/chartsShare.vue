<template>
    <div class="user_count" v-cloak>
        <div class="mainContent">
            <h1 class="comm_title">数据统计</h1>
            <div class="comm_table_content">
                <div class="chart_count">
                    <section>
                        <h4>购物车</h4>
                        <div :class="[isScSPlus?'fadd':'fcut','current_count']">{{scsAll}}
                            <span :class="[isScSPlus?'fadd':'fcut']">元</span>
                        </div>
                        <div class="before_count">昨天 {{scsYAll}}</div>
                        <div class="percent">
                            <span :class="[isScSPlus?'fadd':'fcut']">{{getPercent(scsAll,scsYAll)}}%</span>
                            <img :src="getIcon(isScSPlus)" height="12" width="8">
                        </div>
                    </section>
                    <section>
                        <h4>销售量</h4>
                        <div :class="[isSvSPlus?'fadd':'fcut','current_count']">{{svsAll}}
                            <span :class="[isSvSPlus?'fadd':'fcut']">元</span>
                        </div>
                        <div class="before_count">昨天 {{svsYAll}}</div>
                        <div class="percent">
                            <span :class="[isSvSPlus?'fadd':'fcut']">{{getPercent(svsAll,svsYAll)}}%</span>
                            <img :src="getIcon(isSvSPlus)" height="12" width="8">
                        </div>
                    </section>
                    <section>
                        <h4>销售额</h4>
                        <div :class="[isTsPlus?'fadd':'fcut','current_count']">{{tsAll}}
                            <span :class="[isTsPlus?'fadd':'fcut']">元</span>
                        </div>
                        <div class="before_count">昨天 {{tsYAll}}</div>
                        <div class="percent">
                            <span :class="[isTsPlus?'fadd':'fcut']">{{getPercent(tsAll,tsYAll)}}%</span>
                            <img :src="getIcon(isTsPlus)" height="12" width="8">
                        </div>
                    </section>
                </div>
                <line-chart id="sale" class="comm_chart" chartContainer="chartOne" url="/tvshop/statistic/turnoverSta"
                            chart-title="销售额统计"></line-chart>
                <line-chart id="salesVolumeSta" class="comm_chart" chartContainer="chartTwo"
                            url="/tvshop/statistic/salesVolumeSta" chart-title="产品销售量统计"></line-chart>
                <line-chart id="shopping" class="comm_chart" chartContainer="chartThree"
                            url="/tvshop/statistic/shopCartSta" chart-title="购物车统计"></line-chart>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
    import lineChart from "../components/charts/lineChart.vue";
    export default {
        data() {
            return {
                //购物车
                scsAll: 0,
                scsYAll: 0,
                //销量
                svsAll: 0,
                svsYAll: 0,
                //销售额
                tsAll: 0,
                tsYAll: 0,
            }
        },
        computed: {
            isScSPlus: function () {
                return this.scsYAll < this.scsAll;
            },
            isSvSPlus: function () {
                return this.svsYAll < this.svsAll;
            },
            isTsPlus: function () {
                return this.tsYAll < this.tsAll;
            }
        },
        methods: {
            getIcon: function (bool) {
                if (bool) {
                    return require("../images/up_arrow.png");
                } else {
                    return require("../images/down_arrow.png");
                }
            },
            getPercent: function (a, b) {
                if (b == 0) {
                    return "∞";
                }
                var c = (a - b) / b;
                c = c > 0 ? c : -c;
                return (c * 100).toFixed(2);
            }
        },
        components: {
            lineChart
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                axios({
                    method: "get",
                    url: "/tvshop/statistic/allSta",
                    params: {
                        startTime: +new Date(new Date().setHours(0, 0, 0, 0)),
                        endTime: +new Date(new Date().setHours(0, 0, 0, 0)) + 86400000,
                    }
                }).then(function (res) {
                    if (res.data.code === 20000) {
                        vm.scsAll = res.data.resp.allStatistic.shopCartStatistic.all;
                        vm.scsYAll = res.data.resp.allStatistic.shopCartStatistic.yesterdayall;
                        vm.svsAll = res.data.resp.allStatistic.salesVolumeStatistic.all;
                        vm.svsYAll = res.data.resp.allStatistic.salesVolumeStatistic.yesterdayall;
                        vm.tsAll = res.data.resp.allStatistic.turnoverStatistic.all;
                        vm.tsYAll = res.data.resp.allStatistic.turnoverStatistic.yesterdayall;
                    } else {
                        vm.$dealRes(res.data.code, res.data.msg);
                    }
                });
            })

        }
    }
</script>
<style type="text/css">
    .comm_chart {
        margin-top: 20px;
    }
</style>
