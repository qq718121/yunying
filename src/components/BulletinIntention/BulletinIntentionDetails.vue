<template>
  <div class="buor">
    <Subnav2 :navList="navList" @refresh="refresh"></Subnav2>
    <div style="padding:20px">

      <el-row style="padding:20px 10px 0px 10px;border:1px solid #eee;margin-bottom:20px">
        <el-col :span="20">
          <el-form :inline="true" style="" :model="filterForm" class="demo-form-inline">

            <el-form-item label="用户id">
              <el-input size="small" v-model="filterForm.userId" style="width:80px" placeholder="id"></el-input>
            </el-form-item>
             <el-form-item label="分类">
                 <el-select v-model="filterForm.subscribeTypeId" placeholder="请选择" clearable>
                    <el-option
                    v-for="item in tableData.typeList"
                    :key="item.subscribeTypeId"
                    :label="item.subscribeTypeName"
                    :value="item.subscribeTypeId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="电话">
              <el-input size="small" v-model="filterForm.userPhone" style="width:200px" placeholder="电话"></el-input>
            </el-form-item>
            <el-form-item label="订阅时间">
                <el-date-picker
                    v-model="filterForm.allTime"
                    type="datetimerange"
                    placeholder="选择日期"
                    :default-time="['12:00:00']">
                    </el-date-picker>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4" style="text-align:right">
          <el-button type="primary" @click="onSearchSubmit">查询</el-button>
        </el-col>
      </el-row>
    <!-- <div class="addwid">
         <el-button type="primary" @click="exportSub()">导出订阅</el-button>
    </div> -->
      <div class="tabletopbar">
        <span style="margin-left:20px">查询结果：共</span>
        <span style="color:#111">{{tableData.rowCount}}</span> <span>条</span>
      </div>
      <el-table
        v-loading="is_loading_tab"
        ref="multipleTable"
        :data="tableData.list"
        border
        tooltip-effect="dark"
        style="width: 100%;font-size:12px!important;">
        <el-table-column
          prop="userId"
          label="ID"
          min-width="80">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="用户"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="subscribeTypeName"
          label="订阅信息分类"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="userPhone"
          label="电话"
          min-width="120">
        </el-table-column>
         <el-table-column
          prop="createTime"
          label="订阅时间"
          min-width="120">
        </el-table-column>
        <el-table-column
          width="320"
          label="操作">
          <template scope="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.$index, scope.row,1)">查看</el-button>
            <el-button
              size="small"
              @click="handleEdit(scope.$index, scope.row,2)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
        <el-dialog
            title="查看"
            :visible.sync="dialogVisible"
            width="30%">
           <el-form>
               <el-form-item label="姓名:">
                    <span>{{rows.userName}}</span>
                </el-form-item>
                <el-form-item label="订阅信息类别:">
                    <span>{{rows.subscribeTypeName}}</span>
                </el-form-item>
                 <el-form-item label="电话:">
                    <span>{{rows.userPhone}}</span>
                </el-form-item>
                <el-form-item label="申请时间:">
                    <span>{{rows.createTime}}</span>
                </el-form-item>
           </el-form>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="dialogVisible = false">关 闭</el-button> -->
                <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
            </span>
            </el-dialog>
      <el-pagination
        v-show="tableData.rowCount>0"
        style="margin: 0 auto;text-align:center;margin-top:20px"
        layout="prev, pager, next,jumper"
        :page-size=10
        :currentPage="currentPage"
        @current-change="currentChange"
        :total="tableData.rowCount">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import Subnav2 from '../Subnav2/Subnav2'
  import message from '../../common/message'
  export default {
    name: 'buor',
    components: {
      Subnav2,
    },
    data() {
      return {
        navList: [
          {path: "/subscribe/bulletinIntention", name: '首页'},
          {path: "/subscribe/bulletinIntention", name: '意向订阅'},
          {path: this.$route.fullPath, name: '意向订阅详情'},
        ],
        currentPage: 1,
        buidingList: [],

        editTime: '',
        filterForm: {
          pageNum: 0,
          pageSize: 10,
          userId: '',
          subscribeTypeId: '',
          buildingId: '',
          userPhone:"",
          startTime:"",
          endTime:"",
          allTime:""
//          buildStatus: ''
        },
        tableData: {
          rowCount: 0,
          list: [],
          typeList:[]
        },
        is_loading_tab: false,
        dialogVisible:false,
        rows:{}
      };
    },
    computed: {},
    created(){
      this.getData()
    },
    methods: {
      //请求数据方法
      getData(){
         
        let _this = this;
        _this.is_loading_tab = true;
        let body =  _this.filterForm;
         if(this.filterForm.allTime){
              console.log(this.filterForm.allTime);
              body.startTime = this.fermitTime(this.filterForm.allTime[0]);
              body.endTime = this.fermitTime(this.filterForm.allTime[1]);
          }
        body.buildingId = this.$route.query.buildingId;
        this.$http('/backstageUser/getIntentionSubscripInfo', {body: _this.filterForm}, {}, {}, 'post').then(function (res) {
          _this.is_loading_tab = false;
          if (res.data.code == 0) {
            _this.tableData = res.data.response;
          }
        })
      },
      //触发搜索
      onSearchSubmit(){
        this.filterForm.pageNum = 0;
        if (this.currentPage != 1) {
          this.currentPage = 1;
        } else {
          this.getData()
        }
      },
      //改变页码
      currentChange(page){
        this.currentPage = page;
        this.filterForm.pageNum = page - 1;
        this.getData()
      },
      handleEdit(sc,row,type){
        let _this = this;
        if(type == 1){
            console.log(row);
            this.rows = row;
            this.dialogVisible = true;
        }else if(type == 2){
            this.$confirm("确认删除吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(() => {
            let body = {id:row.id};
            this.$http(
                "/backstageUser/delIntentionSubscripInfo",
                { body },
                {},
                {},
                "post"
            ).then(res => {
                if (res.data.code == 0) {
                    _this.$message({
                        type: "success",
                        message: "删除成功!"
                    });
                    _this.getData();
                }
            });
            })
            .catch(() => {
                console.log("cancle");
            });
        }
        
      },
      //刷新方法
      refresh(){
          
      },
    //   导出订阅
    // exportSub(){
    //     this.$http(
    //             "/backstageUser/exportIntenSubInfo",
    //             {},
    //             {},
    //             {},
    //             "post"
    //         ).then(res => {
    //            this.$alert(res.data.message, {
    //                 confirmButtonText: '确定',
    //                 callback: action => {
    //                     console.log("guanbi");
    //                 }
    //             });
    //         }).catch(() => {
    //             connsole.log("error");
    //         });
    // },
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
  }
   }
</script>

<style scoped>
  .el-dialog {
    margin-bottom: 0px;
    margin-top: -100px !important
  }

  .slide-enter-active, .slide-leave-active {
    transition: height 1s
  }

  .slide-enter, .slide-leave-to {
    height: 0
  }

  .slide-leave, .slide-enter-to {
    height: 100px
  }

  .tabletopbar {
    height: 40px;
    background: #eef1f6;
    border-left: 1px solid #dfe6ec;
    border-right: 1px solid #dfe6ec;
    border-top: 1px solid #dfe6ec;
    line-height: 40px;
    font-size: 12px;
    color: #555;
    padding: 0px 15px;
  }
.addwid{
    width: 100%;
    height: 60px;
    text-align: right;
}
</style>

<style>
  .el-table--border td, .el-table--border th {
    text-align: center;
  }
</style>
