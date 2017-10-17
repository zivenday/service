// var express = require('express');

import express from 'express'
import http from 'http'
import superagent from 'superagent'
import cookieParser from 'cookie-parser'
import User from '../models/user'
import config from '../public/config'
const jwt = require('jsonwebtoken');
let router = express.Router();
router.get('/oauthPath', function (req, res, next) {
  let client_id = '7524fc29022fb0e86b3f';
  let scope = 'user'
  let opath = "https://github.com/login/oauth/authorize";
  opath += '?client_id=' + client_id;
  opath += '&scope=' + scope;
  res.json({
    code: 0,
    url: opath
  })
});
//注册
router.post('/signUp',function(req,res,next){
  var newUser = new User({
    name: req.body.name,
    password: req.body.password
  });
  // 保存用户账号
  newUser.save(err => {
    if (err) {
      res.json({'code':1, message: '注册失败!'});
    }else{
      res.json({ 'code': 0,message:'注册成功！'})
    }
    
  });
})
//登录
router.post('/login', function (req, res, next) {
  console.log('eeee')
  User.findOne({
    name: req.body.name
  }, (err, user) => {
    if (err) {
      throw err;
    }
    if (!user) {
      res.json({
        code:1,
        success: false,
        message: '认证失败,用户不存在!'
      });
    } else if (user) {
      console.log('user',user)
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          var token = jwt.sign({name:user.name}
          , config.secret, { expiresIn: 60*60*1000 });
          user.token = token;
          user.save(function (err) {
            if (err) {
              res.send(err);
            }else{
              res.cookie('user', JSON.stringify(_user),{ maxAge: 3600000 });
          res.json({
            code:0,
            success: true,
            message: '登录成功!'
          });
            }
          });
           
        } else {
          res.json({
            code:1,
            success: false,
            message: '认证失败,密码错误!'
          });
        }
      });
    }
  })
})
module.exports = router;