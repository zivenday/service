// var mysql = require("mysql");
// var pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: '123456',
//     database: 'verycms'
// });

// var query = function (sql, callback) { 
//     pool.getConnection(function (err, conn) {
//         if (err) {
//             callback(err, null, null);
//         } else {
//             conn.query(sql, function (err, vals, fields) {
//                 //释放连接  
//                 conn.release();
//                 //事件驱动回调  
//                 callback(err, vals, fields);
//             });
//         }
//     });
// };

// module.exports = query; 