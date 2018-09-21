<template>
	<el-form ref="form" :inline="inline" :model="form" :label-width="labelWidth">
    <el-form-item label="期数">
		<el-select
		size="small"
		clearable
		:disabled="form.building==''"
		@change="conditionChange('houseNumber')"
		v-model="form.houseNumberId"
		placeholder="不限"
		:style="itemStyle">
		  <el-option v-for="(item,index) in houseNumberArray" :key="item.houseNumber" :label="item.houseNumber" :value="item.houseNumberId"></el-option>
		</el-select>
	  </el-form-item>
	  <el-form-item label="楼栋号">
		<el-select
		size="small"
		clearable
		:disabled="form.houseNumberId===''"
		@change="conditionChange('buildingNum')"
		v-model="form.buildingNum"
		placeholder="不限"
		:style="itemStyle">
		  <el-option v-for="(item,index) in buildingNumArray" :key="item.buildingNum" :label="item.buildingNum" :value="item.buildingNum"></el-option>
		</el-select>
	  </el-form-item>
	</el-form>
</template>

<script>
	export default{
		name:'BuildingLinkage',
		props:{
			_buildingId:{
				required:true,
				default:''
      },
      _houseNumber:{
				required:false,
				default:''
			},
			_buildingNum:{
				required:false,
				default:''
			},
			inline:{
				default:false
			},
			required:{
				default:false
			},
			labelWidth:{
				default:'120px'
			},
			itemStyle:{
				default:function(){
					return {width:'140px'}
				}
			},
			changeSwith:{
				default:true
			}
		},
		data(){
			return{
				form:{
          houseNumberId:'',
					buildingId:'',
					buildingNum:'',
				},
			  houseNumberArray:[],
				buildingNumArray:[],
			}
		},
		watch:{
			'_buildingId':{
				handler:function(val){
					this.form.buildingId = val;
					this.form.houseNumber = '';
					this.$emit('update:_houseNumber','');
					this.conditionChange('houseNumber');
				}
      },
      '_houseNumber':{
				handler:function(val){
					this.form.houseNumberId = val;
				}
			},
			'_buildingNum':{
				handler:function(val){
					this.form.buildingNum = val;
				}
			},
		},
		created(){
			if(this._buildingId != ''){
				this.form.buildingId = this._buildingId
				this.conditionChange('houseNumber')
			}
		},
		methods:{
			conditionChange(name){
				this.$emit('update:'+'_'+name,this.form[name]);
				if(name === 'houseNumber'){
					this.$emit('update:_houseNumber',this.form.houseNumberId);
                    this.form.buildingNum = '';
					this.$emit('update:_buildingNum','');
             }else if(name === 'buildingNum'){
					this.form.unitNum = '';
					this.form.floor = '';
					this.form.accountNum = '';
				}
				let _this = this,
				body = _.cloneDeep(this.form);
				if(body.buildingId == ''){
					return;
        }
      
				this.$http('/buildingMonitor/pullHouseExcelInfo',{body},{},{},'post').then(res => {
				  if(res.data.code == 0){
            let response = res.data.response;
            let hName =  '';
            for(let i in response.list[0] ){
              hName = i;
            }
            if(hName == 'houseNumber' || hName == 'houseNumberId'){
              _this.houseNumberArray = response.list;
            }else if(hName == 'buildingNum'){
              _this.buildingNumArray = response.list;
            }
				  }else if(res.data.code == 300){
					_this.$router.push('/login')
				  }
				}).catch(err => {
				  console.log(err);
				})
			},
		}
	}
</script>
