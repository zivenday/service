var express = require('express');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'verycms',
    multipleStatements: true
});
connection.connect();
var router = express.Router();

//删除记录
router.get('/remove', function (req, res, next) {
    let _feedback = req.query;
    console.log(_feedback)
    console.log(_feedback.id);
    let id = connection.escape(_feedback.id);
    let sql = 'DELETE FROM feedbacks WHERE id=' + id;
    console.log(1111)
    console.log(sql)
    connection.query(sql, function (err, results) {
        if (results) {
            res.json({ 'code': 1, message: '删除成功！' })
        } else {
            res.json({ 'code': 0, message: '删除失败！' })
        }
    })
})


//全部查询，条件查询，分页查询
router.get('/query', function (req, res, next) {
    let _fb = req.query;
    let page = (_fb.page - 1) * 10;//计算查询的起点
    let ps = Number(_fb.pageSize);//计算结束点
    let flitr = (_fb.name || _fb.kyw || _fb.bdate ? ' WHERE '//如果存在一条条件查询就加上where，如果没有直接为空字符串
        + (_fb.name ? 'name="' + _fb.name + '"' : '')//判断name是否需要查询
        + (_fb.name & _fb.kyw ? ' AND ' : '')//如果两者都存在就加上and
        + (_fb.kyw ? ' info like "%' + _fb.kyw + '%"' : '') : '')//判断关键字是否需要查询
        + ((_fb.bdate ? 1:0) & (_fb.name || _fb.kyw ? 1:0) ? ' AND ' : '')//如果时间区间存在并且前面两个条件查询有一个存在就加上and
        + (_fb.bdate ? 'date BETWEEN "' + _fb.bdate + '" AND "' + _fb.edate + '"' : '')

   
    let sql1 = 'SELECT count(*) as total FROM feedbacks ' + flitr + ' ; '
    let sql2 = 'SELECT id, name,DATE_FORMAT(date,"%Y-%m-%d") date,info FROM feedbacks ' + flitr + '  LIMIT  ' + page + ' , ' + ps
    console.log(sql1 + sql2)
    connection.query(sql1 + sql2, function (err, results) {
        if (err) {
            console.log(err);
            res.json({
                code: 0,
                message: '[查询失败]' + err
            })
        } else {
            res.json({
                data: {
                    total: JSON.parse(JSON.stringify(results[0]))[0].total,
                    feedbacks: results[1]
                },
                code: 1,
                message: '查询成功'
            })
            console.log(results[1])
        }
    })
})


module.exports = router;