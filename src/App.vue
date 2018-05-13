<template>
  <div id="app">
    <md-app md-waterfall md-mode="fixed-last">
      <md-app-toolbar class="md-large md-dense md-primary">
        <div class="md-toolbar-row">
          <div class="md-toolbar-section-start">
            <span class="md-title">纪念碑</span>
          </div>
        </div>

        <div class="md-toolbar-row navigation">
          <md-tabs md-sync-route class="md-primary">
            <md-tab id="tab-home" md-label="首页" to="/"></md-tab>
            <md-tab id="tab-explore" md-label="探索" to="/explore"></md-tab>
            <md-tab id="tab-about" md-label="关于" to="/about"></md-tab>
            <md-tab id="tab-tutorial" md-label="使用教程" to="/tutorial"></md-tab>
          </md-tabs>
        </div>
      </md-app-toolbar>

      <md-app-content>

        <router-view/>

        <md-dialog-alert
          :md-active.sync="showDialog"
          md-title="提示"
          md-content="您还没安装星云浏览器钱包插件，使用前，
            请先安装<a target='_blank' href='https://github.com/ChengOrangeJu/WebExtensionWallet'>谷歌浏览器钱包插件</a>。
            或查看<strong>使用教程</strong>"
          md-confirm-text="知道了"/>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
  export default {
    name: 'MonumentDapp',
    data: () => ({
      showDialog: false
    }),
    mounted() {
    },
    watch: {
      '$route' (to, from){

        if (to.name === 'Tutorial' || to.name === 'About') {
          this.showDialog = false;
        } else {
          if (typeof(webExtensionWallet) === "undefined") {
            this.showDialog = true;
          }
        }
      },
    }
  }
</script>

<style lang="scss" scoped="">
  .subtitle {
    margin-left: 20px;
  }

  .navigation {
    max-width: 1120px;
    margin: 0 auto;
  }
</style>
