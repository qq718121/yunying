<template>
  <div>
    <Subnav2 :navList="navList" @refresh="refresh"></Subnav2>
    <div style="padding:20px">
      <el-form label-width="100px" :model="form" class="demo-form-inline">
        <el-form-item label="ID：">
          <span>{{form.userId}}</span>
        </el-form-item>
        <el-form-item label="用户名：">
          <span>{{form.userPhone}}</span>
        </el-form-item>
        <el-form-item label="用户姓名：">
          <span>{{form.realName}}</span>
        </el-form-item>
        <!-- <el-form-item label="购房编号：">
          <span>{{form.houseNumber}}</span>
        </el-form-item> -->
        <el-form-item label="期数：" required >
            <el-select v-model="form.houseNumberId" placeholder="请选择期数" v-if="$route.query.type=='edit'">
                <el-option v-for="(item,index) in hList" :key="index" :label="item.houseNumber" :value="item.houseNumberId">
                </el-option>
            </el-select>
             <span v-else>{{form.houseNumberId}}</span>
        </el-form-item>
        <el-form-item label="楼栋号：" required >
            <el-select v-model="form.buildingNum" placeholder="请选择楼栋" v-if="$route.query.type=='edit'">
                <el-option label="自定义楼栋" value="0"></el-option>
                <el-option v-for="(item,index) in bList" :key="index" :label="item.buildingNum" :value="item.buildingNum">
                </el-option>
            </el-select>
             <span v-else>{{form.buildingNum}}</span>
            <el-input v-show="form.buildingNum == '0'" style="width:150px;" value="" placeholder="自定义楼栋" v-model="form.buildingNum2">
                        </el-input>
        </el-form-item>
        <el-form-item label="单元："  required>
            <el-select v-model="form.unitNum" placeholder="请选择单元" v-if="$route.query.type=='edit'">
                <el-option label="自定义单元" value="0"></el-option>
                <el-option v-for="(item,index) in uList" :key="index" :label="item.unitNum" :value="item.unitNum">
                </el-option>
            </el-select>
             <span v-else>{{form.unitNum}}</span>
            <el-input v-show="form.unitNum == '0'" style="width:150px;" value="" placeholder="自定义单元" v-model="form.unitNum2">
                        </el-input>
        </el-form-item>
        <el-form-item label="楼层："  required>
            <el-select v-model="form.floor" placeholder="请选择楼层" v-if="$route.query.type=='edit'">
                <el-option label="自定义楼层" value="0"></el-option>
                <el-option v-for="(item,index) in fList" :key="index" :label="item.floor" :value="item.floor">
                </el-option>
            </el-select>
             <span v-else>{{form.floor}}</span>
            <el-input v-show="form.floor == '0'" style="width:150px;" value="" placeholder="自定义楼层" v-model="form.floor2">
                        </el-input>
        </el-form-item>
        <el-form-item label="户号：" required >
            <el-select v-model="form.accountNum" placeholder="请选择户号" v-if="$route.query.type=='edit'">
                <el-option label="自定义户号" :value="0"></el-option>
                <el-option v-for="(item,index) in aList" :key="index" :label="item.accountNum" :value="item.accountNum">
                </el-option>
            </el-select>
             <span v-else>{{form.accountNum}}</span>
            <el-input v-show="form.accountNum == '0'" style="width:150px;" value="" placeholder="自定义户号" v-model="form.accountNum2">
                        </el-input>
        </el-form-item>
         <el-form-item label="购房凭证：" >
            <div class="cont-img">
                <ul>
                    <li v-for="(item,index) in picList" :key="index">
                        <img :src=' item.picUrl ' alt="">
                        <div class="wap">
                        <i class="el-icon-view ico" @click="viewImg( item.picUrl)"></i>
                        </div>
                    </li>
                </ul>
            </div>
         </el-form-item>
        <el-form-item label="申请时间：">
          <span>{{form.applicatTime}}</span>
        </el-form-item>
        <el-form-item label="审核人：" v-if="$route.query.type=='view'">
          <span>{{form.auditorName}}</span>
        </el-form-item>
        <el-form-item label="审核时间：" v-if="$route.query.type=='view'">
          <span>{{form.auditorTime}}</span>
        </el-form-item>
        <el-form-item v-if="$route.query.type=='edit'">
          <el-button style="margin-left: 100px" type="primary" @click="submit(2)">通过审核</el-button>
          <el-button @click="submit(3)">拒绝</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button style="margin-left: 100px" @click="back">确认</el-button>
        </el-form-item>
      </el-form>
         <el-dialog :visible.sync="outerVisible">
        <div style="overflow: hidden;margin-top: 20px;">
            <div style='position: relative'>
            <img style="width:100%" :src="dialogImgSrc" alt="">
            </div>
        </div>
        </el-dialog>
    </div>
  </div>
</template>

<script>
  import Subnav2 from '../Subnav2/Subnav2';
  import message from '../../common/message';

  export default{
    name: 'EstatePMSDetail',
    components: {
      Subnav2,
    },
    data(){
      return {
            numbers: [
            { required: true, type:'number', message: '请输入活动名称', trigger: 'blur' },
        ],
        navList: [
          {path: '/index/estatepmsexamine', name: '首页'},
          {path: '/index/estatepmsexamine', name: '服务审核'},
          {path: this.$route.fullPath, name: '用户详情'},
        ],
        tabLoading: false,
         outerVisible:false,
         dialogImgSrc:'',
        form: {
          userPhone: '',
          buildingName: '',
          houseNum:'',
          buildingNum: '',
          unitNum: '',
          floor: '',
          accountNum: '',
          houseNumberId:'',
          buildingNum2: '',
          unitNum2: '',
          floor2: '',
          accountNum2: '',
          operation: '',
        },
        aList:[],
        bList:[],
        fList:[],
        hList:[],
        uList:[],
        picList:[],
      }
    },
    created(){
      this.initData();
      this.getNameList();
      this.$store.dispatch('defaultIndexAction', '/index/estatepmsexamine');
    },
    methods: {
      //获取数据
      initData(){
        let info = JSON.parse(this.$route.query.info);
        this.form = info;
        console.log(info);
      },
      //审核
      submit(status){
        if(status == 2){
              if(this.form.houseNumberId == "" && this.form.houseNumberId !== 0){
                this.$message({
                    type: "error",
                    message: "请选择期数!"
                    });
                    return;
            }else if((this.form.buildingNum2 == "" && this.form.buildingNum == 0) || this.form.buildingNum == ""){
                this.$message({
                        type: "error",
                        message: "请选择楼栋号!"
                    });
                    return;
            }else if((this.form.unitNum2 == "" && this.form.unitNum == 0) || this.form.unitNum == ""){
                this.$message({
                        type: "error",
                        message: "请选择单元!"
                    });
                    return;
            }else if((this.form.floor2 == "" && this.form.floor == 0) || this.form.floor == ""){
                this.$message({
                        type: "error",
                        message: "请选择楼层!"
                    });
                    return
            }
             if((this.form.accountNum2 == "" && this.form.accountNum == 0 )){
                this.$message({
                        type: "error",
                        message: "请选择户号!"
                    });
                    return;
            }
            
            if(this.form.buildingNum =="" || this.form.buildingNum == '0'){
                this.form.buildingNum = this.form.buildingNum2;
            }
            if(this.form.unitNum =="" || this.form.unitNum =='0'){
                this.form.unitNum = this.form.unitNum2;
            }
            if(this.form.floor =="" || this.form.floor =='0'){
                this.form.floor = this.form.floor2;
            }
            if(this.form.accountNum =="" || this.form.accountNum == '0'){
                this.form.accountNum = this.form.accountNum2;
            }
        }

        this.$confirm('确认提交吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let body = {
            status,
            userId: this.form.userId,
            buildingName: this.form.buildingName,
            buildingId: this.form.buildingId,
            userPhone: this.form.userPhone,
            houseNumberId:this.form.houseNumberId,  
            buildingNum:this.form.buildingNum,
            unitNum:this.form.unitNum,
            floor:this.form.floor,
            accountNum:this.form.accountNum
          };
          this.$http('/buildingMonitor/auditorUserInfo', {}, {body}).then(res => {
            if (res.data.code == 0) {
              if (res.data.response.status == 1) {
                message(this, '提交成功', 'success');
                this.$router.push('/index/estatepmsexamine')
              } else if(res.data.response.status == 2){
                    message(this, '不允许添加相同的用户信息', 'warning');
              } else{
                message(this, '提交失败', 'warning');
              }
            }
          })
        }).catch(() => {
        })
      },
       viewImg(src, index){
        this.dialogImgSrc = src;
        this.outerVisible = true;
      },
      //返回
      back(){
        this.$router.push({
          path: '/index/estatepmsexamine'
        })
      },
      //刷新
      refresh(){
        this.initData()
      },
    //   获取期数
      getNameList(){
          let [_this,body] = [this,{}];
          body.buildingId = this.form.buildingId;
          body.userId = this.form.userId;
           this.$http('/buildingMonitor/getAuditorPullInfo', {}, {body}).then(res => {
            if (res.data.code == 0) {
              console.log(res);
            let datas =res.data.response;
              _this.aList =  datas.aList;
              _this.bList = datas.bList;
              _this.fList = datas.fList;
              _this.hList = datas.hList;
              _this.uList = datas.uList;
              _this.picList = datas.picList;
            }
          })
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
    .content{
    max-width: calc(100% - 50px);
    margin: 20px 0px 20px 30px;
  }
  .cont-img ul{
    width: 100%;
    font-size: 0;
  }
  .cont-img ul li {
    display: inline-block;
    list-style: none;
    width: 19%;
    height: 220px;
    margin-right: 1%;
    background-size: cover!important;
    margin-bottom: 20px;
    overflow: hidden;
    position: relative;
  }
  .cont-img ul li img{
    width:100%;
    min-height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .wap{
     z-index: 2;
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .5);
    line-height: 220px;
    display: none;
  }
  .cont-img ul li:hover .wap{
    display: block;
  }
  .wap i {
    color: #FFF;
    font-size: 22px;
    margin: 0 10px;
    cursor: pointer;
  }
</style>
