<template>
  <div>
    <div class="changeTestnet">
      <md-switch v-model="testNet">测试网络</md-switch>
    </div>
    <div class="md-layout md-alignment-center">
      <div v-for="monument in monuments"
           class="md-layout-item md-size-25 md-medium-size-25 md-small-size-50 md-xsmall-size-100">
        <md-card md-with-hover class="md-elevation-3">
          <md-card-header>
            <div class="md-title">{{ monument.name }}</div>
            <div class="md-subhead">记录时间：{{ monument.date }}</div>
          </md-card-header>

          <md-card-expand>
            <md-card-actions md-alignment="right">
              <md-card-expand-trigger>
                <md-button>查看介绍</md-button>
              </md-card-expand-trigger>
            </md-card-actions>

            <md-card-expand-content>
              <md-card-content>
                {{ monument.content }}


              </md-card-content>
            </md-card-expand-content>
          </md-card-expand>
        </md-card>
      </div>

      <md-dialog-alert
        :md-active.sync="showDialog"
        :md-content="dialogContent"
        :md-title="dialogTitle"
        md-confirm-text="确定"/>
    </div>

    <div class="md-layout md-alignment-center load-more" :class="{hidden: loading || pageOffset + pageSize >= size}">
      <md-button @click="loadMore" class="md-dense md-primary">加载更多...</md-button>
    </div>

    <div class="md-layout md-alignment-center md-gutter loading" :class="{hidden: !loading}">
      <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate"></md-progress-spinner>
    </div>
  </div>
</template>

<script>
  import Nebulas from 'nebulas';

  export default {
    name: 'Explore',
    data () {
      return {
        showDialog: false,
        dialogContent: null,
        dialogTitle: null,
        monuments: [],
        loading: true,
        size: 0,
        pageSize: 20,
        pageOffset: 0,
        testNet: false
      }
    },
    watch: {
      walletAddress: function (val) {
        var Account = Nebulas.Account;

        if (Account.isValidAddress(val)) {
          this.walletAddress = val;
          this.query(this.pageSize, this.pageOffset);
        } else {
          if (!this.walletAddress) {
            this.showDialogs("提示", "未能检测到钱包地址，请先安装浏览器钱包插件后导入钱包！或查看<strong>使用教程</strong>");
          }
        }

      },
      'testNet'(val){
          this.monuments = [];
          this.pageOffset = 0;
        this.query(this.pageSize, this.pageOffset);
      }

    },
    methods: {
      loadMore(){
        this.pageOffset = this.pageOffset + this.pageSize;
        this.query(this.pageSize, this.pageOffset);
      },
      showDialogs(title, content){
        this.showDialog = true;
        this.dialogTitle = title;
        this.dialogContent = content;
      },
      query(limit, offset){
        this.loading = true;
        var from = this.walletAddress;
        var value = "0";
        var nonce = "0";
        var gas_price = "1000000";
        var gas_limit = "2000000";
        var callFunction = "query";
        var callArgs = "[" + limit + "," + offset + "]";
        var contract = {
          "function": callFunction,
          "args": callArgs
        };
        var self = this;
        if(this.testNet){

          this.testNeb.api.call(from, this.dappTestAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
            self.cbSearch(resp)
          }).catch(function (err) {
            self.showDialogs("异常", "出错了：" + err);
            self.loading = false;
          })
        }else{

          this.neb.api.call(from, this.dappAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
            self.cbSearch(resp)
          }).catch(function (err) {
            self.showDialogs("异常", "出错了：" + err);
            self.loading = false;
          })
        }

      },
      cbSearch(resp) {
        this.loading = false;
        var result = resp.result;    ////resp is an object, resp.result is a JSON string

        if (!result) {
          this.showDialogs("异常", "未能查询到数据！");
        } else {
          try {
            result = JSON.parse(result)
          } catch (err) {
            this.showDialogs("异常", "智能合约返回数据异常！");
          }
          var obj = JSON.parse(result)
          this.size = obj.size;
          var array = obj.monuments;
          for (var i = 0; i < array.length; i++) {
            this.monuments.push(array[i]);
          }

        }
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .md-layout {
    max-width: 1120px;
    margin: 0 auto;
  }

  .md-layout-item {
    margin-top: 20px;
  }

  .hidden {
    display: none;
  }

  .loading {
    margin-top: 20px;
  }

  .load-more {
    margin-top: 20px;
  }

  .changeTestnet{
    position: fixed;
    top: 20px;
    right: 50px;
    color: #ffffff;
    z-index: 10;
  }
</style>
