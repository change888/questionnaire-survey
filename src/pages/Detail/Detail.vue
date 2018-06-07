<template>
  <nas-page-content class="nas-page-content-detail">
    
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px;">
      <el-breadcrumb-item><span @click="gotoBack">{{ fromPage }}</span></el-breadcrumb-item>
      <el-breadcrumb-item>{{ item.title }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="detail">
      <div class="questionnaire-status">
        <el-steps :active="item.status-1" finish-status="success" align-center>
          <el-step title="开始"></el-step>
          <el-step title="抽奖"></el-step>
          <el-step title="领取"></el-step>
          <el-step title="结束"></el-step>
        </el-steps>
      </div>

      <h1 class="questionnaire-title">{{ item.title }}</h1>
      <p class="questionnaire-desc">{{ item.content }}</p>

      <div class="questionnaire-info">
        <div class="questionnaire-auther">发布者：<span style="font-size:12px">{{ item.auther }}</span></div>
        <div class="questionnaire-time">活动时间：{{ formatDateTime(item.startTime) }} ~ {{ formatDateTime(item.endTime) }}</div>
        <div class="questionnaire-createtime">创建时间：{{ formatTime(item.createTime) }}以前</div>
        <div class="questionnaire-respondents">参与人数：{{ item.respondents }}人</div>
        <div class="questionnaire-respondents">总赏金：{{ item.amount }}NAS</div>
      </div>
    </div>

    <div class="questionnaire-buttons" v-if="isOwner">
      <el-button type="primary" @click="award" :loading="loadingIconAward" v-if="item.status === 2">抽奖</el-button>
      <el-button type="default" @click="endOf" :loading="loadingIconEndOf" v-if="item.status === 4">结束活动（赏金如有剩余，将会退回您的账户）</el-button>
    </div>
    <div class="questionnaire-buttons" v-if="!(isOwner && item.status === 2) && !(isOwner && item.status === 4) && answered">
      <el-button :type="item.status === 5 ? 'default' : 'success'" @click="claim" :loading="loadingIconClaim" :disabled="isWinner.code !== 1 ? true : false">{{ isWinner.msg }}</el-button>
    </div>

    <div class="question-list">
      <div class="question-item" v-for="(row, index) in item.questions" :key="index" v-if="item.questions.length > 0">
        <h2 class="question-title">{{ (index + 1) }}、{{ row.title }}<span style="margin-left:10px;">( {{ answers[index].answer}} )</span></h2>
        <ul class="options-list">
          <li class="options-item" v-if="row.optionsA">
            <el-radio v-model="answers[index].answer" label="A" :disabled="answered">A：{{ row.optionsA }}</el-radio>
          </li>
          <li class="options-item" v-if="row.optionsB">
            <el-radio v-model="answers[index].answer" label="B" :disabled="answered">B：{{ row.optionsB }}</el-radio>
          </li>
          <li class="options-item" v-if="row.optionsC">
            <el-radio v-model="answers[index].answer" label="C" :disabled="answered">C：{{ row.optionsC }}</el-radio>
          </li>
          <li class="options-item" v-if="row.optionsD">
            <el-radio v-model="answers[index].answer" label="D" :disabled="answered">D：{{ row.optionsD }}</el-radio>
          </li>
        </ul>

        <div class="question-count" v-if="isOwner">
          <el-row>
            <el-col :span="16">
              <el-progress :percentage="!(row.Acount && item.respondents) ? 0 : (row.Acount / item.respondents * 100)"></el-progress>
            </el-col>
            <el-col :span="8">
              选A，共{{ row.Acount }}人
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-progress :percentage="!(row.Bcount && item.respondents) ? 0 : (row.Bcount / item.respondents * 100)"></el-progress>
            </el-col>
            <el-col :span="8">
              选B，共{{ row.Bcount }}人
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-progress :percentage="!(row.Ccount && item.respondents) ? 0 : (row.Ccount / item.respondents * 100)"></el-progress>
            </el-col>
            <el-col :span="8">
              选C，共{{ row.Ccount }}人
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-progress :percentage="!(row.Dcount && item.respondents) ? 0 : (row.Dcount / item.respondents * 100)"></el-progress>
            </el-col>
            <el-col :span="8">
              选D，共{{ row.Dcount }}人
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <div class="buttons">
      <el-button type="primary" @click="onSubmit" :loading="loadingIcon" v-if="!answered">提交答案</el-button>
      <el-button type="default" disabled v-else>您已经回答过了</el-button>

      <el-button type="default" @click="gotoBack">返回</el-button>
    </div>
  </nas-page-content>
</template>

<script>
import NasPageContent from '../../components/NasPageContent/NasPageContent.vue'
export default {
  name: 'Detail',
  components:{
    NasPageContent
  },
  data(){
  	return {
      id: this.$route.params.id,
      fromPage: this.$route.params.fromPage,
      item: {
        title: '',
        content: '',
        amount: '',
        type: '', //'1': 随机，'2'排名
        minScore: '',
        number: '',
        startTime: '',
        endTime: '',
        id: '',
        auther: '',
        createTime: '',
        respondents: 0,
        status: 0,
        questions: [],
        answers: []
      },
      loading: null,
      loadingIcon: false,
      loadingIconAward: false,
      loadingIconClaim: false,
      loadingIconEndOf: false,
      answers: []
  	}
  },
  created(){
    this.queryData();
  },
  mounted(){
    document.documentElement.scrollTop = 0;
  },
  computed:{
    isOwner(){
      return userNebAddress === this.item.auther;
    },
    isWinner(){
      if(this.item.status < 3){
        return {
          code: -1,
          msg: '活动时间还未截止，请耐心等待抽奖'
        }
      }
      
      if(this.item.status === 5){
        return {
          code: -2,
          msg: '活动已结束'
        }
      }

      if(this.item.winners && this.item.winners.length > 0){
        var winner = null;
        var winAmount = 0;
        for(var i = 0; i < this.item.winners.length; i++){
          winner = this.item.winners[i];
          winAmount = new BigNumber(winner.winAmount).div(minUnit);
          if(winner && winner.winner === userNebAddress){
            if(winner.status === 1){
              return {
                code: 1,
                msg: '点击领取' + winAmount + 'NAS赏金'
              }
            }
            if(winner.status === 2){
              return {
                code: 2,
                msg: '你已领取' + winAmount + 'NAS赏金'
              }
            }
          }
        }
      }
      return {
        code: 0,
        msg: '你可能未中奖！'
      }
    },
    answered(){
      if(this.item.answers && this.item.answers.length > 0){
        var answer = null;
        for(var i = 0; i < this.item.answers.length; i++){
          answer = this.item.answers[i];
          if(answer && (answer.auther === userNebAddress)){
            return true;
          }
        }
      }
      return false;
    }
  },
  methods: {
  	queryData(){
      var self = this;
      query({
        from: from, 
        value: '0', 
        nonce: '0', 
        gas_price: '1000000', 
        gas_limit: '2000000',
        dappAddress: dappAddress,
        callFunctionName: 'getById',
        callFunctionArgs: JSON.stringify([self.id, userNebAddress]),
        onBeforeSend(){
          self.openLoading();
        },
        onSuccess(res){
          self.closeLoading();
          self.item = res.data;
          self.initData();
        },
        onFailed(data){
          self.closeLoading();
        },
        onError(err){
          self.closeLoading();
        }
      });
  	},
    initData(){
      var questions = this.item.questions;
      var answers = this.item.answers;
      if(! questions || questions.length === 0){
        return;
      }

      var row = null;
      var results = null;
      var result = null;
      if(this.answered){
        var result = null;
        for(var i = 0; i < answers.length; i++){
          row = answers[i];
          if(!row || row.auther !== userNebAddress){
            continue;
          }

          var results = row.answers || [];
          for(var j = 0; j < results.length; j++){
            result = results[j];
            if(result){
              this.answers.push({
                id: result.id,
                answer: result.answer
              });
            }
          } 
        }
        return;
      }

      for(var i = 0; i < questions.length; i++){
        row = questions[i];
        this.answers.push({
          id: row.id,
          answer: ''
        });
      }
    },
    onSubmit() {
      var validateReulst = this.validate();
      if (validateReulst !== true) {
        this.$message({
          message: validateReulst,
          type: 'warning'
        });
        return;
      }

      var self = this;

      query({
        dappAddress: dappAddress,
        payCallbackUrl: payCallbackUrl,
        callFunctionName: 'saveAnswer',
        callFunctionArgs: JSON.stringify([self.id, this.answers]),
        onBeforeSend(){
          self.loadingIcon = true;
        },
        onSuccess(data){
          self.$message({
            message: '提交成功，3秒后刷新',
            type: 'warning'
          });

          self.loadingIcon = false;

          setTimeout(()=>{
            self.queryData();
          }, 3000);
        },
        onFailed(data){
          self.$message({
            message: '提交失败，请重试',
            type: 'warning'
          });

          self.loadingIcon = false;
        },
        onError(err){
          self.$message({
            message: '提交失败，请重试',
            type: 'warning'
          });

          self.loadingIcon = false;
        },
        onListener(res){
          if(res === 'Error: Transaction rejected by user'){
            self.$message({
              message: '您已取消此次操作',
              type: 'warning'
            });
            self.loadingIcon = false;
          }
        }
      });
    },
    award(){
      var self = this;
      query({
        dappAddress: dappAddress,
        payCallbackUrl: payCallbackUrl,
        callFunctionName: 'award',
        callFunctionArgs: JSON.stringify([self.id]),
        onBeforeSend(){
          self.loadingIconAward = true;
        },
        onSuccess(data){
          self.$message({
            message: '开奖成功，3秒后刷新',
            type: 'warning'
          });

          self.loadingIconAward = false;

          setTimeout(()=>{
            self.queryData();
          }, 3000);
        },
        onFailed(data){
          self.$message({
            message: '开奖失败，请重试',
            type: 'warning'
          });

          self.loadingIconAward = false;
        },
        onError(err){
          self.$message({
            message: '开奖失败，请重试',
            type: 'warning'
          });

          self.loadingIconAward = false;
        },
        onListener(res){
          if(res === 'Error: Transaction rejected by user'){
            self.$message({
              message: '您已取消此次操作',
              type: 'warning'
            });
            self.loadingIconAward = false;
          }
        }
      });
    },
    claim(){
      var self = this;
      query({
        dappAddress: dappAddress,
        payCallbackUrl: payCallbackUrl,
        callFunctionName: 'claim',
        callFunctionArgs: JSON.stringify([self.id]),
        onBeforeSend(){
          self.loadingIconClaim = true;
        },
        onSuccess(data){
          self.$message({
            message: '领取成功，3秒后刷新',
            type: 'warning'
          });

          self.loadingIconClaim = false;

          setTimeout(()=>{
            self.queryData();
          }, 3000);
        },
        onFailed(data){
          self.$message({
            message: '领取失败，请重试',
            type: 'warning'
          });

          self.loadingIconClaim = false;
        },
        onError(err){
          self.$message({
            message: '领取失败，请重试',
            type: 'warning'
          });

          self.loadingIconClaim = false;
        },
        onListener(res){
          if(res === 'Error: Transaction rejected by user'){
            self.$message({
              message: '您已取消此次操作',
              type: 'warning'
            });
            self.loadingIconClaim = false;
          }
        }
      });
    },
    endOf(){
      var self = this;
      query({
        dappAddress: dappAddress,
        payCallbackUrl: payCallbackUrl,
        callFunctionName: 'endOf',
        callFunctionArgs: JSON.stringify([self.id]),
        onBeforeSend(){
          self.loadingIconEndOf = true;
        },
        onSuccess(data){
          self.$message({
            message: '结束成功，3秒后刷新',
            type: 'warning'
          });

          self.loadingIconClaim = false;

          setTimeout(()=>{
            self.queryData();
          }, 3000);
        },
        onFailed(data){
          self.$message({
            message: '结束失败，请重试',
            type: 'warning'
          });

          self.loadingIconEndOf = false;
        },
        onError(err){
          self.$message({
            message: '结束失败，请重试',
            type: 'warning'
          });

          self.loadingIconEndOf = false;
        },
        onListener(res){
          if(res === 'Error: Transaction rejected by user'){
            self.$message({
              message: '您已取消此次操作',
              type: 'warning'
            });
            self.loadingIconEndOf = false;
          }
        }
      });
    },
    validate(){
      var row = null;
      for(var i = 0; i < this.answers.length; i++){
        row = this.answers[i];
        if(row && row.answer === ''){
          return '第' + (i + 1) + '道题目没有回答';
        }
      }
      return true;
    },
    formatTime(t){
      return transferHappendTime(t);
    },
    formatDateTime(t){
      return formatDateTime(t, 'y-m-d');
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
    },
    gotoBack(){
      this.$router.go(-1);
    }
  },
  watch: {

  }
}
</script>

<style>
  .questionnaire-status {
    margin:10px -20px;
  }

  .questionnaire-header{
    padding:10px 0;
    border-bottom: 1px solid #ddd;
  }
  .questionnaire-title{
    font-weight: normal;
    text-align: center;
    font-size: 30px;
  }
  .questionnaire-desc{
    word-wrap: break-word; 
    word-break: normal;
  }
  .questionnaire-info{
    font-size: 14px;
    color: #999;
    margin-bottom: 20px;
  }
  .questionnaire-buttons{
    text-align: right;
  }
  .questionnaire-buttons button{
    margin-bottom: 2px;
  }
  .questionnaire-buttons button:last-child{
    margin-bottom: 0;
  }
  .options-list,
  .options-item{
    margin:0;
    padding:0;
    list-style: none;
  }
  .options-item{
    margin-left: 20px;
  }
  .question-list{
    margin-bottom: 20px;
  }
  .question-title{
    font-weight: normal;
    font-size: 16px;
  }
  .question-item{
    border:1px solid #eee;
    padding:10px;
    margin-bottom: 10px;
    box-shadow: 0 1px 8px 0 rgba(0,0,0,.1)
  }
  .questionnaire-buttons{
    margin-bottom: 20px;
  }
  .questionnaire-buttons button{
    width: 100%;
  }
  .question-count{
    margin-top:20px;
  }
</style>
