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
    var mod = ng.module('branchModule', ['ngCrud', 'ui.router']);

    mod.constant('branchModel', {
        name: 'branch',
        displayName:  'Branch',
        url: 'branchs',
        fields: {
            name: {
                
                displayName: 'Name',
                type:  'String',
                required: true 
            }        }
    });

    mod.config(['$stateProvider',
        function($sp){
            var basePath = 'src/modules/branch/';
            var baseInstancePath = basePath + 'instance/';

            $sp.state('branch', {
                url: '/branchs?page&limit',
                abstract: true,
                
                views: {
                     mainView: {
                        templateUrl: basePath + 'branch.tpl.html',
                        controller: 'branchCtrl'
                    }
                },
                resolve: {
                    model: 'branchModel',
                    branchs: ['Restangular', 'model', '$stateParams', function (r, model, $params) {
                            return r.all(model.url).getList($params);
                        }]
                }
            });
            $sp.state('branchList', {
                url: '/list',
                parent: 'branch',
                views: {
                     branchView: {
                        templateUrl: basePath + 'list/branch.list.tpl.html',
                        controller: 'branchListCtrl',
                        controllerAs: 'ctrl'
                    }
                },
                 resolve:{
				   model: 'branchModel'
					},
                 ncyBreadcrumb: {
                   label: 'branch'
                    }
            });
            $sp.state('branchNew', {
                url: '/new',
                parent: 'branch',
                views: {
                    branchView: {
                        templateUrl: basePath + 'new/branch.new.tpl.html',
                        controller: 'branchNewCtrl',
                        controllerAs: 'ctrl'
                    }
                },
                  resolve:{
						model: 'branchModel'
					},
                  ncyBreadcrumb: {
                        parent :'branchList', 
                        label: 'new'
                   }
            });
            $sp.state('branchInstance', {
                url: '/{branchId:int}',
                abstract: true,
                parent: 'branch',
                views: {
                    branchView: {
                        template: '<div ui-view="branchInstanceView"></div>'
                    }
                },
                resolve: {
                    branch: ['branchs', '$stateParams', function (branchs, $params) {
                            return branchs.get($params.branchId);
                        }]
                }
            });
            $sp.state('branchDetail', {
                url: '/details',
                parent: 'branchInstance',
                views: {
                    branchInstanceView: {
                        templateUrl: baseInstancePath + 'detail/branch.detail.tpl.html',
                        controller: 'branchDetailCtrl'
                    }
                },
                  resolve:{
						model: 'branchModel'
					},
                  ncyBreadcrumb: {
                        parent :'branchList', 
                        label: 'details'
                    }
            });
            $sp.state('branchEdit', {
                url: '/edit',
                sticky: true,
                parent: 'branchInstance',
                views: {
                    branchInstanceView: {
                        templateUrl: baseInstancePath + 'edit/branch.edit.tpl.html',
                        controller: 'branchEditCtrl',
                        controllerAs: 'ctrl'
                    }
                },
                  resolve:{
						model: 'branchModel'
					},
                  ncyBreadcrumb: {
                        parent :'branchDetail', 
                        label: 'edit'
                    }
            });
            $sp.state('branchDelete', {
                url: '/delete',
                parent: 'branchInstance',
                views: {
                    branchInstanceView: {
                        templateUrl: baseInstancePath + 'delete/branch.delete.tpl.html',
                        controller: 'branchDeleteCtrl',
                        controllerAs: 'ctrl'
                    }
                },
                  resolve:{
				      model: 'branchModel'
					}
            });
            $sp.state('branchScreen', {
                url: '/screen',
                parent: 'branchDetail',
                abstract: true,
                views: {
                    branchChieldView: {
                        template: '<div ui-view="branchScreenView"></div>'
                    }
                },
                resolve: {
                     
                    screen: ['branch', function (branch) {
                            return branch.getList('screen');
                        }],
                    model: 'screenModel'
                }
            });
            $sp.state('branchScreenList', {
                url: '/list',
                parent: 'branchScreen',
                views: {
                    branchScreenView: {
                        templateUrl: baseInstancePath + 'screen/list/branch.screen.list.tpl.html',
                        controller: 'branchScreenListCtrl'
                    }
                }
            });
            $sp.state('branchScreenEdit', {
                url: '/edit',
                parent: 'branchScreen',
                views: {
                    branchScreenView: {
                        templateUrl: baseInstancePath + 'screen/edit/branch.screen.edit.tpl.html',
                        controller: 'branchScreenEditCtrl',
                        controllerAs: 'ctrl'
                    }
                },
                resolve: {
                    model: 'screenModel',
                    pool: ['Restangular', 'model', function (r, model) {
                            return r.all(model.url).getList();
                        }]
                }
            });
	}]);
})(window.angular);
