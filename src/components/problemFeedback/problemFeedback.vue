<template>
  <div class="problemfeedback">
    <Subnav :secondLevel="secondLevel" :threeLevel="threeLevel" @refresh="refresh"></Subnav>

    <div class="top_wap" style="padding: 20px;">
      <el-row style="padding:20px 10px 0px 10px;border:1px solid #eee;margin-bottom:20px">
        <el-col :span="22">
          <el-form :inline="true" style="" :model="filterForm" class="demo-form-inline">

            <el-form-item label="用户名">
              <el-input size="small" v-model="filterForm.userName" style="width:200px" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="区域">
              <el-select
                size="small"
                style="width: 150px"
                v-model="filterForm.pid"
                @change="f_provinceIds"
                clearable
                placeholder="省">
                <el-option
                  v-for="item in provinceIdsList"
                  :key="item.id"
                  :label="item.cityName"
                  :value="item.cityId"
                >
                </el-option>
              </el-select>
              <el-select size="small"
                         style="width: 150px"
                         v-model="filterForm.cid"
                         clearable
                         placeholder="市">
                <el-option
                  v-for="item in cityIdsList"
                  :key="item.id"
                  :label="item.cityName"
                  :value="item.cityId">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="">
              <el-form-item label="反馈时间">
                <el-date-picker
                  size="small"
                  style="width:300px"
                  v-model="editTime"
                  type="datetimerange"
                  @change="pickerChange"
                  align="right"
                  placeholder="选择日期范围"
                >
                </el-date-picker>
              </el-form-item>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="2" style="text-align:right">
          <el-button type="primary" @click="onSearchSubmit">查询</el-button>
        </el-col>
      </el-row>

      <div class="tabletopbar">
        <span style="margin-left:20px">查询结果：共</span>
        <span style="color:#111">{{tableData.rowCount}}</span> <span>条</span>
      </div>
      <el-table
        v-loading="tabLoading"
        :data="tableData.list"
        border
        style="width: 100%">
        <el-table-column
          prop="questionId"
          label="ID"
          width="120">
        </el-table-column>
        <el-table-column
          prop="area"
          label="省市"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="questionDescribe"
          label="问题描述"
          min-width="200">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="用户名"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="feedbackTime"
          label="反馈时间"
          min-width="150">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button type="text" size="small" @click="deleteProblem(scope.row.questionId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-show="tableData.rowCount>0"
        style="margin: 0 auto;text-align:center;margin-top:20px"
        layout="prev, pager, next,jumper"
        :page-size=10
        :currentPage="currentPage"
        @current-change="currentChange"
        :total=tableData.rowCount>
      </el-pagination>

    </div>
  </div>
</template>

<script>
    import Subnav from '../Subnav/Subnav'
    export default {
      name: "problemfeedback",
      components: {
        Subnav,
      },
      data(){
        return {
          secondLevel:'问题反馈',
          threeLevel:'问题反馈',
          cityIdsList: [],
          provinceIdsList: [],
          editTime: '',
          currentPage:1,
          filterForm: {
            pageNum: 0,
            pageSize: 10,
            pid:"",
            cid:"",
            userName:"",
            beginTime:"",
            startTime:'',
            endTime:'',
          },
          tableData: {
            pageCount: 0,
            list: []
          },
          tabLoading: false
        }
      },
      created(){
        if (this.$route.query.pageNum) {
          console.log(this.$route.query.pageNum);
          this.currentChange(this.$route.query.pageNum * 1 + 1);
        }
        this.getData();
        this.cityGetData();
      },
      methods:{
        // 获取数据
        getData(){
          let [_this, body] = [this, this.filterForm];
          this.tabLoading = true;
          console.log(body);
          this.$http('/buildingCamera/APPFeedback', {body}, {}, {}, 'post').then(res => {
            if (res.data.code == 0) {
              this.tabLoading = false;
              console.log(res);
              _this.tableData = res.data.response;
            }
          })
        },
        // 刷新
        refresh(){
          this.$store.dispatch('mainLoadingAction',true);
          this.getData()
          this.currentPage=1;
          // for(var i in this.filterForm){
          //   this.filterForm[i]=''
          // }
          var that=this
          setTimeout(function(){
            that.$store.dispatch('mainLoadingAction',false);
          },300)
        },
        //请求省市区
        cityGetData(){
          let [_this, body] = [this, {}];
          body.parentid = "";
          body.cityType = 1;
          _this.tabLoading = true;
          this.$http('/citis/cityLists', {body}, {}, {}, 'post').then(res => {
            if (res.data.code == 0) {
              console.log(res);
              _this.provinceIdsList = res.data.response.cityList;
            }
            _this.tabLoading = false;
          })
        },
        f_provinceIds(val){
          this.filterForm.cid = "";
          if (val != '') {
            let [_this, body] = [this, {}];
            body.parentid = val;
            body.cityType = 2;
            this.$http('/citis/cityLists', {body}, {}, {}, 'post').then(res => {
              if (res.data.code == 0) {
                _this.cityIdsList = res.data.response.cityList;
                // console.log(res);
              }
            })
          }
        },
        //触发搜索
        onSearchSubmit(){
          this.filterForm.pageNum = 0;
          if (this.currentPage != 1) {
            this.currentPage = 1;
          } else {
            this.getData();
          }
        },
        //改变页码
        currentChange(page){
          this.currentPage = page;
          this.filterForm.pageNum = page - 1;
          this.getData();
        },
        //改变时间格式
        pickerChange(val){
          this.filterForm.beginTime = val.slice(0,19)
          this.filterForm.endTime = val.slice(22)
        },
        //删除
        deleteProblem(val){
          console.log(val);
          let [_this, body] = [this, {}];
          // this.tabLoading = true;
          body.questionId = val;
          this.$confirm('确定删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http('/buildingCamera/delFeedback', {body}, {}, {}, 'post').then(res => {
              if (res.data.code == 0) {
                this.tabLoading = false;
                console.log(res);
                _this.tableData = res.data.response;
                this.$message({
                  type: 'success',
                  message: '已删除'
                });
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message:'取消删除'
            });
          });
        },
        //查看
        handleClick(val){
          console.log(this.filterForm.pageNum);
          let _this = this;
          this.$router.push({
            path: '/problem/problemfeedbackdetails',
            query: {
              area : val.area,
              feedbackTime : val.feedbackTime,
              questionDescribe : val.questionDescribe,
              questionId : val.questionId,
              questionPicList : _.cloneDeep(val.questionPicList),
              questionType : val.questionType,
              userName : val.userName,
              pageNum: _this.filterForm.pageNum
            }
          });
        },

      }
    }
</script>

<style scoped>
  .problemfeedback .top_wap{border: 1px solid #20a0ff;margin:20px;}
</style>
