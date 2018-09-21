<template>
  <div class="managers">
    <Subnav2 :navList="navList" @refresh="refresh"></Subnav2>

    <div style="padding:20px">

      <el-row style="padding:20px 10px 0px 10px;border:1px solid #eee;margin-bottom:20px">
        <el-col :span="22">
          <el-form :inline="true" style="" :model="filterForm" class="demo-form-inline">

            <el-form-item label="区域">
              <MjbArea
                :isShowArea="true"
                :_province.sync="filterForm.province"
                :_city.sync="filterForm.city"
                :_area.sync="filterForm.area"/>
            </el-form-item>

            <el-form-item label="楼盘名称">
              <MjbBuildingSearch :_buildingName.sync="filterForm.buildingName"/>
            </el-form-item>

            <el-form-item label="审核人">
                <el-autocomplete
                        class="inline-input"
                        v-model="filterForm.auditorId"
                        :fetch-suggestions="querySearch"
                        placeholder="请输入内容"
                        ></el-autocomplete>
            </el-form-item>

            <el-form-item label="是否分配">
              <el-select size="small" clearable v-model="filterForm.isAllocate" style="width:150px">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="分配时间">
              <el-date-picker
                size="small"
                style="width:300px"
                @change="pickerChange"
                v-model="editTime"
                type="datetimerange"
                align="right"
                placeholder="选择日期范围"
                >
              </el-date-picker>
            </el-form-item>

          </el-form>
        </el-col>
        <el-col :span="2" style="text-align:right">

            <el-button type="primary" @click="onSearchSubmit">查询</el-button>

        </el-col>
      </el-row>

      <div class="tabletopbar">
        <span style="margin-left:20px">查询结果：共</span>
        <span style="color:#111">{{tableData.aCount}}</span> <span>条</span>
        <el-button type="primary" size="small" style="margin-left:20px;" @click="showDialg">批量分配</el-button>
      </div>
      <el-table
        v-loading="tabLoading"
        ref="multipleTable"
        :data="tableData.auditorInfo"
        @selection-change="handleSelectionChange"
        border
        tooltip-effect="dark"
        style="width: 100%;font-size:12px!important;">
          <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
          prop="buildingId"
          label="ID"
          width="100">
        </el-table-column>
        <el-table-column
          prop="buildingName"
          label="楼盘名"
          min-width="60">
        </el-table-column>
        <el-table-column
          prop="locatArea"
          label="所在地区"
          min-width="60">
        </el-table-column>
        <el-table-column
          prop="isAllocate"
          label="是否分配"
          min-width="80">
          <template scope="scope">
            <span v-if="scope.row.isAllocate===1">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="auditor"
          label="审核人"
          min-width="60">
        </el-table-column>
        <el-table-column
          prop="assignor"
          label="分配人"
          min-width="60">
        </el-table-column>
        <el-table-column
          prop="distributeTime"
          min-width="80"
          label="分配时间">
        </el-table-column>
        <el-table-column
          width="320"
          label="操作">
          <template scope="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.$index, scope.row,2)">
              编辑
            </el-button>
            <el-button
              size="small"
              @click="handleEdit(scope.$index, scope.row,1)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
        <el-dialog
            title="批量操作"
            :visible.sync="dialogVisible"
            width="30%">
            <el-form>
                 <el-form-item label="选择分配角色：">
                    <el-select v-model="form.roleId" placeholder="请选择" @change="getRouList">
                        <el-option
                        v-for="item in perData2"
                        :key="item.roleId"
                        :label="item.roleName"
                        :value="item.roleId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="user" label="指派采集人：">
                    <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                    <el-checkbox-group type="small" v-model="form.collector" @change="handleCheckAllChange2">
                    <el-checkbox :label="item.key" v-for="(item,index) in perData" :key="index">{{item.value}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="batchDistributTaskUser">确 定</el-button>
            </span>
            </el-dialog>
      <el-pagination
        v-show="tableData.aCount>0"
        style="margin: 0 auto;text-align:center;margin-top:20px"
        layout="prev, pager, next,jumper"
        :page-size=10
        :currentPage="currentPage"
        @current-change="currentChange"
        :total="tableData.aCount">
      </el-pagination>
    </div>

  </div>
</template>

<script>

import Subnav2 from '../Subnav2/Subnav2'
import message from '../../common/message'
import MjbArea from '../Common/MjbArea/MjbArea';
import MjbBuildingSearch from '../Common/MjbBuildingSearch/MjbBuildingSearch';
export default {
    name:'managers',
    components:{
      Subnav2,
      MjbArea,
      MjbBuildingSearch
    },
    data() {
      return {
        currentPage:1,
        navList:[
          {path:this.$route.fullPath,name:'首页'},
          {path:this.$route.fullPath,name:'监控楼盘审核'},
          {path:this.$route.fullPath,name:'列表'}
        ],
        editTime:'',

        filterForm: {
          pageNum:0,
          pageSize:10,
          province:'',
          city:'',
          area:'',
          buildingName:'',
          auditorId:'',
          isAllocate:'',
          coStartime:'',
          coEndtime:'',
          auditor:''
        },
        tableData: {
          aCount:0,
          auditorInfo:[]
        },
        tabLoading:false,
        perData: [],
        perData2: [],
        form:{
          roleId:"",
          collector:[]
        },
      handleSelection:[],
      dialogVisible:false,
      checkAll:"",
      };
    },
    filters:{

    },
    computed:{

    },
    created(){
    //   this.getPerData()
     if(this.$route.query.data){
          this.filterForm = JSON.parse(this.$route.query.data);
        this.currentPage = this.filterForm.pageNum+1;
    }
      this.getData();
     this.getPerData(""); 
    },
    methods: {
      //请求数据方法
      getData(){
        let _this = this;
        _this.tabLoading = true;
        this.$http('/taskManage/getAuditingList',{body:_this.filterForm},{},{},'post').then(res => {
          _this.tabLoading = false;
          if(res.data.code == 0){
            _this.tableData = res.data.response;
          }
        })
      },

      //触发搜索
      onSearchSubmit(){
        this.filterForm.pageNum = 0;
        if(this.currentPage != 1){
          this.currentPage = 1;
        }else{
          this.getData()
        }
      },
      //改变时间格式
      pickerChange(val){
        this.filterForm.coStartime=val.slice(0,19)
        this.filterForm.coEndtime=val.slice(22)
      },
      //改变页码
      currentChange(page){
        this.currentPage = page;
        this.filterForm.pageNum = page-1;
        this.getData()
      },
      //刷新方法
      refresh(){

      },

      //操作
      handleEdit(index, row ,type) {
        let _this =this;
        if(type == 1){
          this.$router.push({
            path:'/task/auditdetail',
            query:{
              type:'view',
              info:JSON.stringify(row),
              data:this.filterForm
            }
          })
        }else if(type==2){
          this.$router.push({
            path:'/task/auditdetail',
            query:{
              type:'edit',
              info:JSON.stringify(row),
              data:this.filterForm
            }
          })
        }
      },
            //获取指派人员
    getPerData(rId){
      let _this = this;
     let body = {roleId:rId};
      this.$http('/taskManage/getBackUserList',{body},{},{},'post').then(function(res){
        if(res.data.code == 0){
          _this.perData = res.data.response.assignorList;
        }else{
          message(_this,res.data.message,'warning')
        }
      }).catch(function(err){
        console.log(err)

      })
    },
 getPerDataList(){
      let _this = this;
     let body= {roleType:"2"};
      this.$http('/taskManage/getBackstageRoleInfo',{body},{},{},'post').then(function(res){
        if(res.data.code == 0){
          _this.perData2 = res.data.response.list;
          _this.form.roleId = res.data.response.list[0].roleId;
        }
      })
    },
    getRouList(){
        this.getPerData(this.form.roleId);
    },
    handleSelectionChange(val){
        console.log(val);
        this.handleSelection = val;
    },
    showDialg(){
        if(this.handleSelection.length<1){
            message(this,"至少选择一条!",'warning');
            return;
        }
        this.getPerDataList();
        this.getPerData(this.form.roleId);
        this.dialogVisible = true;
    },
    //批量分配
    batchDistributTaskUser(){
        if(this.form.collector.length<1){
            message(this,"请选择指派采集人!",'warning');
            return;
        }
        let selectArr = [];
        let _this = this;
        let body = {};
         this.handleSelection.forEach((item,index) => {
             selectArr.push(this.handleSelection[index].buildingId);
             console.log(this.handleSelection[index].buildingId);
         });
        console.log(selectArr);
        body.pType = "2";
        body.buildingIds = selectArr.join(",");
        body.userIds = this.form.collector.join(",");
        console.log(body);
        this.$http('/taskManage/batchDistributTaskUser',{body},{},{},'post').then(function(res){
            if(res.data.code == 0){
                message(_this,"批量操作成功!",'success');
                _this.dialogVisible = false;
                _this.getData();
                _this.form.collector = [];
                _this.checkAll = false;
            }
        })
    },
          // 全选
    handleCheckAllChange(){
        if(this.checkAll){
            this.perData.forEach((item,index) => {
                this.form.collector.push(this.perData[index].key);
            });
        }else{
            this.form.collector = [];
        }
    },
    handleCheckAllChange2(){
        if(this.form.collector.length == this.perData.length){
            this.checkAll = true;
        }else{
            this.checkAll = false;
        }
    },
     querySearch(queryString, cb) {
        var restaurants = this.perData;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
    },
    mounted(){
      this.$store.dispatch('defaultIndexAction','/task/auditmanagement');
    }
  }
</script>

<style scoped>
.el-dialog{margin-bottom: 0px;margin-top: -100px!important}
.slide-enter-active, .slide-leave-active {
  transition: height 1s
}
.slide-enter,.slide-leave-to{
  height: 0
}
.slide-leave,.slide-enter-to{
  height: 100px
}
.tabletopbar{height:40px;background:#eef1f6;border-left:1px solid #dfe6ec;border-right:1px solid #dfe6ec;border-top:1px solid #dfe6ec;line-height:40px;font-size:12px;color:#555;padding:0px 15px;}

</style>

<style>
  .el-table--border td, .el-table--border th{text-align: center;}
</style>
