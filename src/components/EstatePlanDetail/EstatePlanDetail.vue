<template>
	<div>
		<div>
			<el-row v-if="type == 'edit'" style="padding:20px;border:1px solid #ccc;margin-top:10px" v-loading="scloading">
				<el-form ref="form" :inline="true" :model="form">
					<el-form-item>
                         <!-- @click="choiceFile(2)" -->
                        <span @click="choiceFile(2)">导入数据</span>
						<input
							ref="fileInput"
							type="file"
							accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
							style="display:none"
							@change="getFile($event)">
						<span style="font-size:12px;" v-show="fileObj.isHaveExcel==1">文件名称：</span>
						<span style="font-size:12px;color:#1d90e6" v-show="fileObj.isHaveExcel==1">{{fileObj.excelName}}/{{fileObj.fileSize}}MB</span>
						<el-button size="small" @click="choiceFile(1)">{{fileObj.isHaveExcel==0?"选择文件":"重新上传文件"}}</el-button>
						<el-button size="small" @click="deleteFile" v-show="fileObj.isHaveExcel==1">删除规划数据</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row style="padding:20px;border:1px solid #ccc;margin-top:20px" v-show="fileObj.isHaveExcel==1">
				<el-col :span="20">
					<BuildingLinkage5
					:_houseNumber.sync="form.houseNumberId"
					:_buildingId="form.buildingId"
					:_buildingNum.sync="form.buildingNum"
					:_unitNum.sync="form.unitNum"
					:_floor.sync="form.floor"
					:_accountNum.sync="form.accountNum"
					:_houseType.sync="form.houseType"
					:_reload = "reload"
					/>
				</el-col>
				<el-col :span="4">  
					<el-button style="float:right" type="primary" @click="onSearchSubmit">查询</el-button>
				</el-col>
			</el-row>
			<el-row v-show="fileObj.isHaveExcel==1">
				<div class="tabletopbar">
					<span>查询结果：共</span>
					<span style="color:#111">{{tableData.BuildCount}}</span> <span>条</span>
				</div>
				<el-table
					ref="multipleTable"
					v-loading="tabLoading"
					:data="tableData.BuildPlanningInfo"
					border
					class="plan-table"
					tooltip-effect="dark"
                    @selection-change="handleSelectionChange"
					style="width: 100%;font-size:12px!important;">
                    <el-table-column label="采集到户信息">
                        <el-table-column
                        v-if="type == 'edit'"
                        type="selection"
                        width="70">
                        </el-table-column>
                        <el-table-column
                        prop="houseNumber"
                        label="期数"
                        min-width="80">
                        <template scope="scope">
                            <!-- <el-input v-if="type=='edit'" @change="cellChange(scope.row,scope.$index)" v-model="scope.row.houseNumber"></el-input> -->
                            <el-select :clearable="true"  v-if="type=='edit'" @change="cellChange(scope.row,scope.$index)" v-model="scope.row.houseNumberId" placeholder="请选择">
                                <el-option v-for="item in houseNumberList" :key="item.houseNumber" :label="item.houseNumber" :value="item.houseNumberId">
                                </el-option>
                            </el-select>
                            <span v-else>{{scope.row.houseNumber}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column
                        prop="buildingNum"
                        label="地块+楼栋号"
                        min-width="80">
                        <template scope="scope">
                            <el-input v-if="type=='edit'" @change="cellChange(scope.row,scope.$index)" v-model="scope.row.buildingNum"></el-input>
                            <span v-else>{{scope.row.buildingNum}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column
                        prop="unitNum"
                        label="单元"
                        min-width="80">
                        <template scope="scope">
                            <el-input v-if="type=='edit'" @change="cellChange(scope.row,scope.$index)" v-model="scope.row.unitNum"></el-input>
                            <span v-else>{{scope.row.unitNum}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column
                        prop="floor"
                        min-width="80"
                        label="楼层">
                        <template scope="scope">
                            <el-input v-if="type=='edit'" @change="cellChange(scope.row,scope.$index)" v-model="scope.row.floor"></el-input>
                            <span v-else>{{scope.row.floor}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column
                        prop="accountNum"
                        min-width="80"
                        label="户号">
                        <template scope="scope">
                            <el-input v-if="type=='edit'" @change="cellChange(scope.row,scope.$index)" v-model="scope.row.accountNum"></el-input>
                            <span v-else>{{scope.row.accountNum}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column
                        prop="houseType"
                        min-width="80"
                        label="户型">
                        <template scope="scope">
                            <el-select
                            v-if="type=='edit'"
                            size="small"
                            @change="cellChange(scope.row,scope.$index)"
                            v-model="scope.row.houseType" >
                            <el-option v-for="item in houseTypeArray" :key="item.name" :label="item.name" :value="item.name"></el-option>
                            </el-select>
                            <span v-else>{{scope.row.houseType}}</span>
                        </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="用户申请到户信息">
                        <el-table-column
                        prop="houseNumber"
                        label="对应期数"
                        min-width="80">
                        <template scope="scope">
                            <!-- <el-input v-if="type=='edit'" @change="cellChange(scope.row,scope.$index)" v-model="scope.row.rsHouseNumberId"></el-input> -->
                            <el-select :clearable="true"  v-if="type=='edit'" @change="cellChange(scope.row,scope.$index)" v-model="scope.row.rsHouseNumberId" placeholder="请选择">
                                <el-option v-for="item in houseNumberList" :key="item.houseNumber" :label="item.houseNumber" :value="item.houseNumberId">
                                </el-option>
                            </el-select>
                            <span v-else>{{scope.row.rsHouseNumber}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column
                        prop="buildingNum"
                        label="对应地块"
                        min-width="80">
                        <template scope="scope">    
                            <el-input v-if="type=='edit'" @change="cellChange(scope.row,scope.$index)" v-model="scope.row.rsMassifName"></el-input>
                            <span v-else>{{scope.row.rsMassifName}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column
                        prop="buildingNum"
                        label="对应楼栋号"
                        min-width="80">
                        <template scope="scope">
                            <el-input v-if="type=='edit'" @change="cellChange(scope.row,scope.$index)" v-model="scope.row.rsBuildingNum"></el-input>
                            <span v-else>{{scope.row.rsBuildingNum}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column
                        prop="unitNum"
                        label="对应单元号"
                        min-width="80">
                        <template scope="scope">
                            <el-input v-if="type=='edit'" @change="cellChange(scope.row,scope.$index)" v-model="scope.row.rsUnitNum"></el-input>
                            <span v-else>{{scope.row.rsUnitNum}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column
                        prop="floor"
                        min-width="80"
                        label="对应楼层">
                        <template scope="scope">
                            <el-input v-if="type=='edit'" @change="cellChange(scope.row,scope.$index)" v-model="scope.row.rsFloor"></el-input>
                            <span v-else>{{scope.row.rsFloor}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column
                        prop="accountNum"
                        min-width="80"
                        label="对应户号">
                        <template scope="scope">
                            <el-input v-if="type=='edit'" @change="cellChange(scope.row,scope.$index)" v-model="scope.row.rsAccountNum"></el-input>
                            <span v-else>{{scope.row.rsAccountNum}}</span>
                        </template>
                        </el-table-column>
                    </el-table-column>
				</el-table>
				<div v-if="type=='edit'" style="text-align:center;margin-top:20px">
					<el-button  type="danger" v-show="showConfirm" @click="onEditSubmit(1)">确认</el-button>
					<el-button  type="primary" v-show="relieve" @click="onEditSubmit(0)">解除对应</el-button>
				</div>
				<el-pagination
					v-show="tableData.BuildCount>0"
					style="margin: 0 auto;text-align:center;margin-top:20px"
					layout="prev, pager, next ,jumper"
					:page-size="10"
					:currentPage.sync="currentPage"
					@current-change="currentChange"
					:total="tableData.BuildCount">
				</el-pagination>
			</el-row>
			<p style="text-align:center;margin-top:60px;color:#777" v-show="fileObj.isHaveExcel==0">暂无数据</p>
		</div>
	</div>
</template>

<script>
	import uploaderFile from '../../common/uploaderFile';
	import BuildingLinkage5 from '../Common/BuildingLinkage2/BuildingLinkage5';
	import axios from 'axios';
	import baseURL from '../../common/url'
	import message from '../../common/message';
	export default{
		name:'EstatePlanDetail',
		components:{
			BuildingLinkage5
		},
		data(){
			return{
				currentPage:1,
				houseTypeArray:[],
				fileObj:{
					isHaveExcel:0,
					excelName:'',
					fileSize:''
				},
				tabLoading:false,
				form:{
					houseNumberId:'',
					buildingId:'',
					buildingNum:'',
					unitNum:'',
					floor:'',
					accountNum:'',
					houseType:'',
					pageNum:0,
                    pageSize:10,
                    rsHouseNumberId:'', // 及以下新加
                    rsMassifName:'',
                    rsBuildingNum:'',
                    rsUnitNum:'',
                    rsFloor:'',
                    rsAccountNum:'',
                    buildingHouseRealId:'',
                    buidingId:this.$route.query.buildingId
				},
				tableData:{
					BuildPlanningInfo:[],
					BuildCount:0,
				},
				_BuildPlanningInfo:[],
				selectIdsArr:[],
				selectArr:[],
                reload:false,
                showConfirm:false,
                houseNumberList:[],
                multipleSelection:[],
                relieve:false,
                importExtelUrl:"",
                scloading:false
			}
		},
		computed:{
			type:function(){
				return this.$route.query.type;
			},
			buildingId:function(){
				return this.$route.query.buildingId;
			}
		},
		created(){
			this.form.buildingId = this.$route.query.buildingId;
			this.checkHasUpload();
			if(this.type == 'edit'){
				this.getHouseTypeData();
            }
            this.getHouseNumberList();
		},
		mounted(){

		},
		methods:{
			//是否可以勾选
			selectable(){
				return false;
			},
			//获取户型下拉数据
			getHouseTypeData(){
				let _this = this,
				body = {
					buildingId:this.buildingId,
					houseNumberId:'',
					buildingNum:'',
					unitNum:'',
					floor:'',
					accountNum:'',
					houseType:'',
				};
				this.$http('/buildingMonitor/pullDownExcelInfo',{body},{},{},'post').then(res => {
				  if(res.data.code == 0){
				  	let response = res.data.response;

				    if(response.houseTypeArray1[0] == null){
						_this.houseTypeArray = [];
				    }else{
				    	_this.houseTypeArray = response.houseTypeArray1;
				    }

				  }else if(res.data.code == 300){
					_this.$router.push('/login')
				  }
				}).catch(err => {
				  console.log(err);
				})
			},
			//检测是否已上传
			checkHasUpload(){
				let _this = this,
				body = {buildingId:this.buildingId};
				this.$http('/buildingMonitor/editBuildMonitorInfo',{body},{},{},'post').then(res => {
				  if(res.data.code == 0){
				    _this.fileObj.isHaveExcel = res.data.response.isHaveExcel;
				   if(res.data.response.isHaveExcel == 1){
             _this.fileObj.excelName = res.data.response.excelInfo[0].excelName;
             _this.fileObj.fileSize = res.data.response.excelInfo[0].fileSize;
           }
				    _this.getExcelData();
				    _this._reload = true;
				  }
				}).catch(err => {
				  console.log(err);
				})
			},
			//获取数据
			getExcelData(){
				let _this = this,
				body = this.form;
				this.tabLoading = true;
				this.$http('/buildingMonitor/getExcelInfo',{body},{},{},'post').then(res => {
				  _this.tabLoading = false;
				  if(res.data.code == 0){
					_this.tableData = res.data.response;
					_this._BuildPlanningInfo = _.cloneDeep(_this.tableData.BuildPlanningInfo);
					_this.selectIdsArr = [];
					_this.selectArr = [];
					_this.$refs.multipleTable.clearSelection();
				  }
				}).catch(err => {
				  _this.tabLoading = false;
				  console.log(err)
				})
			},
			//触发上传input
			choiceFile(type){
                if(type == 1){
                    this.importExtelUrl = "/buildingMonitor/excelImport"
                }else if(type ==2){
                    this.importExtelUrl = "/buildingMonitor/excelImport2"
                }
				this.$refs.fileInput.click();
			},
			//获取并上传
			getFile(e){
				let _this = this;
				if(e.target.files.length>0){
					let file = e.target.files[0];
					this.fileObj.excelName = file.name;
					this.fileObj.fileSize = (file.size/1024/1024).toFixed(2);
					let formData = new FormData(),
					config = {
						headers:{ 
							'Content-Type':'multipart/form-data'
						}
					};
					formData.append('fileName', file);
					formData.append('buildingId',this.buildingId);
					formData.append('excelName',this.fileObj.excelName);
					formData.append('fileSize',this.fileObj.fileSize);
					formData.append('d',JSON.stringify({token:localStorage._Mjb_token,body:{}}));
					_this.$refs.fileInput.value = '';
                    _this.scloading = true;
					axios({
						method: 'post',
							url: baseURL+_this.importExtelUrl,
							responseType:'json',
							data:formData,
							headers:{
								'Content-Type':'multipart/form-data',
							},
							withCredentials:true
					}).then(res => {
						if(res.data.code == 0){
							if(res.data.response.status == 1){
								message(_this,'上传成功','success');
								_this.currentPage = 1;
								_this.form.pageNum = 0;
                                this.checkHasUpload();
                                _this.scloading = false;
							}else{
								message(_this,'上传失败','warning');
								_this.fileObj.fileSize = '';
                                _this.fileObj.excelName = '';
                                _this.scloading = false;

							}
						}else if(res.data.code == 300){
							_this.$router.push('/login');
						}else{
							message(_this,'上传失败','warning')
							_this.fileObj.fileSize = '';
                            _this.fileObj.excelName = '';
                            _this.scloading = false;
						}
					}).catch(err => {
						console.log(err)
					});
				}
			},
			//删除文件
			deleteFile(){
				let _this = this,
				body = {
					buildingId:this.buildingId
				};
				this.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
					_this.$http('/buildingMonitor/deleteExcel',{body},{},{},'post').then(res => {
					  if(res.data.code == 0){
					    if(res.data.response.status == 1){
						  message(_this,'删除成功','success');
						  for(var i in _this.fileObj){
						  	_this.fileObj[i] = '';
						  };
					    }else if(res.data.response.status == 2){
						  message(_this,'已开通用户，不允许删除','warning');
					    }else if(res.data.response.status == 3){
                          message(_this,'已有楼盘全景或报告，不允许删除','warning');
					    }else{
					      message(_this,'删除失败','warning');
					    }
					  }else{
						message(_this,'删除失败','warning');
					  }
					}).catch(err => {
					  console.log(err)
					})
				}).catch(() => {
	            });
			},
			//改变数据input
			cellChange(row,index){
                this.showConfirm = true;
				let set = new Set(this.selectIdsArr),
				buildHouseId = this._BuildPlanningInfo[index].buildHouseId,
				olds = Object.values(this._BuildPlanningInfo[index]),
				news = Object.values(this.tableData.BuildPlanningInfo[index]),
				result = olds.every((item,index) => {
					return item == news[index];
				});

				if(result){
					set.delete(buildHouseId);
				}else{
					set.add(buildHouseId);
				}
				this.selectIdsArr = Array.from(set);
				this.selectArr = [];
				this.$refs.multipleTable.clearSelection();
				this.selectIdsArr.forEach((item1) => {
					this.tableData.BuildPlanningInfo.forEach((item2) => {
						if(item1 == item2.buildHouseId){
                            this.selectArr.push(item2);
							this.$refs.multipleTable.toggleRowSelection(item2);
						}
					})
				});
			},
			//搜索
			onSearchSubmit(){
				this.form.pageNum = 0;
				this.getExcelData();
			},
			//页码改变
			currentChange(page){
				this.form.pageNum = page-1;
				this.getExcelData();
			},
			//提交
			onEditSubmit(status){
                let _this = this;
                if(status == 1){
                    if(this.selectIdsArr.length <= 0){
                        message(_this,'请先修改再提交','warning')
                        return;
                    }
                }else{
                    if(this.multipleSelection.length <= 0){
                        message(_this,'请先选择再提交','warning')
                        return;
                    }
                }
				
				this.$confirm('确定提交吗？', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
                //   let body = _this.selectArr;
                let body = {};
                if(status == 1){
                    body.list =  _this.selectArr;
                }else{
                    body.list =  _this.multipleSelection;
                }
                body.buildingId = this.$route.query.buildingId;
                body.status = status;

				  this.$http('/buildingMonitor/updateExcelInfo',{body},{},{},'post').then(res => {
					if(res.data.code == 0){
                        if(res.data.response.status == 1){
                            message(_this,'提交成功','success');
                            _this.getExcelData();
                        }else if(res.data.response.status == 2){
                            message(_this,'存在不合法位置信息','warning');
                            _this.getExcelData();
                        }else{
                            message(_this,'提交失败','warning');
                        } 
					}else{
					  message(_this,'提交失败','warning');  
					}
				  }).catch(function(err){
					console.log(err)
				  })
				}).catch((err) => {
					console.log(err)
				});
            },
            getHouseNumberList() {
                let _this = this;
                this.$http("/buildingCamera/getAllHouseNumber", {}, {}, {}, "post")
                    .then(res => {
                    if (res.data.code == 0) {
                        let response = res.data.response;
                        _this.houseNumberList = response.list;
                    } else if (res.data.code == 300) {
                        _this.$router.push("/login");
                    }
                    })
                    .catch(err => {
                        console.log(err);
                    });
                },
			//返回
			back(){
				this.$router.push('/index/estateprocessmonitoringmanagement')
			},
            handleSelectionChange(val){
                this.multipleSelection=val;
                if(this.multipleSelection.length>0){
                    this.relieve = true;
                }else{
                    this.relieve = false;
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
		margin-top: 20px;
	}
</style>

<style>
	.plan-table .el-input__inner{
		border:1px solid transparent;
		background-color: transparent;
		text-align: center;
		cursor: pointer;
	}

	.plan-table th .el-checkbox{
		display: none;
	}
</style>
