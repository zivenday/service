// var express = require('express');

import express from 'express'
import http from 'http'
import superagent from 'superagent';
import cookieParser from 'cookie-parser'
import config from '../public/config'
import User from '../models/user'
const jwt = require('jsonwebtoken');
let router = express.Router();
router.get('/getGithubOauth', function (req, res, next) {
  const client_id = '7524fc29022fb0e86b3f';
  const scope = 'user'
  const spath = "https://github.com/login/oauth/authorize" + '?client_id=' + client_id + '&scope=' + scope;
  res.json({
    code: 0,
    url: spath
  })
})
router.get('/callback', function (req, res, next) {
  let callback = req.query.code;
  let backData = {
    client_id: '7524fc29022fb0e86b3f',
    client_secret: '4309b41d0367debd67ef186cd6ae52696ed42b46',
    code: callback
  }
  superagent.post('https://github.com/login/oauth/access_token').send(backData).end(
    function (err, resp) {
      if (resp.ok) {
        superagent.get('https://api.github.com/user?access_token=' + resp.body.access_token).end(
          function (error, respo) {
            // console.log(respo)
            let _name = respo.body.login || respo.body.name
            User.findOne({
              name: _name
            }, function (err, user) {
              if (err) {
                res.send({
                  err: err
                })
              } else {
                if(user){
                  user.name=_name
                }else{
                  
                  user=new User({name:_name})
                }
                let _token = jwt.sign({
                  name: _name
                }, config.secret, {
                  expiresIn: 60 * 60 * 1000
                });
                
                user.token = _token
                console.log('token',user)
                user.save(function (err) {
                  
                  if (err) {
                    res.send(err)
                  } else {
                    console.log(111)
                    res.cookie('user', JSON.stringify(user), {
                      maxAge: 3600000
                    })
                    res.redirect('http://localhost:8080/')
                  }
                })
              }
            })
          }
        );
      } else {
        res.json({
          code: 0,
          message: 'error'
        })
      }
    }
  );

})
module.exports = router;