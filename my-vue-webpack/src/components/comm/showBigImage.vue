<template>
	<div class="pic_container" @click="clickEvent" v-if="isShow">
	      <img :src="picUrl | enlargePic">
	</div>
</template>
<script type="text/ecmascript-6">
	export default {
		computed:{
			picUrl:function(){
				return this.$store.state.picUrl;
			},
			isShow:function(){
				return this.$store.state.isShowPic;
			}
		},
		methods:{
			clickEvent:function(){
				this.$store.commit("setPicContainer","",false);
			}
		}
	}
</script>