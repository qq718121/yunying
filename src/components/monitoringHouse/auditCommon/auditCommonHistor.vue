<template>
  <div class="managers">
    <Subnav2 :navList="navList" @refresh=""></Subnav2>
    <div style="padding:20px">
      <el-tabs v-model="activeName" type="card" v-loading="loading_add" @tab-click="handleClick">
        <el-tab-pane label="待审核" name="1">
          <el-row style="padding:20px 10px 0px 10px;border:1px solid #eee;margin-bottom:20px">
            <el-col :span="22">
              <el-form :model="filterForm1" class="demo-form-inline" ref="filterForm1">
                <el-form-item label="照片形式：">
                  <el-radio-group v-model="filterForm1.formalism" @change="photoType">
                    <el-radio label="">
                      <span>全部</span>
                    </el-radio>
                    <el-radio label="1">
                      <span>上传照片</span>
                    </el-radio>
                    <el-radio label="0">
                      <span>工程照片</span>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <Cascader labels="质量问题:" :type="1" v-on:checkoutHanler="checkoutHanlerOn">
                </Cascader>
                <el-form-item label="质量监测结果：" v-show="filterForm1.rid">
                  <el-select size="small" v-model="filterForm1.did" style="width:150px;">
                    <el-option :label="val.name" :value="val.id" :key="val.id" v-for="(val,key) in filterForm1.EqcList">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="房间信息：">
                  <el-select size="small" v-model="filterForm1.stage" clearable placeholder="请选择期数" style="width:150px;" v-if=''>
                    <el-option label="一期" value="1"></el-option>
                    <el-option label="二期" value="2"></el-option>
                    <el-option label="三期" value="3"></el-option>
                    <el-option label="四期" value="4"></el-option>
                    <el-option label="五期" value="5"></el-option>
                    <el-option label="六期" value="6"></el-option>
                    <el-option label="七期" value="7"></el-option>
                    <el-option label="八期" value="8"></el-option>
                    <el-option label="九期" value="9"></el-option>
                    <el-option label="十期" value="10"></el-option>
                  </el-select>
                  <el-select size="small" v-model="filterForm1.buildingNo" clearable placeholder="请选择楼栋" style="width:150px;">
                    <el-option :label="`${index}栋`" :value="index" v-for="index in 200" :key="index">
                      <span>{{`${index}栋`}}</span>
                    </el-option>
                  </el-select>
                  <el-select size="small" v-model="filterForm1.unitNo" clearable placeholder="请选择单元" style="width:150px;">
                    <el-option :label="`${index}单元`" :value="index" v-for="index in 6" :key="index">
                      <span>{{`${index}单元`}}</span>
                    </el-option>
                  </el-select>
                  <el-select size="small" v-model="filterForm1.floorNo" clearable placeholder="请选择楼层" style="width:150px;">
                    <el-option label="-1层" value="-1"></el-option>
                    <el-option label="-2层" value="-2"></el-option>
                    <el-option label="-3层" value="-3"></el-option>
                    <el-option :label="`${index}层`" :value="index" v-for="index in 50" :key="index"></el-option>
                  </el-select>
                  <el-select size="small" v-model="filterForm1.residentNo" clearable placeholder="请选择户" style="width:150px;">
                    <el-option :label="`${index}户`" :value="index" v-for="index in 30" :key="index"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="工程质量定义：">
                  <el-select size="small" v-model="filterForm1.defId" clearable style="width:150px;">
                    <el-option :label="val.name" :value="val.id" :key="val.id" v-for="(val,key) in defList">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="拍照/上传人：">
                  <el-select size="small" v-model="filterForm1.adminUps" style="width:150px;" @change="admainUp">
                    <el-option label="拍照人" value="0">
                    </el-option>
                    <el-option label="上传人" value="1">
                    </el-option>
                  </el-select>
                  <el-select size="small" v-model="filterForm1.uploadUser2" clearable style="width:150px;">
                    <el-option :label="val.name" :value="val.id" :key="val.id" v-for="(val,key) in userLists">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="拍照/上传时间：">
                  <el-date-picker size="small" style="width:300px" @change="pickerChange" v-model="filterForm1.d" type="datetimerange" align="right" placeholder="选择日期范围">
                  </el-date-picker>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col>
              <el-button type="primary" @click="onSearchSubmit(1)">查询</el-button>
              <!--<el-button type="primary" @click="resetForm('filterForm1')">重置</el-button>-->
            </el-col>
          </el-row>
          <div v-if="this.$route.query.id==88">
            <p v-if="pageCount1 <= 0" style="text-align:center;color: #777;margin-top:100px">无数据</p>
            <div class="tabletopbar" v-if="pageCount1 > 0">
              <span style="margin-left:20px">查询结果：共</span>
              <span style="color:#111">{{pageCount1}}</span>
              <span>条</span>
              <span>批量操作</span>
              <el-radio-group v-model="form.allCheck" @change="allCheckeds">
                <el-radio label="0">
                  <span>全选</span>
                </el-radio>
                <el-radio label="1">
                  <span>反选</span>
                </el-radio>
              </el-radio-group>
              <el-button type="primary" @click="allEdit">批量编辑</el-button>
            </div>
          </div>
          <div v-else>
            <p v-if="tableData1.pageCount <= 0" style="text-align:center;color: #777;margin-top:100px">无数据</p>
            <div class="tabletopbar" v-if="tableData1.pageCount > 0">
              <span style="margin-left:20px">查询结果：共</span>
              <span style="color:#111">{{pageCount1}}</span>
              <span>条</span>
              <span>批量操作</span>
              <el-radio-group v-model="form.allCheck" @change="allCheckeds">
                <el-radio label="0">
                  <span>全选</span>
                </el-radio>
                <el-radio label="1">
                  <span>反选</span>
                </el-radio>
              </el-radio-group>
              <el-button type="primary" @click="allEdit">批量编辑</el-button>
            </div>
          </div>

          <el-dialog title="批量编辑" :visible.sync="dialogFormall" :close-on-click-modal="false" :show-close="false">
            <el-form :model="form">
              <el-form-item label="照片分类：" required>
                <el-radio-group v-model="filterForm2s.menuId" @change="menuIdChange($event,2)">
                  <el-radio v-for="(item,index) in selectList" :key="item.scoreTitle" :value="item.id" :label="item.id">
                    <span> {{item.scoreTitle}}</span>
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-show="filterForm2s.menuId!= ''">
                <span v-for="(item,index) in selectList" :key="item.id" style="color:#48576a" v-show="filterForm2s.menuId == item.id">
                  {{item.scoreTitle}}：
                </span>
                <el-select size="small" v-model="filterForm2s[`menuChildId${index}`]" style="width:150px" v-for="(val,index) in tenSect" @change="menuChildIdChange($event,2,index)">
                  <el-option v-for="(item,index) in val" :key="item.scoreTitle" :label="item.scoreTitle" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="施工区域：" required v-if="filterForm2s.menuChildId0 === 136 || filterForm2s.menuChildId0===4059">
                <el-select size="small" v-model="form.buildingNo" placeholder="请选择楼号" style="width:150px;">
                  <el-option :label="`${index}号楼`" :value="index" v-for="index in 200" :key="index"></el-option>
                </el-select>
                <el-select size="small" v-model="form.unitNo" placeholder="请选择楼号" style="width:150px;">
                  <el-option label="墙" value="墙"></el-option>
                  <el-option :label="`${index}号楼`" :value="index" v-for="index in 200" :key="index"></el-option>
                </el-select>

              </el-form-item>
              <el-form-item label="期数：" :label-width="formLabelWidth" v-if="this.$route.query.type==0" required>
                <el-select v-model="form.stage" clearable placeholder="请选择期数">
                  <el-option label="一期" value="1"></el-option>
                  <el-option label="二期" value="2"></el-option>
                  <el-option label="三期" value="3"></el-option>
                  <el-option label="四期" value="4"></el-option>
                  <el-option label="五期" value="5"></el-option>
                  <el-option label="六期" value="6"></el-option>
                  <el-option label="七期" value="7"></el-option>
                  <el-option label="八期" value="8"></el-option>
                  <el-option label="九期" value="9"></el-option>
                  <el-option label="十期" value="10"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="楼栋号：" :label-width="formLabelWidth" v-if="is1" required>
                <el-select v-model="form.buildingNo" placeholder="请选择楼栋">
                  <el-option :label="`${index}栋`" :value="index" v-for="index in 200" :key="index">
                    <span>{{`${index}栋`}}</span>

                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="单元号：" :label-width="formLabelWidth" v-if="is1" required>
                <el-select v-model="form.unitNo" clearable placeholder="请选择单元">
                  <el-option :label="`${index}单元`" :value="index" v-for="index in 6" :key="index">
                    <span>{{`${index}单元`}}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="楼   层：" :label-width="formLabelWidth" v-if="is1" required>
                <el-select v-model="form.floorNo" clearable placeholder="请选择楼层">
                  <el-option label="-1层" value="-1"></el-option>
                  <el-option label="-2层" value="-2"></el-option>
                  <el-option label="-3层" value="-3"></el-option>
                  <el-option :label="`${index}层`" :value="index" v-for="index in 50" :key="index+3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="门牌号：" :label-width="formLabelWidth" v-if="is1 && is2" required>
                <el-select v-model="form.residentNo" clearable placeholder="请选择门牌号">
                  <el-option :label="`${index}户`" :value="index" v-for="index in 30" :key="index"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="功能分区：" :label-width="formLabelWidth" v-if="is1" required>
                <el-select expand-trigger="hover" :options="options" v-model="form.room" v-if="isPlay">
                  <el-option :label="item.value" :value="item.value" v-for="item in options" :key="item.value"></el-option>
                </el-select>
                <el-select expand-trigger="hover" :options="options1" v-model="form.room" v-else-if="!isPlay">
                  <el-option :label="item.value" :value="item.value" v-for="item in options1" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="构件：" :label-width="formLabelWidth" v-if="is1 && is2" required>
                <el-select v-model="form.wall" clearable placeholder="请选择构件">
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
              </el-form-item>
              <el-form-item label="照片标签" required>
                <el-radio-group v-model="form.phototag">
                  <el-radio label="0">
                    <span>普通照片</span>
                  </el-radio>
                  <el-radio label="1">
                    <span>待整改</span>
                  </el-radio>
                  <el-radio label="2">
                    <span>已整改</span>
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" :rows="2" style="width: 300px;" autosize placeholder="请输入内容" v-model="form.comment">
                </el-input>
              </el-form-item>
              <el-form-item label="操作" required>
                <el-radio-group v-model="form.auditPharse">
                  <el-radio label="5">
                    <span>审核通过</span>
                  </el-radio>
                  <el-radio label="6">
                    <span>审核未通过</span>
                  </el-radio>
                </el-radio-group>
                <el-select v-if="form.auditPharse == '6'" clearable placeholder="选择未通过原因" v-model="form.region" style="width:250px">
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
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="allEditNo">取 消</el-button>
              <el-button type="primary" @click="submit">确 定</el-button>
            </div>
          </el-dialog>
          <div class="audit-ine" style="overflow: hidden;display: flex">
            <div class="audit" v-for="(val,index) in tableData1.PhotoList">
              <div class="audit-img" @click="f_checkout_img(index,1)">
                <div class='audit-ine-img'>
                  <img :src="val.miniPhoto" alt="">
                </div>
                <!-- :style="{backgroundImage:'url('+val.miniPhoto+')'}" -->
                <div class="audit-ic">待审核</div>
                <div class="audit-check" v-if="val.isShow">
                  <i class="el-icon-check"></i>
                </div>
                <div class="audit-img-text" v-if="val.housesinfo">
                  <span v-if="val.formalism == 0">{{val.housesinfo}}</span>
                  <span v-else>上传照片</span>
                </div>
              </div>
              <div>
                <!--<div class="audit-item">-->
                <!--<span>照片类型：</span>-->
                <!--<p>{{val.scoreConfig}}</p>-->
                <!--</div>-->
                <!--<div class="audit-item">-->
                <!--<span>未通过原因：</span>-->
                <!--<p>{{val.rejectReason}}</p>-->
                <!--</div>-->
                <div class="audit-item" v-if="val.formalism == 0">
                  <span>质量问题：</span>
                  <p>{{val.zlwt}}</p>
                </div>
                <div class="audit-item" v-if="val.formalism == 0">
                  <span>工程质量：</span>
                  <p>{{val.gczl}}</p>
                </div>
                <div class="audit-item" v-if="val.formalism == 0">
                  <span>拍照人：</span>
                  <p>{{val.photographer}}</p>
                </div>
                <div class="audit-item" v-else="val.formalism == 1">
                  <span>上传人：</span>
                  <p>{{val.uploadUserName}}</p>
                </div>
                <div class="audit-item" v-if="val.formalism == 0">
                  <span>拍照时间：</span>
                  <p>{{val.photoTime}}</p>
                </div>
                <div class="audit-item" v-else="val.formalism == 1">
                  <span>上传时间：</span>
                  <p>{{val.createdate}}</p>
                </div>
                <div class="audit-item">
                  <span>备注：</span>
                  <p>{{val.comment}}</p>
                </div>
                <!--<div class="audit-item">-->
                <!--<span>审核人：</span>-->
                <!--<p>{{val.examine}}</p>-->
                <!--</div>-->
                <!--<div class="audit-item">-->
                <!--<span>审核时间：</span>-->
                <!--<p>{{val.examineTime}}</p>-->
                <!--</div>-->
                <div class="audit-btn">
                  <el-button @click="auditEdit(1,index,0)">编辑</el-button>
                  <el-button @click="auditEdit(1,index,1)">查看</el-button>
                </div>
              </div>
            </div>
          </div>

          <!--<ExamineItem v-for="(item,index) in tableData1.list" :key="index" :geocoder="geocoder" :data="item" :type="1"-->
          <!--@updata="updata" :dataSwi="dataSwi"/>-->
          <el-pagination v-if="this.$route.query.id == 88" v-show="pageCount1>0" style="margin: 0 auto;text-align:center;margin-top:20px" layout="prev, pager, next,jumper" :page-size=12 :currentPage="currentPage1" @current-change="currentChange($event,1)" :total="pageCount1">
          </el-pagination>
          <el-pagination v-else v-show="tableData1.pageCount>0" style="margin: 0 auto;text-align:center;margin-top:20px" layout="prev, pager, next,jumper" :page-size=12 :currentPage="currentPage1" @current-change="currentChange($event,1)" :total="tableData1.pageCount">
          </el-pagination>
        </el-tab-pane>

        <el-tab-pane label="已审核" name="2">
          <el-row style="padding:20px 10px 0px 10px;border:1px solid #eee;margin-bottom:20px">
            <el-col :span="22">
              <el-form :model="filterForm2" class="demo-form-inline">
                <ComGrap :selectLists="selectList" :type="0" v-on:photoL0="checkoutSelect" />
                <el-form-item label="拍照/上传人：">
                  <el-select size="small" v-model="filterForm2.adminUps" style="width:150px;" @change="admainUp">
                    <el-option label="拍照人" value="0">
                    </el-option>
                    <el-option label="上传人" value="1">
                    </el-option>
                  </el-select>
                  <el-select size="small" clearable v-model="filterForm2.uploadUser2" style="width:150px;">
                    <el-option :label="val.name" :value="val.id" :key="val.id" v-for="(val,key) in userLists">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="拍照时间：">
                  <el-date-picker size="small" style="width:300px" @change="pickerChange2" v-model="filterForm2.d" type="datetimerange" align="right" placeholder="选择日期范围">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="审核人：">
                  <el-select size="small" clearable v-model="filterForm2.auditUser" style="width:150px;">
                    <el-option :label="val.name" :value="val.id" :key="val.id" v-for="(val,key) in bkUserList">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="审核时间：">
                  <el-date-picker size="small" style="width:300px" @change="pickerChange2s" v-model="filterForm2.dd" type="datetimerange" align="right" placeholder="选择日期范围">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="照片标签">
                  <el-radio-group v-model="filterForm2.phototag">
                    <el-radio label="">
                      <span>全部</span>
                    </el-radio>
                    <el-radio label="0">
                      <span>普通照片</span>
                    </el-radio>
                    <el-radio label="1">
                      <span>待整改</span>
                    </el-radio>
                    <el-radio label="2">
                      <span>已整改</span>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>

              </el-form>
            </el-col>
            <el-col>
              <el-button type="primary" @click="onSearchSubmit(2)">查询</el-button>
              <!--<el-button type="primary" @click="onSearchSubmit(2)">重置</el-button>-->
            </el-col>
          </el-row>

          <p v-if="tableData2.pageCount <= 0" style="text-align:center;color: #777;margin-top:100px">无数据</p>
          <div class="tabletopbar" v-if="tableData2.pageCount > 0">
            <span style="margin-left:20px">查询结果：共</span>
            <span style="color:#111">{{tableData2.pageCount}}</span>
            <span>条</span>
          </div>
          <div class="audit-ine" style="overflow: hidden;display: flex">
            <div class="audit" v-for="(val,index) in tableData2.PhotoList">
              <div class="audit-img">
                <div class='audit-ine-img' :style="{backgroundImage:'url('+val.miniPhoto+')'}"></div>
                <div class="audit-ic" style="background: greenyellow">已审核</div>
                <div class="audit-check" v-if="val.isShow">
                  <i class="el-icon-check"></i>
                </div>
                <div class="audit-img-text" v-if="val.housesinfo">
                  <span v-if="val.housesinfo!= ''">{{val.housesinfo}}</span>
                  <!-- <span v-else>上传照片</span> -->
                </div>
              </div>
              <div class="tableData2Icon">
                <span style="margin-left: 10px;margin-top: 5px">{{val.phototag == 0 ? '普通照片' : val.phototag == 1 ? '待整改' : '已整改'}}</span>
                <span>{{val.scoreTitle ? val.scoreTitle.slice(0, val.scoreTitle.indexOf('/')) : ''}}</span>
              </div>
              <div>
                <div class="audit-item">
                  <span>照片类型：</span>
                  <p>{{val.scoreTitle ? val.scoreTitle.slice(val.scoreTitle.indexOf('/') + 1) : ''}}</p>
                </div>
                <div class="audit-item" v-if="val.formalism == 0">
                  <span>拍照人：</span>
                  <p>{{val.photographer}}</p>
                </div>
                <div class="audit-item" v-else="val.formalism == 1">
                  <span>上传人：</span>
                  <p>{{val.uploadUserName}}</p>
                </div>
                <div class="audit-item" v-if="val.formalism == 0">
                  <span>拍照时间：</span>
                  <p>{{val.photoTime}}</p>
                </div>
                <div class="audit-item" v-else="val.formalism == 1">
                  <span>上传时间：</span>
                  <p>{{val.createdate}}</p>
                </div>

                <div class="audit-item">
                  <span>审核人：</span>
                  <p>{{val.auditUserName}}</p>
                </div>
                <div class="audit-item">
                  <span>审核时间：</span>
                  <p>{{val.auditTime}}</p>
                </div>
                <div class="audit-btn">
                  <el-button @click="auditEdit(2,index,0)">编辑</el-button>
                  <el-button @click="auditEdit(2,index,1)">查看</el-button>
                </div>
              </div>
            </div>
          </div>
          <el-pagination v-show="tableData2.pageCount>0" style="margin: 0 auto;text-align:center;margin-top:20px" layout="prev, pager, next,jumper" :page-size=12 :currentPage="currentPage2" @current-change="currentChange($event,2)" :total="tableData2.pageCount">
          </el-pagination>
        </el-tab-pane>

        <el-tab-pane label="未通过" name="3">

          <el-row style="padding:20px 10px 0px 10px;border:1px solid #eee;margin-bottom:20px">
            <el-col :span="22">
              <el-form :model="filterForm3" class="demo-form-inline">
                <el-form-item label="照片形式：">
                  <el-radio-group v-model="filterForm3.formalism">
                    <el-radio label="">
                      <span>全部</span>
                    </el-radio>
                    <el-radio label="1">
                      <span>上传照片</span>
                    </el-radio>
                    <el-radio label="0">
                      <span>工程照片</span>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <Cascader labels="质量问题" v-on:checkoutHanler="checkoutHanlerOn">
                </Cascader>
                <!--:selectedOptions2="filterForm3.selectedOptions2"
                          :EqcList="EqcList"-->
                <el-form-item label="质量监测结果：" v-show="filterForm3.rid">
                  <el-select size="small" v-model="filterForm3.did" style="width:150px;">
                    <el-option :label="val.name" :value="val.id" :key="val.id" v-for="(val,key) in filterForm3.EqcList">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="房间信息：">
                  <el-select size="small" clearable v-model="filterForm3.housesid" style="width:150px;" placeholder="请选择期数">
                    <el-option label="一期" value="1"></el-option>
                    <el-option label="二期" value="2"></el-option>
                    <el-option label="三期" value="3"></el-option>
                    <el-option label="四期" value="4"></el-option>
                    <el-option label="五期" value="5"></el-option>
                    <el-option label="六期" value="6"></el-option>
                    <el-option label="七期" value="7"></el-option>
                    <el-option label="八期" value="8"></el-option>
                    <el-option label="九期" value="9"></el-option>
                    <el-option label="十期" value="10"></el-option>
                  </el-select>
                  <el-select size="small" clearable v-model="filterForm3.buidingNo" style="width:150px;" placeholder="请选择楼栋">
                    <el-option label="请选择楼栋" value=""></el-option>
                    <el-option :label="`${index}栋`" :value="index" v-for="index in 200" :key="index">{{`${index}栋`}}

                    </el-option>
                  </el-select>
                  <el-select size="small" clearable v-model="filterForm3.unitNo" style="width:150px;" placeholder="请选择单元">
                    <el-option :label="`${index}单元`" :value="index" v-for="index in 6" :key="index">{{`${index}单元`}}

                    </el-option>
                  </el-select>
                  <el-select size="small" clearable v-model="filterForm3.floorNo" style="width:150px;" placeholder="请选择楼层">
                    <!-- <el-option label="请选择楼层" value=""></el-option> -->
                    <el-option label="-1层" value="0"></el-option>
                    <el-option label="-2层" value="1"></el-option>
                    <el-option label="-3层" value="2"></el-option>
                    <el-option :label="`${index}层`" :value="index+3" v-for="index in 50" :key="index+3"></el-option>
                  </el-select>
                  <el-select size="small" clearable v-model="filterForm3.residentNo" style="width:150px;" placeholder="请选择户">
                    <!-- <el-option label="请选择户" value=""></el-option> -->
                    <el-option :label="`${index}户`" :value="index" v-for="index in 30" :key="index"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="工程质量定义：">
                  <el-select clearable size="small" v-model="filterForm3.defId" style="width:150px;">
                    <el-option :label="val.name" :value="val.id" :key="val.id" v-for="(val,key) in defList">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="拍照/上传人：">
                  <el-select size="small" v-model="filterForm3.adminUps" style="width:150px;" @change="admainUp">
                    <el-option label="拍照人" value="0">
                    </el-option>
                    <el-option label="上传人" value="1">
                    </el-option>
                  </el-select>
                  <el-select clearable size="small" v-model="filterForm3.uploadUser2" style="width:150px;">
                    <el-option :label="val.name" :value="val.id" :key="val.id" v-for="(val,key) in userLists">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="拍照/上传时间：">
                  <el-date-picker size="small" style="width:300px" @change="pickerChange3" v-model="filterForm3.d" type="datetimerange" align="right" placeholder="选择日期范围">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="审核人：">
                  <el-select clearable size="small" v-model="filterForm3.auditUser" style="width:150px;">
                    <el-option :label="val.name" :value="val.id" :key="val.id" v-for="(val,key) in bkUserList">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="审核时间：">
                  <el-date-picker size="small" style="width:300px" @change="pickerChange3s" v-model="filterForm3.dd" type="datetimerange" align="right" placeholder="选择日期范围">
                  </el-date-picker>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col>
              <el-button type="primary" @click="onSearchSubmit(3)">查询</el-button>
              <!--<el-button type="primary" @click="onSearchSubmit(3)">重置</el-button>-->
            </el-col>
          </el-row>

          <p v-if="tableData3.pageCount <= 0" style="text-align:center;color: #777;margin-top:100px">无数据</p>
          <div class="tabletopbar" v-if="tableData3.pageCount > 0">
            <span style="margin-left:20px">查询结果：共</span>
            <span style="color:#111">{{tableData3.pageCount}}</span>
            <span>条</span>
          </div>
          <div class="audit-ine" style="overflow: hidden;display: flex">
            <div class="audit" v-for="(val,index) in tableData3.PhotoList">
              <div class="audit-img">
                <div class='audit-ine-img' :style="{backgroundImage:'url('+val.miniPhoto+')'}"></div>
                <div class="audit-ic" style="background: red">未通过</div>
                <div class="audit-check" v-if="val.isShow">
                  <i class="el-icon-check"></i>
                </div>
                <div class="audit-img-text" v-if="val.housesinfo">
                  <span v-if="val.formalism == 0">{{val.housesinfo}}</span>
                  <span v-else>上传照片</span>
                </div>
              </div>
              <div>
                <!--<div class="audit-item">-->
                <!--<span>照片类型：</span>-->
                <!--<p>{{val.scoreConfig}}</p>-->
                <!--</div>-->
                <div class="audit-item">
                  <span>未通过原因：</span>
                  <p>{{val.region}}</p>
                </div>
                <div class="audit-item" v-show="val.formalism == 0">
                  <span>质量问题：</span>
                  <p>{{val.zlwt}}</p>
                </div>
                <div class="audit-item" v-show="val.formalism == 0">
                  <span>工程质量：</span>
                  <p>{{val.gczl}}</p>
                </div>
                <div class="audit-item" v-if="val.formalism == 0">
                  <span>拍照人：</span>
                  <p>{{val.photographer}}</p>
                </div>
                <div class="audit-item" v-else="val.formalism == 1">
                  <span>上传人：</span>
                  <p>{{val.uploadUserName}}</p>
                </div>
                <div class="audit-item" v-if="val.formalism == 0">
                  <span>拍照时间：</span>
                  <p>{{val.photoTime}}</p>
                </div>
                <div class="audit-item" v-else="val.formalism == 1">
                  <span>上传时间：</span>
                  <p>{{val.createdate}}</p>
                </div>
                <div class="audit-item">
                  <span>审核人：</span>
                  <p>{{val.auditUserName}}</p>
                </div>
                <div class="audit-item">
                  <span>审核时间：</span>
                  <p>{{val.auditTime}}</p>
                </div>
                <div class="audit-btn">
                  <el-button @click="auditEdit(3,index,1)">查看</el-button>
                </div>
              </div>
            </div>
          </div>
          <el-pagination v-show="tableData3.pageCount>0" style="margin: 0 auto;text-align:center;margin-top:20px" layout="prev, pager, next,jumper" :page-size=12 :currentPage="currentPage3" @current-change="currentChange($event,3)" :total="tableData3.pageCount">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
      <div id="container" tabindex="0" style="width: 500px;height: 500px;display: none"></div>
    </div>
  </div>
</template>

<script>
import Subnav2 from "../../Subnav2/Subnav2";
import ExamineItem from "../../Common/ExamineItem/ExamineItem";
import message from "../../../common/message";
import Cascader from "../../Common/cascader/cascader.vue";
import baseURL from "../../../common/url";
import ComGrap from "../../Common/ComGrap/comGrap.vue";

export default {
  name: "managers",
  components: {
    Subnav2,
    ExamineItem,
    Cascader,
    ComGrap
  },
  data() {
    return {
      EqcList: [],
      loading_add:false,
      defList: [],
      userList: [],
      bkUserList: [],
      userLists: [],
      dialogFormall: false,
      picEditList: [],
      pageCount1: 0,
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
          value: "大厅（仅一楼有）",
          label: "大厅（仅一楼有）"
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
          value: "卫生间",
          label: "卫生间"
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
      dialogFormVisible: false,
      filterForm2s: {
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
        buildingNo: "",
        unitNo: "",
        layerNo: "",
        house: "",
        build: "",
        room: ""
      },
      formInit: {
        buildingId: this.$route.query.id,
        hids: "",
        pids: "",
        sgate: "",
        selectLists: [],
        allCheck: "",
        buildingNo: "",
        comment: "",
        unitNo: "",
        floorNo: "",
        residentNo: "",
        room: "",
        region: "",
        wall: "",
        phototag: [],
        auditPharse: "",
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
      form: {
        buildingId: this.$route.query.id,
        hids: "",
        pids: "",
        sgate: "",
        selectLists: [],
        allCheck: "",
        buildingNo: "",
        comment: "",
        unitNo: "",
        floorNo: "",
        residentNo: "",
        room: "",
        region: "",
        wall: "",
        phototag: [],
        auditPharse: "",
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
      formLabelWidth: "120px",
      radio: "1",
      activeName: "1",
      currentPage1: 1,
      currentPage2: 1,
      currentPage3: 1,
      navList: [
        { path: "/unopened/estateunopenedexamine", name: "首页" },
        { path: "/monitoring/monitoringHistoricPhotos", name: "历史照片" },
        { path: this.$route.fullPath, name: this.$route.query.name }
      ],

      filterForm1: {
        buildingId: this.$route.query.id,
        buildingNo: "",
        adminUps: "",
        d: "",
        pageNum: 0,
        pageSize: 12,
        auditPharse: "0",
        isPass: "1",
        picIsPass: "1",
        did: "",
        createdate: null,
        timeType: "1",
        starttime: null,
        endtime: null,
        EqcList: [],
        formalism: "",
        rid: "",
        //上传人
        photographer: "",
        //添加拍照人id 上传人为""
        photoUser: "",
        //房屋id
        housesid: "",
        //楼号
        buidingNo: "",
        //层
        floorNo: "",
        //门牌号
        residentNo: "",
        //单元
        unitNo: "",
        //图片id
        id: "",

        //上传人id
        uploadUser: "",
        uploadUser2: "",
        //质量问题定义
        defId: ""
      },
      tableData1: {
        pageCount: 0,
        list: []
      },
      filterForm2: {
        checkList: [],
        //上传人id
        uploadUser: "",
        uploadUser2: "",
        adminUps: "",
        buildingId: this.$route.query.id,
        selectedOptions2: [],
        pageNum: 0,
        auditPharse: "1",
        pageSize: 12,
        isPass: "2",
        picIsPass: "2",
        //审核人id
        auditUser: "",
        //添加拍照人id 上传人为""
        photoUser: "",
        //审核时间
        auditStarttime: "",
        auditEndtime: "",
        menuId: "",
        menuChildId1: "",
        starttime: null,
        endtime: null,
        //上传人
        photographer: "",
        d: "",
        dd: "",
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
      tableData2: {
        pageCount: 0,
        list: []
      },
      filterForm3: {
        buildingId: this.$route.query.id,
        pageNum: 0,
        pageSize: 12,
        auditPharse: "2",
        isPass: "2",
        d: "",
        dd: "",
        picIsPass: "3",
        selectedOptions2: [],
        PhotoShape: "",
        //审核人id
        auditUser: "",
        //审核时间
        auditStarttime: "",
        auditEndtime: "",
        did: "",
        createdate: null,
        timeType: "1",
        starttime: null,
        endtime: null,
        EqcList: [],
        rid: "",
        formalism: "",
        //上传人
        photographer: "",
        //添加拍照人id 上传人为""
        photoUser: "",
        //房屋id
        housesid: "",
        //楼号
        buildingNo: "",
        //层
        floorNo: "",
        //门牌号
        residentNo: "",
        //单元
        unitNo: "",
        //图片id
        id: "",

        //上传人id
        uploadUser: "",
        uploadUser2: "",
        //质量问题定义
        defId: ""
      },
      filterFormAdd: {
        buildingId: this.$route.query.id,
        pageNum: 0,
        pageSize: 12,
        auditPharse: "2",
        isPass: "2",
        d: "",
        dd: "",
        picIsPass: "3",
        selectedOptions2: [],
        PhotoShape: "",
        //审核人id
        auditUser: "",
        //审核时间
        auditStarttime: "",
        auditEndtime: "",
        did: "",
        createdate: null,
        timeType: "1",
        starttime: null,
        endtime: null,
        EqcList: [],
        rid: "",
        formalism: "",
        //上传人
        photographer: "",
        //添加拍照人id 上传人为""
        photoUser: "",
        //房屋id
        housesid: "",
        //楼号
        buildingNo: "",
        //层
        floorNo: "",
        //门牌号
        residentNo: "",
        //单元
        unitNo: "",
        //图片id
        id: "",

        //上传人id
        uploadUser: "",
        uploadUser2: "",
        //质量问题定义

        defId: ""
      },
      tableData3: {
        pageCount: 0,
        list: []
      },
      selectList: [],
      tenSect: [],
      hidsList: [],
      menuChildList1: [],
      menuGrandList1: [],
      menuChildList2: [],
      menuGrandList2: [],
      menuChildList3: [],
      menuGrandList3: [],
      dataSwi: false,
      geocoder: null,
      is1: false,
      is2: false,
      isPlay: true
    };
  },
  computed: {},
  created() {
    if (this.$route.query.page) {
      this.currentChange(
        this.$route.query.page * 1 + 1,
        this.$route.query.type
      );
    }
    if (this.$route.query.id == 88 && this.$route.query.imgcount) {
      this.pageCount1 = this.$route.query.imgcount * 1;
    }
    this.getSelectData();
    
    // this.getData(2);
    // this.getData(3);
    this.f_getViewData();
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName;
    }
    this.getData(this.activeName);
    //      this.getSelectData();
  },
  methods: {
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
    //menuChildId 改变
    menuChildIdChange(menuChildId, type, index) {
      let _this = this,
        body = { pid: menuChildId };
      _this.is(_this.filterForm2s[`menuChildId0`]);
      if (
        menuChildId == 135 ||
        menuChildId == 136 ||
        menuChildId == 134 ||
        menuChildId == 4057 ||
        menuChildId == 4058 ||
        menuChildId == 4059
      ) {
        // _this.form.unitNo = '';
        // _this.filterForm2s.unitNo = '';
        // _this.filterForm2s.buildingNo = '';
        // _this.form.buildingNo = '';
        // _this.form.residentNo = '';
        // _this.form.floorNo = '';
      }
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
      } else {
        this.isPlay = false;
      }
    },
    //menuId 改变
    menuIdChange(menuId, type) {
      let _this = this,
        body = { pid: menuId };
      this.initSelect(type, 0, 10);
      this.tenSect.length = 0;
      // _this.form.unitNo = '';
      // _this.filterForm2s.unitNo = '';
      // _this.filterForm2s.buildingNo = '';
      // _this.form.buildingNo = '';
      this.$http(
        "/buildingCamera/getPicClassify",
        { body },
        {},
        {},
        "post"
      ).then(res => {
        if (res.data.code == 0) {
          _this.tenSect.push(res.data.response.list);
          for (let i = 0; i < 10; i++) {
            if (this.filterForm2s[`menuChildId${i}`]) {
              this.filterForm2s[`menuChildId${i}`] = "";
            }
          }
          if (menuId == "1" || menuId == "2") {
            this.is1 = false;
          } else {
            this.is1 = true;
            this.is2 = true;
          }
        }
      });
    },
    initSelect(type, index, len) {
      for (let i = index; i < len; i++) {
        this[`filterForm2s`][`menuChildId${index}`] = "";
      }
    },
    //上传人拍照人
    admainUp(val) {
      this.filterForm1.uploadUser2 = "";
      this.filterForm2.uploadUser2 = "";
      this.filterForm3.uploadUser2 = "";
      if (val == "0") {
        this.userLists = this.userList;
      } else if (val == "1") {
        this.userLists = this.bkUserList;
      }
    },
    photoType(val) {
      if (val == "0") {
        this.filterForm1.adminUps = "0";
        this.userLists = this.bkUserList;
      } else if (val == "1") {
        this.filterForm1.adminUps = "1";
        this.userLists = this.userList;
      } else {
        this.filterForm1.adminUps = "";
      }
    },
    checkoutSelect(data) {
      this.filterForm2.aaa = data.menuId;
      this.filterForm2.bbb = data.menuChildId0;
      this.filterForm2.ccc = data.menuChildId1;
      this.filterForm2.ddd = data.menuChildId2;
      this.filterForm2.eee = data.menuChildId3;
      this.filterForm2.fff = data.menuChildId4;
      this.filterForm2.ggg = data.menuChildId5;
      this.filterForm2.hhh = data.menuChildId6;
      this.filterForm2.iii = data.menuChildId7;
      this.filterForm2.jjj = data.menuChildId8;

      this.filterForm2.stage = data.stage;
      this.filterForm2.buildingNumber = data.buildingNumber;
      this.filterForm2.unitNumber = data.unitNumber;
      this.filterForm2.layerNumber = data.layerNumber;
      this.filterForm2.house = data.house;
      this.filterForm2.build = data.build;
      this.filterForm2.room = data.room;
    },
    checkSelect9(data) {
      this.form.aaa = data.menuId;
      this.form.bbb = data.menuChildId0;
      this.form.ccc = data.menuChildId1;
      this.form.ddd = data.menuChildId2;
      this.form.eee = data.menuChildId3;
      this.form.fff = data.menuChildId4;
      this.form.ggg = data.menuChildId5;
      this.form.hhh = data.menuChildId6;
      this.form.iii = data.menuChildId7;
      this.form.jjj = data.menuChildId8;
    },
    //当三级联动值改变的时候，拿到改变后的值
    checkoutHanlerOn(data, type) {

      if (!data[2]) {
        this.filterForm1.did = "";
        this.filterForm3.did = "";
      }
      if (type == 1) {
        this.filterForm1.rid = data[2];
        this.getFore(1);
      } else {
        this.filterForm3.rid = data[2];
        this.getFore(3);
      }
    },
    //跳转编辑审核
    auditEdit(num, index, type) {
      this.$router.push({
        path: "/monitoring/aditAudit",
        query: {
          houseName: this.$route.query.name,
          status: num,
          path: this.$route.fullPath,
          activeName: this.activeName,
          type: type,
          data: JSON.stringify(this[`tableData${num}`].PhotoList[index]),
          page: this[`filterForm${num}`].pageNum
        }
      });
      //        window.sessionStorage.setItem('autoId', num);
    },
    //获取查询数据列表
    f_getViewData() {
      let [_this, body] = [this, {}];
      this.$http(
        "/HistoryBuilding/getQuerySource",
        { body },
        {},
        {},
        "post"
      ).then(res => {
        if (res.data.code == 0) {
          this.EqcList = res.data.response.EqcList;
          this.defList = res.data.response.defList;
          this.userList = res.data.response.userList;
          this.bkUserList = res.data.response.bkUserList;
        }
      });
      //        this.$axios.get(baseURL + '/HistoryBuilding/getQuerySource').then(res => {
      //          if (res.data.code == 0) {
      //            this.EqcList = res.data.response.EqcList;
      //            this.defList = res.data.response.defList;
      //            this.userList = res.data.response.userList;
      //            this.bkUserList = res.data.response.bkUserList;
      //          }
      //        })
    },
    //点击选中图片
    f_checkout_img(index, type) {
      this.form.allCheck = "";
      if (!this[`tableData${type}`].PhotoList[index].isShow) {
        this.picEditList.push(this[`tableData${type}`].PhotoList[index].id);
        this.hidsList.push(this[`tableData${type}`].PhotoList[index].housesId);
      } else {
        for (let i in this.picEditList) {
          if (
            this.picEditList[i] == this[`tableData${type}`].PhotoList[index].id
          ) {
            this.picEditList.splice(i, 1);
            this.hidsList.splice(i, 1);
          }
        }
      }
      this[`tableData${type}`].PhotoList[index].isShow = !this[
        `tableData${type}`
      ].PhotoList[index].isShow;
    },
    //全选
    allCheckeds(data) {
      if (data == "0") {
        this.picEditList.length = 0;
        for (let i in this[`tableData1`].PhotoList) {
          this[`tableData1`].PhotoList[i].isShow = true;
          this.picEditList.push(this[`tableData1`].PhotoList[i].id);
          this.hidsList.push(this[`tableData1`].PhotoList[i].housesId);
        }
      } else if (data == "1") {
        for (let i in this[`tableData1`].PhotoList) {
          if (this[`tableData1`].PhotoList[i].isShow) {
            this[`tableData1`].PhotoList[i].isShow = false;
            for (let j in this.picEditList) {
              if (this.picEditList[j] == this[`tableData1`].PhotoList[i].id) {
                this.picEditList.splice(j, 1);
                this.hidsList.splice(j, 1);
              }
            }
          } else {
            this[`tableData1`].PhotoList[i].isShow = true;
            this.picEditList.push(this[`tableData1`].PhotoList[i].id);
            this.hidsList.push(this[`tableData1`].PhotoList[i].housesId);
          }
        }
      } else {
        return;
      }
    },
    //获取第四级
    getFore(type) {
      let [_this, body] = [this, { id: this[`filterForm${type}`].rid }];
      if (body.id != "" && body.id != null && body.id != undefined) {
        this.$http(
          "/HistoryBuilding/getFiveMenu",
          { body },
          {},
          {},
          "post"
        ).then(res => {
          if (res.data.code == 0) {
            // console.log(res);
            this[`filterForm${type}`].EqcList = res.data.response.EqcList;
            this[`filterForm${type}`].did = res.data.response.EqcList[0].id;
          }
        });
      }
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    pickerChange(val) {
      this.filterForm1.starttime = val.slice(0, 19);
      this.filterForm1.endtime = val.slice(22);
    },
    pickerChange2(val) {
      this.filterForm2.starttime = val.slice(0, 19);
      this.filterForm2.endtime = val.slice(22);
    },
    pickerChange2s(val) {
      this.filterForm2.auditStarttime = val.slice(0, 19);
      this.filterForm2.auditEndtime = val.slice(22);
    },
    pickerChange3(val) {
      this.filterForm3.starttime = val.slice(0, 19);
      this.filterForm3.endtime = val.slice(22);
    },
    pickerChange3s(val) {
      this.filterForm3.auditStarttime = val.slice(0, 19);
      this.filterForm3.auditEndtime = val.slice(22);
    },
    //请求数据方法
    getData(type) {
        this.loading_add = true;
      let [_this, body] = [this, this[`filterForm${type}`]];
      if (this[`filterForm${type}`].adminUps == "0") {
        body.photoUser = this[`filterForm${type}`].uploadUser2;
        body.uploadUser = "";
      } else if (this[`filterForm${type}`].adminUps == "1") {
        body.photoUser = "";
        body.uploadUser = this[`filterForm${type}`].uploadUser2;
      }
      this.$http(
        "/HistoryBuilding/getPhotoList",
        { body },
        {},
        {},
        "post"
      ).then(res => {
        if (res.data.code == 0) {
          _this[`tableData${type}`] = res.data.response;
          for (let i in _this[`tableData${type}`].PhotoList) {
            _this.$set(_this[`tableData${type}`].PhotoList[i], "isShow", false);
          }
          _this.loading_add = false;
        }
      });
    },
    //取消批量编辑
    allEditNo() {
      this.picEditList.length = 0;
      this.hidsList.length = 0;
      this.dialogFormall = false;
      this.updata();
      this.form.allCheck = "";

      //        this.form = this.formInit;
      //        alert('1');
    },
    //遍历对象取消操作痕迹
    cancleObjAll() {
      // console.log(this[`tableData1`].PhotoList);
      let val = [];
      for (let i in this[`tableData1`].PhotoList) {
        // console.log(this[`tableData1`].PhotoList[i].isShow);
        if (this[`tableData1`].PhotoList[i].isShow) {
          val.push(this[`tableData1`].PhotoList[i]);
        }
      }

      this.filterForm2s.menuId = "";
      this.filterForm2s.menuChildId0 = "";
      this.form.buildingId = this.$route.query.id;
      this.form.hids = "";
      // this.form.pids = '';
      this.form.sgate = val[0].stage;
      this.form.selectLists = [];
      this.form.allCheck = "";
      this.form.buildingNo = val[0].buildingNo;
      this.form.comment = "";
      this.form.unitNo = val[0].unitNo;
      this.form.floorNo = val[0].floorNo;
      this.form.residentNo = val[0].residentNo;
      this.form.room = val[0].room;
      this.form.region = "";
      this.form.wall = val[0].wall;
      // this.form.phototag = val[0].phototag;
      this.form.auditPharse = "";
    },
    //批量编辑操作
    allEdit() {
      // console.log(this[`tableData1`].PhotoList[0].isShow);
      let _this = this;
      if (this.picEditList.length <= 0) {
        this.$message({
          type: "error",
          message: "请选择至少一张图片!"
        });
        return;
      }
      //判断图片的类型 0工程照片 1上传照片
      let judegPhototype = [];
      for (let i in this[`tableData1`].PhotoList) {
        if (this[`tableData1`].PhotoList[i].isShow) {
          judegPhototype.push(this[`tableData1`].PhotoList[i]);
        }
      }
      let judegPhototypeBlone = true;
      this.cancleObjAll();
      this.form.phototag = "";
      for (let j in judegPhototype) {
        if (
          judegPhototype[j].formalism == "1" ||
          judegPhototype[j].formalism == 1
        ) {
          judegPhototypeBlone = true;
        } else {
          judegPhototypeBlone = false;
        }
      }
      if (judegPhototypeBlone) {
        this.dialogFormall = true;
      } else {
        this.$axios
          .post(
            baseURL +
              `/HistoryBuilding/checkUpdatePhotos?id=${this.picEditList
                .slice(",")
                .join(",")},&housesId=${this.hidsList.slice(",").join(",")},`
          )
          .then(res => {
            if (res.data.code == "2") {
              this.$message({
                type: "error",
                message: "有图片不允许批量编辑"
              });
              this.updata();
              this.form.allCheck = "";
              judegPhototypeBlone = true;
              // this.picEditList.length = 0;
              this.picEditList.length = 0;
              this.hidsList.length = 0;
              return;
            }
            this.cancleObjAll();
            this.dialogFormall = true;
          });
      }
    },
    submit() {

      if (this.form.auditPharse == "6") {
        if (!this.form.region) {
          this.$message({
            type: "error",
            message: "有必填项未填写!3"
          });
          return;
        }
      } else {
        if (!this[`filterForm2s`][`menuChildId${this.tenSect.length - 1}`]) {
          this.$message({
            type: "error",
            message: "有必填项未填写!1"
          });
          return;
        }
        if (this.form.phototag.length <= 0) {
          this.$message({
            type: "error",
            message: "有必填项未填写!2"
          });
          return;
        }
        if (!this.form.auditPharse) {
          this.$message({
            type: "error",
            message: "有必填项未填写!4"
          });
          return;
        }
        if (
          this[`filterForm2s`][`menuChildId0`] == 136 ||
          this[`filterForm2s`][`menuChildId0`] == 4059
        ) {
          if (!this.form.buildingNo || !this.form.unitNo) {
            this.$message({
              type: "error",
              message: "有必填项未填写!5"
            });
            return;
          }
        } else if (
          this[`filterForm2s`][`menuChildId0`] == 135 ||
          this[`filterForm2s`][`menuChildId0`] == 4058
        ) {
          if (
            !this.form.unitNo ||
            !this.form.buildingNo ||
            !this.form.floorNo ||
            !this.form.room
          ) {
            this.$message({
              type: "error",
              message: "有必填项未填写!6"
            });
            return;
          }
        } else if (
          this[`filterForm2s`][`menuChildId0`] == 134 ||
          this[`filterForm2s`][`menuChildId0`] == 4057
        ) {
          if (
            this.form.stage == "" ||
            this.form.unitNo == "" ||
            this.form.buildingNo == "" ||
            this.form.floorNo == "" ||
            this.form.room == "" ||
            this.form.residentNo == "" ||
            this.form.wall == ""
          ) {

            this.$message({
              type: "error",
              message: "有必填项未填写!7"
            });
            return;
          }
        }
      }

      this.$confirm("确认提交吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let [_this, body] = [this, _.cloneDeep(this.form)];
          body.hids = this.hidsList.slice(",").join(",");
          body.pids = this.picEditList.slice(",").join(",");
          body.aaa = this[`filterForm2s`].menuId;
          body.bbb = this[`filterForm2s`].menuChildId0;
          body.ccc = this[`filterForm2s`].menuChildId1;
          body.ddd = this[`filterForm2s`].menuChildId2;
          body.eee = this[`filterForm2s`].menuChildId3;
          body.fff = this[`filterForm2s`].menuChildId4;
          body.ggg = this[`filterForm2s`].menuChildId5;
          body.hhh = this[`filterForm2s`].menuChildId6;
          body.iii = this[`filterForm2s`].menuChildId7;
          body.jjj = this[`filterForm2s`].menuChildId8;

          this.$http(
            "/HistoryBuilding/updateAuditorPhoto",
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
              this.updata();
              this.dialogFormall = false;
              this.picEditList.length = 0;
              this.hidsList.length = 0;
              // this.picEditList.length = 0;
            }
          });
        })
        .catch(err => {});
    },
    //更新数据
    updata() {
      this.getData(1);
      this.getData(2);
      this.getData(3);
      this.f_getViewData();
    },
    //      //tab切换
         handleClick(){
             this.getData(this.activeName);
         },
    //触发搜索
    onSearchSubmit(type) {
      // console.log(type);
      // if(type == "1" || type == "3" || type == "2"){
      //   console.log(this[`filterForm${type}`].adminUps);
      //   let addNum = this[`filterForm${type}`].adminUps;
      //   if(addNum == "0"){
      //     this[`filterForm${type}`].uploadUser = "";
      //   }else if(addNum == "1"){
      //     this[`filterForm${type}`].uploadUser = this[`filterForm${type}`].uploadUser;
      //   }
      // }

      this[`filterForm${type}`].pageNum = 0;
      if (this[`currentPage${type}`] != 1) {
        this[`currentPage${type}`] = 1;
      } else {
        this.getData(type);
      }
    },
    //改变页码
    currentChange(page, type) {
      this[`currentPage${type}`] = page;
      this[`filterForm${type}`].pageNum = page - 1;
      this.getData(type);
    }
    //      //刷新方法
    //      refresh()
    //      {
    //
    //      }
    //      ,
  },
  mounted() {
    this.$store.dispatch(
      "defaultIndexAction",
      "/monitoring/monitoringHistoricPhotos"
    );
    //      this.initMap();
  }
};
</script>

<style scoped>
.el-dialog {
  margin-bottom: 0px;
  margin-top: -100px !important;
}

.slide-enter-active,
.slide-leave-active {
  transition: height 1s;
}

.slide-enter,
.slide-leave-to {
  height: 0;
}

.slide-leave,
.slide-enter-to {
  height: 100px;
}

.tabletopbar {
  height: 40px;
  background: #eef1f6;
  border-left: 1px solid #dfe6ec;
  border-right: 1px solid #dfe6ec;
  border-top: 1px solid #dfe6ec;
  line-height: 40px;
  font-size: 12px;
  color: #555;
  padding: 0px 15px;
}

.audit-ine {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.audit {
  width: 30%;
  height: 600px;
  margin-left: 2%;
  margin-right: 1%;
  margin-top: 30px;
  border: 1px solid gainsboro;
}

.tableData2Icon span:nth-child(1) {
  padding: 3px 10px 3px 10px;
  line-height: 20px;
  border: 1px solid green;
  display: inline-block;
  color: green;
}

.tableData2Icon span:nth-child(2) {
  padding: 3px 10px 3px 10px;
  line-height: 20px;
  border: 1px solid green;
  display: inline-block;
  color: green;
}

.audit-img {
  width: 100%;
  height: 50%;
  margin: auto;
  position: relative;
  overflow: hidden;
}

.audit-ine-img {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
}
.audit-ine-img img {
  width: 100%;
  min-width: 100%;
}
.el-radio__input.is-checked .el-radio__inner {
  border-color: #20a0ff;
  background: #20a0ff;
}
.audit-item {
  display: flex;
  justify-content: flex-start;
  margin: auto;
  margin-left: 0;
  margin-right: 0;
  padding-left: 10px;
}

.audit-item p {
  width: 65%;
}

.audit-btn {
  width: 100%;
  margin: 20px auto;
  display: flex;
  justify-content: center;
}

.audit-ic {
  position: absolute;
  left: 0;
  top: 0;
  width: 100px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  background: #000;
  color: #fff;
}

.audit-check {
  position: absolute;
  right: 0;
  top: 0;
  width: 50px;
  height: 50px;
  background: lightseagreen;
  color: #fff;
  line-height: 50px;
  text-align: center;
}

.audit-img-text {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 20px;
  line-height: 60px;
  display: flex;
  justify-content: space-around;
  overflow: hidden;
}

.audit-img-text span:nth-child(2) {
  display: inline-block;
  width: 100px;
  height: 40px;
  border: 1px solid #fff;
  line-height: 40px;
  text-align: center;
  margin: auto;
  margin-right: 20px;
}
</style>

<style>
.el-table--border td,
.el-table--border th {
  text-align: center;
}
</style>

