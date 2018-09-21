<template>
	<div>
		<Subnav2 :navList="navList" @refresh="refresh"></Subnav2>
        <div style="padding:20px">
            <el-row style="padding:20px 10px 0px 10px;border:1px solid #eee;">
                <el-col :span="22">
                <el-form :inline="true" style="" :model="filterForm" class="demo-form-inline" @keyup.native.enter="onSearchSubmit">

                    <el-form-item label="楼盘id">
                    <el-input size="small" v-model="filterForm.id" style="width:80px" placeholder="id"></el-input>
                    </el-form-item>

                    <el-form-item label="区域">
                    <MjbArea
                        :isShowArea="true"
                        :_province.sync="filterForm.pid"
                        :_city.sync="filterForm.cid"
                        :_area.sync="filterForm.areaId"/>
                    </el-form-item>

                    <el-form-item label="楼盘名称">
                    <MjbBuildingSearch :_buildingName.sync="filterForm.buildingName"/>
                    </el-form-item>
                </el-form>
                </el-col>
                <el-col :span="2" style="text-align:right">
                <el-button type="primary" @click="onSearchSubmit">查询</el-button>
                </el-col>
            </el-row>
        </div>
		<div style="padding:20px;">
			<div class="tabletopbar">
		        <span>查询结果：共</span>
		        <span style="color:#111">{{tableData.totalCount}}</span> <span>条</span>
		    </div>
		    <el-table
		        v-loading="tabLoading"
		        :data="tableData.buildingMonitorInfo"
		        border
		        tooltip-effect="dark"
		        style="width: 100%;font-size:12px!important;">
		        <el-table-column
		          prop="buildingId"
		          label="楼盘id"
		          min-width="60">
		        </el-table-column>
		        <el-table-column
		          prop="buildingName"
		          label="楼盘名称"
		          min-width="100">
		        </el-table-column>
                <el-table-column
		          prop="area"
		          label="区域"
		          min-width="100">
		        </el-table-column>
		        <el-table-column
		          prop="startServiceTime"
		          min-width="80"
		          label="提供服务时间">
		        </el-table-column>
		        <el-table-column
		          prop="endServiceTime"
		          min-width="80"
		          label="终止服务时间">
		        </el-table-column>
            <el-table-column
              label="状态"
              min-width="60">
              <template scope="scope">
                <el-tag
                  disable-transitions>{{ scope.row.monitorStatus == '1' ? '在线' : '离线' }}</el-tag>
              </template>
            </el-table-column>
		        <el-table-column
		          min-width="150"
		          label="操作">
		          <template scope="scope">
                <el-button
                  size="small"
                  @click="handle(scope.row,0)">
                  {{ scope.row.monitorStatus == '1' ? '下线' : '上线' }}
                </el-button>
		            <el-button
		              size="small"
		              @click="handle(scope.row,1)">
		              查看
		            </el-button>
		            <el-button
		              size="small"
		              @click="handle(scope.row,2)">
		              编辑
		            </el-button>
		            <el-button
		              size="small"
		              @click="handle(scope.row,3)">
		              查看服务
		            </el-button>
		          </template>
		        </el-table-column>
		    </el-table>
			<el-pagination
				v-show="tableData.totalCount>0"
				style="margin: 0 auto;text-align:center;margin-top:20px"
				layout="prev, pager, next,jumper"
				:page-size="10"
				:currentPage="currentPage"
				@current-change="currentChange"
				:total="tableData.totalCount">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import Subnav2 from '../Subnav2/Subnav2'
    import message from '../../common/message'
    import MjbArea from '../Common/MjbArea/MjbArea';
    import MjbBuildingSearch from '../Common/MjbBuildingSearch/MjbBuildingSearch';
	export default{
		name:'EstateProcessMonitoringManagement',
		components:{
            Subnav2,
            MjbArea,
            MjbBuildingSearch
		},
		data(){
			return{
				navList:[
					{path:'/index/estateprocessmonitoringmanagement',name:'首页'},
					{path:'/index/estateprocessmonitoringmanagement',name:'全流程监控楼盘列表'},
				],
				tabLoading:false,
				currentPage:1,
        		filterForm:{
					pageNum:0,
                    pageSize:10,
                    id: '',
                    pid: '',
                    cid: '',
                    areaId: '',
                    name: '',
                    buildingName:''
                },
                loadClick:false,
        		tableData:{
					buildingMonitorInfo:[],
					totalCount:0
        		}
			}
		},
		created(){
			this.getData();
      		this.$store.dispatch('defaultIndexAction','/index/estateprocessmonitoringmanagement');
		},
		methods:{
			//获取数据
		    getData(){
		        let _this = this,
		        body = _.cloneDeep(this.filterForm)
		        _this.tabLoading = true;
		        this.$http('/buildingMonitor/getBuildingMonitorList',{},{body}).then(res => {
		          if(res.data.code == 0){
		            _this.tableData = res.data.response;
		          }
		          _this.tabLoading = false;
		        }).catch(err => {
		          console.log(err)
		          _this.tabLoading = false;
		        })
		    },
			//页码改变
		    currentChange(page){
		    	this.filterForm.pageNum = page-1;
		    	this.getData();
		    },
		    //操作
	handle(row,type){
        if(type == 0){
          this.$confirm('确定上线／下线该楼盘？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.tabLoading = true;
            let [_this , body] = [this , {}];
            body.buildingId = row.buildingId;
            if(row.monitorStatus == '1'){
              body.monitorStatus = '0';
            }else{
              body.monitorStatus = '1';
            }
            this.$http('/buildingMonitor/editBuildMonitorStatus',{body},{},{},'post').then(function(res){
              if(res.data.code == 0){
                _this.$message({
                  type: 'success',
                  message: '成功'
                });
                _this.tabLoading = false;
                _this.getData();
              }
            }).catch(function(err){
              console.log(err)
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消成功'
            });
            _this.tabLoading = false;
          });
        }else if(type == 1){
					this.$router.push({
						path:'/index/estateprocessmonitoringdetail',
						query:{
							type:'view',
							buildingId:row.buildingId,
							buildingName:row.buildingName,
						}
					})
				}else if(type == 2){
					this.$router.push({
						path:'/index/estateprocessmonitoringdetail',
						query:{
							type:'edit',
							buildingId:row.buildingId,
							buildingName:row.buildingName,
						}
					})
				}else{
					this.$router.push({
						path:'/index/estateprocessmonitoringservice',
						query:{
							buildingId:row.buildingId
						}
					})
				}
		    },
		    //刷新
			refresh(){
				this.filterForm.pageNum = 0;
				this.getData()
            },
             //触发搜索
            onSearchSubmit(){
                this.filterForm.pageNum = 0;
                if (this.currentPage != 1) {
                this.currentPage = 1;
                } else {
                this.getData();
                }
            },
		}
	}
</script>

<style scoped>
	.tabletopbar{
		height:40px;
		background:#eef1f6;
		border-left:1px solid #dfe6ec;
		border-right:1px solid #dfe6ec;
		border-top:1px solid #dfe6ec;
		line-height:40px;
		font-size:12px;
		color:#555;
		padding:0px 15px;
	}
</style>
