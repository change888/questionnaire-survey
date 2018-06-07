<template>
  <div class="app">
    <nas-header></nas-header>
    <router-view></router-view>
    <nas-footer></nas-footer>
  </div>
</template>

<script>
import NasHeader from './components/NasHeader/NasHeader.vue';
import NasFooter from './components/NasFooter/NasFooter.vue';
export default {
  name: 'App',
  components:{
    NasHeader,
    NasFooter
  }
}
</script>

<style>
  body{
  	padding: 0;
  	margin: 0;
  }
  .wrapper{
    margin-left: auto;
    margin-right: auto;
    max-width: 800px;
    padding-left:15px;
    padding-right: 15px;
  }

  .el-button{
    border-radius: 0;
  }
  .el-button--primary,
  .el-button--primary:focus, 
  .el-button--primary:hover,
  .el-button--primary.is-active, 
  .el-button--primary:active{
    background-color: #008B8B;
    border-color: #008B8B;
  }
  .pull-left{
    float: left;
  }
  .pull-right{
    float: right;
  }

  .pagebar .el-pagination{
    float: left;
    margin-left: -10px; 
  }
  .pagebar .page-info{
    float: right;
    line-height: 28px;
    color: #666;
    font-size: 14px;
  }

  .textarea-status .text{
    color: #999;
  }
  .textarea-status .clear{
    color: #999;
    text-decoration: none;
  }
  .textarea-status .clear:hover{
    color: #666;
  }
  .textarea-status .tips{
    color: red;
  }

  .clearfix:after{
    content: ".";
    clear: both;
    display: block;
    font-size: 0;
    line-height: 0;
    height: 0;
    overflow: hidden;
  }
</style>
