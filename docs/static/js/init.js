var userNebAddress = '';
window.postMessage({
  "target": "contentscript",
  "data": {},
  "method": "getAccount",
}, "*");
window.addEventListener('message', function(e) {
  if (e.data && e.data.data && e.data.data.account) {
    userNebAddress = e.data.data.account;
  }
});
var minUnit = 1000000000000000000;
var NODE_ENV = '<%= htmlWebpackPlugin.options.NODE_ENV %>';
var dappAddress = NODE_ENV === 'production' ? 'n1pmMkang9VHzLVtGVda2FwxTk3Q6BPHjb8' : 'n1rh9rtuMXmfrVSC8eFhNcp38RzG9qsGZdS';
var NebPay = require("nebpay");
var nebPay = new NebPay();
var payCallbackUrl = NODE_ENV === 'production' ? NebPay.config.mainnetUrl : NebPay.config.testnetUrl;
var nebulas = require("nebulas");
var Account = nebulas.Account;
var neb = new nebulas.Neb();
var from = Account.NewAccount().getAddressString();
var httpRequestUrl = NODE_ENV === 'production' ? 'https://mainnet.nebulas.io' : 'https://testnet.nebulas.io';
neb.setRequest(new nebulas.HttpRequest(httpRequestUrl));