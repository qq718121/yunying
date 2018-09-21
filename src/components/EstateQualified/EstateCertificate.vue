<template>
    <div style="padding:0px;">
        <el-form style="margin-top:30px; border-bottom:1px solid #ccc;width:95%;" v-for="(item,index) in permitPresaleList" :key="index">
                <el-form-item label="上传图片" v-if="type == 'edit'">
                    <ImgUploader2
                        :btnId="btnList[index]"
                        @imgUploader="imgUploader(0)"
                        />
                </el-form-item>
                <el-form-item label="缩略图：">
                    <ImgPreview
                    :backgroundPicUrl="item.preImgSrc?item.preImgSrc:item.certificateUrl"
                    :isShowDelete="isShowDelete"
                    @previewImg="previewImg(index)"
                    @deleteImg="deleteImg(index)"
                    />
                </el-form-item>
                <!-- <input v-model="sess"  /> -->
                <el-form-item label="证书编号" required>
                    <el-input v-model="item.certificateNumber" style="width:50%;" v-if="type == 'edit'"></el-input>
                    <span v-else>{{item.certificateNumber}}</span>
                    </el-form-item>
                <el-form-item  label="发证日期" required>
                    <el-date-picker type="date"  v-if="type == 'edit'" placeholder="选择日期" v-model="item.createTime" style="width: 300px;"></el-date-picker>
                    <span v-else>{{item.createTime}}</span>
                </el-form-item>
            <div style="margin:10px 0 20px 30px;"  v-if="type == 'edit'">
                <el-button type="text" @click="deleteList(index);">删除</el-button>
            </div>
        </el-form>
        <div style="margin:20px 0 20px 30%;"  v-if="type == 'edit'">
            <el-button type="primary" @click="addNewList()">添加新证</el-button>
            <el-button type="primary" style="margin-left:30px;" plain @click="subCertf()">提 交</el-button>
        </div>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImgSrc" alt="">
        </el-dialog>
        
    </div>
</template>

<script>
import uploader2 from "../../common/uploader2.js";
import ImgUploader2 from "../Common/ImgUploader2/ImgUploader2";
 import ImgPreview from '../Common/ImgPreview/ImgPreview'
export default {
    name:"",
    components:{
        uploader2,
        ImgUploader2,
        ImgPreview
    },
    props:["_activeName"],
    data(){
        return {
            tabLoading: false,
            dialogFormVisible: false,
            viewDialogFormVisible: false,
            isShowDelete: false,
            currentPage: 1,
            btnList: [],
            preImgSrcList: [{preImgSrc: ''},{preImgSrc: ''}],
            uploaderList: [{uploader: null}],
            dialogVisible: false,
            dialogImgSrc: '',
            type:this.$route.query.type,
            sess:this._activeName,
            initUp:true,
            permitPresaleList:[
                // {
                //     certificateNumber:'',
                //     createTime:"",
                //     certificateUrl:"",
                //     preImgSrc:''
                // }
            ],
        }
    },
    created(){
        this.getData();
        // this.initUploader2(0,0);
    },
    methods:{
             //初始化上传插件对象1111
      initUploader2(index,num){
        let _this = this,
          btnName = this.sess+ index + num;
          this.btnList.push(btnName)
        uploader2(function (src) {
        //  _this.permitPresaleList[index].preImgSrc = src;
         _this.$set(_this.permitPresaleList[index],'preImgSrc',src)
        }, function (key) {
          _this.permitPresaleList[index].certificateUrl = key;
        }, function () {
           _this.permitPresaleList[index].preImgSrc = '';
        }, function (uploader) {
          _this.uploaderList[index].uploader = uploader;
        }, btnName, false)
      },
      //预览上传图
      previewImg(index){
          if(this.permitPresaleList[index].preImgSrc){
              this.dialogImgSrc = this.permitPresaleList[index].preImgSrc;
          }else{
              this.dialogImgSrc = this.permitPresaleList[index].certificateUrl;
          }
        
        this.dialogVisible = true;
      },
      //删除图片
      deleteImg(index){
        this.permitPresaleList[index].preImgSrc = '';
        this.permitPresaleList[index].certificateUrl = '';
      },
      //开始上传
      imgUploader(index){
        if (this.uploaderList[index].uploader == null) {
          return;
        }
        ;
        this.uploaderList[index].uploader.start();
      },
        getData(){
          let body = {
              buildingId :this.$route.query.buildingId
          }
          
          let _this = this;
          this.$http('/backstageBuilding/getPropertyQualificatInfo',{body},{},{},'post').then(function(res){
                        
                if(res.data.code==0){
                    if(_this.sess == "tab-two"){
                        if(res.data.response.stateLandList.length>0){
                            _this.permitPresaleList = res.data.response.stateLandList;
                            if(res.data.response.stateLandList.length >=1){
                                for(let i = 0;i<res.data.response.stateLandList.length;i++){
                                    if(i>= 0 && _this.initUp == true){
                                        _this.initUploader2(i,i);
                                    }
                                }
                            }
                        }
                   }else if(_this.sess == "tab-three"){
                         if(res.data.response.constructLandPlannLicenseList.length>0){
                            _this.permitPresaleList = res.data.response.constructLandPlannLicenseList;
                            if(res.data.response.constructLandPlannLicenseList.length >=1){
                                for(let i = 0;i<res.data.response.constructLandPlannLicenseList.length;i++){
                                    if(i>= 0 && _this.initUp == true){
                                        _this.initUploader2(i,i);
                                    }
                                }
                            }
                        }
                   }else if(_this.sess == "tab-four"){
                        if(res.data.response.constructProjectPlannLicenseList.length>0){
                            _this.permitPresaleList = res.data.response.constructProjectPlannLicenseList;
                             if(res.data.response.constructProjectPlannLicenseList.length >=1){
                                for(let i = 0;i<res.data.response.constructProjectPlannLicenseList.length;i++){
                                    if(i>= 0 &&_this.initUp == true){
                                        _this.initUploader2(i,i);
                                    }
                                }
                            }
                        }
                   }else if(_this.sess == "tab-five"){
                         if(res.data.response.buildConstructPermitsList.length>0){
                            _this.permitPresaleList = res.data.response.buildConstructPermitsList;
                            if(res.data.response.buildConstructPermitsList.length >=1){
                                for(let i = 0;i<res.data.response.buildConstructPermitsList.length;i++){
                                    if(i>= 0 && _this.initUp == true){
                                        _this.initUploader2(i,i);
                                    }
                                }
                                
                            }
                        }
                   }
                    
                }
            }).catch(function(err){
                console.log(err)
            })
      },
      addNewList(){
          this.initUp = false;
          this.permitPresaleList.push(
              {
                    certificateNumber:'',
                    createTime:"",
                    certificateUrl:"",
                    preImgSrc:''
                }
          );
          this.initUploader2(this.permitPresaleList.length-1,'01');
      },
      subCertf(){
          for(let i in this.permitPresaleList){
              if(!this.permitPresaleList[i].certificateNumber || !this.permitPresaleList[i].createTime){
                   this.$message({
                        type: 'info',
                        message: '有必填项未填写！'
                    });
                    return;
              }
          }
          this.subDara2(1);
      },
    subDara2(msg,num){
          let _this = this,
          url = "",
          msg2 = "";
          if(msg == 1){
              msg2 = "提交"
              url = "/backstageBuilding/editPropertyQualificatInfo"
          }else if(msg == 2){
              msg2 = "删除";
              url = "backstageBuilding/delPropertyQualificatInfo";
          }
          
        //   let sess = sessionStorage.getItem("tab-activeName");
           this.$confirm('确定'+msg2+'?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    
                   let body ={};
                   body.buildingId = _this.$route.query.buildingId;
                   if(_this.sess == "tab-two"){
                       body.stateLandList = _this.permitPresaleList;
                        body.stateLandList.forEach((item,index) => {
                            body.stateLandList[index].createTime = _this.fermitTime(body.stateLandList[index].createTime);
                        })
                        if(msg == 2){
                            body.id = _this.permitPresaleList[num].id;
                            body.stateLandList.splice(num,1);
                        }
                   }else if(_this.sess == "tab-three"){
                       body.constructLandPlannLicenseList = _this.permitPresaleList;
                        body.constructLandPlannLicenseList.forEach((item,index) => {
                            body.constructLandPlannLicenseList[index].createTime = _this.fermitTime(body.constructLandPlannLicenseList[index].createTime);
                        })
                        if(msg == 2){
                            body.id = _this.permitPresaleList[num].id;
                            body.constructLandPlannLicenseList.splice(num,1);
                        }
                   }else if(_this.sess == "tab-four"){
                       body.constructProjectPlannLicenseList = _this.permitPresaleList;
                        body.constructProjectPlannLicenseList.forEach((item,index) => {
                            body.constructProjectPlannLicenseList[index].createTime = _this.fermitTime(body.constructProjectPlannLicenseList[index].createTime);
                        })
                        if(msg == 2){
                            body.id = _this.permitPresaleList[num].id;
                            body.constructProjectPlannLicenseList.splice(num,1);
                        }
                   }else if(_this.sess == "tab-five"){
                       body.buildConstructPermitsList = _this.permitPresaleList;
                        body.buildConstructPermitsList.forEach((item,index) => {
                            body.buildConstructPermitsList[index].createTime = _this.fermitTime(body.buildConstructPermitsList[index].createTime);
                        })
                        if(msg == 2){
                            body.id = _this.permitPresaleList[num].id;
                            body.buildConstructPermitsList.splice(num,1);
                        }
                   }

                    _this.$http(url,{body},{},{},'post').then(function(res){
                        
                        if(res.data.code==0){
                            _this.getData();
                            _this.$message({
                                type: 'info',
                                message: msg2+'成功'
                            });
                        }
                    }).catch(function(err){
                        console.log(err)
                    })
                }).catch(() => {
                    _this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
      },
     deleteList(index){
         this.btnList.splice(index,1);
          if(!this.permitPresaleList[index].certificateNumber || !this.permitPresaleList[index].createTime){
                this.permitPresaleList.splice(index,1);
                return;
            }
            
            this.initUp = false;
            // this.initUploader2(this.permitPresaleList.length-2,'01');
          this.subDara2(2,index);
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
    }
}
</script>

<style>

</style>
