<template>
  <div>
      <Subnav2 :navList="navList" @refresh="refresh"></Subnav2>
    <div  style="padding:20px;">
      <el-row style="padding:20px;border:1px solid #ccc;margin-top:20px">
        <el-col :span="20">
          <BuildingLinkage4
            :_buildingId="form.buildingId"
            :_houseNumber.sync="form.houseNumberId"
            :_buildingNum.sync="form.buildingNum"
            :_unitNum.sync="form.unitNum"
            :_floor.sync="form.floor"
            :_accountNum.sync="form.accountNum"
            :_reload = "reload"
          />
        </el-col>
        <el-col>
            <el-form>
                <el-form-item label="当前进度：" :label-width="labelWidth">
                    <el-select v-model="form.scheduleName"  clearable placeholder="请选择">
                        <el-option
                            v-for="item in tableData.scheduleList"
                            :key="item.scheduleId"
                            :label="item.scheduleName"
                            :value="item.scheduleId">
                       </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-col> 
        <el-col :span="4">
          <el-button style="margin-left:100px;" type="primary" @click="onSearchSubmit">查询</el-button>
        </el-col>
      </el-row>
      <el-row>
        <div class="tabletopbar">
          <span>查询结果：共</span>
          <span style="color:#111">{{tableData.rowCount}}</span> <span>条</span>
        </div>
        <el-table
          v-loading="tabLoading"
          :data="tableData.list"
          border
          class="plan-table"
          tooltip-effect="dark"
          style="width: 100%;font-size:12px!important;">
          <el-table-column
            prop="houseNumber"
            label="期数"
            min-width="60">
          </el-table-column>
          <el-table-column
            prop="buildingNum"
            label="楼栋号"
            min-width="60">
          </el-table-column>
          <el-table-column
            prop="scheduleName"
            label="当前施工进度"
            min-width="130">
          </el-table-column>
          <el-table-column
            prop="lastUpdateTime"
            min-width="120"
            label="最后编辑时间">
          </el-table-column>
           <!-- <el-table-column
            prop="lastUserName"
            min-width="120"
            label="编辑人"> -->
          <!-- </el-table-column> -->
          <el-table-column
            prop="houseType"
            min-width="100"
            label="操作">
            <template scope="scope">
              <span class="add_span"
              style="margin-right:30px;"
              @click="goIndoor(scope.row,scope.$index,1)">查看</span>
              <span class="add_span"
              v-if="$route.query.type=='edit'"
               @click="goIndoor(scope.row,scope.$index,2)">编辑</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-show="tableData.rowCount>0"
          style="margin: 0 auto;text-align:center;margin-top:20px"
          layout="prev, pager, next ,jumper"
          :page-size="10"
          :currentPage.sync="currentPage"
          @current-change="currentChange"
          :total="tableData.rowCount">
        </el-pagination>
      </el-row>
      <p style="text-align:center;margin-top:60px;color:#777" v-show="tableData.rowCount==0">暂无数据</p>
      <el-dialog
        title="楼栋进度查看"
        :visible.sync="centerDialogVisible"
        width="40%"
        top="32%">
        <div style="width:95%;margin:0 auto;">
            <span style="line-height:30px;">楼栋号: {{buildingNum2}}</span><br/>
            <span style="line-height:30px;">当前施工进度: {{scheduleName2}}</span>
            <el-steps center :active="addNum">
            <el-step v-for="(item,index) in tableData2.list" 
            :key="index"
            :title="item.scheduleName"
            :status= "item.status == 1 ? 'finish ' : 'wait' "
            :description="item.createTime?item.createTime.substring(0,7):''"></el-step>
            </el-steps>
            <span style="line-height:30px;">编辑人: {{lastUserName2}}</span><br/>
            <span style="line-height:30px;">最后编辑时间: {{lastUpdateTime2}}</span>
        </div>
        <!-- <span slot="footer"  class="dialog-footer"> -->
         <div style="text-align: center;">
              <el-button @click="centerDialogVisible = false" >返 回</el-button>
         </div>
        <!-- </span> -->
      </el-dialog>
      <el-dialog
        title="楼栋进度编辑"
        :visible.sync="dialogVisible"
        width="30%"
        top="32%">
        <div class="dig-content">
             <span style="line-height:30px;">楼栋号: {{buildingNum2}}</span><br/>
            <span style="line-height:30px;">当前施工进度: {{scheduleName2}}</span><br/>
            <span style="line-height:50px;">当前施工进度更新：</span>
            <el-form class="demo-ruleForm">
                <el-form-item
                    :label="time.readyName+'  施工日期:'">
                    <el-date-picker
                        v-model="time.readyTime"
                        type="date"
                        :disabled="time.readyStats == 1? false : true"
                        placeholder="选择日期">
                        </el-date-picker>
                </el-form-item>
                <el-form-item
                    :label="time.foundationName+' 施工日期:'">
                    <el-date-picker
                        v-model="time.foundationTime"
                        type="date"
                        :disabled="time.foundationStats == 1? false : true"
                        placeholder="选择日期">
                        </el-date-picker>
                </el-form-item>
                <el-form-item
                     :label="time.subjectName+' 施工日期:'">
                    <el-date-picker
                        v-model="time.subjectTime"
                        type="date"
                         :disabled="time.subjectStats == 1? false : true"
                        placeholder="选择日期">
                        </el-date-picker>
                </el-form-item>
                <el-form-item
                     :label="time.decorateName+' 施工日期:'">
                    <el-date-picker
                        v-model="time.decorateTime"
                        type="date"
                         :disabled="time.decorateStats == 1? false : true"
                        placeholder="选择日期">
                        </el-date-picker>
                </el-form-item>
                <el-form-item
                     :label="time.completeName+' 施工日期:'">
                    <el-date-picker
                        v-model="time.completeTime"
                        type="date"
                         :disabled="time.completeStats == 1? false : true"
                        placeholder="选择日期">
                        </el-date-picker>
                </el-form-item>
                 <el-form-item style="text-align:center;">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="subDialog()">确 定</el-button>
                </el-form-item>
            </el-form>
        </div>
       
        </el-dialog>
    </div>
  </div>
</template>

<script>
  import Subnav2 from '../Subnav2/Subnav2';
  import BuildingLinkage4 from '../Common/BuildingLinkage2/BuildingLinkage4';
  export default{
    name:'EstatePlanDetail',
    components:{
      BuildingLinkage4,
      Subnav2
    },
    data(){
      return{
          navList:[
				
		],
        currentPage:1,
        centerDialogVisible:false,
        dialogVisible:false,
        labelWidth:"120px",
        houseTypeArray:[],
        fileObj:{
          isHaveExcel:0,
          excelName:'',
          fileSize:''
        },
        tabLoading:false,
        form:{
          buildingId:'',
          houseNumberId:'',
          buildingNum:'',
          unitNum:'',
          floor:'',
          accountNum:'',
          scheduleName:'',
          pageNum:0,
          pageSize:10,
        },
        tableData:{
          list:[],
          scheduleList:[],
          rowCount:0,
        },
        tableData2:{
          houseInfo:"",
          list:[],
        },
        time:{
            readyTime:'',
            readyName:'',
            readyStats:'',
            foundationTime:'',
            foundationName:'',
            foundationStats:'',
            subjectTime:'',
            subjectName:'',
            subjectStats:'',
            decorateTime:'',
            decorateName:'',
            decorateStats:'',
            completeTime:'',
            completeName:'',
            completeStats:'',
        },
        buildingNum2:'',
        houseNumberId2:'',
        scheduleName2:'',
        lastUserName2:'',
        lastUpdateTime2:'',
        editlList:{
            scheduleId:'',
            createTime:'',
        },
        _BuildPlanningInfo:[],
        selectIdsArr:[],
        selectArr:[],
        reload:false,
        addNum:0,
      }
    },
    computed:{
      type:function(){
        return this.$route.query.type;
      },
      buildingId:function(){
        return this.$route.query.buildingId;
      }
    },
    created(){
        this. initNav();
      this.form.buildingId = this.$route.query.buildingId;
      this.getExcelData();
      if(this.type == 'edit'){
        this.getHouseTypeData();
      };
    },
    mounted(){

    },
    methods:{
      //获取户型下拉数据
      getHouseTypeData(){
        let _this = this,
          body = {
            buildingId:this.buildingId,
            houseNumberId:'',
            buildingNum:'',
            unitNum:'',
            floor:'',
            accountNum:'',
          };
        this.$http('/buildingMonitor/pullHouseExcelInfo',{body},{},{},'post').then(res => {
          if(res.data.code == 0){
            let response = res.data.response;
            if(response.list[0] == null){
              _this.houseTypeArray = [];
            }else{
              _this.houseTypeArray = response.list;
            }

          }else if(res.data.code == 300){
            _this.$router.push('/login')
          }
        }).catch(err => {
          console.log(err);
        })
      },
       // 面包屑初始化
      initNav(){
				let q = this.$route.query,
	      		buildingName = q.buildingName,
	      		fullPath = this.$route.fullPath,
	      		path1 = '/index/estateprocessmonitoringdetail?type='+q.type+'&buildingId='+q.buildingId+'&buildingName='+buildingName;
	      		this.navList = [
                    {path:'/index/estateprocessmonitoringmanagement',name:'首页'},
                    {path:path1,name:buildingName},
                    {path:fullPath,name:'楼栋进度'}
	      		]
			},
      //获取数据
      getExcelData(){
        let _this = this,
          body = this.form;
        this.tabLoading = true;
        this.$http('/buildingMonitor/getBuildProgressList',{body},{},{},'post').then(res => {
          _this.tabLoading = false;
          if(res.data.code == 0){
            _this.tableData = res.data.response;
            _this._BuildPlanningInfo = _.cloneDeep(_this.tableData.list);
            _this.selectIdsArr = [];
            _this.selectArr = [];
            // _this.$refs.multipleTable.clearSelection();
          }
        }).catch(err => {
          _this.tabLoading = false;
          console.log(err)
        })
      },
      //搜索
      onSearchSubmit(){
        this.form.pageNum = 0;
        this.getExcelData();
      },
      //页码改变
      currentChange(page){
        this.form.pageNum = page-1;
        this.getExcelData();
      },
      // 户内施工户内进度
      goIndoor(row,ind,type){
        this.buildingNum2 = row.buildingNum;
        this.scheduleName2 = row.scheduleName;
        this.lastUserName2 = row.lastUserName;
        this.lastUpdateTime2 = row.lastUpdateTime;
        this.houseNumberId2 = row.houseNumberId;
        // this.editlList.
        if(type == 1){
          this.getProgress(row);
          this.centerDialogVisible = true;
        }else if(type == 2){
          this.getProgress(row);
          this.dialogVisible= true;
        }
      },
      getProgress(row){
        let body = {};
        let _this = this;
        body.buildingId = this.$route.query.buildingId;
        body.houseNumberId = row.houseNumberId;
        body.buildingNum = row.buildingNum;
         this.$http('/buildingMonitor/getbaseProgressInfo',{body},{},{},'post').then(res => {
          if(res.data.code == 0){
            _this.tableData2 = res.data.response;
            this.addNum = 0;
            for(let i in res.data.response.list){
               if(i == 0){
                    this.time.readyTime = res.data.response.list[i].createTime;
                    this.time.readyName = res.data.response.list[i].scheduleName;
                    this.time.readyStats = res.data.response.list[i].status;
               }else if(i == 1){
                    this.time.foundationTime = res.data.response.list[i].createTime;
                    this.time.foundationName = res.data.response.list[i].scheduleName;
                    this.time.foundationStats = res.data.response.list[i].status;
               }else if(i == 2){
                    this.time.subjectTime = res.data.response.list[i].createTime;
                    this.time.subjectName = res.data.response.list[i].scheduleName;
                    this.time.subjectStats = res.data.response.list[i].status;
               }else if(i == 3){
                    this.time.decorateTime = res.data.response.list[i].createTime;
                    this.time.decorateName = res.data.response.list[i].scheduleName;
                    this.time.decorateStats = res.data.response.list[i].status;
               }else if(i == 4){
                    this.time.completeTime = res.data.response.list[i].createTime;
                    this.time.completeName = res.data.response.list[i].scheduleName;
                    this.time.completeStats = res.data.response.list[i].status;
               }
               if(res.data.response.list[i].status ==1){
                    this.addNum += 1;
                }
            }
            
          }
        }).catch(err => {
            console.log(err)
        })
      },
      subDialog(r){
          let body = {};
          let arr = [
              {
                scheduleName:this.time.readyName,
                createTime: this.fermitTime(this.time.readyTime),
              },
              {
                scheduleName:this.time.foundationName,
                createTime: this.fermitTime(this.time.foundationTime),
              },
              {
                scheduleName:this.time.subjectName,
                createTime: this.fermitTime(this.time.subjectTime),
              },
              {
                scheduleName:this.time.decorateName,
                createTime: this.fermitTime(this.time.decorateTime),
              },
              {
                scheduleName:this.time.completeName,
                createTime: this.fermitTime(this.time.completeTime),
              },
          ];
          body.buildingId = this.$route.query.buildingId;
          body.buildingNum = this.buildingNum2;
          body.houseNumberId = this.houseNumberId2;
          body.editlList = arr;
            
           this.$http('/buildingMonitor/editBuildProgressInfo',{body},{},{},'post').then(res => {
            if(res.data.code == 0){
                this.$message({
                    message: '修改成功',
                    type: 'success'
                });
                 this.dialogVisible= false;
                 this.getExcelData();
            }
            }).catch(err => {
                console.log(err);
                 this.$message({
                    message: 'error',
                    type: 'warning'
                });
            })
      },
      //时间转换
      fermitTime(time){
            let now = new Date(time);
            let year = now.getFullYear();
            let mon = now.getMonth()+1;
            let date= now.getDate();
            let house = now.getHours();
            let getMinutes = now.getMinutes();
            let getSeconds = now.getSeconds();
            if(mon<10){
                mon = '0'+mon;
            };
            if(date<10){
                date = '0'+date;
            }
            if(house <10){
                house = '0'+house
            }
            if(getMinutes<10){
                getMinutes = '0'+getMinutes;
            }
            if(getSeconds<10){
                getSeconds = '0'+getSeconds
            }
            let postDate = '';
            if(time){
                postDate = year+'-'+mon+'-'+date+' '+house+':'+getMinutes+':'+getSeconds;
                
            }else{
                postDate = "";
            }
            return postDate;
        },
      //刷新
        refresh(){
            
        }
    }
  }
</script>

<style scoped>
  .tabletopbar{
    height:40px;
    background:#eef1f6;
    border-left:1px solid #dfe6ec;
    border-right:1px solid #dfe6ec;
    border-top:1px solid #dfe6ec;
    line-height:40px;
    font-size:12px;
    color:#555;
    padding:0px 15px;
    margin-top: 20px;
  }
</style>

<style>
  .plan-table .el-input__inner{
    border:1px solid transparent;
    background-color: transparent;
    text-align: center;
    cursor: pointer;
  }

  .plan-table th .el-checkbox{
    display: none;
  }
  .add_span{
    cursor: pointer;
  }
  .dig-content{
      width:55%;
      margin:0 auto;
      height: auto;
  }
</style>
