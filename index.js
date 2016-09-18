var http = require('http')
/*
http.createServer(function(req, res){
  res.write('The very first changers web page!')
  res.end()
}).listen(9000)*/

var express = require('express')
var app = express()

app.use(express.static(__dirname))
app.listen(process.env.PORT || 9000)


/*var options = {
  host: 'api.rights.changker.com',
  path: '/rights/show?id=5',
  method: 'GET'
}
var req = http.request(options, function(response){
        var str = ''
        response.setEncoding('utf8')
        response.on('data', function(chunk){
          str += chunk
        })
        response.on('end', function(){
          console.log(str)
        })
    })
    req.on('error', function(e){
      console.log('issue:'+ e.message)
    })
    req.end()*/
