<template>
	<div>
		<Subnav2 :navList="navList" @refresh="refresh"></Subnav2>
		<div style="padding:20px">
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			    <el-tab-pane label="施工现场" name="first">
			   		<IndoorConstructionDetails />
			    </el-tab-pane>
			    <el-tab-pane label="整改记录" name="second">
			   		<EstateRectifyRecord />
			    </el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>
<script>
	import Subnav2 from '../Subnav2/Subnav2';
	import message from '../../common/message';
	import IndoorConstructionDetails from '../EstateIndoorConstruction/IndoorConstructionDetails';
	import EstateRectifyRecord from '../EstateRectifyRecord/EstateRectifyRecord'
	export default{
		name:'EstateProcessMonitoringDetail',
		components:{
			Subnav2,	
			IndoorConstructionDetails,
			EstateRectifyRecord
		},
		data(){
			let name = this.$route.query.buildingName;
			return{
				activeName:'first',
				navList:[
				
				]
			}
		},
		created(){
          this.$store.dispatch('defaultIndexAction','/index/estateprocessmonitoringmanagement');
          this.initNav();
		},
		computed:{
			buildingId:function(){
				return this.$route.query.buildingId;
			}
		},
		methods:{
      // 面包屑初始化
      initNav(){
				let q = this.$route.query,
	      		buildingName = q.buildingName,
	      		fullPath = this.$route.fullPath,
	      		path1 = '/index/estateprocessmonitoringdetail?type='+q.type+'&buildingId='+q.buildingId+'&buildingName='+buildingName;
	      		this.navList = [
              {path:'/index/estateprocessmonitoringmanagement',name:'首页'},
              {path:path1,name:buildingName},
              {path:fullPath,name:'施工现场'}
	      		]
			},
			//tab切换
			handleClick(tab){
				if(tab.name == 'first'){
					if(this.navList.length == 3){
						this.navList.pop();
						this.navList.push({path:this.$route.fullPath,name:'施工现场'})
					}else{
						this.navList.push({path:this.$route.fullPath,name:'施工现场'})
					}
				}else if(tab.name == 'second'){
					if(this.navList.length == 3){
						this.navList.pop();
						this.navList.push({path:this.$route.fullPath,name:'整改记录'})
					}else{
						this.navList.push({path:this.$route.fullPath,name:'整改记录'})
					}
				}
			},
			//刷新
			refresh(){

			}
		}
	}
</script>
<style scoped>

</style>
