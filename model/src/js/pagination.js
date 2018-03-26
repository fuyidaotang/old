function initPagination(vue){
	var pageSize = vue.pageSize;
	var currentPage = vue.currentPage;
	var countNum = vue.countNum;
	vue.pageArray = initPageArray(pageSize,currentPage,countNum);
}

function initPageArray(pageSize,currentPage,countNum){
	var pageArray = [];
	//页数
	var pagesCount = Math.ceil(countNum/pageSize);
	if(pagesCount<=8){
		for(var i=1;i<=pagesCount;i++){
			var pageItem = {};
			pageItem.count = i;
			pageItem.isActive = (currentPage == pageItem.count);
			pageItem.isHidden = false;
			pageArray.push(pageItem);
		}
		return pageArray;
	}else if(currentPage<=3){
		for(var i=1;i<=5;i++){
			var pageItem = {};
			pageItem.count = i;
			pageItem.isActive = (currentPage == i);
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
			pageItem.count = pagesCount-i;
			pageItem.isActive = false;
			pageItem.isHidden = false;
			pageArray.push(pageItem);
		}
		return pageArray;
	}else{
		if(currentPage == 4){
			var pageItem = {};
			pageItem.count = 1;
			pageItem.isActive = false;
			pageItem.isHidden = false;
			pageArray.push(pageItem);
		}else if(currentPage >4){
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
			if(currentPage-3+i > pagesCount){
				break;
			}
			pageItem.count = currentPage-3+i;
			pageItem.isActive = (currentPage == pageItem.count);
			pageItem.isHidden = false;
			pageArray.push(pageItem);
		}
		if(currentPage+2 < pagesCount-3){
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
			for(var i=currentPage+3;i<=pagesCount;i++){
				console.log(currentPage);
				var pageItem = {};
				pageItem.count = i;
				pageItem.isActive =  (currentPage == pageItem.count);
				pageItem.isHidden = false;
				pageArray.push(pageItem);
			}
			return pageArray;
		}
	}
}

module.exports = initPagination;