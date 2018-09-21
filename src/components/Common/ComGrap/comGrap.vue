<template>
  <div>
    <el-form-item label="照片分类：" :required="re">
      <el-radio-group v-model="filterForm2.menuId" @change="menuIdChange($event,2)">
        <el-radio
          label=""
          value=""
          key=""
        >
          <span>全部</span>
        </el-radio>
        <el-radio
          v-for="(item,index) in selectList"
          :key="item.scoreTitle"
          :value="item.id"
          :label="item.id">
          <span> {{item.scoreTitle}}</span>
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-show="filterForm2.menuId!= ''">
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
        :clearable="true"
        style="width:150px"
        v-for="(val,index) in tenSect"
        @change="menuChildIdChange($event,2,index)">
        <el-option
          v-for="(item,index2) in val"
          :key="item.scoreTitle"
          :label="item.scoreTitle"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="房间信息：" v-show="status!='edit'"
                  v-if="filterForm2.menuChildId0 === 134 || filterForm2.menuChildId0===4057">
      <!--<el-select size="small" v-model="filterForm2.stage" placeholder="请选择期数" style="width:150px;">-->
      <!--<el-option label="一期" value="1"></el-option>-->
      <!--<el-option label="二期" value="2"></el-option>-->
      <!--<el-option label="三期" value="3"></el-option>-->
      <!--<el-option label="四期" value="4"></el-option>-->
      <!--<el-option label="五期" value="5"></el-option>-->
      <!--<el-option label="六期" value="6"></el-option>-->
      <!--<el-option label="七期" value="7"></el-option>-->
      <!--<el-option label="八期" value="8"></el-option>-->
      <!--<el-option label="九期" value="9"></el-option>-->
      <!--<el-option label="十期" value="10"></el-option>-->
      <!--</el-select>-->
      <el-select size="small" v-model="filterForm2.buildingNumber" :clearable="true" placeholder="请选择楼栋"
                 style="width:150px;"
                 @change="selectChange">
        <el-option :label="`${index}号楼`" :value="`${index}号楼`" v-for="index in 200" :key="index">
          <span>{{`${index}号楼`}}</span>
        </el-option>
      </el-select>
      <el-select size="small" v-model="filterForm2.unitNumber" :clearable="true" placeholder="请选择单元"
                 style="width:150px;"
                 @change="selectChange">
        <el-option :label="`${index}单元`" :value="`${index}单元`" v-for="index in 6" :key="index">
          <span>{{`${index}单元`}}</span>

        </el-option>
      </el-select>
      <el-select size="small" v-model="filterForm2.layerNumber" :clearable="true" placeholder="请选择楼层"
                 style="width:150px;"
                 @change="selectChange">
        <el-option label="-1层" value="-1层"></el-option>
        <el-option label="-2层" value="-2层"></el-option>
        <el-option label="-3层" value="-3层"></el-option>
        <el-option :label="`${index}层`" :value="`${index}层`" v-for="index in 50" :key="index"></el-option>
      </el-select>
      <el-select size="small" v-model="filterForm2.house" :clearable="true" placeholder="请选择户" style="width:150px;"
                 @change="selectChange">
        <el-option :label="`${index}户`" :value="`${index}户`" v-for="index in 30" :key="index"></el-option>
      </el-select>
      <el-select size="small" v-model="filterForm2.room" :clearable="true" placeholder="请选择功能分区" style="width:150px;"
                 @change="selectChange">
        <el-option label="卧室1" value="卧室1"></el-option>
        <el-option label="卧室2" value="卧室2"></el-option>
        <el-option label="卧室3" value="卧室3"></el-option>
        <el-option label="卧室4" value="卧室4"></el-option>
        <el-option label="卧室5" value="卧室5"></el-option>
        <el-option label="卧室6" value="卧室6"></el-option>
        <el-option label="厨房" value="厨房"></el-option>
        <el-option label="客厅" value="客厅"></el-option>
        <el-option label="卫生间1" value="卫生间1"></el-option>
        <el-option label="卫生间2" value="卫生间2"></el-option>
        <el-option label="卫生间3" value="卫生间3"></el-option>
        <el-option label="阳台1" value="阳台1"></el-option>
        <el-option label="阳台2" value="阳台2"></el-option>
        <el-option label="阳台3" value="阳台3"></el-option>
        <el-option label="餐厅" value="餐厅"></el-option>
        <el-option label="玄关" value="玄关"></el-option>
      </el-select>
      <el-select v-model="filterForm2.build" size="small" :clearable="true" placeholder="请选择构件" style="width:150px;"
                 @change="selectChange">
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
    <el-form-item label="房间信息：" v-show="status!='edit'"
                  v-if="filterForm2.menuChildId0 === 135 || filterForm2.menuChildId0===4058">
      <el-select size="small" v-model="filterForm2.buildingNumber" :clearable="true" placeholder="请选择楼栋"
                 style="width:150px;"
                 @change="selectChange">
        <el-option :label="`${index}号楼`" :value="`${index}号楼`" v-for="index in 200" :key="index">
          <span>{{`${index}号楼`}}</span>
        </el-option>
      </el-select>
      <el-select size="small" v-model="filterForm2.unitNumber" :clearable="true" placeholder="请选择单元"
                 style="width:150px;"
                 @change="selectChange">
        <el-option :label="`${index}单元`" :value="`${index}单元`" v-for="index in 6" :key="index">
          <span>{{`${index}单元`}}</span>
        </el-option>
      </el-select>
      <el-select size="small" v-model="filterForm2.layerNumber" :clearable="true" placeholder="请选择楼层"
                 style="width:150px;"
                 @change="selectChange">
        <el-option label="-1层" value="-1"></el-option>
        <el-option label="-2层" value="-2"></el-option>
        <el-option label="-3层" value="-3"></el-option>
        <el-option :label="`${index}层`" :value="`${index}`" v-for="index in 50" :key="index"></el-option>
      </el-select>
      <!--<el-select size="small" v-model="filterForm2.house" :clearable="true" placeholder="请选择户" style="width:150px;"-->
      <!--@change="selectChange">-->
      <!--<el-option :label="`${index}户`" :value="`${index}户`" v-for="index in 30" :key="index"></el-option>-->
      <!--</el-select>-->
      <el-select size="small" v-model="filterForm2.room" :clearable="true" placeholder="请选择功能分区" style="width:150px;"
                 @change="selectChange">
        <el-option label="外墙" value="外墙"></el-option>
        <el-option label="楼梯" value="楼梯"></el-option>
        <el-option label="走道" value="走道"></el-option>
        <el-option label="大厅" value="大厅"></el-option>
        <el-option label="电梯前室" value="电梯前室"></el-option>
        <el-option label="水井" value="水井"></el-option>
        <el-option label="暖井" value="暖井"></el-option>
        <el-option label="电井" value="电井"></el-option>
        <el-option label="无障碍通道" value="无障碍通道"></el-option>
        <el-option label="台阶" value="台阶"></el-option>
        <el-option label="散水" value="散水"></el-option>
        <el-option label="屋面" value="屋面"></el-option>
        <el-option label="露台" value="露台"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="施工区域：" v-if="filterForm2.menuChildId0 === 136 || filterForm2.menuChildId0===4059">
      <el-select size="small" v-model="filterForm2.buildingNumber" :clearable="true" placeholder="请选择楼号"
                 style="width:150px;"
                 @change="selectChange">
        <el-option :label="`${index}`" :value="`${index}`" v-for="index in 50" :key="index"></el-option>
      </el-select>
      <el-select size="small" v-model="filterForm2.unitNumber" :clearable="true" placeholder="请选择楼号"
                 style="width:150px;"
                 @change="selectChange">
        <el-option label="墙" :value="0"></el-option>
        <el-option :label="`${index}`" :value="`${index}`" v-for="index in 50" :key="index"></el-option>
      </el-select>
    </el-form-item>
  </div>
</template>ff
<script>
  export default {
    props: {
      selectLists: {},
      type: {},
      status: {},
      muid: {},
      f0: {},
      f: {},
      re: false
    },

    data(){
      return {
        selectList: [],
        tenSect: [],
        forms: {},
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
          buildingNumber: '',
          unitNumber: '',
          layerNumber: '',
          house: '',
          build: '',
          room: ''
        }
      }
    },
    created(){


    },
    mounted(){
      let ese = window.sessionStorage.se;
      if (!ese) {
        this.getSelectData();
      } else {
        this.selectList = JSON.parse(ese);
      }
      this.filterForm2.stage = this.selectLists.stage;
      this.filterForm2.buildingNumber = this.selectLists.buildingNumber;
      this.filterForm2.unitNumber = this.selectLists.unitNumber;
      this.filterForm2.layerNumber = this.selectLists.layerNumber;
      this.filterForm2.house = this.selectLists.house;
      this.filterForm2.build = this.selectLists.build;
      this.filterForm2.room = this.selectLists.room;

      if (this.selectLists.scoreConfigId) {
        let munidArr = this.selectLists.scoreConfigId.split(',');
        this.filterForm2.menuId = munidArr[0] * 1;
        if (munidArr[1] * 1) {
          setTimeout(() => {
            this.filterForm2[`menuChildId${0}`] = munidArr[1] * 1;
          }, 2000)
        }

        if (munidArr[2] * 1) {
          setTimeout(() => {
            this.filterForm2[`menuChildId${1}`] = munidArr[2] * 1;
          }, 3000)
        }

        if (munidArr[3] * 1) {
          setTimeout(() => {
            this.filterForm2[`menuChildId${2}`] = munidArr[3] * 1;
          }, 4000)
        } else {
          return;
        }

        if (munidArr[4] * 1) {
          setTimeout(() => {
            this.filterForm2[`menuChildId${3}`] = munidArr[4] * 1;
          }, 5000)
        } else {
          return;
        }

        if (munidArr[5] * 1) {
          setTimeout(() => {
            this.filterForm2[`menuChildId${4}`] = munidArr[5] * 1;
          }, 6000)
        } else {
          return;
        }

        if (munidArr[6] * 1) {
          setTimeout(() => {
            this.filterForm2[`menuChildId${5}`] = munidArr[6] * 1;
          }, 7000)
        } else {
          return;
        }

        if (munidArr[7] * 1) {
          setTimeout(() => {
            this.filterForm2[`menuChildId${6}`] = munidArr[7] * 1;
          }, 8000)
        } else {
          return;
        }

        if (munidArr[8] * 1) {
          setTimeout(() => {
            this.filterForm2[`menuChildId${7}`] = munidArr[8] * 1;
          }, 9000)
        } else {
          return;
        }

        if (munidArr[9] * 1) {
          setTimeout(() => {
            this.filterForm2[`menuChildId${8}`] = munidArr[9] * 1;
          }, 10000)
        } else {
          return;
        }

      }
    },
    methods: {
      //获取下拉数据]
      getSelectData(type){
        let _this = this,
          body = {};
        body.sourceStatus = '0';
        this.$http('/buildingCamera/getPicClassify', {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            this.selectList = res.data.response.list;
            window.sessionStorage.se = JSON.stringify(res.data.response.list);
          }
        })
      },
      initSelect(type, index, len){
        for (let i = index; i < len; i++) {
          this[`filterForm${type}`][`menuChildId${index}`] = '';
        }
      },
      //menuId 改变
      menuIdChange(menuId, type){
        if (menuId == '') {
          this.tenSect.length = 0;
          this.selectChange();
          this.init();
          return;
        }
        let _this = this, body = {pid: menuId};
        this.initSelect(type, 0, 10);
        this.tenSect.length = 0;
        this.$http('/buildingCamera/getPicClassify', {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            _this.tenSect.push(res.data.response.list);
            _this.selectChange();
          }
        })
      },
      //menuChildId 改变
      menuChildIdChange(menuChildId, type, index){
        let _this = this, body = {pid: menuChildId};
        _this.initSelect(type, index + 1, 10);
        if (_this.tenSect.length - 1 > index) {
          _this.tenSect.splice(index + 1, _this.tenSect.length);
        }

        this.$http('/buildingCamera/getPicClassify', {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            if (res.data.response.list.length > 0) {
              _this.tenSect.push(res.data.response.list);
            }
            _this.selectChange();
            
          }
        });
      },
      selectChange(){
        if (this.type == 9) {
          this.$emit('photoL', this.filterForm2, this.type);
        } else {
          this.$emit('photoL0', this.filterForm2, this.type);
        }
      },
      init(){
        this.filterForm2.stage = '',
          this.filterForm2.buildingNumber = '',
          this.filterForm2.unitNumber = '',
          this.filterForm2.layerNumber = '',
          this.filterForm2.house = '',
          this.filterForm2.build = '',
          this.filterForm2.room = ''
      }
    }
  }
</script>
