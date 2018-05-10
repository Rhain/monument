<template>
  <div id="app">
      <md-app md-waterfall md-mode="fixed-last">
        <md-app-toolbar class="md-large md-dense md-primary">
          <div class="md-toolbar-row">
            <div class="md-toolbar-section-start">
              <span class="md-title">纪念碑</span>
            </div>
          </div>

          <div class="md-toolbar-row">
            <md-tabs class="md-primary">
              <md-tab id="tab-home" md-label="首页" to="/"></md-tab>
              <md-tab id="tab-pages" md-label="探索" to="/explore"></md-tab>
              <md-tab id="tab-posts" md-label="关于" to="/about"></md-tab>
            </md-tabs>
          </div>
        </md-app-toolbar>

        <md-app-content>
          <router-view/>
        </md-app-content>
      </md-app>
  </div>
</template>

<script>
export default {
  name: 'MonumentApp',
  data: () => ({
  })
}
</script>

<style lang="scss" scoped="">
  .subtitle{
    margin-left: 20px;
  }
</style>
