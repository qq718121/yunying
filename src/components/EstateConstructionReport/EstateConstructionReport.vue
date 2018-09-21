<template>
  <div>
    <Subnav2 :navList="navList"></Subnav2>
    <el-row style="border:1px solid #ccc;padding:20px 10px 0px">
      <el-col :span="20">
        <el-form :inline="true" :model="filterForm" class="demo-form-inline">
          <el-form-item label="状态：">
            <el-select size="small" clearable v-model="filterForm.isOnline" style="width:150px;">
              <el-option label="在线" value="2"></el-option>
              <el-option label="离线" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间：">
            <el-select size="small" v-model="filterForm.timeType" style="width:150px;">
              <el-option label="创建时间" value="1"></el-option>
              <el-option label="更新时间" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间范围">
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
      <el-col :span="4">
        <el-button style="float:right;margin-left:5px;" type="primary" @click="addNew" v-if="type==='edit'">添加报告

        </el-button>
        <el-button style="float:right" type="primary" @click="onSearchSubmit">查询</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px">
      <div class="tabletopbar">
        <span>查询结果：共</span>
        <span style="color:#111">{{tableData.pageCount}}</span> <span>条</span>
      </div>
      <el-table
        v-loading="tabLoading"
        :data="tableData.list"
        border
        tooltip-effect="dark"
        style="font-size:12px!important">
        <el-table-column
          prop="reportName"
          label="报告名称+报告期数"
          min-width="100">
           <template slot-scope="scope">
                <span>{{ scope.row.reportName +'第'+ scope.row.reportVersion + '期' }}</span>
            </template>
        </el-table-column>
        <el-table-column
          prop="houseNumber"
          label="楼盘期数"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="isOnline"
          label="状态"
          min-width="100">
          <template scope="scope">
            <span v-if="scope.row.isOnline==2">在线</span>
            <span v-if="scope.row.isOnline==1">离线</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createUserName"
          min-width="100"
          label="创建人">
        </el-table-column>
        <el-table-column
          prop="editUserName"
          min-width="100"
          label="编辑人">
        </el-table-column>
        <el-table-column
          prop="createTime"
          min-width="100"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="editTime"
          min-width="100"
          label="最后更新时间">
        </el-table-column>
        <el-table-column
          width="300"
          label="操作">
          <template scope="scope">
            <el-button
              size="small"
              @click="handle(scope.row,1)">
              <span>查看</span>
            </el-button>
            <el-button
              size="small"
              v-if="type==='edit'"
              :disabled="tableData.examineStatus !=1 && scope.row.isOnline==2 && tableData.editStatus == 1"
              @click="handle(scope.row,2)">
              <span>编辑</span>
            </el-button>
            <el-button
              size="small"
              v-if="(type==='edit' && tableData.examineStatus ==1) || (type==='edit' && tableData.editStatus != 1)"
              @click="handle(scope.row,3)">
              <span>{{scope.row.isOnline == 1 ? '上线' : '下线'}}</span>
            </el-button>
            <el-button
              size="small"
              v-if="(type==='edit' && tableData.examineStatus ==1) || (type==='edit' && tableData.editStatus != 1)"
              @click="handle(scope.row,4)">
              <span>删除</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-show="tableData.pageCount>0"
        style="margin: 0 auto;text-align:center;margin-top:20px"
        layout="prev, pager, next,jumper"
        :page-size="10"
        :currentPage="currentPage"
        @current-change="currentChange"
        :total="tableData.pageCount">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
  import Subnav2 from '../Subnav2/Subnav2';
  import message from '../../common/message';
  export default{
    name: 'EstateConstructionReport',
    components: {
      Subnav2
    },
    data(){
      return {
        navList:[
          {path:'/index/estateprocessmonitoringmanagement',name:'首页'},
          {path:'/index/estateprocessmonitoringmanagement',name:this.$route.query.buildingName},
        ],
        tabLoading: false,
        currentPage: 1,
        editTime: '',
        filterForm: {
          timeType: '1',
          pageNum: 0,
          pageSize: 10,
          isOnline: '',
          startTime: '',
          endTime: '',
          buildingId: this.$route.query.buildingId
        },
        tableData: {
          list: [],
          editStatus:1,
          examineStatus:1,
          pageCount: 0
        }
      }
    },
    computed: {
      type: function () {
        return this.$route.query.type;
      },
      buildingId: function () {
        return this.$route.query.buildingId;
      }
    },
    created(){
      this.getData();
    },
    methods: {
      //获取数据
      getData(){
        let body = _.cloneDeep(this.filterForm);
        body.bid = this.$route.query.buildingId;
        this.tabLoading = true;
        this.$http('/buildingConstructionReport/queryListInfo', {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            this.tableData = res.data.response;
          }
          this.tabLoading = false;
        })
      },
      //页码改变
      currentChange(page){
        this.filterForm.pageNum = page - 1;
        this.getData();
      },
      //搜索
      onSearchSubmit(){
        this.filterForm.pageNum = 0;
        this.currentPage = 1;
        this.getData();
      },
      //新增
      addNew(){
        console.log(this.$route.query.buildingName);
        console.log(this.$route.query.buildingId);
        this.$router.push({
          path: '/index/estateconstructionreporttab',
          query: {
            path: this.$route.fullPath,
            type: 'add',
            buildingName: this.$route.query.buildingName,
            buildingId: this.$route.query.buildingId
          }
        })
      },
      //改变时间格式
      pickerChange(val){
        this.filterForm.startTime = val.slice(0, 19);
        this.filterForm.endTime = val.slice(22);
      },
      noLonger(row) {
        let _this = this,
          strText = '',
          strResultText = '',
          body = _.cloneDeep(row);
        if (row.isOnline == 1) {
          strText = '确定上线该条报告？';
          strResultText = '上线成功';
          body.isOnline = 2
        } else {
          strText = '确定下线该条报告？';
          strResultText = '下线成功';
          body.isOnline = 1
        }
        this.$confirm(strText, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            _this.tabLoading = true;
          _this.$http('/buildingConstructionReport/updateInfo', {body}, {}, {}, 'post').then(function (res) {
            if (res.data.code == 0) {
                 _this.tabLoading = false;
              _this.$message({
                type: 'success',
                message: strResultText
              });
              _this.getData();
            } else if (res.data.code == 300) {
              _this.$router.push('/login')
            } else {
              _this.$message({
                message: res.data.message,
                type: 'warning'
              });
            }
            _this.is_loading_tab = false;
          }).catch(function (err) {
            _this.is_loading_tab = false;
            _this.tabLoading = false;
          })
        }).catch(() => {
            _this.tabLoading = false;
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      //操作
      handle(row, type, rowIndex){
        if (type == 1) {
          this.$router.push({
            path: '/index/estateconstructionreporttab',
            query: {
              path: this.$route.fullPath,
              type: 'view',
              buildingName: this.$route.query.buildingName,
              buildingId: this.$route.query.buildingId,
              id: row.id,
              tab: row
            }
          })
        } else if (type == 2) {
          this.$router.push({
            path: '/index/estateconstructionreporttab',
            query: {
              path: this.$route.fullPath,
              type: 'edit',
              buildingName: this.$route.query.buildingName,
              buildingId: this.$route.query.buildingId,
              id: row.id,
              tab: row,
              houseNumberId:row.houseNumberId
            }
          });
        } else if (type == 3) {
          this.noLonger(row);
        } else if (type == 4) {
          let body = {
            id: row.id
          };
          this.$confirm('是否确定删除该条数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http('/buildingConstructionReport/delInfo', {body}, {}, {}, 'post').then(res => {
              if (res.data.code == 0) {
                if (res.data.response.res == 1) {
                  message(this, '删除成功!', 'success');
                  this.getData();
                } else {
                  message(this, '删除失败', 'warning');
                }
              }
            })
          }).catch(() => {

          });
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

  .el-checkbox {
    margin-left: 0px;
    margin-right: 10px;
  }
</style>
