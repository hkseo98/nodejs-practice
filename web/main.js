var http = require('http');
var fs = require('fs');
var url = require('url'); // 노드js 모듈 불러오기
var qs = require('querystring');

var template = { // 템플릿 함수 정리용 객체
  HTML: function (title, list, body, control) {
    return `<!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB!!!!</a></h1>
          ${list}
          ${control}
          ${body}
        </body>
        </html>
        `
  },
  list: function (filelist){
    var list = '<ul>'
            var i =0
            while(i < filelist.length){
              list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
              i++
            }
            list = list + '<ul>'
    return list;
  }
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    
    
    if (pathname === '/') {
      if (queryData.id === undefined) {

        fs.readdir('/Users/mac/Desktop/nodejs.js/data', function (err, filelist) {
          var title = 'Welcome';
          var desc = 'Hello NODE.JS'
       
          var list = template.list(filelist)
          var html = template.HTML(title, list, 
            `<h2>${title}</h2>${desc}`, `<a href="/create">create</a>`)
          
          response.writeHead(200);
          response.end(html);
        })
    } else {
      fs.readdir('/Users/mac/Desktop/nodejs.js/data', function (err, filelist) {
        fs.readFile(`/Users/mac/Desktop/nodejs.js/data/${queryData.id}`, 'utf8', function(err, desc){
          var title = queryData.id;
          var list = template.list(filelist)
          var html = template.HTML(title, list, 
            `<h2>${title}</h2>${desc}`, `<a href="/create">create</a> 
            <a href="/update?id=${title}">update</a> 
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <input type="submit" value="delete">
            </form>
            `)
          response.writeHead(200);
          response.end(html);
          });
        });
      }
    } else if (pathname === '/create') {
      fs.readdir('/Users/mac/Desktop/nodejs.js/data', function (err, filelist) {
        var title = 'WEB - create';
     
        var list = template.list(filelist)
        var html = template.HTML(title, list, `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
              <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
              <input type="submit">
          </p>
        </form>
    
        `, '')
        
        response.writeHead(200);
        response.end(html);
      })
    } else if (pathname === '/create_process') {
      var body = '';
      request.on('data', function(data){
        body += data; // request.on('data') = 데이터를 수신할 때마다 콜백함수를 호출함
      });
      request.on('end', function(){
        // request.on('data')로 데이터를 다 수신 받으면 request.on('end'를 실행하게 됨. 
        var post = qs.parse(body)
        var title = post.title;
        var description = post.description;
        fs.writeFile(`/Users/mac/Desktop/nodejs.js/data/${title}`, description, 'utf8', 
        (err)=>{
          response.writeHead(302, {Location: `/?id=${title}`}); // 302 - 페이지 redirection
          response.end();
          
        })
        
      });
    } else if (pathname === '/update') {
      fs.readdir('/Users/mac/Desktop/nodejs.js/data', function (err, filelist) {
        fs.readFile(`/Users/mac/Desktop/nodejs.js/data/${queryData.id}`, 'utf8', function(err, desc){
          var title = queryData.id;
          var list = template.list(filelist)
          var html = template.HTML(title, list, 
            // <input type="hidden" name="id" value="${title}">으로 화면엔 보이지 않게 하여 id라는 이름으로 value값 전달. -> 수정되지 않은 수정할 파일의 이름을 받을 수 있다.
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}"> 
              <p><input type="text" name="title" placeholder="title" value=${title}></p>
              <p>
                  <textarea name="description" placeholder="description">${desc}</textarea>
              </p>
              <p>
                  <input type="submit">
              </p>
            </form>
            
          `, `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`)
          response.writeHead(200);
          response.end(html);
          });
        });
    } else if (pathname === '/update_process') {
      var body = '';
      request.on('data', function(data){
        body += data; // request.on('data') = 데이터를 수신할 때마다 콜백함수를 호출함
      });
      request.on('end', function(){
        // request.on('data')로 데이터를 다 수신 받으면 request.on('end'를 실행하게 됨. 
        var post = qs.parse(body)
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`/Users/mac/Desktop/nodejs.js/data/${id}`, `/Users/mac/Desktop/nodejs.js/data/${title}`, (err)=>{
          fs.writeFile(`/Users/mac/Desktop/nodejs.js/data/${title}`, description, 'utf8', (err)=> {
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          })
        })
      })
    } else if (pathname === '/delete_process') {
      // if (confirm('really?') === false) {
      //   response.writeHead(302, {Location: '/'});
      // }
      var body = '';
      request.on('data', function(data){
        body += data; // request.on('data') = 데이터를 수신할 때마다 콜백함수를 호출함
      });
      request.on('end', function(){
        // request.on('data')로 데이터를 다 수신 받으면 request.on('end'를 실행하게 됨. 
        var post = qs.parse(body)
        var id = post.id;
        fs.unlink(`/Users/mac/Desktop/nodejs.js/data/${id}`, (err)=>{
          response.writeHead(302, {Location: '/'});
          response.end();
        })
      })
    } else {
      response.writeHead(404);
      response.end('Not found')
    }
  
 
});
app.listen(3000);
