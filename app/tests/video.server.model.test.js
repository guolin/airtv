'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Video = mongoose.model('Video');

/**
 * Globals
 */
var user, video;

/**
 * Unit tests
 */
describe('Video Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			video = new Video({
				name: 'Video Name',
                img: "http://cdn.img.com/videoid.png",
                description:"Video description",
				user: user
			});
			done();
		});
	});

    describe("Method getFromUrl", function(){

        var qq_urls = [
            "http://v.qq.com/cover/x/x08n7dk770mwdd3.html",
            "http://v.qq.com/cover/w/w4wyn7up5j8vlz2.html",
            "http://v.qq.com/cover/4/42f7ylih0ot035h.html?vid=y01464j3kql",
            "http://v.qq.com/cover/5/5x3doax9eusscl7.html",
            "http://v.qq.com/cover/5/5x3doax9eusscl7/r00154i3et8.html",
            "http://v.qq.com/cover/w/whmodb4bm37tc0l.html"
        ];
        var i
        for(i=0; i<qq_urls.length ; i++){
            var url = qq_urls[i];

            it('should be able to get info from' + url, function(done) {
                return Video.getFromUrl(url,function(video){
                    video.name.should.be.ok;
                    video.source.id.should.be.ok;
                    video.img.should.be.ok;
                    done();
                });
            });

        }

    });

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return video.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			video.name = '';

			return video.save(function(err) {
				should.exist(err);
				done();
			});
		});

        it('should be able to save tags without problems', function(done) {
            video.source = {site:"QQ", id:"123"};
            return video.save(function(err, v) {
                should.not.exist(err);
                v.source.id.should.be.equal('123');
                done();
            });
        });

	});

	afterEach(function(done) { 
		Video.remove().exec();
		User.remove().exec();

		done();
	});
});
