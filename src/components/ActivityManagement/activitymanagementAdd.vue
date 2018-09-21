<template>
  <div class="activitymanagment">
    <Subnav2 :navList="navList" @refresh=""></Subnav2>
    <div class="addnew_wap">
      <!--<p class="tit_wap">-->
        <!--新建轮播图-->
        <!--<i class="el-icon-close" @click="hide_or_show_add(false)"></i>-->
      <!--</p>-->

      <el-form ref="form" :model="addNewForm" label-width="120px" style="width:50%;margin-top:40px">
        <el-form-item label="标题" required>
          <el-input style="width:60%" placeholder="请输入标题" v-model="addNewForm.name"></el-input>
        </el-form-item>

        <el-form-item label="上传图片" required>
            <!--<img v-if="addNewForm.backgroundPicUrl" :src="addNewForm.backgroundPicUrl" class="avatar">-->
            <!--<el-button v-else size="small" type="primary" @imgUploader="imgUploader">点击上传</el-button>-->
            <ImgUploader
              :backgroundPicUrl="addNewForm.imageUrl"
              :dialogVisible="dialogVisible"
              @previewImg="previewImg"
              @deleteImg="deleteImg"
              @imgUploader="imgUploader"
              @dialogClose="dialogClose"
            />
            <p slot="tip" style="color:red;padding-left:10px" class="el-upload__tip">注：图片支持jpg及bmp格式，上传图片尺寸建议为750*360，图片大小2m内</p>
        </el-form-item>

        <el-form-item label="备注">
          <el-input :maxlength="50" placeholder="请输入输入0-50个字" type="textarea" v-model="addNewForm.bannerDes"></el-input>
        </el-form-item>

        <!--<el-form-item label="排序">-->
          <!--<el-input type="number" style="width:120px" v-model="addNewForm.show_sort"></el-input>-->
        <!--</el-form-item>-->

        <el-form-item label="平台类型" required>
          <el-radio-group v-model="addNewForm.platformType">
            <el-radio label="1">android</el-radio>
            <el-radio label="2">ios</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="活动上下线" required>
          <el-radio-group v-model="addNewForm.isOnline">
            <el-radio label="1">上线</el-radio>
            <el-radio label="0">下线</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="轮播图类型" required>
          <el-radio-group v-model="addNewForm.picType">
            <el-radio label="1">跳转web</el-radio>
            <el-radio label="2">楼盘概况</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="链接地址" required v-if="addNewForm.picType == 1">
          <el-input style="width:60%" placeholder="请输入链接"  v-model="addNewForm.webUrl">
            <template slot="prepend">Http://</template>
          </el-input>
        </el-form-item>

        <el-form-item label="楼盘名称" v-if="addNewForm.picType == 2" required>
          <MjbBuildingSearch :_buildingName.sync="addNewForm.buildingName"
                             :_buildingName2="addNewForm.replaceGetBuildingNameList"
                             :_buildingName3.sync="addNewForm.key"
          />
        </el-form-item>

        <p style="margin:20px 30px;">注：*字段为编辑操作时必填字段</p>
        <el-form-item>
          <el-button style="margin-left:120px" type="primary" @click="add_new">提交</el-button>
          <el-button @click="backS">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Subnav2 from '../Subnav2/Subnav2'
  import VueQuillEditor from 'vue-quill-editor'
  import uploader from '../../common/uploader.js'
  import BigDialog from '../Common/BigDialog/BigDialog'
  import MjbBuildingSearch from '../Common/MjbBuildingSearch/MjbBuildingSearch';
  import exportExcel from '../../common/exportExcel'

  import ImgUploader from '../Common/ImgUploader/ImgUploader'

      Vue.use(VueQuillEditor);
  export default {
    name:'activitymanagment',
    components:{
      Subnav2,
      BigDialog,
      ImgUploader,
      MjbBuildingSearch
    },
    data() {
      return {
        currentPage: 1,
        is_show_add_wap:false,
        is_show_sort_wap:false,
        navList: [
          {path: '/estate/estatemanagement', name: '首页'},
          {path: '/activity/activitymanagement', name: '活动管理'},
          {path: '', name: this.$route.query.name2}
        ],
        dialogVisible: false,
        addNewForm: {
          show_sort:'',
          name:"",
          webUrl:"",
          bannerDes:"",
          imageUrl:"",
          isOnline:"",
          platformType:"",
          id:"",
          backgroundPicUrl: '',
          picType:'',
          buildingName: null,
          mjbId:'',
          replaceGetBuildingNameList: '/HistoryBuilding/getNewBuildingNames',
          buidingList:[],
          key:null,
          cityName:''
        },
        preImgSrc: '',
        ialogVisible: false,
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
          backgroundPicUrl: '',
          picType:'',
          buildingName: null,
          mjbId:'',
          replaceGetBuildingNameList: '/HistoryBuilding/getNewBuildingNames',
          buidingList:[],
          key:null
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
        multipleSelection:[]
      };
    },
    filters:{

    },
    // computed:{
    //   sortTableDataComput(){
    //     let _this=this;
    //     let arr=_.cloneDeep(_this.tableData);
    //     console.log(arr);
    //     arr.sort(function(a,b){
    //       return a.show_sort-b.show_sort
    //     })
    //     return arr;
    //   }
    // },
    created(){
      // this.getdata();
      this.init();
      console.log(this.addNewForm);
    },
    methods: {
      init(){
        this.addNewForm.name = this.$route.query.name;
        this.addNewForm.webUrl= this.$route.query.webUrl;
        this.addNewForm.isOnline= (this.$route.query.isOnline).toString();
        this.addNewForm.platformType= (this.$route.query.platformType).toString();
        this.addNewForm.id= this.$route.query.id;
        this.addNewForm.pageNum = this.$route.query.pageNum;
        this.addNewForm.picType = (this.$route.query.picType).toString();
        this.addNewForm.imageUrl = this.$route.query.imageUrl;
        this.addNewForm.bannerDes = this.$route.query.bannerDes;
        this.addNewForm.buildingName = this.$route.query.cityName;
        console.log(this.$route.query.cityName);
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
      add_new(){
        // let _this=this;

        if(!this.addNewForm.name){
          this.$message({
            type: 'warning',
            message: '请添加标题'
          });
          return;
        }else  if(!this.addNewForm.imageUrl){
          this.$message({
            type: 'warning',
            message: '请选择照片'
          });
          return;
        }else if(this.addNewForm.platformType==''){
          this.$message({
            type: 'warning',
            message: '请选择平台类型'
          });
          return;
        }else if(this.addNewForm.isOnline==''){
          this.$message({
            type: 'warning',
            message: '请选择上下线'
          });
          return;
        }else if(this.addNewForm.picType==''){
          this.$message({
            type: 'warning',
            message: '请选择轮播图类型'
          });
          return;
        }

        if(this.addNewForm.picType == 1){
          if(!this.addNewForm.webUrl) {
            this.$message({
              type: 'warning',
              message: '请添加链接'
            });
            return;
          }
        }else if(this.addNewForm.picType == 2){
          if(!this.addNewForm.key) {
            this.$message({
              type: 'warning',
              message: '请选择楼盘'
            });
            return;
          }
        }

        this.$confirm('确认提交吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let [_this, body] = [this,this.addNewForm];
          body.imageUrl = this.addNewForm.backgroundPicUrl;
          console.log(body)
          console.log(_this.addNewForm);
          this.getaddActivitList(body);
          _this.$message({
            type: 'success',
            message: '更新成功'
          });
          // _this.getdata();
          this.$router.push({
            path:"/activity/activitymanagement",
            query: {
              pageNum: this.$route.query.pageNum * 1
            }
          })
          _this.is_show_add_wap=false;
          for(let i in _this.addNewForm){
            _this.addNewForm[i]=''
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });

      },
      handleSelectionChange(val){
        console.log(val);

        this.multipleSelection=val;
      },
      //添加轮播图/编辑/上下线  请求接口
      getaddActivitList(body){
        console.log(body)
        this.$http('/buildingCamera/addActivit',{body},{},{},'post').then(function(res){
          console.log(res)
          if(res.data.code== 0 ){
            console.log(res);
          }
        }).catch(function(err){
          console.log(err)
        })
      },
      //开始上传
      imgUploader(){
     //    console.log(this.uploader);
        this.uploader.start();
      },
      //预览图片
      previewImg(){
        this.dialogVisible = true;
      },
      //删除图片
      deleteImg(){
        this.addNewForm.imageUrl = ''
        this.addNewForm.backgroundPicUrl = ''
      },
      //关闭模态框
      dialogClose(){
        this.dialogVisible = false;
        return;
      },
      // 返回
      backS() {
        this.$router.push({
          path: '/activity/activitymanagement',
          query: {
            pageNum: this.$route.query.pageNum * 1
          }
        })
      },
      hide_or_show_add(swi){
        this.is_show_sort_wap=false;
        this.is_show_add_wap=swi;
        for(let i in this.addNewForm){
          this.addNewForm[i]=''
        }
      },
      refresh(){
        this.$store.dispatch('mainLoadingAction',true);
        this.getdata()
        this.currentPage=1;
        for(var i in this.filterForm){
          this.filterForm[i]=''
        }
        var that=this
        setTimeout(function(){
          that.$store.dispatch('mainLoadingAction',false);
        },300)
      },
    },
    mounted(){

      this.$store.dispatch('mainLoadingAction',true);
      this.$store.dispatch('defaultIndexAction','/activity/activitymanagement');
      var that=this
      setTimeout(function(){
        that.$store.dispatch('mainLoadingAction',false);
      },300)

      // this.$store.dispatch('defaultIndexAction', '/article/articlemanagement');
      let _this = this;

      uploader(function (src) {
        console.log(src);
        _this.preImgSrc = src;
      }, function (key) {
        console.log(key);
        _this.addNewForm.backgroundPicUrl = key;
        _this.addNewForm.imageUrl = 'http://oxrgdeqd8.bkt.clouddn.com/'+ key;
      }, function () {
        _this.preImgSrc = '';
      }, function (uploader) {
        _this.uploader = uploader
      })

      // uploader(function (src) {
      //   console.log(src);
      //   _this.preImgSrc = src;
      // }, function (key) {
      //
      //   let qeObj = _this.$refs['myQuillEditor'].quill.getSelection(),
      //     length = qeObj.index,
      //     imgUrl = 'http://oxrgdeqd8.bkt.clouddn.com/' + key;
      //   _this.$refs['myQuillEditor'].quill.insertEmbed(length, 'image', imgUrl)
      // }, function () {
      //
      // }, function (uploader) {
      //   _this.qeUploader = uploader
      // }, 'upbtn2')

      // this.$refs['myQuillEditor'].quill.getModule('toolbar').addHandler('image', this.imgHandler)
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
  .addnew_wap{border: 1px solid #eee;margin:20px;}
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
