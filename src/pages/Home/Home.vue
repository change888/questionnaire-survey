<template>
  <nas-page-content class="nas-page-content-home">
    <nas-survey-list
     :data="data"
     :pageSize="pageSize"
     :fromPage="'首页'"
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
      loading: false,
      pageSize: 10,
      data: {
        total: 0,
        rows: []
      }
  	}
  },
  created(){
    this.queryData();
  },
  mounted(){
    document.documentElement.scrollTop = 0;
  },
  methods: {
    queryData(pageNumber){
      var self = this;
      query({
        from: from, 
        value: '0', 
        nonce: '0', 
        gas_price: '1000000', 
        gas_limit: '2000000',
        dappAddress: dappAddress,
        callFunctionName: 'getList',
        callFunctionArgs: JSON.stringify([pageNumber || 1, this.pageSize]),
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
    currentChange(pageNumber){
      this.queryData(pageNumber);
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
</style>
