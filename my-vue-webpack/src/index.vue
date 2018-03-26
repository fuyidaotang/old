<style lang="sass"></style>
<template>
	<div>
		<my-head></my-head>
		<side></side>
		<router-view class="comm_view"></router-view>
		<show-big-image></show-big-image>
		<toast></toast>
		<loading></loading>
	</div>
</template>
<script>
	import myHead from './components/layout/my-head.vue';
	import side from './components/layout/side.vue';
	export default {
		components:{
			myHead,
			side
		}
	}
</script>