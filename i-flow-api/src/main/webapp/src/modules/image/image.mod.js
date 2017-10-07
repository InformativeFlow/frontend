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
    var mod = ng.module('imageModule', ['ngCrud', 'ui.router']);

    mod.constant('imageModel', {
        name: 'image',
        displayName:  'Image',
        url: 'images',
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
            var basePath = 'src/modules/image/';
            var baseInstancePath = basePath + 'instance/';

            $sp.state('image', {
                url: '/images?page&limit',
                abstract: true,
                
                views: {
                     mainView: {
                        templateUrl: basePath + 'image.tpl.html',
                        controller: 'imageCtrl'
                    }
                },
                resolve: {
                    references: ['$q', 'Restangular', function ($q, r) {
                            return $q.all({
                                content: r.all('content').getList()
                            });
                        }],
                    model: 'imageModel',
                    images: ['Restangular', 'model', '$stateParams', function (r, model, $params) {
                            return r.all(model.url).getList($params);
                        }]
                }
            });
            $sp.state('imageList', {
                url: '/list',
                parent: 'image',
                views: {
                     imageView: {
                        templateUrl: basePath + 'list/image.list.tpl.html',
                        controller: 'imageListCtrl',
                        controllerAs: 'ctrl'
                    }
                },
                 resolve:{
				   model: 'imageModel'
					},
                 ncyBreadcrumb: {
                   label: 'image'
                    }
            });
            $sp.state('imageNew', {
                url: '/new',
                parent: 'image',
                views: {
                    imageView: {
                        templateUrl: basePath + 'new/image.new.tpl.html',
                        controller: 'imageNewCtrl',
                        controllerAs: 'ctrl'
                    }
                },
                  resolve:{
						model: 'imageModel'
					},
                  ncyBreadcrumb: {
                        parent :'imageList', 
                        label: 'new'
                   }
            });
            $sp.state('imageInstance', {
                url: '/{imageId:int}',
                abstract: true,
                parent: 'image',
                views: {
                    imageView: {
                        template: '<div ui-view="imageInstanceView"></div>'
                    }
                },
                resolve: {
                    image: ['images', '$stateParams', function (images, $params) {
                            return images.get($params.imageId);
                        }]
                }
            });
            $sp.state('imageDetail', {
                url: '/details',
                parent: 'imageInstance',
                views: {
                    imageInstanceView: {
                        templateUrl: baseInstancePath + 'detail/image.detail.tpl.html',
                        controller: 'imageDetailCtrl'
                    }
                },
                  resolve:{
						model: 'imageModel'
					},
                  ncyBreadcrumb: {
                        parent :'imageList', 
                        label: 'details'
                    }
            });
            $sp.state('imageEdit', {
                url: '/edit',
                sticky: true,
                parent: 'imageInstance',
                views: {
                    imageInstanceView: {
                        templateUrl: baseInstancePath + 'edit/image.edit.tpl.html',
                        controller: 'imageEditCtrl',
                        controllerAs: 'ctrl'
                    }
                },
                  resolve:{
						model: 'imageModel'
					},
                  ncyBreadcrumb: {
                        parent :'imageDetail', 
                        label: 'edit'
                    }
            });
            $sp.state('imageDelete', {
                url: '/delete',
                parent: 'imageInstance',
                views: {
                    imageInstanceView: {
                        templateUrl: baseInstancePath + 'delete/image.delete.tpl.html',
                        controller: 'imageDeleteCtrl',
                        controllerAs: 'ctrl'
                    }
                },
                  resolve:{
				      model: 'imageModel'
					}
            });
	}]);
})(window.angular);
