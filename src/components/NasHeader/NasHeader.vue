<template>
  <header class="header">
    <div class="wrapper">
      <a href="javascript:;" @click="gotoHome">
        <h1 class="header-title">
          <img :src="logoImage">
          <span class="split"> | </span>
          <span class="title">有奖问卷调查</span>
        </h1>
      </a>

      <el-menu :background-color="'#008B8B'" :active-text-color="'#ffffff'" :text-color="'#eeeeee'" :default-active="$route.name" class="header-menu" mode="horizontal" @select="handleSelect">
        <el-menu-item :index="item.routerName" v-for="(item, index) in menuList" :key="index">{{ item.menuName }}</el-menu-item>
      </el-menu>

      <el-dropdown trigger="click" @command="handleSelect" class="header-menu-icon">
        <span class="el-dropdown-link">
          <i class="el-icon-menu" style="color: #fff;font-size: 24px;"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="item.routerName" v-for="(item, index) in menuList" :key="index">{{ item.menuName }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data(){
  	return {
      logoImage: require('./nebulasx60.png'),
      menuList: [
        {"menuName": "首页", "routerName": "Home"},
        {"menuName": "我的", "routerName": "Me"},
        {"menuName": "使用教程", "routerName": "Use"},
        {"menuName": "联系我们", "routerName": "Contact"}
      ]
  	}
  },
  methods: {
    handleSelect(key, keyPath){
      this.$router.push({"name":key});
    },
    gotoHome(){
      this.$router.push({"name": "Home"});
    }
  }
}
</script>

<style>
  .header{
    background-color: #008B8B;
    height: 80px;
    line-height: 80px;
    color: #eee;
  }
  .header a{
    text-decoration: none;
    color: #eee;
  }
  .header-title{
    padding: 0;
    margin: 0;
    float: left;
    line-height: 70px;
    font-weight: normal;
    white-space: nowrap; 
    overflow: hidden; 
    text-overflow: ellipsis;
  }
  .header-menu,
  .header-menu-icon{
    float: right;
  }
  .header-menu-icon{
    display: none;
  }
  .header-title img{
    vertical-align: middle;
    width: 160px;
  }
  .header-title .split{
    font-size: 16px;
    font-weight: normal;
    color: #00a6a6;
    margin: 0 5px
  }
  .header-title .title{
    font-size: 14px;
    font-weight: normal;
  }
  .header .el-menu{
    border-bottom: none;
  }
  .header .el-menu .el-menu-item{
    height: 80px;
    line-height: 80px;
  }

  @media screen and (max-width: 760px) {
    .header-menu-icon{
      display: block;
    }
    .header-menu{
      display: none;
    }
  }

</style>
