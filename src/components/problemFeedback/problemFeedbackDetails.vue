<template>
  <div class="problemFeedbackDetails">
    <Subnav2 :navList="navList" @refresh="refresh"></Subnav2>

    <div class="top_wap" style="padding: 20px;">
     <el-form ref="form" :model="filterForm" label-width="120px">
       <el-form-item label="ID：">
          <span class="addcolor">{{filterForm.questionId}}</span>
       </el-form-item>
       <el-form-item label="问题类型：">
         <span class="addcolor">{{filterForm.questionType}}</span>
       </el-form-item>
       <el-form-item label="问题描述：">
         <el-col :span="11">
          <span class="addcolor">{{filterForm.questionDescribe}}</span>
         </el-col>
       </el-form-item>
       <el-form-item label="问题页面截图：">
         <div style="width: 400px;position: relative;float: left;" v-for="(item,index) in filterForm.questionPicList">
           <div class="img-container" :style="{backgroundImage:'url('+item.questionPicUrl+')'}">
             <div class="wap">
               <i class="el-icon-view ico" @click="viewImg(item.questionPicUrl)"></i>
             </div>
           </div>
         </div>
       </el-form-item>
       <el-form-item label="反馈用户：">
           <span class="addcolor">{{filterForm.userName}}</span>
       </el-form-item>
       <el-form-item label="省 市：">
         <span class="addcolor">{{filterForm.area}}</span>
       </el-form-item>
       <el-form-item label="反馈时间：">
         <span class="addcolor">{{filterForm.feedbackTime}}</span>
       </el-form-item>
       <el-form-item>
         <el-button @click="closeDetails">关闭</el-button>
       </el-form-item>
     </el-form>
   </div>
    <el-dialog :visible.sync="outerVisible">
      <div style="overflow: hidden;margin-top: 20px;">
        <div :style='`transform:scale(${scaleX/50},${scaleX/50});position: relative`'>
          <img style="width:100%" :src="dialogImgSrc" alt="">
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import Subnav2 from '../Subnav2/Subnav2'
    export default {
      name: "problemFeedbackDetails",
      components: {
        Subnav2,
      },
      data(){
        return{
          outerVisible: false,
          scaleX: 50,
          dialogImgSrc: '',
          secondLevel:'问题反馈',
          threeLevel:'问题反馈',
          navList: [
            {path: this.$route.fullPath, name: '首页'},
            {path: '/problem/problemfeedback', name: '问题反馈'},
            {path: '', name: '查看'}
          ],
          filterForm:{
            area : '',
            feedbackTime : '',
            questionDescribe : '',
            questionId : '',
            questionPicList : '',
            questionType : '',
            userName : '',
            pageNum: ''
          },
        }
      },
      created(){
        this.init();
        console.log(this.filterForm);
      },
      methods:{
        init(){
          this.filterForm.area = this.$route.query.area;
          this.filterForm.feedbackTime = this.$route.query.feedbackTime;
          this.filterForm.questionDescribe = this.$route.query.questionDescribe;
          this.filterForm.questionId = this.$route.query.questionId;
          this.filterForm.questionPicList  = this.$route.query.questionPicList;
          this.filterForm.questionType  = this.$route.query.questionType;
          this.filterForm.userName  = this.$route.query.userName;
          this.filterForm.pageNum = this.$route.query.pageNum;
        },
        // 刷新
        refresh(){
          this.$store.dispatch('mainLoadingAction',true);
          this.getdata()
          this.currentPage=1;
          for(var i in this.filterForm){
            this.filterForm[i]=''
          }
          var that=this
          setTimeout(function(){
            that.$store.dispatch('mainLoadingAction',false);
          },300)
        },
        viewImg(src, index){
          this.dialogImgSrc = src;
          this.outerVisible = true;
        },
        //关闭
        closeDetails(){
          console.log(this.$route.query.pageNum);
          this.$router.push({
            path: '/problem/problemfeedback',
            query: {
              pageNum: this.$route.query.pageNum * 1
            }
          })
        },
      }

    }
</script>

<style scoped>
  .problemfeedback .top_wap{border: 1px solid #20a0ff;margin:20px;}
  .addcolor{color:#48576a;}
  .img-container {
    position: relative;
    cursor: pointer;
    margin-top: 20px;
    height: 180px;
    padding-top: 100px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }

  .img-container:hover .wap {
    display: block;
  }
  .img-container .wap {
    z-index: 2;
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .5);
    line-height: 180px;
    display: none;
  }
  .img-container .wap .ico {
    color: #FFF;
  }
</style>
