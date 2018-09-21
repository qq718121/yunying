<template>
    <div>
        <div style="padding:20px;border:1px solid #d1dbe5">
            <el-form ref="form" :model="form" :label-width="radioLabelWidth">
                <el-form-item label="户内分区：">
                    <el-radio-group v-model="form.room">
                        <el-radio v-for="item in tableData.roomList" :label="item.roomId" :key="item.roomid">{{item.room}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-button type="primary" style="display:block;margin:0 auto;background:#199ED8" @click="queryIndoor">查询</el-button>
            </el-form>
        </div>
        <div class="tabletopbar" style="margin-top: 20px;">
            <span>查询结果：共</span>
            <span style="color:#111">{{ tableData.rowCount}}</span>
            <span>张照片</span>
        </div>
        <div class="cont">
            <div v-for="(index,i) in tableData.list" :key="i" style="padding:20px 0 20px 30px;border-bottom:1px solid#d1dbe5;">
                <div style="margin-bottom:20px;">监控问题点：{{index.scoreConfig}}</div>
                <div style="margin-bottom:20px;">整改问题点：{{index.reShareDesc}}</div>
                <div class="cont-img">
                    <ul>
                        <li v-for="(item,j) in index.picList" :key="j">
                            <img :src=' item.picPath ' alt="">
                            <div class="wap">
                                <i class="el-icon-view ico" @click="viewImg(item.picPath,item.picId)"></i>
                                <!-- <i class="el-icon-search ico" @click="goMonitor(1)"></i>
                                <i class="el-icon-edit ico" @click="goMonitor(2)"></i> -->
                            </div>
                            <div class="quertD">{{item.scoreLable}}</div>
                        </li>
                    </ul>
                </div>
                <div style="margin-bottom:20px;" v-show="index.deShareDesc">已整改描述：{{index.deShareDesc}}</div>
                <div style="margin-bottom:20px;">{{index.picTime}}</div>
            </div>
            <el-dialog :visible.sync="outerVisible">
                 <p style="font-size:18px;">照片Id:{{dialogPicId}}</p>
                <div style="overflow: hidden;margin-top: 20px;">
                    <div style='position: relative'>
                        <img style="width:100%" :src="dialogImgSrc" alt="">
                    </div>
                </div>
            </el-dialog>
            <!-- <el-pagination v-show="tableData.rowCount>0" style="margin: 0 auto;text-align:center;margin-top:20px" layout="prev, pager, next ,jumper" :page-size="10" :currentPage.sync="currentPage" @current-change="currentChange" :total="tableData.rowCount"> -->
            <!-- </el-pagination> -->
        </div>
          <p style="text-align:center;margin-top:60px;color:#777" v-show="tableData.rowCount==0">暂无数据</p>
    </div>
</template>
<script>
import message from "../../common/message";
export default {
  name: "IndoorConstructionDetails",
  data() {
    let name = this.$route.query.buildingName;
    return {
      radioLabelWidth: "100px",
      currentPage: 1,
      form: {
        room: -2,
        picTime: "",
        houseNumberId: "",
        buildingNum: "",
        unitNum: "",
        floor: "",
        accountNum: "",
        buildingId: "",
        pageNum: 0,
        pageSize: 10
      },
      dialogImgSrc: "",
      dialogPicId:"",
      outerVisible: false,
      tableData: {
        list: [],
        roomList: [],
        rowCount: 0
      }
    };
  },
  created() {
    this.initData();
    this.getData();
  },
  computed: {},
  methods: {
    initData() {
      this.form.buildingId = this.$route.query.buildingId;
      this.form.buildingNum = this.$route.query.buildingNum;
      this.form.houseNumberId = this.$route.query.houseNumberId;
      this.form.unitNum = this.$route.query.unitNum;
      this.form.accountNum = this.$route.query.accountNum;
      this.form.floor = this.$route.query.floor;
    },
    // 获取数据
    getData() {
      let _this = this;
      let body = this.form;
      this.$http(
        "/buildingMonitor/getHouseRectifyRecord",
        { body },
        {},
        {},
        "post"
      )
        .then(res => {
          if (res.data.code == 0) {
            _this.tableData = res.data.response;
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    currentChange(page) {
      this.form.pageNum = page - 1;
      this.getData();
    },
    queryIndoor() {
      this.getData();
    },
    viewImg(src,pId) {
      this.dialogImgSrc = src;
      this.dialogPicId = pId;
      this.outerVisible = true;
    },
    goMonitor(type) {
      if (type == 1) {
      } else if (type == 2) {
      }
    }
  }
};
</script>
<style scoped>
.cont {
  padding: 20px 20px 20px 0;
  margin-top: 20px;
}
.content {
  max-width: calc(100% - 50px);
  margin: 20px 0px 20px 30px;
}
.cont-img ul {
  width: 100%;
  font-size: 0;
}
.cont-img ul li {
  display: inline-block;
  list-style: none;
  width: 19%;
  height: 220px;
  margin-right: 1%;
  background-size: cover !important;
  margin-bottom: 20px;
  overflow: hidden;
  position: relative;
}
.cont-img ul li img {
  width: 100%;
  min-height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.wap {
  z-index: 2;
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  line-height: 220px;
  display: none;
}
.cont-img ul li:hover .wap {
  display: block;
}
.wap i {
  color: #fff;
  font-size: 22px;
  margin: 0 10px;
  cursor: pointer;
}
.quertD {
  width: 60px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  position: absolute;
  top: 0;
  right: 0;
  background: #199ed8;
  font-size: 14px;
  color: #fff;
}
</style>
