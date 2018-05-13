// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueMaterial from 'vue-material'
import Vuelidate from 'vuelidate'
import infiniteScroll from 'vue-infinite-scroll'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

import Nebulas from 'nebulas'

Vue.use(VueMaterial)
Vue.use(Vuelidate)
Vue.use(infiniteScroll)

Vue.config.productionTip = false;

Vue.mixin({
  data () {
    return {
      walletAddress: null,
      neb: null,
      testNeb: null,
      dappAddress: 'n1oGAyEXvQotnMVWzMmAWZ74piiYFyurK2t',
      dappTestAddress: 'n1fX4YSt5aCqfAG5awxdGr3rnHvfooUbVN1',
      callbackUrl: "https://pay.nebulas.io/api/mainnet/pay",
      testCallbackUrl: "https://pay.nebulas.io/api/pay"
    }
  },
  created() {
    window.addEventListener('message', this.handleExtensionMessage);
  },
  mounted() {
    this.neb = new Nebulas.Neb();
    this.neb.setRequest(new Nebulas.HttpRequest("https://mainnet.nebulas.io"));

    this.testNeb = new Nebulas.Neb();
    this.testNeb.setRequest(new Nebulas.HttpRequest("https://testnet.nebulas.io"));

    // 获取插件导入的钱包地址
    window.postMessage({
      "target": "contentscript",
      "data": {},
      "method": "getAccount",
    }, "*");
  },
  methods: {
    handleExtensionMessage(e) {
      if (e.data.data && !!e.data.data.account) {
        this.walletAddress = e.data.data.account;
      }
    },
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
