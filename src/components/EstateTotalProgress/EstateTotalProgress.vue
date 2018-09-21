<template>
    <div class="EstateTotalProgress">
        <div style="width:80%;margin:40px auto;">
            <el-steps center :active="addNum">
            <el-step v-for="(item,index) in tableData2.list" 
            :key="index"
            :title="item.scheduleName"
            :status= "item.status == 1 ? 'finish ' : 'wait' "
            :description="item.createTime?item.createTime.substring(0,7):''"></el-step>
            </el-steps>
            <span style="line-height:60px;">编辑人: {{tableData2.lastUserName}}</span><br/>
            <span style="line-height:30px;">最后编辑时间: {{tableData2.lastUpdateTime}}</span>
            <div style="text-align:center" v-if="$route.query.type == 'edit'">
                <el-button type="primary" @click="editIndoor()">编辑进度</el-button>
            </div>
        </div>
        <el-dialog
        title="楼栋进度编辑"
        :visible.sync="dialogVisible"
        width="30%"
        top="32%">
            <div class="dig-content">
                <span style="line-height:50px;">当前施工进度更新：</span>
                <el-form class="demo-ruleForm">
                    <el-form-item>
                        <el-checkbox :disabled="tableData2.isFollowBuild == 0? false : true || time.readyStats == 1 ?true : false" v-model="radio1" @change="checkChenge">{{time.readyName+'  施工日期:'}}</el-checkbox>
                        <el-date-picker
                            v-model="time.readyTime"
                            type="date"
                            :disabled="!radio1"
                            placeholder="选择日期">
                            </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox :disabled="(tableData2.isFollowBuild == 0) && radio1? false : true || time.foundationStats == 1 ?true :false" v-model="radio2" @change="checkChenge">{{time.foundationName+'  施工日期:'}}</el-checkbox>
                        <el-date-picker
                            v-model="time.foundationTime"
                            type="date"
                            :disabled="!radio2"
                            placeholder="选择日期">
                            </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox :disabled="(tableData2.isFollowBuild == 0) && radio1 && radio2? false : true || time.subjectStats == 1 ? true:false" v-model="radio3" @change="checkChenge">{{time.subjectName+'  施工日期:'}}</el-checkbox>
                        <el-date-picker
                            v-model="time.subjectTime"
                            type="date"
                            :disabled="!radio3"
                            placeholder="选择日期">
                            </el-date-picker>
                    </el-form-item>
                    <el-form-item >
                        <el-checkbox :disabled="(tableData2.isFollowBuild == 0) && radio1 && radio2 && radio3? false : true || time.decorateStats == 1?true:false" v-model="radio4" @change="checkChenge">{{time.decorateName+' 施工日期:'}}</el-checkbox>
                        <el-date-picker
                            v-model="time.decorateTime"
                            type="date"
                            :disabled="!radio4"
                            placeholder="选择日期">
                            </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox :disabled="(tableData2.isFollowBuild == 0) && radio1 && radio2 && radio3 && radio4? false : true || time.completeStats == 1?true:false" v-model="radio5">{{time.completeName+'  施工日期:'}}</el-checkbox>
                        <el-date-picker
                            v-model="time.completeTime"
                            type="date"
                            :disabled="!radio5"
                            placeholder="选择日期">
                            </el-date-picker>
                    </el-form-item>
                    <el-form-item style="text-align:center;">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="subDialog()">确 定</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:"EstateTotalProgress",
    components:{

    },
    data(){
        return{
            addNum:0,
            dialogVisible:false,
            tableData2:{
                houseInfo:"",
                list:[],
                isFollowBuild:"",
                lastUpdateTime:"",
                lastUserName:""
            },
            time:{
                readyTime:'',
                readyName:'',
                readyStats:'',
                foundationTime:'',
                foundationName:'',
                foundationStats:'',
                subjectTime:'',
                subjectName:'',
                subjectStats:'',
                decorateTime:'',
                decorateName:'',
                decorateStats:'',
                completeTime:'',
                completeName:'',
                completeStats:'',
            },
            radio0:false,
            radio1:false,
            radio2:false,
            radio3:false,
            radio4:false,
            radio5:false,
        }
    },
    created(){
        this.getProgress();
        // console.log(this.$route.query);
    },
    methods:{
        // 编辑进度
        editIndoor(){
            this.dialogVisible = true;
        },
        getProgress(){
        let body = {};
        let _this = this;
        body.buildingId = this.$route.query.buildingId;
         this.$http('/backstageBuilding/getBuildProgressInfo',{body},{},{},'post').then(res => {
          if(res.data.code == 0){
            _this.tableData2 = res.data.response;
            this.addNum = 0;
            this.tableData2.lastUpdateTime = this.fermitTime(res.data.response.lastUpdateTime);
            for(let i in res.data.response.list){
               if(i == 0){
                    this.time.readyTime = res.data.response.list[i].createTime;
                    this.time.readyName = res.data.response.list[i].scheduleName;
                    this.time.readyStats = res.data.response.list[i].status;
                    if(res.data.response.list[i].status == 1){
                        this.radio1= true;
                    }
               }else if(i == 1){
                    this.time.foundationTime = res.data.response.list[i].createTime;
                    this.time.foundationName = res.data.response.list[i].scheduleName;
                    this.time.foundationStats = res.data.response.list[i].status;
                    if(res.data.response.list[i].status == 1){
                        this.radio2= true;
                    }
               }else if(i == 2){
                    this.time.subjectTime = res.data.response.list[i].createTime;
                    this.time.subjectName = res.data.response.list[i].scheduleName;
                    this.time.subjectStats = res.data.response.list[i].status;
                    if(res.data.response.list[i].status == 1){
                        this.radio3= true;
                    }
               }else if(i == 3){
                    this.time.decorateTime = res.data.response.list[i].createTime;
                    this.time.decorateName = res.data.response.list[i].scheduleName;
                    this.time.decorateStats = res.data.response.list[i].status;
                    if(res.data.response.list[i].status == 1){
                        this.radio4= true;
                    }
               }else if(i == 4){
                    this.time.completeTime = res.data.response.list[i].createTime;
                    this.time.completeName = res.data.response.list[i].scheduleName;
                    this.time.completeStats = res.data.response.list[i].status;
                    if(res.data.response.list[i].status == 1){
                        this.radio5= true;
                    }
               }
               if(res.data.response.list[i].status ==1){
                   this.addNum += 1;
               }
            }
            
          }
        }).catch(err => {
          console.log(err)
        })
      },
       subDialog(r){
          let body = {};
          let _this = this,
          status1,status2,status3,status4,status5;
          if(this.radio1){
              status1 = 1;
          }else{
              status1 = 0;
          }
          if(this.radio2 && this.radio1){
              status2 = 1;
          }else{
              status2 = 0;
          }
          if(this.radio3 && this.radio2 && this.radio1){
              status3 = 1;
          }else{
              status3 = 0;
          }
          if(this.radio4 && this.radio3 && this.radio2 && this.radio1){
              status4 = 1;
          }else{
              status4 = 0;
          }
           if(this.radio5 && this.radio4 && this.radio3 && this.radio2 && this.radio1){
              status5 = 1;
          }else{
              status5 = 0;
          }
          let arr = [
              {
                scheduleName:this.time.readyName,
                createTime: this.fermitTime(this.time.readyTime),
                id:this.tableData2.list[0].id,
                status:status1
              },
              {
                scheduleName:this.time.foundationName,
                createTime: this.fermitTime(this.time.foundationTime),
                id:this.tableData2.list[1].id,
                status:status2
              },
              {
                scheduleName:this.time.subjectName,
                createTime: this.fermitTime(this.time.subjectTime),
                id:this.tableData2.list[2].id,
                status:status3
              },
              {
                scheduleName:this.time.decorateName,
                createTime: this.fermitTime(this.time.decorateTime),
                id:this.tableData2.list[3].id,
                status:status4
              },
              {
                scheduleName:this.time.completeName,
                createTime: this.fermitTime(this.time.completeTime),
                id:this.tableData2.list[4].id,
                status:status5
              },
          ];
          body.buildingId = this.$route.query.buildingId;
          body.editlList = arr;
          body.isFollowBuild = this.tableData2.isFollowBuild;
            
           this.$http('/backstageBuilding/editBuildProgressInfo',{body},{},{},'post').then(res => {
            if(res.data.code == 0){
                _this.$message({
                    message: '修改成功',
                    type: 'success'
                });
                 _this.dialogVisible= false;
                 _this.getProgress();
            }
            }).catch(err => {
                console.log(err);
                 _this.$message({
                    message: 'error',
                    type: 'warning'
                });
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
        checkChenge(){
            if(!this.radio1){
                this.radio2 = false;
                this.radio3 = false;
                this.radio4 = false;
                this.radio5 = false;
            }else if(!this.radio2){
                this.radio3 = false;
                this.radio4 = false;
                this.radio5 = false;
            }else if(!this.radio3){
                this.radio4 = false;
                this.radio5 = false;
            }else if(!this.radio4){
                this.radio5 = false;
            }
        }
    }
}
</script>

<style scoped>
     .dig-content{
        width:55%;
        margin:0 auto;
        height: auto;
  }
</style>

