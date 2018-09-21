<template>
  <div          class    = "activitymanagment">
  <Subnav2      :navList = "navList" ></Subnav2>
  <div          class    = "addnew_wap">
  <el-form      ref      = "form" label-width         = "140px">
  <el-form-item label    = "请选择平台类型：">
  <el-select    v-model  = "platformType" placeholder = "请选择平台类型">
  <el-option    label    = "android" value            = "1"></el-option>
  <el-option    label    = "ios" value                = "2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!--<p class = "tit_wap">-->
        <!--轮播图排序-->
        <!--<i class = "el-icon-close" @click = "hide_or_show_sort(false)"></i>-->
      <!--</p>-->
      <el-table
              v-loading      = "is_loading_tab"
              ref            = "multipleTable"
            :data            = "sortTableDataComput"
              tooltip-effect = "dark"
              style          = "width: 100%;font-size:12px!important;margin-bottom:20px;text-align:center">

        <el-table-column
          label     = "标题"
          prop      = "name"
          min-width = "title">
        </el-table-column>

        <el-table-column
                                        prop      = "time"
                                        min-width = "100"
                                        label     = "平台类型">
                              <template scope     = "scope">
            <el-tag
              disable-transitions>{{ scope.row.platformType == '1' ? 'android ' : 'ios' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
                                        min-width = "100"
                                        label     = "操作">
                              <template scope     = "scope">
                              <i        @click    = "handlerSort(scope.$index, scope.row,true)" v-if = "!(scope.$index==0)" style                        = "font-size:20px;cursor:pointer" class                     = "fa fa-arrow-up"></i>
                              <i        v-show    = "platformType == 1" @click                       = "handlerSort(scope.$index, scope.row,false)" v-if = "!(tableData.androidList.length == scope.$index+1)" style = "font-size:20px;cursor:pointer" class = "fa fa-arrow-down"></i>
                              <i        v-show    = "platformType == 2" @click                       = "handlerSort(scope.$index, scope.row,false)" v-if = "!(tableData.iosList.length == scope.$index+1)" style     = "font-size:20px;cursor:pointer" class = "fa fa-arrow-down"></i>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
              v-show          = "tableData.rowCount>0"
              style           = "margin: 0 auto;text-align:center;margin-top:20px"
              layout          = "prev, pager, next,jumper"
            :page-size        = 10
            :currentPage      = "currentPage"
              @current-change = "currentChange"
            :total            = "tableData.rowCount">
      </el-pagination>
      <el-button @click = "backS">返回</el-button>
    </div>

  </div>
</template>

<script>

  import Subnav2 from '../Subnav2/Subnav2'
  import BigDialog from '../Common/BigDialog/BigDialog'
  import exportExcel from '../../common/exportExcel'
  export default {
    name      : 'activitymanagment',
    components: {
      Subnav2,
      BigDialog
    },
    data() {
      return {
        currentPage     : 1,
        is_show_add_wap : false,
        is_show_sort_wap: false,
        navList         : [
          {path: '/estate/estatemanagement', name: '首页'},
          {path: '/activity/activitymanagement', name: '活动管理'},
          {path: '', name: '轮播图排序'}
        ],
        houseNumber : 1,
        platformType: '1',
        addNewForm  : {
          show_sort   : '',
          name        : "",
          webUrl      : "",
          bannerDes   : "",
          imageUrl    : "",
          isOnline    : "",
          platformType: "",
          picType     : "",
          id          : ""
        },
        uploader  : null,
        filterForm: {
          pageNum     : 0,
          pageSize    : 10,
          id          : '',
          name        : '',
          webUrl      : '',
          bannerDes   : '',
          imageUrl    : '',
          platformType: '',
          isOnline    : '',
          picType     : ''
        },
        current_data:{
          type: '',
          data: []
        },
        tableData:{
          pageCount  : 0,
          androidList: [],
          iosList    : []
        },
        is_loading_tab   : false,
        multipleSelection: []
      };
    },
    filters:{

    },
    computed:{
      sortTableDataComput(){
        let _this = this;
        let arr   = [];
        if(this.platformType == 2){
          arr = _.cloneDeep(_this.tableData.iosList);
        }else{
          arr = _.cloneDeep(_this.tableData.androidList);
        }
        // let arr=_.cloneDeep(_this.tableData.androidList);
        arr.sort(function(a,b){
          return a.show_sort-b.show_sort
        });
        return arr;
      }
    },
    created(){
      this.getdata()
    },
    methods: {
      getdata(){
        // let _this=this;
        let [_this, body]        = [this, this.filterForm];
            _this.is_loading_tab = true;
        this.$http('/buildingCamera/orderByActivitList',{body},{},{},'post').then(function(res){
          if(res.data.code== 0 ){
            console.log(res);
            _this.tableData = res.data.response;
            // console.log(_this.tableData);
          }
          _this.is_loading_tab = false;
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

        this.multipleSelection = val;
      },
      //排序
      handlerSort(index,row,type){
        if(type){
          let [_this, body] = [this, {}];
              body.up       = 1;
              body.id       = row.id;
          this.sortOrderByActivitList(body);
        }else{
          let [_this, body] = [this, {}];
              body.down     = 1;
              body.id       = row.id;
          this.sortOrderByActivitList(body);
        }
      },
      // 排序
      sortOrderByActivitList(body){
        let _this = this;
        this.$http('/buildingCamera/orderByActivitList',{body},{},{},'post').then(function(res){
          if(res.data.code== 0 ){
            // console.log(res);
            _this.getdata();
          }
        }).catch(function(err){
          console.log(err)
        })
      },
      hide_or_show_sort(swi){
        this.is_show_add_wap = false;
        for(let i in this.addNewForm){
          this.addNewForm[i] = ''
        }
        this.is_show_sort_wap = swi;
      },
      refresh(){
        this.$store.dispatch('mainLoadingAction',true);
        this.getdata()
        this.currentPage = 1;
        for(var i in this.filterForm){
          this.filterForm[i] = ''
        }
        var that = this
        setTimeout(function(){
          that.$store.dispatch('mainLoadingAction',false);
        },300)
      },
      // 返回
      backS() {
        this.$router.push({
          path : '/activity/activitymanagement',
          query: {
            // type: this.$route.query.status,
            // activeName: this.$route.query.activeName,
            // page: this.$route.query.page * 1
          }
        })
      },
      //改变页码
      currentChange(page){
        this.currentPage        = page;
        this.filterForm.pageNum = page - 1;
        this.getdata();
      },
    },
    mounted(){

      this.$store.dispatch('mainLoadingAction',true);
      this.$store.dispatch('defaultIndexAction','/activity/activitymanagement');
      var that = this
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
  .tabletopbar{height:40px;background:#eef1f6;border-left:1px solid #dfe6ec;border-right:1px solid #dfe6ec;border-top:1px solid #dfe6ec;line-height:40px;font-size:12px;color:#555;padding:0px 15px;}
  .dia_body .el-form-item{margin-bottom: 0px!important}
  .activitymanagment .top_wap{border: 1px solid #20a0ff;margin:20px;}
  .addnew_wap{/*border: 1px solid #eee;*/margin:20px;}
  .addnew_wap .tit_wap{height: 40px;background: #20a0ff;color: white;line-height: 40px;font-size: 14px;padding: 0px 20px; }
  .addnew_wap .tit_wap i{float: right;line-height: 40px;cursor: pointer;}
</style>

<style>
  .activitymanagment .top_wap .el-input{width:160px;}
  .activitymanagment .top_wap .el-input__inner{height: 25px;}
  .activitymanagment .top_wap .el-table th>.cell{text-align: center;}
  .activitymanagment .top_wap .el-table .cell{text-align: center;}
  .activitymanagment .el-table th>.cell{text-align:center}
</style>
