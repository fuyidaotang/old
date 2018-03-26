<template>
	<div class="comm_page">
		<span>共{{countNum}}条,每页显示6条,共{{pagesCount}}页,当前为第{{currentPage}}页</span>
		<div class="comm_pagination_control">
			<ul>
				<li v-for = "(pageItem,index) in pageArray" v-bind:class="{  'active': pageItem.isActive, 'page_hide': pageItem.isHidden  }" @click = "jumpPage(pageItem.count)">{{pageItem.count}}</li>
			</ul>
			<div class="page_input">
				<label for="shop_name">跳转:</label>
				<input type="text" v-model="pageIndex" >
			</div>
			<button class="page_button" @click="jumpPage(pageIndex)">Go</button>
		</div>
	</div>
</template>
<script type="text/ecmascript-6">
	export default {
		props:["countNum","pageSize"],
		data(){
			return {
				 currentPage: 1,
			            pageIndex:""
			}
		},
		computed: {
		            pagesCount: function() {
		                return Math.ceil(this.countNum / this.pageSize);
		            },
		            shopIndex: function() {
		                return this.pageSize * (this.currentPage - 1) + 1;
		            },
		            pageArray:function(){
		            	var pageArray = [];
				//页数
				var pagesCount = Math.ceil(this.countNum/this.pageSize);
				if(this.pagesCount<=8){
					for(var i=1;i<=this.pagesCount;i++){
						var pageItem = {};
						pageItem.count = i;
						pageItem.isActive = (this.currentPage == pageItem.count);
						pageItem.isHidden = false;
						pageArray.push(pageItem);
					}
					return pageArray;
				}else if(this.currentPage<=3){
					for(var i=1;i<=5;i++){
						var pageItem = {};
						pageItem.count = i;
						pageItem.isActive = (this.currentPage == i);
						pageItem.isHidden = false;
						pageArray.push(pageItem);
					}
					var pageItem = {};
					pageItem.count = '';
					pageItem.isActive = false;
					pageItem.isHidden = true;
					pageArray.push(pageItem);
					for(var i=1;i>=0;i--){
						var pageItem = {};
						pageItem.count = this.pagesCount-i;
						pageItem.isActive = false;
						pageItem.isHidden = false;
						pageArray.push(pageItem);
					}
					return pageArray;
				}else{
					if(this.currentPage == 4){
						var pageItem = {};
						pageItem.count = 1;
						pageItem.isActive = false;
						pageItem.isHidden = false;
						pageArray.push(pageItem);
					}else if(this.currentPage >4){
						var pageItem = {};
						pageItem.count = 1;
						pageItem.isActive = false;
						pageItem.isHidden = false;
						var pageItem1 = {};
						pageItem1.count = "";
						pageItem1.isActive = false;
						pageItem1.isHidden = true;
						pageArray.push(pageItem);
						pageArray.push(pageItem1);
					}
					for(var i=1;i<=5;i++){
						var pageItem = {};
						if(this.currentPage-3+i > this.pagesCount){
							break;
						}
						pageItem.count = this.currentPage-3+i;
						pageItem.isActive = (this.currentPage == pageItem.count);
						pageItem.isHidden = false;
						pageArray.push(pageItem);
					}
					if(this.currentPage+2 < this.pagesCount-3){
						//有隐藏
						var pageItem = {};
						pageItem.count = '';
						pageItem.isActive = false;
						pageItem.isHidden = true;
						pageArray.push(pageItem);
						for(var i=1;i>=0;i--){
							var pageItem = {};
							pageItem.count = pagesCount-i;
							pageItem.isActive = false;
							pageItem.isHidden = false;
							pageArray.push(pageItem);
						}
						return pageArray;
					}else{
						for(var i=this.currentPage+3;i<=this.pagesCount;i++){
							var pageItem = {};
							pageItem.count = i;
							pageItem.isActive =  (this.currentPage == pageItem.count);
							pageItem.isHidden = false;
							pageArray.push(pageItem);
						}
						return pageArray;
					}
				}
		            }
	        	},
	        	methods:{
	        		jumpPage: function(count) {
	        			this.currentPage = count;
		                	this.$emit('jumpPage',count);
	            	}
	        	}
	}
</script>