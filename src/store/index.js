import Vue  from 'vue';
import Vuex from 'vuex';
import estate from './modules/estate';
import processmonitoring from './modules/processmonitoring';

Vue.use(Vuex);

// 这里定义初始值
let state = {
  navStyle: {
    width: '220px',
    flex: ' 0 0 220px'
  },
  roleName: '未定义',
  mainLoading: false,
  contrationLoading: false,
  defaultIndex: '',
  first_is: true,
  filterForm1: {}, //缓存查询的内容，编辑之后返回，复现
  filterId: false, // 识别缓存的内容是否清除照片分类的值
  formArr: [],//审核楼盘标签变化记录
  houseAuditSearch: '',//保存监控楼盘审核查询条件
  getBuildingNum: {},//记录每次拿到的楼盘
  getSelevtCit: {},//记录每次拿到的引用报告下拉数据
};

const mutations = {
  changeNavStyle(state, n){
    state.navStyle = n
  },
  changeMainLoading(state, n){
    state.mainLoading = n
  },
  changeContrationLoading(state, n){
    state.contrationLoading = n
  },
  changedefaultIndex(state, n){
    state.defaultIndex = n
  },
  changeRole(state, n){
    state.roleName = n;
  },
  first_is_show(state, n){
    state.first_is = n;
  },
  FILTERMUTAIONS(state, n){
    state.filterForm1 = n;
  },
  FILTERIDMUTAIONS(state, n){
    state.filterId = n;
  },
  //获取标签改变之后的数据
  FORMARRMUTAIONS(state, n){
    state.formArr = n;
  },
  //houseAuditSearch
  HOUSEAUDITSEARCH(state, n){
    state.houseAuditSearch = n;
  },
  //getBuildingNum
  GETBUILDNAME(state, n){
    state.getBuildingNum = n;
  },

  //getSelevtCit
  GETSELEVTCIT(state, n){
    state.getSelevtCit = n;
  }

};

//事件触发后的逻辑操作
const actions = {
  navStyleAction({commit}, n){
    commit('changeNavStyle', n)
  },
  mainLoadingAction({commit}, n){
    commit('changeMainLoading', n)
  },
  contrationLoadingAction({commit}, n){
    commit('changeContrationLoading', n)
  },
  defaultIndexAction({commit}, n){
    commit('changedefaultIndex', n)
  },
  roleAction({commit}, n){
    commit('changeRole', n)
  },
  first_is_show_action({commit}, n){
    commit('first_is_show', n)
  },
  filterAction({commit}, n){
    commit('FILTERMUTAIONS', n)
  },
  filterIdAction({commit}, n){
    commit('FILTERIDMUTAIONS', n)
  },
  formArrAction({commit}, n){
    commit('FORMARRMUTAIONS', n)
  },
  //HOUSEAUDITSEARCH
  houseAuditSearchAction({commit}, n){
    commit('HOUSEAUDITSEARCH', n)
  },
  //GETBUILDNAME
  getBuildingNum({commit}, n){
    commit('GETBUILDNAME', n)
  },
  //GETSELEVTCIT
  getSelevtCit(state, n){
    state.getSelevtCit = n;
  }
};

const getters = {
  GetMainLoading(state){
    return state.mainLoading
  }
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
    estate,
    processmonitoring
  }
})
