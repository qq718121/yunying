<template>
	<div>
		<Subnav2 :navList="navList" @refresh="refresh"></Subnav2>
		<div style="padding:20px">
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			    <el-tab-pane label="楼栋规划详情" name="first" v-if="NewTagsLists.list[0].status == 1">
			   		<EstatePlanDetail :buildingId="buildingId"/>
			    </el-tab-pane>
			    <el-tab-pane label="楼盘全景图" name="second" v-if="NewTagsLists.list[1].status == 1">
			   		<EstatePanoramaTab :buildingId="buildingId"/>
			    </el-tab-pane>
			    <el-tab-pane label="楼盘报告" name="third" v-if="NewTagsLists.list[2].status == 1">
			   		<EstateConstructionReportList  :buildingId="buildingId"/>
			    </el-tab-pane>
			   <!--  <el-tab-pane label="交房后报告" name="four">
			   		<EstateMonitoringReport :buildingId="buildingId"/>
			    </el-tab-pane> -->
		        <el-tab-pane label="户内监控" name="five" v-if="NewTagsLists.list[3].status == 1">
		          <EstateIndoorMonitoring :buildingId="buildingId"/>
		        </el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>
<script>
	import Subnav2 from '../Subnav2/Subnav2';
	import EstatePlanDetail from '../EstatePlanDetail/EstatePlanDetail';
	import EstatePanoramaTab from '../EstatePanoramaTab/EstatePanoramaTab';
	import EstateConstructionReport from '../EstateConstructionReport/EstateConstructionReport';
	import EstateConstructionReportList from '../EstateConstructionReport/EstateConstructionReportList';
	import EstateMonitoringReport from '../EstateMonitoringReport/EstateMonitoringReport';
	import EstateIndoorMonitoring from '../EstateIndoorReportList/EstateIndoorMonitoring'
	import message from '../../common/message';
	export default{
		name:'EstateProcessMonitoringDetail',
		components:{
			Subnav2,
			EstatePlanDetail,
			EstatePanoramaTab,
			EstateConstructionReport,
			EstateMonitoringReport,
      EstateConstructionReportList,
      EstateIndoorMonitoring
		},
		data(){
			let name = this.$route.query.buildingName;
			return{
				activeName:'first',
				navList:[
					{path:'/index/estateprocessmonitoringmanagement',name:'首页'},
					{path:'/index/estateprocessmonitoringmanagement',name},
                ],
                 NewTagsLists:{
                    list:[
                        {
                            status:1
                        },
                        {
                            status:1
                        },
                        {
                            status:1
                        },
                        {
                            status:1
                        },
                    ]
                }
			}
		},
		created(){
              this.$store.dispatch('defaultIndexAction','/index/estateprocessmonitoringmanagement');
              this.addNewTagsLists();
             
		},
		computed:{
			buildingId:function(){
				return this.$route.query.buildingId;
            },
		},
		methods:{
			//tab切换
			handleClick(tab){
				if(tab.name == 'first'){
					if(this.navList.length == 3){
						this.navList.pop();
					}
				}else if(tab.name == 'second'){
					if(this.navList.length == 3){
						this.navList.pop();
						this.navList.push({path:this.$route.fullPath,name:'楼盘全景'})
					}else{
						this.navList.push({path:this.$route.fullPath,name:'楼盘全景'})
					}
				}else if(tab.name == 'third'){
					if(this.navList.length == 3){
						this.navList.pop();
						this.navList.push({path:this.$route.fullPath,name:'楼盘报告'})
					}else{
						this.navList.push({path:this.$route.fullPath,name:'楼盘报告'})
					}
				}else{
					if(this.navList.length == 3){
						this.navList.pop();
						this.navList.push({path:this.$route.fullPath,name:'户内监控'})
					}else{
						this.navList.push({path:this.$route.fullPath,name:'户内监控'})
					}
				}
            },
             //添加权限管理
            addNewTagsLists(){
                let _this = this;
                this.$http(
                    "/buildingCamera/getMonitorAuthority",
                    {},
                    {},
                    {},
                    "post"
                )
                    .then(res => {
                    if (res.data.code == 0) {
                        _this.NewTagsLists = res.data.response;
                        console.log( _this.NewTagsLists);
                         if(this.NewTagsLists.list[0].status == 1){
                                this.activeName = "first"
                            }else if(this.NewTagsLists.list[1].status == 1){
                                this.activeName = "second"
                            }else if(this.NewTagsLists.list[2].status == 1){
                                    this.activeName = "third"
                            }else if(this.NewTagsLists.list[3].status == 1){
                                this.activeName = "five"
                            }
                    } else if (res.data.code == 300) {
                        _this.$router.push("/login");
                    }
                    })
                    .catch(err => {
                    console.log(err);
                    });
            },
			//刷新
			refresh(){

			}
		}
	}
</script>
<style scoped>

</style>
