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
                <!-- <MjbBuildingSearch :_cityId.sync="_cityId" :_buildingName.sync="scope.row.buildingName" :_buildingName2="replaceGetBuildingNameList" :_buildingName3.sync="scope.row.buildingId" /> -->
                <div style="display: inline-block">
                    <el-autocomplete
                        size="small"
                        v-model="scope.row.buildingName"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入关键词"
                        @select="handleSelect">
                    </el-autocomplete>
                </div>
            </template>
        </el-table-column>
        <el-table-column
            label="全景图片地址"
            min-width="180">
            <template scope="scope">
                <p style="cursor: pointer;" @click="lookPanorama(scope.row.vrUrl)">{{scope.row.vrUrl}}</p>
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
// import MjbBuildingSearch from "../Common/MjbBuildingSearch/MjbBuildingSearch";
export default {
    name:'panoramaAdmin',
    components:{
    //   MjbBuildingSearch
    },
    props:{
        _cityId:{
            default:""
        },
    },
    data(){
        return{
            replaceGetBuildingNameList:'/buildingOperate/getVRBuidingInfo',
            tableData:{
                list:[
                    
                ]
            },
            addMassage:"",
            buildingIds:""
        }
    },
    created(){
        this.getData();
        this.geyairscapeUrl2();
        this.remoteMethod("")
    },
    watch:{
        '_cityId':{
            handler:function(val){
                this.getData();
                this.remoteMethod("");
            }
        }
    },
    methods:{
        getData(){
            let _this = this;
            let body = {};
            body.cid = this._cityId;
            this.$http('/buildingOperate/getVRBuidingList',{body},{},{},'post').then(function(res){
                if(res.data.code== 0 ){
                    _this.tableData = res.data.response;
                }
            }).catch(function(err){
                console.log(err)
            })
        },
        handleEdit(index,row,type){
            let _this = this;
            if(type ===1){
                if(!row.vrOrder){
                    this.$message({
                        type: 'info',
                        message: "有必填项未填写！"
                    });
                    return;
                }
                if(!_this.buildingIds && !row.buildingId){
                        this.$message({
                            type: 'info',
                            message: "有必填项未填写！"
                        });
                        return;
                }
                let body = {};
                body.id = row.id;
                
                body.vrOrder = row.vrOrder;
                body.cid = _this._cityId;
                if(!_this.buildingIds){
                    body.buildingId = row.buildingId;
                }else{
                     body.buildingId = _this.buildingIds;
                }

                this.$http('/buildingOperate/editVRBuidingInfo',{body},{},{},'post').then(function(res){
                    if(res.data.code== 0 ){
                        _this.$message({
                            type: 'info',
                            message: "保存成功"
                        });
                        _this.buildingIds = "";
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
        lookPanorama(row){
            this.geyairscapeUrl2();
            window.open(row + '&d='+this.addMassage);
        },
        geyairscapeUrl2(){
              let [_this,body] = [this,{}]
              this.$http('/backstageUser/vrMessageDes',{body},{},{},'post').then(res =>{
		          if(res.data.code == 0){
                         _this.addMassage = res.data.response.message;
		          }
		        })
          },
          //模糊搜索
			remoteMethod(val){
				let body = {buildingName: val,cid:this._cityId};
				this.$http(this.replaceGetBuildingNameList, {body}, {}, {}, 'post').then( res => {
				  if (res.data.code == 0) {
                    this.buidingList = res.data.response;
				  }
				})
			},
			//搜索
			querySearchAsync(queryString,cb){
				let buidingList = this.buidingList;
				var results = queryString ? buidingList.filter(this.createStateFilter(queryString)) : buidingList;
				cb(results)
			},
			createStateFilter(queryString) {
				return (state) => {
				  return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
				};
			},
			handleSelect(str){
                // this.$emit('update:_buildingName3',str.key);
                this.buildingIds = str.key;
			},
    },
}
</script>

<style scoped>

</style>


    