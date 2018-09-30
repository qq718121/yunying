<template>
  <div class="activitymanagment">
    <Subnav2 :navList="navList" ></Subnav2>

    <div class="top_wap">
        <p class="addTitle">banner管理</p>
      <div class="tabletopbar">
        <span style="margin-left:20px">查询结果：共</span>
        <span style="color:#111">{{tableData.rowCount}}</span> <span>条</span>
      </div>
      <el-table
        v-loading="is_loading_tab"
        ref="multipleTable"
        :data="tableData.list"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        style="width: 100%;font-size:12px!important;margin-bottom:20px">
         <el-table-column
          type="selection"
          width="40">
        </el-table-column>
        <!--<el-table-column-->
          <!--label="排序"-->
          <!--prop=""-->
          <!--width="100">-->
          <!--<template scope="scope">-->
            <!--<el-input style="width:30px;text-align:center" v-model="scope.row.show_sort" placeholder="排序"></el-input>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column
          prop="id"
          label="ID"
          width="80">
        </el-table-column>
        <el-table-column
          label="标题"
          min-width="100">
          <template scope="scope">
            <el-input style="width: 80%" v-model="scope.row.name" placeholder="标题"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="链接"
          min-width="100">
          <template scope="scope">
            <el-input style="width: 80%" v-model="scope.row.webUrl" placeholder="链接" :disabled="scope.row.picType == 2? true : false"></el-input>
          </template>
        </el-table-column>

        <el-table-column
          min-width="60"
          label="状态">
          <template scope="scope">
            <el-tag
              disable-transitions>{{ scope.row.isOnline == '1' ? '在线' : '离线' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          label="平台类型">
        <template scope="scope">
          <el-tag
            disable-transitions>{{ scope.row.platformType == '1' ? 'android ' : 'ios' }}</el-tag>
        </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          label="操作">
          <template scope="scope">
          <span style="margin-right:10px;cursor:pointer" @click="handle(scope.$index, scope.row ,1)"> {{ scope.row.isOnline == '1'? '下线':'上线'}} </span>
          <span style="margin-right:10px;cursor:pointer" @click="handle(scope.$index, scope.row ,2)">更新</span>
          <span style="margin-right:10px;cursor:pointer" @click="handle(scope.$index, scope.row ,3)">编辑</span>
          <span style="cursor:pointer" @click="handle(scope.$index, scope.row ,4)">删除</span>
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
      <el-button type="primary" size="small" @click="hide_or_show_add(true)">添加活动轮播图</el-button>
      <el-button type="primary" size="small" @click="hide_or_show_sort(true)">轮播图排序</el-button>
      <el-button type="danger" size="small" @click="handle_some(1)">批量删除</el-button>
      <el-button type="primary" size="small" @click="handle_some(2)">批量更新</el-button>
    </div>

    <div class="addnew_wap" v-if="is_show_sort_wap">
      <p class="tit_wap">
        轮播图排序
        <i class="el-icon-close" @click="hide_or_show_sort(false)"></i>
      </p>
      <el-table
        v-loading="is_loading_tab"
        ref="multipleTable"
        :data="sortTableDataComput"
        tooltip-effect="dark"
        style="width: 100%;font-size:12px!important;margin-bottom:20px;text-align:center">

        <el-table-column
          label="标题"
          prop="name"
          min-width="title">
        </el-table-column>

        <el-table-column
          prop="time"
          min-width="100"
          label="平台类型">
          <template scope="scope">
            <el-tag
              disable-transitions>{{ scope.row.platformType == '1' ? 'android ' : 'ios' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          label="操作">
          <template scope="scope">
            <i @click="handlerSort(scope.$index, scope.row,true)" v-if="scope.row.show_sort!=1 && tableData.length!=1" style="font-size:20px;cursor:pointer" class="fa fa-arrow-up"></i>
            <i @click="handlerSort(scope.$index, scope.row,false)" v-if="scope.row.show_sort!=tableData.length && tableData.length!=1" style="font-size:20px;cursor:pointer" class="fa fa-arrow-down"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>



  </div>
</template>

<script>

import Subnav2 from '../Subnav2/Subnav2'
import BigDialog from '../Common/BigDialog/BigDialog'
import exportExcel from '../../common/exportExcel'
import panoramaAdmin from '../panoramaAdmin/panoramaAdmin'
import addOperateAdmin from '../addOperateAdmin/addOperateAdmin'
export default {
    name:'activitymanagment',
    components:{
      Subnav2,
      BigDialog,
      panoramaAdmin,
      addOperateAdmin
    },
    data() {
      return {
        currentPage: 1,
        is_show_add_wap:false,
        is_show_sort_wap:false,
        navList: [
          {path: '', name: '首页'},
          {path: '/activity/activitymanagement', name: 'banner管理'},
        ],
        addNewForm: {
          pageNum:0,
          pageSize:10,
          show_sort:'',
          name:"",
          webUrl:"",
          bannerDes:"",
          imageUrl:"",
          isOnline:"",
          platformType:"",
          picType:"",
          id:""
        },
        filterForm:{
          pageNum:0,
          pageSize:10,
          id: '',
          name:'',
          webUrl:'',
          bannerDes:'',
          imageUrl:'',
          platformType:'',
          isOnline:'',
          picType:''
        },
        current_data:{
          type:'',
          data:[]
        },
        tableData:{
          pageCount: 0,
          list: []
        },
        is_loading_tab:false,
        multipleSelection:[],
        name3:'新建轮播图',
        name2: '编辑轮播图'
      };
    },
    filters:{

    },
    computed:{
      sortTableDataComput(){
        let _this=this;
        let arr=_.cloneDeep(_this.tableData.list);
        arr.sort(function(a,b){
          return a.show_sort-b.show_sort
        });
        return arr;
      }
    },
    created(){
      if (this.$route.query.pageNum) {
        this.currentChange(this.$route.query.pageNum * 1 + 1);
      }
      this.getdata()
    },
    methods: {
      getdata(){
        // let _this=this;
        let [_this, body] = [this, this.filterForm];
        _this.is_loading_tab=true;
        this.$http('/buildingCamera/getActivitList',{body},{},{},'post').then(function(res){
          if(res.data.code== 0 ){
            _this.tableData=res.data.response;
            if(res.data.response.list.length<1 && _this.filterForm.pageNum != 0){
                _this.filterForm.pageNum - 1;
                _this.getdata();
            }
          }
          _this.is_loading_tab=false;
        }).catch(function(err){
          console.log(err)
        })
      },
      getdetaildata(){
        let _this=this;
        this.$http('/activitydetail').then(function(res){
          if(res.data.code==1000){
            _this.addNewForm=res.data.data;
          }
        }).catch(function(err){
          console.log(err)
        })
      },
      beforeAvatarUpload(){

      },
      handleAvatarSuccess(){

      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleSelectionChange(val){
        console.log(val);

        this.multipleSelection=val;
      },
      handle_some(type){
        if(this.multipleSelection.length<=0){
          this.$message({
            message: '请先勾选',
            type: 'warning'
          });
          return;
        }

        let _this=this,
            show_message_tit="",
            show_message_success="",
            show_message_error="";

        if(type==1){
          show_message_tit="确定删除吗？";
          show_message_success="删除成功!";
          show_message_error="已取消删除";
        }else{
          show_message_tit="确定更新吗？";
          show_message_success="更新成功!";
          show_message_error="已取消更新";
        }

        this.$confirm(show_message_tit, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(type == 1){
            let getId = [];
            for (let i in this.multipleSelection){
              getId.push(this.multipleSelection[i].id);
            }
            let [_this, body] = [this, this.filterForm];
            body.id = getId.slice(',').join(',');
            this.getDelActivit(body);
          }else{
            console.log("批量更新");
            let [_this, body] = [this,{}];
            body.list = this.multipleSelection;
            this.getUpdateActivitInfo(body);
            this.getdata();
          }
          _this.getdata()
          this.$message({
            type: 'success',
            message: show_message_success
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: show_message_error
          });
        });
      },
      //上下线 更新 编辑 删除
      handle(index,row,type){
            let _this=this,
            show_message_tit="",
            show_message_success="",
            show_message_error="";

        this.current_data.type=type;
        this.current_data.data=row;

        if(type==1){
          show_message_tit="确认执行当前操作？";
          show_message_success="成功!";
          show_message_error="已取消";
        }else if(type==2){
          show_message_tit="确定更新该楼盘？";
          show_message_success="更新成功!";
          show_message_error="已取消更新";
        }else if(type==3){
          this.$router.push({
            path: '/activity/activitymanagementadd',
            query: {
              name:_this.tableData.list[index].name,
              webUrl:_this.tableData.list[index].webUrl,
              isOnline:_this.tableData.list[index].isOnline,
              platformType:_this.tableData.list[index].platformType,
              id:_this.tableData.list[index].id,
              pageNum:_this.filterForm.pageNum,
              picType:_this.tableData.list[index].picType,
              imageUrl:_this.tableData.list[index].imageUrl,
              bannerDes:_this.tableData.list[index].bannerDes,
              name2:_this.name2,
              cityName:_this.tableData.list[index].cityName
            }
          });
          return;
        }else{
          show_message_tit="确定删除该楼盘？";
          show_message_success="删除成功!";
          show_message_error="已取消删除";
        }
        this.$confirm(show_message_tit, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        //   _this.getdata()
          this.$message({
            type: 'success',
            message: show_message_success
          });
          if(type == 1){
            console.log("上下线");
            let [_this, body] = [this, this.filterForm];
            body.id = _this.tableData.list[index].id;
            if(_this.tableData.list[index].isOnline == '1'){
              body.isOnline = '0';
            }else{
              body.isOnline = '1';
            }
            this.getaddActivitList(body);
            this.getdata();
          }else if(type == 4){
            console.log("删除");
            let [_this, body] = [this, this.filterForm];
            body.id = _this.tableData.list[index].id;
            this.getDelActivit(body);
            // this.getdata();
          }else if(type == 2){
            console.log("更新");
            let [_this, body] = [this,{}];
            body.list = [];
            body.list.push(_this.tableData.list[index]);
            this.getUpdateActivitInfo(body);
            // this.getdata();
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: show_message_error
          });
        });
      },
      //添加轮播图/编辑/上下线  请求接口
      getaddActivitList(body){
        let _this = this;
        this.$http('/buildingCamera/addActivit',{body},{},{},'post').then(function(res){
          if(res.data.code== 0 ){
            _this.getdata();
          }
        }).catch(function(err){
          console.log(err)
        })
      },
      //删除操作
      getDelActivit(body){
          let _this = this;
        this.$http('/buildingCamera/delActivit',{body},{},{},'post').then(function(res){
          if(res.data.code== 0 ){
            _this.getdata();
          }
        }).catch(function(err){
          console.log(err)
        })
      },
      //更新操作
      getUpdateActivitInfo(body){
          let _this = this;
        this.$http('/buildingCamera/updateActivitInfo',{body},{},{},'post').then(function(res){
          if(res.data.code== 0 ){
              _this.getdata();
          }
        }).catch(function(err){
          console.log(err)
        })
      },
      hide_or_show_add(swi){
        let _this = this;
        // this.is_show_sort_wap=false;
        // this.is_show_add_wap=swi;
        // for(let i in this.addNewForm){
        //   this.addNewForm[i]=''
        this.$router.push({
          path: '/activity/activitymanagementadd',
          query: {
            name2:_this.name3,
          }
        });
      },
      //排序
      handlerSort(index,row,type){
        if(type){
          this.tableData.list.forEach(function(item,i){
            if(row.id==item.id){
              item.show_sort-=1;
            }else if(row.show_sort-item.show_sort==1){
              item.show_sort+=1;
            }
          })
        }else{
          this.tableData.list.forEach(function(item,i){
            if(row.id==item.id){
              item.show_sort+=1;
            }else if(row.show_sort-item.show_sort==-1){
              item.show_sort-=1;
            }
          })
        }
        this.getdata()
      },
      hide_or_show_sort(swi){
        // this.is_show_add_wap=false;
        // for(let i in this.addNewForm){
        //   this.addNewForm[i]=''
        // }
        // this.is_show_sort_wap=swi;
        this.$router.push({
          path: '/activity/activitymanagementsort',
          query: {

          }
        });
      },
      refresh(){
        this.$store.dispatch('mainLoadingAction',true);
        this.getdata()
        this.currentPage=1;
        // for(var i in this.filterForm){
        //   this.filterForm[i]=''
        // }
        var that=this
        setTimeout(function(){
          that.$store.dispatch('mainLoadingAction',false);
        },300)
      },
      //改变页码
      currentChange(page){
        this.currentPage = page;
        this.filterForm.pageNum = page - 1;
        this.getdata();
      },
    },
    mounted(){

      this.$store.dispatch('mainLoadingAction',true);
      this.$store.dispatch('defaultIndexAction','/activity/activitymanagement');
      var that=this
      setTimeout(function(){
        that.$store.dispatch('mainLoadingAction',false);
      },300)
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
.tabletopbartabletopbar{height:40px;background:#eef1f6;border-left:1px solid #dfe6ec;border-right:1px solid #dfe6ec;border-top:1px solid #dfe6ec;line-height:40px;font-size:12px;color:#555;padding:0px 15px;}
.dia_body .el-form-item{margin-bottom: 0px!important}
.activitymanagment .top_wap{border: 1px solid #e9eef2;margin:20px;padding:20px;}
.addnew_wap{border: 1px solid #eee;margin:20px;}
.addnew_wap .tit_wap{height: 40px;background: #20a0ff;color: white;line-height: 40px;font-size: 14px;padding: 0px 20px; }
.addnew_wap .tit_wap i{float: right;line-height: 40px;cursor: pointer;}
.addTitle{
    line-height:40px;font-size:20px;
}
</style>

<style scoped>
  .activitymanagment .top_wap .el-input{width:160px;}
  .activitymanagment .top_wap .el-input__inner{height: 25px;}
  .activitymanagment .top_wap .el-table th>.cell{text-align: center;}
  .activitymanagment .top_wap .el-table .cell{text-align: center;}
  .activitymanagment .el-table th>.cell{text-align:center}
</style>
