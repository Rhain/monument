<template>
  <div class="md-layout">
    <md-content>
      <p>
        <span class="md-body-1 attention">
          注意： 写入区块链的记录都可以被别人查看到，这也是建立这个网站的初衷，就是希望后来人可以了解到以前默默无闻的人。所以
          如果你的记录如果是不希望别人看到的，请不要记录在这里。
        </span>
      </p>
      <p>
        <span class="md-body-2">
        1. 安装星云钱包谷歌浏览器插件。
          可以到Github<a target="_blank" href="https://github.com/ChengOrangeJu/WebExtensionWallet">WebExtensionWallet</a>
          下载，按照文档中步骤安装插件。
      </span>
      </p>
      <p>
        <span class="md-body-2">
          2. 创建钱包。点击刚刚安装的星云钱包浏览器插件。在New Wallet 页面中，输入你的钱包密码，点击Create New Wallet按钮。
          再保存好生成的keystore文件（重要）， 这个文件在每次解锁钱包的时候需要。如下图所示：
        </span>
      </p>
      <p>
        <img src="../assets/create.jpg" alt="create wallet">
      </p>
      <p>
        <span class="md-body-2">
          3. 获取NAS。测试环境可以在<a href="https://testnet.nebulas.io/claim/">https://testnet.nebulas.io/claim/</a>
          网站上申请NAS（只能用于测试网络）。正式环境需要去交易所购买NAS。 文档以测试网络为例。
        </span>
      </p>
      <p>
        <span class="md-body-2">
          4. 浏览器钱包插件导入钱包。点击星云钱包插件,选择Send-Tx页面，点击SELECT WALLET FILE  按钮，选择刚才保存的keystore文件
          在输入您的密码，点击UNLOCK按钮，解锁钱包。如下图：
        </span>
      </p>
      <p>
        <img src="../assets/unlock.jpg" alt="unlock wallet">
      </p>
      <p>
        <span class="md-body-2">
          5. 纪念写入区块链。进入首页, 在姓名输入框中输入，你想纪念的人，在介绍中输入，对TA的介绍。点击保存/更改按钮，
          星云钱包插件会弹框出来让你确认交易。如下图：

        </span>
      </p>
      <p>
        <img src="../assets/confirm.jpg" alt="confirm tx">
      </p>
      <p>
        <span class="md-body-2">
          点击CONFIRM 按钮。 在点击SUBMIT按钮，如下图：
        </span>
      </p>
      <p>
        <img src="../assets/submit.jpg" alt="submit tx">
      </p>
      <p>
        <span class="md-body-2">
          ps: 此时需要注意，如果是在测试网络下记录，浏览器插件钱包要选择Testnet,如下图：
        </span>
      </p>
      <p>
        <img src="../assets/chosse.jpg" alt="choose testnet">
      </p>
      <p>
          <span class="md-body-2">
            6. 等星云交易打包完成，网站会提示你纪念成功写入区块链，如下图所示：
          </span>
      </p>
      <p>
        <img src="../assets/done.jpg" alt="create done">
      </p>
      <p>
        <span class="md-body-2">
          7. 查询你为TA写的记录，在姓名输入框输入你要查询的TA，点击查询按钮，如果之前你有记录，
          就会在介绍中填入你之前写的记录，如果没有，则提示你没有记录。如下图：
        </span>
      </p>
      <p>
        <img src="../assets/query.jpg" alt="query result">
      </p>
      <p>
        <span class="md-body-2">
          8. 探索。 点击探索页面，会为你展示其他人写的记录。
        </span>
      </p>
      <p>
        <span class="md-body-2">
          9. 可以选择把纪念记录到测试网络，还是主网上。 默认是记录到主网上，如果想在测试网络上体验下。
          选择测试网络，在钱包插件确认交易的时候，选择Testnet，提交即可。同时探索也可以选择测试网络，
          查看测试网络的记录。
        </span>
      </p>
    </md-content>
  </div>
</template>

<script>
  export default {
    name: 'About',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .md-layout {
    max-width: 1120px;
    margin: 20px auto;
  }
  .attention{
    color: #ff1744;
  }
</style>
