<template>
  <nas-page-content class="nas-page-content-faq">
    <div class="faq">
      <div class="faq-question">
        <h2>使用本应用的前提？</h2>
      </div>
      <div class="faq-answer">
        <p>本应用基于星云区块链开发而成，并且用到了nebPay钱包，所以有些前提需要注意：</p>
        <ul>
          <li>请使用谷歌浏览器，下载地址：<a href="https://www.google.cn/chrome/">https://www.google.cn/chrome/</a>； </li>
          <li>为了安全交易，请安装钱包插件，下载地址：<a href="https://github.com/ChengOrangeJu/WebExtensionWallet">https://github.com/ChengOrangeJu/WebExtensionWallet</a>；</li>
          <li>星云区块链是什么？请自行了解。传送门：<a href="https://nebulas.io/">https://nebulas.io/</a>；</li>
        </ul>
      </div>
    </div>

    <div class="faq">
      <div class="faq-question">
        <h2>问卷调查如何使用？</h2>
      </div>
      <div class="faq-answer">
        <p>我们每个人都可以是问卷调查的发起者与参与者。</p>
        <ul>
          <li>当你有调查需求时你可以作为一个发布者发布你的调查信息及题目，虽然奖励参与者的nas币你可以填写0，但建议你还是拿出一些nas币以提高参与者的积极性。</li>
          <li>你也可以是个参与调查的人，参与后有可能获得奖励，奖励来自于发布者提供的nas币，活动结束后由发布者以抽奖的形式抽取幸运者。</li>
          <li>每一个活动全生命周期有4个状态：
            <div style="height: 300px;margin-top:20px;">
              <el-steps direction="vertical" :active="5">
                <el-step title="开始" description="活动进行中"></el-step>
                <el-step title="抽奖" description="活动已经到期，发布者可以抽奖"></el-step>
                <el-step title="领取" description="发布者已经抽奖，中奖用户可以领取赏金"></el-step>
                <el-step title="结束" description="活动结束，如果赏金未领完，会退回到发布者账户里"></el-step>
              </el-steps>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nas-page-content>
</template>

<script>
import NasPageContent from '../../components/NasPageContent/NasPageContent.vue'
export default {
  name: 'FAQ',
  components:{
    NasPageContent
  },
  data(){
  	return {

  	}
  },
  created(){

  },
  mounted(){

  },
  methods: {

  },
  watch: {

  }
}
</script>

<style>
  .nas-page-content-faq{
    
  }
  .faq {
    border:1px dashed #eee;
    background-color: #fafafa;
    padding: 10px;
    margin-bottom: 20px; 
    word-wrap:break-word;
    word-break:break-all;
  }
  .faq-question{
    margin-bottom: 10px;
  }
  .faq p,
  .faq ul,
  .faq li{
    list-style:none;
    margin:0;
    padding:0;
  }
  .faq li{
    margin:10px 0;
  }
  .faq p{
    margin-top:5px;
   }
  .faq .faq-icon{
    font-size: 24px;
    color: green;
  }
</style>
