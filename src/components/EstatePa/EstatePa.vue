<template>
	<div class="estate-pa">
		<div v-show="showType == 1">
			<el-button type="text" @click="add">新建</el-button>
		    <el-table
		      v-loading="tabLoading"
		      :data="paData.buidingVRList"
		      border
		      tooltip-effect="dark"
		      style="font-size:12px!important;text-align:center;margin-top:20px">
		      <el-table-column
		        prop="id"
		        label="ID"
		        min-width="60">
		      </el-table-column>
		      <el-table-column
		        prop="airscapeUrl"
		        label="鸟瞰图"
		        min-width="100">
		        <template scope="scope">
		        	<p :title="scope.row.airscapeUrl" class="url-p">{{scope.row.airscapeUrl}}</p>
		        </template>
		      </el-table-column>
		      <el-table-column
		        prop="sceneUrl"
		        label="楼盘实景"
		        min-width="100">
		        <template scope="scope">
		        	<p :title="scope.row.sceneUrl" class="url-p">{{scope.row.sceneUrl}}</p>
		        </template>
		      </el-table-column>
		      <el-table-column
		        prop="sampleUrl"
		        label="样板间"
		        min-width="100">
		        <template scope="scope">
		        	<p :title="scope.row.sampleUrl" class="url-p">{{scope.row.sampleUrl}}</p>
		        </template>
		      </el-table-column>
		      <el-table-column
		        prop="sandTableUrl"
		        label="楼盘沙盘"
		        min-width="100">
		        <template scope="scope">
		        	<p :title="scope.row.sandTableUrl" class="url-p">{{scope.row.sandTableUrl}}</p>
		        </template>
		      </el-table-column>
		      <el-table-column
		        prop="perimetUrl"
		        label="周边配套"
		        min-width="100">
		        <template scope="scope">
		        	<p :title="scope.row.perimetUrl" class="url-p">{{scope.row.perimetUrl}}</p>
		        </template>
		      </el-table-column>
		      <el-table-column
		        prop="createDate"
		        label="创建时间"
		        min-width="150">
		      </el-table-column>
		      <el-table-column
		        prop="editTime"
		        label="最近更新时间"
		        min-width="150">
		      </el-table-column>
		      <el-table-column
		        width="300"
		        label="操作">
		        <template scope="scope">
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
		            删除
		          </el-button>
		        </template>
		      </el-table-column>
		    </el-table>
		    <el-pagination
	          v-show="paData.rowCount>0"
	          style="margin: 0 auto;text-align:center;margin-top:20px"
	          layout="prev, pager, next"
	          :page-size=10
	          :currentPage="currentPage"
	          @current-change="currentChange"
	          :total="paData.rowCount">
	        </el-pagination>
	    </div>
	    <div v-show="showType == 2">
	    	<el-button type="text" @click="back">返回列表</el-button>
            <el-form
              :model="handleForm"
              label-width="100px"
              class="demo-dynamic"
              style="width:70%;margin:0 auto;margin-top:40px">


              <el-form-item label="全景缩略图" style="width:800px" required>

				<ImgPreview
                  :backgroundPicUrl="preImgSrcList[0].preImgSrc"
                  :isShowDelete="handleType != 'view'"
                  @previewImg="previewImgPa(0)"
                  @deleteImg="deleteImgPa(0)"
                />

             	<ImgUploader2
             	  v-show = "handleType != 'view'"
                  :btnId="btnList[0]"
                  @imgUploader="imgUploaderPa(0)"
                />
              </el-form-item>
              <el-form-item label="发布鸟瞰图">
                  <el-radio-group v-model="handleForm.airscapeUrlType">
                    <a v-if="handleType=='view'" class="pa-href" target="_blank">{{handleForm.airscapeUrlType}}</a>
                    <div v-else>
                      <el-radio label="1">链接地址</el-radio>
                      <el-radio label="2">上传html文件</el-radio>
                    </div>
                  </el-radio-group>
              </el-form-item>
              <el-form-item v-show="handleForm.airscapeUrlType == 2 && handleType!='view'" label="鸟瞰图文件">
                <el-button size="small"
                           :disabled="handleForm.airscapeDir != ''"
                           style="float: left;margin-right: 30px;"
                           type="primary"
                           id="uploadbtn">
                          点击上传</el-button>
                <span style="float: left">
                  <span v-if="handleForm.airscapeUrl">{{ handleForm.airscapeDir == '' ? filename : '已上传文件' }}</span>
                  <el-button style="margin-left: 20px;"
                             v-if="filename || handleForm.airscapeDir"
                             @click="delPlUpload"
                             :disabled="filePro<100"
                             type="text">删除</el-button>
                  <el-progress :percentage="filePro"
                               :stroke-width="3"
                               v-if="filePro > 0"
                               style="width:240px;"></el-progress>
                </span>
              </el-form-item>

              <el-form-item label="鸟瞰图">
              	<a v-if="handleType=='view'" class="pa-href" :href="handleForm.airscapeUrl" target="_blank">{{handleForm.airscapeUrl}}</a>
              	<div v-else>
              		<el-input size="small" style="width:350px" v-model="handleForm.airscapeUrl"></el-input>
               		<el-button style="margin-left: 10px" type="text" @click="see('airscapeUrl',1)">查看</el-button>
                </div>
              </el-form-item>

             <el-form-item label="发布时间">
              	<a v-if="handleType=='view'" class="pa-href">{{handleForm.createDate}}</a>
              	<div v-else>
              		<!-- <el-input size="small" style="width:350px" v-model="handleForm.createDate"></el-input> -->
                      <el-date-picker
                        v-model="handleForm.createDate"
                        type="date"
                        style="width:350px"
                        placeholder="选择日期">
                        </el-date-picker>
                </div>
              </el-form-item>

              <el-form-item label="楼盘实景">
              	<a v-if="handleType=='view'" class="pa-href" :href="handleForm.sceneUrl" target="_blank">{{handleForm.sceneUrl}}</a>
              	<div v-else>
                	<el-input size="small" style="width:350px" v-model="handleForm.sceneUrl"></el-input>
                	<el-button style="margin-left: 10px" type="text" @click="see('sceneUrl')">查看</el-button>
                </div>
              </el-form-item>

              <el-form-item label="样板间">
              	<a v-if="handleType=='view'" class="pa-href" :href="handleForm.sampleUrl" target="_blank">{{handleForm.sampleUrl}}</a>
              	<div v-else>
                    <el-input size="small" style="width:350px" v-model="handleForm.sampleUrl"></el-input>
                    <el-button style="margin-left: 10px" type="text" @click="see('sampleUrl')">查看</el-button>
                </div>
              </el-form-item>

              <el-form-item label="楼盘沙盘">
              	<a v-if="handleType=='view'" class="pa-href" :href="handleForm.sandTableUrl" target="_blank">{{handleForm.sandTableUrl}}</a>
              	<div v-else>
                    <el-input size="small" style="width:350px" v-model="handleForm.sandTableUrl"></el-input>
                    <el-button style="margin-left: 10px" type="text" @click="see('sandTableUrl')">查看</el-button>
                </div>
              </el-form-item>

              <el-form-item label="周边配套">
              	<a v-if="handleType=='view'" class="pa-href" :href="handleForm.perimetUrl" target="_blank">{{handleForm.perimetUrl}}</a>
              	<div v-else>
                    <el-input size="small" style="width:350px" v-model="handleForm.perimetUrl"></el-input>
                    <el-button style="margin-left: 10px" type="text" @click="see('perimetUrl')">查看</el-button>
                </div>
              </el-form-item>

              <el-form-item label="首张全景" required>
              	<span v-if="handleType=='view' && handleForm.vrType==1">鸟瞰图</span>
              	<span v-else-if="handleType=='view' && handleForm.vrType==2">楼盘实景</span>
              	<span v-else-if="handleType=='view' && handleForm.vrType==3">样板间</span>
              	<span v-else-if="handleType=='view' && handleForm.vrType==4">楼盘沙盘</span>
              	<span v-else-if="handleType=='view' && handleForm.vrType==5">周边配套</span>
                <el-radio-group v-model="handleForm.vrType" v-else>
                  <el-radio :label="1">鸟瞰图</el-radio>
                  <el-radio :label="2">楼盘实景</el-radio>
                  <el-radio :label="3">样板间</el-radio>
                  <el-radio :label="4">楼盘沙盘</el-radio>
                  <el-radio :label="5">周边配套</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="本期更新内容" v-if="handleType!='add'">
              	<span v-if="handleForm.updateMessage">{{handleForm.updateMessage}}</span>
              	<span v-else>--</span>
              </el-form-item>

              <el-form-item label="创建人" v-if="handleType!='add'">
              	<span v-if="handleForm.createMan">{{handleForm.createMan}}&nbsp;&nbsp;&nbsp;{{handleForm.createDate}}</span>
              	<span v-else>--</span>

              </el-form-item>

              <el-form-item label="最近编辑" v-if="handleType!='add'">
              	<span v-if="handleForm.editMan">{{handleForm.editMan}}&nbsp;&nbsp;&nbsp;{{handleForm.editTime}}</span>
              	<span v-else>--</span>
              </el-form-item>

              <el-form-item label="">
                <el-button v-show="handleType!='view'" style="margin-left:100px" type="primary" @click="sure">
                  确认
                </el-button>
              </el-form-item>
            </el-form>
	    </div>
	    <el-dialog :visible.sync="dialogVisible" size="tiny">
	      <img width="100%" :src="dialogImgSrc" alt="">
	    </el-dialog>
	</div>
</template>

<script>
	import message from '../../common/message';
	import baseURL from '../../common/url.js';
	import uploader2 from '../../common/uploader2.js';
	import ImgUploader2 from '../Common/ImgUploader2/ImgUploader2';
	import ImgPreview from '../Common/ImgPreview/ImgPreview';
  export default{
		name:'',
		components:{
			ImgPreview,
			ImgUploader2
		},
		data(){
			return{
				tabLoading:false,
				currentPage:1,
				handleType:'',
				showType:1,
                addDisab:false,
				dialogVisible:false,
				dialogImgSrc:'',
				btnList:['paBtn0'],
                filename:'',//文件名称
                filePro:0,//文件上传进度
				preImgSrcList:[{preImgSrc:''}],
          		uploaderList:[{uploader:null}],
				form:{
					buidingId:'',
					pageNum:0,
					pageSize:10
				},
				handleForm:{
					buidingId:'',
					picUrl:'',
                    airscapeUrl:'',
					sceneUrl:'',
					sampleUrl:'',
					sandTableUrl:'',
					perimetUrl:'',
					vrType:1,
                    airscapeUrlType:1, // 鸟瞰图上传类型1:url地址，2：压缩包上传
                    airscapeDir:'', //airscapeDir
                    createDate:''
                },
                addMassage:'',//加密字符串
                airscapeUrl2:[],
                paData:{
                    buidingVRList:[],
                    rowCount:0,
                },
			}
		},
		computed:{
			id:function(){
				return this.$store.getters.GetBuildingId;
			}
		},
		created(){
            this.initUploaderPa(0);
            this.geyairscapeUrl2();
             
		},
		methods:{
	      //获取数据
	      getData(){
	      		if(this.$route.query.type && this.$route.query.type == 'add'){
					return;
	      		}
		        let [_this,body] = [this,_.cloneDeep(this.form)];
		        body.buidingId = this.id;
		        _this.tabLoading = true;
		        this.$http('/backstageBuilding/getBuildVRList',{body},{},{},'post').then(res =>{
		          _this.tabLoading = false;
		          if(res.data.code == 0){
		            _this.paData = res.data.response;
		          }
		        })
	      },
		  //新增
		  add(){
		  	let _this = this;
		  	for(let i in this.handleForm){
		  		this.handleForm[i] = '';
		  	}
		  	this.preImgSrcList[0].preImgSrc = '';
            this.handleType = "add";
            this.showType = 2;
            this.handleForm.vrType = 1;
             this.filename = "";
             this.filePro = 0;
            this.$http('/backstageBuilding/selBuildVRInfo',{body:{buidingId:this.id}},{},{},'post').then(res =>{
                if(res.data.code == 0){
                    if(res.data.response.buidingVRList.length > 0){
                    _this.handleForm = res.data.response.buidingVRList[0];
                    _this.preImgSrcList[0].preImgSrc = _this.handleForm.picUrl;
                    }
                }
	        })
		  },
		  //返回
		  back(){
            this.showType = 1;
            this.getData();
		  },
		  //查看
		  see(name,type){
			if(this.handleForm[name] == ''){
				message(this,'请先输入URL地址','warning') 
				return;
            }
            if(type == 1){
                 this.geyairscapeUrl2();
                // this.handleForm.airscapeUrl =  this.airscapeUrl2[0] + '&d='+this.addMassage;
                window.open(this.handleForm.airscapeUrl + '&d='+this.addMassage);
            }else{
                window.open(this.handleForm[name]); 
            }
			
		  },
          //确认提交
          geyairscapeUrl2(){
              let [_this,body] = [this,{}]
              this.$http('/backstageUser/vrMessageDes',{body},{},{},'post').then(res =>{
		          if(res.data.code == 0){
                         _this.addMassage = res.data.response.message;
		          }
		        })
          },
		  sure(){
		  	if(this.handleForm.airscapeUrl=='' && this.handleForm.vrType==1){
		  		message(this,'请填写鸟瞰图全景地址','warning');
				return;
		  	}
		  	if(this.handleForm.sceneUrl=='' && this.handleForm.vrType==2){
		  		message(this,'请填写楼盘实景全景地址','warning');
				return;
		  	}
		  	if(this.handleForm.sampleUrl=='' && this.handleForm.vrType==3){
		  		message(this,'请填写样板间全景地址','warning');
				return;
		  	}
		  	if(this.handleForm.sandTableUrl=='' && this.handleForm.vrType==4){
		  		message(this,'请填写楼盘沙盘全景地址','warning');
				return;
		  	}
		  	if(this.handleForm.perimetUrl=='' && this.handleForm.vrType==5){
		  		message(this,'请填写周边配套全景地址','warning');
				return;
		  	}
		  	if(this.handleForm.vrType == ''){
		  		message(this,'请选择首张全景图','warning');
				return;
		  	}
			let [_this,body,url] = [this,_.cloneDeep(this.handleForm)];
			body.buidingId = this.id;
			url = this.handleType == 'add'? '/backstageBuilding/addBuildVR':'/backstageBuilding/editBuildVRInfo';
			// delete body.createDate;
			delete body.createMan;
			delete body.editMan;
			delete body.editTime;
			delete body.createDate;
            delete body.updateMessage;
            body.createDate = this.fermitTime(this.handleForm.createDate);
			if(this.handleType == 'add'){
				delete body.id;
			}
			_this.$confirm('确认提交吗?', '提示', {
	            confirmButtonText: '确定',
	            cancelButtonText: '取消',
	            type: 'warning'
	          }).then(() => {
	          	_this.$http(url,{body},{},{},'post').then(res =>{
		          if(res.data.code == 0){
		          	if(res.data.response.status == 1){
						message(_this,'提交成功','success');
                        _this.getData();
						_this.showType = 1;
		          	}
		          }
		        })
	          }).catch(() => {

	          });
          },
        //时间转换
      fermitTime(time){
            let now = new Date(time);
            let year = now.getFullYear();
            let mon = now.getMonth()+1;
            let date= now.getDate();
            let house = now.getHours();
            let getMinutes = now.getMinutes();
            let getSeconds = now.getSeconds();
            if(mon<10){
                mon = '0'+mon;
            };
            if(date<10){
                date = '0'+date;
            }
            if(house <10){
                house = '0'+house
            }
            if(getMinutes<10){
                getMinutes = '0'+getMinutes;
            }
            if(getSeconds<10){
                getSeconds = '0'+getSeconds
            }
            let postDate = '';
            if(time){
                postDate = year+'-'+mon+'-'+date+' '+house+':'+getMinutes+':'+getSeconds;
                
            }else{
                postDate = "";
            }
            return postDate;
        },
		  //初始化上传插件对象
	      initUploaderPa(index){
	        let _this = this,
	        btnName = 'paBtn' + index;
	        uploader2(function (src) {
	          _this.preImgSrcList[0].preImgSrc = src;
	        }, function (key) {
	          _this.handleForm.picUrl = key;
	        }, function () {
	          _this.preImgSrcList[0].preImgSrc = '';
	        }, function (uploader) {
	          _this.uploaderList[index].uploader = uploader;
	        }, btnName ,false)
	      },
		  //上传
		  imgUploaderPa(index){
	        if (this.uploaderList[index].uploader == null) {
	          return;
	        }
	        this.uploaderList[index].uploader.start()
	      },
	      //预览上传图
	      previewImgPa(index){
	        this.dialogImgSrc = this.preImgSrcList[index].preImgSrc
	        this.dialogVisible = true;
	      },
	      //删除图片
	      deleteImgPa(index){
	        this.preImgSrcList[index].preImgSrc = '';
	        this.handleForm.picUrl = '';
	      },
	      //操作
	      handle(scope,type){
	        let _this = this;
	        if(type == 1){
	          this.handleType = 'view';
	          this.showType = 2;
              this.handleForm = _.cloneDeep(scope);
	          this.preImgSrcList[0].preImgSrc = this.handleForm.picUrl;
	        }else if(type==3){
	          this.$confirm('确认删除吗?', '提示', {
	            confirmButtonText: '确定',
	            cancelButtonText: '取消',
	            type: 'warning'
	          }).then(() => {
	          	let [_this,body] = [this,{id:scope.id}];
	          	this.$http('/backstageBuilding/delBuildVRInfo',{body},{},{},'post').then(res =>{
		          if(res.data.code == 0){
		          	if(res.data.response.status == 1){
						message(_this,'删除成功','success');
		            	_this.getData();
		          	}else{
						message(_this,'删除失败','warning');
		          	}
		          }
		        })
	          }).catch(() => {
	          });
	        }else{
	       	  this.handleType = 'edit';
	          this.showType = 2;
	          this.handleForm = _.cloneDeep(scope);
            //   this.preImgSrcList[0].preImgSrc = this.handleForm.picUrl;
               this.airscapeUrl =  this.handleForm.airscapeUrl.split("&d=");
	        }
	      },
	      //切换页码
	      currentChange(page){
		    this.form.pageNum = page - 1;
		    this.getData();
	      },
      buttons(){
        this.pluupload().init();
      },
      //fenpian
      pluupload(){
        let _this = this;
         let tok = localStorage.getItem("_Mjb_token");
         var newPlupload =  new plupload.Uploader({
          browse_button: "uploadbtn", //DOM元素或者id
          url: baseURL+'/backstageUser/vrUpload', //服务器接收地址
          filters: {
            mime_types: [ //上传文件类型（数组）
              {
                title: "zip file",
                extensions: "zip"
              }
            ],
            max_file_size: "500mb", //上传文件大小（可以写b，kb，gb）
            prevent_duplicates: false //是否允许选取重复的文件
          },
          multipart: true, //是否使用multipart/form-data方式上传
          multipart_params: { //附加参数
            filePath: "/test",
            token:tok
          },
          max_retries: 0, //上传失败后的重试次数
          chunk_size: "520kb", //分片上传切割大小
          resize: {
            width: 100, //压缩图片宽度
            height: 100, //压缩图片高度
            crop: true,
            quality: 60, //压缩图片质量（默认90）
            preserve_headers: false
          },
          drop_element: "uploadbtn", //拖拽上传区域DOM元素或者id（可以是数组）
          multi_selection: false, //是否支持多文件选择
          unique_names: true, //是否生成唯一name
          runtimes: "html5,flash,silverlight,html4", //支持的上传方式以及优先级
          file_data_name: "file", //文件域名称
          flash_swf_url: "../../../static/plupload/Moxie.swf", //flash上传组件的url地址
          silverlight_xap_url: "../../../static/plupload/Moxie.xap", //silverlight上传组件的url地址
          init: { //监听函数
            Init:function(uploader){
            },
            FilesAdded: function(uploader,file) { //当文件添加到上传队列后触发
              // console.log(file);
              _this.filename = file[0].name
              uploader.start(); //开始上传
              return;
            },
            UploadProgress: function(uploader,file) { //会在文件上传过程中不断触发
              // console.info(uploader.total.percent + "%");
              // console.info(file.percent + "%"); //文件已上传部分所占的百分比
              _this.filePro = file.percent;
            //   console.log(file.percent);
            },
            FileUploaded: function(uploader,file,responseObject) { //当队列中的某一个文件上传完成后触发
              console.info(JSON.parse(responseObject.response)); //服务器返回的文本
              let data = JSON.parse(responseObject.response);
              // console.log(data.response.url,22222222);
              if(data.response.url){
                _this.handleForm.airscapeDir = data.response.airscapeDir;
                _this.handleForm.airscapeUrl = data.response.url;
                // console.log( data.response.airscapeDir);
                // console.log( data.response.url);
                _this.$message({
                  message: '上传成功',
                  type: 'success'
                });
                _this.addDisab = true;
              }else{
                _this.$message.error('上传失败');
              }

            },
            ChunkUploaded:function(uploader,file,responseObject){
              // console.log(responseObject,111111);
            },
            UploadComplete: function(uploader,file) { //当上传队列中所有文件都上传完成后触发
              console.info("ok");
            },
            Error: function(uploader,errObject) { //当发生错误时触发
              console.info(errObject.code); //错误代码
              console.info(errObject.message); //错误信息
              _this.$message.error('上传失败');
            }
          }
        }); //初始化Plupload实例
        return  newPlupload;
      },
      delPlUpload(){
	        let [_this , body] = [this , {}];
        this.$confirm('确认删除吗?删除不可恢复', '提示', {
          confirmButtonText: '确定',

          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          body.id = this.handleForm.id;
          body.buidingId = _this.id;
          body.airscapeDir = this.handleForm.airscapeDir;
          this.$http('/backstageUser/delUpload',{body},{},{},'post').then(res =>{
            if(res.data.code == 0){
                _this.filename = "";
                _this.$message({
                  message: '删除成功',
                  type: 'success'
                });
                _this.handleForm.airscapeUrl = ""
                _this. handleForm.airscapeDir = "";
                _this.addDisab = false;
                _this.filePro = 0;
                 _this.initUploaderPa(0);
              }
          })
        }).catch(() => {
          console.log("error");
          _this.$message.error('取消删除');
        });
      },
		},
		mounted(){
			if(this.$route.query.type && this.$route.query.type == 'edit'){
				this.getData();
			}
			if(this.handleForm.airscapeUrl){
                this.addDisab = true;
            }
            this.pluupload().init();
		}
	}
</script>

<style scoped>
	.list-row{margin-bottom: 10px;width: 60%}
	.url-p{
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
		cursor: pointer;
	}
	.pa-href{
		color: #20a0ff;
		display: inline-block;
		width: 70%;
		word-break: break-all;
	}
</style>
<style type="text/css">
  .plupload_button {
    display: -moz-inline-box; /* FF < 3*/
    display: inline-block;
    font: normal 12px sans-serif;
    text-decoration: none;
    color: #42454a;
    border: 1px solid #bababa;
    padding: 2px 8px 3px 20px;
    margin-right: 4px;
    background: #f3f3f3 url('../../../static/img/buttons.png') no-repeat 0 center;
    outline: 0;

    /* Optional rounded corners for browsers that support it */
    -moz-border-radius: 3px;
    -khtml-border-radius: 3px;
    -webkit-border-radius: 3px;
    border-radius: 3px;
  }

  .plupload_button:hover {
    color: #000;
    text-decoration: none;
  }

  .plupload_disabled, a.plupload_disabled:hover {
    color: #737373;
    border-color: #c5c5c5;
    background: #ededed url('../../../static/img/buttons-disabled.png') no-repeat 0 center;
    cursor: default;
  }

  .plupload_add {
    background-position: -181px center;
  }

  .plupload_wrapper {
    font: normal 11px Verdana,sans-serif;
    width: 100%;
  }

  .plupload_container {
    padding: 8px;
    background: url('../../../static/img/transp50.png');
    /*-moz-border-radius: 5px;*/
  }

  .plupload_container input {
    border: 1px solid #DDD;
    font: normal 11px Verdana,sans-serif;
    width: 98%;
  }

  .plupload_header {background: #2A2C2E url('../../../static/img/backgrounds.gif') repeat-x;}
  .plupload_header_content {
    background: url('../../../static/img/backgrounds.gif') no-repeat 0 -317px;
    min-height: 56px;
    padding-left: 60px;
    color: #FFF;
  }
  .plupload_header_title {
    font: normal 18px sans-serif;
    padding: 6px 0 3px;
  }
  .plupload_header_text {
    font: normal 12px sans-serif;
  }

  .plupload_filelist {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .plupload_scroll .plupload_filelist {
    height: 185px;
    background: #F5F5F5;
    overflow-y: scroll;
  }

  .plupload_filelist li {
    padding: 10px 8px;
    background: #F5F5F5 url('../../../static/img/backgrounds.gif') repeat-x 0 -156px;
    border-bottom: 1px solid #DDD;
  }

  .plupload_filelist_header, .plupload_filelist_footer {
    background: #DFDFDF;
    padding: 8px 8px;
    color: #42454A;
  }
  .plupload_filelist_header {
    border-top: 1px solid #EEE;
    border-bottom: 1px solid #CDCDCD;
  }

  .plupload_filelist_footer {border-top: 1px solid #FFF; height: 22px; line-height: 20px; vertical-align: middle;}
  .plupload_file_name {float: left; overflow: hidden}
  .plupload_file_status {color: #777;}
  .plupload_file_status span {color: #42454A;}
  .plupload_file_size, .plupload_file_status, .plupload_progress {
    float: right;
    width: 80px;
  }
  .plupload_file_size, .plupload_file_status, .plupload_file_action {text-align: right;}

  .plupload_filelist .plupload_file_name {
    width: 205px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .plupload_file_action {
    float: right;
    width: 16px;
    height: 16px;
    margin-left: 15px;
  }

  .plupload_file_action * {
    display: none;
    width: 16px;
    height: 16px;
  }

  li.plupload_uploading {background: #ECF3DC url('../../../static/img/backgrounds.gif') repeat-x 0 -238px;}
  li.plupload_done {color:#AAA}

  li.plupload_delete a {
    background: url('../../../static/img/delete.gif');
  }

  li.plupload_failed a {
    background: url('../../../static/img/error.gif');
    cursor: default;
  }

  li.plupload_done a {
    background: url('../../../static/img/done.gif');
    cursor: default;
  }

  .plupload_progress, .plupload_upload_status {
    display: none;
  }

  .plupload_progress_container {
    margin-top: 3px;
    border: 1px solid #CCC;
    background: #FFF;
    padding: 1px;
  }
  .plupload_progress_bar {
    width: 0px;
    height: 7px;
    background: #CDEB8B;
  }

  .plupload_scroll .plupload_filelist_header .plupload_file_action, .plupload_scroll .plupload_filelist_footer .plupload_file_action {
    margin-right: 17px;
  }

  /* Floats */

  .plupload_clear,.plupload_clearer {clear: both;}
  .plupload_clearer, .plupload_progress_bar {
    display: block;
    font-size: 0;
    line-height: 0;
  }

  li.plupload_droptext {
    background: transparent;
    text-align: center;
    vertical-align: middle;
    border: 0;
    line-height: 165px;
  }

</style>
