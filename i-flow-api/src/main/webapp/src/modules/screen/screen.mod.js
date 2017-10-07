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
    var mod = ng.module('screenModule', ['ngCrud', 'ui.router']);

    mod.constant('screenModel', {
        name: 'screen',
        displayName:  'Screen',
        url: 'screens',
        fields: {
            name: {
                
                displayName: 'Name',
                type:  'String',
                required: true 
            },
            branch: {
                displayName:  'Branch',
                type: 'Reference',
                model: 'branchModel',
                options: [],
                required:  true 
            }        }
    });

    mod.config(['$stateProvider',
        function($sp){
            var basePath = 'src/modules/screen/';
            var baseInstancePath = basePath + 'instance/';

            $sp.state('screen', {
                url: '/screens?page&limit',
                abstract: true,
                
                views: {
                     mainView: {
                        templateUrl: basePath + 'screen.tpl.html',
                        controller: 'screenCtrl'
                    }
                },
                resolve: {
                    references: ['$q', 'Restangular', function ($q, r) {
                            return $q.all({
                                branch: r.all('branchs').getList()
                            });
                        }],
                    model: 'screenModel',
                    screens: ['Restangular', 'model', '$stateParams', function (r, model, $params) {
                            return r.all(model.url).getList($params);
                        }]
                }
            });
            $sp.state('screenList', {
                url: '/list',
                parent: 'screen',
                views: {
                     screenView: {
                        templateUrl: basePath + 'list/screen.list.tpl.html',
                        controller: 'screenListCtrl',
                        controllerAs: 'ctrl'
                    }
                },
                 resolve:{
				   model: 'screenModel'
					},
                 ncyBreadcrumb: {
                   label: 'screen'
                    }
            });
            $sp.state('screenNew', {
                url: '/new',
                parent: 'screen',
                views: {
                    screenView: {
                        templateUrl: basePath + 'new/screen.new.tpl.html',
                        controller: 'screenNewCtrl',
                        controllerAs: 'ctrl'
                    }
                },
                  resolve:{
						model: 'screenModel'
					},
                  ncyBreadcrumb: {
                        parent :'screenList', 
                        label: 'new'
                   }
            });
            $sp.state('screenInstance', {
                url: '/{screenId:int}',
                abstract: true,
                parent: 'screen',
                views: {
                    screenView: {
                        template: '<div ui-view="screenInstanceView"></div>'
                    }
                },
                resolve: {
                    screen: ['screens', '$stateParams', function (screens, $params) {
                            return screens.get($params.screenId);
                        }]
                }
            });
            $sp.state('screenDetail', {
                url: '/details',
                parent: 'screenInstance',
                views: {
                    screenInstanceView: {
                        templateUrl: baseInstancePath + 'detail/screen.detail.tpl.html',
                        controller: 'screenDetailCtrl'
                    }
                },
                  resolve:{
						model: 'screenModel'
					},
                  ncyBreadcrumb: {
                        parent :'screenList', 
                        label: 'details'
                    }
            });
            $sp.state('screenEdit', {
                url: '/edit',
                sticky: true,
                parent: 'screenInstance',
                views: {
                    screenInstanceView: {
                        templateUrl: baseInstancePath + 'edit/screen.edit.tpl.html',
                        controller: 'screenEditCtrl',
                        controllerAs: 'ctrl'
                    }
                },
                  resolve:{
						model: 'screenModel'
					},
                  ncyBreadcrumb: {
                        parent :'screenDetail', 
                        label: 'edit'
                    }
            });
            $sp.state('screenDelete', {
                url: '/delete',
                parent: 'screenInstance',
                views: {
                    screenInstanceView: {
                        templateUrl: baseInstancePath + 'delete/screen.delete.tpl.html',
                        controller: 'screenDeleteCtrl',
                        controllerAs: 'ctrl'
                    }
                },
                  resolve:{
				      model: 'screenModel'
					}
            });
	}]);
})(window.angular);
