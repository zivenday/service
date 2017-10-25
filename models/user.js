const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
import config from '../public/config'
const jwt = require('jsonwebtoken');
const UserSchema = new Schema({
  name: {
    type: String,
    unique: true, // 不可重复约束
    require: true // 不可为空约束
  },
  password: {
    type: String,
    require: true
  },
  role:{
      type:Number,
      require:true
  },
  token: {
    type: String
  }
});

// 添加用户保存时中间件对password进行bcrypt加密,这样保证用户密码只有用户本人知道
UserSchema.pre('save', function (next) {
    var user = this;
    console.log('password',user.password)
    user.password=user.password||user.name//如果用户信息中没有密码，设置为默认密码
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});
// 校验用户输入密码是否正确
UserSchema.methods.comparePassword = function(passw, cb) {
    console.log('passw',passw);
    console.log('password',this.password)
    console.log('cb',this.cb)
    bcrypt.compare(passw, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        }
        console.log('isMatch',isMatch)
        cb(null, isMatch);
    });
};
UserSchema.statics={
    findByName:function(name,cb){
        return this.findOne({name:name}).exec(cb)
    },
    updateToken:function(user){
        return new Promise((resolve,reject)=>{
            let token = jwt.sign({
                name: user.name
              }, config.secret, {
                expiresIn: 60 * 60 * 1000
              });
              user.token = token;
              resolve(user)
             
        })
    }
}
// // 校验用户token是否正常
// UserSchema.methods.compareToken = function(authToken, passport) {

// };
module.exports = mongoose.model('User', UserSchema);