<template>
	<div class="articleManage">
		<h3>文章管理</h3>
		<div class="pull">
			<div class="pull_pro" @mouseenter="areaPopup=true" @mouseleave="areaPopup=false">
				<span>{{selectedArea ? selectedArea : '区域'}}</span>
				<ul v-show="areaPopup">
					<li v-for="item of provinces" @click="toggleArea(item)" :class="{'on': selectedArea === item}">{{ item }}</li>
				</ul>
			</div>
			<div class="pull_con" @mouseenter="statusPopup=true" @mouseleave="statusPopup=false">
				<span>{{opt}}</span>
				<ul v-show="statusPopup">
					<li @click="allPublished" :class="{'on': opt === '全部'}">全部</li>
					<li @click="togglePublished(true)" :class="{'on': opt === '已发布'}">已发布</li>
					<li @click="togglePublished(false)" :class="{'on': opt === '未发布'}">未发布</li>
				</ul>
			</div>
			
		<div class="pull_search">
				<input type="text" placeholder="搜索" v-model="keyword">
				<Icon type="ios-search-strong"></Icon>
			</div>
		</div>
		<div class="loading" v-show="loadPopup">
			<span class="loading_img"></span>
		</div>
		<div class="articleList">
			<dl v-for="news of dealNewsList">
				<dt ><a :href="news.url" target="blank"><img :src="news.pic" alt=""></a></dt>
				<dd>
					<div class="dd_left">
						<a :href="news.url + '?cacheCtrl=' + new Date().getTime()" target="blank"><p>{{ news.title }}</p></a>
						<span>{{ news.date }}</span>
					</div>
					<span :class="[{ 'on': !news.published }, 'dd_middle']">{{ news.published ? '已发布' : '未发布' }}</span>
					<div class="dd_right">
						<span @click="publishArticle(news)" :class="{'forbiden': news.published}">发布</span>
						<span @click="editorArticle(news)">编辑</span>
						<span @click="removeArticle(news.newsid)">删除</span>
					</div>
				</dd>
			</dl>
		</div>
		<div class="article_page" v-show="articlePagePopup">
			<div class="pageTotal">共<span>{{ allPages }}</span>页</div>
			<Page :total="allListLen" :page-size="5" :current="currentPage" size="small" class-name="page" @on-change="togglePage"></Page>
		</div>
	</div>
</template>

<script>
import Page from 'iview/src/components/page';
import Icon from 'iview/src/components/icon';
import { newsClient } from '../../util/ClientHelper';

export default {
	props: ['toggleView', 'changeNews', 'province'],
	components: {
		Page,
		Icon,
	},
	data(){
		return {
			//articleState: false,
			opt: '全部',
			selectedArea: null,         //选中区域名称
			provinces: [],              //区域名称列表
			allNewsList: {},            //所有区域新闻列表
			newsList: [],				//当前区域所有新闻列表
			showList: [],				//展示的新闻列表
			dealNewsList: [],			//当前页数的新闻列表
			currentPage: 1,
			allListLen: 0,
			allPages: 0,
			keyword: null,
			statusPopup: false,
			areaPopup: false,
			loadPopup: true,         //加载标志显示
			articlePagePopup: false,   //分页隐藏
		}
	},

	methods: {
		togglePage(num) {
			this.currentPage = num;
			this.operaList();
		},
		//获取新闻列表
		async getNewsList(bool) {			//bool 定义 true 则不修改当前页数
			let data = await newsClient.getNewsList();
			this.loadPopup = false;        //加载标志隐藏
			this.articlePagePopup = true;   //分页显示
			console.log(data)
			if(!data) return;
			for(let item of data) {
				this.allNewsList[item.province] = item;
				this.provinces.push(item.province);
			}

			let lastIndex = data.length - 1;
			if(!this.selectedArea) {
				if(this.province) this.selectedArea = this.province
				else this.selectedArea = this.provinces[lastIndex]		//初始化当前区域   取最后一个 全国
			}
			this.toggleArea(this.selectedArea, bool);
		},


		calcAllPages() { 		//计算总数据长度 总页数
			this.allListLen = this.showList.length;
			this.allPages = Math.ceil(this.allListLen/5);
		},
		operaList() {			//显示当前页数的新闻列表
			let index = (this.currentPage - 1)*5;
			this.dealNewsList = this.showList.slice().splice(index,5);
			console.log(this.dealNewsList);
		},

		allPublished() {
			this.opt = '全部';
			this.statusPopup = false;
			if(this.keyword) {
				this.showList = [];
				this.newsList.map(item =>{
					let newsTitle = item.title;
					let reg = new RegExp(this.keyword);
					if(reg.test(newsTitle))
						this.showList.push(item);
				});
			} else {
				this.showList = this.newsList.slice();
			}
			this.currentPage = 1;    //回到第一页
			this.calcAllPages();      //重新计算页数
			this.operaList();       //重新获取新闻列表
		},

		togglePublished(bool) {
			this.opt = bool ? '已发布' : '未发布';
			this.statusPopup = false;
			this.showList = [];
			if(this.keyword){
				this.newsList.map(item => {
					let newsTitle = item.title;
					let reg = new RegExp(this.keyword);
					if(reg.test(newsTitle) && item.published === bool){
						this.showList.push(item);
					}
				});
			} else {
				this.newsList.map(item => {
					if(item.published === bool) {
						this.showList.push(item);
					}
				});
			}
			this.currentPage = 1;    //回到第一页
			this.calcAllPages();      //重新计算页数
			this.operaList();       //重新获取新闻列表
		},
		toggleArea(area, bool) {
			this.opt = '全部';
			this.keyword = null;
			this.selectedArea = area;
			this.areaPopup = false;
			this.newsList = this.allNewsList[area].news;
			this.showList = this.allNewsList[area].news;
			this.calcAllPages();
			if(!bool) {		//恢复到第一页
				this.currentPage = 1;
			} else {      //删除文章后当前页面超过总页数 显示总页数
				if(this.currentPage > this.allPages) this.currentPage = this.allPages;
			}
			this.operaList();
		},

		async publishArticle(news) {     //发布文章按钮
			if(news.published) return;
			let text = await newsClient.getNewsCon(this.selectedArea, news.newsid);
			let published = true;
			this.modifyNews(this.selectedArea, news.content, news.pic, news.title, text, published, news.newsid);
		},
		//发布新闻
		async modifyNews(province, content, pic, title, text, published, newsid) {
			let data = await newsClient.modifyNews(province, content, pic, title, text, published, newsid);
			if(data) this.getNewsList(true);			
			else alert('发布失败');
		},
		//编辑新闻
		editorArticle(news) {
			this.changeNews(Object.assign({ area: this.selectedArea }, news));
			this.toggleView('compile');
		},
		//删除新闻
		async removeArticle(newsid) {
			let province = this.selectedArea;
			let data = await newsClient.removeNews(province, newsid);
			if(data) this.getNewsList(true);
			else alert('删除失败');
		},
	},

	watch: {
		keyword(val) {
			if(this.opt === '全部') {
				this.allPublished();
			} else {
				let bool = this.opt === '已发布' ? true : false; 
				this.togglePublished(bool);
			}
		}
	},

	mounted() {
		this.getNewsList();
	}
}
</script>

<style lang="scss" scoped>
	.articleManage{
		height: 100%;
		font-family: "Microsoft YaHei";
		padding-left: 78px;
	}
	.articleManage h3{
		height: 100px;
		line-height: 100px;
		font-size: 26px;
		color: #1c1c1c;
	}
	.articleManage .pull{
		height: 50px;
	}
	.articleManage .pull .pull_con{
		position: relative;
		float: left;
		width: 160px;
		height: 35px;
		line-height: 35px;
		text-align: center;
		-webkit-box-shadow: 0px 0px 5px #aaaaaa;
		-moz-box-shadow: 0px 0px 5px #aaaaaa;
		box-shadow: 0px 0px 3px #aaaaaa;
		padding-left: 10px;
		color: #575757;
		font-size: 16px;
		margin-top: 5px;
		margin-left: 30px;
		cursor: pointer;
	}
	.articleManage .pull .pull_con > span{
		margin-left: -20px;
	}
	.articleManage .pull .pull_con > span:after{
		content: '';
		display: inline-block;
		width: 13px;
		height:7px;
		background-image:url("../../../static/img/article_img/home_cbb_pre.png");
		background-repeat: no-repeat;
		-webkit-background-size:16px 10px;
		background-size:16px 10px;
		background-position: center;
		position: absolute;
		top: 16px;
		right: 15px;
	}
	.articleManage .pull .pull_con ul{
		position: absolute;
		left: 0;
		top: 35px;
		width: 100%;
		height: 120px;
		-webkit-box-shadow: 0px 0px 5px #aaaaaa;
		-moz-box-shadow: 0px 0px 5px #aaaaaa;
		box-shadow: 0px 0px 5px #aaaaaa;
		overflow: hidden;
		z-index: 10;
		background-color: white;
	}
	.articleManage .pull .pull_con ul li{
		height:40px;
		line-height: 40px;
		&:hover,&.on {
			background-color: #58CDC7;
			color: #fff;
		}
	}
	.pull .pull_pro{
		float: left;
		cursor: pointer;
		min-width: 160px;
		height: 35px;
		line-height: 35px;
		-webkit-box-shadow: 0px 0px 5px #aaaaaa;
		-moz-box-shadow: 0px 0px 5px #aaaaaa;
		box-shadow: 0px 0px 3px #aaaaaa;
		padding-left: 10px;
		color: #575757;
		font-size: 16px;
		position: relative;
		margin-top: 5px;
		text-align: center;
		
	}
	.pull .pull_pro > span{
		margin-left: -20px;
		padding: 0 40px;
	}
	.articleManage .pull .pull_pro > span:after{
		content: '';
		display: inline-block;
		width: 13px;
		height:7px;
		background-image:url("../../../static/img/article_img/home_cbb_pre.png");
		background-repeat: no-repeat;
		-webkit-background-size:16px 10px;
		background-size:16px 10px;
		background-position: center;
		position: absolute;
		top: 16px;
		right: 15px;
	}
	.articleManage .pull .pull_pro ul{
		position: absolute;
		left: 0;
		top: 35px;
		width: 100%;
		height: 200px;
		-webkit-box-shadow: 0px 0px 5px #aaaaaa;
		-moz-box-shadow: 0px 0px 5px #aaaaaa;
		box-shadow: 0px 0px 5px #aaaaaa;
		overflow: auto;
		z-index: 10;
		background-color: white;
		&::-webkit-scrollbar { width: 12px; }
		&::-webkit-scrollbar-thumb {
			background: #58cdc7;
			border-radius: 6px;
		}
		&::-webkit-scrollbar-track-piece { background: #E2E9EB; }
		li {
			height:40px;
			line-height: 40px;
			&:hover,&.on {
				background-color: #58CDC7;
				color: #fff;
			}
		}
	}
	// .articleManage .pull .pull_con:hover ul{
	// 	-webkit-transition: all 0.5s;
	// 	-moz-transition: all 0.5s;
	// 	-ms-transition: all 0.5s;
	// 	-o-transition: all 0.5s;
	// 	transition: all 0.5s;
	// 	height: 120px;
	// }
	.pull .pull_search{
		width:200px;
		height: 32px;
		background-color: #ecf2f3;
		border-radius: 18px;
		float: right;
		margin-right:90px;
		margin-top: 7px;
		text-align: center;
		line-height: 36px;
		color: #a3a3a3;
		font-size: 14px;
		position: relative;
		z-index: 10;
	}
	
	.pull .pull_search > .ivu-icon{
		position: absolute;
		left: 15px;
		top: 8px;
		font-size: 20px;
		vertical-align: middle;
		margin-right: 6px;
	}
	.pull .pull_search > input{
		position: absolute;
		left: calc(10% + 0.1rem);
		top:0;
		width: calc(80% - 0.1rem);
		height: 100%;
		background-color: transparent;
		text-align: center;
	}
	.articleList{
		margin-top: 10px;
		height:680px;
		padding-right: 80px;
	}
	.articleList >dl{
		width: 100%;
		height:130px;
		border-bottom: 1px solid #bdc6c3;
	}
	.articleList >dl > dt,.articleList >dl > dd{
		float: left;
	}
	.articleList >dl > dt{
		width:130px;
		height:100px;
		background: red;
		margin-top: 15px;
	}

	.articleList >dl > dt img{
		width: 100%;
		height:100%;
	}
	.articleList >dl > dd{
		width: 900px;
		height: 100%;
		padding-left: 20px;
	}
	.articleList >dl > dd .dd_left{
		float: left;
		width: 336px;
		text-align: justify;
		padding-top: 26px;
		a{
			text-decoration: none;
			&:link,&:visited{color: #1c1c1c}
			&:hover{color: #58cdc7}
			}
	}
	.articleList >dl > dd .dd_left p{
		width: 336px;
		font-size: 18px;
		line-height: 27px;
		height: 55px;
		overflow: hidden; /*自动隐藏文字*/
		display: -webkit-box !important;
		text-overflow: ellipsis;
		word-break: break-all;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		margin-bottom: 10px;
	}
	.articleList >dl > dd .dd_left span{
		font-size: 16px;
		color: #a3a3a3;
		text-align: left;
		line-height: 20px;
	}
	.articleList >dl > dd >.dd_middle{
		display: inline-block;
		color: #58cdc7;
		font-size: 18px;
		margin-left: 180px;
		margin-top: 60px;
		line-height: 30px;
		&.on{color: #a3a3a3}
	}
	.articleList >dl > dd >.dd_right{
		width:222px;
		height:35px;
		float: right;
		margin-top: 55px;
	}
	dl > dd >.dd_right > span{
		float: left;
		width: 74px;
		height: 100%;
		text-align: center;
		line-height: 35px;
	}
	dl > dd >.dd_right > span:first-child{
		background-color: #58CDC7;
		color: #fff;
		cursor: pointer;
		&:hover{background-color: rgba(88, 205, 199, 0.8)};
		&.forbiden { 
					background-color: #aaa;
					cursor: default;
					 }
	}
	dl > dd >.dd_right > span:nth-child(2){
		background-color: #E2E9EB;
		color: #1c1c1c;
		cursor: pointer;
		&:hover{background-color: rgba(226, 233, 235, 0.8)};
	}
	dl > dd >.dd_right > span:nth-child(3){
		background-color: #eb5a5a;
		color: #fff;
		cursor: pointer;
		&:hover{background-color: rgba(235, 90, 90, 0.8);}
	}

	.article_page{
		margin-top: -15px;
	}
	.page{
		float: right;
	}
	.pageTotal{
		float: right;
		font-size: 20px;
		margin-right: 80px;
		margin-left: 30px;
		margin-top: -4px;
		color: #a3a3a3;
	}
	.pageTotal span{
		color: #58CDC7;
	}
	.loading{
		position: absolute;
		z-index: 1000;
		margin-top: 10px;
		width: 55%;
		height:680px;
		padding-right: 80px;
		background: #fff;
		text-align: center;
		line-height:600px;
	}
	.loading_img{
		display: inline-block;
		background: url("../../../static/img/load.gif")no-repeat center center;
		width: 100px;
		height: 100px;
	}
</style>