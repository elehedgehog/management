<template>
	<div class="login">
		<div class="content">
			<div class="content_left">
				<div class="title_img"></div>
				<div class="title_text">风铃知讯后台管理中心</div>
			</div>
			<div class="content-right">
				<h4 class="content-right_up">用&nbsp;&nbsp;户&nbsp;&nbsp;登&nbsp;&nbsp;录</h4>
				<div class="content-right_down">
					<ul>
						<li class="user">
							<span>账号</span>
							<div class="input_div">
								<input type="text" @blur="userBlur" v-model="userText">
								<i v-bind:class="{'current0': userT, 'current1': userF}"></i>
							</div>
						</li>
						<li class="password">
							<span>密码</span>
							<div class="input_div">
								<input type="password" @blur="passwordBlur" v-model="password">
								<i v-bind:class="{'current0':passwordTF, 'current1': passwordFA}"></i>
							</div>
							<div class="password_sel">
								<i @click="keepPassword" v-bind:class="{'current3':passwordSelTF}"></i>
								<span>记住密码</span>
							</div>
						</li>
					</ul>
					<div class="login_btn">
						<span @click="goInArticle">登&nbsp;&nbsp;录</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import fetchJsonp from 'fetch-jsonp'
	import { userClient } from '../util/ClientHelper'

	export default {
		props: ['loginFn'],

		data(){
			return {
				userT: false,							//确认登录名是否正确
				userF: false,							//确认登录名是否正确
				passwordTF: false,				//确认密码是否填写；
				passwordFA: false,				//确认密码是否填写；
				passwordSelTF: false,			//标记记住密码选项
				userText: '',							//账号
				password: '',							//密码
			}
		},
		
		methods: {
			//登录 转页面
			async goInArticle() {
				const username = this.userText,
					password = this.password;
				if(username === '' || password === '' ) {
					alert('用户名密码不得为空');
					return;
				}
				let resIn = await userClient.loginIn(username, password);
				if(resIn)
					this.loginSuccess(resIn);
				else
					this.loginFail();
			},
			loginSuccess(resIn) {
				const username = this.userText,
					password = this.password;
				this.loginFn(username, resIn.userId);
				if(this.passwordSelTF) {
					localStorage.username = username;
					localStorage.password = password;
				} else {
					if(localStorage.username) {
						localStorage.removeItem('username');
						localStorage.removeItem('password');
					}
				}
			},
			loginFail() {
				alert('登录失败');
				
			},
			//点击记住密码；
			keepPassword() {
				this.passwordSelTF = !this.passwordSelTF;
			},
			//用户名文本失去焦点；
			userBlur() {
				if(this.userText.length) {
					this.userT = true;
					this.userF = false;
				} else {
					this.userT = false;
					this.userF = true;
				}
			},
			//密码文本框失去焦点；
			passwordBlur() {
				// this.passwordTF = this.password.length ? true : false;
				if(this.password.length) {
					this.passwordTF = true;
					this.passwordFA = false;
				} else {
					this.passwordTF = false;
					this.passwordFA = true;
				}
			},
		},

		mounted() {
			if(localStorage.username) {
				this.userText = localStorage.username;
				this.password = localStorage.password;
				this.passwordSelTF = true;
			}
		}
			
	}
</script>

<style lang="scss" scoped>
	.login{
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, #5bcaff,#55efcb);
		background: -moz-linear-gradient(135deg, #5bcaff,#55efcb);
		background: -webkit-linear-gradient(135deg, #5bcaff,#55efcb);
		background: -o-linear-gradient(135deg, #5bcaff,#55efcb);
		background: -ms-linear-gradient(135deg, #5bcaff,#55efcb);
		border: 1px solid transparent ;
		font-family:"Microsoft YaHei";
	}
	.content{
		position:absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width:1334px;
		height:748px;
		background-image: url("../../static/img/login_bg.png");
		background-repeat: no-repeat;
		-webkit-background-size:1334px 748px;
		background-size:1334px 748px;
		// margin: 0 auto;
		// margin-top: 166px;
	}
	.content_left{
		width: 616px;
		height:100%;
		float: left;
		text-align: center;
		font-size: 22px;
	}
	.title_img{
		margin-top: 268px;
		height: 138px;
		background-image: url("../../static/img/login_logo.png");
		background-position: center;
		background-repeat: no-repeat;
		-webkit-background-size: 138px;
		background-size: 138px;
	}
	.title_text{
		color: #ffffff;
		font-size: 22px;
	}
	.content-right{
		// position: relative;
		width: 718px;
		height:100%;
		float: left;
	}
	.content-right_up{
		font-size: 28px;
		color: #58cdc7;
		text-align: center;
		margin-top: 153px;
	}
	.content-right_down{
		// position: absolute;
		height:450px;
		// transform: translate(-50%, -50%);
		padding-left: 196px;
		margin-top: 38px;
	}
	.content-right_down > ul >li{
		height:140px;
	}
	.content-right_down > ul >li > span{
		color:  #58cdc7;
		font-size: 18px;
		display: block;
		height: 36px;
		line-height: 36px;
	}
	.content-right_down > ul >li > .input_div{
		height: 50px;
		-webkit-background-size:26px;
		background-size:26px;
		background-position: left center;
		background-repeat:no-repeat;
	}
	.content-right_down > ul >li.user > .input_div{
		background-image: url("../../static/img/login_account.png");
	}
	.content-right_down > ul >li.password > .input_div{
		background-image: url("../../static/img/login_password.png");
	}
	.content-right_down > ul >li > .input_div > input{
		border-bottom: 1px solid #58cdc7;
		float: left;
		height: 50px;
		background: transparent;
		text-indent: 50px;
		width: 316px;
		font-size: 18px;
	}
	.content-right_down > ul >li > .input_div > i{
		float: left;
		margin-left: 20px;
		width: 26px;
		height:26px;
		background-position: center;
		-webkit-background-size:contain;
		background-size:contain;
		background-repeat:no-repeat;
		margin-top: 12px;
	}
	.content-right_down > ul >li > .input_div > i.current0{
		background-image: url("../../static/img/login_right.png");
	}
	.content-right_down > ul >li > .input_div > i.current1{
		background-image: url("../../static/img/login_error.png");
	}
	.content-right_down > ul >li > .password_sel{
		height: 16px;
		margin-top: 30px;
	}
	.content-right_down > ul >li > .password_sel > i{
		width: 16px;
		height: 16px;
		float: left;
		margin-left: 236px;
		background-image: url("../../static/img/login_chb.png");
		background-repeat: no-repeat;
		-webkit-background-size:contain;
		background-size:contain;
		margin-top: 0px;
		margin-right: 10px;
	}
	.content-right_down > ul >li > .password_sel > i.current3{
		background-image: url("../../static/img/login_chb_pre.png");
	}
	.content-right_down > ul >li > .password_sel > span{
		color: #acb4b7;
		float: left;
		font-size: 14px;
		line-height: 16px;
	}
	.content-right_down .login_btn{
		margin: 10px 0 0 15px;
		width: 296px;
		height: 52px;
		line-height: 52px;
		color: #fff;
		font-size: 18px;
		text-align: center;
		background: #58cdc7;
		cursor: pointer;
		border-radius: 20px;
		box-shadow: 0 2px 0 3px #eee;
		&:hover { background: rgba(88, 205, 199, 0.8); }
	}
</style>