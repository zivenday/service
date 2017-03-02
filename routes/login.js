var express = require('express');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'very'
});
connection.connect();
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
    var _user = req.body;
    console.log(_user.name);
    console.log(_user.password);
    var name = connection.escape(_user.name);
    var pwd = connection.escape(_user.password);
    var sql = 'SELECT  * FROM user WHERE name =' + name + ' AND password=' + pwd;
    connection.query(sql, function(err, rows, fields) {
        if (err){
            throw err
        }
        else {
        	console.log(rows.length);
            if (rows.length > 0) {
                res.json({ 'code': 1,message:'登录成功！'})
            } else {
                res.json({ 'code': 0,message:'用户名或密码错误！' })
            }
        }

    });
})

module.exports = router;
