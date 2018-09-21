<template>
    <div class="addOperateAdminLises">
        <Subnav2 :navList="navList" ></Subnav2>
        <div class="addnew_wap postsSeek">
             <el-form :model="from" :inline="true"  class="demo-form-inline">
                <el-form-item label="ID"  :label-width="labelWidth">
                    <el-input type="text" v-model="from.newsId" style="width:120px" placeholder="ID"></el-input>
                </el-form-item>
                <el-form-item label="标题"  :label-width="labelWidth">
                    <el-input type="text" v-model="from.titile"  style="width:220px" placeholder="输入标题"></el-input>
                </el-form-item>
               
                <el-form-item  label="状态：" :label-width="labelWidth">
                    <el-select v-model="from.newsStatus" placeholder="请选择">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="在线" :value="1"></el-option>
                        <el-option label="离线" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                  <el-form-item label="时间">
                            <el-date-picker
                              size="small"
                              :clearable="true"
                              v-model="from.startTime"
                              align="right"
                              type="datetime"
                              @change="timePreChange"
                              placeholder="选择日期">
                            </el-date-picker>

                            <span class="demonstration">至</span>

                            <el-date-picker
                              size="small"
                              :clearable="true"
                              v-model="from.endTime"
                              align="right"
                              type="datetime"
                              @change="timeNextChange"
                              placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>    
             </el-form>
             <div class="inquireBtn">
                <el-button type="primary" style="margin-left:10%;" @click="queryData()">查询</el-button>
            </div>
        </div>
        
        <div style="margin:20px;">
            <el-button type="primary" style="margin:15px 0;" @click="addNewActi">添加文章</el-button>
            <div class="tabletopbar">
                <span style="margin-left:20px">查询结果：共</span>
                <span style="color:#111">{{tableData.rowCount}}</span> <span>条</span>
            </div>
            <el-table
                :data="tableData.list"
                border
                style="width: 100%">
                <el-table-column
                    prop="newsId"
                    label="ID"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="titile"
                    label="标题"
                    width="180">
                </el-table-column>
                <el-table-column
                    label="图片">
                    <template scope="scope">
                        <img style="width:100px;height:50px;margin-top:10px;" v-if="scope.row.picUrl" :src="scope.row.picUrl" />
                    </template>
                </el-table-column>
                <el-table-column
                    prop="newsAddress"
                    label="地址">
                </el-table-column>
                <el-table-column
                    prop="newsOrder"
                    label="次序">
                </el-table-column>
                <el-table-column
                    label="状态">
                    <template scope="scope">
                        <p>{{scope.row.newsStatus == 1? "在线":"离线"}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="newsUptime"
                    label="上线时间">
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template scope="scope">
                        <el-button
                        size="small"
                        @click="handleEdit(scope.$index, scope.row,1)">查看</el-button>
                        <el-button
                        size="small"
                        type="primary"
                        @click="handleEdit(scope.$index, scope.row,2)">编辑</el-button>
                         <el-button
                        size="small"
                        type="danger"
                        @click="handleEdit(scope.$index, scope.row,3)">{{scope.row.newsStatus == 0? "上线" : "下线"}}</el-button>
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
        </div>
    </div>
</template>

<script>
import Subnav2 from '../Subnav2/Subnav2';
export default {
    name:'addOperateAdminLises',
    components:{
      Subnav2
    },
    data(){
        return{
            labelWidth:"",
            currentPage:1,
            navList: [
                {path: '/activity/activitymanagement', name: '首页'},
                {path: '/activity/activitymanagement', name: '首页管理'},
                {path: '', name: this.$route.query.columnName},
            ],
            from:{
                columnId:this.$route.query.columnId,
                newsId:"",
                newsStatus:"",
                titile:"",
                startTime:"",
                endTime:"",
                pageNum:"0",
                pageSize:"10"
            },
            tableData:{
                list:[],
                rowCount:0
            }
        }
    },
    created(){
        this.getData();
    },
    methods:{
        getData(){
             let _this = this;
             let body = this.from;
            this.$http('/buildingOperate/getOperationColumnNewsList',{body},{},{},'post').then(function(res){
                console.log(res)
                if(res.data.code== 0 ){
                    _this.tableData = res.data.response;
                }
            }).catch(function(err){
                console.log(err)
            })
        },
        queryData(){
            this.getData();
        },
        currentChange(page){
            this.currentPage = page;
            this.from.pageNum = page - 1;
            this.getData();
        },
        handleEdit(index,row,type){
           if(type == 1){
               this.goDetails(row,'look');
           }else if(type == 2){
               this.goDetails(row,'edit');
           }else if(type == 3){
               let _this = this;
                this.$confirm('确定执行操作？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                     let body = {};
                    body.newsId = row.newsId;
                    if(row.newsStatus == 1){
                        body.newsStatus = 0;
                    }else if(row.newsStatus == 0){
                        body.newsStatus = 1;
                    }
                this.$http('/buildingOperate/editOperatColumnNewsStatus',{body},{},{},'post').then(function(res){
                        console.log(res)
                        if(res.data.code== 0 ){
                            _this.$message({
                                type: 'info',
                                message: "操作成功"
                            });
                            _this.getData();
                        }
                    }).catch(function(err){
                        console.log(err)
                    })
                }).catch(() => {
                    console.log("error");
                });
           }
        },
        //
        goDetails(row,types){
            this.$router.push({
                path: '/activity/addOperateAdminDetails',
                query: {
                    data:JSON.stringify(row),
                    columnName: this.$route.query.columnName,
                    columnId:this.$route.query.columnId,
                    type:types
                }
            });
        },
        addNewActi(){
            this.$router.push({
                path: '/activity/addOperateAdminDetails',
                query: {
                    columnName: this.$route.query.columnName,
                    columnId:this.$route.query.columnId,
                    type:'add'
                }
            });
        },
        //改变时间格式
        timePreChange(val){
            this.from.startTime = val? val:''
        },
        //改变时间格式
        timeNextChange(val){
            this.from.endTime = val? val:''
            console.log(val);
        },
    },
}
</script>

<style scoped>
    .addnew_wap{border: 1px solid #eee;margin:20px;padding:20px;}
       .inquireBtn{
          line-height: 50px;
          padding-top: 24px;
          padding-bottom: 24px;
          width: 100px;
          display:-webkit-box;
          display:-webkit-flex;
          display:-ms-flexbox;
          display: flex;
        }
        .postsSeek{
            display:-webkit-box;
            display:-webkit-flex;
            display:-ms-flexbox;
            display: flex;
            justify-content: space-between;
        }
</style>


