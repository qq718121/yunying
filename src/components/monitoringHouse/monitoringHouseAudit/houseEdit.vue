<template>
    <div class="aditAudit">
        <Subnav2 :navList="navList" @refresh="refresh"></Subnav2>
        <div class="adit-EDitInner">
            <el-form ref="form" :model="form">
                <div style="margin-top: 15px;margin-bottom: 10px">照片ID：{{form.picId}}</div>
                <div>图片：</div>
                <div style="width: 400px;height: 300px;position: relative">

                    <HouseAuditList :data="JSON.parse(this.$route.query.data)" :isView="this.$route.query.type!=0" :detailType="JSON.parse(this.$route.query.data).detailType" v-on:tagUpdate="updata" />

                </div>
                <div style="margin-top: 15px;margin-bottom: 10px">
                    <span>当前状态：{{form.picStatus}}</span>
                </div>
                <el-form-item label="标题：" :label-width="formLabelWidth">
                    <el-input type="text" :rows="2" style="width: 400px;" v-if="this.$route.query.type == 0" autosize :maxlength="50" placeholder="请输入 0-50个字" v-model="form.picTitle">
                    </el-input>
                    <div v-else>{{form.picTitle}}</div>
                </el-form-item>
                <el-form-item label="分享内容：" :label-width="formLabelWidth">
                    <el-input type="textarea" style="width: 400px;" :maxlength="150" placeholder="请输入 0-150个字" v-if="this.$route.query.type == 0" v-model="form.shareDesc">
                    </el-input>
                    <div v-else>{{form.shareDesc}}</div>
                </el-form-item>
                <el-form-item label="备注：" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="2" style="width: 300px;" autosize :maxlength="50" placeholder="请输入内容" v-if="this.$route.query.type == 0" v-model="form.remark">
                    </el-input>
                    <div v-else>{{form.remark}}</div>
                </el-form-item>

                <el-form-item label="期数：" :label-width="formLabelWidth">
                    <el-select :clearable="true" v-model="form.houseNumberId" placeholder="请选择期数" v-if="this.$route.query.type==0" @change="getMassifList">
                        <el-option v-for="(item,index) in houseNumberList" :key="index" :label="item.houseNumber" :value="item.houseNumberId">
                        </el-option>
                    </el-select>
                    <div v-else>{{form.houseNumber ? form.houseNumber : ''}}</div>
                </el-form-item>

                 <el-form-item label="地块：" :label-width="formLabelWidth">
                    <el-select :clearable="true" v-model="form.massifId" placeholder="请选择地块" v-if="this.$route.query.type==0">
                        <el-option v-for="item in massifList" :key="item.massifName" :label="item.massifName" :value="item.massifId">
                        </el-option>
                    </el-select>
                    <div v-else>{{form.massifName ? form.massifName : ''}}</div>
                </el-form-item>
                <!--<div style="margin-top: 15px;margin-bottom: 10px">质量问题：{{form.zlwt}}</div>-->
                <!--<div style="margin-top: 15px;margin-bottom: 10px">工程质量定义：{{form.gczl}}</div>-->
                <!--<p style="color: gray;" v-if="this.$route.query.type==0">原照片分类：&#45;&#45;{{form.scoreConfig}}&#45;&#45;</p>-->
                <el-form-item label="照片分类：" v-show="this.$route.query.type == 0" :label-width="formLabelWidth" required>
                    <el-radio-group v-model="filterForm2.menuId" @change="menuIdChange($event,2)">
                        <el-radio v-for="(item,index) in selectList" :key="item.scoreTitle" :value="item.id" :label="item.id">
                            <span> {{item.scoreTitle}}</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-show="filterForm2.menuId!= '' && this.$route.query.type == 0" required>
                    <span v-for="(item,index) in selectList" :key="item.id" style="color:#48576a" v-show="filterForm2.menuId == item.id">
                        {{item.scoreTitle}}：
                    </span>
                    <el-select :clearable="true" size="small" v-model="filterForm2[`menuChildId${index}`]" style="width:150px" v-for="(val,index) in tenSect" @change="menuChildIdChange($event,2,index)">
                        <el-option v-for="item in val" :key="item.id" :label="item.scoreTitle" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="施工区域：" v-if="filterForm2.menuChildId0 === 136 || filterForm2.menuChildId0===4059" v-show="this.$route.query.type == 0" required>
                    <el-select :clearable="true" size="small" v-model="filterForm2.buildingNumber" placeholder="请选择楼号" style="width:150px;">
                        <el-option :label="`${index}号楼`" :value="`${index}号楼`" v-for="index in 200" :key="index"></el-option>
                    </el-select>
                    <el-select :clearable="true" size="small" v-model="filterForm2.unitNumber" placeholder="请选择楼号" style="width:150px;">
                        <el-option label="墙" value="墙"></el-option>
                        <el-option :label="`${index}号楼`" :value="`${index}号楼`" v-for="index in 200" :key="index"></el-option>
                    </el-select>
                </el-form-item> 
                <div v-show="this.$route.query.type != 0" v-if="filterForm2.menuChildId0 === 136 || filterForm2.menuChildId0===4059">
                    <span> {{`施工区域：${filterForm2.buildingNumber}--${filterForm2.unitNumber}`}}</span>
                </div>
                <!--<ComGrap-->
                <!--selectLists="form.selectLists"-->
                <!--v-on:photoL0="checkSelect"-->
                <!--:muid="form.scoreConfigId[0]*1"-->
                <!--:f0="form.scoreConfigId[1]"-->
                <!--:f="form"-->
                <!--:type="1"-->
                <!--status="edit"-->
                <!--v-if="this.$route.query.type == 0"-->
                <!--/>-->
                <div v-if="this.$route.query.type != 0" style="height: 40px;margin-top: 20px">照片类型：{{form.scoreConfig}}</div>
                <!--<el-form-item label="期数：" :label-width="formLabelWidth">-->
                <!--<el-select :clearable="true" v-model="form.stage" placeholder="请选择期数" v-if="this.$route.query.type==0">-->
                <!--<el-option label="一期" :value="一期"></el-option>-->
                <!--<el-option label="二期" :value="二期"></el-option>-->
                <!--<el-option label="三期" :value="三期"></el-option>-->
                <!--<el-option label="四期" :value="四期"></el-option>-->
                <!--<el-option label="五期" :value="五期"></el-option>-->
                <!--<el-option label="六期" :value="六期"></el-option>-->
                <!--<el-option label="七期" :value="七期"></el-option>-->
                <!--<el-option label="八期" :value="八期"></el-option>-->
                <!--<el-option label="九期" :value="九期"></el-option>-->
                <!--<el-option label="十期" :value="十期"></el-option>-->
                <!--</el-select>-->
                <!--<div v-else>{{form.stage}}</div>-->
                <!--</el-form-item>-->
                <div>
                    <el-form-item label="楼幢数：" :label-width="formLabelWidth" v-show="is1 || filterForm2[`menuChildId0`] == 7 ">
                        <el-select :clearable="true" v-model="form.buildingNumber" placeholder="请选择楼幢" v-if="this.$route.query.type==0">
                            <el-option label="自定义楼幢" value="0"></el-option>
                            <el-option :label="`${index}号楼`" :value="`${index}号楼`" v-for="index in 200" :key="index">
                                <span>{{`${index}号楼`}}</span>
                            </el-option>
                        </el-select>
                        <div v-else>{{form.buildingNumber}}</div>
                        <el-input v-show="this[`form`].buildingNumber == 0" style="width:150px;" value="" placeholder="自定义楼幢" v-model="form.buildingNumbers">
                        </el-input>
                    </el-form-item>

                    <el-form-item label="单元号：" :label-width="formLabelWidth" v-if="is1" required>
                        <el-select :clearable="true" v-model="form.unitNumber" placeholder="请选择单元" v-if="this.$route.query.type==0">
                            <el-option :label="`${index}单元`" :value="`${index}单元`" v-for="index in 6" :key="index">
                                <span>{{`${index}单元`}}</span>
                            </el-option>
                        </el-select>
                        <div v-else>{{form.unitNumber}}</div>
                    </el-form-item>
                    <el-form-item label="楼   层：" :label-width="formLabelWidth" v-if="is1" required>
                        <el-select :clearable="true" v-model="form.layerNumber" placeholder="请选择楼层" v-if="this.$route.query.type==0">
                            <el-option label="-1层" value="-1层"></el-option>
                            <el-option label="-2层" value="-2层"></el-option>
                            <el-option label="-3层" value="-3层"></el-option>
                            <el-option :label="`${index}层`" :value="`${index}层`" v-for="index in 50" :key="index">
                                <span>{{`${index}层`}}</span>
                            </el-option>
                        </el-select>
                        <div v-else>{{form.layerNumber}}</div>
                    </el-form-item>
                    <el-form-item label="门牌号：" :label-width="formLabelWidth" v-if="is1 && is2" required>
                        <el-select :clearable="true" v-model="form.house" placeholder="请选择门牌号" v-if="this.$route.query.type==0">
                            <el-option :label="`${index}户`" :value="`${index}户`" v-for="index in 30" :key="index"></el-option>
                        </el-select>
                        <div v-else>{{form.house}}</div>
                    </el-form-item>
                    <el-form-item label="功能分区：" :label-width="formLabelWidth" v-if="is1" required>
                        <el-select :clearable="true" expand-trigger="hover" :options="options" v-model="form.room" v-if="this.$route.query.type == 0 && isPlay">
                            <el-option :label="item.value" :value="item.value" v-for="item in options" :key="item.value"></el-option>
                        </el-select>
                        <el-select :clearable="true" expand-trigger="hover" :options="options1" v-model="form.room" v-else-if="this.$route.query.type == 0 && !isPlay">
                            <el-option :label="item.value" :value="item.value" v-for="item in options1" :key="item.value"></el-option>
                        </el-select>
                        <div v-else>{{form.room}}</div>
                    </el-form-item>
                    <el-form-item label="构件：" :label-width="formLabelWidth" v-if="is1 && is2" required>
                        <el-select :clearable="true" v-model="form.build" placeholder="请选择构件" v-if="this.$route.query.type == 0">
                            <el-option label="墙1" value="墙1"></el-option>
                            <el-option label="墙2" value="墙2"></el-option>
                            <el-option label="墙3" value="墙3"></el-option>
                            <el-option label="墙4" value="墙4"></el-option>
                            <el-option label="墙5" value="墙5"></el-option>
                            <el-option label="墙6" value="墙6"></el-option>
                            <el-option label="墙7" value="墙7"></el-option>
                            <el-option label="墙8" value="墙8"></el-option>
                            <el-option label="墙9" value="墙9"></el-option>
                            <el-option label="墙10" value="墙10"></el-option>
                            <el-option label="梁" value="梁"></el-option>
                            <el-option label="柱" value="柱"></el-option>
                            <el-option label="楼梯" value="楼梯"></el-option>
                            <el-option label="顶板" value="顶板"></el-option>
                            <el-option label="底板" value="底板"></el-option>
                            <el-option label="门" value="门"></el-option>
                            <el-option label="窗" value="窗"></el-option>
                            <el-option label="栏杆" value="栏杆"></el-option>
                        </el-select>
                        <div v-else>{{form.build}}</div>
                    </el-form-item>
                </div>

                <el-form-item label="照片标签：" required :label-width="formLabelWidth">
                    <el-radio-group v-model="form.scoreLable" v-if="this.$route.query.type == 0">
                        <el-radio label="普通照片">
                            <span>普通照片</span>
                        </el-radio>
                        <el-radio label="待整改">
                            <span>待整改</span>
                        </el-radio>
                        <el-radio label="已整改">
                            <span>已整改</span>
                        </el-radio>
                    </el-radio-group>
                    <div v-else>{{form.scoreLable}}</div>
                </el-form-item>

                <div>
                    <div>
                        <span>{{form.emId == 1 ? '上传人:' : '拍照人：'}}{{form.userName}}</span><br/>
                        <!--<span>拍照时间：{{form.createdate}}</span>-->
                        <span>{{form.emId == 1 ? '上传时间：' : '拍照时间：'}}{{form.picTime}}</span>
                    </div>
                    <div style="line-height:40px;">
                        <span>{{ '真实拍照时间：'}}{{form.photoRealTime}}</span>
                    </div>
                    <div style="margin-top: 20px" v-if="this.$route.query.status != 1">
                        <span>审核人：{{form.examine}}</span><br/>
                        <!--<span>拍照时间：{{form.createdate}}</span>-->
                        <span>审核时间：{{form.examineTime}}</span>
                    </div>
                </div>
                <el-form-item style="margin-top: 20px" label="操作：" 
                    v-if="this.$route.query.status == 2 || this.$route.query.status == 1" 
                    v-show="this.$route.query.type ==0" required>
                    <el-radio-group v-model="form.isPass" v-if="this.$route.query.status == 2 && this.$route.query.type != 1">
                        <el-radio label="3">
                            <span>审核通过</span>
                        </el-radio>
                        <el-radio label="4">
                            <span>审核未通过</span>
                        </el-radio>
                    </el-radio-group>
                    <el-radio-group v-model="form.subAudit" v-if="this.$route.query.status == 1 && this.$route.query.type != 1">
                        <el-radio label="2">
                            <span>提交审核</span>
                        </el-radio>
                        <el-radio label="1">
                            <span>暂不提交</span>
                        </el-radio>
                         <el-radio label="4">
                            <span>移入未通过</span>
                        </el-radio>
                    </el-radio-group>
                    <el-select :clearable="true" 
                    v-if="form.isPass == '4' || form.subAudit == 4" 
                    placeholder="选择未通过原因" v-model="form.rejectReason" style="width:250px">
                        <el-option label="阶段缺失照片" value="阶段缺失照片">
                        </el-option>
                        <el-option label="照片模糊" value="照片模糊">
                        </el-option>
                        <el-option label="拍摄结果不完整" value="拍摄结果不完整">
                        </el-option>
                        <el-option label="拍摄角度不对" value="拍摄角度不对">
                        </el-option>
                        <el-option label="其他" value="其他">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div style="margin-top: 20px" v-if="this.$route.query.type != 0 && form.picStatus=='未通过'">
                    未通过原因：{{form.rejectReason}}
                </div>
                <p style="margin-top: 20px;margin-bottom: 20px">注：*字段为编辑操作时必填字段</p>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" v-if="this.$route.query.type == 0">确认</el-button>
                    <el-button @click="backS">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog :visible.sync="outerVisible">
            <div style="overflow: hidden;margin-top: 20px;">
                <div :style='`transform:scale(${scaleX/50},${scaleX/50});position: relative`'>
                    <img style="width:100%" :src="dialogImgSrc" alt="">
                </div>
            </div>
            <!--<div>-->
            <!--<el-button @click="subMitTag">保存编辑</el-button>-->
            <!--<el-button @click="closeDia">取消编辑</el-button>-->
            <!--</div>-->
        </el-dialog>
    </div>
</template>
<script>
import Subnav2 from "../../Subnav2/Subnav2";
import ComGrap from "../../Common/ComGrap/comGrap.vue";
import HouseAuditList from "../../Common/houseAuditList/houseAuditList.vue";
export default {
  data() {
    return {
      navList: [
        { path: "/monitoring/monitoringHouseAudit", name: "首页" },
        { path: "/monitoring/monitoringHouseAudit", name: "监控楼盘审核" },
        { path: this.$route.fullPath, name: this.$route.query.houseName }
      ],
      formLabelWidth: "100px",
      scaleX: 50,
      dialogImgSrc: "",
      outerVisible: false,
      is1: false,
      is2: false,
      viewNum: false,
      isPlay: true,
      selectList: [],
      tenSect: [],
      options1: [
        {
          value: "外墙",
          label: "外墙"
        },
        {
          value: "楼梯",
          label: "楼梯"
        },
        {
          value: "走道",
          label: "走道"
        },
        {
          value: "大厅",
          label: "大厅"
        },
        {
          value: "电梯前室",
          label: "电梯前室"
        },
        {
          value: "水井",
          label: "水井"
        },
        {
          value: "暖井",
          label: "暖井"
        },
        {
          value: "电井",
          label: "电井"
        },
        {
          value: "无障碍通道",
          label: "无障碍通道"
        },
        {
          value: "台阶",
          label: "台阶"
        },
        {
          value: "散水",
          label: "散水"
        },
        {
          value: "屋面",
          label: "屋面"
        },
        {
          value: "露台",
          label: "露台"
        }
      ],
      options: [
        {
          value: "卧室1",
          label: "卧室1"
        },
        {
          value: "卧室2",
          label: "卧室2"
        },
        {
          value: "卧室3",
          label: "卧室3"
        },
        {
          value: "卧室4",
          label: "卧室4"
        },
        {
          value: "卧室5",
          label: "卧室5"
        },
        {
          value: "卧室6",
          label: "卧室6"
        },
        {
          value: "客厅",
          label: "客厅"
        },
        {
          value: "厨房",
          label: "厨房"
        },
        {
          value: "卫生间1",
          label: "卫生间1"
        },
         {
          value: "卫生间2",
          label: "卫生间2"
        },
         {
          value: "卫生间3",
          label: "卫生间3"
        },
        {
          value: "阳台1",
          label: "阳台1"
        },
        {
          value: "阳台2",
          label: "阳台2"
        },
        {
          value: "阳台3",
          label: "阳台3"
        },
        {
          value: "餐厅",
          label: "餐厅"
        },
        {
          value: "玄关",
          label: "玄关"
        }
      ],
      filterForm2: {
        menuId: "",
        menuChildId0: "",
        menuChildId1: "",
        menuChildId2: "",
        menuChildId3: "",
        menuChildId4: "",
        menuChildId5: "",
        menuChildId6: "",
        menuChildId7: "",
        menuChildId8: "",
        menuChildId9: "",
        stage: "",
        buildingNumber: "",
        unitNumber: "",
        layerNumber: "",
        house: "",
        build: "",
        room: "",
        reCameraStatus: ""
      },
      form: {
        picId: "",
        buildingNumber: "",
        unitNumber: "",
        layerNumber: "",
        house: "",
        scoreLable: "",
        build: "",
        rejectReason: "",
        sgate: "",
        selectLists: [],
        buildingNo: "",
        comment: "",
        menuIds: "",
        unitNo: "",
        floorNo: "",
        residentNo: "",
        room: "",
        region: "",
        isPass: "",
        remark: "",
        subAudit: "1",
        wall: "",
        phototag: [],
        auditPharse: "",
        scoreConfig:'',
        scoreConfigId: [],
        reCameraStatus: "",
        picTitle: "",
        shareDesc: "",
        Bdm: 0,
        buildingNumbers: "",
        houseNumber: "",
        houseNumberId: "",
        massifName:"",
        massifId:"",
        room1: "", //户内
        room2: "" //楼栋
      },
      houseNumberList: [],
      massifList:[]
    };
  },
  components: {
    Subnav2,
    ComGrap,
    HouseAuditList
  },
  created() {
    
  },
  mounted() {
    this.getSelectData();
    this.init();
    this.getHouseNumberList();
    this.getMassifList();
  },
  methods: {
    viewImg(src, index) {
      this.dialogImgSrc = src;
      this.outerVisible = true;
    },

    //获取下拉数据
    getSelectData(type) {
      let _this = this,
        body = {};
      body.sourceStatus = "0";
      this.$http(
        "/buildingCamera/getPicClassify",
        { body },
        {},
        {},
        "post"
      ).then(res => {
        if (res.data.code == 0) {
          this.selectList = res.data.response.list;
        }
      });
    },
    initSelect(type, index, len) {
      for (let i = index; i < len; i++) {
        this[`filterForm${type}`][`menuChildId${index}`] = "";
      }
    },
    viewPhotoType() {
      var _this = this;
      if (this.form.scoreConfigId[1] * 1) {
        this.$nextTick(() => {
          _this.filterForm2.menuChildId0 = this.form.scoreConfigId[1] * 1;
          setTimeout(() => {
            _this.viewNum = true;
          }, 1000);
          if (this.form.scoreConfigId[2] * 1) {
            this.$nextTick(() => {
              setTimeout(() => {
                _this.filterForm2.menuChildId1 = this.form.scoreConfigId[2] * 1;
                if (this.form.scoreConfigId[3] * 1) {
                  this.$nextTick(() => {
                    setTimeout(() => {
                      _this.filterForm2.menuChildId2 =
                        this.form.scoreConfigId[3] * 1;
                      if (this.form.scoreConfigId[4] * 1) {
                        this.$nextTick(() => {
                          setTimeout(() => {
                            _this.filterForm2.menuChildId3 =
                              this.form.scoreConfigId[4] * 1;
                            if (this.form.scoreConfigId[5] * 1) {
                              this.$nextTick(() => {
                                setTimeout(() => {
                                  _this.filterForm2.menuChildId4 =
                                    this.form.scoreConfigId[5] * 1;
                                  if (this.form.scoreConfigId[6] * 1) {
                                    this.$nextTick(() => {
                                      setTimeout(() => {
                                        _this.filterForm2.menuChildId5 =
                                          this.form.scoreConfigId[6] * 1;
                                        if (this.form.scoreConfigId[7] * 1) {
                                          this.$nextTick(() => {
                                            setTimeout(() => {
                                              _this.filterForm2.menuChildId6 =
                                                this.form.scoreConfigId[7] * 1;
                                              if (
                                                this.form.scoreConfigId[8] * 1
                                              ) {
                                                this.$nextTick(() => {
                                                  setTimeout(() => {
                                                    _this.filterForm2.menuChildId7 =
                                                      this.form
                                                        .scoreConfigId[8] * 1;
                                                    if (
                                                      this.form
                                                        .scoreConfigId[9] * 1
                                                    ) {
                                                      this.$nextTick(() => {
                                                        setTimeout(() => {
                                                          _this.filterForm2.menuChildId8 =
                                                            this.form
                                                              .scoreConfigId[9] *
                                                            1;
                                                        }, 200);
                                                      });
                                                    }
                                                  }, 200);
                                                });
                                              }
                                            }, 200);
                                          });
                                        }
                                      }, 200);
                                    });
                                  }
                                }, 200);
                              });
                            }
                          }, 200);
                        });
                      }
                    }, 200);
                  });
                }
              }, 200);
            });
          }
        });
      }
    },
    //menuId 改变
    menuIdChange(menuId, type) {
      let _this = this,
        body = { pid: menuId };
      if (this.viewNum) {
        // _this.form.unitNumber = '';
        // _this.filterForm2.unitNumber = '';
        // _this.filterForm2.buildingNumber = '';
        // _this.form.buildingNumber = '';
        // if (menuId == 3 || menuId == 4) {
        // if (menuId != JSON.parse(this.$route.query.data).scoreConfigId[0] * 1) {
        //   _this.form.room = '';
        // } else {
        //   _this.form.room = JSON.parse(this.$route.query.data).room;
        // }
        // }
      }
      this.initSelect(type, 0, 10);
      this.tenSect.length = 0;
      this.$http(
        "/buildingCamera/getPicClassify",
        { body },
        {},
        {},
        "post"
      ).then(res => {
        if (res.data.code == 0) {
          _this.tenSect.push(res.data.response.list);
          if (!this.viewNum) {
            _this.viewPhotoType();
          } else {
            for (let i = 0; i < 10; i++) {
              if (this.filterForm2[`menuChildId${i}`]) {
                this.filterForm2[`menuChildId${i}`] = "";
              }
            }
          }
          if (menuId == "1" || menuId == "2") {
            this.is1 = false;
            this.isplay = true;
          } else {
            this.is1 = true;
            this.is2 = true;
          }
        }
      });
    },
    is(menuChildId) {
      if (menuChildId == 136 || menuChildId == 4059) {
        this.is1 = false;
      } else if (menuChildId == 135 || menuChildId == 4058) {
        this.is1 = true;
        this.is2 = false;
      } else if (menuChildId == 134 || menuChildId == 4057) {
        this.is1 = true;
        this.is2 = true;
      }
      if (menuChildId == 134 || menuChildId == 4057) {
        this.isPlay = true;
        // this.form.room = JSON.parse(this.$route.query.data).room;
      } else {
        this.isPlay = false;
        // this.form.room = "";
      }
    },
    updata() {},
    //显示输入楼幢号
    // bdmShow(){
    //   console.log(this[`form`].buildingNumber);
    //   if(this[`form`].buildingNumber == 0){
    //     this[`form`].Bdm = 1;
    //   }else{
    //     this[`form`].Bdm = 0;
    //   }
    // },

    //menuChildId 改变
    menuChildIdChange(menuChildId, type, index) {
      let _this = this,
        body = { pid: menuChildId };
      if (
        menuChildId == 135 ||
        menuChildId == 136 ||
        menuChildId == 134 ||
        menuChildId == 4057 ||
        menuChildId == 4058 ||
        menuChildId == 4059
      ) {
        if (this.viewNum) {
          //            _this.form.unitNumber = '';
          // _this.filterForm2.unitNumber = '';
          // _this.filterForm2.buildingNumber = '';
          // _this.form.buildingNumber = '';
          if (menuChildId == 136 || menuChildId == 4059) {
            _this.filterForm2.unitNumber = "";
          }
        }
        if (menuChildId != _this.form.scoreConfigId[1] * 1) {
          for (let i = 1; i < 10; i++) {
            this.filterForm2[`menuChildId${i}`] = "";
          }
        }
      }
      // console.log(menuChildId,_this.form.scoreConfigId[1]);
      if (
        menuChildId == 135 ||
        menuChildId == 136 ||
        menuChildId == 134 ||
        menuChildId == 4057 ||
        menuChildId == 4058 ||
        menuChildId == 4059
      ) {
        if (menuChildId != _this.form.scoreConfigId[1] * 1) {
          _this.form.room = "";
        } else {
          _this.form.room = JSON.parse(this.$route.query.data).room;
        }
      }

      if (
        (_this.form.scoreConfigId[1] * 1 == 134 && menuChildId == 4057) ||
        (_this.form.scoreConfigId[1] * 1 == 4057 && menuChildId == 134)
      ) {
        _this.form.room = JSON.parse(this.$route.query.data).room;
      }

      if (
        (_this.form.scoreConfigId[1] * 1 == 135 && menuChildId == 4058) ||
        (_this.form.scoreConfigId[1] * 1 == 4058 && menuChildId == 135)
      ) {
        _this.form.room = JSON.parse(this.$route.query.data).room;
      }

      _this.is(_this.filterForm2[`menuChildId0`]);
      _this.initSelect(type, index + 1, 10);
      if (_this.tenSect.length - 1 > index) {
        _this.tenSect.splice(index + 1, _this.tenSect.length);
      }
      this.$http(
        "/buildingCamera/getPicClassify",
        { body },
        {},
        {},
        "post"
      ).then(res => {
        if (res.data.code == 0) {
          if (res.data.response.list.length > 0) {
            _this.tenSect.push(res.data.response.list);
          }
          _this.inits();
        }
      });
    },
    inits() {
      //        this.filterForm2.stage = '';
      //        this.filterForm2.buildingNumber = '';
      //        this.filterForm2.unitNumber = '';
      //        this.filterForm2.layerNumber = '';
      //        this.filterForm2.house = '';
      //        this.filterForm2.build = '';
      //        this.filterForm2.room = ''
    },

    init() {
      this.form = JSON.parse(this.$route.query.data);
      this.form.scoreConfigId = this.form.scoreConfigId.split(",");
      this.filterForm2.menuId =
        JSON.parse(this.$route.query.data).scoreConfigId[0] * 1;
      this.filterForm2.stage = JSON.parse(this.$route.query.data).stage;
      this.filterForm2.buildingNumber = JSON.parse(
        this.$route.query.data
      ).buildingNumber;
      this.filterForm2.unitNumber = JSON.parse(
        this.$route.query.data
      ).unitNumber;
      this.filterForm2.layerNumber = JSON.parse(
        this.$route.query.data
      ).layerNumber;
      this.filterForm2.house = JSON.parse(this.$route.query.data).house;
      this.filterForm2.build = JSON.parse(this.$route.query.data).build;
      this.filterForm2.reCameraStatus = JSON.parse(
        this.$route.query.data
      ).reCameraStatus;
    },
    backS() {
      this.$router.push({
        path: this.$route.query.path,
        query: {
          activeName: this.$route.query.activeName,
          type: this.$route.query.status,
          page: this.$route.query.page * 1
        }
      });
    },

    checkSelect(data) {
      var arr = [];
      if (data[`menuChildId${0}`] == 136 || data[`menuChildId${0}`] == 4059) {
        this.isarea = false;
      } else {
        this.isarea = true;
      }
      arr.push(data.menuId);
      for (let i = 0; i < 10; i++) {
        if (data[`menuChildId${i}`] != "") {
          arr.push(data[`menuChildId${i}`]);
        }
      }
      this[`form`].scoreConfigId = arr.slice(",").join(",");
    },
    onSubmit() {
        if (this[`form`].buildingNumber == 0 || this[`form`].buildingNumber == "") {
            this[`form`].buildingNumber = this[`form`].buildingNumbers;
          }
      if (!this[`filterForm2`][`menuChildId${this.tenSect.length - 1}`]) {
        this.$message({
          type: "error",
          message: "有必填项未填写!"
        });
        return;
      }
    try {
      } catch (e) {
        this.$message({
          type: "error",
          message: "有必填项未填写!"
        });
        return;
      }
      if (this.form.picStatus == "待提交") {
        if (!this.form.subAudit) {
          this.$message({
            type: "error",
            message: "有必填项未填写!"
          });
          return;
        }
        if(this.form.subAudit == "4"){
            if (!this.form.rejectReason) {
                this.$message({
                type: "error",
                message: "有必填项未填写!"
                });
                return;
            }
        }
      } else if (this.form.picStatus == "待审核") {
        if (this.form.isPass == "4") {
          if (!this.form.rejectReason) {
            this.$message({
              type: "error",
              message: "有必填项未填写!"
            });
            return;
          }
        } else if (this.form.isPass != "3") {
          this.$message({
            type: "error",
            message: "有必填项未填写!"
          });
          return;
        }
      }

      if (
        this[`filterForm2`][`menuChildId0`] == 136 ||
        this[`filterForm2`][`menuChildId0`] == 4059
      ) {
        if (!this.filterForm2.buildingNumber || !this.filterForm2.unitNumber) {
          this.$message({
            type: "error",
            message: "有必填项未填写!"
          });
          return;
        }
      } else if (
        this[`filterForm2`][`menuChildId0`] == 135 ||
        this[`filterForm2`][`menuChildId0`] == 4058
      ) {
        if (
          !this.form.unitNumber ||
          !this.form.buildingNumber ||
          !this.form.layerNumber ||
          !this.form.room
        ) {
          this.$message({
            type: "error",
            message: "有必填项未填写!"
          });
          return;
        }
      } else if (
        this[`filterForm2`][`menuChildId0`] == 134 ||
        this[`filterForm2`][`menuChildId0`] == 4057
      ) {
        if (
          !this.form.unitNumber ||
          !this.form.buildingNumber ||
          !this.form.layerNumber ||
          !this.form.house ||
          !this.form.room ||
          !this.form.build
        ) {
          this.$message({
            type: "error",
            message: "有必填项未填写!"
          });
          return;
        }
      }
      this.$confirm("确认提交吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let [_this, body] = [this, _.cloneDeep(this.form)];
          var arr = [];
          arr.push(this.filterForm2.menuId);
          for (let i = 0; i < 10; i++) {
            if (this.filterForm2[`menuChildId${i}`]) {
              arr.push(this.filterForm2[`menuChildId${i}`]);
            }
          }
          body.scoreConfigId = arr.slice(",").join(",");
          //          body.build = this.filterForm2.build;

          //          body.house = this.filterForm2.house;
          //          body.layerNumber = this.filterForm2.layerNumber;
          body.buildingNumber = _this.form.buildingNumber;
          if (
            arr[1] == 135 ||
            arr[1] == 134 ||
            arr[1] == 4057 ||
            arr[1] == 4058
          ) {
            body.unitNumber = _this.form.unitNumber;
            body.buildingNumber = _this.form.buildingNumber;
          } else {
            body.unitNumber = _this.filterForm2.unitNumber;
            body.buildingNumber = _this.filterForm2.buildingNumber;
          }
          if (this.$route.query.status == 1 || this.$route.query.status == 3) {
            body.isPass = "";
          }
         
          if (this.filterForm2[`menuChildId0`] == 7) {
            body.buildingNumber = this.form.buildingNumber;
          }
           if (this[`form`].buildingNumber == 0 || this[`form`].buildingNumber == "") {
            body.buildingNumber = this[`form`].buildingNumbers;
          }
          body.area = "";
          this.$http(
            "/buildingCamera/updateAPPPicInfo",
            { body },
            {},
            {},
            "post"
          ).then(res => {
            if (res.data.code == 0) {
              this.$message({
                type: "success",
                message: "提交成功!"
              });
              this.backS();
            }
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    getHouseNumberList() {
      let _this = this;
          let body = {};
         let datas =  JSON.parse(this.$route.query.data);
          body.buildingId = datas.buildingId;
          body.houseNumberId = this.form.houseNumberId;
      this.$http("/buildingCamera/getHouseNumberAndSysMassif", {body}, {}, {}, "post")
        .then(res => {
          if (res.data.code == 0) {
            let response = res.data.response;
            _this.houseNumberList = response.list;
            if(response.massifList.length > 0){
                _this.massifList = response.massifList;
            }
          } else if (res.data.code == 300) {
            _this.$router.push("/login");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMassifList(){
        this.getHouseNumberList();
    },
    //刷新方法
    refresh() {}
  },
};
</script>
<style scoped>
div {
  font-size: 14px;
  color: #48576a;
}

.adit-EDitInner {
  padding-left: 50px;
}

.img-container {
  position: relative;
  cursor: pointer;
  margin-top: 20px;
  height: 180px;
  padding-top: 100px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.img-container:hover .wap {
  display: block;
}

.img-container .wap {
  z-index: 2;
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  line-height: 180px;
  display: none;
}

.img-container .wap .ico {
  color: #fff;
}

.video-in {
  position: relative;
}
</style>
