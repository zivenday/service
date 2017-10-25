var express = require('express');
// var query = require('../public/config/mysql.js');

var router = express.Router();
import Feedback from '../models/feedback'

//删除记录
// router.get('/remove', function (req, res, next) {
//     let _feedback = req.query;
//     console.log(_feedback)
//     console.log(_feedback.id);
//     let id = pool.escape(_feedback.id);
//     let sql = 'DELETE FROM feedbacks WHERE id=' + id;
//     console.log(1111)
//     console.log(sql)
//     query(sql, function (err, results) {
//         if (results) {
//             res.json({ 'code': 1, message: '删除成功！' })
//         } else {
//             res.json({ 'code': 0, message: '删除失败！' })
//         }
//     })
// })


//全部查询，条件查询，分页查询
router.post('',function(req,res,next){
    let total=0;
    Feedback.find({},'-_id,name,date,info').count().exec().then(count=>{
       total=count;
        Feedback.find({}).limit(req.body.pageSize).skip((req.body.page-1)*req.body.pageSize).exec().then(feedbackList=>{
            res.json({code:0,message:'success',total:total,feedbackList:feedbackList})
        }).catch(err=>{
            console.log(err)
        })
    }).catch(err=>{
        console.log(err)
    });
   
})
router.post('/:id',function(req,res,next){
    let count=Feedback.find({}).count();
    let query=query||{}
    console.log('ssss')
    Feedback.find({},(err,list)=>{
     console.log('feedback')
    if(err){
        console.log(err)
    }else{
        console.log(list)
    }
 })
})
// router.get('/query', function (req, res, next) {
//     let _fb = req.query;
//     let page = (_fb.page - 1) * 10;//计算查询的记录起点
//     let ps = Number(_fb.pageSize);//计算结束点
//     let flitr = (_fb.name || _fb.kyw || _fb.bdate ? ' WHERE '//如果存在一条条件查询就加上where，如果没有直接为空字符串
//         + (_fb.name ? 'name="' + _fb.name + '"' : '')//判断name是否需要查询
//         + (_fb.name & _fb.kyw ? ' AND ' : '')//如果两者都存在就加上and
//         + (_fb.kyw ? ' info like "%' + _fb.kyw + '%"' : '') : '')//判断关键字是否需要查询
//         + ((_fb.bdate ? 1 : 0) & (_fb.name || _fb.kyw ? 1 : 0) ? ' AND ' : '')//如果时间区间存在并且前面两个条件查询有一个存在就加上and
//         + (_fb.bdate ? 'date BETWEEN "' + _fb.bdate + '" AND "' + _fb.edate + '"' : '')


//     let sql1 = 'SELECT count(*) as total FROM feedbacks ' + flitr + ' ; '
//     let sql2 = 'SELECT id, name,DATE_FORMAT(date,"%Y-%m-%d") date,info FROM feedbacks ' + flitr + '  LIMIT  ' + page + ' , ' + ps
//     query(sql1, function (err, rows, fields) {
//         if (err) {
//             console.log(err);
//             res.json({
//                 code: 0,
//                 message: '[查询失败]' + err
//             })
//         } else {
//             query(sql2, function (err, results, fields) {
//                 if (err) {
//                     console.log(err);
//                     res.json({
//                         code: 0,
//                         message: '[查询失败]' + err
//                     })
//                 } else {
//                     res.json({
//                         data: {
//                             total: rows[0].total,
//                             feedbacks: results
//                         },
//                         code: 1,
//                         message: '查询成功'
//                     })
//                 }
//             });

//         }
//     })
// })


module.exports = router;