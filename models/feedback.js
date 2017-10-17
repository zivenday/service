const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
  name: {
    type: String,
    unique: true, // 不可重复约束
    require: true // 不可为空约束
  },
  date: {
    type: Date,
    require: true,
    default: Date.now 
  },
  info: {
    type: String,
    default:'没有介绍信息'
  }
});


// // 校验用户token是否正常
// FeedbackSchema.methods.compareToken = function(authToken, passport) {

// };
module.exports = mongoose.model('Feedback', FeedbackSchema);