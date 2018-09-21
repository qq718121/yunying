<template>
  <div style="display: inline-block">
    <el-select
      v-if="cityList.provinceIdsList.length > 0 || !cityList.provinceIdsList"
      size="small"
      style="width: 150px"
      v-model="filterForm.province"
      clearable
      @change="provinceChange(filterForm.province)"
      placeholder="省">
      <el-option
        v-for="item in cityList.provinceIdsList"
        :key="item.cityId"
        :label="item.cityName"
        :value="item.cityId">
      </el-option>
    </el-select>
    <el-select size="small"
               style="width: 150px"
               v-model="filterForm.city"
               @change="cityChange(filterForm.city)"
               clearable
               placeholder="市">
      <el-option
        v-for="item in cityIdsList"
        :key="item.cityId"
        :label="item.cityName"
        :value="item.cityId">
      </el-option>
    </el-select>
    <el-select size="small"
               v-if="isShowArea"
               style="width: 150px"
               v-model="filterForm.area"
               @change="areaChange(filterForm.area)"
               clearable
               placeholder="区">
      <el-option
        v-for="item in areaIdsList"
        :key="item.cityId"
        :label="item.cityName"
        :value="item.cityId">
      </el-option>
    </el-select>
  </div>
</template>
<script>
  export default{
    props: {
      url: {
        default: '/citis/cityLists',
        require: true
      },
      _province: {
        default: '',
        require: true
      },
      _city: {
        default: '',
        require: true
      },
      _area: {
        default: ''
      },
      isShowArea: {
        default: false
      }
    },
    data(){
      return {
        swi: false,
        filterForm: {
          province: this._province,
          city: this._city,
          area: this._area
        },
        f: [
          {
            cityId: 1,
            cityName: '打发打发',
            cityList: [
              {cityId: 4, cityName: '士大夫', id: 1},
              {cityId: 4, cityName: '士大夫', id: 1},
              {cityId: 4, cityName: '士大夫', id: 1},
              {cityId: 4, cityName: '士大夫', id: 1},
            ]
          },
          {cityId: 2, cityName: '三个'},
          {cityId: 3, cityName: '打发士大夫打发'},
          {cityId: 4, cityName: '士大夫'}

        ],
        cityList: {
          provinceIdsList: [],
          cityIdsList: [],
          areaIdsList: []
        },
        provinceIdsList: [],
        cityIdsList: [],
        areaIdsList: []
      }
    },
    created(){
      this.getData(1);
    },
    computed: {},
    watch: {
      '_province': function (val) {
        this.filterForm.province = val;
      },
      '_city': function (val) {
        this.filterForm.city = val;
      },
      '_area': function (val) {
        this.filterForm.area = val;
      },
    },
    methods: {
      //获取省市区数据
      getData(cityType, parentid = ''){
        let body = {cityType, parentid};
        this.$http(this.url, {body}, {}, {}, 'post').then(res => {
          if (res.data.code == 0) {
            var resP = res.data.response;

            var len = resP.cityList.length;
            //如果省没有数据或者不显示，就添加市为第一级
            if (len == 0) {
              this.cityList.cityIdsList = resP.cityList;
            } else {
              this.cityList.provinceIdsList = resP.cityList;
            }
          }
        })
      },
      //过滤选中的省的下标
      cityFilter(id, type){
        var pro;
        if (type == 1) {
          pro = this.cityList.provinceIdsList;
        } else if (type == 2) {
          pro = this.cityList.cityIdsList;
        }
        for (let i in pro) {
          if (pro[i].cityId == id) {
            return i;
          }
        }
      },
      //如果省变化，拿到省的下标来push对应市的下标
      provinceChange(province){
        var arr = this.cityList[this.cityFilter(province, 1)];
        for (let i of arr.areaIdsList) {
          this.cityList.cityIdsList.push(i);
        }
        this.$emit('update:_province', province);
      },
      //如果市变化，拿到省的下标来push对应区的下标
      cityChange(city){
        var arr = this.areaIdsList[this.cityFilter(city, 2)];
        for (let i of arr.areaIdsList) {
          this.cityList.areaIdsList.push(i);
        }
        this.$emit('update:_city', city);
      },
      areaChange(area){
        this.$emit('update:_area', area);
      },

    }
  }
</script>
