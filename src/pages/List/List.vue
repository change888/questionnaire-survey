<template>
  <nas-page-content class="nas-page-content-create-passage">
    <el-alert
      title="如果想发布您的解卦信息，请先到首页占卦，结果出来后会有发布按钮。"
      type="warning"
      show-icon
      :closable="false" style="margin-bottom: 20px;">
      <el-button type="text" @click="gotoHome">去占卦</el-button>
    </el-alert>

    <el-row :gutter="20">
      <el-col :span="12" v-for="(item, index) in data.rows" :key="index">
        <el-card shadow="hover" class="diagram-item">
          <time class="time">{{ formatTime(item.createTime) }}前</time>
          <div class="card-content">
            <el-row :gutter="10">
              <el-col :span="10">
                <diagram-photo
                  :lines="getLines(item)"
                  :currentLine="getCurrentLine(item)"
                  :diagramThings="getDiagramThings(item)">
                </diagram-photo>
              </el-col>
              <el-col :span="14">
                <h2 class="diagram-name">{{ getDiagramName(item) }}</h2>
              </el-col>
            </el-row>    
          </div>
          <div class="card-footer">
            <div class="auther" :title="item.auther">发布者：{{ item.auther }}</div>
            <div class="bottom clearfix">
              <el-button type="default" class="button" @click="gotoDetail(item)">去解卦</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <div class="pagebar clearfix">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        @current-change="currentChange"
        :total="data.total">
      </el-pagination>
      <div class="page-info">
        共{{ data.total }}条记录
      </div>
    </div>
    
  </nas-page-content>
</template>

<script>
import NasPageContent from '../../components/NasPageContent/NasPageContent.vue'

export default {
  name: 'CreatePassage',
  components:{
    NasPageContent
  },
  data(){
  	return {
      diagram: new Diagram(),
      pageSize: 10,
      data:{
        rows: [],
        total: 0        
      },
      loading: null
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
        callFunctionName: 'getDiagrams',
        callFunctionArgs: JSON.stringify([pageNumber || 1, this.pageSize]),
        onBeforeSend(){
          self.openLoading();
        },
        onSuccess(res){
          self.closeLoading();
          //console.log(res.data);
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
    getLines(item){
      this.diagram.set(item.firstNum, item.secondNum, item.thirdNum);
      return this.diagram.getLines();
    },
    getCurrentLine(item){
      this.diagram.set(item.firstNum, item.secondNum, item.thirdNum);
      return this.diagram.getCurrentLineIndex();
    },
    getDiagramThings(item){
      this.diagram.set(item.firstNum, item.secondNum, item.thirdNum);
      return this.diagram.getThings();
    },
    getDiagramName(item){
      this.diagram.set(item.firstNum, item.secondNum, item.thirdNum);
      return this.diagram.getDiagram();
    },
    currentChange(pageNumber){
      this.queryData(pageNumber);
    },
    gotoDetail(item){
      this.$router.push({
        name: 'Detail',
        params: { 
          args: base64Encode({
            id: item.id
          })
        }
      });
    },
    gotoHome(){
      this.$router.replace({
        name: 'Home'
      });
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
  },
  watch: {

  }
}
</script>

<style>
  .diagram-item{
    margin-bottom: 20px;
    border-radius: 0;
    position: relative;
  }
  .diagram-item .time{
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 14px;
    color: #999;
  }
  .diagram-item .diagram-name{
    font-size: 50px;
    margin:18px 0; 
    text-align: center;
  }

  .diagram-item .auther{
    font-size: 14px;
    margin:10px 0; 
    white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;
  }

</style>
