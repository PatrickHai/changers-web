var http = require('http')
var https = require('https')
var fs = require('fs')
var express = require('express')
var mysql = require('mysql')
var app = express()
var config = require('./config-properties')
var Promise = require('promise');


//listening server on port 9000
app.use(express.static(__dirname))
app.listen(process.env.PORT || 9000)
console.log('sever is running on 9000!');

//跨域请求设置
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, uid, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
});

/*mysql connction pool*/
var pool = mysql.createPool({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: 'changke',
    port: config.dbPort
});

//fetching data from api
app.get('/api/rights/:id', function(req,res){
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
              res.write(str)
              res.end()
            })
        })
        request.on('error', function(e){
          console.log('issue:'+ e.message)
        })
        request.end()
})

app.post('/api/user', function(req, res){
  //get the user with token req.header('Authorization')
  var user = {
    name: 'patrick',
    id: 188,
    card: false,
    submit: true
  };
  res.send({code: 0, data: user});
})

app.post('/api/feeds', function(req, res){
  // console.log(req.header('Authorization'));
  var feeds = [];
  feeds.push({img:'http://img.changker.com/75/43/3d/75433d71038de22ae1ed0c7ebc2c9562@180w', nick: 'testnick', content: 'testContent'});
  feeds.push({img:'http://img.changker.com/75/43/3d/75433d71038de22ae1ed0c7ebc2c9562@180w', nick: 'testnick1', content: 'testContent1'});
  res.send({
    code: 0,
    feeds: feeds
  });
})


app.post('/api/form', function(req, res){
  //get the user with token req.header('Authorization')
  var form = {
      grab_style: 'btn main_btn',
      url: 'http://apitest.changker.com/html/benefit/platform/5',
      method: 'POST',
      grab_text: '立即领取',
      grab: {
        type: 0, 
        code: 999999, 
        endtime: '1970-01-01', 
        style: 'result_code hide'
      }
    };
  res.send({code: 0, data: form});
})


app.post('/api/right/:right_id', function(req, res){
    var right_id = req.param('right_id')
    var options = {
      host: 'apitest.changker.com',
      path: '/html/benefit/submit/'+right_id+'/?uid='+req.header('uid'),
      method: 'POST'
    }
   res.send({result: 1, data:{type: 1, code: 9999, endtime: '2018-12-31'}});
   res.end();
})

app.get('/api/store/:id', function(req, res){
  var id = req.param('id');
  var sql = 'select * from shop where id = '+ id;
  pool.getConnection(function (err, conn) {
        if (err) console.log("db connection issue:" + err)
        conn.query(sql,function(err,rows){
            if (err) console.log(err)
            if(rows && rows.length === 1){
              res.setHeader('content-type', 'text/html;charset=utf8')
              let data = {
                code: 0,
                data: rows[0]
              }
              res.write(JSON.stringify(data))
            }
            res.end()
            conn.release() 
        });
    });
})

app.get('/api/auto/:id', function(req, res){
  var id = req.param('id');//use this id to get the json obj from db
/*  var auto = {
      type: 1,
      data: [
              {"name": "pageTitle", "props": {"name": "patrick's test tiltle"}, "desc": "页面标题"},
              {"name": "ImageBox", "props":{"url": "https://img.changker.com/4a/ad/51/4aad5118ac7c385adb397e030102d799", "top": true}, "desc": "顶部图片"},
              {"name": "Dialog", "props":{"content": "终说再见，我们感怀的也许看起来是喜达屋的变化，但又何尝不是我们自己的点点滴滴，这些年，回头看看，那些记忆。"}, "desc": "介绍文字"},
              {"name": "ImageBox", "props":{"url": "", "store": "3"}, "desc":"内容图片"},
              {"name": "ImageBox", "props":{"url": "", "store": "4"}, "desc":"内容图片"},
              {"name": "ImageBox", "props":{"url": "", "store": "5"}, "desc":"内容图片"}
          ]
  }*/
  var auto = {
    type: 1,
    data: [
            {"name": "pageTitle", "props": {"name": "推广落地页标题"}, "desc": "页面标题"},
            {"name": "ImageBox", "props":{"url": "https://img.changker.com/4a/ad/51/4aad5118ac7c385adb397e030102d799", "top": true}, "desc": "顶部图片"},
            {"name": "Heading", props:{"content": "常客体验金卡权益", "level": 1}, "desc": "段落标题"},
            {"name": "Dialog", "props":{"content": "HUAWEI Mate 9用户激活“常客”客户端后自动获取常客体验金卡权益（3个月），权益内容包括：专车出行服务、餐饮优先预定、私人活动邀请、热门赛事参与等。"}, "desc": "介绍文字"},
            {"name": "ImageBox", "props":{"url": "https://img.changker.com/4a/ad/51/4aad5118ac7c385adb397e030102d799"}, "desc":"内容图片"},
            {"name": "Heading", props:{"content": "机场快速安检通道权益", "level": 2}, "desc": "段落标题"},
            {"name": "Dialog", "props":{"content": "常客为 HUAWEI Mate9用户提供机场快速安全通道（CIP）服务，目前常客与全国12座机场达成协议，精英用户可持常客CIP权益码通行，无需等待。"}, "desc": "介绍文字"},
            {"name": "ImageBox", "props":{"url": "https://img.changker.com/4a/ad/51/4aad5118ac7c385adb397e030102d799"}, "desc":"内容图片"},
            {"name": "Heading", props:{"content": "常客：源于商务旅行，服务中产精英", "level": 2}, "desc": "段落标题"},
            {"name": "Dialog", "props":{"content": "常客为 HUAWEI Mate9用户提供机场快速安全通道（CIP）服务，目前常客与全国12座机场达成协议，精英用户可持常客CIP权益码通行，无需等待。"}, "desc": "介绍文字"},
            {"name": "ButtonBox", "props": {"text": "认证会籍", "bottom": true, "href": "引导安装链接"}, "desc": "吸底按钮"}
        ]
  }
  var handlings = [];
  for(let i=0;i<auto.data.length;i++){
      if(auto.data[i].name === 'ImageBox' && auto.data[i].props.store){
        handlings.push(fillStore(auto.data[i].props, auto.type));
      }
  }
  if(handlings.length > 0){
      Promise.all(handlings).then(function(result){
        res.write(JSON.stringify({code: 0, data: auto}))
        res.end()
      }).catch(function(reason){
        console.log(reason);
      })
    }else{
      res.write(JSON.stringify({code: 0, data: auto}))
      res.end()
    }
})

function fillStore(props, type){
  if(type === 1){//餐饮模板
    return new Promise(function(resolve, reject){
        var sql = 'select * from shop where id = '+ props.store;
        pool.getConnection(function (err, conn) {
              if (err) console.log("db connection issue:" + err)
              conn.query(sql,function(err,rows){
                  if (err) console.log(err)
                  if(rows && rows.length === 1){
                    props.store = rows[0];
                  }
                  conn.release();
                  resolve();
              });
          });
    });
  }else{//商品模板
    return new Promise(function(resolve, reject){
        var sql = 'select * from product where id = '+ props.store;
        pool.getConnection(function (err, conn) {
              if (err) console.log("db connection issue:" + err)
              conn.query(sql,function(err,rows){
                  if (err) console.log(err)
                  if(rows && rows.length === 1){
                    props.store = rows[0];
                  }
                  conn.release();
                  resolve();
              });
          });
    });
  }
}