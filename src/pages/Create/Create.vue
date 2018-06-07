<template>
  <nas-page-content class="nas-page-content-create">
    <el-alert
      title="发起一个问卷调查需要填写两部分内容，第一部分填写问卷基本信息，第二部分填写我们的问卷题目。"
      type="warning"
      show-icon
      :closable="false" style="margin-bottom: 20px;">
    </el-alert>

    <el-form :model="form" label-width="100px">
      <fieldset class="fieldset">
        <legend class="fieldset-title">问卷信息</legend>
        <div class="fieldset-content">
          <el-form-item label="主题">
            <el-input placeholder="请输入问卷调查标题" v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="奖金额度">
            <el-input-number v-model="form.amount" controls-position="right" :min="minAmount">
            </el-input-number>
            NAS
          </el-form-item>
          <el-form-item label="奖金发放形式">
            <el-radio v-model="form.type" label="1">随机</el-radio>
            <el-radio v-model="form.type" label="2">顺序</el-radio>
          </el-form-item>
          <!-- <el-form-item label="分数不小于" v-if="form.type === '2'">
            <el-input-number v-model="form.minScore" controls-position="right" :min="1"></el-input-number>
          </el-form-item> -->
          <el-form-item label="中奖名额">
            <el-input-number v-model="form.number" controls-position="right" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="活动时间">
            <el-date-picker
              v-model="dateTime"
              type="datetimerange"
              @change="onDateTimeChange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期" style="min-width: 100%;max-width: 400px;width: auto;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" rows="3" placeholder="请输入备注" v-model="form.content" @keyup.native="textareaChange">
            </el-input>
            <div class="textarea-status clearfix">
            <div class="pull-left text">
              {{ form.content.length }}/{{count}}
              <span class="tips" v-show="showTips">超出字数限制！</span>
            </div>
            <div class="pull-right"><a class="clear" href="javascript:;" @click="form.content=''">清空</a></div>
          </div>
          </el-form-item>
        </div>
      </fieldset>
    </el-form>
    <el-form label-width="60px">
      <fieldset class="fieldset">
        <legend class="fieldset-title">问卷题目(最少1题，最多20题)</legend>
        <div class="fieldset-content">
          <fieldset class="fieldset topic-item" v-for="(item, index) in topics" :key="index">
            <legend class="fieldset-title"><span class="index">{{ index+1 }}</span> <el-button class="del" v-if="topics.length > 1" type="text" @click="topics.splice(index, 1)">删除</el-button></legend>
            <div class="fieldset-content">
              <el-form-item label="题目">
                <el-input placeholder="请输入题目" v-model="item.title"></el-input>
              </el-form-item>
              <el-form-item label="选项A">
                <el-input placeholder="选项A答案" v-model="item.optionsA"></el-input>
              </el-form-item>
              <el-form-item label="选项B">
                <el-input placeholder="选项B答案" v-model="item.optionsB"></el-input>
              </el-form-item>
              <el-form-item label="选项C">
                <el-input placeholder="选项C答案" v-model="item.optionsC"></el-input>
              </el-form-item>
              <el-form-item label="选项D">
                <el-input placeholder="选项D答案" v-model="item.optionsD"></el-input>
              </el-form-item>
              <el-form-item label="答案" v-if="form.type === '2'">
                <el-radio v-model="item.result" label="A">A</el-radio>
                <el-radio v-model="item.result" label="B">B</el-radio>
                <el-radio v-model="item.result" label="C">C</el-radio>
                <el-radio v-model="item.result" label="D">D</el-radio>
              </el-form-item>
            </div>
          </fieldset>
          <div class="addbox">
            <el-button type="default" icon="el-icon-plus" style="width: 100%" @click="addTopic">添加一题</el-button>
          </div>
        </div>
      </fieldset>
    </el-form>

    <el-button type="primary" @click="onSubmit" :loading="loading">立即发布</el-button>
    
  </nas-page-content>
</template>

<script>
import NasPageContent from '../../components/NasPageContent/NasPageContent.vue'
export default {
  name: 'Create',
  components:{
    NasPageContent
  },
  data(){
  	return {
      minAmount: 0,
      count: 200,
      showTips: false,
      loading: false,
      dateTime: [],
      form: {
        title: '',
        content: '',
        amount: 100,
        type: '1', //'1': 随机，'2'排名
        minScore: 90,
        number: 3,
        startTime: '',
        endTime: '',
      },
      topics: [{
          title: '',
          optionsA: '',
          optionsB: '',
          optionsC: '',
          optionsD: '',
          result: ''
        }
      ]
  	}
  },
  mounted(){
    document.documentElement.scrollTop = 0;
  },
  methods: {    
    onDateTimeChange(val){
      if(!val){
        val = [];
      }
      this.form.startTime = val[0].getTime() || '';
      this.form.endTime = val[1].getTime() || '';
    },
    textareaChange(){
      if(this.form.content.length > this.count){
        this.showTips = true;
      }else{
        this.showTips = false;
      }
    },
    onSubmit() {
      var content = HTMLDecode(this.form.content.trim());

      this.form.amount = this.form.amount || 0;

      if (!this.form.title) {
        this.$message({
          message: '主题不能为空',
          type: 'warning'
        });
        return;
      }

      if (Number(this.form.amount) < this.minAmount) {
        this.$message({
          message: '奖金额度不能小于'+this.minAmount+'NAS',
          type: 'warning'
        });
        return;
      }

      if (!this.form.type) {
        this.$message({
          message: '奖金发放形式不能为空',
          type: 'warning'
        });
        return;
      }

      if(this.form.type === '2' && !this.form.minScore){
        this.$message({
          message: '分数不小于不能为空',
          type: 'warning'
        });
        return;
      }

      if (!this.form.number) {
        this.$message({
          message: '中奖名额不能为空',
          type: 'warning'
        });
        return;
      }

      if (!this.form.startTime) {
        this.$message({
          message: '活动开始时间不能为空',
          type: 'warning'
        });
        return;
      }

      if (!this.form.endTime) {
        this.$message({
          message: '活动结束时间不能为空',
          type: 'warning'
        });
        return;
      }

      if (!this.form.content) {
        this.$message({
          message: '备注不能为空',
          type: 'warning'
        });
        return;
      }

      if (this.form.content.length > this.count){
        this.$message({
          message: '备注字数超过限制',
          type: 'warning'
        });
        return;
      }

      var topics = this.formatTopics();
      var validataTopicMsg = this.validateTopicItem();

      if(topics.length === 0){
        this.$message({
          message: '请至少填写一个题目',
          type: 'warning'
        });
        this.topics.push({
          title: '',
          optionsA: '',
          optionsB: '',
          optionsC: '',
          optionsD: '',
          result: ''
        });
        return;
      }

      if(topics.length > 20){
        this.$message({
          message: '您填写一个题目超过20，请删减',
          type: 'warning'
        });
        return;
      }

      if(validataTopicMsg !== true){
        this.$message({
          message: validataTopicMsg,
          type: 'warning'
        });
        return;
      }

      var self = this;
      var value = "0";
      var nonce = "0"
      var gas_price = "1000000";
      var gas_limit = "2000000";

      query({
        dappAddress: dappAddress,
        value: this.form.amount,
        payCallbackUrl: payCallbackUrl,
        callFunctionName: 'saveSurvey',
        callFunctionArgs: JSON.stringify([this.form, topics]),
        onBeforeSend(){
          self.loading = true;
        },
        onSuccess(data){
          self.$message({
            message: '发布成功，2秒后跳转...',
            type: 'warning'
          });

          self.loading = false;
          
          setTimeout(()=>{
            self.gotoBack();
          }, 2000);
        },
        onFailed(data){
          self.$message({
            message: '提交失败，请重试',
            type: 'warning'
          });
          
          self.loading = false;
        },
        onError(err){
          self.$message({
            message: '发布失败，请重试',
            type: 'warning'
          });
          self.loading = false;
        },
        onListener(res){
          if(res === 'Error: Transaction rejected by user'){
            self.$message({
              message: '发布失败，请重试',
              type: 'warning'
            });
            self.loading = false;
          }
        }
      });
    },
    formatTopics(){
      for(var i=0; i<this.topics.length; i++){
        if(this.topics[i].title === ''){
          this.topics.splice(i, 1);
        }
      }

      return this.topics;
    },
    validateTopicItem(){
      for(var i=0; i<this.topics.length; i++){
        if(this.topics[i].optionsA === ''){
          return '题目'+(i+1)+'至少填写一个选项';
        }
        if(this.form.type === '2' && this.topics[i].result === ''){
          return '题目'+(i+1)+'未填写答案';
        }
      }
      return true;
    },
    gotoBack(){
      this.$router.go(-1);
    },
    view(){
      this.$router.replace({
        name:'List'
      });
    },
    addTopic(){
      this.topics.push({
        title: '',
        optionsA: '',
        optionsB: '',
        optionsC: '',
        optionsD: '',
        answer: ''
      });
    }
  },
  watch: {

  }
}
</script>

<style>
  .nas-page-content-create .el-form-item{
    margin-bottom: 10px;
  }
  .fieldset{
    border: 1px solid #efefef;
    margin-bottom: 20px;
    min-width: auto;
  }
  .fieldset-title{
    padding-left: 10px;
    padding-right: 10px;
    color: #999; 
  }
  .fieldset-content{
    padding: 10px;
  }
  .topic-item .index{
    display: inline-block;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border-radius: 50%;
    border:1px solid #ddd;
  }
  .topic-item .del{
    margin-left: 5px;
  }
  .addbox{
    text-align: center;
    margin-top: 20px; 
  }
</style>
