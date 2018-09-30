<template>
  <div class="managers">
    <Subnav2 :navList="navList" @refresh="refresh"></Subnav2>
    <div style="padding:20px">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick" v-loading="is_loading_tab">
        <el-tab-pane label="待提交" name="1" v-if="NewTagsLists.list[0].status == 1">
          <el-row style="padding:20px 10px 0px 10px;border:1px solid #eee;margin-bottom:20px">
            <el-col :span="22">
              <el-form :model="filterForm1" class="demo-form-inline">
                <el-form-item label="分类：">
                  <el-radio-group v-model="filterForm1.detailType">
                    <el-radio label="">
                      <span>全部</span>
                    </el-radio>
                    <el-radio label="0">
                      <span>照片</span>
                    </el-radio>
                    <el-radio label="1">
                      <span>视频</span>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-collapse-transition>
                  <div v-show="addShow1">
                    <el-form-item label="期数：">
                      <el-select :clearable="true" v-model="filterForm1.houseNumberId" @change="getHouseNumberList2(1)">
                        <el-option v-for="(item,index) in houseNumberList2" :key="item.houseNumber" :label="item.houseNumber" :value="item.houseNumberId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                <el-form-item label="地块：">
                    <el-select :clearable="true" v-model="filterForm1.massifId" placeholder="请选择地块">
                        <el-option v-for="item in massifList" :key="item.massifName" :label="item.massifName" :value="item.massifId">
                        </el-option>
                    </el-select>
                </el-form-item>
                    <ComGrap :selectLists="filterForm1" :type="1" where="house" v-on:photoL0="checkoutSelect" />
                    
                    <el-form-item label="楼幢数：" v-show="filterForm1.talType == 1 && filterForm1.scoreConfigId.slice(2) == 7">
                      <el-select size="small" v-model="filterForm1.buildingNumber" clearable style="width:150px;" @change="bdmShow('1')">
                        <el-option label="自定义楼幢" value="0"></el-option>
                        <el-option :label="`${index}号楼`" :value="`${index}号楼`" v-for="index in 200" :key="index">
                          <span>{{`${index}号楼`}}</span>
                        </el-option>
                      </el-select>
                      <el-input v-show="filterForm1.Bdm == 1" style="width:150px;" value="" placeholder="自定义楼幢" v-model="filterForm1.buildingNumbers">
                      </el-input>
                    </el-form-item>

                    <el-form-item label="拍照人：">
                      <el-select size="small" v-model="filterForm1.userId" clearable style="width:150px;">
                        <el-option :label="val.appUserName" :value="val.appUserId" v-for="(val,index) in appUserList" :key="index">
                          <span>{{val.appUserName}}</span>
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="拍照时间：">
                      <el-date-picker size="small" style="width:300px" @change="pickerChange" v-model="filterForm1.editTime" type="datetimerange" align="right" placeholder="选择日期范围">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="照片标签">
                      <el-radio-group v-model="filterForm1.scoreLable">
                        <el-radio label="">
                          <span>全部</span>
                        </el-radio>
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
                    </el-form-item>
                  </div>
                </el-collapse-transition>
              </el-form>
            </el-col>
            <el-col style="position:relative;">
              <el-button type="primary" @click="onSearchSubmit(1)">查询</el-button>
              <el-button plain style="position:absolute;bottom:0;left:40%;min-width:80px;" @click="addShow1 = !addShow1">{{addShow1?'收起':'展开'}}</el-button>
            </el-col>
          </el-row>
          <p v-if="tableData1.rowCount <= 0" style="text-align:center;color: #777;margin-top:100px">无数据</p>
          <div class="tabletopbar" v-if="tableData1.rowCount > 0">
            <span style="margin-left:20px">查询结果：共</span>
            <span style="color:#111">{{tableData1.rowCount}}</span>
            <span>条</span>
            <span>批量操作</span>
            <el-radio-group v-model="filterForm1.allCheck" @change="allCheckeds(1)">
              <el-radio label="0">
                <span>全选</span>
              </el-radio>
              <el-radio label="1">
                <span>反选</span>
              </el-radio>
            </el-radio-group>
            <el-button type="primary" size="small" style="margin:0 8px;" @click="allSubmitAudit(1,2)">批量提交审核</el-button>
            <el-button type="primary" size="small" style="margin:0 8px;" @click="allSubmitAudit(1,4)">批量未通过</el-button>
            <el-button type="primary" size="small" style="margin:0 8px;" @click="allSubmitModify(1)">批量修改</el-button>
            <el-pagination v-show="tableData1.rowCount>0" 
                style="display: inline-block;margin-left: 8%;vertical-align: middle;height: 28px;" 
                layout="prev, pager, next,jumper" :page-size="filterForm1.pageSizes" :currentPage="currentPage1" 
                @current-change="currentChange($event,1)" :total="tableData1.rowCount">
            </el-pagination>
            <span>每页显示条数</span>
            <el-select v-model="filterForm1.pageSizes" placeholder="请选择" size="small" style="width:100px;" @change="addPageSizes(1)">
                <el-option label="6" :value="6"></el-option>
                <el-option label="12" :value="12"></el-option>
                <el-option label="24" :value="24"></el-option>
                <el-option label="48" :value="48"></el-option>
            </el-select>
          </div>

          <div class="audit-ine" style="overflow: hidden;display: flex;">
            <div class="audit" v-for="(val,index) in tableData1.picList" :key="index">
              <div class="audit-img" @click="f_checkout_img(index,1,$event)">
                <HouseAuditList :data="val" :detailType="val.detailType" :TagLists="TagList" v-on:tagUpdate="updata" />
                <div class="audit-ic">待提交</div>
                <div class="audit-ic2" style="background: blueviolet" v-show="val.reCameraStatus == 2 && val.scoreLable == '已整改'">
                  <i class="el-icon-edit"></i>
                </div>
                <div class="audit-check" v-if="val.isShow">
                  <i class="el-icon-check"></i>
                </div>
                <div class="audit-img-text" v-if="val.detailType == 1">
                  <span style="padding-left: 5px">{{val.area}}</span>
                  <!-- <span
                    v-if="val.detailType == 1">{{`大小：${val.videoSize ? val.videoSize : '--'}  &nbsp;时长：${val.videoTime ? val.videoTime : '--'}`}}</span> -->
                </div>
                <div class="audit-img-text" style="bottom: 0;" v-else>
                  <span style="padding-left: 5px">{{val.area}}</span>
                </div>
              </div>
              <div class="tableData2Icon">
                <span style="margin-left: 5px">{{val.scoreLable}}</span>
                <span>{{val.firstScore}}</span>
              </div>
              <div>
                <div class="audit-item">
                  <span>标题：</span>
                  <!-- <p class="audit-item-addw" :title="val.picTitle">{{val.picTitle}}</p> -->
                  <el-input 
                  :title="val.picTitle" 
                  v-model="val.picTitle" 
                  :maxlength="50"
                  @change="addInputChange(index,1)" 
                  :value="val.picTitle"></el-input>
                </div>
                <div class="audit-item">
                  <span>照片类型：</span>
                  <p>{{val.scoreConfig.slice(val.scoreConfig.indexOf('/') + 1)}}</p>
                </div>
                <div class="audit-item">
                  <span>拍照人：</span>
                  <p>{{val.userName}}</p>
                </div>
                <div class="audit-item">
                  <span>拍照时间：</span>
                  <p :class="val.timeStatus == 1? 'addCTime' : 'addCTimeRed' ">{{val.picTime}}</p>

                </div>
                <div class="audit-item">
                  <span>分享内容：</span>
                  <!-- <p class="audit-addp" :title="val.shareDesc">{{val.shareDesc}}</p> -->
                  <el-input :title="val.shareDesc" :maxlength="150" v-model="val.shareDesc" @change="addInputChange(index,1)" :value="val.shareDesc"></el-input>
                </div>
                <div class="audit-btn">
                  <el-button @click="dialogSubAudit(1,index)">提交审核</el-button>
                  <el-button @click="auditEdit(1,index,1)">查看</el-button>
                  <el-button @click="auditEdit(0,index,1)">编辑</el-button>
                </div>
              </div>
            </div>
          </div>
          <el-dialog title="提示:" :visible.sync="dialogVisibleAdd" width="30%" :before-close="handleClose">
            <el-form>
              <el-form-item label="执行操作：">
                <el-radio-group v-model="filterForm1.isPass">
                  <el-radio label="2">提交审核</el-radio>
                  <el-radio label="4">移入未通过</el-radio>
                </el-radio-group>
                <el-select v-if="filterForm1.isPass == '4'" clearable placeholder="选择未通过原因" v-model="filterForm1.rejectReason" style="width:250px">
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
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisibleAdd = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisibleHandler()">确 定</el-button>
            </span>
          </el-dialog>
          <el-dialog title="提示:" :visible.sync="dialogVisibleAdd2" width="30%" :before-close="handleClose">
            <el-form>
              <el-form-item label="执行操作：">
                <el-select clearable placeholder="选择未通过原因" v-model="filterForm1.rejectReason2" style="width:250px">
                  <el-option label="阶段缺失照片" value="阶段缺失照片">
                  </el-option>
                  <el-option label="照片模糊" value="照片模糊">
                  </el-option>
                  <el-option label="拍摄结果不完整" value="拍摄结果不完整">
                  </el-option>
                  <el-option label="拍摄角度不对" value="拍摄角度不对">
                  </el-option>斗图
                  <el-option label="其他" value="其他">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisibleAdd2 = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisibleHandler2(1,4,filterForm1.rejectReason2)">确 定</el-button>
            </span>
          </el-dialog>

          <!--<ExamineItem v-for="(item,index) in tableData1.list" :key="index" :geocoder="geocoder" :data="item" :type="1"-->
          <!--@updata="updata" :dataSwi="dataSwi"/>-->
          <el-pagination v-show="tableData1.rowCount>0" 
              style="margin: 0 auto;text-align:center;margin-top:20px" layout="prev, pager, next,jumper" 
              :page-size=filterForm1.pageSizes :currentPage="currentPage1" @current-change="currentChange($event,1)" 
              :total="tableData1.rowCount">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="待审核" name="2" v-if="NewTagsLists.list[1].status == 1">
          <el-row style="padding:20px 10px 0px 10px;border:1px solid #eee;margin-bottom:20px">
            <el-col :span="22">
              <el-form :model="filterForm2" class="demo-form-inline">
                <el-form-item label="分类：">
                  <el-radio-group v-model="filterForm2.detailType">
                    <el-radio label="">
                      <span>全部</span>
                    </el-radio>
                    <el-radio label="0">
                      <span>照片</span>
                    </el-radio>
                    <el-radio label="1">
                      <span>视频</span>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-collapse-transition>
                  <div class="transition-box" v-show="addShow2">
                    <el-form-item label="期数：">
                      <el-select :clearable="true" v-model="filterForm2.houseNumberId" @change="getHouseNumberList2(2)">
                        <el-option v-for="(item,index) in houseNumberList2" :key="item.houseNumber" :label="item.houseNumber" :value="item.houseNumberId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                <el-form-item label="地块：">
                    <el-select :clearable="true" v-model="filterForm2.massifId" placeholder="请选择地块">
                        <el-option v-for="item in massifList" :key="item.massifName" :label="item.massifName" :value="item.massifId">
                        </el-option>
                    </el-select>
                </el-form-item>
                    <ComGrap :selectLists="filterForm2" :type="2" where="house" v-on:photoL0="checkoutSelect" />

                    <el-form-item label="楼幢数：" v-show="filterForm2.talType == 2 && filterForm2.scoreConfigId.slice(2) == 7">
                      <el-select size="small" v-model="filterForm2.buildingNumber" clearable style="width:150px;" @change="bdmShow('2')">
                        <el-option label="自定义楼幢" value="0"></el-option>
                        <el-option :label="`${index}号楼`" :value="`${index}号楼`" v-for="index in 200" :key="index">
                          <span>{{`${index}号楼`}}</span>
                        </el-option>
                      </el-select>
                      <el-input v-show="filterForm2.Bdm == 1" style="width:150px;" value="" placeholder="自定义楼幢" v-model="filterForm2.buildingNumbers">
                      </el-input>
                    </el-form-item>

                    <el-form-item label="拍照人：">
                      <el-select size="small" v-model="filterForm2.userId" clearable style="width:150px;">
                        <el-option :label="val.appUserName" :value="val.appUserId" v-for="(val,index) in appUserList">
                          <span>{{val.appUserName}}</span>
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="拍照时间：">
                      <el-date-picker size="small" style="width:300px" @change="pickerChange1" v-model="filterForm2.editTime" type="datetimerange" align="right" placeholder="选择日期范围">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="照片标签">
                      <el-radio-group v-model="filterForm2.scoreLable">
                        <el-radio label="">
                          <span>全部</span>
                        </el-radio>
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
                    </el-form-item>
                  </div>
                </el-collapse-transition>
                <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :show-close="false" :before-close="handleClose">
                  <el-form-item label="选中图片是执行：">
                    <el-radio-group v-model="form.isPass" v-show="addIsShow">
                      <el-radio label="3">
                        <span>审核通过</span>
                      </el-radio>
                      <el-radio label="4">
                        <span>审核未通过</span>
                      </el-radio>
                    </el-radio-group>
                    <el-select v-if="form.isPass == '4'" clearable placeholder="选择未通过原因" v-model="form.rejectReason" style="width:250px">
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
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="cancleAllsh(2)">取 消</el-button>
                    <el-button type="primary" @click="allsh(2)">确 定</el-button>
                  </span>
                </el-dialog>
              </el-form>
            </el-col>
            <el-col style="psoition:relative;">
              <el-button type="primary" @click="onSearchSubmit(2)">查询</el-button>
              <el-button plain style="position:absolute;bottom:0;left:40%;min-width:80px;" @click="addShow2 = !addShow2">{{addShow2?'收起':'展开'}}</el-button>
            </el-col>
          </el-row>
          <p v-if="tableData2.rowCount <= 0" style="text-align:center;color: #777;margin-top:100px">无数据</p>
          <div class="tabletopbar" v-if="tableData2.rowCount > 0">
            <span style="margin-left:20px">查询结果：共</span>
            <span style="color:#111">{{tableData2.rowCount}}</span>
            <span>条</span>
            <span>批量操作</span>
            <el-radio-group v-model="filterForm2.allCheck" @change="allCheckeds(2)">
              <el-radio label="0">
                <span>全选</span>
              </el-radio>
              <el-radio label="1">
                <span>反选</span>
              </el-radio>
            </el-radio-group>
            <el-button type="primary" size="small" style="margin:0 8px;" @click="AlldialogVisible('','3')">批量审核通过</el-button>
            <el-button type="primary" size="small" style="margin:0 8px;" @click="AlldialogVisible('','4')">批量未通过</el-button>
            <el-button type="primary" size="small" style="margin:0 8px;" @click="allSubmitModify(2)">批量修改</el-button>
            <el-pagination v-show="tableData2.rowCount>0" 
                style="display: inline-block;margin-left:8%;vertical-align: middle;height: 28px;" 
                layout="prev, pager, next,jumper" :page-size="filterForm2.pageSizes" :currentPage="currentPage2" 
                @current-change="currentChange($event,2)" :total="tableData2.rowCount">
            </el-pagination>
             <span>每页显示条数</span>
            <el-select v-model="filterForm2.pageSizes" placeholder="请选择" size="small" style="width:100px;" @change="addPageSizes(2)">
                <el-option label="6" :value="6"></el-option>
                <el-option label="12" :value="12"></el-option>
                <el-option label="24" :value="24"></el-option>
                <el-option label="48" :value="48"></el-option>
            </el-select>
          </div>
          <div class="audit-ine" style="overflow: hidden;display: flex">
            <div class="audit" v-for="(val,index) in tableData2.picList" :key="index">
              <div class="audit-img" @click="f_checkout_img(index,2,$event)">
                <HouseAuditList :data="val" :detailType="val.detailType" :TagLists="TagList" v-on:tagUpdate="updata" />
                <div class="audit-ic" style="background: #000">待审核</div>
                <div class="audit-ic2" style="background: blueviolet" v-show="val.reCameraStatus == 2 && val.scoreLable == '已整改'">
                  <i class="el-icon-edit"></i>
                </div>
                <div class="audit-check" v-if="val.isShow">
                  <i class="el-icon-check"></i>
                </div>
                <div class="audit-img-text" v-if="val.detailType == 1">
                  <span style="padding-left: 5px">{{val.area}}</span>
                  <!-- <span
                    v-if="val.detailType == 1">{{`大小：${val.videoSize ? val.videoSize : '--'}  &nbsp时长：${val.videoTime ? val.videoTime : '--'}`}}</span> -->
                </div>
                <div class="audit-img-text" style="bottom: 0;" v-else>
                  <span style="padding-left: 5px">{{val.area}}</span>
                </div>
              </div>
              <div class="tableData2Icon">
                <span style="margin-left: 5px">{{val.scoreLable}}</span>
                <span>{{val.firstScore}}</span>
              </div>
              <div>
                <div class="audit-item">
                  <span>标题：</span>
                  <!-- <p class="audit-item-addw" :title="val.picTitle">{{val.picTitle}}</p> -->
                  <el-input 
                  :title="val.picTitle" 
                  v-model="val.picTitle" 
                  :maxlength="50"
                  @change="addInputChange(index,2)" 
                  :value="val.picTitle"></el-input>
                </div>
                <div class="audit-item">
                  <span>照片类型：</span>
                  <p>{{val.scoreConfig.slice(val.scoreConfig.indexOf('/') + 1)}}</p>
                </div>
                <div class="audit-item">
                  <span>拍照人：</span>
                  <p>{{val.userName}}</p>
                </div>
                <div class="audit-item">
                  <span>拍照时间：</span>
                  <p  :class="val.timeStatus == 1? 'addCTime' : 'addCTimeRed' ">{{val.picTime}}</p>
                </div>
                <div class="audit-item">
                  <span>分享内容：</span>
                  <!-- <p class="audit-addp" :title="val.shareDesc">{{val.shareDesc}}</p> -->
                  <el-input 
                  :title="val.shareDesc" 
                  v-model="val.shareDesc" 
                  :maxlength="150"
                  @change="addInputChange(index,2)" 
                  :value="val.shareDesc"></el-input>
                </div>
                <div class="audit-btn">
                  <el-button @click="AlldialogVisible(index)">审核</el-button>
                  <el-button @click="auditEdit(1,index,2)">查看</el-button>
                  <el-button @click="auditEdit(0,index,2)">编辑</el-button>
                </div>
              </div>
            </div>
          </div>

          <!--<ExamineItem v-for="(item,index) in tableData1.list" :key="index" :geocoder="geocoder" :data="item" :type="1"-->
          <!--@updata="updata" :dataSwi="dataSwi"/>-->
          <el-pagination v-show="tableData2.rowCount>0" 
              style="margin: 0 auto;text-align:center;margin-top:20px" layout="prev, pager, next,jumper" 
              :page-size="filterForm2.pageSizes" :currentPage="currentPage2" @current-change="currentChange($event,2)" :total="tableData2.rowCount">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="已审核" name="3" v-if="NewTagsLists.list[2].status == 1">

          <el-row style="padding:20px 10px 0px 10px;border:1px solid #eee;margin-bottom:20px">
            <el-col :span="22">
              <el-form :model="filterForm3" class="demo-form-inline">
                <el-form-item label="分类：">
                  <el-radio-group v-model="filterForm3.detailType">
                    <el-radio label="">
                      <span>全部</span>
                    </el-radio>
                    <el-radio label="0">
                      <span>照片</span>
                    </el-radio>
                    <el-radio label="1">
                      <span>视频</span>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-collapse-transition>
                  <div class="transition-box" v-show="addShow3">
                    <el-form-item label="期数：">
                      <el-select :clearable="true" v-model="filterForm3.houseNumberId" @change="getHouseNumberList2(3)">
                        <el-option v-for="(item,index) in houseNumberList2" :key="item.houseNumber" :label="item.houseNumber" :value="item.houseNumberId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                     <el-form-item label="地块：">
                        <el-select :clearable="true" v-model="filterForm3.massifId" placeholder="请选择地块">
                            <el-option v-for="item in massifList" :key="item.massifName" :label="item.massifName" :value="item.massifId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <ComGrap :selectLists.sync="filterForm3" :type="3" where="house" v-on:photoL0="checkoutSelect" />

                    <el-form-item label="楼幢数：" v-show="filterForm3.talType == 3 && filterForm3.scoreConfigId.slice(2) == 7">
                      <el-select size="small" v-model="filterForm3.buildingNumber" clearable style="width:150px;" @change="bdmShow('3')">
                        <el-option label="自定义楼幢" value="0"></el-option>
                        <el-option :label="`${index}号楼`" :value="`${index}号楼`" v-for="index in 200" :key="index">
                          <span>{{`${index}号楼`}}</span>
                        </el-option>
                      </el-select>
                      <el-input v-show="filterForm3.Bdm == 1" style="width:150px;" value="" placeholder="自定义楼幢" v-model="filterForm3.buildingNumbers">
                      </el-input>
                    </el-form-item>

                    <el-form-item label="拍照人/审核人：">
                    <el-select size="small" v-model="userexId" clearable style="width:150px;">
                        <el-option label="拍照人" :value="1"></el-option>
                        <el-option label="审核人" :value="2"></el-option>
                      </el-select>
                      <el-select size="small" v-model="filterForm3.userId" clearable style="width:150px;" v-if="userexId == 1">
                        <el-option :label="val.appUserName" :value="val.appUserId" v-for="(val,index) in appUserList" :key="index">
                          <span>{{val.appUserName}}</span>
                        </el-option>
                      </el-select>
                      <el-select size="small" v-model="filterForm3.examineId" clearable style="width:150px;" v-if="userexId == 2">
                        <el-option :label="val.examine" :value="val.examineId" v-for="(val,index) in examineUserList" :key="index">
                          <span>{{val.examine}}</span>
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="拍照时间/审核时间：">
                     <el-select size="small" v-model="userexTime" clearable style="width:150px;">
                        <el-option label="拍照时间" :value="1"></el-option>
                        <el-option label="审核时间" :value="2"></el-option>
                      </el-select>
                      <el-date-picker size="small" 
                        v-if="userexTime == 1"
                        style="width:300px"
                        @change="pickerChange2" 
                        v-model="filterForm3.editTime" 
                        type="datetimerange" align="right" 
                        placeholder="选择日期范围">
                      </el-date-picker>
                      <el-date-picker size="small" 
                        style="width:300px" 
                        v-if="userexTime == 2"
                        @change="pickerChangeAdd" 
                        v-model="filterForm3.editTime2" 
                        type="datetimerange" align="right" 
                        placeholder="选择日期范围">
                      </el-date-picker>
                    </el-form-item>

                    <el-form-item label="照片Id：">
                      <el-input v-model="filterForm3.picId" style="width:300px" placeholder="请输入照片Id"></el-input>
                    </el-form-item>

                    <el-form-item label="照片标签">
                      <el-radio-group v-model="filterForm3.scoreLable">
                        <el-radio label="">
                          <span>全部</span>
                        </el-radio>
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
                    </el-form-item>
                    <el-form-item label="是否推送">
                      <el-radio-group v-model="filterForm3.pushStatus">
                        <el-radio label="">
                          <span>全部</span>
                        </el-radio>
                        <el-radio label="1">
                          <span>已推送</span>
                        </el-radio>
                        <el-radio label="0">
                          <span>未推送</span>
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </div>
                </el-collapse-transition>
              </el-form>
            </el-col>
            <el-col style="position:relative;">
              <el-button type="primary" @click="onSearchSubmit(3)">查询</el-button>
              <el-button plain style="position:absolute;bottom:0;left:40%;min-width:80px;" @click="addShow3 = !addShow3">{{addShow3?'收起':'展开'}}</el-button>
            </el-col>
          </el-row>

          <p v-if="tableData3.rowCount <= 0" style="text-align:center;color: #777;margin-top:100px">无数据</p>
          <div class="tabletopbar" v-if="tableData3.rowCount > 0">
            <span style="margin-left:20px">查询结果：共</span>
            <span style="color:#111">{{tableData3.rowCount}}</span>
            <span>条</span>
            <span>批量操作</span>
            <el-radio-group v-model="filterForm3.allCheck" @change="allCheckeds(3)">
              <el-radio label="0">
                <span>全选</span>
              </el-radio>
              <el-radio label="1">
                <span>反选</span>
              </el-radio>
            </el-radio-group>
            <el-button type="primary" size="small" @click="allSubmitAudit(3)" style="margin:0 6px;">批量引用</el-button>
            <el-button type="primary" size="small" @click="allSubmitTS(1)" style="margin:0 6px;">批量推送</el-button>
            <el-button type="primary" size="small" @click="allSubmitTS(2)" style="margin:0 6px;">批量取消推送</el-button>
            <el-button type="primary" size="small" style="margin:0 8px;" @click="allSubmitModify(3)">批量修改</el-button>
            <el-pagination v-show="tableData3.rowCount>0" 
                style="display: inline-block;margin-left:4%;vertical-align: middle;height: 28px;" 
                layout="prev, pager, next,jumper" :page-size="filterForm3.pageSizes" :currentPage="currentPage3" 
                @current-change="currentChange($event,3)" :total="tableData3.rowCount">
            </el-pagination>
             <span>每页显示条数</span>
            <el-select v-model="filterForm3.pageSizes" placeholder="请选择" size="small" style="width:100px;" @change="addPageSizes(3)">
                <el-option label="6" :value="6"></el-option>
                <el-option label="12" :value="12"></el-option>
                <el-option label="24" :value="24"></el-option>
                <el-option label="48" :value="48"></el-option>
            </el-select>
          </div>
          <div class="audit-ine" style="overflow: hidden;display: flex">
            <div class="audit" v-for="(val,index) in tableData3.picList" :key="index" style="height:690px;">
              <div class="audit-img" @click="f_checkout_img(index,3,$event)" style="height:300px;">
                <HouseAuditList :data="val" :detailType="val.detailType" :TagLists="TagList" v-on:tagUpdate="updata" />
                <div class="audit-ic" style="background: greenyellow">已审核</div>
                <div class="audit-ic2" style="background: blueviolet" v-show="val.reCameraStatus == 2 && val.scoreLable == '已整改'">
                  <i class="el-icon-edit"></i>
                </div>
                <div class="audit-check" v-if="val.isShow">
                  <i class="el-icon-check"></i>
                </div>
                <div class="audit-img-text" v-if="val.detailType == 1">
                  <span style="padding-left: 5px">{{val.area}}</span>
                  <!-- <span
                    v-if="val.detailType == 1">{{`大小：${val.videoSize ? val.videoSize : '--'}  &nbsp时长：${val.videoTime ? val.videoTime : '--'}`}}</span> -->
                </div>
                <div class="audit-img-text" style="bottom: 0;" v-else>
                  <span style="padding-left: 5px">{{val.area}}</span>
                </div>
              </div>
              <div class="tableData2Icon">
                <span style="margin-left: 5px">{{val.scoreLable}}</span>
                <span>{{val.firstScore}}</span>
                <span v-show="val.quoteStatus == 1">已引用</span>
              </div>
              <div>
                <div class="audit-item">
                  <span>标题：</span>
                  <!-- <p class="audit-item-addw" :title="val.picTitle">{{val.picTitle}}</p> -->
                  <el-input 
                  :title="val.picTitle" 
                  v-model="val.picTitle" 
                  :maxlength="50"
                  @change="addInputChange(index,3)" 
                  :value="val.picTitle"></el-input>
                </div>
                <div class="audit-item">
                  <span>照片类型：</span>
                  <p>{{val.scoreConfig.slice(val.scoreConfig.indexOf('/') + 1)}}</p>
                </div>
                <div class="audit-item">
                  <span>{{val.emId == 1 ? '上传人：' : '拍照人：'}}</span>
                  <p>{{val.userName}}</p>
                </div>
                <div class="audit-item">
                  <span>{{val.emId == 1 ? '上传时间：' : '拍照时间：'}}</span>
                  <p  :class="val.timeStatus == 1? 'addCTime' : 'addCTimeRed' ">{{val.picTime}}</p>
                </div>
                <div class="audit-item">
                  <span>审核人：</span>
                  <p>{{val.examine}}</p>
                </div>
                <div class="audit-item">
                  <span>审核时间：</span>
                  <p>{{val.examineTime}}</p>
                </div>
                <div class="audit-item">
                  <span>分享内容：</span>
                  <!-- <p class="audit-addp" :title="val.shareDesc">{{val.shareDesc}}</p> -->
                  <el-input 
                  :title="val.shareDesc" 
                  v-model="val.shareDesc" 
                  :maxlength="150"
                  @change="addInputChange(index,3)" 
                  :value="val.shareDesc"></el-input>
                </div>
                <div class="audit-btn">
                  <el-button @click="auditEdit(0,index,3)">编辑</el-button>
                  <el-button @click="auditEdit(1,index,3)">查看</el-button>
                  <el-button @click="auditEditPush(index,3)" style="background: #149BD3;color: #fff;" v-if="tableData3.picList[index].pushStatus == 0">
                    <span>推送</span>
                  </el-button>
                  <el-button @click="auditEditPush(index,3)" style="background: red;color: #fff;" v-else>
                    <span>取消推送</span>
                  </el-button>
                  <el-button v-if="val.detailType != 1" @click="addCites(index,3)" style="background: #333;color: #fff;">报告引用</el-button>
                </div>
              </div>
            </div>
            <!--//弹框-->
            <el-dialog title="报告引用" :visible.sync="dialogFormVisible" :closeOnClickModal="false" :showClose="false">
              <el-form :model="filterForm5">

                <el-form-item label="楼盘期数" :label-width="formLabelWidth" required>
                  <el-select :clearable="true" v-if="$route.query.type!='view'" v-model="filterForm5.houseNumberId" @change="getbaogao" placeholder="请选择期数">
                    <el-option v-for="(item,index) in houseNumberList" :key="item.houseNumber" :label="item.houseNumber" :value="item.houseNumberId">
                    </el-option>
                  </el-select>
                  <span v-else>{{form.reportVersion}}</span>
                </el-form-item>

                <el-form-item label="选择引用报告：" :label-width="formLabelWidth" required>
                  <el-select v-model="filterForm5.buildingConstructionReportId" :disabled="filterForm5.houseNumberId=='' && filterForm5.houseNumberId !== 0" placeholder="请选择引用报告" style="width:50%">
                    <el-option v-for="item in tableData5.list" :key="item.value" :label="item.reportName" :value="item.reportId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item required label="报告类型：" :label-width="formLabelWidth">
                  <el-radio-group v-model="filterForm5.lableType">
                    <el-radio :label="1">建设进度</el-radio>
                    <el-radio :label="2">施工现场</el-radio>
                    <el-radio :label="3">整改记录</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="类别选择：" v-if="filterForm5.lableType == 1" required :label-width="formLabelWidth">
                  <el-select v-model="filterForm5.typeId" placeholder="请选择" style="width:50%">
                    <el-option label="整体进度" :value="1"></el-option>
                    <el-option label="园区进度" :value="2"></el-option>
                    <el-option label="楼栋进度" :value="3"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="楼栋号：" v-if="filterForm5.picLists.length <= 1" :label-width="formLabelWidth" v-show="filterForm5.typeId == 3 && filterForm5.lableType == 1">

                  <span v-model="filterForm5.picList[0].buildingNum">{{filterForm5.picList[0].buildingNum}}</span>
                </el-form-item>

                <EstateConstructionReportCons2 :_buildingId.sync="filterForm5.buildingId" v-show="filterForm5.lableType == 2" />

                <el-form-item label="照片描述：" v-if="(filterForm5.lableType == 1 || filterForm5.lableType == 2) && filterForm5.picLists.length <= 1" :label-width="formLabelWidth">
                  <el-input v-if="" type="textarea" :roes="4" resize="none" style="width:50%" v-model="filterForm5.picList[0].picDesc" placeholder="照片描述(请输入0-50字)" :maxlength="50"></el-input>
                </el-form-item>

                <el-form-item label="整改阶段：" v-if="filterForm5.lableType == 3 && filterForm5.picLists.length <= 1" required :label-width="formLabelWidth">
                  <el-select v-model="filterForm5.typeId" placeholder="请选择" style="width:50%">
                    <el-option label="整改前" :value="1"></el-option>
                    <el-option label="整改后" :value="2"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="问题点描述：" v-if="filterForm5.lableType == 3 && filterForm5.typeId == 1 && filterForm5.picLists.length <= 1" required :label-width="formLabelWidth">
                  <el-input type="textarea" :roes="4" resize="none" style="width:50%" v-model="filterForm5.wholeDesc" placeholder="问题点描述(请输入0-50字)" :maxlength="50"></el-input>
                </el-form-item>

                <el-form-item label="已整改问题点描述：" v-if="filterForm5.lableType == 3 && filterForm5.typeId == 2 && filterForm5.picLists.length <= 1" required :label-width="formLabelWidth">
                  <el-input type="textarea" :roes="4" resize="none" style="width:50%" v-model="filterForm5.questionPoint" placeholder="整体描述(请输入0-50字)" :maxlength="50"></el-input>
                </el-form-item>

              </el-form>

              <div slot="footer" class="dialog-footer">
                <el-button @click="quoteCancle">取 消</el-button>
                <el-button type="primary" @click="subQuote" :disabled="addDisable">确 定</el-button>
              </div>
            </el-dialog>
          </div>

          <el-pagination v-show="tableData3.rowCount>0" 
              style="margin: 0 auto;text-align:center;margin-top:20px" layout="prev, pager, next,jumper" 
              :page-size="filterForm3.pageSizes" :currentPage="currentPage3" @current-change="currentChange($event,3)" :total="tableData3.rowCount">
          </el-pagination>

        </el-tab-pane>
        <el-tab-pane label="未通过" name="4" v-if="NewTagsLists.list[3].status == 1">

          <el-row style="padding:20px 10px 0px 10px;border:1px solid #eee;margin-bottom:20px">
            <el-col :span="22">
              <el-form :model="filterForm4" class="demo-form-inline">
                <el-form-item label="分类：">
                  <el-radio-group v-model="filterForm4.detailType">
                    <el-radio label="">
                      <span>全部</span>
                    </el-radio>
                    <el-radio label="0">
                      <span>照片</span>
                    </el-radio>
                    <el-radio label="1">
                      <span>视频</span>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-collapse-transition>
                  <div class="transition-box" v-show="addShow4">
                    <el-form-item label="期数：">
                      <el-select :clearable="true" v-model="filterForm4.houseNumberId" @change="getHouseNumberList2(4)">
                        <el-option v-for="(item,index) in houseNumberList2" :key="item.houseNumber" :label="item.houseNumber" :value="item.houseNumberId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                     <el-form-item label="地块：">
                        <el-select :clearable="true" v-model="filterForm4.massifId" placeholder="请选择地块">
                            <el-option v-for="item in massifList" :key="item.massifName" :label="item.massifName" :value="item.massifId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <ComGrap :selectLists="filterForm4" :type="4" where="house" v-on:photoL0="checkoutSelect" />

                    <el-form-item label="楼幢数：" v-show="filterForm4.talType == 4 && filterForm4.scoreConfigId.slice(2) == 7">
                      <el-select size="small" v-model="filterForm4.buildingNumber" clearable style="width:150px;" @change="bdmShow('4')">
                        <el-option label="自定义楼幢" value="0"></el-option>
                        <el-option :label="`${index}号楼`" :value="`${index}号楼`" v-for="index in 200" :key="index">
                          <span>{{`${index}号楼`}}</span>
                        </el-option>
                      </el-select>
                      <el-input v-show="filterForm4.Bdm == 1" style="width:150px;" value="" placeholder="自定义楼幢" v-model="filterForm4.buildingNumbers">
                      </el-input>
                    </el-form-item>

                    <el-form-item label="拍照人：">
                      <el-select size="small" v-model="filterForm4.userId" clearable style="width:150px;">
                        <el-option :label="val.appUserName" :value="val.appUserId" v-for="(val,index) in appUserList">
                          <span>{{val.appUserName}}</span>
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="拍照时间：">
                      <el-date-picker size="small" style="width:300px" @change="pickerChange3" v-model="filterForm4.editTime" type="datetimerange" align="right" placeholder="选择日期范围">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="照片标签">
                      <el-radio-group v-model="filterForm4.scoreLable">
                        <el-radio label="">
                          <span>全部</span>
                        </el-radio>
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
                    </el-form-item>
                  </div>
                </el-collapse-transition>
              </el-form>
            </el-col>
            <el-col style="position:relative;">
              <el-button type="primary" @click="onSearchSubmit(4)">查询</el-button>
              <el-button plain style="position:absolute;bottom:0;left:40%;min-width:80px;" @click="addShow4 = !addShow4">{{addShow4?'收起':'展开'}}</el-button>
            </el-col>
          </el-row>

          <p v-if="tableData4.rowCount <= 0" style="text-align:center;color: #777;margin-top:100px">无数据</p>
          <div class="tabletopbar" v-if="tableData4.rowCount > 0">
            <span style="margin-left:20px">查询结果：共</span>
            <span style="color:#111">{{tableData4.rowCount}}</span>
            <span>条</span>
            <span style="display:inline-block;width:200px;"></span>
            <el-pagination v-show="tableData4.rowCount>0" 
                style="display: inline-block;margin-left: 8%;vertical-align: middle;height: 28px;" 
                layout="prev, pager, next,jumper" :page-size="filterForm4.pageSizes" :currentPage="currentPage4" 
                @current-change="currentChange($event,4)" :total="tableData4.rowCount">
            </el-pagination>
             <span>每页显示条数</span>
            <el-select v-model="filterForm4.pageSizes" placeholder="请选择" size="small" style="width:100px;" @change="addPageSizes(4)">
                <el-option label="6" :value="6"></el-option>
                <el-option label="12" :value="12"></el-option>
                <el-option label="24" :value="24"></el-option>
                <el-option label="48" :value="48"></el-option>
            </el-select>
          </div>
          <div class="audit-ine" style="overflow: hidden;display: flex">
            <div class="audit" v-for="(val,index) in tableData4.picList" :key="index" style="height: 660px;">
              <div class="audit-img">
                <HouseAuditList :data="val" :detailType="val.detailType" :isView="true" />
                <div class="audit-ic" style="background: red">未通过</div>
                <div class="audit-ic2" style="background: blueviolet" v-show="val.reCameraStatus == 2 && val.scoreLable == '已整改'">
                  <i class="el-icon-edit"></i>
                </div>
                <div class="audit-check" v-if="val.isShow">
                  <i class="el-icon-check"></i>
                </div>
                <div class="audit-img-text" v-if="val.detailType == 1">
                  <span style="padding-left: 5px">{{val.area}}</span>
                  <!-- <span
                    v-if="val.detailType == 1">{{`大小：${val.videoSize ? val.videoSize : '--'}  &nbsp时长：${val.videoTime ? val.videoTime : '--'}`}}</span> -->
                </div>
                <div class="audit-img-text" style="bottom: 0;" v-else>
                  <span style="padding-left: 5px">{{val.area}}</span>
                </div>
              </div>
              <div class="tableData2Icon">
                <span style="margin-left: 5px">{{val.scoreLable}}</span>
                <span>{{val.firstScore}}</span>
              </div>
              <div>
                <div class="audit-item">
                  <span>标题：</span>
                  <p class="audit-item-addw" :title="val.picTitle">{{val.picTitle}}</p>
                </div>
                <div class="audit-item">
                  <span>照片类型：</span>
                  <p>{{val.scoreConfig.slice(val.scoreConfig.indexOf('/') + 1)}}</p>
                </div>
                <div class="audit-item">
                  <span>未通过原因：</span>
                  <p>{{val.rejectReason}}</p>
                </div>
                <div class="audit-item">
                  <span>拍照人：</span>
                  <p>{{val.userName}}</p>
                </div>
                <div class="audit-item">
                  <span>拍照时间：</span>
                  <p  :class="val.timeStatus == 1? 'addCTime' : 'addCTimeRed' ">{{val.picTime}}</p>
                </div>
                <div class="audit-item">
                  <span>审核人：</span>
                  <p>{{val.examine}}</p>
                </div>
                <div class="audit-item">
                  <span>审核时间：</span>
                  <p>{{val.examineTime}}</p>
                </div>
                <div class="audit-item">
                  <span>分享内容：</span>
                  <p class="audit-addp" :title="val.shareDesc">{{val.shareDesc}}</p>
                </div>
                <div class="audit-btn">
                  <el-button @click="auditEdit(1,index,4)">查看</el-button>
                </div>
              </div>
            </div>
          </div>
          <el-pagination v-show="tableData4.rowCount>0" 
              style="margin: 0 auto;text-align:center;margin-top:20px" layout="prev, pager, next,jumper" 
              :page-size="filterForm4.pageSizes" :currentPage="currentPage4" @current-change="currentChange($event,4)" :total="tableData4.rowCount">
          </el-pagination>
        </el-tab-pane>
        <!-- <el-tab-pane :label="'质量寻光('+count+')'" name="5" v-if="status == 1">

        </el-tab-pane> -->
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
import ComGrap from "../../Common/ComGrap/comGrap2.vue";
import EstateConstructionReportCons2 from "../../EstateConstructionReportCons/EstateConstructionReportCons2";
import HouseAuditList from "../../Common/houseAuditList/houseAuditList.vue";

export default {
  name: "managers",
  components: {
    Subnav2,
    ExamineItem,
    Cascader,
    ComGrap,
    EstateConstructionReportCons2,
    HouseAuditList
  },
  data() {
    return {
      addShow1: false,
      addShow2: false,
      addShow3: false,
      addShow4: false,
      addDisable: false,
      dialogVisible: false,
      dialogFormVisible: false,
      dialogVisibleAdd: false,
      dialogVisibleAdd2: false,
      dialogVisibleAddValue: "",
      is_loading_tab: false,
      appUserList: [],
      examineUserList:[],
      TagList: {},
      isAll: null,
      form: {
        picId: "",
        isPass: "",
        rejectReason: ""
      },
      formLabelWidth: "150px",
      radio: "1",
      activeName: "1",
      currentPage1: 1,
      currentPage2: 1,
      currentPage3: 1,
      currentPage4: 1,
      navList: [
        { path: "/monitoring/monitoringHouseAudit", name: "首页" },
        { path: "/monitoring/monitoringHouseAudit?datas="+JSON.stringify(this.$route.query.datas), name: "监控楼盘审核" },
        { path: this.$route.fullPath, name: this.$route.query.name }
      ],
      filterForm1: {
        id: this.$route.query.id,
        talType: "1",
        allCheck: "",
        picEditList: [],
        pageNum: 0,
        pageSize: 6,
        isPass: "",
        scoreLable: "",
        picIsPass: "1",
        menuId: "",
        menuChildId: "",
        menuGrandId: "",
        userId: "",
        userValue: "",
        editTime: "",
        timeType: "1",
        ptStarTime: "",
        scoreConfigId: "",
        ptEndTime: "",
        reCameraStatus: [],
        buildingNumber: "",
        Bdm: 0,
        buildingNumbers: "",
        pushStatus: "",
        detailType: "",
        rejectReason: "",
        rejectReason2: "",
        houseNumberId: "",
        massifName:"",
        massifId:"",
        pageSizes:6,
        inputListNumber:[]
      },
      tableData1: {
        rowCount: 0,
        list: []
      },
      filterForm2: {
        picEditList: [],
        id: this.$route.query.id,
        talType: "2",
        allCheck: "",
        scoreLable: "",
        pageNum: 0,
        pageSize: 6,
        isPass: "2",
        picIsPass: "2",
        menuId: "",
        menuChildId: "",
        menuGrandId: "",
        userId: "",
        userValue: "",
        editTime: "",
        timeType: "1",
        ptStarTime: "",
        ptEndTime: "",
        isTop: "",
        scoreConfigId: "",
        reCameraStatus: [],
        buildingNumber: "",
        Bdm: 0,
        buildingNumbers: "",
        pushStatus: "",
        detailType: "",
        picList: [],
        picLists: [],
        houseNumberId: "",
        massifName:"",
        massifId:"",
        pageSizes:6,
        inputListNumber:[]
      },
      tableData2: {
        rowCount: 0,
        list: [],
        reCameraStatus: ""
      },
      filterForm3: {
        id: this.$route.query.id,
        talType: "3",
        allCheck: "",
        picEditList: [],
        pageNum: 0,
        pageSize: 6,
        scoreLable: "",
        isPass: "2",
        picIsPass: "3",
        menuId: "",
        menuChildId: "",
        menuGrandId: "",
        userId: "",
        userValue: "",
        editTime: "",
        editTime2: "",
        timeType: "1",
        ptStarTime: "",
        ptEndTime: "",
        scoreConfigId: "",
        reCameraStatus: [],
        buildingNumber: "",
        Bdm: 0,
        buildingNumbers: "",
        pushStatus: "",
        emId: "",
        detailType: "",
        picId: "",
        houseNumberId: "",
        massifName:"",
        massifId:"",
        pageSizes:6,
        examineId:"",
        exStarTime:"",
        exEndTime:"",
        inputListNumber:[]
      },
      tableData3: {
        rowCount: 0,
        list: []
      },
      filterForm4: {
        id: this.$route.query.id,
        picEditList: [],
        talType: "4",
        allCheck: "",
        pageNum: 0,
        pageSize: 6,
        scoreLable: "",
        isPass: "2",
        picIsPass: "3",
        menuId: "",
        menuChildId: "",
        menuGrandId: "",
        userId: "",
        userValue: "",
        editTime: "",
        timeType: "1",
        ptStarTime: "",
        ptEndTime: "",
        scoreConfigId: "",
        reCameraStatus: [],
        buildingNumber: "",
        Bdm: 0,
        buildingNumbers: "",
        pushStatus: "",
        detailType: "",
        houseNumberId: "",
        massifName:"",
        massifId:"",
        pageSizes:6,
        inputListNumber:[]
      },
      tableData4: {
        rowCount: 0,
        list: []
      },
      filterForm5: {
        buildingConstructionReportId: "",
        lableType: 1, //报告类型
        typeId: null, //类别
        buildingId: null,
        houseNumberId: "", // 期数
        houseNumberId2: "", // 期数
        picList: [
          {
            picDesc: "", //图片描述
            picUrl: "", //图片地址
            buildingNum: "", //楼栋号
            picId: ""
          }
        ],
        menuId: "",
        menuChildId: "",
        menuGrandId: "",
        questionPoint: "", // 问题点描述
        wholeDesc: "", // 整体描述
        buildingConstructionReportId2: null, //localStroge
        id: "", // 整改ID
        scoreLableAdd: "",
        allCheck: "",
        picLists: [], //存储批量引用img
        scoreConfigList: [], //存储批量引用scoreConfig
        scoreLableList: [],
        buildingNumList: [],
        quoteStatusList: []
      },
      detailTypeList: [],
      tableData5s: [],
      tableData5: {
        //获取下啦数据
        rowCount: 0,
        list: []
      },
      selectedOptions2: [],
      houseNumberIdList: [],
      massifList:[],
      houseNumberList: "",
      houseNumberList2: "",
      addTitleAndDes: [],
      options: [],
      save: null,
      selectList: [],
      dataSwi: false,
      geocoder: null,
      pushList: [],
      addIsShow: false,
      addIsShow2: false,
      count: "",
      status: 0,
      NewTagsLists:{
          list:[
              {
                status:1
            },
            {
                status:1
            },
            {
                status:1
            },
            {
                status:1
            },
          ]
      },
      userexId:1,
      userexTime:1,
    };
  },
  computed: {},
  created() {
    this.init();
    this.addNewTagsLists();
    if (this.$route.query.activeName || this.$route.query.page) {
      try {
        this.activeName = this.$route.query.activeName;
        if(this.$store.state.houseAuditSearch){
            this[`filterForm${this.activeName}`] = JSON.parse(
            this.$store.state.houseAuditSearch
        );
        }
        if (this.$route.query.page || this.$route.query.page == "0") {
          this.currentChange(this.$route.query.page + 1, this.activeName);
        }
      } catch (e) {
        this.getData(this.activeName);
      }
    } else {
        this.getData(this.activeName);
    }
    this.getHouseNumberList2(this.activeName);
  },
  methods: {
    handleClose() {},
    //tab切换
    handleClick() {
      if (this.activeName == 5) {
        this.$router.push({
          path: "/unopened/unopenedexaminelist",
          query: {
            id: this.$route.query.id,
            name: this.$route.query.name
          }
        });
      } else {
        this.getData(this.activeName);
      }
       this.getHouseNumberList2(this.activeName);
    },
    init() {
      let objTag = this.$store.state.getBuildingNum;
      let cit = this.$store.state.getSelevtCit;
      let ese = window.localStorage.eSelectList;
      let isO = "";
      if (objTag) {
        isO = this.isNull(objTag);
      }

      if (isO) {
        this.getTagList();
      } else {
        this.TagList = objTag;
      }

      if (!cit || cit.id != this.$route.query.id) {
        this.getSelevtCit();
      } else {
        this.tableData5 = cit;
      }

      if (!ese) {
        this.getSelectData();
      } else {
        this.selectList = JSON.parse(ese);
      }
    },
    //判断对象是否为空
    isNull(obj) {
      var data = {};
      var arr = Object.keys(obj);
      if (arr.length == 0) {
        return true;
      } else {
        return false;
      }
    },
    //批量审核
    AlldialogVisible(index, isp) {
      if (typeof index != "number") {
        if (this[`filterForm2`].picEditList.length <= 0) {
          this.$message({
            type: "error",
            message: "请至少选择一张图片"
          });
          return;
        }
      }
      if (index != "" || index == "0") {
        this.tableData2.reCameraStatus = this.tableData2.picList[
          index
        ].reCameraStatus;
        this.isAll = index;
        this.dialogVisible = true;
        this.addIsShow = true;
      } else {
        this.form.isPass = isp;
        this.addIsShow = false;
        this.isAll = null;
        if (isp == 3) {
          this.allsh(2);
        } else if (isp == 4) {
          this.dialogVisible = true;
        }
      }
    },
    //批量审核
    allsh(type) {
      if (this.form.isPass == "") {
        this.$message({
          type: "error",
          message: "有必填项为选择"
        });
        return;
      }
      if (this.form.isPass == "4") {
        if (this.form.rejectReason == "") {
          this.$message({
            type: "error",
            message: "有必填项为选择"
          });
          return;
        }
      }

      this.$confirm("确认提交审核选中照片?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let [body] = [_.cloneDeep(this.form)];
          // let body = {};
          body.picList = [];

          if (this.isAll == null) {
            // body.picId = this[`filterForm${type}`].picEditList.slice(',').join(',');
            // body.reCameraStatus = this[`filterForm${type}`].reCameraStatus.slice(',').join(',');
            body.picList = this[`filterForm${type}`].picList;
          } else {
            // body.picId = this[`tableData${type}`].picList[this.isAll].picId;
            // body.reCameraStatus = this.tableData2.reCameraStatus;
            body.picList.push(this[`tableData${type}`].picList[this.isAll]);
          }
          this.$http(
            "/buildingCamera/editAuditPassAndSchedule",
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
              this[`filterForm${type}`].picEditList.length = 0;
              this.updata();
              this[`filterForm${type}`].picList = [];
              this.dialogVisible = false;
              this.filterForm2.allCheck = "";
              this.form.isPass = "";
              this.form.rejectReason = "";
              this[`filterForm${type}`].reCameraStatus = [];
            }
          });
        })
        .catch(() => {
          console.log("cancle");
        });
    },
    // 取消
    cancleAllsh(type) {
      this.dialogVisible = false;
      this[`filterForm${type}`].picEditList.length = 0;
      this[`filterForm${type}`].picList = [];
      this.dialogVisible = false;
      this.filterForm2.allCheck = "";
      this.form.isPass = "";
      this.form.rejectReason = "";
      this[`filterForm${type}`].reCameraStatus = [];
      for (let i in this[`tableData${type}`].picList) {
        this.$set(this[`tableData${type}`].picList[i], "isShow", false);
      }
    },
    // 单个提交弹出框
    dialogSubAudit(type, index) {
      this.dialogVisibleAddValue = index;
      this.dialogVisibleAdd = true;
      // this.dialogVisibleHandler(type, index);
    },
    //单个提交审核
    dialogVisibleHandler() {
      if (this.filterForm1.isPass == "") {
        this.$message({
          type: "error",
          message: "请选择执行操作类型!"
        });
        return;
      }
      if (this.filterForm1.isPass == 4 && this.filterForm1.rejectReason == "") {
        this.$message({
          type: "error",
          message: "有必填项未填写！!"
        });
        return;
      }

      this.$confirm("确认提交审核选中照片?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let [body] = [
            {
              picId: this[`tableData${1}`].picList[this.dialogVisibleAddValue]
                .picId,
              isPass: this.filterForm1.isPass,
              rejectReason: this.filterForm1.rejectReason
            }
          ];
          this.$http(
            "/buildingCamera/submissionAudit",
            { body },
            {},
            {},
            "post"
          ).then(res => {
            if (res.data.code == 0) {
              this.dialogVisibleAdd = false;
              this.$message({
                type: "success",
                message: "提交成功!"
              });
              this[`filterForm${1}`].picEditList.length = 0;
              this.filterForm1.rejectReason = "";
              this.filterForm1.isPass = "";
              this.getData("1");
            }
          });
        })
        .catch(() => {});
    },
    //获取标签列表
    getTagList() {
      let body = {};
      this.$http(
        "/buildingContribution/getBuildingContributionPicLabel",
        { body },
        {},
        {},
        "post"
      )
        .then(res => {
          this.TagList = res.data.response;
          this.$store.dispatch("getBuildingNum", this.TagList);
        })
        .catch(() => {});
    },

    //批量提交审核
    allSubmitAudit(type, isPas) {
      if (this[`filterForm${type}`].picEditList.length < 1) {
        this.$message({
          type: "error",
          message: "请选择至少一张图片!"
        });
        return;
      }
      let isp = "";
      if (type == 1) {
        if (isPas == 2) {
          isp = isPas;
        } else if (isPas == 4) {
          isp = isPas;
        }
        if (isPas == 2) {
          this.subTiJiaoFun(type, isPas, this.filterForm1.rejectReason);
        } else if (isPas == 4) {
          this.dialogVisibleAdd2 = true;
        }
      } else if (type == 3) {
        for (let item in this.houseNumberIdList) {
          if (!this.houseNumberIdList[item] && this.houseNumberIdList[item] !==0) {
            this.$message({
              type: "error",
              message: "期数信息为空，无法引用!"
            });
            this.clearFilter5();
            return;
          }
          if (this.detailTypeList[item] == 1) {
            this.$message({
              type: "warning",
              message: "视频文件不支持引用!"
            });
            this.clearFilter5();
            return;
          }
        }
        this.getHouseNumberList();
        let [body] = [
          {
            firstScore: this[`filterForm${5}`].scoreConfigList
              .slice(",")
              .join(",")
          }
        ];
        this.$http(
          "/buildingCamera/isAllowReference",
          { body },
          {},
          {},
          "post"
        ).then(res => {
          if (res.data.code == 0) {
            if (res.data.response.status == "1") {
              this.dialogFormVisible = true;

              for (let i in this.filterForm5.picLists) {
                if (this.filterForm5.quoteStatusList[i] == 1) {
                  this.addDisable = true;
                }
              }
              if (this.filterForm5.scoreLableList.length <= 1) {
                this.filterForm5.scoreLableAdd = this.filterForm5.scoreLableList[0];
                this.filterForm5.picList[0].picId = this.filterForm3.picEditList[0];
                // console.log(this.filterForm3.picEditList[0]);

                let strs = this.filterForm5.buildingNumList;
                let str = strs.join("");
                // console.log(this.filterForm5.buildingNumList,str);
                if (str) {
                  this.filterForm5.picList[0].buildingNum = str.substr(
                    0,
                    str.length - 2
                  );
                } else {
                  this.filterForm5.picList[0].buildingNum =
                    "当前照片无楼幢号信息";
                }
              }
              // this.updata(3);
            } else if (res.data.response.status == "2") {
              this.$message({
                type: "warning",
                message: "选择错误!"
              });
              this.filterForm3.allCheck = "";
              this[`filterForm${5}`].picLists.length = 0;
              this[`filterForm${5}`].scoreConfigList.length = 0;
              this[`filterForm${5}`].scoreLableList.length = 0;
              this[`filterForm${5}`].buildingNumList.length = 0;
              this[`filterForm${5}`].quoteStatusList.length = 0;
              this[`filterForm${type}`].picEditList.length = 0;
              this.updata();
              this.dialogFormVisible = false;
            }
          }
        });
      }
    },
    // 批量未通过
    dialogVisibleHandler2(type, isPas, rejectR) {
      if (this.filterForm1.rejectReason2 == "") {
        this.$message({
          type: "error",
          message: "请选择未通过原因!"
        });
        return;
      }
      this.subTiJiaoFun(type, isPas, rejectR);
    },
    // 提交方法
    subTiJiaoFun(type, isPas, rejectR) {
      this.$confirm("确认提交审核选中照片?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let [body] = [
            {
              picId: this[`filterForm${type}`].picEditList.slice(",").join(","),
              isPass: isPas,
              rejectReason: rejectR
            }
          ];
          this.$http(
            "/buildingCamera/submissionAudit",
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
              this[`filterForm${type}`].picEditList.length = 0;
              this.filterForm1.allCheck = "";
              this.filterForm1.rejectReason2 = "";
              this.dialogVisibleAdd2 = false;
              this.getData(1);
            }
          });
        })
        .catch(() => {
          this.dialogVisibleAdd2 = false;
          this.filterForm1.rejectReason2 == "";
        });
    },
    //推送
    auditEditPush(index, type) {
      let pushStatus = this[`tableData${type}`].picList[index].pushStatus;
      let msg1 = "";
      let ind = "";
      if (pushStatus == 0) {
        msg1 = "确认推送照片吗?";
        ind = 1;
      } else {
        msg1 = "确认取消推送照片吗?";
        ind = 2;
      }
      this.$confirm(msg1, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let val = this[`tableData${type}`].picList[index];
          let body = { list: [] };
          body.list.push(this[`tableData${type}`].picList[index]);
          body.pushId = ind;
          this.setPushFun(body);
        })
        .catch(res => {
          this.$message({
            type: "success",
            message: "取消推送!"
          });
        });
    },
    //批量推送
    allSubmitTS(ind) {
      if (this.pushList < 1) {
        this.$message({
          type: "error",
          message: "请选择至少一张图片!"
        });
        return;
      }
      let msg1 = "";
      if (ind == 1) {
        msg1 = "确认推送照片吗?";
      } else {
        msg1 = "确认取消推送照片吗?";
      }
      this.$confirm(msg1, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let body = { list: this.pushList };
          body.pushId = ind;
          this.setPushFun(body);
        })
        .catch(res => {
          this.$message({
            type: "success",
            message: "取消推送!"
          });
          this.clearFilter5();
        });
    },
    setPushFun(body) {
      this.$http(
        "/buildingCamera/batchPushAPPPic",
        { body },
        {},
        {},
        "post"
      ).then(res => {
        if (res.data.code == 0) {
          if (res.data.response.status == 1) {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.getData("3");
          } else {
            this.$message({
              type: "error",
              message: "操作失败!"
            });
            this.getData("3");
          }
          this.filterForm3.allCheck = "";
          this.clearFilter5();
        }
      });
    },

    //跳转编辑审核
    auditEdit(num, index, type) {
      this.$router.push({
        path: "/monitoring/houseEdit",
        query: {
          reCameraStatus: this[`tableData${type}`].picList[index]
            .reCameraStatus,
          houseName: this.$route.query.name,
          status: type,
          path: this.$route.fullPath,
          type: num,
          activeName: this.activeName,
          data: JSON.stringify(this[`tableData${type}`].picList[index]),
          page: this[`filterForm${type}`].pageNum
        }
      });
    },
    pickerChange(val) {
      this.filterForm1.ptStarTime = val.slice(0, 19);
      this.filterForm1.ptEndTime = val.slice(22);
    },
    pickerChange1(val) {
      this.filterForm2.ptStarTime = val.slice(0, 19);
      this.filterForm2.ptEndTime = val.slice(22);
    },
    pickerChange2(val) {
      this.filterForm3.ptStarTime = val.slice(0, 19);
      this.filterForm3.ptEndTime = val.slice(22);
    },
    pickerChangeAdd(val){
        this.filterForm3.exStarTime = val.slice(0, 19);
        this.filterForm3.exEndTime = val.slice(22);
    },
    pickerChange3(val) {
      this.filterForm4.ptStarTime = val.slice(0, 19);
      this.filterForm4.ptEndTime = val.slice(22);
    },
    //请求数据方法
    getData(type) {
      this.is_loading_tab = true;
      let [_this, body] = [this, this[`filterForm${type}`]];
      if (this[`filterForm${type}`].buildingNumber == 0) {
        body.buildingNumber = this[`filterForm${type}`].buildingNumbers;
      }
      this.$http(
        "/buildingCamera/getAPPPicList",
        { body },
        {},
        {},
        "post"
      ).then(res => {
        if (res.data.code == 0) {
          this.appUserList = res.data.response.appUserList;
          if(res.data.response.examineUserList){
              this.examineUserList = res.data.response.examineUserList;
          }
          let arr = _this[`tableData${type}`];
          _this[`tableData${type}`] = res.data.response;
          _this.count = res.data.response.count;
          _this.status = res.data.response.status;
          for (let i in _this[`tableData${type}`].picList) {
            _this.$set(_this[`tableData${type}`].picList[i], "isShow", false);
            if (_this[`filterForm${type}`].picEditList.length > 0) {
              for (let j in _this[`filterForm${type}`].picEditList) {
                if (
                  _this[`tableData${type}`].picList[i].picId ==
                  _this[`filterForm${type}`].picEditList[j]
                ) {
                  _this.$set(
                    _this[`tableData${type}`].picList[i],
                    "isShow",
                    true
                  );
                }
              }
            }
          }
          if (type == 1) {
            _this.dataSwi = !_this.dataSwi;
          }
        }
        this.is_loading_tab = false;
      });
    },
    //显示输入楼幢号
    bdmShow(type) {
      if (this[`filterForm${type}`].buildingNumber == 0) {
        this[`filterForm${type}`].Bdm = 1;
      } else {
        this[`filterForm${type}`].Bdm = 0;
      }
    },
    //获取下拉数据
    getSelectData(type) {
      let _this = this,
        body = {};
      body.sourceStatus = "0";
      this.$http(
        "/buildingContribution/querySourceListInfo",
        { body },
        {},
        {},
        "post"
      ).then(res => {
        if (res.data.code == 0) {
          _this.selectList = res.data.response.list;
          window.localStorage.eSelectList = JSON.stringify(_this.selectList);
        }
      });
    },

    //更新数据
    updata() {
      this.getData(1);
      this.getData(2);
      this.getData(3);
      this.getData(4);
      //        this.getHistoryTagList();
      this.getSelectData();
    },
    //触发搜索
    onSearchSubmit(type) {
      this.$store.dispatch(
        "houseAuditSearchAction",
        JSON.stringify(this[`filterForm${type}`])
      );
      this[`filterForm${type}`].pageNum = 0;
      if (this[`currentPage${type}`] != 1) {
        this[`currentPage${type}`] = 1;
      } else {
        this.getData(type);
      }
    },
    //改变页码
    currentChange(page, type) {
      this[`currentPage${type}`] = parseInt(page);
      this[`filterForm${type}`].pageNum = page - 1;
      this.getData(type);
    },
    a(data) {},
    //刷新方法
    refresh() {},
    //点击选中图片
    f_checkout_img(index, type, e) {
      // if (e.target.id != 'NOclick') {
      //   return;
      // }
      //        this[`tableData${type}`].picList[index].isShow = !this[`tableData${type}`].picList[index].isShow;
      // this[`filterForm${type}`].allCheck = '';
      if (!this[`tableData${type}`].picList[index].isShow) {
        this[`filterForm${type}`].picEditList.push(
          this[`tableData${type}`].picList[index].picId
        );
        this[`filterForm${type}`].reCameraStatus.push(
          this[`tableData${type}`].picList[index].reCameraStatus
        );
        if (type == 2) {
          this[`filterForm${type}`].picList.push(
            this[`tableData${type}`].picList[index]
          );
        }
        if (type == 3) {
          this.filterForm5.picLists.push(
            this[`tableData${type}`].picList[index].picPath
          );
          this.filterForm5.scoreConfigList.push(
            this[`tableData${type}`].picList[index].firstScore
          );
          this.filterForm5.scoreLableList.push(
            this[`tableData${type}`].picList[index].scoreLable
          );
          this.filterForm5.buildingNumList.push(
            this[`tableData${type}`].picList[index].buildingNumber
          );
          this.filterForm5.quoteStatusList.push(
            this[`tableData${type}`].picList[index].quoteStatus
          );
          this.houseNumberIdList.push(
            this[`tableData${type}`].picList[index].houseNumberId
          );
          this.detailTypeList.push(
            this[`tableData${type}`].picList[index].detailType
          );
          this.pushList.push(this[`tableData${type}`].picList[index]);
          this.addTitleAndDes.push(
            this[`tableData${type}`].picList[index].picTitle +
              "/" +
              this[`tableData${type}`].picList[index].shareDesc
          );
        }
      } else {
        for (let i in this[`filterForm${type}`].picEditList) {
          if (
            this[`filterForm${type}`].picEditList[i] ==
            this[`tableData${type}`].picList[index].picId
          ) {
            this[`filterForm${type}`].picEditList.splice(i, 1);
            this[`filterForm${type}`].reCameraStatus.splice(i, 1);
            if (type == 2) {
              this[`filterForm${type}`].picList.splice(i, 1);
            }
            if (type == 3) {
              this.filterForm5.picLists.splice(i, 1);
              this.filterForm5.scoreConfigList.splice(i, 1);
              this.filterForm5.scoreLableList.splice(i, 1);
              this.filterForm5.buildingNumList.splice(i, 1);
              this.filterForm5.quoteStatusList.splice(i, 1);
              this.houseNumberIdList.splice(i, 1);
              this.detailTypeList.splice(i, 1);
              this.pushList.splice(i, 1);
              this.addTitleAndDes.splice(i, 1);
            }
          }
        }
      }
      this[`tableData${type}`].picList[index].isShow = !this[`tableData${type}`]
        .picList[index].isShow;
      // console.log(this.filterForm5.picLists,index);
    },
    //全选
    allCheckeds(type) {
      this.filterForm5.picLists = [];
      this.filterForm5.scoreConfigList = [];
      this[`filterForm${2}`].picList = [];
      this.filterForm5.lableType = 1;
      this.filterForm5.buildingId = null;
      this.filterForm5.typeId = "";
      this.filterForm5.picList[0].picDesc = "";
      this.filterForm5.picList[0].picUrl = "";
      this.filterForm5.picList[0].buildingNum = "";
      this.filterForm5.menuId = "";
      this.filterForm5.menuChildId = "";
      this.filterForm5.menuGrandId = "";
      this.filterForm5.wholeDesc = "";
      this.filterForm5.picList.picUrl = "";
      this.dialogFormVisible = false;
      this.tableData5s = [];
      this.houseNumberIdList = [];
      this.filterForm5.houseNumberId = "";
      this.detailTypeList = [];
      this.pushList = [];
      this.addTitleAndDes = [];

      this[`filterForm${5}`].picLists.length = 0;
      this[`filterForm${5}`].scoreConfigList.length = 0;
      this[`filterForm${5}`].scoreLableList.length = 0;
      this[`filterForm${5}`].buildingNumList.length = 0;
      this[`filterForm${5}`].quoteStatusList.length = 0;
      this[`filterForm${3}`].picEditList.length = 0;
      this[`filterForm${3}`].picEditList = [];
      if (this[`filterForm${type}`].allCheck == "0") {
        this[`filterForm${type}`].picEditList.length = 0;
        for (let i in this[`tableData${type}`].picList) {
          this[`tableData${type}`].picList[i].isShow = true;
          this[`filterForm${type}`].picEditList.push(
            this[`tableData${type}`].picList[i].picId
          );
          this[`filterForm${type}`].reCameraStatus.push(
            this[`tableData${type}`].picList[i].reCameraStatus
          );
          if (type == 2) {
            this[`filterForm${type}`].picList.push(
              this[`tableData${type}`].picList[i]
            );
          }
          if (type == 3) {
            this.filterForm5.picLists.push(
              this[`tableData${type}`].picList[i].picPath
            );
            this.filterForm5.scoreConfigList.push(
              this[`tableData${type}`].picList[i].firstScore
            );
            this.filterForm5.scoreLableList.push(
              this[`tableData${type}`].picList[i].scoreLable
            );
            this.filterForm5.buildingNumList.push(
              this[`tableData${type}`].picList[i].buildingNumber
            );
            this.filterForm5.quoteStatusList.push(
              this[`tableData${type}`].picList[i].quoteStatus
            );
            this.houseNumberIdList.push(
              this[`tableData${type}`].picList[i].houseNumberId
            );
            this.detailTypeList.push(
              this[`tableData${type}`].picList[i].detailType
            );
            this.pushList.push(this[`tableData${type}`].picList[i]);
            this.addTitleAndDes.push(
              this[`tableData${type}`].picList[i].picTitle +
                "/" +
                this[`tableData${type}`].picList[i].shareDesc
            );
          }
        }
      } else if (this[`filterForm${type}`].allCheck == "1") {
        this[`filterForm${type}`].picEditList.length = 0;
        for (let i in this[`tableData${type}`].picList) {
          if (this[`tableData${type}`].picList[i].isShow) {
            this[`tableData${type}`].picList[i].isShow = false;
            for (let j in this[`filterForm${type}`].picEditList) {
              if (
                this[`filterForm${type}`].picEditList[j] ==
                this[`tableData${type}`].picList[i].picId
              ) {
                this[`filterForm${type}`].picEditList.splice(j, 1);
                this[`filterForm${type}`].reCameraStatus.splice(j, 1);
                if (type == 2) {
                  this.filterForm2.picList.splice(j, 1);
                }
                if (type == 3) {
                  this.filterForm5.picLists.splice(j, 1);
                  this.filterForm5.scoreConfigList.splice(j, 1);
                  this.filterForm5.scoreLableList.splice(j, 1);
                  this.filterForm5.buildingNumList.splice(j, 1);
                  this.filterForm5.quoteStatusList.splice(j, 1);
                  this.houseNumberIdList.splice(j, 1);
                  this.detailTypeList.splice(j, 1);
                  this.pushList.splice(j, 1);
                  this.addTitleAndDes.splice(j, 1);
                }
              }
            }
          } else {
            this[`tableData${type}`].picList[i].isShow = true;
            this[`filterForm${type}`].picEditList.push(
              this[`tableData${type}`].picList[i].picId
            );
            this[`filterForm${type}`].reCameraStatus.push(
              this[`tableData${type}`].picList[i].reCameraStatus
            );
            if (type == 2) {
              this.filterForm2.picList.push(this[`tableData${2}`].picList[i]);
            }
            if (type == 3) {
              this.filterForm5.picLists.push(
                this[`tableData${type}`].picList[i].picPath
              );
              this.filterForm5.scoreConfigList.push(
                this[`tableData${type}`].picList[i].firstScore
              );
              this.filterForm5.scoreLableList.push(
                this[`tableData${type}`].picList[i].scoreLable
              );
              this.filterForm5.buildingNumList.push(
                this[`tableData${type}`].picList[i].buildingNumber
              );
              this.filterForm5.quoteStatusList.push(
                this[`tableData${type}`].picList[i].quoteStatus
              );
              this.houseNumberIdList.push(
                this[`tableData${type}`].picList[i].houseNumberId
              );
              this.detailTypeList.push(
                this[`tableData${type}`].picList[i].detailType
              );
              this.pushList.push(this[`tableData${type}`].picList[i]);
              this.addTitleAndDes.push(
                this[`tableData${type}`].picList[i].picTitle +
                  "/" +
                  this[`tableData${type}`].picList[i].shareDesc
              );
            }
          }
        }
      } else {
        return;
      }
    },
    //照片分类
    checkoutSelect(data, type) {
      var arr = [];
      arr.push(data.menuId);
      for (let i = 0; i < 10; i++) {
        if (data[`menuChildId${i}`] != "") {
          arr.push(data[`menuChildId${i}`]);
        }
      }
      if (data.menuId == "") {
        arr = [];
      }
      this[`filterForm${type}`].scoreConfigId = arr.slice(",").join(",");
      this[`filterForm${type}`].build = data.build;
      this[`filterForm${type}`].buildingNumber = data.buildingNumber;
      this[`filterForm${type}`].house = data.house;
      this[`filterForm${type}`].layerNumber = data.layerNumber;
      this[`filterForm${type}`].room = data.room;
      this[`filterForm${type}`].unitNumber = data.unitNumber;
    },
    addPageSizes(type){
         this[`filterForm${type}`].pageSize = this[`filterForm${type}`].pageSizes;
         this.getData(this.activeName);
    },
    //获取期数
    getHouseNumberList2(type) {
      let _this = this;
        let body = {};
        body.buildingId =  this.$route.query.id;
        if(type){
            body.houseNumberId = this[`filterForm${type}`].houseNumberId;
        }
      this.$http("/buildingCamera/getHouseNumberAndSysMassif", {body}, {}, {}, "post")
        .then(res => {
          if (res.data.code == 0) {
            let response = res.data.response;
            _this.houseNumberList2 = response.list;
            if(response.massifList.length > 0){
                _this.massifList = response.massifList;
            }else{
               if(type){
                    _this[`filterForm${type}`].massifId = "";
               }
            }
          } else if (res.data.code == 300) {
            _this.$router.push("/login");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getmassifList(tp){
        this.getHouseNumberList2(tp);
    },
    // 报告引用
    addCites(index, type) {
      this.getHouseNumberList();
      if (!this[`tableData${type}`].picList[index].houseNumberId && this[`tableData${type}`].picList[index].houseNumberId != 0) {
        this.$message({
          type: "error",
          message: "期数信息为空，无法引用!"
        });
        return;
      }
      this.filterForm5.picLists.length = 0;
      this.dialogFormVisible = true;
      this.filterForm5.picList[0].picUrl = this[`tableData${type}`].picList[
        index
      ].picPath;
      this.filterForm5.picList[0].picId = this[`tableData${type}`].picList[
        index
      ].picId;
      this.filterForm5.picList[0].picDesc =
        this[`tableData${type}`].picList[index].picTitle +
        "/" +
        this[`tableData${type}`].picList[index].shareDesc;
      this.filterForm5.picUrlBefore = this[`tableData${type}`].picList[
        index
      ].picPath;
      this.filterForm5.picUrlAfter = this[`tableData${type}`].picList[
        index
      ].picPath;
      this.filterForm5.houseNumberId2 = this[`tableData${type}`].picList[
        index
      ].houseNumberId;

      let str = this[`tableData${type}`].picList[index].buildingNumber;
      // console.log(type);

      if (str) {
        this.filterForm5.picList[0].buildingNum = str.substr(0, str.length - 2);
      } else {
        this.filterForm5.picList[0].buildingNum = "当前照片无楼幢号信息";
      }

      if (this[`tableData${type}`].picList[index].quoteStatus == 1) {
        this.addDisable = true;
      } else {
        this.addDisable = false;
      }
      this.filterForm5.scoreLableAdd = this[`tableData${type}`].picList[
        index
      ].scoreLable;

      // console.log(this[`tableData${type}`]);
    },
    //引用报告下拉数据
    getbaogao() {
      this.getSelevtCit();
    },
    getSelevtCit() {
      let [_this, body] = [this, {}];
      this.filterForm5.buildingConstructionReportId = "";
      body.id = this.$route.query.id;
      body.houseNumberId = this.filterForm5.houseNumberId;
      this.$http(
        "/buildingCamera/selReportsByBid",
        { body },
        {},
        {},
        "post"
      ).then(res => {
        if (res.data.code == 0) {
          _this.tableData5 = res.data.response;
          _this.$store.dispatch("getSelevtCit", res.data.response);
        }
      });
    },
    //报告引用提交
    subQuote() {
      if (!this.filterForm5.houseNumberId && this.filterForm5.houseNumberId != 0) {
        this.$message({
          type: "error",
          message: "请选择楼盘期数!"
        });
        return;
      }
      if (
        this.filterForm5.houseNumberId != this.filterForm5.houseNumberId2 && this.filterForm5.picLists.length <1
      ) {
        this.$message({
          type: "error",
          message: "楼盘期数选择错误!"
        });
        return;
      }
      if (this.filterForm5.lableType == 1 || this.filterForm5.lableType == 2) {
        if (!this.filterForm5.buildingConstructionReportId) {
          this.$message({
            type: "error",
            message: "请选择引用报告!"
          });
          return;
        } else if (!this.filterForm5.lableType) {
          this.$message({
            type: "error",
            message: "请选择报告类型!"
          });
          return;
        }

        if (this.filterForm5.typeId == 3 && this.filterForm5.lableType == 1) {
          if (
            this.filterForm5.picList[0].buildingNum == "当前照片无楼幢号信息"
          ) {
            this.$message({
              type: "error",
              message: "存在无楼栋信息照片!"
            });
            return;
          }
          if (this.filterForm5.picLists.length >= 2) {
            // console.log(this.filterForm5.buildingNumList)
            for (let i in this.filterForm5.buildingNumList) {
              // console.log(this.filterForm5.buildingNumList[i]);
              if (
                this.filterForm5.buildingNumList[i] == "当前照片无楼幢号信息" ||
                this.filterForm5.buildingNumList[i] == ""
              ) {
                this.$message({
                  type: "error",
                  message: "存在无楼栋信息照片!"
                });
                return;
              }

              if (this.houseNumberIdList[i] != this.filterForm5.houseNumberId) {
                this.$message({
                  type: "error",
                  message: "楼盘期数选择错误!1"
                });
                this.clearFilter5();
                return;
              }
            }
          }
        }
        if (this.filterForm5.lableType == 2) {
          if (!this.filterForm5.buildingId) {
            this.$message({
              type: "error",
              message: "请选择类别!"
            });
            return;
          }
        } else {
          if (!this.filterForm5.typeId) {
            this.$message({
              type: "error",
              message: "请选择类别!"
            });
            return;
          }
        }

        this.$confirm("确认引用选中照片?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // console.log(this.filterForm5);
            for (let i = 0; i < this.filterForm5.picLists.length; i++) {
              let obj = {};
              obj = _.cloneDeep(this.filterForm5);
              obj.picList[0].picUrl = this.filterForm5.picLists[i];
              obj.picList[0].picId = this.filterForm3.picEditList[i];
              obj.picList[0].picDesc = this.addTitleAndDes[i];
              if (
                this.filterForm5.typeId == 3 &&
                this.filterForm5.lableType == 1
              ) {
                if (
                  this.filterForm5.picList[0].buildingNum !=
                  "当前照片无楼幢号信息"
                ) {
                  obj.picList[0].buildingNum = this.filterForm5.buildingNumList[
                    i
                  ].substr(0, this.filterForm5.buildingNumList[i].length - 2);
                } else {
                  obj.picList[0].buildingNum = "";
                }
              } else {
                obj.picList[0].buildingNum = "";
              }
              obj.picUrlBefore = "";
              obj.picUrlAfter = "";
              obj.questionPoint = "";
              obj.wholeDesc = "";
              obj.id = "";
              // obj.picurl = this.filterForm5.picLists[i];
              if (obj.buildingId) {
                obj.typeId = this.filterForm5.buildingId[0];
                obj.menuId = this.filterForm5.buildingId[1];
                obj.menuChildId = this.filterForm5.buildingId[2];
                obj.menuGrandId = this.filterForm5.buildingId[3];
              }
              this.tableData5s.push(obj);
            }
            let body = {};
            if (this.filterForm5.picLists.length < 1) {
              body = { list: [this.filterForm5] };
              // console.log(body.list[0]);

              if (
                this.filterForm5.typeId == 3 &&
                this.filterForm5.lableType == 1
              ) {
                if (
                  this.filterForm5.picList[0].buildingNum ==
                  "当前照片无楼幢号信息"
                ) {
                  body.list[0].picList[0].buildingNum = this.filterForm5.picList[0].buildingNum =
                    "";
                }
              } else {
                body.list[0].picList[0].buildingNum = "";
              }
              if (body.list[0].buildingId) {
                body.list[0].typeId = body.list[0].buildingId[0];
                body.list[0].menuId = body.list[0].buildingId[1];
                body.list[0].menuChildId = body.list[0].buildingId[2];
                body.list[0].menuGrandId = body.list[0].buildingId[3];
              }
            } else {
              body = { list: this.tableData5s };
            }

            this.$http(
              "/buildingConstructionReport/batchAddConstructionInfo",
              { body },
              {},
              {},
              "post"
            ).then(res => {
              if (res.data.code == 0) {
                this.$message({
                  type: "success",
                  message: "引用成功!"
                });
                this.getData(3);
                this[`filterForm${5}`].picLists.length = 0;
                this[`filterForm${5}`].scoreConfigList.length = 0;
                this[`filterForm${5}`].scoreLableList.length = 0;
                this[`filterForm${5}`].buildingNumList.length = 0;
                this[`filterForm${5}`].quoteStatusList.length = 0;
                this.filterForm1.allCheck = "";
                this.tableData5s = [];
                this.clearFilter5();
              }
            });
          })
          .catch(res => {
            console.log(res);
          });
      } else if (this.filterForm5.lableType == 3) {
        if (!this.filterForm5.buildingConstructionReportId) {
          this.$message({
            type: "error",
            message: "请选择引用报告!"
          });
          return;
        }
        if (this.filterForm5.picLists.length < 2) {
          if (!this.filterForm5.typeId) {
            this.$message({
              type: "error",
              message: "请选择整改阶段!"
            });
            return;
          }

          if (this.filterForm5.typeId == 1) {
            if (!this.filterForm5.wholeDesc) {
              this.$message({
                type: "error",
                message: "请输入问题点描述!"
              });
              return;
            }
          } else if (this.filterForm5.typeId == 2) {
            if (!this.filterForm5.questionPoint) {
              this.$message({
                type: "error",
                message: "已整改问题点描述!"
              });
              return;
            }
          }
          if (
            (this.filterForm5.scoreLableAdd == "待整改" &&
              this.filterForm5.typeId == 1) ||
            (this.filterForm5.scoreLableAdd == "已整改" &&
              this.filterForm5.typeId == 2)
          ) {
          } else {
            // console.log(this.filterForm5);
            this.$message({
              type: "error",
              message: "当前整改阶段选择错误!"
            });
            return;
          }
        } else {
          localStorage.insertConstructionPointInfoId = "";
          if (
            this.filterForm5.lableType == 3 &&
            this.filterForm5.picLists.length > 2
          ) {
            this.$message({
              type: "error",
              message: "请选择2张照片!"
            });
            return;
          } else if (
            this.filterForm5.scoreLableList[0] ===
              this.filterForm5.scoreLableList[1] ||
            this.filterForm5.scoreLableList[0] == "普通照片" ||
            this.filterForm5.scoreLableList[1] == "普通照片"
          ) {
            this.$message({
              type: "error",
              message: "请选择一张待整改及一张已整改照片"
            });
            return;
          }
        }

        this.$confirm("确认引用选中照片?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let addUrl =
              "buildingConstructionReport/insertConstructionPointInfo";
            let [_this, body] = [this, this.filterForm5];

            // if (!body.picUrlBefore && !body.picUrlAfter) {

            // }

            body.id = "";
            if (this.filterForm5.picLists.length < 2) {
              // console.log(this.filterForm5.typeId);
              if (this.filterForm5.typeId == 2) {
                body.picUrlBefore = "";
                body.wholeDesc = "";
              } else if (this.filterForm5.typeId == 1) {
                body.picUrlAfter = "";
                body.questionPoint = "";
              }
              body.picId = this.filterForm5.picList[0].picId;
            } else {
              if (this.filterForm5.scoreLableList[0] == "待整改") {
                body.picUrlBefore = this.filterForm5.picLists[0];
                body.picUrlAfter = this.filterForm5.picLists[1];
              } else if (this.filterForm5.scoreLableList[0] == "已整改") {
                body.picUrlAfter = this.filterForm5.picLists[0];
                body.picUrlBefore = this.filterForm5.picLists[1];
              }

              body.picId = this.filterForm3.picEditList.slice(",").join(",");
            }

            if (localStorage.insertConstructionPointInfoId) {
              body.id = localStorage.insertConstructionPointInfoId;
              addUrl =
                "/buildingConstructionReport/updateConstructionPointInfo";
            } else {
              body.id = "";
            }
            // console.log(body);
            body.picList[0].buildingNum = "";
            this.$http(addUrl, { body }, {}, {}, "post").then(res => {
              if (res.data.code == 0) {
                localStorage.insertConstructionPointInfoId = "";
                if (res.data.response.id) {
                  localStorage.insertConstructionPointInfoId =
                    res.data.response.id;
                }
                this.$message({
                  type: "success",
                  message: "引用成功!"
                });

                this[`filterForm${5}`].picLists.length = 0;
                this[`filterForm${5}`].scoreConfigList.length = 0;
                this[`filterForm${5}`].scoreLableList.length = 0;
                this[`filterForm${5}`].buildingNumList.length = 0;
                this[`filterForm${5}`].quoteStatusList.length = 0;
                this.filterForm1.allCheck = "";
                this.tableData5s = [];
                this.getData(3);
                this.clearFilter5();
              }
            });
          })
          .catch(res => {
            console.log(res);
          });
      }
    },
    //取消引用
    quoteCancle() {
      this.clearFilter5();
    },

    // 获取期数
    getHouseNumberList() {
      let _this = this;
      let body = {};
      body.buildingId = this.$route.query.id;
      this.$http(
        "/buildingCamera/getHouseNumberInReport",
        { body },
        {},
        {},
        "post"
      )
        .then(res => {
          if (res.data.code == 0) {
            let response = res.data.response;
            _this.houseNumberList = response.list;
          } else if (res.data.code == 300) {
            _this.$router.push("/login");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    addInputChange(index,type){
        this[`filterForm${type}`].inputListNumber.push(index);
        console.log(this[`filterForm${type}`].inputListNumber)
    },
    allSubmitModify(type){
        if(this[`filterForm${type}`].inputListNumber.length<1){
            this.$message({
                type: "error",
                message: "请先修改标题和分享内容!"
            });
            return;
        }
        let set =  Array.from(new Set(this[`filterForm${type}`].inputListNumber));
        console.log(set);
        let body = {},
            _this = this;
        body.picList = [];
        for(let i = 0;i<set.length;i++){
            body.picList.push(this[`tableData${type}`].picList[i])
        }
        this.$http(
            "/buildingCamera/editTitleAndShareDesc",
            { body },
            {},
            {},
            "post"
        )
        .then(res => {
          if (res.data.code == 0) {
            _this.$message({
                type: "success",
                message: "修改成功!"
            });
            _this.getData(type);
            _this[`filterForm${type}`].inputListNumber = [];
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //清空操作
    clearFilter5() {
      this.filterForm5.lableType = 1;
      this.filterForm5.buildingId = null;
      this.filterForm5.typeId = "";
      this.filterForm5.picList[0].picDesc = "";
      this.filterForm5.picList[0].picUrl = "";
      this.filterForm5.picList[0].buildingNum = "";
      this.filterForm5.menuId = "";
      this.filterForm5.menuChildId = "";
      this.filterForm5.menuGrandId = "";
      this.filterForm5.wholeDesc = "";
      this.filterForm5.picList.picUrl = "";
      this.dialogFormVisible = false;
      this.tableData5s = [];
      this.houseNumberIdList = [];
      this.filterForm5.houseNumberId = "";
      this.detailTypeList = [];
      this.pushList = [];
      this.filterForm3.allCheck = "";
      this.addTitleAndDes = [];

      this[`filterForm${5}`].picLists.length = 0;
      this[`filterForm${5}`].scoreConfigList.length = 0;
      this[`filterForm${5}`].scoreLableList.length = 0;
      this[`filterForm${5}`].buildingNumList.length = 0;
      this[`filterForm${5}`].quoteStatusList.length = 0;
      this[`filterForm${3}`].picEditList.length = 0;
      this[`filterForm${3}`].picEditList = [];
      let _this = this;
      for (let i in _this[`tableData${3}`].picList) {
        _this.$set(_this[`tableData${3}`].picList[i], "isShow", false);
      }
      window.bus.$emit("f_buildingId", "gahaha");
      this.addDisable = false;
    },
    save_show(index) {
      if (this.save !== index) {
        this.save = index;
      }
    },
      //添加权限管理
    addNewTagsLists(){
        let _this = this;
        this.$http(
            "/buildingCamera/getAuditAuthority",
            {},
            {},
            {},
            "post"
        )
            .then(res => {
            if (res.data.code == 0) {
                _this.NewTagsLists = res.data.response;
                if (this.$route.query.activeName || this.$route.query.page) {
                    try {
                        this.activeName = this.$route.query.activeName;
                        if(this.$store.state.houseAuditSearch){
                            this[`filterForm${this.activeName}`] = JSON.parse(
                        this.$store.state.houseAuditSearch
                        );
                        }
                        if (this.$route.query.page || this.$route.query.page == "0") {
                        this.currentChange(this.$route.query.page + 1, this.activeName);
                        }
                    } catch (e) {
                        if( _this.NewTagsLists.list[0].status != 1){
                            // _this.activeName = "2";
                            _this.getData(_this.activeName);
                        }
                    }
                } else{
                    if( _this.NewTagsLists.list[0].status != 1){
                            _this.activeName = "2";
                            _this.getData(_this.activeName);
                        }
                }
               
            } else if (res.data.code == 300) {
                _this.$router.push("/login");
            }
            })
            .catch(err => {
            console.log(err);
            });
    },
  },

  mounted() {
    this.$store.dispatch(
      "defaultIndexAction",
      "/monitoring/monitoringHouseAudit"
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

.audit-item-addw {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.audit-item p{
    padding: 0!important;
}

.audit {
  width: 30%;
  height: 600px;
  margin-left: 2%;
  margin-right: 1%;
  margin-top: 30px;
  border: 1px solid gainsboro;
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
  background-size: cover;
}

.audit-item {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin: 5px auto;
  padding-right: 5px;
  padding-left: 5px;
}

.audit-item p {
  width: 90%;
}

.audit-item span {
  white-space: nowrap;
  margin: 0 auto;
  margin-left: 0;
  margin-right: 0;
}

.audit-item p {
  width: 70%;
}

.audit-addp {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.audit-btn {
  width: 100%;
  margin: 20px auto;
  display: flex;
  justify-content: center;
}

.audit-ic {
  position: absolute;
  top: 0;
  width: 100px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  background: gray;
  color: #fff;
}

.audit-ic2 {
  position: absolute;
  bottom: 0;
  width: 50px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  background: gray;
  color: #fff;
  right: 0;
  z-index: 999;
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
  bottom: 32px;
  width: 100%;
  height: 60px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 18px;
  line-height: 60px;
  display: flex;
  justify-content: space-around;
}

.audit-img-text span:nth-child(2) {
  padding-left: 5px;
  padding-right: 5px;
  display: inline-block;
  height: 40px;
  border: 1px solid #fff;
  line-height: 40px;
  text-align: center;
  margin: auto;
  margin-right: 20px;
  font-size: 16px;
}

.tableData2Icon {
  margin-top: 10px;
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
  border: 1px solid gray;
  display: inline-block;
  color: gray;
}

.tableData2Icon span:nth-child(3) {
  padding: 3px 10px 3px 10px;
  line-height: 20px;
  border: 1px solid #149bd3;
  display: inline-block;
  color: #149bd3;
}

</style>

<style>
.el-table--border td,
.el-table--border th {
  text-align: center;
}
.addred{
    background:red;
}
textarea{
        overflow: hidden;
}
.addCTime{
    color:#333;
}
.addCTimeRed{
    color:red;
}
.audit-ine .el-input__inner{
    width:80%;
    height: 22px;
    /* border:1px solid transparent; */
    background-color: transparent;
    /* cursor: pointer; */
}
</style>

