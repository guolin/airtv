'use strict';


angular.module('core').
    controller('TVController', ['$scope','ShortURL','socket',
	function($scope, ShortURL , socket) {

        socket.on('connect', function(){
            console.log('11');
            $scope.socketId = socket.socket.id;
            var url = 'http://192.168.1.102:3000/#!/remote/'+$scope.socketId;
            $scope.url = url;
            //ShortURL.get(url).
            //    success(function(data){
            //        $scope.url = data;
            //    });
            socket.on('play',function(data){
                $scope.playUrl = data;
            })
        });
	}
]);


angular.module('core').
    controller('RemoteController', ['$scope','ShortURL','socket','$stateParams',"$http","$location",
        function($scope, ShortURL , socket, $stateParams,$http,$location) {
            $scope.tvId = $stateParams.tvId;
            $scope.playUrl = '';

            socket.on('connect', function(){
                console.log('链接成功');
                socket.emit('ready', {tvId:$scope.tvId})
            });

            $scope.src = function(id){
                var id = id-1;
                var data = { src:urls[id], tvId:$scope.tvId };
                socket.emit('src', data)
            };
            $scope.customSrc = function(){
                var data = { src:$scope.customUrl, tvId:$scope.tvId };
                socket.emit('src', data)
            };
            $scope.customQQSrc = function(vid){
                var vvid = vid;
                if(!vvid){
                    vvid = $scope.vid
                }
                var data = { vid:vvid, tvId:$scope.tvId };
                socket.emit('src-qq', data)
            };
            $scope.play = function(){
                var data = {tvId:$scope.tvId };
                socket.emit('play', data)
            };
            $scope.pause = function(){
                var data = {tvId:$scope.tvId };
                socket.emit('pause', data)
            };

            var urls = [
                "http://220.181.91.15/vhot2.qqvideo.tc.qq.com/q0146stu05d.mp4?vkey=97608A86B76BD6E41C5B32217D2E5B83BB6ED53BA519E18F243A4D2639BE7FC0B3B046EBC9386CD26C41D69D2E7DB8A958850FD155C5ACDE&br=62174&platform=0&fmt=mp4&level=0&type=mp4",
                "http://220.181.91.29/vlive.qqvideo.tc.qq.com/r0015rjrp0y.mp4?vkey=1B57D86AD4AC08FD2DA152DF1E71F01365EA236F0A1DD44F3615A6B08016D7C4E968766A7E2CFDF5FAE5F1C0FC25A25F92FBDE5D3B0708DB&amp;br=62515&amp;platform=0&amp;fmt=mp4&amp;level=0&amp;type=mp4"
            ]

            $scope.impQQ = function(){
                var url = $scope.customUrl;
                var apiUrl = $location.protocol()+"://"+$location.host()+":"+$location.port()+"/videos/imp?url="+url
                $http.get(apiUrl).
                    success(function(data, status){
                        if(status !== 200){
                            return;
                        }
                        $scope.customQQSrc(data.source.id);
                    })
            }
        }
    ]);

