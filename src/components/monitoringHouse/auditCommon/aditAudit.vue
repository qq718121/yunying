<template>
  <div class="aditAudit">
    <Subnav2 :navList="navList" @refresh="refresh"></Subnav2>
    <div class="adit-EDitInner">
      <el-form ref="form" :model="form" :rules="rules">
        <div style="margin-top: 15px;margin-bottom: 10px">照片ID：{{form.id}}</div>
        <div>图片：</div>
        <div style="width: 400px;position: relative">
          <div class="img-container" :style="{backgroundImage:'url('+form.photourl+')'}">
            <div class="wap">
              <i class="el-icon-view ico" @click="viewImg(form.photourl)"></i>
            </div>
          </div>
        </div>
        <div style="margin-top: 15px;margin-bottom: 10px">
          当前状态：{{this.$route.query.status == 1 ? '待审核' : this.$route.query.status == 2 ? '已审核' : '未通过'}}


        </div>
        <!--<div style="margin-top: 15px;margin-bottom: 10px">质量问题：{{form.zlwt}}</div>-->
        <!--<div style="margin-top: 15px;margin-bottom: 10px">工程质量定义：{{form.gczl}}</div>-->

        <!--<p style="color: gray;" v-if="this.$route.query.type==0">原照片分类：&#45;&#45;{{form.scoreTitle}}&#45;&#45;</p>-->
        <!--<ComGrap-->
        <!--selectLists="form.selectLists"-->
        <!--v-on:photoL0="checkSelect"-->
        <!--:f="form"-->
        <!--:type="1"-->
        <!--v-if="this.$route.query.type==0"-->
        <!--/>-->
        <el-form-item label="照片分类：" required v-show="this.$route.query.type == 0">
          <el-radio-group v-model="filterForm2.menuId" @change="menuIdChange($event,2)">
            <el-radio
              v-for="(item,index) in selectList"
              :key="item.scoreTitle"
              :value="item.id"
              :label="item.id">
              <span> {{item.scoreTitle}}</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="filterForm2.menuId!= '' && this.$route.query.type == 0">
                  <span
                    v-for="(item,index) in selectList"
                    :key="item.id"
                    style="color:#48576a"
                    v-show="filterForm2.menuId == item.id">
                    {{item.scoreTitle}}：
                  </span>
          <el-select
            size="small"
            v-model="filterForm2[`menuChildId${index}`]"
            style="width:150px"
            v-for="(val,index) in tenSect"
            @change="menuChildIdChange($event,2,index)">
            <el-option
              v-for="(item,index) in val"
              :key="item.scoreTitle"
              :label="item.scoreTitle"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="施工区域：" required v-if="filterForm2.menuChildId0 === 136 || filterForm2.menuChildId0===4059"
                      v-show="this.$route.query.type == 0">
          <el-select size="small" v-model="filterForm2.buildingNo" placeholder="请选择楼号" style="width:150px;"
          >
            <el-option :label="`${index}号楼`" :value="index" v-for="index in 200" :key="index"></el-option>
          </el-select>
          <el-select size="small" v-model="filterForm2.unitNo" placeholder="请选择楼号" style="width:150px;"
          >
            <el-option label="墙" :value="0"></el-option>
            <el-option :label="`${index}号楼`" :value="index" v-for="index in 200" :key="index"></el-option>
          </el-select>

        </el-form-item>
        <div v-if="this.$route.query.type != 0 && filterForm2.menuChildId0 === 136 || this.$route.query.type != 0 && filterForm2.menuChildId0===4059">
          <span>{{`施工区域：${filterForm2.buildingNo+'号楼'}--${filterForm2.unitNo == 0 ? '墙' : filterForm2.unitNo+'号楼'}`}}</span>
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
        <div v-if="this.$route.query.type != 0" style="height: 35px;">照片类型：{{form.scoreTitle}}</div>
        <!--<div v-else style="height: 50px;">照片类型：{{form.scoreTitle}}</div>-->
        <div v-if="is1">
          <el-form-item label="期数：" :label-width="formLabelWidth" required>
            <el-select v-model="form.stage" placeholder="请选择期数" v-if="this.$route.query.type==0">
              <el-option label="一期" :value="1"></el-option>
              <el-option label="二期" :value="2"></el-option>
              <el-option label="三期" :value="3"></el-option>
              <el-option label="四期" :value="4"></el-option>
              <el-option label="五期" :value="5"></el-option>
              <el-option label="六期" :value="6"></el-option>
              <el-option label="七期" :value="7"></el-option>
              <el-option label="八期" :value="8"></el-option>
              <el-option label="九期" :value="9"></el-option>
              <el-option label="十期" :value="10"></el-option>
            </el-select>
            <div v-else>{{form.stage?form.stage+'期':''}}</div>
          </el-form-item>
          <el-form-item label="楼栋号：" :label-width="formLabelWidth" v-if="is1" required>
            <el-select v-model="form.buildingNo" placeholder="请选择楼栋" v-if="this.$route.query.type==0">
              <el-option :label="`${index}号楼`" :value="index" v-for="index in 200" :key="index">
                <span>{{`${index}号楼`}}</span>
              </el-option>
            </el-select>
            <div v-else>{{form.buildingNo?form.buildingNo+'号楼':''}}</div>
          </el-form-item>
          <el-form-item label="单元号：" :label-width="formLabelWidth" v-if="is1" required>
            <el-select v-model="form.unitNo" placeholder="请选择单元" v-if="this.$route.query.type==0">
              <el-option :label="`${index}单元`" :value="index" v-for="index in 6" :key="index">
                <span>{{`${index}单元`}}</span>

              </el-option>
            </el-select>
            <div v-else>{{form.unitNo?form.unitNo+'单元':''}}</div>
          </el-form-item>
          <el-form-item label="楼   层：" :label-width="formLabelWidth" v-if="is1" required>
            <el-select v-model="form.floorNo" placeholder="请选择楼层" v-if="this.$route.query.type==0">
              <el-option label="-1层" value="-1"></el-option>
              <el-option label="-2层" value="-2"></el-option>
              <el-option label="-3层" value="-3"></el-option>
              <el-option :label="`${index}层`" :value="index" v-for="index in 50" :key="index">
                <span>{{`${index}层`}}</span>
              </el-option>
            </el-select>
            <div v-else>{{form.floorNo?form.floorNo+'层':''}}</div>
          </el-form-item>
          <el-form-item label="门牌号：" :label-width="formLabelWidth" v-if="is1 && is2" required>
            <el-select v-model="form.residentNo" placeholder="请选择门牌号" v-if="this.$route.query.type==0">
              <el-option :label="`${index}户`" :value="index" v-for="index in 30" :key="index"></el-option>
            </el-select>
            <div v-else>{{form.residentNo?form.residentNo+'户':''}}</div>
          </el-form-item>
          <el-form-item label="功能分区：" :label-width="formLabelWidth" v-if="is1" required>
            <el-select
              expand-trigger="hover"
              :options="options"
              v-model="form.room"
              v-if="this.$route.query.type == 0 && isPlay"
            >
              <el-option :label="item.value" :value="item.value" v-for="item in options" :key="item.value"></el-option>
            </el-select>
            <el-select
              expand-trigger="hover"
              :options="options1"
              v-model="form.room"
              v-else-if="this.$route.query.type == 0 && !isPlay"
            >
              <el-option :label="item.value" :value="item.value" v-for="item in options1" :key="item.value"></el-option>
            </el-select>
            <div v-else>{{form.room}}</div>
          </el-form-item>
          <el-form-item label="构件：" :label-width="formLabelWidth" v-if="is1 && is2" required>
            <el-select v-model="form.wall" placeholder="请选择构件" v-if="this.$route.query.type == 0">
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
            <div v-else>{{form.wall}}</div>
          </el-form-item>
        </div>
        <el-form-item label="照片标签" required>
          <el-radio-group v-model="form.phototag" v-if="this.$route.query.type == 0">
            <el-radio
              :label="0">
              <span>普通照片</span>
            </el-radio>
            <el-radio
              :label="1">
              <span>待整改</span>
            </el-radio>
            <el-radio
              :label="2">
              <span>已整改</span>
            </el-radio>
          </el-radio-group>
          <div v-else>{{form.phototag == 0 ? '普通照片' : form.phototag == 1 ? '待整改' : '已整改'}}</div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :rows="2"
            style="width: 300px;"
            autosize
            placeholder="请输入内容"
            v-if="this.$route.query.type == 0"
            v-model="form.comment">
          </el-input>
          <div v-else>{{form.comment}}</div>
        </el-form-item>
        <div>
          <span v-if="form.formalism == 0">拍照人：{{form.photographer}}</span>
          <span v-else="form.formalism == 1">上传人：{{form.uploadUserName}}</span>
          <!--<span>拍照时间：{{form.createdate}}</span>-->
          <span v-if="form.formalism == 0">拍照时间：{{form.photoTime}}</span>
          <span v-else="form.formalism == 1">上传时间: {{form.createdate}}</span>
          <div style="margin-top: 20px" v-if="this.$route.query.status != 1">
            <span>审核人：{{form.auditUserName}}</span>
            <!--<span>拍照时间：{{form.createdate}}</span>-->
            <span>审核时间：{{form.auditTime}}</span>
          </div>
        </div>
        <el-form-item label="操作" v-if="this.$route.query.status == 1 && this.$route.query.type != 1" required>
          <el-radio-group v-model="form.auditPharse">
            <el-radio
              label="5">
              <span>审核通过</span>
            </el-radio>
            <el-radio
              label="6">
              <span>审核未通过</span>
            </el-radio>
          </el-radio-group>
          <el-select
            v-if="form.auditPharse == '6'"
            clearable
            placeholder="选择未通过原因"
            v-model="form.region"
            style="width:250px">
            <el-option
              label="阶段缺失照片"
              value="阶段缺失照片">
            </el-option>
            <el-option
              label="照片模糊"
              value="照片模糊">
            </el-option>
            <el-option
              label="拍摄结果不完整"
              value="拍摄结果不完整">
            </el-option>
            <el-option
              label="拍摄角度不对"
              value="拍摄角度不对">
            </el-option>
            <el-option
              label="其他"
              value="其他">
            </el-option>
          </el-select>
        </el-form-item>
        <div style="margin-top: 20px" v-if="this.$route.query.type == 1" v-show="this.$route.query.status == 3">未通过原因：{{form.region}}</div>
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
  import Subnav2 from '../../Subnav2/Subnav2'
  import ComGrap from '../../Common/ComGrap/comGrap.vue'
  export default {
    data(){
      return {
        navList: [
          {path: '/unopened/estateunopenedexamine', name: '首页'},
          {path: '/monitoring/monitoringHistoricPhotos', name: '历史楼盘'},
          {path: this.$route.fullPath, name: this.$route.query.houseName}
        ],
        formLabelWidth: '300',
        scaleX: 50,
        dialogImgSrc: '',
        is1: false,
        is2: false,
        isPlay: true,
        outerVisible: false,
        selectList: [],
        tenSect: [],
        options1: [
          {
            value: '外墙',
            label: '外墙'
          },
          {
            value: '楼梯',
            label: '楼梯'
          }, {
            value: '走道',
            label: '走道'
          }, {
            value: '大厅',
            label: '大厅'
          }, {
            value: '电梯前室',
            label: '电梯前室'
          }, {
            value: '水井',
            label: '水井'
          }, {
            value: '暖井',
            label: '暖井'
          }, {
            value: '电井',
            label: '电井'
          }, {
            value: '无障碍通道',
            label: '无障碍通道'
          }, {
            value: '台阶',
            label: '台阶'
          }, {
            value: '散水',
            label: '散水'
          }, {
            value: '屋面',
            label: '屋面'
          }, {
            value: '露台',
            label: '露台'
          }],
        options: [
          {
            value: '卧室1',
            label: '卧室1',
          },
          {
            value: '卧室2',
            label: '卧室2',
          },
          {
            value: '卧室3',
            label: '卧室3',
          },
          {
            value: '卧室4',
            label: '卧室4',
          },
          {
            value: '卧室5',
            label: '卧室5',
          },
          {
            value: '卧室6',
            label: '卧室6'
          },
          {
            value: '客厅',
            label: '客厅',
          },
          {
            value: '厨房',
            label: '厨房',
          },
          {
            value: '卫生间1',
            label: '卫生间1',
          },
           {
            value: '卫生间2',
            label: '卫生间2',
          },
           {
            value: '卫生间3',
            label: '卫生间3',
          },
          {
            value: '阳台1',
            label: '阳台1',
          },
          {
            value: '阳台2',
            label: '阳台2',
          },
          {
            value: '阳台3',
            label: '阳台3',
          },
          {
            value: '餐厅',
            label: '餐厅',
          },
          {
            value: '玄关',
            label: '玄关',
          }
        ],
        rules: {},
        form: {
          hids: '',
          pids: '',
          sgate: '',
          selectLists: [],
          buildingNo: '',
          comment: '',
          menuIds: '',
          unitNo: '',
          floorNo: '',
          residentNo: '',
          room: '',
          region: '',
          wall: '',
          phototag: [],
          auditPharse: '',
          aaa: null,
          bbb: null,
          ccc: null,
          ddd: null,
          eee: null,
          fff: null,
          ggg: null,
          hhh: null,
          iii: null,
          jjj: null
        },
        filterForm2: {
          menuId: '',
          menuChildId0: '',
          menuChildId1: '',
          menuChildId2: '',
          menuChildId3: '',
          menuChildId4: '',
          menuChildId5: '',
          menuChildId6: '',
          menuChildId7: '',
          menuChildId8: '',
          menuChildId9: '',
          stage: '',
          buildingNo: '',
          unitNo: '',
          layerNo: '',
          house: '',
          build: '',
          room: ''
        },
      }
    },
    components: {
      Subnav2,
      ComGrap
    },
    created(){
      console.log(this.$route.query.status);

    },
    mounted(){
      this.getSelectData();
      this.init();
    },
    methods: {
      viewImg(src, index){
        this.dialogImgSrc = src;
        this.outerVisible = true;
      },
      viewPhotoType(){
        var _this = this;
        if (this.form.bbb) {
          this.$nextTick(() => {
            _this.filterForm2.menuChildId0 = this.form.bbb;
            setTimeout(() => {
              _this.viewNum = true;
            }, 1000);
            if (this.form.ccc) {
              this.$nextTick(() => {
                setTimeout(() => {
                  _this.filterForm2.menuChildId1 = this.form.ccc;
                  if (this.form.ddd) {
                    this.$nextTick(() => {
                      setTimeout(() => {
                        _this.filterForm2.menuChildId2 = this.form.ddd;
                        if (this.form.eee) {
                          this.$nextTick(() => {
                            setTimeout(() => {
                              _this.filterForm2.menuChildId3 = this.form.eee;
                              if (this.form.fff) {
                                this.$nextTick(() => {
                                  setTimeout(() => {
                                    _this.filterForm2.menuChildId4 = this.form.fff;
                                    if (this.form.ggg) {
                                      this.$nextTick(() => {
                                        setTimeout(() => {
                                          _this.filterForm2.menuChildId5 = this.form.ggg;
                                          if (this.form.hhh) {
                                            this.$nextTick(() => {
                                              setTimeout(() => {
                                                _this.filterForm2.menuChildId6 = this.form.hhh;
                                                if (this.form.iii) {
                                                  this.$nextTick(() => {
                                                    setTimeout(() => {
                                                      _this.filterForm2.menuChildId7 = this.form.iii;
                                                      if (this.form.jjj) {
                                                        this.$nextTick(() => {
                                                          setTimeout(() => {
                                                            _this.filterForm2.menuChildId8 = this.form.jjj;
                                                          }, 200)
                                                        });
                                                      }
                                                    }, 200)
                                                  });
                                                }
                                              }, 200)
                                            });
                                          }
                                        }, 200)
                                      });
                                    }
                                  }, 200)
                                });
                              }
                            }, 200)
                          });
                        }
                      }, 200)
                    });
                  }
                }, 200)
              });
            }
          });
        }
      },
      //menuId 改变
      menuIdChange(menuId, type){
        let _this = this, body = {pid: menuId};
        if (this.viewNum) {
          // _this.form.unitNo = '';
          // _this.filterForm2.unitNo = '';
          // _this.filterForm2.buildingNo = '';
          // _this.form.buildingNo = '';
          for (let i = 1; i < 10; i++) {
            this.filterForm2[`menuChildId${i}`] = '';
          }
          // this.form.sgate = '';
          // this.form.stage = '';
          // this.form.buildingNo = '';
          // this.form.unitNo = '';
          // this.form.floorNo = '';
          // this.form.residentNo = '';
          // this.form.room = '';
          // this.form.wall = '';
          // this.form.phototag = '';
       if (menuId == 3 || menuId == 4) {
          if (menuId != _this.form.aaa) {
            _this.form.room = '';
          } else {
            _this.form.room = JSON.parse(this.$route.query.data).room;
          }
        }
        }
        this.initSelect(type, 0, 10);
        this.tenSect.length = 0;
        this.$http('/buildingCamera/getPicClassify', {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            _this.tenSect.push(res.data.response.list);
            if (!this.viewNum) {
              _this.viewPhotoType();
            } else {
              for (let i = 0; i < 10; i++) {
                if (this.filterForm2[`menuChildId${i}`]) {
                  this.filterForm2[`menuChildId${i}`] = '';
                }
              }
            }
//            this.$nextTick(() => {
//              if (this.filterForm2[`menuChildId0`] == '') {
//                //一级变动给个默认值
//                _this.filterForm2.menuChildId0 = _this.tenSect[0][0].id;
//              }
//            });

            if (menuId == '1' || menuId == '2') {
              this.is1 = false;
            } else {
              this.is1 = true;
              this.is2 = true;
            }
          }
        })
      },
      is(menuChildId){

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
        } else {
          this.isPlay = false;
        }
      },
      //menuChildId 改变
      menuChildIdChange(menuChildId, type, index){
        let _this = this, body = {pid: menuChildId};
        if (menuChildId == 135 || menuChildId == 136 || menuChildId == 134 || menuChildId == 4057 || menuChildId == 4058 || menuChildId == 4059) {
          if (this.viewNum) {
            _this.form.unitNo = '';
            _this.filterForm2.unitNo = '';
            _this.filterForm2.buildingNo = '';
            _this.form.buildingNo = '';

            // this.form.sgate = '';
            // this.form.buildingNo = '';
            // this.form.unitNo = '';
            // this.form.floorNo = '';
            // this.form.residentNo = '';
            // this.form.room = '';
            // this.form.wall = '';
            // this.form.phototag = '';
            // this.filterForm2.buildingNo = '';
            // this.filterForm2.unitNo = '';
            // this.form.stage = '';
          }
          if (menuChildId != _this.form.bbb * 1) {
            for (let i = 1; i < 10; i++) {
              this.filterForm2[`menuChildId${i}`] = '';
            }
          }
        }
        if (menuChildId == 135 || menuChildId == 136 || menuChildId == 134) {
          if (menuChildId != _this.form.bbb) {
            _this.form.room = '';
          } else {
            _this.form.room = JSON.parse(this.$route.query.data).room;
          }
        }

        _this.is(_this.filterForm2[`menuChildId0`]);
        _this.initSelect(type, index + 1, 10);
        if (_this.tenSect.length - 1 > index) {
          _this.tenSect.splice(index + 1, _this.tenSect.length);
        }
        this.$http('/buildingCamera/getPicClassify', {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            if (res.data.response.list.length > 0) {
              _this.tenSect.push(res.data.response.list);
            }
          }
        });
      },
      inits(){
//        this.filterForm2.stage = '';
//        this.filterForm2.buildingNumber = '';
//        this.filterForm2.unitNumber = '';
//        this.filterForm2.layerNumber = '';
//        this.filterForm2.house = '';
//        this.filterForm2.build = '';
//        this.filterForm2.room = ''
      },
      init(){
        this.form = JSON.parse(this.$route.query.data);
        this.filterForm2.menuId = this.form.aaa * 1;
        this.filterForm2.stage = this.form.stage;
        this.filterForm2.buildingNo = this.form.buildingNo;
        this.filterForm2.unitNo = this.form.unitNo;
        this.filterForm2.layerNo = this.form.layerNo;
        this.filterForm2.house = this.form.house;
        this.filterForm2.build = this.form.build;
      },
      //获取下拉数据
      getSelectData(type){
        let _this = this,
          body = {};
        body.sourceStatus = '0';
        this.$http('/buildingCamera/getPicClassify', {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            this.selectList = res.data.response.list;
          }
        })
      },
      initSelect(type, index, len){
        for (let i = index; i < len; i++) {
          this[`filterForm${type}`][`menuChildId${index}`] = '';
        }
      },
      backS(){
        this.$router.push({
          path: this.$route.query.path,
          query: {
            type: this.$route.query.status,
            activeName: this.$route.query.activeName,
            page: this.$route.query.page * 1
          }
        })
      },

      onSubmit(){
        if (this.$route.query.status == 1) {
          if (this.form.auditPharse == '6') {
            if (!this.form.region) {
              this.$message({
                type: 'error',
                message: '有必填项未填写!3'
              });
              return;
            }
          } else if (!this.form.auditPharse) {
            this.$message({
              type: 'error',
              message: '有必填项未填写!4'
            });
            return;
          }else if(this.form.auditPharse == '5'){

            if (!this[`filterForm2`][`menuChildId${this.tenSect.length - 1}`]) {
              this.$message({
                type: 'error',
                message: '有必填项未填写!1'
              });
              return;
            }
            try {
              console.log(this.form.phototag.length,9);
            }
            catch (e) {
              this.$message({
                type: 'error',
                message: '有必填项未填写!2'
              });
              return;
            }

            if (this[`filterForm2`][`menuChildId0`] == 136 || this[`filterForm2`][`menuChildId0`] == 4059) {
                console.log(!this.filterForm2.buildingNo,typeof this.filterForm2.unitNo);
              if (!this.filterForm2.buildingNo || typeof this.filterForm2.unitNo != 'number') {
                this.$message({
                  type: 'error',
                  message: '有必填项未填写!5'
                });
                return;
              }
            } else if (this[`filterForm2`][`menuChildId0`] == 135 || this[`filterForm2`][`menuChildId0`] == 4058) {
              if (!this.form.stage || !this.form.unitNo || !this.form.buildingNo || !this.form.floorNo || !this.form.room) {
                this.$message({
                  type: 'error',
                  message: '有必填项未填写!6'
                });
                return;
              }
            } else if (this[`filterForm2`][`menuChildId0`] == 134 || this[`filterForm2`][`menuChildId0`] == 4057) {
              if (!this.form.stage || !this.form.unitNo || !this.form.buildingNo || !this.form.floorNo || !this.form.room || !this.form.residentNo || !this.form.wall) {
                this.$message({
                  type: 'error',
                  message: '有必填项未填写!7'
                });
                return;
              }
            }
          }
        }



        this.$confirm('确认提交吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let [_this, body] = [this, _.cloneDeep(this.form)];
          body.room = this.form.room;
          body.hids = this.form.housesId;
          body.pids = this.form.id;
          body.aaa = this[`filterForm2`].menuId;
          body.bbb = this[`filterForm2`].menuChildId0;
          body.ccc = this[`filterForm2`].menuChildId1;
          body.ddd = this[`filterForm2`].menuChildId2;
          body.eee = this[`filterForm2`].menuChildId3;
          body.fff = this[`filterForm2`].menuChildId4;
          body.ggg = this[`filterForm2`].menuChildId5;
          body.hhh = this[`filterForm2`].menuChildId6;
          body.iii = this[`filterForm2`].menuChildId7;
          body.jjj = this[`filterForm2`].menuChildId8;
          body.scoreTitle = "";
          if (this[`filterForm2`].menuChildId0 == 135 || this[`filterForm2`].menuChildId0 == 134 || this[`filterForm2`].menuChildId0 == 4057 || this[`filterForm2`].menuChildId0 == 4058) {
            body.unitNo = _this.form.unitNo;
            body.buildingNo = _this.form.buildingNo;
          } else {
            body.unitNo = _this.filterForm2.unitNo;
            body.buildingNo = _this.filterForm2.buildingNo;
          }
          if (this.$route.query.status == 1 || this.$route.query.status == 3) {
            body.isPass = '';
          }

          this.$http('/HistoryBuilding/updateAuditorPhoto', {body}, {}, {}, 'post').then(res => {
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '提交成功!'
              });
              this.backS();
            }
          });
          this.outerVisible = false;
        }).catch(() => {

        })
      },
      //刷新方法
      refresh(){

      },
    }
  }
</script>
<style scoped>
  div {
    font-size: 14px;
    color: #48576a;
  }
  .el-form-item{
    margin-bottom: 10px!important;
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
    background: rgba(0, 0, 0, .5);
    line-height: 180px;
    display: none;
  }

  .img-container .wap .ico {
    color: #FFF;
  }
</style>
