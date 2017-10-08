/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function (ng) {
    var mod = ng.module('videoModule', ['ui.router']);


    mod.config(['$stateProvider',
        function ($sp) {
            var basePath = 'src/modules/video/';
            

            $sp.state('video', {
                url: '/videos?page&limit',
                abstract: true,
                views: {
                    mainView: {
                        templateUrl: basePath + 'video.tpl.html',
                        controller: 'videoCtrl'
                    }
                }
            });
            $sp.state('videoList', {
                url: '/list',
                parent: 'video',
                views: {
                    mainView: {
                        templateUrl: basePath + 'video.tpl.html',
                        controller: 'videoCtrl'
                    }
                }
            });
          
        }]);
})(window.angular);

