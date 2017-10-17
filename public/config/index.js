// var options = {
//   db: { native_parser: true },
//   server: { poolSize: 5 },
//   replset: { rs_name: 'myReplicaSetName' },
//   user: 'myUserName',
//   pass: 'myPassword'
// }
// uri:'mongodb://127.0.0.1:27017/cms'
// mongoose.connect(uri, options);
module.exports = {
  'secret': 'zhongweiAzivenday.com', // used when we create and verify JSON Web Tokens
  'database': 'mongodb://127.0.0.1:27017/cms' // 填写本地自己 mongodb 连接地址,xxx为数据表名
};