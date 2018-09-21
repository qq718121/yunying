<template>
    <div style="padding:0px;">
         <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="预售许可证" name="tab-one" >
                <el-form style="margin-top:30px; border-bottom:1px solid #ccc;width:95%;">
                    <div  v-for="(item,index) in permitPresaleList" :key="index">
                        <el-form-item label="许可证证号" required>
                            <el-input v-model="item.permitName" style="width:50%;" v-if="type == 'edit'"></el-input>
                            <span v-else>{{item.permitName}}</span>
                        </el-form-item>
                        <el-form-item  label="发证时间" required>
                            <el-date-picker type="date"  v-if="type == 'edit'" placeholder="选择日期" v-model="item.createTime" style="width: 300px;"></el-date-picker>
                            <span v-else>{{item.createTime}}</span>
                        </el-form-item>
                        <el-form-item label="绑定楼栋">
                            <el-input v-model="item.building" style="width:50%;" placeholder="绑定楼栋" v-if="type == 'edit'"></el-input>
                            <span v-else>{{item.building}}</span>
                        </el-form-item>
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
                        <div style="margin:10px 0 20px 30px;" v-if="type == 'edit'">
                            <el-button type="text" @click="deleteList(index);">删除</el-button>
                        </div>
                    </div>
                </el-form>
                <div style="margin:20px 0 20px 30%;" v-if="type == 'edit'">
                    <el-button type="primary" @click="addNewList()">添加新证</el-button>
                    <el-button type="primary" style="margin-left:30px;" plain @click="subQuali">提 交</el-button>
                </div>
            </el-tab-pane>
            <el-tab-pane label="国有土地证" name="tab-two">
                <EstateCertificate _activeName="tab-two"/>
            </el-tab-pane>
            <el-tab-pane label="建设用地规划许可证" name="tab-three">
                <EstateCertificate _activeName="tab-three"/>
            </el-tab-pane>
            <el-tab-pane label="建设工程规划许可证" name="tab-four">
                <EstateCertificate _activeName="tab-four"/>
            </el-tab-pane>
            <el-tab-pane label="建筑工程施工许可证" name="tab-five">
                <EstateCertificate _activeName="tab-five"/>
            </el-tab-pane>
        </el-tabs>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImgSrc" alt="">
        </el-dialog>
    </div>
</template>

<script>
import uploader2 from "../../common/uploader2.js";
import ImgUploader2 from "../Common/ImgUploader2/ImgUploader2";
import ImgPreview from '../Common/ImgPreview/ImgPreview'
import EstateCertificate from "./EstateCertificate"
export default {
    name:"",
    components:{
        uploader2,
        ImgUploader2,
        ImgPreview,
        EstateCertificate
    },
    data(){
        return {
            tabLoading: false,
            dialogFormVisible: false,
            viewDialogFormVisible: false,
            isShowDelete: false,
            currentPage: 1,
            btnList: [],
            preImgSrcList: [{preImgSrc: ''}],
            uploaderList: [{uploader: null}],
            dialogVisible: false,
            dialogImgSrc: '',
            type:this.$route.query.type,
            initUp:true,
            activeName:"tab-one",
            permitPresaleList:[
                {
                    permitName:'',
                    createTime:"",
                    building:'',
                    certificateUrl:"",
                    preImgSrc:''
                }
            ]
        }
    },
    created(){
        this.getData();
        this.initUploader(0);
    },
    methods:{
             //初始化上传插件对象
      initUploader(index,num){
        let _this = this,
          btnName = 'parkBtn' + index + num;
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
      addNewList(){
          this.permitPresaleList.push(
              {
                    permitName:'',
                    createTime:"",
                    building:'',
                    certificateUrl:"",
                    preImgSrc:""
                }
          );
          this.initUp = false;
          this.initUploader(this.permitPresaleList.length-1,"a");
      },
  
      handleClick(){
          sessionStorage.setItem("tab-activeName",this.activeName);
      },
      getData(){
          let body = {
              buildingId :this.$route.query.buildingId
          }
          let _this = this;
          this.$http('/backstageBuilding/getPropertyQualificatInfo',{body},{},{},'post').then(function(res){
                        
                if(res.data.code==0){
                    if(res.data.response.permitPresaleList.length>0){
                        _this.permitPresaleList = res.data.response.permitPresaleList;
                        if(res.data.response.permitPresaleList.length >1){
                            for(let i = 0;i<res.data.response.permitPresaleList.length;i++){
                                if(i>= 1 && _this.initUp == true){
                                    _this.initUploader(i,i+2);
                                    
                                }
                            }
                        }
                    }
                }
            }).catch(function(err){
                console.log(err)
            })
      },
      subQuali(){
          for(let i in this.permitPresaleList){
              if(!this.permitPresaleList[i].permitName || !this.permitPresaleList[i].createTime){
                   this.$message({
                        type: 'info',
                        message: '有必填项未填写！'
                    });
                    return;
              }
          }
          let _this = this;
          this.subDara(1);
      },
      subDara(msg,num){
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
           this.$confirm('确定'+msg2+'?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    
                   let body ={};
                   body.buildingId = _this.$route.query.buildingId;
                   body.permitPresaleList = _this.permitPresaleList;
                   body.permitPresaleList.forEach((item,index) => {
                       body.permitPresaleList[index].createTime = _this.fermitTime(body.permitPresaleList[index].createTime);
                   })
                    if(msg == 2){
                        body.id = _this.permitPresaleList[num].id;
                        body.permitPresaleList.splice(num,1);
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
            if(!this.permitPresaleList[index].permitName || !this.permitPresaleList[index].createTime){
                this.permitPresaleList.splice(index,1);
                return;
            }
            this.initUp = false;
          this.subDara(2,index);
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
