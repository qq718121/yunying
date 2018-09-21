// import promise from 'es6-promise'
// promise.polyfill()
import Promise from 'promise-polyfill'
if (!window.Promise) {
     window.Promise = Promise;
}
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import axios from './common/axios'
import Axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VideoPlayer from 'vue-video-player'
import VueClipboard from 'vue-clipboard2'

// import VueSocketio from 'vue-socket.io';
// import socketio from 'socket.io-client';
// Vue.use(VueSocketio, socketio('http://121.40.165.18:8800'));

Vue.use(VideoPlayer);
Vue.use(ElementUI);
Vue.use(VueClipboard)
Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.prototype.$axios = Axios;
var vue = new Vue({
     el: '#app',
     router,
     store,
     template: '<App/>',
     components: { App }
});
window.bus = new Vue();
window.vue = vue;
