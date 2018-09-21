<template>
  <div class="acqmana">
    <Subnav2 :navList="navList" @refresh="refresh"></Subnav2>

    <el-row style="padding:20px">
      <h6 style="margin-left:20px;margin:10px 0px 10px 20px;font-size: 12px;">当前楼盘名称：{{data.buildingName}}</h6>
      <p class="tit-lab">
        基础信息
      </p>
      <el-form style="padding-left:40px" label-width="150px">


        <el-form-item prop="user" label="所在地区：">
          {{data.locatArea}}
        </el-form-item>
        <el-form-item prop="user" label="详细地址：">
          {{data.buildingAddr}}
        </el-form-item>
        <el-form-item prop="user" label="楼幢数量：">
          {{data.buildingCount}}幢
        </el-form-item>
        <el-form-item prop="user" label="物业类型：">
          {{data.propertyType}}
        </el-form-item>
        <el-form-item prop="user" label="是否严选：">
          <span v-if="data.filterFlg === 1">是</span>
          <span v-if="data.filterFlg === 0">否</span>
        </el-form-item>
        <el-form-item prop="user" label="APP上是否上线：">
          <span v-if="data.buildingStatus === 1">是</span>
          <span v-if="data.buildingStatus === 0">否</span>
        </el-form-item>
        <el-form-item prop="user" label="踩盘楼盘：">
          <span v-if="data.isFollowBuilding === 1">开启</span>
          <span v-if="data.isFollowBuilding === 0">关闭</span>
        </el-form-item>
         <el-form-item label="选择分配角色：">
            <el-select v-model="form.roleId" placeholder="请选择" @change="getRouList">
                <el-option
                v-for="item in perData2"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId">
                </el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <el-row>
        <p class="tit-lab" v-if = "$route.query.type == 'edit'">
          编辑操作
        </p>
        <el-form style="padding-left:40px;" :model="form" label-width="150px">
          <el-form-item prop="user" label="指派采集人：" v-if = "$route.query.type == 'edit'">
            <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group type="small" v-model="form.collector"  @change="handleCheckAllChange2">
              <el-checkbox :label="item.key" v-for="(item,index) in perData" :key="index">{{item.value}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item style="margin-left: 150px;margin-top: 40px">
            <el-button  type="primary" v-if = "$route.query.type == 'edit'"  @click="submit('ruleInline')">确定</el-button>
            <el-button   @click="back">关闭</el-button>
          </el-form-item>
        </el-form>
      </el-row>

    </el-row>
  </div>
</template>
<script>
import Subnav2 from '../Subnav2/Subnav2'
import message from '../../common/message'
export default {
  name: 'acqmana',
  components:{
    Subnav2
  },
  data () {
    return {
      navList:[
        {path:'/task/collectionmanagement',name:'首页'},
        {path:'/task/collectionmanagement',name:'监控楼盘采集'},
        {path:this.$route.fullPath,name:'详情'}
      ],
      form:{
        buildingId:'',
        collector:[],
        roleId:""
      },
      perData:[],
      perData2:[],
      data:{

      },
      checkAll:""
    }
  },
  created(){
    this.$store.dispatch('defaultIndexAction','/task/collectionmanagement');
    this.getPerDataList();
    this.initData();
  },
  methods: {
    //初始化
    initData(){
      let info = JSON.parse(this.$route.query.info);
      this.data = info;
      if(info.collectorId){
        this.form.collector = info.collectorId.split(',');
      }
      this.form.buildingId = info.buildingId;

    },
    //获取指派人员
    getPerData(rId){
      let _this = this;
     let body = {roleId:rId};
      this.$http('/taskManage/getBackUserList',{body},{},{},'post').then(function(res){
        if(res.data.code == 0){
          _this.perData = res.data.response.collectorList;
          
        }else{
          message(_this,res.data.message,'warning')
        }
        // _this.handleCheckAllChange2();
      }).catch(function(err){
        console.log(err)

      })
    },
 getPerDataList(){
      let _this = this;
     let body= {roleType:"1"};
      this.$http('/taskManage/getBackstageRoleInfo',{body},{},{},'post').then(function(res){
        if(res.data.code == 0){
          _this.perData2 = res.data.response.list;
          _this.form.roleId = res.data.response.list[0].roleId;
        }
      })
    },
    getRouList(){
        this.getPerData(this.form.roleId);
    },
    refresh(){

    },
    //提交
    submit(){
      let _this = this,
      body = _.cloneDeep(this.form);
      body.collector = body.collector.join(',');
      this.$http('/taskManage/editCollection',{body},{},{},'post').then((res) => {
        if(res.data.code == '0'){
          if(res.data.response.status == 1){
            message(_this,'提交成功','success');
            _this.$router.push({
                path:'/task/collectionmanagement',
                query:{
                    data:JSON.stringify(this.$route.query.data)
                }
            })
          }else{
            message(_this,'提交失败','warning');
          }
        }else if(res.data.code == '300'){
          _this.$router.push('/login');
        }else{
          message(_this,'提交失败','warning');
        }
      }).catch(err => {
        console.log(err)
      })
    },
     // 全选
    handleCheckAllChange(){
        if(this.checkAll){
            this.perData.forEach((item,index) => {
                this.form.collector.push(this.perData[index].key);
            });
        }else{
            this.form.collector = [];
        }
    },
    handleCheckAllChange2(){
        // if(this.form.collector.length == this.perData.length){
        //     this.checkAll = true;
        // }else{
        //     this.checkAll = false;
        // }
    },
    //返回
    back(){
      this.$router.push({
            path:'/task/collectionmanagement',
            query:{
                data:JSON.stringify(this.$route.query.data)
            }
          })
    }
  },
}
</script>

<style scoped>
  .tit-lab{
    height: 30px;
    line-height: 30px;
    background: #eee;
    padding-left: 22px;
    margin: 20px 0px;
    font-size: 13px;
  }
  .ivu-form-item{
    margin-bottom: 0px
  }
  .el-form-item{margin-bottom: 5px}
</style>
