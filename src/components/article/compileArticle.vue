<template>
	<div class="compileArticle">
		<div class="compileConten">
			<h3 class="compileTitle" >
				<span v-text="compileTitle"></span>
				<!-- <i class="clossPublish"></i> -->
			</h3>
			<div class="compileMain">
				<div class="compileMain_left">
					<div class="left_titleTop">标题</div>
					<input type="text" class="article_title_content" v-model="title" placeholder="请填写标题">
					<div class="clearfix provinceArea">
						<div class="right_provinces">区域</div>
						<select name="" id="" class="right_select" v-model="initialArea">
							<option :value="item" v-for="item of provinces">{{ item }}</option>
						</select>
					</div>
					<div class="left_titleBot">文章封面</div>
					<div class="left_img">
						<img :src="picLoad" alt="">

						<div class="insertUrl" v-show="inputUrlPopup">
							<ul class="insertUrl_title"><li>请输入图片链接</li></ul>
							<div class="insertUrl_imgUrl">
								<div class="insertUrl_imgUrlIn">
									<input type="text" placeholder="图片链接" v-model="picUrl">
									<div class="insertButton"><button @click="insertPic">插入</button></div>
								</div>
							</div>
						</div>
					</div>
					<div class="upLoadImg" @click="inputUrlPopup = !inputUrlPopup">上传图片</div>
					
					<!-- <form class="imgLoad" action="" method="post" enctype="multipart/form-data" name="upload_form">
						<label>
							上传图片
							<input name="imgfile" id="picLoad" type="file" />
						</label>
					</form> -->
				</div>
				<div class="compileMain_right">
					<p class="articleIntro">简介</p>
					<textarea class="textarea1" name="articleIntro" cols="20" rows="5" 
							:placeholder="descPlaceholder" v-model="description" @focus="descPlaceholder = ''" @blur="descPlaceholder = '请填写简介'"></textarea>
					<p class="mainBody"><span>正文</span></p>
					<div id="mainBody_content">
						
					</div>
					<div class="btnList">
						<Btn type="primary" @click="createPlish">发布</Btn>
						<Btn type="ghost" @click="preview">预览</Btn>
					</div>
				</div>
			</div>
		</div>

		<!--<div class="alertPopup">输入内容不得为空</div>-->
	</div>
</template>

<script>
import $ from 'jquery';
import Btn from 'iview/src/components/button'
import E from 'wangeditor';
import moment from 'moment';
import { newsClient } from '../../util/ClientHelper';
	
export default {
	props: ['toggleView', 'news', 'changeProv'],

	components:{
		Btn,
	},

	data(){
		return {
			compileTitle: '标题',
			initialArea: null,            //区域选择初始区域显示
			provinces: [],                //区域名称列表
			editorObject: {},				//富文本编辑器对象；
			fileObj: '',
			picLoad: '',						//上传的图片对象；
			inputUrlPopup: false,
			picUrl: null,              //图片链接
			title: null,              //标题
			description: null,			//简介
			descPlaceholder: '请填写简介',

			addArticleBool: true,			//true为新增文章  false为编辑文章
		}
	},
		
	methods:{
		async getNewsList() {
			let data = await newsClient.getNewsList();
			for(let item of data){
				this.provinces.push(item.province);
			}
			if(this.addArticleBool) {			//新增时 初始化全国为当前区域
				let lastIndex = data.length - 1;
				this.initialArea = this.provinces[lastIndex];
			} else {
				this.initialArea = this.news.area;
			}
		},

		async addNews() {
			const province = this.initialArea,
				  content = this.description,
				  pic = this.picUrl,
				  title = this.title, 
				  published = false;
			let text = this.editorObject.txt.html();
				 
		    text = `
				<!Doctype html>
				<html>
					<head>
						<meta charset="utf-8">
						<meta http-equiv="X-UA-Compatible" content="IE=edge">
						<meta name="viewport" content="width=device-width, initial-scale=1">
						<title>${content}</title>
					</head>
					<body>
						<h3 class="text-center">${content}</h3>
						<p class="timecolor" style="color: darkgray">风铃资讯 ${moment().format('YYYY-MM-DD hh:mm')}</p>
						${text}
					</body>
				</html>
			`;
			// text = text.replace(/max\-width\:100\%\;/g, 'max-width:1079px;');
			console.log(text)
			let resAddNews = await newsClient.addNews(province, content, pic, title, text, published);
			if(resAddNews){
				this.toggleView('manage');
			} else {
				alert('添加失败');
			}
		},
		async modifyNews() {
			const province = this.initialArea,
				  content = this.description,
				  pic = this.picUrl,
				  title = this.title, 
				  published = this.news.published,
				  newsid = this.news.newsid;
			let text = this.editorObject.txt.html();
			// text = text.replace(/max\-width\:100\%\;/g, 'max-width:1079px;');
			let res = newsClient.modifyNews(province, content, pic, title, text, published, newsid);
			if(res) {
				this.changeProv(province)
				this.toggleView('manage');
			} else {
				alert('修改失败');
			}
			console.log(text)
		},


		//创建编辑器
		async createEditor() {
			let editor = new E('#mainBody_content');
			editor.customConfig.menuFixed = true;
			editor.customConfig.menus = [
				    'head',  // 标题
					'bold',  // 粗体
					'italic',  // 斜体
					'underline',  // 下划线
					'foreColor',  // 文字颜色
					'backColor',  // 背景颜色
					'link',  // 插入链接
					'list',  // 列表
					'justify',  // 对齐方式
					'quote',  // 引用
					'image',  // 插入图片
					// 'table',  // 表格
					//'video',  // 插入视频
					//'undo',  // 撤销
			];
			editor.create();
			this.editorObject = editor;
			if(Object.keys(this.news).length) {
				let msg = await newsClient.getNewsCon(this.news.area, this.news.newsid);
				//清除js css
				msg = msg.replace(/\<script.*\<\/script\>/g, '')
				msg = msg.replace(/\<link.*\>/g, '')
				// msg = msg.replace(/max\-width\:1079px/g, 'max-width:100%;')
				editor.txt.html(msg);
				console.log(msg)
			} 
		},
		//上传图片
		// uploadPictures() {
		// 	var self=this;
		// 	//这边是判断本浏览器是否支持这个API。
		// 	if(typeof FileReader==='undefined') {
		// 		alert("抱歉，你的浏览器不支持 FileReader");
		// 		self.fileObj.setAttribute('disabled','disabled');
		// 	} else {
		// 		self.fileObj.addEventListener('change',readFile,false); //如果支持就监听改变事件，一旦改变了就运行readFile函数。
		// 	}
		// 	function readFile() {
		// 		var file = this.files[0]; //获取file对象
		// 		//判断file的类型是不是图片类型。
		// 		if(!/image\/\w+/.test(file.type)) {
		// 				alert("文件必须为图片！");
		// 				return false;
		// 		}

		// 		var reader = new FileReader(); //声明一个FileReader实例
		// 		reader.readAsDataURL(file); //调用readAsDataURL方法来读取选中的图像文件
		// 		//最后在onload事件中，获取到成功读取的文件内容，并以插入一个img节点的方式显示选中的图片
		// 		reader.onload = function(e){
		// 				self.picLoad = this.result;
		// 		}
		// 	}
		// },

		preview() {			//预览
		const content = this.editorObject.txt.html();
		let view = window.open('about:blank');
		view.document.write(content);
		view.document.close();
		},
		insertPic() {
			this.inputUrlPopup = false;
			this.picLoad = this.picUrl;
		},
		async createPlish() {     //生成发布
			let inputContent = this.editorObject.txt.html()
			// if(!this.title || !this.picUrl || !this.initialArea || !this.description || !inputContent){   //判断内容是否为空
			if(!this.title || !this.initialArea || !this.description || !inputContent){   //判断内容是否为空
				alert('输入内容不得为空');
				return;
			}
			if(this.addArticleBool) {			//当前为新增文章
				this.addNews();
			} else {										//当前为编辑文章
				if(this.initialArea === this.news.area) {		//不修改区域时 执行修改操作
					this.modifyNews()
				} else {		//修改区域时 执行新区域的新增 旧区域的删除操作
					newsClient.removeNews(this.news.area, this.news.newsid);			//删除
					const province = this.initialArea,
							content = this.description,
							pic = this.picUrl,
							title = this.title, 
							published = true;
					let text = this.editorObject.txt.html();
					// text = text.replace(/max\-width\:100\%\;/g, 'max-width:1079px;');
					let res = await newsClient.addNews(province, content, pic, title, text, published);
					if(res){
						this.changeProv(province)
						this.toggleView('manage')
					} else {
						alert('修改失败');
					}
				}
			} 
		},
	},

	mounted() {
		this.fileObj = document.getElementById('picLoad');
		this.createEditor();			//创建富文本编辑器
		//this.uploadPictures();		//上传图片
		this.getNewsList();

		if(Object.keys(this.news).length) {
			this.addArticleBool = false;
			this.title = this.news.title;
			this.picLoad = this.news.pic;
			this.picUrl = this.news.pic;
			this.description = this.news.content;
		} else {
			this.addArticleBool = true;
		}
	},
}
</script>

<style lang="scss" scoped>
	.compileArticle{
		width:1200px;
		font-family: "Microsoft YaHei";
	}
	.compileConten{
		width:1200px;
		height:880px;
		-webkit-box-shadow: 0px 0px 20px rgba(18, 75, 84, 0.2);
		-moz-box-shadow: 0px 0px 20px rgba(18, 75, 84, 0.2);
		box-shadow: 0px 0px 20px rgba(18, 75, 84, 0.2);
		margin:0 auto;
		margin-top: 0px;
		padding-left: 40px;
	}
	.compileTitle{
		height:100px;
		line-height: 100px;
		text-align: left;
		font-size: 28px;
		color: #1c1c1c;
		font-weight: 600;
	}
	.clossPublish{
		width: 32px;
		height:34px;
		float: right;
		background-image: url("../../../static/img/article_img/home_close.png");
		background-repeat: no-repeat;
		-webkit-background-size:contain;
		background-size:contain;
		margin-top:37px;
		margin-right:37px;
	}
	.compileMain{
		width:100%;
	}
	.compileMain > div{
		float: left;
		height:100%;
	}
	.compileMain .compileMain_left{
		width:420px;
	}

	.left_titleTop{
		height:40px;
		line-height: 40px;
		color: #575757;
		font-size: 18px;
	}
	.left_titleBot{
		height:40px;
		line-height: 40px;
		color: #575757;
		font-size: 18px;
	}
	.compileMain .compileMain_left .left_img{
		position: relative;
		width:420px;
		height: 320px;
		-webkit-box-shadow: 0px 0px 5px rgba(18, 75, 84, 0.2);
		-moz-box-shadow: 0px 0px 5px rgba(18, 75, 84, 0.2);
		box-shadow: 0px 0px 5px rgba(18, 75, 84, 0.2);
		padding: 10px;
		background-color: #eff4f5;
		-webkit-background-clip: no-clip;
		-moz-background-clip: no-clip;
		background-clip: content-box;
		border: 1px solid rgba(18, 75, 84, 0.2);
		margin-top: 10px;
	}
	.compileMain .compileMain_left .left_img img{
		width: 100%;
		height: 100%;
	}
	.imgLoad{
		width: 100%;
		height:50px;
		background-color: #eff4f5;
		margin-top: 20px;
	}
	.imgLoad label{
		width: 420px;
		height: 50px;
		display: block;
		line-height: 50px;
		text-align: center;
		color: #575757;
		font-size: 24px;
	}
	.imgLoad label input{
		width: 0;
		height: 0;
		float: left;
		
	}

	.upLoadImg{
		width: 100%;
		height:50px;
		line-height: 50px; 
		background-color: #eff4f5;
		margin-top: 20px;
		text-align: center;
		cursor: pointer;
	}
	.insertUrl{
		position: absolute;
		top:50%;
		left: 50%;
		transform: translate(-50%,-50%);
		
		background-color: #fff;
		width: 300px;
		height: 130px;
		box-shadow: 1px 1px 2px #ccc;
		.insertUrl_title{
			list-style: none;
			font-size: 14px;
			margin: 2px 10px 0 10px;
   		    border-bottom: 1px solid #f1f1f1;
		},
		.insertUrl_imgUrl{
			padding: 10px 15px 10px 15px!important;
    		font-size: 16px;
			.insertUrl_imgUrlIn{
				padding: 0;
				margin: 0;
				box-sizing: border-box;
				input{
					display: block;
					width: 100%;
					margin: 10px 0;
					border: none;
					border-bottom: 1px solid #ccc;
					font-size: 14px;
					height: 20px;
					color: #333;
					text-align: left;
					&:focus { border-bottom: 1px solid #58CDC7 }
				},
				.insertButton{
					padding: 0;
					margin: 0;
					box-sizing: border-box;
					button{
						float: right;
						margin-left: 10px;
						font-size: 14px;
						color: #58CDC7;
						border: none;
						padding: 5px 10px;
						background-color: #fff;
						cursor: pointer;
						border-radius: 3px;
					}

				}
			
			}
			
		}

	}

	.compileMain .compileMain_right{
		width: 600px;
		margin-left: 80px;
	}
	.provinceArea{
		margin: 20px 0;
	}
	.right_provinces{
		height:40px;
		line-height: 40px;
		color: #575757;
		font-size: 18px;
		// float: left;
	}
	.right_select{
		// float: left;
		// margin-left: 20px;
		width:200px;
		height: 38px;
		border: 2px solid #eaf0f1;
		color: #575757;
		cursor: pointer;
	}
	
	.article_title_content{
		height: 38px;
		border: 2px solid #eaf0f1;
		margin-top: 12px;
		width: 100%;
		text-indent: 1em;
	}
	.articleIntro{
		height: 40px;
		line-height: 40px;
		color: #575757;
		font-size: 18px;
		margin-top: 10px;
		// margin-bottom: 10px;
		
	}
	.compileMain_right .textarea1{
		padding: 15px;
		width: calc(100% - 30px);
		height: 138px;
		border: 2px solid #eaf0f1;
		outline: none;
		resize: none;
		text-align: left;
		&:focus { text-indent: 2em; }
	}
	.mainBody{
		width: 100%;
		height: 50px;
		line-height: 50px;
	}
	.mainBody >span:first-child{
		color: #575757; 
	}
	.mainBody >span:last-child{
		color:#989898;
	}
	#mainBody_content{
		width: 600px;
		height: 438px;
		overflow: auto;
		padding: 0;
		margin: 0 auto;
	}
	.wangEditor-container{
		border: 2px solid #eaf0f1 !important;
	}
	.btnList{
		padding-left: 40px;
	}

	.alertPopup{

	}
</style>

<style lang="scss">
	.w-e-droplist {
		z-index: 10001;
	}
</style>
