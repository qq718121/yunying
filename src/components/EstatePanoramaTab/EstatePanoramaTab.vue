<template>
	<div>
		<div>
			<el-tabs v-model="activeName" @tab-click="handleClick">
			    <el-tab-pane label="园区全景" name="1">
			   		<EstatePanoramaPark />
			    </el-tab-pane>
			    <el-tab-pane label="楼栋全景" name="2">
			    	<EstatePanoramaBan />
			    </el-tab-pane>
			    <el-tab-pane label="户内全景" name="3">
			    	<EstatePanoramaHouseType />
			    </el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>
  
<script>
	import EstatePanoramaPark from '../EstatePanoramaPark/EstatePanoramaPark';  
	import EstatePanoramaBan from '../EstatePanoramaBan/EstatePanoramaBan';
	import EstatePanoramaHouseType from '../EstatePanoramaHouseType/EstatePanoramaHouseType';
	import message from '../../common/message';
	export default{
		name:'EstatePanoramaTab',
		components:{
			EstatePanoramaPark,
			EstatePanoramaBan,
			EstatePanoramaHouseType
		},
		data(){
			return{
				secondLevel:'全流程监控',
        		threeLevel:'金地博悦',
        		activeName:'1'
			}
		},
		created(){	
		},
		methods:{
			//tab切换
			handleClick(){

			},
		}
	}
</script>

<style scoped>
	
</style>