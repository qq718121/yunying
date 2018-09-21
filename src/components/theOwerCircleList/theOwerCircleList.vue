<template>
     <div>
          <Subnav2 :navList="navList" @refresh="refresh"></Subnav2>
          <div style="padding:20px">
               <el-row style="padding:20px 10px 0px 10px;border:1px solid #eee;">
                    <el-col :span="22">
                         <el-form :inline="true" style="" :model="filterForm" class="demo-form-inline" @keyup.native.enter="onSearchSubmit">

                              <el-form-item label="楼盘id">
                                   <el-input size="small" v-model="filterForm.id" style="width:80px" placeholder="id"></el-input>
                              </el-form-item>

                              <el-form-item label="区域">
                                   <MjbArea :isShowArea="true" :_province.sync="filterForm.pid" :_city.sync="filterForm.cid" :_area.sync="filterForm.areaId" />
                              </el-form-item>

                              <el-form-item label="楼盘名称">
                                   <MjbBuildingSearch :_buildingName.sync="filterForm.buildingName" />
                              </el-form-item>
                         </el-form>
                    </el-col>
                    <el-col :span="2" style="text-align:right">
                         <el-button type="primary" @click="onSearchSubmit">查询</el-button>
                    </el-col>
               </el-row>
          </div>
          <div style="padding:20px;">
               <div class="tabletopbar">
                    <span>查询结果：共</span>
                    <span style="color:#111">{{tableData.rowCount}}</span>
                    <span>条</span>
               </div>
               <el-table v-loading="tabLoading" :data="tableData.list" border tooltip-effect="dark" style="width: 100%;font-size:12px!important;">
                    <el-table-column prop="buildingId" label="楼盘id" min-width="60">
                    </el-table-column>
                    <el-table-column prop="buildingName" label="楼盘名称" min-width="100">
                    </el-table-column>
                    <el-table-column prop="area" label="区域" min-width="100">
                    </el-table-column>
                    <el-table-column prop="circleUserCount" min-width="80" label="业主人数">
                    </el-table-column>
                    <el-table-column prop="circleMessageCount" min-width="80" label="消息数">
                    </el-table-column>
                    <el-table-column prop="officialMessageCount" min-width="80" label="官方消息">
                    </el-table-column>
                    <el-table-column prop="latestMessageTime" min-width="80" label="最新消息发布时间">
                    </el-table-column>
                    <el-table-column min-width="90" label="操作">
                         <template scope="scope">
                              <el-button size="small" @click="handle(scope.row,3)">
                                   <span>进入业主圈</span>
                              </el-button>
                         </template>
                    </el-table-column>
               </el-table>
               <el-pagination v-show="tableData.rowCount>0" style="margin: 0 auto;text-align:center;margin-top:20px" layout="prev, pager, next,jumper" :page-size="20" :currentPage="currentPage" @current-change="currentChange" :total="tableData.rowCount"></el-pagination>
          </div>
     </div>
</template>

<script>
import Subnav2 from '../Subnav2/Subnav2'
import message from '../../common/message'
import MjbArea from '../Common/MjbArea/MjbArea';
import MjbBuildingSearch from '../Common/MjbBuildingSearch/MjbBuildingSearch';
export default {
     name: 'EstateProcessMonitoringManagement',
     components: {
          Subnav2,
          MjbArea,
          MjbBuildingSearch
     },
     data() {
          return {
               navList: [
                    { path: '/activity/theOwerCircleList', name: '业主圈管理' },
                    { path: '/activity/theOwerCircleList', name: '列表' },
               ],
               tabLoading: false,
               currentPage: 1,
               filterForm: {
                    pageNum: 0,
                    pageSize: 20,
                    id: '',
                    pid: '',
                    cid: '',
                    areaId: '',
                    name: '',
                    buildingName: ''
               },
               loadClick: false,
               tableData: {
                    buildingMonitorInfo: [],
                    totalCount: 0
               }
          }
     },
     created() {
          this.getData();
          this.$store.dispatch('defaultIndexAction', '/activity/theOwerCircleList');
     },
     methods: {
          //获取数据
          getData() {
               let _this = this,
                    body = _.cloneDeep(this.filterForm)
               _this.tabLoading = true;
               this.$http('/buildingOperate/getCircleBuidingList', { body }, {}, {}, 'post').then(res => {
                    if (res.data.code == 0) {
                         _this.tableData = res.data.response;
                    }
                    _this.tabLoading = false;
               }).catch(err => {
                    console.log(err)
                    _this.tabLoading = false;
               })
          },
          //页码改变
          currentChange(page) {
               this.filterForm.pageNum = page - 1;
               this.getData();
          },
          //操作
          handle(row) {
               this.$router.push({
                    
                    path: '/activity/theOwerCircleHome',
                    query: {
                         buildingId: row.buildingId,
                         buildingName: row.buildingName
                    }
               })

          },
          //刷新
          refresh() {
               this.filterForm.pageNum = 0;
               this.getData();
          },
          //触发搜索
          onSearchSubmit() {
               this.filterForm.pageNum = 0;
               if (this.currentPage != 1) {
                    this.currentPage = 1;
               } else {
                    this.getData();
               }
          },
     }
}
</script>

<style scoped>
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
