<template>
  <div class="nas-survey-list">
    <ul class="list" v-if="data.total > 0">
      <li class="item" v-for="(item, index) in data.rows">
        <a href="javascript:;" @click="gotoDetail(item)">
          <el-row :gutter="20">
            <el-col :xs="9" :sm="5" :md="5" :lg="5" :xl="5">
              <div class="item-image" :style="{'background-color': backgroundColors[index]}">
                <p class="amount">{{ item.amount }}NAS</p>
                <p class="number">{{ item.number }}人瓜分</p>
              </div>
            </el-col>
            <el-col :xs="9" :sm="15" :md="15" :lg="15" :xl="15">
              <h2 class="item-title">{{ item.title }}</h2>
              <p class="item-content">{{ item.content }}</p>
            </el-col>
            <el-col :xs="6" :sm="4" :md="4" :lg="4" :xl="4" style="text-align: right;">
              <span class="time" style="margin-bottom: 10px;">{{ formatTime(item.createTime) }}前发布</span>
              <el-tag v-if="item.status === 1">进行中</el-tag>
              <el-tag type="warning" v-if="item.status === 2">待抽奖</el-tag>
              <el-tag type="success" v-if="item.status === 3">领取中</el-tag>
              <el-tag type="info" v-if="item.status === 4">待结束</el-tag>
              <el-tag type="info" v-if="item.status === 5">已结束</el-tag>
            </el-col>
          </el-row>
        </a>
      </li>
    </ul>
    <div v-else>还没有人发布过有奖调查，<el-button type="text" @click="create">我要发布</el-button></div>
    <div class="pagebar clearfix">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        @current-change="currentChange"
        :total="Number(data.total)">
      </el-pagination>
      <div class="page-info">
        共{{ data.total }}条记录
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NasSurveyList',
  data(){
    return {
      backgroundColors: ['#EEA2AD', '#00C5CD', '#1C86EE', '#7CCD7C', '#CD9B9B', '#EE6AA7', '#FFC125', '#668B8B', '#9BCD9B', '#EEAD0E']
    }
  },
  props:{
    data: {
      type: Object,
      data: {
        total: 0,
        rows: []
      }
    },
    pageSize: {
      type: Number,
      default: 10
    },
    fromPage: {
      type: String,
      default: '首页'
    }
  },
  methods:{
    currentChange(pageNumber){
      this.$emit('currentChange', pageNumber);
    },
    gotoDetail(item){
      this.$router.push({
        name:'Detail', 
        params: { 
          id: item.id,
          fromPage: this.fromPage
        }
      });
    },
    create(){
      this.$router.push({name:'Create'});
    },
    formatTime(t){
      return transferHappendTime(t);
    }
  }
}
</script>

<style>
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
    white-space: nowrap; 
    overflow: hidden; 
    text-overflow: ellipsis;
  }
  .nas-survey-list .pagebar{
    margin-top:20px;
  }
</style>
