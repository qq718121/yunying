<template>
    <div class="panoramaAdmin">
        <el-table
        :data="tableData.list"
        border
        style="width: 100%">
        <el-table-column
            prop="buildingName"
            label="楼盘名称"
            min-width="140">
            <template scope="scope">
                <MjbBuildingSearch :_buildingName.sync="scope.row.buildingName" :_buildingName2="replaceGetBuildingNameList" :_buildingName3.sync="scope.row.buildingId" />
            </template>
        </el-table-column>
        <el-table-column
            label="全景图片地址"
            min-width="180">
            <template scope="scope">
                <a :href="scope.row.vrUrl" target="_blank">{{scope.row.vrUrl}}</a>
            </template>
        </el-table-column>
        <el-table-column
            label="次序">
            <template scope="scope">
                <el-input v-model="scope.row.vrOrder" type="number" placeholder="请输入内容"></el-input>
            </template>
        </el-table-column>
        <el-table-column
            label="操作">
            <template scope="scope" >
                <el-button
                size="small"
                @click="handleEdit(scope.$index, scope.row,1)">保存</el-button>
                <el-button
                size="small"
                type="danger"
                @click="handleEdit(scope.$index, scope.row,2)">删除</el-button>
            </template>
        </el-table-column>
        </el-table>
    </div>
</template>

<script>
import MjbBuildingSearch from "../Common/MjbBuildingSearch/MjbBuildingSearch";
export default {
    name:'panoramaAdmin',
    components:{
      MjbBuildingSearch
    },
    data(){
        return{
            replaceGetBuildingNameList:'/buildingOperate/getVRBuidingInfo',
            tableData:{
                list:[
                    
                ]
            }
        }
    },
    created(){
        this.getData();
    },
    methods:{
        getData(){
            let _this = this;
            this.$http('/buildingOperate/getVRBuidingList',{},{},{},'post').then(function(res){
                if(res.data.code== 0 ){
                    _this.tableData = res.data.response;
                }
            }).catch(function(err){
                console.log(err)
            })
        },
        handleEdit(index,row,type){
            console.log(row);
            let _this = this;
            if(type ===1){
                if(!row.buildingId || !row.vrOrder){
                    this.$message({
                        type: 'info',
                        message: "有必填项未填写！"
                    });
                    return;
                }
                let body = {};
                body.id = row.id;
                body.buildingId = row.buildingId;
                body.vrOrder = row.vrOrder;

                this.$http('/buildingOperate/editVRBuidingInfo',{body},{},{},'post').then(function(res){
                    if(res.data.code== 0 ){
                        _this.$message({
                            type: 'info',
                            message: "保存成功"
                        });
                        _this.getData();
                    }
                }).catch(function(err){
                    console.log(err)
                })
            }else if(type == 2){
                if(!row.id){
                    this.$message({
                        type: 'info',
                        message: "空内容不可删除！"
                    });
                    return;
                }
                let body = {};
                body.id = row.id;
                 this.$http('/buildingOperate/delVRBuidingInfo',{body},{},{},'post').then(function(res){
                    if(res.data.code== 0 ){
                        _this.$message({
                            type: 'info',
                            message: "删除成功"
                        });
                        _this.getData();
                         
                    }
                }).catch(function(err){
                    console.log(err)
                })
            }
        },
    },
}
</script>

<style scoped>

</style>


