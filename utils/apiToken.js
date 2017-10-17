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
            console.log('user', req.cookies.user)
            let _token=JSON.parse(req.cookies.user).token;
            User.findOne({
                name: JSON.parse(req.cookies.user).name
            }).exec().then(user => {
                if ((!!user)&&(_token===user.token)) {
                    console.log('user',user)
                    jwt.verify(JSON.parse(req.cookies.user).token, config.secret,function (err, decoded) {
                        if (err) {
                            err = {
                                code: 1,
                                message: 'TokenExpiredError'
                            }
                            res.json(err)
                        } else { //token检测正常则通过
                            console.log('decode',decoded)
                            next()
                        }
                    });
                } else {
                   let err = {
                        code: 1,
                        message: 'user is no-exist'
                    }
                    res.json(err)
                }
            })

        } else {
            res.json({
                code: 1,
                message: 'NoTokenError'
            })
        }
    }
}