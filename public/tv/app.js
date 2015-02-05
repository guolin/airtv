$( document ).ready(function(){

    var player;
    player = videojs(document.getElementById('video'));
    player.muted(true);
    var default_url = "http://220.181.91.18/vhot2.qqvideo.tc.qq.com/f0146b2d2z7.mp4?vkey=B11C1D98B66EDC599730072FC7B0115A071A27B16783BC46D52C3B432A14ECE6A16B3F38F79F854A97636BD9F34C946D787970304DC4E45C&br=62379&platform=0&fmt=mp4&level=0&type=mp4";
    player.src(default_url);
    player.play();

    // step1: 准备数据（获取deviceid，socket链接，短链接，）
    var guid = '';
    if(!$.cookie("DeviceID")){
        guid = getGuid();
        $.cookie("DeviceID", guid);
    }else{
        guid = $.cookie("DeviceID")
    }

    switch_step(".step0");

    var socket = io.connect();
    socket.on('connect', function (data) {
        console.log("链接成功");
        socket.emit('subscribe', {guid:guid});

        var remoteUrl = "http://192.168.1.102:3000/%23!/remote/"+guid;
        $.getJSON("/api/short?url="+remoteUrl, function(data){
            console.log(data);
            remoteUrl = data.urls[0].url_short;
            $("#qrcode").qrcode(remoteUrl);
            $("#remote_url").text(remoteUrl);
            $("#remote_url").attr("href", remoteUrl);

            switch_step(".step1");
        });


        // step2: 连接成功，等待控制
        socket.on('ready', function(){
            console.log("遥控器就位");
            $(".home-link-btn").hide();
            switch_step(".step2");
        });

        // step3: 开始播放
        socket.on('src', function(data){
            play_url(data.src, player);
        });

        socket.on('src-qq', function(data){
            console.log(data);
            getQQVideo(data.vid).done(function(data){
                play_url(data, player);
            });
        });

        socket.on('play', function(){
            console.log("play");
            player.play();
        });

        socket.on('pause', function(){
            console.log("pause");
            player.pause();
        });
    });


});

var play_url = function(url, player){
    console.log("播放地址： "+url);
    //$("#video").removeClass("bg-video");
    $("#video").addClass("main-video");
    $("video").attr("src", url);
    //player.src(data.src);
    player.muted(false);
    player.volume(0.6);
    player.play();
}

var switch_step = function(step){
    $(".step0").hide();
    $(".step2").hide();
    $(".step1").hide();
    $(".home-content .container").removeClass('hide');
    $(step).show(500);
};

var getGuid = (function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
})();

var getQQVideo = function(vid){
    var url = "http://vv.video.qq.com/geturl?otype=json&charge=0&callback=abc&vid="+vid;
    var dtd = $.Deferred();
    $.ajax({
        url:url,
        dataType: "jsonp",
        jsonp: "callback",
        success: function(data){
            var videoUrl = data.vd.vi[0].url;
            dtd.resolve(videoUrl);
        }
    });
    return dtd.promise();
};

var getYoukuVideo = function(vid){
    function getFileIDMixString(seed){
        var source = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\:._-1234567890".split(''),
            mixed = [],index;
        for (var i=0, len = source.length; i< len;i++){
            seed = (seed * 211 + 30031) % 65536;
            index = Math.floor(seed/65536 * source.length);
            mixed.push(source[index]);
            source.splice(index,1);
        }
        return mixed.join('');
    };
    function getFileID(fileid, seed){
        var mixed = getFileIDMixString(seed), ids= fileid.split("*"), realId = [], idx;
        for (var i=0; i< ids.length; i++){
            idx = parseInt(ids[i],10);
            realId.push(mixed.charAt(idx));
        }
        return realId.join('');
    };
    $.ajax({
        url: 'http://v.youku.com/player/getPlaylist/VideoIDS/' + vid + '/Pf/4?__callback=',
        dataType: "jsonp",
        jsonp: "__callback",
        success: function(param){
            var d      = new Date(),
                fileid = getFileID(param.data[0]['streamfileids']['3gphd'], param.data[0]['seed']),
                sid    = d.getTime() + "" + (1E3 + d.getMilliseconds()) + "" + (parseInt(Math.random() * 9E3)),
                k      = param.data[0]['segs']['3gphd'][0]['k'],
                st     = param.data[0]['segs']['3gphd'][0]['seconds'];
            $.ajax({
                url: 'http://f.youku.com/player/getFlvPath/sid/'+sid+'_00/st/mp4/fileid/'+fileid+'?K='+k+'&hd=1&myp=0&ts=1156&ypp=0&ymovie=1&callback=',
                dataType: "jsonp",
                jsonp: "callback",
                success: function(param){
                    console.log(param[0]['server']);
                }
            })
        }
    });
};
