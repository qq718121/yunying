<template>
  <div>
    <Subnav2 :navList="navList" @refresh="refresh"></Subnav2>
    <div style="padding:20px">
      <el-form label-width="100px" :model="form" class="demo-form-inline">
        <el-form-item label="用户名" required>
          <el-input size="small" v-model="form.userPhone" style="width:200px" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="楼盘名称" required>
          <el-select size="small" v-model="form.buildingId" style="width:200px;">
            <el-option v-for="(item,index) in buildingList" :key="index" :label="item.buildingName" :value="item.buildingId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <BuildingLinkage3 :_buildingId="form.buildingId" 
                                      :_houseNumber.sync="form.houseNumberId"
                                      :_buildingNum.sync="form.buildingNum" 
                                      :_unitNum.sync="form.unitNum"
                                      :_floor.sync="form.floor" 
                                      :_accountNum.sync="form.accountNum" 
                                      :inline="inline"
                                      :changeSwith="changeSwith" />
      <el-form label-width="100px" :model="form" class="demo-form-inline">
        <el-form-item label="操作" required>
          <el-radio-group v-model="form.operation">
            <el-radio :label="1">开通服务</el-radio>
            <el-radio :label="0">关闭服务</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item> 
          <el-button style="margin-left:100px" type="primary" @click="onSubmit">确认</el-button>
          <el-button @click="back">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Subnav2 from "../Subnav2/Subnav2";
import message from "../../common/message";
import BuildingLinkage3 from "../Common/BuildingLinkage2/BuildingLinkage3";
export default {
  name: "EstateProcessMonitoringUser",
  components: {
    Subnav2,
    BuildingLinkage3
  },
  data() {
    return {
      navList: [
        { path: "/index/estateprocessmonitoringservice", name: "首页" },
        { path: "/index/estateprocessmonitoringservice", name: "服务管理" },
        { path: this.$route.fullPath, name: "用户管理" }
      ],
      tabLoading: false,
      secondLevel: "服务管理",
      threeLevel: "",
      inline: false,
      changeSwith: false,
      buildingList: [],
      filterForm: {
        pageNum: "",
        pageSize: ""
      },
      form: {
        userId: "",
        userPhone: "",
        buildingId: "",
        buildingNum: "",
        unitNum: "",
        floor: "",
        houseNumberId:"",
        accountNum: "",
        operation: ""
      }
    };
  },
  created() {
    this.getBuildingListData();
    this.$store.dispatch(
      "defaultIndexAction",
      "/index/estateprocessmonitoringservice"
    );
    if (this.$route.query.type == "create") {
      this.threeLevel = "添加用户";
    } else {
      this.threeLevel = "编辑用户";
    }
  },
  methods: {
    //获取楼盘列表数据
    getBuildingListData() {
      let _this = this,
        body = _.cloneDeep(this.filterForm);

      this.$http("/buildingMonitor/getBuildingMonitorList", {}, { body })
        .then(res => {
          if (res.data.code == 0) {
            _this.buildingList = [];
            let buildingMonitorInfo = res.data.response.buildingMonitorInfo;
            buildingMonitorInfo.forEach(item => {
              _this.buildingList.push({
                buildingId: item.buildingId.toString(),
                buildingName: item.buildingName
              });
            });
            if (_this.$route.query.type == "edit") {
              _this.getData();
            }
          } else {
            message(_this, "请求失败", "warning");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取数据
    getData() {
      let _this = this,
        body = {
          userId: this.$route.query.userId,
          buildingId: this.$route.query.buildingId
        };
      this.$http("/buildingMonitor/getUserInfo", { body }, {}, {}, "post")
        .then(res => {
          if (res.data.code == 0) {
            let response = res.data.response.MonitorUserInfoList                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        [0];
            _this.form.userPhone = response.userPhone;
            _this.form.operation = response.operation;
               _this.$nextTick(function() {
                  _this.form.houseNumberId = response.houseNumberId;
                  _this.$nextTick(function() {
                    _this.form.buildingNum = response.buildingNum;
                    _this.$nextTick(function() {
                      _this.form.unitNum = response.unitNum;
                      _this.$nextTick(function() {
                        _this.form.floor = response.floor;
                        _this.$nextTick(function() {
                          _this.form.accountNum = response.accountNum;
                        });
                      });
                    });
                  });
               });
            _this.form.buildingId = _this.$route.query.buildingId.toString();
            _this.form.userId = _this.$route.query.userId.toString();
          } else {
            message(_this, "请求失败", "warning");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //验证手机号
    checkMobile(sMobile) {
      if (!/^1[3|4|5|7|8]\d{9}$/.test(sMobile)) {
        return false;
      }
      return true;
    },
    //提交
    onSubmit() {
      let _this = this,
        body = _.cloneDeep(this.form),
        url,
        _userId = body.userId;
      delete body.userId;

      if (!this.checkMobile(body.userPhone)) {
        message(_this, "手机号格式有误", "warning");
        return;
      }
        console.log(body);
      let vals = Object.values(body),
        result = vals.every(item => {
          return item !== "";
        });
      if (!result) {
        message(_this, "有必填项未填写", "warning");
        return;
      }
      if (this.$route.query.type == "create") {
        url = "/buildingMonitor/addMonitorUser";
      } else {
        url = "/buildingMonitor/editUserInfo";
        body.userId = _userId;
      }
      this.$confirm("确定提交吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _this
            .$http(url, { body }, {}, {}, "post")
            .then(res => {
              if (res.data.code == 0) {
                if (res.data.response.status == 1) {
                  message(_this, "提交成功", "success");
                  _this.$router.go("-1");
                } else if (res.data.response.status == 2) { 
                  message(_this, "该用户已经开通该户的全流程服务", "warning");
                } else if (res.data.response.status == 3) {
                  message(_this, "该用户尚未开启服务，不允许关闭", "warning");
                } else {
                  message(_this, "提交失败", "warning");
                }
              } else {
                message(_this, "提交失败", "warning");
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {});
    },
    //返回
    back() {
      this.$router.push({
        path: "/index/estateprocessmonitoringservice"
      });
    },
    //刷新
    refresh() {
      if (this.$route.query.type == "create") {
        for (var i in this.form) {
          this.form[i] = "";
        }
      } else {
        this.getData();
      }
    }
  }
};
</script>

<style scoped>
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
</style>
