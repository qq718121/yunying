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
	  <el-form-item label="单元">
		<el-select
		size="small"
		clearable
		:disabled="form.buildingNum==''"
		@change="conditionChange('unitNum')"
		v-model="form.unitNum"
		placeholder="不限"
		:style="itemStyle">
		  <el-option v-for="(item,index) in unitNumArray" :key="item.unitNum" :label="item.unitNum" :value="item.unitNum"></el-option>
		</el-select>
	  </el-form-item>
	  <el-form-item label="楼层">
		<el-select
		size="small"
		clearable
		:disabled="form.unitNum === ''"
		@change="conditionChange('floor')"
		v-model="form.floor" placeholder="不限"
		:style="itemStyle">
		  <el-option v-for="(item,index) in floorArray" :key="item.floor" :label="item.floor" :value="item.floor"></el-option>
		</el-select>
	  </el-form-item>
	  <el-form-item label="户号">
		<el-select
		size="small"
		clearable
		:disabled="form.floor===''"
		@change="conditionChange('accountNum')"
		v-model="form.accountNum"
		placeholder="不限"
		:style="itemStyle">
		  <el-option v-for="(item,index) in accountNumArray" :key="item.accountNum" :label="item.accountNum" :value="item.accountNum"></el-option>
		</el-select>
	  </el-form-item>
       <el-form-item label="户型">
		<el-select
		size="small"
		clearable
		:disabled="form.accountNum===''"
		@change="conditionChange('houseType')"
		v-model="form.houseType"
		placeholder="不限"
		style="width:150px;">
		  <el-option v-for="(item,index) in houseTypeArray" :key="item.houseTitle" :label="item.houseTitle" :value="item.houseTitle"></el-option>
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
			_unitNum:{
				required:false,
				default:''
			},
			_floor:{
				required:false,
				default:''
			},
			_accountNum:{
				required:false,
				default:''
            },
            _houseType:{
				required:false,
				default:''
			},
			inline:{
				default:true
			},
			required:{
				default:true
			},
			labelWidth:{
				default:'80px'
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
					unitNum:'',
					floor:'',
                    accountNum:'',
                    houseType:'',
				},
			  houseNumberArray:[],
				buildingNumArray:[],
				unitNumArray:[],
				floorArray:[],
                accountNumArray:[],
                houseTypeArray:[],
			}
		},
		watch:{
			'_buildingId':{
				handler:function(val){
					this.form.buildingId = val;
					this.form.houseNumberId = '';
					this.$emit('update:_houseNumber',this.form.houseNumberId);
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
			'_unitNum':{
				handler:function(val){
					this.form.unitNum = val;
				}
			},
			'_floor':{
				handler:function(val){
					this.form.floor = val;
				}
			},
			'_accountNum':{
				handler:function(val){
					this.form.accountNum = val;
				}
            },
            '_houseType':{
				handler:function(val){
					this.form.houseType = val;
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
					console.log(this.form.houseNumberId);
					this.$emit('update:_houseNumber',this.form.houseNumberId);
					this.form.buildingNum = '';
					this.form.unitNum = '';
					this.form.floor = '';
					this.form.accountNum = '';
					this.form.houseType = "";
					this.$emit('update:_buildingNum','');
					this.$emit('update:_unitNum','');
					this.$emit('update:_floor','');
					this.$emit('update:_accountNum','');
					this.$emit('update:_houseType','');
        }else if(name === 'buildingNum'){
					this.form.unitNum = '';
					this.form.floor = '';
                    this.form.accountNum = '';
                    this.form.houseType = "";
					this.$emit('update:_unitNum','');
					this.$emit('update:_floor','');
                    this.$emit('update:_accountNum','');
                    this.$emit('update:_houseType','');
				}else if(name === 'unitNum'){
					this.form.floor = '';
                    this.form.accountNum = '';
                    this.form.houseType = "";
					this.$emit('update:_floor','');
                    this.$emit('update:_accountNum','');
                    this.$emit('update:_houseType','');
				}else if(name === 'floor'){
                    this.form.accountNum = '';
                    this.form.houseType = "";
                    this.$emit('update:_accountNum','');
                     this.$emit('update:_houseType','');
				}else if(name === 'accountNum'){
					this.form.houseType = '';
					this.$emit('update:_houseType','');
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
            }else if(hName == 'unitNum'){
              _this.unitNumArray = response.list;
            }else if(hName == 'floor'){
              _this.floorArray = response.list;
            }else if(hName == 'accountNum'){
              _this.accountNumArray = response.list;
            }else if(hName == 'houseTitle'){
                _this.houseTypeArray = response.list;
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
