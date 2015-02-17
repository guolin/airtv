'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    timestamps = require('mongoose-timestamp'),
    request = require('request'),
    cheerio = require('cheerio');

/**
 * Video Schema
 */
var VideoSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Video name',
		trim: true,
        index: { unique: true, dropDups: true }
	},
    img: String,
    description: String,
    source:{
        site:String,
        id:String,
        url:String
    },
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

VideoSchema.statics.getFromUrl = function (url, cb){
    request(url, function (error, response, html) {
        if (!error && response.statusCode === 200) {
            var $ = cheerio.load(html);
            var simple_url = $('meta[itemprop=url]').attr('content');
            if (!simple_url) simple_url = url;
            var id = url.match(/vid=(\w+)/);
            if (id) {
                id = id[1];
            } else {
                var u = $('meta[itemprop=url]').attr('content');
                if (u && u.match(/(\w+).html/)) {
                    id = u.match(/(\w+).html/);
                    id = id[1];
                } else {
                    id = html.match(/vid=(\w+)/);
                    if(id) id = id[1];
                }
            }
            var img = $('meta[itemprop=image]').attr('content');
            if(!img){
                img = $('.album_pic img').attr('src');
            }
            var description = $('meta[itemprop=description]').attr('content');
            var name = $('#h1_title').text();

            var video = {
                name:name,
                img:img,
                description:description,
                source:{
                    site:'qq',
                    id:id,
                    url:simple_url
                }
            };
            cb(video);
        }
    });
};

VideoSchema.plugin(timestamps);
mongoose.model('Video', VideoSchema);


