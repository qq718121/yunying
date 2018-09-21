<template>
	<div style="display: inline-block">
		<el-autocomplete
			size="small"
			v-model="buildingName"
			:fetch-suggestions="querySearchAsync"
			placeholder="请输入关键词"
			@select="handleSelect">
		</el-autocomplete>
	</div>
</template>
<script>
	export default{
		props:{
			_buildingName:{
				default:'',
			},
      _buildingName3:{
        default:'',
      },
			_buildingName2:{
				default:'/backstageBuilding/getBuildingNameList',
			}
		},
		data(){
			return {
				buidingList:[],
				buildingName:'',
				replaceGetBuildingNameList: ''
			}
		},
		created(){
			this.replaceGetBuildingNameList = this._buildingName2;
            this.buildingName = this._buildingName;
            console.log(this._buildingName);
            this.remoteMethod('');
           
		},
		watch:{
            _buildingName:{
                handler:function(val){
					this.buildingName = val;
				}
            }
        },
		methods:{
			//模糊搜索
			remoteMethod(val){
				let body = {buildingName: val};
				this.$http(this.replaceGetBuildingNameList, {body}, {}, {}, 'post').then( res => {
				  if (res.data.code == 0) {
                    this.buidingList = res.data.response;
                    console.log(res.data.response);
				  }
				})
			},
			//搜索
			querySearchAsync(queryString,cb){
				this.$emit('update:_buildingName',queryString);
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
				this.$emit('update:_buildingName',this.buildingName);
				this.$emit('update:_buildingName3',str.key);
			},
		}
	}
</script>
