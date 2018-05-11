<template>
  <div class="container">
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-50 md-small-size-100 md-elevation-10">
        <md-card-header>
          <div class="md-title">让TA在这个世界留下记录</div>
        </md-card-header>

        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field md-clearable :class="getValidationClass('username')">
                <label for="username">姓名</label>
                <md-input name="username" id="username" v-model="form.username" md-counter="64" :disabled="sending"/>
                <span class="md-error" v-if="!$v.form.username.required">姓名必填</span>
                <span class="md-error" v-else-if="!$v.form.username.maxLength">姓名不能超过64个字符</span>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-button class="md-raised md-primary search-btn" @click="query">查询</md-button>
            </div>
          </div>

          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('content')">
                <label for="content">介绍</label>
                <md-textarea v-model="form.content" md-counter="2048"></md-textarea>
                <span class="md-error" v-if="!$v.form.content.required">介绍不能为空</span>
                <span class="md-error" v-else-if="!$v.form.content.maxLength">介绍不能超过2048个字符</span>
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <p>
                <strong>txhash:</strong>
                {{txhash}}
              </p>
            </div>
          </div>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending"/>

        <md-card-actions>
          <md-button type="submit" class="md-raised md-primary" :disabled="sending">保存/更改</md-button>
        </md-card-actions>
      </md-card>

      <md-dialog-alert
        :md-active.sync="showDialog"
        :md-content="dialogContent"
        :md-title="dialogTitle"
        md-confirm-text="确定"/>

    </form>
  </div>
</template>

<script>
  import Nebulas from 'nebulas'
  import NebPay from 'nebpay.js'
  import {validationMixin} from 'vuelidate'
  import {
    required,
    maxLength
  } from 'vuelidate/lib/validators';

  export default {
    name: 'MonumentDapp',
    mixins: [validationMixin],
    data: () => ({
      form: {
        username: null,
        content: null
      },
      sending: false,
      nebpay: null,
      serialNumber: null,
      dappAddress: 'n1ekmewQCJ19KtFyuxHq39uW2Si2tiv4BAa',
      internal: null,
      showDialog: false,
      dialogContent: "",
      dialogTitle: "",
      ended: false,
      neb: null,
      testNeb: null,
      walletAddress: null,
      txhash: ""
    }),
    validations: {
      form: {
        username: {
          required,
          maxLength: maxLength(64)
        },
        content: {
          required,
          maxLength: maxLength(2048)
        }
      }
    },
    created() {
      this.nebPay = new NebPay();
      this.neb = new Nebulas.Neb();
      this.neb.setRequest(new Nebulas.HttpRequest("https://testnet.nebulas.io"));

      this.testNeb = new Nebulas.Neb();
      this.testNeb.setRequest(new Nebulas.HttpRequest("https://testnet.nebulas.io"));

      // 获取插件导入的钱包地址
      window.postMessage({
        "target": "contentscript",
        "data": {},
        "method": "getAccount",
      }, "*");
    },
    mounted() {
      window.addEventListener('message', this.handleExtensionMessage);
    },
    beforeDestroy() {
      window.removeEventListener('message', this.handleExtensionMessage);
    },
    methods: {
      handleExtensionMessage(e) {
        if (e.data.data && !!e.data.data.account) {
          this.walletAddress = e.data.data.account;
        }
      },
      getValidationClass (fieldName) {
        const field = this.$v.form[fieldName];

        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },
      clearForm () {
        this.$v.$reset()
        this.form.username = null;
        this.form.content = null;
        this.serialNumber = null;
        this.internal = null;
      },
      saveUser () {
        this.sending = true;
        this.ended = false;
        var name = this.form.username;
        var content = this.form.content;
        var date = this.getDate();
        var value = "0";
        var callFunction = "save";

        var callArgs = "[\"" + name + "\",\"" + content + "\",\"" + date + "\"]";
        this.serialNumber = this.nebPay.call(this.dappAddress, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
          listener: this.cbPush        //设置listener, 处理交易返回信息
        });

        var self = this;
        this.internal = window.setInterval(() => {

          if (self.ended) {
            window.clearInterval(self.internal);
            return;
          }

          this.nebPay.queryPayInfo(this.serialNumber)
            .then(function (resp) {

              var respObject = JSON.parse(resp);
              if (respObject.code === 0) {
                self.dialogContent = self.form.username + "成功记录到了星云区块链!";
                self.dialogTitle = "提示";
                self.sending = false;
                self.showDialog = true;
                self.clearForm();
                self.ended = true;
                window.clearInterval(self.internal);
              }
            })
            .catch(function (err) {
              self.dialogTitle = "异常";
              self.dialogContent = "出错了：" + err;
              self.sending = false;
              self.showDialog = true;
            });
        }, 15000)
      },
      validateUser () {
        this.$v.$touch();

        if (!this.$v.$invalid) {
          this.saveUser()
        }
      },
      getDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
      },

      cbPush(resp) {
        this.txhash = resp.txhash;
      },
      query() {
        this.$v.form.username.$touch();
        if (!this.$v.form.username.$invalid) {
          if (!this.walletAddress) {
            this.dialogTitle = "异常";
            this.dialogContent = "未能获取到钱包地址，请先在WebExtensionWallet插件中解锁帐号！";
            this.sending = false;
            this.showDialog = true;
          }
          this.sending = true;

          var name = this.form.username;
          var from = this.walletAddress;
          var value = "0";
          var nonce = "0";
          var gas_price = "1000000";
          var gas_limit = "2000000";
          var callFunction = "get";
          var callArgs = "[\"" + name + "\"]"; //in the form of ["args"]
          var contract = {
            "function": callFunction,
            "args": callArgs
          };
          var self = this;
          this.testNeb.api.call(from, this.dappAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
            self.cbSearch(resp)
          }).catch(function (err) {
            self.dialogTitle = "异常";
            self.dialogContent = "出错了：" + err;
            self.sending = false;
            self.showDialog = true;
          })

        }
      },
      queryCb(resp) {
        console.log("query resp" + resp);
      },
      cbSearch(resp) {
        var result = resp.result;    ////resp is an object, resp.result is a JSON string

        if (result === 'null') {
          this.dialogContent = "未能查询到您的数据！";
          this.sending = false;
          this.showDialog = true;
        } else {
          try {
            result = JSON.parse(result)
          } catch (err) {
            this.dialogTitle = "异常";
            this.dialogContent = "智能合约返回数据异常！";
            this.sending = false;
            this.showDialog = true;
          }
          if (!!result.content) {
            this.form.content = result.content;
            this.sending = false;
          } else {
            this.dialogTitle = "异常";
            this.dialogContent = "介绍:" + result.content + "异常";
            this.sending = false;
            this.showDialog = true;
          }

        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .md-progress-bar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
  }

  .container {
    form {
      .md-card {
        margin: 100px auto;
      }
    }
  }

  .search-btn {
    margin-top: 15px;
  }
</style>
