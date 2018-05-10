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

                <md-button class="md-primary">Primary</md-button>
              </md-field>
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
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending"/>

        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending">保存/更改</md-button>
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
      dialogTitle: ""
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
    },
    methods: {
      getValidationClass (fieldName) {
        const field = this.$v.form[fieldName]

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

          this.nebPay.queryPayInfo(this.serialNumber)   //search transaction result from server (result upload to server by app)
            .then(function (resp) {
              console.log("tx result: " + resp)   //resp is a JSON string
              var respObject = JSON.parse(resp);
              if (respObject.code === 0) {
                self.dialogContent = self.form.username + "成功记录到了星云区块链!";
                self.dialogTitle = "提示";
                self.sending = false;
                self.showDialog = true;
                self.clearForm();
                clearInterval(self.internal);
              } else if (respObject.code === 1) {
                self.dialogTitle = "异常";
                self.dialogContent = respObject.msg;
                self.sending = false;
                self.showDialog = true;
                clearInterval(self.internal);
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
        this.$v.$touch()

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
        console.log("response of push: " + JSON.stringify(resp))
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
</style>
