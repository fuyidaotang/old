<template>
	<div class="childMenu">
		<dl>
			<dt><span>{{menuOption.title}}</span><s></s></dt>
			<dd v-for="menu in menuOption.childMenu">
				<router-link :to="{path:menu.url}" v-if="!menu.isShow">{{menu.title}}</router-link>
			</dd>
		</dl>
	</div>
</template>
<script type="text/ecmascript-6">
	export default {
		props:["menuOption"]
	}
</script>
<style type="text/css" lang="scss" scoped>
	.childMenu{
		position:absolute;
		z-index:2;
		width:160px;
		top:-1px;
		right:-161px;
		background:#fff;
		display:none;
		dt{
			height:50px;
			background:url(../../images/background_image.png) no-repeat center center;
			text-align:center;
			line-height:50px;
			font-size:18px;
			s{
				position:absolute;
				top:23px;
				right:18px;
				display:inline-block;
				width:12px;
				height:7px;
				background:url(../../images/icon_list.png) no-repeat center center;
				background-position:-71px -7px;
			}
		}
		dd{
			height:40px;
			border-bottom:1px solid #eee;
			text-align:center;
			font-size:16px;
			-webkit-transition:background 0.1s;
			transition:background 0.1s;
			a{
				display:block;
				line-height:40px;
				width:100%;
				height:100%;
			}
		}
		a:hover{
			background:#a90e0e;
			color:#fff;
		} 
	}
</style>