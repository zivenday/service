var express = require('express');
// var query = require('../public/config/mysql.js');

var router = express.Router();
// var mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
        
// var conn = mongoose.connect('mongodb://127.0.0.1:27017/cms');
// var User = new mongoose.Schema({
//     name: String,
//     password: String
// });
// var Model = conn.model('user', User);

/* GET users listing. */
router.post('/', function(req, res, next) {
    // var _user = req.body;
    // Model.findOne({name:_user.name,password:_user.password},function(err,user){
    //     console.log(user)
    //     res.render(user);
    // })
    // console.log(_user.name);
    // console.log(_user.password);
    // var name = connection.escape(_user.name);
    // var pwd = connection.escape(_user.password);
    // var sql = 'SELECT  * FROM user WHERE name =' + name + ' AND password=' + pwd;
    // query(sql, function(err, rows, fields) {
    //     if (err){
    //         throw err
    //     }
    //     else {
    //     	console.log(rows.length);
    //         if (rows.length > 0) {
    //             res.json({ 'code': 1,message:'登录成功！'})
    //         } else {
    //             res.json({ 'code': 0,message:'用户名或密码错误！' })
    //         }
    //     }

    // });
})

module.exports = router;
