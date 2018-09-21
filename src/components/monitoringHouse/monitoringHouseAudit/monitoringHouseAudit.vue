<template>
  <div class="managers">
    <Subnav2 :navList="navList" @refresh="refresh"></Subnav2>

    <div style="padding:20px">

      <el-row style="padding:20px 10px 0px 10px;border:1px solid #eee;margin-bottom:20px">
        <el-col :span="22">
          <el-form :inline="true" style="" :model="filterForm" class="demo-form-inline">

            <el-form-item label="楼盘id">
              <el-input size="small" v-model="filterForm.id" style="width:80px" placeholder="id"></el-input>
            </el-form-item>

            <el-form-item label="区域">
              <MjbArea
                :isShowArea="true"
                :_province.sync="filterForm.pid"
                :_city.sync="filterForm.cid"
                :_area.sync="filterForm.areaId"/>
            </el-form-item>

            <el-form-item label="楼盘名称">
              <MjbBuildingSearch :_buildingName.sync="filterForm.buildingName"/>
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
        :data="tableData.buildList"
        border
        tooltip-effect="dark"
        style="width: 100%;font-size:12px!important;">
        <el-table-column
          prop="id"
          label="ID"
          width="80">
        </el-table-column>
        <el-table-column
          prop="buildingName"
          label="楼盘名"
          min-width="80">
        </el-table-column>
        <el-table-column
          prop="localArea"
          label="所在地区"
          min-width="80">
        </el-table-column>
        <el-table-column
          prop="developers"
          label="开发商"
          min-width="80">
        </el-table-column>

        <!-- <el-table-column
          prop="developNumber"
          label="期数"
          min-width="60">
        </el-table-column> -->
        <el-table-column
          label="是否上线"
          min-width="60">
          <template scope="scope">
            <span>{{scope.row.buildingStatus == '1'? '上线':'离线'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="buildingCount"
          min-width="60"
          label="楼幢数">
        </el-table-column>
         <el-table-column
          prop="toBeSubmitCount"
          min-width="60"
          label="待提交数据（条）">
        </el-table-column>
        <el-table-column
          prop="noAuditCount"
          min-width="60"
          label="待审核数据（条）">
        </el-table-column>
        <el-table-column
          prop="isPassCount"
          min-width="60"
          label="已审核通过数据（条）">
        </el-table-column>
        <el-table-column
          prop="noPassCount"
          min-width="60"
          label="未通过数据（条）">
        </el-table-column>
        <el-table-column
          prop="buildUpdateTime"
          min-width="80"
          label="最后更新拍照时间">
        </el-table-column>
        <el-table-column
          width="90"
          label="操作">
          <template scope="scope">
            <el-button
              size="small"
              style="float: left;"
              @click="handleEdit(scope.$index, scope.row,'',0)">
              <span>审核</span>
            </el-button>
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
        :total="tableData.rowCount">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import Subnav2 from '../../Subnav2/Subnav2'
  import message from '../../../common/message'
  import MjbArea from '../../Common/MjbArea/MjbArea';
  import MjbBuildingSearch from '../../Common/MjbBuildingSearch/MjbBuildingSearch';
  export default {
    name: 'managers',
    components: {
      Subnav2,
      MjbArea,
      MjbBuildingSearch
    },
    data() {
      return {
        currentPage: 1,
        navList: [
          {path: this.$route.fullPath, name: '首页'},
          {path: this.$route.fullPath, name: '监控楼盘审核'},
          {path: this.$route.fullPath, name: '列表'}
        ],

        filterForm: {
          pageNum: 0,
          pageSize: 10,
          id: '',
          pid: '',
          cid: '',
          areaId: '',
          name: '',
        },
        tableData: {
          pageCount: 0,
          list: []
        },
        tabLoading: false,
      };
    },
    created(){
       if(this.$route.query.datas){
            this.filterForm = JSON.parse(this.$route.query.datas);
            this.currentPage = this.filterForm.pageNum+1;
       }
        this.getData();
        
    },
    methods: {
      //请求数据方法
      getData(){
        let [_this, body] = [this, this.filterForm];
        _this.tabLoading = true;
        this.$http('/buildingCamera/getAPPbuildList', {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            _this.tableData = res.data.response;
          }
          _this.tabLoading = false;
        })
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
        this.getData()
      },
      //刷新方法
      refresh(){
        for (let i in this.filterForm) {
          if (i == 'pageNum') {
            this.filterForm[i] = 0;
          } else if (i != 'pageSize') {
            this.filterForm[i] = '';
          }
        }
        if (this.currentPage != 1) {
          this.currentPage = 1;
        } else {
          this.getData()
        }
      },
      //操作
      handleEdit(index, row, type, key) {
        if (key == 0) {
          this.$router.push({
            path: '/monitoring/houseAudit',
            query: {
              id: row.id,
             datas:JSON.stringify(this.filterForm),
              name: row.buildingName
            }
          })
        }
      },
    },
    mounted(){
      this.$store.dispatch('defaultIndexAction', '/monitoring/monitoringHouseAudit');
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

</style>

<style>
  .el-table--border td, .el-table--border th {
    text-align: center;
  }
</style>
