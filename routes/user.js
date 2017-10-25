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
router.post('/signUp', function (req, res, next) {
  User.findByName(req.body.name,user=>{
    if(!user){
      User.updateToken(new User({
        name: req.body.name,
        role:1,
        password: req.body.password
      })).then(user=>{
        user.save(err=>{
          if (err) {
              res.json({
                code: 1,
                message: err.toJSON().errmsg
              })
          } else {
            res.cookie('user',JSON.stringify({
              name: user.name,
              role:user.role,
              token: user.token
              
            }), {
              maxAge: 3600000
            });
            res.send({
              'code': 0,
              message: '注册成功！'
            })
          } 
        })
      })
    }else{
      res.json({
        code: 1,
        message: 'Error duplicate user!'
      })
    }
  })
})
//登录
router.post('/login', function (req, res, next) {
  let _name = req.body.name
  User.findByName(_name, (err, user) => {
    console.log(err, user)
    if (err) {
      err.code = 1;
      res.json(err)
    } else {
      if (!!user) {
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (isMatch && !err) {
            User.updateToken(user).then(user => {
              user.save(err=>{
                if (err) {
                    res.json({
                      code: 1,
                      message: err.toJSON().errmsg
                    })
                } else {
                  res.cookie('user', JSON.stringify({
                    name: user.name,
                    role:user.role,
                    token: user.token
                  }), {
                    maxAge: 3600000
                  });
                  res.json({
                    code: 0,
                    message: '登录成功!'
                  });
                } 
              })
             
            }).catch(err => {
              err.code = 1
              res.json(err)
            })
          } else {
            res.json({
              code: 1,
              message: '认证失败,密码错误!'
            });
          }
        });
      } else {
        res.json({
          code: 1,
          message: 'user is no-exist'
        })
      }
    }
  }).catch(err => {
    err.code = 1;
    res.json(err)
  })
})
module.exports = router;