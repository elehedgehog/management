<template>
	<div class="article">
		<header class="article_head">
			<div class="article_head_con">
				<div class="article_head_left">风铃知讯</div>
				<div class="article_head_right">
					<span>{{ username }}</span> | <span @click="loginOut">退出</span>
				</div>
			</div>
		</header>
		<div class="article_con">
			<div class="article_con_left">
				<ul>
					<li :class="{'on': currentOpt === 'manage'}" @click="province = null, toggleView('manage')">文章管理</li>
					<li :class="{'on': currentOpt === 'compile'}" @click="toggleView('compile')">{{ Object.keys(news).length ? '编辑文章' : '添加文章' }}</li>
				</ul>
			</div>
			<div class="article_con_right">
				<components :is="manageView" :toggleView="toggleView" :changeNews="changeNews" :province="province"></components>
				<components :is="compileView" :toggleView="toggleView" :news="news" :changeProv="changeProv"></components>
			</div>
		</div>
	</div>
</template>

<script>
import ArticleManage from './articleManage'
import CompileArticle from './compileArticle'
//import PublishArticle from './publishArticle'

export default {
	props: ['username','loginOut'],

	data() {
		return {
			currentOpt: null,
			manageView: null,
			compileView: null,
			news: {},
			province: null,
		}
	},

	methods: {
		toggleView(key) {
			if(this.currentOpt === key) return;
			this.currentOpt = key;
			if(key === 'manage') {
				this.news = {};
				this.manageView = ArticleManage
				this.compileView = null
			} else if(key === 'compile'){
				this.manageView = null
				this.compileView = CompileArticle
			}
		},
		changeNews(news) {
			if(Object.keys(news).length) this.news = { ...news };
			else this.news = {};
		},
		changeProv(province) {
			this.province = province
		}
	},

	mounted () {
		this.currentOpt = 'manage';
		this.manageView = ArticleManage;
	},
}
</script>

<style lang="scss" scoped>
	.article{
		position: absolute;
		left: 0;
		top: 0;
		min-height: 100%;
		min-width: 1300px;
		overflow: auto;
		width: 100%;
		font-family: "Microsoft YaHei";
		background-color: #EDF4F6;
	}
	.article_head{
		height: 65px;
		background:linear-gradient(to right, #55efcb,#5bcaff);
		background: -moz-linear-gradient(to right, #55efcb,#5bcaff);
		background: -webkit-linear-gradient(to right, #55efcb,#5bcaff);
		background: -o-linear-gradient(to right, #55efcb,#5bcaff);
		background: -ms-linear-gradient(to right, #55efcb,#5bcaff);
	}
	.article_head_con{
		width: 1300px;
		height: 100%;
		margin: 0 auto;
		color: white;
		line-height: 65px;
		background-image: url("../../../static/img/article_img/home_logo.png");
		background-repeat: no-repeat;
		-webkit-background-size:36px 45px;
		background-size:36px 45px;
		background-position: 52px center;
	}
	.article_head_left{
		font-size: 28px;
		float: left;
		padding-left: 109px;
	}
	.article_head_right{
		font-size: 20px;
		float: right;
		span:nth-child(2){
			cursor: pointer;
		}
	}

	.article_con{
		width:1400px;
		height: 860px;
		margin: 0 auto;
		margin-top: 20px;
		background-color: #fff;
		-webkit-box-shadow: 0px 0px 20px rgba(18, 75, 84, 0.2);
		-moz-box-shadow: 0px 0px 20px rgba(18, 75, 84, 0.2);
		box-shadow: 0px 0px 20px rgba(18, 75, 84, 0.2);
	}
	.article_con_left{
		width: 200px;
		height: 100%;
		float: left;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		border-right: 1px solid #bdc6c3;
	}
	.article_con_left > ul{
		width:100%;
		height: auto;
		margin-top: 60px;
	}
	.article_con_left > ul > li{
		height: 60px;
		line-height: 60px;
		text-align: center;
		font-size: 22px;
		color: #1C1C1C;
		cursor: pointer;
		&.on { color: #58cdc7; }
	}
	.article_con_left > ul > li >a{
		color: inherit;
	}
	.article_con_right{
		width: 1200px;
		height: 100%;
		float: left;
	}
</style>