<template>
    <div class="addOperateAdmin">
        <el-row>
            <el-col :span="4"
            v-for="(item,index) in tabData.list" :key="index"
              style="cursor: pointer">
                <el-card :body-style="{ padding: '0px' }" class="report-card">
                    <div >
                    <p @click="getOperationColumnList(item)">{{item.columnName}}</p>
                    </div>
                    <div class="el-bj">
                        <span style="color:#3399FF" @click="operate(item,index)">编辑</span>
                        <span style="font-size:60px;color:#D7D7D7;text-align:right;">{{item.columnOrder}}</span>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="4"
              style="cursor: pointer">
                <el-card :body-style="{ padding: '0px' }" class="report-card">
                    <div @click="addNewLm">
                        <p style="font-size:30px;line-height:40px;">+</p>
                        <p>增加新栏目</p>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog
            title="添加栏目"
            :visible.sync="dialogVisible"
            width="30%">
            <el-form :model="ruleForm">
                <el-form-item label="栏目名称："  :label-width="labelWidth" required>
                    <el-input type="text" v-model="ruleForm.columnName" style="width:300px"></el-input>
                </el-form-item>
                <el-form-item label="次序："  :label-width="labelWidth" required>
                    <el-input type="number" v-model="ruleForm.columnOrder"  style="width:300px"></el-input>
                </el-form-item>
                <el-form-item  label="状态：" :label-width="labelWidth" required>
                    <el-select v-model="ruleForm.columnStatus" placeholder="请选择">
                        <el-option label="在线" :value="1"></el-option>
                        <el-option label="离线" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                 
             </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancleEdit()">取 消</el-button>
                <el-button type="primary" @click="editOperationColumn">确 定</el-button>
            </span>
            </el-dialog>
    </div>
</template>

<script>

export default {
    name:'addOperateAdmin',
    components:{
      
    },
    props:{
        _cityId:{
            default:""
        },
    },
    data(){
        return{
            dialogVisible:false,
            labelWidth:'120px',
            tabData:{
                list:[
                    
                ]
            },
            ruleForm:{
                columnName:'',
                columnStatus:'',
                columnOrder:'',
                cid:""
            }
        }
    },
    created(){
        this.getData();
    },
     watch:{
        '_cityId':{
            handler:function(val){
                this.ruleForm.cid = val;
                this.getData();
            }
        }
    },
    methods:{
        getData(){
            let _this = this;
            let body = {};
            body.cid = this._cityId;
            this.$http('/buildingOperate/getOperationColumnList',{body},{},{},'post').then(function(res){
                if(res.data.code== 0 ){
                    _this.tabData = res.data.response;
                }
            }).catch(function(err){
                console.log(err)
            })
        },
        // 编辑
        operate(item,index){
            this.ruleForm.columnName = item.columnName;
            this.ruleForm.columnStatus = item.columnStatus;
            this.ruleForm.columnOrder = item.columnOrder;
            this.ruleForm.id = item.id;
            this.dialogVisible = true;
        },
                // 新建
        addNewLm(){
            this.dialogVisible = true;
            this.ruleForm.id = "";
        },
        editOperationColumn(){
            if(!this.ruleForm.columnName || (this.ruleForm.columnStatus == "" && this.ruleForm.columnStatus != 0) || !this.ruleForm.columnOrder){
                this.$message({
                    type: 'info',
                    message: "有必填项未填写！"
                });
                return;
            }
            let body = this.ruleForm,
            _this = this;
            this.$http('/buildingOperate/editOperationColumn',{body},{},{},'post').then(function(res){
                if(res.data.code== 0 ){
                    _this.dialogVisible = false;
                    _this.$message({
                        type: 'success',
                        message: "添加成功！"
                    });
                    _this.getData();
                    _this.ruleForm.columnName = "";
                    _this.ruleForm.columnStatus = "";
                    _this.ruleForm.columnOrder = "";
                    
                }
            }).catch(function(err){
                console.log(err)
            })
        },
        // 进入栏目列表
        getOperationColumnList(item){
            this.$router.push({
            path: '/activity/addoperateadminlists',
            query: {
                columnId:item.id,
                columnName:item.columnName
            }
          });
        },
        cancleEdit(){
            this.dialogVisible = false
            this.ruleForm.columnName = "";
            this.ruleForm.columnStatus = "";
            this.ruleForm.columnOrder = "";
        },
    },
}
</script>

<style scoped>
     .report-card{
    padding: 14px;
    width: 120px;
    height:120px;
    background:#E4E4E4;
    margin-bottom: 30px;
  }
  .report-card p{
    color: #777;
    font-size: 14px;
    text-align: center;
  }
  .report-card p:nth-child(1){
    margin:20px 0px;
    font-size: 16px;
    color: #333;
    font-weight: bold;
  }
  .el-bj{
      width: 100%;
      height: 100%;
      padding: 0px;
  }
  .el-bj span{
      display: inline-block;
      width: calc(50% - 14px);
      text-align: center;
  }
</style>


