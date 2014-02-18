var fs = require('fs');
var http = require('http');
var url = require('url');
var path = require('path');
var env=require('jsdom').env;

var router = {
	'/': 'index.html',
	'/style.css': 'style.css',
	'/index.js': 'index.js',
	'/get-data':function(req,res){
		var qu = url.parse(req.url,true).query;
		var uurl = decodeURIComponent(qu.url);
		var html='';
		http.get(url.parse(uurl),function(res2){
			res2.on('data',function(data){
				html+=data	
			}).on('end',function(){
				env(html,function(err,win){
					var $=require('jquery')(win);
					var el=$(html).find('#page-content');
					if(el.length>0){
						var reStr=el.html();
						res.write(reStr);
					}else{
						res.write("1. 请检查网址 2. 微信修改了dom元素,请修改元素标识符");
					}
					res.end('\n');	
				});
			}).on('error',function(e){
				res.write(e.message);
				res.end('\n');
			});
			
		})
	}
}

http.createServer(function(req, res) {
	var r = url.parse(req.url).pathname;
	var file = router[r];
	if (typeof file == "function") {
		file(req,res);
	} else {
		fs.exists(file, function(exist) {
			if (exist) {
				var content = fs.readFileSync(file);
				res.write(content);
			} else {
				res.writeHead(404, {
					'Content-Type': 'text/plain'
				});
			}
			res.end('\n');
		})
	}

}).listen(4000);

console.log('visit http://localhost:4000');

