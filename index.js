var http = require('http')
var fs = require('fs')
var express = require('express')
var mysql = require('mysql')
var app = express()
var util = require('./app/util/util')

//listening server on port 9000
app.use(express.static(__dirname))
app.listen(process.env.PORT || 9000)
console.log('sever is running on 9000!');

//跨域请求设置
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
});

/*mysql connction pool*/
var pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'rights',
    port: 3306
});

app.get('/api/rights/:id', function(req, res){
  let id = req.param('id') ? req.param('id') : 5
  let sql = 'select * from rights where id = ' + id
  pool.getConnection(function (err, conn) {
      if (err) console.log("db connection issue:" + err)
      conn.query(sql,function(err,rows){
          if (err) console.log(err)
          if(rows && rows.length === 1){
            res.setHeader('content-type', 'text/html;charset=utf8')
            rows[0].banner = util.generateImgUrl(rows[0].banner);
            let data = {
              status: 200,
              message: 'succeed',
              data: rows[0]
            }
            res.write(JSON.stringify(data))
          }
          res.end()
          conn.release()
      });
  });
})


//fetching data from api
app.get('/api/test/:id', function(req,res){
    let id = req.param('id') ? req.param('id') : 5;
    var options = {
      host: 'api.rights.changker.com',
      path: '/rights/show?id='+id,
      method: 'GET'
    }
    var request = http.request(options, function(response){
            var str = ''
            let data = {};
            response.setEncoding('utf8')
            response.on('data', function(chunk){
              str += chunk
            })
            response.on('end', function(){
              res.contentType('json')
              res.encoding = 'utf-8'
              data = {status: '200', msg:'succeed', data: str}
              console.log(data);
              res.write(JSON.stringify(data))
              res.setHeader('content-type', 'text/html;charset=utf8')
              res.end()
            })
        })
        request.on('error', function(e){
          console.log('issue:'+ e.message)
        })
        request.end()
})


