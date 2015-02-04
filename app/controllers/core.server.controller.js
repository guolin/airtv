'use strict';

var request = require('request');
/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

exports.short = function(req, res) {
    var url =  req.param('url');
    url = url.replace('#',"%23");
    url = "https://api.weibo.com/2/short_url/shorten.json?source=1681459862&url_long="+url ;
    console.log(url);
    request.get(url ,
        function(err,response,body){
            res.send(body);
        });
};
