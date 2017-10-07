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
    var mod = ng.module('contentModule', ['ngCrud', 'ui.router']);

    mod.constant('contentModel', {
        name: 'content',
        displayName:  'Content',
        url: 'content',
        fields: {
            name: {
                
                displayName: 'Name',
                type:  'String',
                required: true 
            }        }
    });

    mod.config(['$stateProvider',
        function($sp){
            var basePath = 'src/modules/content/';
            var baseInstancePath = basePath + 'instance/';

            $sp.state('content', {
                url: '/content?page&limit',
                abstract: true,
                parent: 'screenDetail',
                views: {
                     screenChieldView: {
                        templateUrl: basePath + 'content.tpl.html',
                        controller: 'contentCtrl'
                    }
                },
                resolve: {
                    model: 'contentModel',
                    contents: ['screen', '$stateParams', 'model', function (screen, $params, model) {
                            return screen.getList(model.url, $params);
                        }]                }
            });
            $sp.state('contentList', {
                url: '/list',
                parent: 'content',
                views: {
                     'screenInstanceView@screenInstance': {
                        templateUrl: basePath + 'list/content.list.tpl.html',
                        controller: 'contentListCtrl',
                        controllerAs: 'ctrl'
                    }
                },
                 resolve:{
				   model: 'contentModel'
					},
                 ncyBreadcrumb: {
                   label: 'content'
                    }
            });
            $sp.state('contentNew', {
                url: '/new',
                parent: 'content',
                views: {
                    'screenInstanceView@screenInstance': {
                        templateUrl: basePath + 'new/content.new.tpl.html',
                        controller: 'contentNewCtrl',
                        controllerAs: 'ctrl'
                    }
                },
                  resolve:{
						model: 'contentModel'
					},
                  ncyBreadcrumb: {
                        parent :'contentList', 
                        label: 'new'
                   }
            });
            $sp.state('contentInstance', {
                url: '/{contentId:int}',
                abstract: true,
                parent: 'content',
                views: {
                    'screenInstanceView@screenInstance': {
                        template: '<div ui-view="contentInstanceView"></div>'
                    }
                },
                resolve: {
                    content: ['contents', '$stateParams', function (contents, $params) {
                            return contents.get($params.contentId);
                        }]
                }
            });
            $sp.state('contentDetail', {
                url: '/details',
                parent: 'contentInstance',
                views: {
                    contentInstanceView: {
                        templateUrl: baseInstancePath + 'detail/content.detail.tpl.html',
                        controller: 'contentDetailCtrl'
                    }
                },
                  resolve:{
						model: 'contentModel'
					},
                  ncyBreadcrumb: {
                        parent :'contentList', 
                        label: 'details'
                    }
            });
            $sp.state('contentEdit', {
                url: '/edit',
                sticky: true,
                parent: 'contentInstance',
                views: {
                    contentInstanceView: {
                        templateUrl: baseInstancePath + 'edit/content.edit.tpl.html',
                        controller: 'contentEditCtrl',
                        controllerAs: 'ctrl'
                    }
                },
                  resolve:{
						model: 'contentModel'
					},
                  ncyBreadcrumb: {
                        parent :'contentDetail', 
                        label: 'edit'
                    }
            });
            $sp.state('contentDelete', {
                url: '/delete',
                parent: 'contentInstance',
                views: {
                    contentInstanceView: {
                        templateUrl: baseInstancePath + 'delete/content.delete.tpl.html',
                        controller: 'contentDeleteCtrl',
                        controllerAs: 'ctrl'
                    }
                },
                  resolve:{
				      model: 'contentModel'
					}
            });
            $sp.state('contentVideo', {
                url: '/video',
                parent: 'contentDetail',
                abstract: true,
                views: {
                    contentChieldView: {
                        template: '<div ui-view="contentVideoView"></div>'
                    }
                },
                resolve: {
                     
                    video: ['content', function (content) {
                            return content.getList('video');
                        }],
                    model: 'videoModel'
                }
            });
            $sp.state('contentVideoList', {
                url: '/list',
                parent: 'contentVideo',
                views: {
                    contentVideoView: {
                        templateUrl: baseInstancePath + 'video/list/content.video.list.tpl.html',
                        controller: 'contentVideoListCtrl'
                    }
                }
            });
            $sp.state('contentVideoEdit', {
                url: '/edit',
                parent: 'contentVideo',
                views: {
                    contentVideoView: {
                        templateUrl: baseInstancePath + 'video/edit/content.video.edit.tpl.html',
                        controller: 'contentVideoEditCtrl',
                        controllerAs: 'ctrl'
                    }
                },
                resolve: {
                    model: 'videoModel',
                    pool: ['Restangular', 'model', function (r, model) {
                            return r.all(model.url).getList();
                        }]
                }
            });
            $sp.state('contentImage', {
                url: '/image',
                parent: 'contentDetail',
                abstract: true,
                views: {
                    contentChieldView: {
                        template: '<div ui-view="contentImageView"></div>'
                    }
                },
                resolve: {
                     
                    image: ['content', function (content) {
                            return content.getList('image');
                        }],
                    model: 'imageModel'
                }
            });
            $sp.state('contentImageList', {
                url: '/list',
                parent: 'contentImage',
                views: {
                    contentImageView: {
                        templateUrl: baseInstancePath + 'image/list/content.image.list.tpl.html',
                        controller: 'contentImageListCtrl'
                    }
                }
            });
            $sp.state('contentImageEdit', {
                url: '/edit',
                parent: 'contentImage',
                views: {
                    contentImageView: {
                        templateUrl: baseInstancePath + 'image/edit/content.image.edit.tpl.html',
                        controller: 'contentImageEditCtrl',
                        controllerAs: 'ctrl'
                    }
                },
                resolve: {
                    model: 'imageModel',
                    pool: ['Restangular', 'model', function (r, model) {
                            return r.all(model.url).getList();
                        }]
                }
            });
	}]);
})(window.angular);
