<template>
	<div class="newText">
		<Subnav2 :navList="navList" @refresh="refresh"></Subnav2>
		<div style="padding:20px" class="newTextTop_wap">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm">
				<el-form-item label="标题" prop="title" required>
					<el-input size="small" v-model="ruleForm.title" placeholder="标题" style="width:30%;" :maxlength="200"></el-input>
					<el-button size="small" type="primary" @click="checkName">检测重名</el-button>
					<span style="margin-left:5px">还可以输入
						<i style="color:red">{{titleLenth}}</i> 字符</span>
				</el-form-item>
				<el-form-item label="作者">
					<el-input size="small" v-model="ruleForm.author" placeholder="作者" style="width:30%;"></el-input>
				</el-form-item>
				<el-form-item label="来源">
					<el-input size="small" v-model="ruleForm.source" placeholder="来源" style="width:30%;"></el-input>
				</el-form-item>
				<el-form-item label="缩略图">
					<ImgUploader :backgroundPicUrl="preImgSrc" :dialogVisible="dialogVisible" @previewImg="previewImg" @deleteImg="deleteImg" @imgUploader="imgUploader" @dialogClose="dialogClose" />
				</el-form-item>
				<el-form-item label="分类" prop="newsTypeId" required>
					<el-select size="small" v-model="ruleForm.newsTypeId" :clearable="true" placeholder="分类">
						<el-option label="验房维权" value="1"></el-option>
						<el-option label="行业动态" value="2"></el-option>
						<el-option label="置业指引" value="3"></el-option>
						<el-option label="政策解读" value="4"></el-option>
						<el-option label="楼盘评测" value="5"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="摘要" :required="ruleForm.newsTypeId == 5 ? false : true">
					<el-input size="small" type="textarea" autosize placeholder="摘要" v-model="ruleForm.abstracts" :maxlength="200" style="width:50%">
					</el-input>
				</el-form-item>
				<el-form-item label="正文" prop="content" required>
					<quill-editor ref="myQuillEditor" v-model="ruleForm.content" style="width:80%;">
					</quill-editor>
				</el-form-item>
				<el-form-item label="楼盘名称" v-if="ruleForm.newsTypeId == 5" prop="buildingId" required>
					<MjbBuildingSearch :_buildingName.sync="ruleForm.buildingName" :_buildingName3.sync="ruleForm.buildingId" />
				</el-form-item>
				<el-form-item label="发布日期" required prop="releaseTime">
					<el-form-item>
						<el-date-picker size="small" type="datetime" placeholder="发布日期" @change="timeChange" v-model="ruleForm.releaseTime" style="width:250px">
						</el-date-picker>
					</el-form-item>
				</el-form-item>
				<el-form-item label="文章标签">
					<el-input size="small" v-model="ruleForm.articleKeyword" placeholder="多个关键词请以半角逗号分割" style="width:20%;"></el-input>
				</el-form-item>

				<el-form-item label="文章发布的城市" v-if="ruleForm.newsTypeId != 5">
					<el-checkbox v-model="checkAllPro" @change="proAllChange">全部省</el-checkbox>
					<el-checkbox-group v-model="ruleForm.provinceIds">
						<el-checkbox v-for="item in provinceIdsList" @change="proChange" :key="item.cityId" :label="item.cityId" :value="item.cityId">
							{{item.cityName}}
						</el-checkbox>
					</el-checkbox-group>

					<el-checkbox v-show="ruleForm.provinceIds.length > 0" style="margin-top:30px" v-model="checkAllCity" @change="cityAllChange">全部市
					</el-checkbox>
					<el-checkbox-group v-model="ruleForm.cityIds">
						<el-checkbox v-for="item in cityIdsList" @change="cityChange" :key="item.cityId" :label="item.cityId" :value="item.cityId">{{item.cityName}}
						</el-checkbox>
					</el-checkbox-group>
				</el-form-item>

				<el-form-item label="头条">
					<el-radio-group v-model="ruleForm.isHeadline">
						<el-radio label="1">是</el-radio>
						<el-radio label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="上下线">
					<el-radio-group v-model="ruleForm.status">
						<el-radio label="1">上线</el-radio>
						<el-radio label="0">下线</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="置顶">
					<el-radio-group v-model="ruleForm.isTop">
						<el-radio label="1">是</el-radio>
						<el-radio label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="推荐位置">
					<el-select size="small" v-model="ruleForm.newsLocation">
						<el-option label="不推荐" value="0"></el-option>
						<el-option label="推荐至banner位" value="2"></el-option>
						<el-option label="推荐至展示位" value="3"></el-option>
						<el-option label="推荐至资讯列表" value="4"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="编辑" v-if="this.$route.query.type=='edit'">
					<p>{{ruleForm.backstageUserId}}</p>
				</el-form-item>
				<el-form-item>
					<el-button style="margin-left:200px" type="primary" @click="submitForm('ruleForm')">发布</el-button>
					<el-button @click="resetForm">取消</el-button>
				</el-form-item>
				<p style="color:lightgray">注*为必填项</p>
			</el-form>
		</div>
		<button ref="upbtn2" style="display:none" @click="beginUp" id="upbtn2"></button>
	</div>
</template>

<script>
	import Vue from 'vue'
	import message from '../../common/message'
	import VueQuillEditor from 'vue-quill-editor'
	import Subnav2 from '../Subnav2/Subnav2.vue'
	import uploader from '../../common/uploader.js'
	import trim from '../../common/trim.js'
	import ImgUploader from '../Common/ImgUploader/ImgUploader'
	import MjbBuildingSearch from '../Common/MjbBuildingSearch/MjbBuildingSearch';
	Vue.use( VueQuillEditor );
	export default {
		name: 'Posts',
		components: {
			Subnav2,
			ImgUploader,
			MjbBuildingSearch
		},
		data() {

			let validatePublishTime = ( rule, value, callback ) => {
					if ( value === '' ) {
						callback( new Error( '请选择发布时间' ) );
					} else {
						callback();
					}
				},

				validateTitle = ( rule, value, callback ) => {
					let _value = trim( value )
					if ( _value === '' || _value.length <= 0 || _value.length >= 200 ) {
						callback( new Error( '填写标题且不多余200字' ) );
					} else {
						callback();
					}
				},

				validateAbs = ( rule, value, callback ) => {
					if ( value === '' ) {
						callback( new Error( '填写摘要且不多于200字' ) );
					} else {
						callback();
					}
				};

			return {
				checkAllPro: false,
				checkAllCity: false,
				cid: [],
				dialogVisible: false,
				qeUploader: null,
				uploader: null,
				navList: [
					{ path: '/article/articlemanagement', name: '首页' },
					{ path: '/article/articlemanagement', name: '文章管理' },
					{ path: this.$route.fullPath, name: '编辑' },
               ],
				provinceIdsList: [],
				cityIdsList: [],
				preImgSrc: '',
				ruleForm: {
					newsId: '',
					abstracts: '',
					title: '',
					newsTypeId: '',
					backgroundPicUrl: '',
					articleKeyword: '',
					provinceIds: [],
					cityIds: [],
					content: '',
					releaseTime: '',
					author: '',
					status: '0',
					isTop: '0',
					isHeadline: '0',
					newsLocation: '',
					source: '',
					buildingId: "",
					buildingName: '',
				},
				rules: {
					title: [
						{ validator: validateTitle },
                    ],
					newsTypeId: [
						{ required: true, message: '请选择类型' }
                    ],
					buildingId: [
						{ required: true, message: '请选择楼盘' }
                    ],
					//   abstracts: [
					//     {validator: validateAbs}
					//   ],
					releaseTime: [
						{ validator: validatePublishTime }
                    ],
					content: [
						{ required: true, message: '请填写正文' }
                    ]
				}
			}
		},
		filters: {},
		computed: {
			titleLenth() {
				return 200 - this.ruleForm.title.length;
			}
		},
		watch: {
			'ruleForm.provinceIds': {
				handler() {
					this.getProCityData( 2 )
				},
				deep: true
			}
		},
		created() {
			this.getProCityData( 1 )
			this.getProCityData( 2 )
			if ( this.$route.query && this.$route.query.type && this.$route.query.type == 'edit' ) {
				this.getdata()
			}
		},
		methods: {
			//获取数据
			getdata() {
				let _this = this;
				if ( _this.$route.query.id == '' ) {
					message( this, '参数错误', 'warning' )
					return;
				}
				this.$http( '/news/queryNewsInfo', { body: { newsId: _this.$route.query.id } }, {}, {}, 'post' )
					.then( function ( res ) {

						if ( res.data.code == 0 ) {

							_this.ruleForm = res.data.response;

							let reg = /(http:|https:|'')\/\//g;
							try {
								_this.ruleForm.content = _this.ruleForm.content.replace( reg, 'https://images.weserv.nl/?url=' );
							} catch ( e ) {
								console.log( e );
							}


							if ( _this.ruleForm.provinceIds[ 0 ] == 0 ) {
								_this.ruleForm.provinceIds = [];
								_this.checkAllPro = true;
								setTimeout( () => {
									_this.provinceIdsList.forEach( ( item ) => {

										_this.ruleForm.provinceIds.push( item.cityId )

									} )
								}, 300 )

							}

							if ( _this.ruleForm.cityIds[ 0 ] == 0 ) {
								_this.ruleForm.cityIds = []
								_this.checkAllCity = true;
								setTimeout( () => {
									_this.cityIdsList.forEach( ( item ) => {

										_this.ruleForm.cityIds.push( item.cityId )

									} )
								}, 800 )

							} else {

								_this.cid = _.cloneDeep( res.data.response.cityIds );
								setTimeout( () => {
									_this.ruleForm.cityIds = _this.cid;
								}, 300 )

							}
							setTimeout( () => {
								if ( _this.ruleForm.cityIds.length == _this.cityIdsList.length ) {
									_this.checkAllCity = true;
								}
								if ( _this.ruleForm.provinceIds.length == _this.provinceIdsList.length ) {
									_this.checkAllPro = true;
								}
							}, 1000 )
							_this.preImgSrc = _this.ruleForm.backgroundPicUrl;
						}
					} )
					.catch( function ( err ) {
						console.log( err )
					} )
			},
			//获取省数据
			getProCityData( pramas ) {
				let _this = this;
				let body = '';
				if ( pramas == 1 ) {
					body = { cityType: 1 }
				} else {
					let _provinceIds = _.cloneDeep( _this.ruleForm.provinceIds )
					body = { cityType: 2, parentid: _provinceIds.join( ',' ) }
				}
				_this.$http( '/citis/cityLists', { body }, {}, {}, 'post' )
					.then( function ( res ) {

						if ( res.data.code == 0 ) {

							if ( pramas == 1 ) {
								_this.provinceIdsList = res.data.response.cityList
							} else {
								_this.cityIdsList = res.data.response.cityList
								if ( _this.ruleForm.provinceIds == '' ) {
									_this.cityIdsList = []
								}
							}

						}
					} )
			},
			proAllChange( val ) {

				let _this = this;
				this.checkAllCity = false;
				this.ruleForm.cityIds = [];
				if ( this.checkAllPro ) {
					this.ruleForm.provinceIds = []
					this.provinceIdsList.forEach( ( item ) => {
						this.ruleForm.provinceIds.push( item.cityId )
					} )
				} else {
					this.ruleForm.provinceIds = []
				}
			},
			cityAllChange( val ) {
				let _this = this;
				if ( this.checkAllCity ) {
					this.ruleForm.cityIds = []
					this.cityIdsList.forEach( ( item ) => {
						this.ruleForm.cityIds.push( item.cityId )
					} )

				} else {
					this.ruleForm.cityIds = []
				}
			},
			//获取市数据
			proChange() {
				if ( this.provinceIdsList.length === this.ruleForm.provinceIds.length ) {
					this.checkAllPro = true
				} else {
					this.checkAllPro = false
				}

				this.checkAllCity = false
				this.ruleForm.cityIds = []
			},
			cityChange() {
				if ( this.cityIdsList.length === this.ruleForm.cityIds.length ) {
					this.checkAllCity = true
				} else {
					this.checkAllCity = false
				}
			},
			//开始上传
			imgUploader() {
				if ( this.uploader == null ) {
					return;
				}
				this.uploader.start()
			},
			//改变时间
			timeChange( val ) {
				this.ruleForm.releaseTime = val ? val : ''
			},
			//检测重名
			checkName() {
				let _this = this;
				if ( this.ruleForm.title === '' ) {
					this.$message( {
						type: 'warning',
						message: '标题不能为空'
					} );
					return;
				}
				let body = { newsId: this.ruleForm.newsId, title: this.ruleForm.title }
				this.$http( '/news/queryByTitle', { body }, {}, {}, 'post' )
					.then( res => {
						if ( res.data.code == 1 ) {
							message( _this, '文章名字已存在', 'warning' )
						} else {
							message( _this, '检测通过', 'success' )
						}
					} )
			},
			//预览图片
			previewImg() {
				this.dialogVisible = true;
			},
			//删除图片
			deleteImg() {
				this.preImgSrc = ''
				this.ruleForm.backgroundPicUrl = ''
			},
			//关闭模态框
			dialogClose() {
				this.dialogVisible = false;
				return;
			},
			//提交
			submitForm( formName ) {

				let url = '';
				let _this = this;
				if ( this.ruleForm.releaseTime == "" ) {
					message( _this, '请选择发布时间', 'error' );
					return;
				}
				if ( this.ruleForm.newsTypeId != 5 ) {
					if ( this.ruleForm.provinceIds == "" ) {
						message( _this, '请选择发布城市', 'error' );
						return;
					}
				}
				if ( this.ruleForm.newsTypeId != 5 && !this.ruleForm.abstracts ) {
					message( _this, '填写摘要且不多于200字', 'error' );
					return;
				}
				if ( this.$route.query && this.$route.query.type && this.$route.query.type == 'edit' ) {
					url = '/news/updateNewsInfo'
				} else {
					url = '/news/insertNewsInfo'
				}
				this.$refs[ formName ].validate( ( valid ) => {
					console.log( formName );
					if ( valid ) {
						this.$confirm( '确认提交吗?', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
							} )
							.then( () => {

								let _ruleForm = _.cloneDeep( _this.ruleForm );
								_ruleForm.provinceIds = _ruleForm.provinceIds.join( ',' )
								_ruleForm.cityIds = _ruleForm.cityIds.join( ',' )

								_ruleForm.provinceIds = _ruleForm.provinceIds == '' ? '0' : _ruleForm.provinceIds
								_ruleForm.cityIds = _ruleForm.cityIds == '' ? '0' : _ruleForm.cityIds

								this.$http( url, { body: _ruleForm }, {}, {}, 'post' )
									.then( function ( res ) {
										if ( res.data.code == 0 ) {
											_this.$router.push( { path: '/article/articlemanagement' } );
											message( _this, '提交成功', 'success' );
										}
									} )
							} )
							.catch( () => {} );
					} else {
						message( this, '有必填项未填写或者格式错误', 'warning' )
						return false;
					}
				} );
			},
			//取消
			resetForm() {
				this.$router.push( { path: '/article/articlemanagement' } )
			},
			//富文本提交图片
			imgHandler() {
				this.$refs[ 'upbtn2' ].click()
			},
			beginUp() {
				this.qeUploader.start()
			},
			refresh() {

			},
		},
		mounted() {
			this.$store.dispatch( 'defaultIndexAction', '/article/articlemanagement' );
			let _this = this;

			uploader( function ( src ) {
				_this.preImgSrc = src;
			}, function ( key ) {
				_this.ruleForm.backgroundPicUrl = key;
			}, function () {
				_this.preImgSrc = '';
			}, function ( uploader ) {
				_this.uploader = uploader
			} )

			uploader( function ( src ) {

			}, function ( key ) {

				let qeObj = _this.$refs[ 'myQuillEditor' ].quill.getSelection(),
					length = qeObj.index,
					imgUrl = 'http://oxrgdeqd8.bkt.clouddn.com/' + key;
				_this.$refs[ 'myQuillEditor' ].quill.insertEmbed( length, 'image', imgUrl )
			}, function () {

			}, function ( uploader ) {
				_this.qeUploader = uploader
			}, 'upbtn2' )

			this.$refs[ 'myQuillEditor' ].quill.getModule( 'toolbar' )
				.addHandler( 'image', this.imgHandler )

		}
	}
</script>

<style scoped>
	.newText .newTextTop_wap {
		border: 1px solid darkgray;
		margin: 20px;
	}
</style>

<style>
</style>