<template>
  <nas-page-content class="nas-page-content-me">
    <div class="buttons" style="text-align:center;margin-bottom:20px;"><el-button type="default" @click="create" style="width:100%">发布问卷调查</el-button></div>

    <el-button-group style="width:100%;margin-bottom:10px;">
      <el-button :type="tabIndex === 0 ? 'primary' : 'default'" style="width:50%" @click="tabChange(0)">我发布的</el-button>
      <el-button :type="tabIndex === 1 ? 'primary' : 'default'" style="width:50%" @click="tabChange(1)">我参与的</el-button>
    </el-button-group>

    <nas-survey-list
     :data="data"
     :pageSize="pageSize"
     :fromPage="'我的'"
     @currentChange="currentChange">  
    </nas-survey-list>
    
  </nas-page-content>
</template>

<script>
import NasPageContent from '../../components/NasPageContent/NasPageContent.vue'
import NasSurveyList from '../../components/NasSurveyList/NasSurveyList.vue'

export default {
  name: 'Home',
  components:{
    NasPageContent,
    NasSurveyList
  },
  data(){
  	return {
      tabIndex: -1,
      loading: null,
      pageSize: 10,
      data: {
        total: 0,
        rows: []
      }
  	}
  },
  created(){
    this.tabChange(0);
  },
  mounted(){
    document.documentElement.scrollTop = 0;
  },
  methods: {
    tabChange(index){
      this.tabIndex = index;
      if(index === 0){
        this.queryPublishList();
      }
      else if(index === 1){
        this.queryJoinList();
      }
    },
    queryPublishList(pageNumber){
      var self = this;
      query({
        from: from, 
        value: '0', 
        nonce: '0', 
        gas_price: '1000000', 
        gas_limit: '2000000',
        dappAddress: dappAddress,
        callFunctionName: 'getPublishList',
        callFunctionArgs: JSON.stringify([userNebAddress, pageNumber || 1, this.pageSize]),
        onBeforeSend(){
          self.openLoading();
        },
        onSuccess(res){
          self.closeLoading();
          self.data = res.data;
        },
        onFailed(data){
          self.closeLoading();
        },
        onError(err){
          self.closeLoading();
        }
      });
    },
    queryJoinList(pageNumber){
      var self = this;
      query({
        from: from, 
        value: '0', 
        nonce: '0', 
        gas_price: '1000000', 
        gas_limit: '2000000',
        dappAddress: dappAddress,
        callFunctionName: 'getJoinList',
        callFunctionArgs: JSON.stringify([userNebAddress, pageNumber || 1, this.pageSize]),
        onBeforeSend(){
          self.openLoading();
        },
        onSuccess(res){
          self.closeLoading();
          self.data = res.data;
        },
        onFailed(data){
          self.closeLoading();
        },
        onError(err){
          self.closeLoading();
        }
      });
    },
    gotoDetail(item){
      this.$router.push({
        name:'Detail', 
        params: { 
          id: item.id
        }
      });
    },
    create(){
      this.$router.push({name:'Create'});
    },
    formatTime(t){
      return transferHappendTime(t);
    },
    openLoading(){
      this.loading = this.$loading({
        lock: false,
        text: '正在加载',
        background: 'rgba(255, 255, 255, 0.5)'
      });
    },
    closeLoading(){
      this.loading.close();
    }
  }
}
</script>

<style>
  .nas-page-content-home{
    max-width: 800px!important;
  }
  .list,
  .item{
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .item{
    padding:20px 0;
    border-bottom: 1px solid #eee; 
  }
  .item a{
    color: #444;
  }
  .item-image{
    background-color: #00C5CD;
    color: #fff;
    text-align: center;
    height: 50px;
    padding: 20px;
    border-radius: 10px;
  }
  .item-image p{
    margin: 0;
    padding: 0;
  }
  .item-image .amount{
    font-size: 24px;
  }
  .item-image .number{
    font-size: 16px;
  }
  .item .time{
    font-size: 14px;
    color: #999;
    text-align: right;
    display: block;
  }
  .item-title{
    margin: 0;
    padding: 0;
    font-size: 18px;
  }
  .item-content{
    margin:10px 0 0;
    padding: 0;
    color: #666!important;
  }
  .pagebar{
    margin-top:20px;
  }

</style>
