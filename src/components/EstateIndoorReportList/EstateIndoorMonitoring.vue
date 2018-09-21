<template>
  <div>
    <div>
      <el-row style="padding:20px;border:1px solid #ccc;margin-top:20px">
        <el-col :span="20">
          <BuildingLinkage3
            :_buildingId="form.buildingId"
            :_houseNumber.sync="form.houseNumberId"
            :_buildingNum.sync="form.buildingNum"
            :_unitNum.sync="form.unitNum"
            :_floor.sync="form.floor"
            :_accountNum.sync="form.accountNum"
            :_reload = "reload"
          />
        </el-col>
        <el-col :span="4">
          <el-button style="float:right" type="primary" @click="onSearchSubmit">查询</el-button>
        </el-col>
      </el-row> 
      <el-row>
        <div class="tabletopbar">
          <span>查询结果：共</span>
          <span style="color:#111">{{tableData.rowCount}}</span> <span>条</span>
           <el-button type="primary" v-if="$route.query.type=='edit'" @click="showDialog" size="small">批量操作</el-button>
        </div>
        <el-table
         ref="multipleTable"
          v-loading="tabLoading"
          :data="tableData.list"
          border
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
          style="width: 100%;font-size:12px!important;">
          <el-table-column
            type="selection"
            v-if="$route.query.type=='edit'"
            width="75">
            </el-table-column>
          <el-table-column
            prop="houseNumber"
            label="期数"
            min-width="60">
          </el-table-column>
          <el-table-column
            prop="buildingNum"
            label="地块+楼栋号"
            min-width="60">
          </el-table-column>
          <el-table-column
            prop="unitNum"
            label="单元"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop="floor"
            min-width="100"
            label="层">
          </el-table-column>
          <el-table-column
            prop="accountNum"
            min-width="100"
            label="户">
          </el-table-column>
           <el-table-column
            min-width="100"
            label="状态">
              <template scope="scope">
              <span>{{scope.row.bhStatus == 1? '上线':'下线'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="houseType"
            min-width="100"
            label="操作">
            <template scope="scope">
              <span class="add_span"
              style="margin-right:10px;"
              @click="goIndoor(scope.row,scope.$index,1)">户内施工</span>
              <span class="add_span"
              style="margin-right:10px;"
               @click="goIndoor(scope.row,scope.$index,2)">户进度</span>
                <span class="add_span"
                v-if="($route.query.type=='edit' && tableData.editStatus != 1) || ($route.query.type=='edit' && tableData.examineStatus == 1)"
               @click="setIsonline(scope.row,1)">{{scope.row.bhStatus == 0? '上线':'下线'}}</span>
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
        title="户进度查看"
        center
        :visible.sync="centerDialogVisible"
        width="40%"
        top="32%">
        <div style="width:95%;margin:0 auto;">
          <span style="line-height:50px;">户信息: {{tableData2.houseInfo}}</span>
          <div class="pro-item" style="margin-bottom:20px;">
              <div class="pro-item-div" v-for="(item,index) in tableData2.list" :key="index">
                  <div class="item-div-list"
                  :style="item.status == 1 ? 'background:#20a0ff;color:#fff;border:2px solid #20a0ff;' : 'background:#fff;color:#bfcbd9;border:2px solid #bfcbd9;'">{{index + 1}}</div>
                  <p class="iten-list-name">{{item.scheduleName}}</p>
                  <p class="iten-list-time">{{item.createTime.substring(0,7)}}</p>
              </div>
          </div>
        </div>
        <div style="text-align:center;clear:both;">
          <el-button @click="centerDialogVisible = false" >返 回</el-button>
        </div>
      </el-dialog>
      <el-dialog
            title="批量操作"
            :visible.sync="dialogVisible"
            width="30%">
            <el-form class="demo-ruleForm">
                <el-form-item label="请选择操作内容">
                    <el-radio-group v-model="getIsNoline">
                    <el-radio label="1">上线</el-radio>
                    <el-radio label="0">下线</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancleCz">取 消</el-button>
                <el-button type="primary" @click="setIsonline('',2)">确 定</el-button>
            </span>
            </el-dialog>
    </div>
  </div>
</template>

<script>
  import BuildingLinkage3 from '../Common/BuildingLinkage2/BuildingLinkage3';
  export default{
    name:'EstatePlanDetail',
    components:{
      BuildingLinkage3
    },
    data(){
      return{
        currentPage:1,
        centerDialogVisible:false,
        dialogVisible:false,
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
          pageNum:0,
          pageSize:10,
        },
        tableData:{
          list:[],
          editStatus:1,
          rowCount:0,
        },
        tableData2:{
          houseInfo:"",
          list:[],
        },
        multipleSelection:[],
        getIsNoline:'',
        _BuildPlanningInfo:[],
        selectIdsArr:[],
        selectArr:[],
        reload:false,
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
      //获取数据
      getExcelData(){
        let _this = this,
          body = this.form;
        this.tabLoading = true;
        this.$http('/buildingMonitor/getHouseExcelInfo',{body},{},{},'post').then(res => {
          _this.tabLoading = false;
          if(res.data.code == 0){
            _this.tableData = res.data.response;
            _this._BuildPlanningInfo = _.cloneDeep(_this.tableData.list);
            _this.selectIdsArr = [];
            _this.selectArr = [];
            console.log(_this.tableData);
            // _this.$refs.multipleTable.clearSelection()4;
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
        if(type == 1){
          this.$router.push({
          path: '/index/indoorconstruction',
          query: {
            buildingId:this.$route.query.buildingId,
            buildingName:this.$route.query.buildingName,
            type:this.$route.query.type,
            path:'/index/estateprocessmonitoringdetail',
            buildingNum:row.buildingNum,
            floor:row.floor,
            houseNumberId:row.houseNumberId,
            unitNum:row.unitNum,
            accountNum:row.accountNum
          }
        });
        }else if(type == 2){
          this.getProgress(row);
          this.centerDialogVisible = true;
        }
      },
      getProgress(row){
        let body = {};
        let _this = this;
        body.buildingId = this.$route.query.buildingId;
        body.buildHouseId = row.buildHouseId;
         this.$http('/buildingMonitor/getHouseholdProgress',{body},{},{},'post').then(res => {
          if(res.data.code == 0){
            _this.tableData2 = res.data.response;
          }
        }).catch(err => {
          console.log(err)
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      setIsonline(row,type){
         this.$confirm("确定上/下线操作?", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           let [_this , body] = [this , {}];
            let bId = '';
            if(type == 1){
                body.buildHouseId = row.buildHouseId;
                if(row.bhStatus == 1){
                    bId = 0;
                }else if(row.bhStatus == 0){
                    bId = 1;
                }
                body.bhStatus = bId;
            }else if(type == 2){
                let arr = [];
                for(let item in this.multipleSelection){
                    arr.push(this.multipleSelection[item].buildHouseId);
                }
                body.buildHouseId = arr.join(",");
                body.bhStatus = this.getIsNoline;
            }
            this.$http('buildingMonitor/editbuildHouseStatus',{body},{},{},'post').then(res => {
            if(res.data.code == 0){
                this.$message({
                    type: 'info',
                    message: "操作成功"
                });
                 this.dialogVisible = false;
                this.getExcelData();
            }
            }).catch(err => {
            console.log(err)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: "取消操作"
          });
        });
      },
      showDialog(){
         if(this.multipleSelection.length<1){
            this.$message({
                message: '至少选择一项!',
                type: 'warning'
            });
            return;
        }
         this.dialogVisible = true;
      },
      cancleCz(){
          this.dialogVisible = false;
      },
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
  .pro-item{
      width:100%;
      padding:20px;
  }
  .pro-item-div{
      width:20%;
      display: inline-block;
    vertical-align: text-top;
  }
    .pro-item-div p{
        line-height:28px;
        text-align:center;
        font-size:16px;
    }
  .item-div-list{
      width:28px;
      height: 28px;
      border:2px solid #bfcbd9;
      border-radius:50%;
      text-align:center;
      line-height:28px;
      font-size:16px;
      color:#bfcbd9;
      margin:4px auto;
  }
  .iten-list-name{
      color:#797979;
  }
</style>
