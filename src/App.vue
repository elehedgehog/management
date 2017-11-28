<template>
  <div id="app">
    <components :loginFn="loginIn" :is="loginView"></components>
    <components :username="username" :loginOut="loginOut" :is="articleView"></components>
  </div>
</template>

<script>
import Login from './components/login'
import Article from './components/article/article'
import { userClient } from './util/ClientHelper'

export default {
  data() {
    return {
      loginView: null,
      articleView: null,
      username: null,
      userId: null,
    }
  },
  
  methods: {
    loginIn(name, userId) {
      this.username = name;
      this.userId = userId;
      this.loginView = null;
      this.articleView = Article;
    },
    async loginOut() {
      let resOut = await userClient.loginOut(this.userId);
      if(resOut) {
        this.username = null;
        this.userId = null;
        this.articleView = null;
        this.loginView = Login;
      } else {
        alert('退出失败！');
      }
    }
  },

  mounted () {
    this.loginView = Article;
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
