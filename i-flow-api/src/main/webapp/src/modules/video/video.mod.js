/*
The MIT License (MIT)

Copyright (c) 2015 Los Andes University

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
(function (ng) {
    var mod = ng.module('videoModule', ['ngCrud', 'ui.router']);

    mod.constant('videoModel', {
        name: 'video',
        displayName:  'Video',
        url: 'videos',
        fields: {
            name: {
                
                displayName: 'Name',
                type:  'String',
                required: true 
            },
            description: {
                
                displayName: 'Description',
                type:  'String',
                required: true 
            },
            content: {
                displayName:  'Content',
                type: 'Reference',
                model: 'contentModel',
                options: [],
                required:  true 
            }        }
    });

    mod.config(['$stateProvider',
        function($sp){
            var basePath = 'src/modules/video/';
            var baseInstancePath = basePath + 'instance/';

            $sp.state('video', {
                url: '/videos?page&limit',
                abstract: true,
                
                views: {
                     mainView: {
                        templateUrl: basePath + 'video.tpl.html',
                        controller: 'videoCtrl'
                    }
                },
                resolve: {
                    references: ['$q', 'Restangular', function ($q, r) {
                            return $q.all({
                                content: r.all('content').getList()
                            });
                        }],
                    model: 'videoModel',
                    videos: ['Restangular', 'model', '$stateParams', function (r, model, $params) {
                            return r.all(model.url).getList($params);
                        }]
                }
            });
            $sp.state('videoList', {
                url: '/list',
                parent: 'video',
                views: {
                     videoView: {
                        templateUrl: basePath + 'list/video.list.tpl.html',
                        controller: 'videoListCtrl',
                        controllerAs: 'ctrl'
                    }
                },
                 resolve:{
				   model: 'videoModel'
					},
                 ncyBreadcrumb: {
                   label: 'video'
                    }
            });
            $sp.state('videoNew', {
                url: '/new',
                parent: 'video',
                views: {
                    videoView: {
                        templateUrl: basePath + 'new/video.new.tpl.html',
                        controller: 'videoNewCtrl',
                        controllerAs: 'ctrl'
                    }
                },
                  resolve:{
						model: 'videoModel'
					},
                  ncyBreadcrumb: {
                        parent :'videoList', 
                        label: 'new'
                   }
            });
            $sp.state('videoInstance', {
                url: '/{videoId:int}',
                abstract: true,
                parent: 'video',
                views: {
                    videoView: {
                        template: '<div ui-view="videoInstanceView"></div>'
                    }
                },
                resolve: {
                    video: ['videos', '$stateParams', function (videos, $params) {
                            return videos.get($params.videoId);
                        }]
                }
            });
            $sp.state('videoDetail', {
                url: '/details',
                parent: 'videoInstance',
                views: {
                    videoInstanceView: {
                        templateUrl: baseInstancePath + 'detail/video.detail.tpl.html',
                        controller: 'videoDetailCtrl'
                    }
                },
                  resolve:{
						model: 'videoModel'
					},
                  ncyBreadcrumb: {
                        parent :'videoList', 
                        label: 'details'
                    }
            });
            $sp.state('videoEdit', {
                url: '/edit',
                sticky: true,
                parent: 'videoInstance',
                views: {
                    videoInstanceView: {
                        templateUrl: baseInstancePath + 'edit/video.edit.tpl.html',
                        controller: 'videoEditCtrl',
                        controllerAs: 'ctrl'
                    }
                },
                  resolve:{
						model: 'videoModel'
					},
                  ncyBreadcrumb: {
                        parent :'videoDetail', 
                        label: 'edit'
                    }
            });
            $sp.state('videoDelete', {
                url: '/delete',
                parent: 'videoInstance',
                views: {
                    videoInstanceView: {
                        templateUrl: baseInstancePath + 'delete/video.delete.tpl.html',
                        controller: 'videoDeleteCtrl',
                        controllerAs: 'ctrl'
                    }
                },
                  resolve:{
				      model: 'videoModel'
					}
            });
	}]);
})(window.angular);
