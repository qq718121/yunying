<template>
	<div>
		<div style="padding:20px;border:1px solid #d1dbe5">
      <el-form ref="form" :model="form" :label-width="radioLabelWidth">
        <el-form-item  
            label="户内分区：">
          <el-radio-group 
            v-model="form.room">
             <el-radio v-for="item in tableData.roomList" :label="item.roomId" :key="item.roomid">{{item.room}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="拍照时间：">
           <el-date-picker
            v-model="form.picTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-button type="primary" 
        style="display:block;margin:0 auto;background:#199ED8"
        @click="queryIndoor">查询</el-button>
      </el-form>
    </div>
    <div class="tabletopbar" style="margin-top: 20px;">
      <span>查询结果：共</span>
      <span style="color:#111">{{ tableData.rowCount}}</span> <span>张照片</span>
    </div>
      <p style="text-align:center;margin-top:60px;color:#777" v-show="tableData.rowCount==0">暂无数据</p>
    <div class="cont">
      <div v-for="index in tableData.list">
        <div class="time">
          <span class="cont-span1">{{ index.picTime }}</span>
          <span class="cont-span2"></span>
        </div>
        <div class="content" v-for="val in index.rowList">
          <div style="margin-bottom:20px;"> {{val.scoreConfig}} </div>
          <div class="cont-img">
            <ul>
              <li v-for="item in val.picList">
                <img :src=' item.picPath ' alt="">
                <div class="wap">
                  <i class="el-icon-view ico" @click="viewImg( item.picPath,item.picId)"></i>
                  <!-- <i class="el-icon-search ico"></i>
                  <i class="el-icon-edit ico"></i> -->
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <el-dialog :visible.sync="outerVisible">
          <p style="font-size:18px;">照片Id:{{dialogPicId}}</p>
      <div style="overflow: hidden;margin-top: 20px;">
        <div style='position: relative'>
          <img style="width:100%" :src="dialogImgSrc" alt="">
        </div>
      </div>
    </el-dialog>
      <!-- <el-pagination
          v-show="tableData.rowCount>0"
          style="margin: 0 auto;text-align:center;margin-top:20px"
          layout="prev, pager, next ,jumper"
          :page-size="10"
          :currentPage.sync="currentPage"
          @current-change="currentChange"
          :total="tableData.rowCount">
        </el-pagination> -->
    </div>
	</div>
</template>
<script>
	import message from '../../common/message';
	export default{
		name:'IndoorConstructionDetails',
		data(){
			let name = this.$route.query.buildingName;
			return{
        radioLabelWidth:"100px",
        currentPage:1,
        form:{
          room:-2,
          picTime:'',
          houseNumberId:'',
          buildingNum:'',
          unitNum:'',
          floor:'',
          accountNum:'',
          buildingId:'',
          pageNum:0,
          pageSize:10,
        },
        dialogImgSrc:'',
        dialogPicId:'',
        outerVisible:false,
        tableData:{
          list:[],
          roomList:[],
          rowCount:0,
        },
			}
		},
		created(){
      this.initData();
      this.getData();
		},
		computed:{
			
		},
		methods:{
			initData(){
        this.form.buildingId = this.$route.query.buildingId
        this.form.buildingNum = this.$route.query.buildingNum;
        this.form.houseNumberId = this.$route.query.houseNumberId;
        this.form.unitNum = this.$route.query.unitNum;
        this.form.accountNum = this.$route.query.accountNum;
        this.form.floor = this.$route.query.floor;
      },
      // 获取数据
      getData(){
        let _this = this;
       let  body = this.form;
       let strs = '';
      if(this.form.picTime){
        strs = this.fermitTime(this.form.picTime);
      }
       body.picTime = strs;
        this.$http('/buildingMonitor/getHouseConstructSite', {body}, {}, {}, 'post').then(res => {
            if (res.data.code == 0) {
                _this.tableData = res.data.response;
            }
          }).catch((res) => {
          console.log(res);
        });
      },
      fermitTime(time){
            let now = new Date(time);
            let year = now.getFullYear();
            let mon = now.getMonth()+1;
            let date= now.getDate();
            if(mon<10){
                mon = '0'+mon;
            };
            if(date<10){
                date = '0'+date;
            }
            let postDate = '';
            if(time){
                postDate = year+'-'+mon+'-'+date;
                
            }else{
                postDate = "";
            }
            return postDate;
        },
      currentChange(page){
        this.form.pageNum = page-1;
        this.getData();
      },
      queryIndoor(){
        this.getData();
      },
      viewImg(src, pId){
        this.dialogImgSrc = src;
        this.outerVisible = true;
        this.dialogPicId = pId;
      },
		}
	}
</script>
<style scoped>
  .cont{
    padding: 20px 20px 20px 0;
    border-left: 1px solid #d1dbe5;
    margin-top: 20px;
  }
  .time{
    font-size: 0;
  }
  .cont-span1{
    width: 100px;
    height: 40px;
    background: #199ED8;
    font-size: 16px;
    color: #fff;
    line-height: 40px;
    text-align: center
  }
  .time span{
    display: inline-block;
    vertical-align: middle;
  }
  .cont-span2 {
    width: 0;
    height: 0;
    border-top: 20px solid transparent;
    border-left: 20px solid #199ED8;
    border-bottom: 20px solid transparent;
}   
  .content{
    max-width: calc(100% - 50px);
    margin: 20px 0px 20px 30px;
  }
  .cont-img ul{
    width: 100%;
    font-size: 0;
  }
  .cont-img ul li {
    display: inline-block;
    list-style: none;
    width: 19%;
    height: 220px;
    margin-right: 1%;
    background-size: cover!important;
    margin-bottom: 20px;
    overflow: hidden;
    position: relative;
  }
  .cont-img ul li img{
    width:100%;
    min-height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .wap{
     z-index: 2;
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .5);
    line-height: 220px;
    display: none;
  }
  .cont-img ul li:hover .wap{
    display: block;
  }
  .wap i {
    color: #FFF;
    font-size: 22px;
    margin: 0 10px;
    cursor: pointer;
  }
</style>
