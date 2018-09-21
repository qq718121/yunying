<template>
  <div class="buor">
    <div style="padding:20px">
        <el-button type="primary" v-if="type == 'edit'" style="margin:20px 0;" @click="addOpenTime()">新增开盘时间</el-button>
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
          prop="id"
          label="id"
          min-width="60">
        </el-table-column>
        <el-table-column
          prop="periods"
          label="期数"
          min-width="60">
        </el-table-column>
        <el-table-column
          label="开盘状态"
          min-width="60">
         <template scope="scope">
            <span>{{scope.row.isExactTime == 1? "确认开盘":"预计开盘"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="openTime"
          label="开盘时间"
          min-width="60">
        </el-table-column>
        <el-table-column
          prop="openFloor"
          label="开盘楼栋"
          min-width="80">
        </el-table-column>
        <el-table-column
          width="320"
          v-if="type == 'edit'"
          label="操作">
          <template scope="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.$index, scope.row,1)">
              编辑
            </el-button>
            <el-button
              size="small"
              @click="handleEdit(scope.$index, scope.row,2)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
        <el-dialog
            title="编辑开盘时间"
            :visible.sync="dialogVisible"
            width="30%">
            <el-form :model="form" class="demo-form-inline">
                 <el-form-item label="状态" :label-width="labelWidth" required>
                     <el-radio-group v-model="form.isExactTime">
                        <el-radio :label="1">确认开盘</el-radio>
                        <el-radio :label="2">预计开盘</el-radio>
                    </el-radio-group>
                 </el-form-item>
                 <el-form-item  label="开盘时间" :label-width="labelWidth" required>
                     <el-date-picker
                        v-model="form.openTime"
                        type="datetime"
                        format="yyyy - MM - dd"
                        placeholder="选择日期时间">
                    </el-date-picker>
                 </el-form-item>
                 <el-form-item  label="开盘楼栋" :label-width="labelWidth"  style="width:40%;" required>
                     <el-input v-model="form.openFloor" placeholder="请输入楼栋"></el-input>
                 </el-form-item>
                 <el-form-item  label="期数" :label-width="labelWidth" style="width:40%;">
                        <el-input v-model="form.periods" placeholder="请输入期数"></el-input>
                 </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addNewHandle()">确 定</el-button>
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
  import message from '../../common/message'
  export default {
    name: 'buor2',
    components: {

    },
    data() {
      return {
        currentPage: 1,
        tableData: {
          rowCount: 0,
          list: []
        },
        form:{
            pageNum:"0",
            pageSize:"10",
            bid:this.$route.query.buildingId,
            periods:"",
            openTime:"",
            openFloor:"",
            isExactTime:"",
            id:""
        },
        type:this.$route.query.type,
        dialogVisible:false,
        is_loading_tab: false,
        labelWidth:"120px"
      };
    },
    computed: {},
    created(){
      this.getData();
    },
    methods: {
      //请求数据方法
      getData(){
        let _this = this;
        _this.is_loading_tab = true;
        let body = this.form;

        this.$http('/backstageBuilding/getBuidingOpenTimeList', {body}, {}, {}, 'post').then(function (res) {
          _this.is_loading_tab = false;
          if (res.data.code == 0) {
            _this.tableData = res.data.response;
          }
        })
      },
      //触发搜索
      onSearchSubmit(){
        this.form.pageNum = 0;
        if (this.currentPage != 1) {
          this.currentPage = 1;
        } else {
          this.getData()
        }
      },
      //改变页码
      currentChange(page){
        this.currentPage = page;
        this.form.pageNum = page - 1;
        this.getData()
      },
        handleEdit(index,row,type){
            if(type == 1){
                this.dialogVisible = true;
                this.form.id = row.id;
                this.form.isExactTime = row.isExactTime;
                this.form.openFloor = row.openFloor;
                this.form.openTime = row.openTime;
                this.form.periods = row.periods;
            }else if(type == 2){
                this.$confirm("确认提交审核选中照片?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    let body = {};
                    let _this =this;
                    body.id = row.id;
                    this.$http('/backstageBuilding/delBuidingOpenTimeInfo', {body}, {}, {}, 'post').then(function (res) {
                        if (res.data.code == 0) {
                            _this.$message({
                                type: 'info',
                                message: '删除成功!'
                            });
                            _this.tableData = res.data.response;
                            _this.dialogVisible = false;
                        }
                    })
                }).catch(() => {});
            }
        },
        addOpenTime(){
            this.form.id = '';
            this.form.isExactTime = '';
            this.form.openFloor = '';
            this.form.openTime = '';
            this.form.periods = '';
             this.dialogVisible = true;
        },
        //新增编辑
        addNewHandle(ids){
            if(!this.form.isExactTime || !this.form.openFloor || !this.form.openTime){
                this.$message({
                    type: 'error',
                    message: '有必填项未填写'
                });
                return;
            }
            let body = this.form;
            let _this = this;
            body.openTime = _this.fermitTime(_this.form.openTime);
            this.$http('/backstageBuilding/editBuidingOpenTimeInfo', {body}, {}, {}, 'post').then(function (res) {
                if (res.data.code == 0) {
                     _this.$message({
                        type: 'info',
                        message: '提交成功!'
                    });
                    _this.tableData = res.data.response;
                    _this.dialogVisible = false;
                }
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
    },
    // mounted(){
    //   this.$store.dispatch('defaultIndexAction', '/subscribe/builetSeeklint');
    // }
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
