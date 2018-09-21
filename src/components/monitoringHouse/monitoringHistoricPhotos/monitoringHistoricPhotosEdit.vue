<template>
  <div class="monitoringHistoricPhotosEdit">
    <Subnav2 :navList="navList" @refresh="refresh"></Subnav2>

    <div class="top_wap" style="padding: 20px;">
      <el-form ref="form" :model="filterForm" label-width="120px">
        <el-form-item label="楼盘ID：">
          <span class="addcolor">{{filterForm.id}}</span>
        </el-form-item>
        <el-form-item label="楼盘名称：">
          <span class="addcolor">{{filterForm.name}}</span>
        </el-form-item>
        <el-form-item label="所在地区：">
          <el-col :span="11">
            <span class="addcolor">{{filterForm.fullName}}</span>
          </el-col>
        </el-form-item>
        <el-form-item label="规划期数：">
          <span class="addcolor">{{filterForm.stageCount  }}</span>
        </el-form-item>
        <el-form-item label="楼盘名称">
          <MjbBuildingSearch :_buildingName.sync="filterForm.buildingName" :_buildingName2="filterForm.replaceGetBuildingNameList" :_buildingName3.sync="filterForm.addId"/>
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="addDisabled"
            style="margin-left:10px"
            type="primary"
            @click="editSub">提交</el-button>
          <el-button @click="closeEdit">返回</el-button>
        </el-form-item>
      </el-form>


    </div>

  </div>

</template>

<script>
  import Subnav2 from '../../Subnav2/Subnav2'
  import MjbBuildingSearch from '../../Common/MjbBuildingSearch/MjbBuildingSearch';
  export default {
    name: "monitoringHistoricPhotosEdit",
    components: {
      Subnav2,
      MjbBuildingSearch
    },
    data() {
      return {
        formLabelWidth:'120px',
        addDisabled:false,
        outerVisible: false,
        scaleX: 50,
        dialogImgSrc: '',
        navList: [
          {path: this.$route.fullPath, name: '首页'},
          {path: "/monitoring/monitoringHistoricPhotos", name: '历史照片'},
          {path: this.$route.fullPath, name: '编辑'}
        ],
        filterForm: {
          fullName:'',
          id:'',
          imgcount:'',
          mjbBuildingId:'',
          mjbBuildingName:'',
          modifyDate:'',
          name:'',
          mjbCity:'',
          stageCount: '',
          area:'', buildingName: null,
          mjbId:'',
          replaceGetBuildingNameList: '/HistoryBuilding/getNewBuildingNames',
          buidingList:[],
          addId:null
        },
      }
    },
    created(){
      this.init();
    },
    methods:{
      // 刷新
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
      init(){
          this.filterForm.id = this.$route.query.id;
          this.filterForm.fullName = this.$route.query.fullName;
          this.filterForm.imgcount = this.$route.query.imgcount;
          this.filterForm.mjbBuildingId = this.$route.query.mjbBuildingId;
          this.filterForm.mjbBuildingName = this.$route.query.mjbBuildingName;
          this.filterForm.modifyDate = this.$route.query.modifyDate;
          this.filterForm.name = this.$route.query.name;
          this.filterForm.mjbCity = this.$route.query.mjbCity;
          this.filterForm.stageCount  = this.$route.query.stageCount  ;
          this.filterForm.area = this.$route.query.area  ;
          this.filterForm.buildingName = this.$route.query.cityName;
          this.filterForm.addId = this.$route.query.cityId;
      },
      closeEdit(){
        this.$router.push({
          path: '/monitoring/monitoringHistoricPhotos',
          query: {

          }
        })
      },
      //提交
      editSub(){
        this.addDisabled = true;
        if(!this.filterForm.buildingName){
          this.filterForm.addId = 0;
        }
        let [_this , body] = [this,{}];
        body.oldId = this.filterForm.id;
        body.mjbId = this.filterForm.addId;
        this.$http('/HistoryBuilding/updateMjbBuildingId',{body},{},{},'post').then(function(res){
          if(res.data.code== 0 ){
            _this.$message({
              type: 'success',
              message: '提交成功'
            });
            _this.closeEdit();
          }else{
            _this.addDisabled = false;
          }

        }).catch(function(err){
          console.log(err);
          this.addDisabled = false;
        })
      },

    },
  }
</script>

<style scoped>

</style>
