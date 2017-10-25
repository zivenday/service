const passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy;
const Cookie = require("js-cookie")
const User = require('../models/user');
const jwt = require('jsonwebtoken');
import config from '../public/config'
exports.check_auth = function (req, res, next) {
    const whiteList = ['login', 'oauthPath', 'signUp'] // 不重定向白名单
    let index = false
    Object.keys(whiteList).forEach(key => {
        if (req.url.toString().includes(whiteList[key])) {
            index = true;
            return
        }
    })
    if (index) { //白名单不必检测token
        next()
    } else {
        if (!!req.cookies.user) { //检测user token 是否存在
            let _user=JSON.parse(req.cookies.user)
            User.findByName(_user.name,(err,user)=>{
               if(!!user){
                   if(_user.token==user.token){
                    jwt.verify(JSON.parse(req.cookies.user).token, config.secret,function (err, decoded) {
                        !!err?err.code=1:next()
                        !!err?res.json(err):''
                    }); 
                   }else{//token不相同
                    res.json({code:1,message:'ErrorToken'})
                   }
               }else{//数据库中没有该user
                   res.json({code:1,message:'user is no-exist'})
               }
            }).catch(err=>{
                err.code=1;
                res.json(err)
            })
        } else {//没有携带cookie user
            res.json({
                code: 1,
                message: 'NoTokenError'
            })
        }
    }
}