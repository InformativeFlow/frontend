(function (ng) {
    var mod = ng.module('ngCrud');
    /**
     * @ngdoc directive
     * @name ngCrud.directive:searchBar
     * @priority 0
     * @restrict E
     * @scope
     * 
     * @param {expression} name name to show in toolbar
     * @param {object} fields definition of the search fields
     * @param {expression} record object to which the result is mapped
     * @param {function} submitFn function to execute when submitting
     * 
     * @description Creates a search form
     */
    mod.directive('searchBar', ['CrudTemplatesDir', function (tplDir) {
        return {
            scope: {
                name: '=',
                fields: '=*',
                record: '=',
                submitFn: '&'
            },
            restrict: 'E',
            templateUrl: tplDir + 'search.tpl.html'
        };
    }]);
mod.directive('ifPermission', ['CrudTemplatesDir', '$cookies', function (tplDir, $cookies) {
     return {
       scope: {
         name: '='
       },
       restrict: 'A',
       link: function (scope, element, attrs) {
           var permissions = $cookies.get("permissions");
           if(permissions === undefined){
             var actions = scope.actions;
             scope.actions = {};
             for(var action in actions){
                 if("list" !== action){
                     delete actions[action];
                 }
             }
             scope.actions = actions;
           }else{
             permissions = permissions.replace(/[["']+/g, "").replace(/]+/g, "").split(","); 
             var havePermission = false;//Util variable
             for(var key in permissions){//iterates all the input roles
               if (permissions[key].includes(attrs.name)) {//if has the rol change the variable to true
                 havePermission = true;
               }
             }
             if(!havePermission){//if don't have any of the roles hides the element
               angular.element(element).css({display: 'none'});
             }
           }
         }
     };
   }]);
    /**
     * @ngdoc directive
     * @name ngCrud.directive:listRecords
     * @priority 0
     * @restrict E
     * @scope
     * 
     * @param {array} records Array with records to display
     * @param {object} fields definition of the fields
     * @param {object} actions Actions available per record
     * @param {boolean=} checklist Whether or not to show checkboxes
     * 
     * @description 
     * 
     * Creates a table showing the registered fields for every record in <strong>records</strong>
     * 
     */
    mod.directive('listRecords', ['CrudTemplatesDir', function (tplDir) {
      return {
        scope: {
          records: '=*',
          fields: '=*',
          actions: '=*?',
          name: '=',
          checklist: '=?',
          buttons:'=*?'
        },
        restrict: 'E',
        templateUrl: tplDir + 'list.tpl.html',
        controller: ['$scope', '$cookies', function ($scope, $cookies) {
                
            var permissions = $cookies.get("permissions");
            if(permissions === undefined){
                 var actions = $scope.actions;
                 $scope.actions = {};
                 for(var action in actions){
                     if($scope.buttons.indexOf(action) === -1){
                         delete actions[action];
                     }
                 }
                 $scope.actions = actions;
            }else{
            permissions = permissions.replace(/[["']+/g, "").replace(/]+/g, "").split(",");
            var actions = $scope.actions;
            var allowedButtons = [];
            var name = $scope.name.toLowerCase();
            for (var key in permissions) {
              if (permissions[key].includes(name)) {
                if ("read" === permissions[key].split(":")[0])
                  allowedButtons.push("list", "detail", "refresh");
                if ("update" === permissions[key].split(":")[0])
                  allowedButtons.push("edit", "save", "cancel");
                if ("create" === permissions[key].split(":")[0])
                  allowedButtons.push("create");
                if ("delete" === permissions[key].split(":")[0])
                  allowedButtons.push("delete");
              }
            }
            for (var action in actions) {
              if (allowedButtons.indexOf(action) === -1)
                delete actions[action];
            }
            $scope.actions = actions;
            $scope.checkAll = function () {
              this.records.forEach(function (item) {
                item.selected = !item.selected;
              });
            };}
          }]
      };
    }]);
    /**
     * @ngdoc directive
     * @name ngCrud.directive:datatable
     * @priority 0
     * @restrict E
     * @scope
     * 
     * @param {array} records Array with records to display
     * @param {object} fields definition of the fields
     * @param {object} actions Actions available per record
     * 
     * @description 
     * 
     * Creates a table showing the registered fields for every record in <strong>records</strong>
     * 
     */
    mod.directive('datatable', ['CrudTemplatesDir', function (tplDir) {
      return {
        scope: {
          records: '=*',
          fields: '=*',
          name: '=',
          actions: '=*?'
        },
        restrict: 'E',
        templateUrl: tplDir + 'dataTable.tpl.html',
        controller: ['$scope', '$cookies', function ($scope, $cookies) {

            // Grid header definitions
            var columnDefsValues = [];
            angular.forEach($scope.fields, function (value, key)
            {
              if (value.listDisplay === undefined || value.listDisplay)
              {
                var recordValue = key;
                if (value.model !== undefined)
                {
                  recordValue = (value.model + '.name').replace("Model", "");
                }
                this.push({name: value.displayName, field: recordValue, enableFiltering: (value.enableFiltering === undefined || value.enableFiltering), minWidth: (value.displayName.length * 40)});
              }
            }, columnDefsValues);

            // Grid row actions definitions
            var columnActionsValues = [];
            var permissions = $cookies.get("permissions");
             if(permissions === undefined){
                 var actions = $scope.actions;
                 $scope.actions = {};
                 for(var action in actions){
                     if("list" !== action ){
                         delete actions[action];
                     }
                 }
                 $scope.actions = actions;
            }else{
            permissions = permissions.replace(/[["']+/g, "").replace(/]+/g, "").split(",");
            var actions = $scope.actions;
            var allowedButtons = [];
            var name = $scope.name.toLowerCase();


            for (var key in permissions) {
              if (permissions[key].includes(name)) {
                if ("read" === permissions[key].split(":")[0])
                  allowedButtons.push("list", "detail", "refresh");
                if ("update" === permissions[key].split(":")[0])
                  allowedButtons.push("edit", "save", "cancel");
                if ("create" === permissions[key].split(":")[0])
                  allowedButtons.push("create");
                if ("delete" === permissions[key].split(":")[0])
                  allowedButtons.push("delete");
              }
            }
            for (var action in actions) {
              if (allowedButtons.indexOf(action) === -1)
                delete actions[action];
            }

            $scope.actions = actions;
            var ln = 0;
            angular.forEach($scope.actions, function (value, key)
            {
              this.push('<button id="'+ln+'-'+key+'-btn" class="btn btn-default btn-sm" type="button" ng-hide="grid.appScope.actions.' + key + '.show && !grid.appScope.actions.' + key + '.show(row.entity)" ng-click="grid.appScope.actions.' + key + '.fn(row.entity)"><span class="glyphicon glyphicon-' + value.icon + '"></span> <md-tooltip>' + value.displayName + '</md-tooltip></button>');
            }, columnActionsValues);

            columnDefsValues.push({name: 'Acciones', cellTemplate: '<div>' + columnActionsValues.join(" ") + '</div>', enableFiltering: false, enableSorting: false, pinnedRight: true, width: 250});


            $scope.gridOptions =
                    {
                      useExternalPagination: true,
                      useExternalSorting: false,
                      enablePinning: true,
                      enableColumnResizing: true,
                      exporterMenuCsv: true,
                      enableGridMenu: true,
                      enableFiltering: true,
                      enableSorting: true,
                      columnDefs: columnDefsValues,
                      data: $scope.records,
                      totalItems: $scope.records.totalRecords
                    };
                    }

          }]
      };


    }]);

    /**
     * @ngdoc directive
     * @name ngCrud.directive:gallery
     * @priority 0
     * @restrict E
     * @scope
     */
    mod.directive('gallery', ['CrudTemplatesDir', function (tplDir) {
        return {
            scope: {
                records: '=*',
                fields: '=*',
                actions: '=*?',
                checklist: '=?',
                name: '=',
                buttons: '=*?'
            },
            restrict: 'E',
            templateUrl: tplDir + 'gallery.tpl.html',
        controller: ['$scope', '$cookies', function ($scope, $cookies) {
            var permissions = $cookies.get("permissions");
             if(permissions === undefined){
                 var actions = $scope.actions;
                 $scope.actions = {};
                 for(var action in actions){
                     if($scope.buttons.indexOf(action) === -1){
                         delete actions[action];
                     }
                 }
                 $scope.actions = actions;
            }else{
            permissions = permissions.replace(/[["']+/g, "").replace(/]+/g, "").split(",");
            var actions = $scope.actions;
            var allowedButtons = [];
            var name = $scope.name.toLowerCase();

            for (var key in permissions) {

              if (permissions[key].includes(name)) {
                if ("read" === permissions[key].split(":")[0])
                  allowedButtons.push("list", "detail", "refresh" );
                if ("update" === permissions[key].split(":")[0])
                  allowedButtons.push("edit", "save", "cancel");
                if ("create" === permissions[key].split(":")[0])
                  allowedButtons.push("create");
                if ("delete" === permissions[key].split(":")[0])
                  allowedButtons.push("delete");
              }
            }
            for (var action in actions) {
              if (allowedButtons.indexOf(action) === -1)
                delete actions[action];
            }

            $scope.actions = actions;

            $scope.checkAll = function () {
              this.records.forEach(function (item) {
                item.selected = !item.selected;
              });
            };}
          }]
      };
            
         
    }]);

    /**
     * @ngdoc directive
     * @name ngCrud.directive:toolbar
     * @priority 0
     * @restrict E
     * @scope
     */
   mod.directive('toolbar', ['CrudTemplatesDir', 'authService', function (tplDir, auth) {
      return {
        scope: {
          actions: '=*',
          name: '=',
          displayName: '='
        },
        restrict: 'E',
        templateUrl: tplDir + 'toolbar.tpl.html',
        controller: ['$scope', '$cookies', function ($scope, $cookies) {
            var permissions = $cookies.get("permissions");
             if(permissions === undefined){
                 var actions = $scope.actions;
                 $scope.actions = {};
                 for(var action in actions){
                     if("list" !== action && "refresh" !== action && "branchs" !== action && "screens" !== action && "content" !== action && "videos" !== action && "images" !== action  ){
                         delete actions[action];
                     }
                 }
                 $scope.actions = actions;
            }else{
            permissions = permissions.replace(/[["']+/g, "").replace(/]+/g, "").split(",");
            var actions = $scope.actions;
            $scope.actions = {};
            var allowedButtons = [];
            var name = $scope.name.toLowerCase();

            for (var key in permissions) {

              if (permissions[key].includes(name)) {
                if ("read" === permissions[key].split(":")[0])
                  allowedButtons.push("list",  "branchs","screens","content","videos","images", "refresh");
                if ("update" === permissions[key].split(":")[0])
                  allowedButtons.push("edit", "save", "cancel");
                if ("create" === permissions[key].split(":")[0])
                  allowedButtons.push("create");
                if ("delete" === permissions[key].split(":")[0])
                  allowedButtons.push("delete");
              }
            }
            for (var action in actions) {
              if (allowedButtons.indexOf(action) === -1)
                delete actions[action];
            }
            $scope.actions = actions;
            }
          }]
      };
    }]);

    /**
     * @ngdoc directive
     * @name ngCrud.directive:datePicker
     * @scope
     * @priority 0
     * @restrict E
     * @param {object} model {@link ngCrud.model} of the field
     * @description
     * 
     * Creates a text input field with a calendar pop-up
     * 
     * @example
     * 
     * <pre>
     * <date-picker value="person.birthdate" model="birthdateModel"></date-picker>
     * </pre>
     */
    mod.directive('datePicker', ['CrudTemplatesDir', function (tplDir) {
        return {
            scope: {
                model: '=',
                value: '='
            },
            restrict: 'E',
            templateUrl: tplDir + 'datepicker.tpl.html',
            controller: ['$scope', function ($scope) {
                $scope.today = function () {
                    $scope.value = new Date();
                };

                $scope.clear = function () {
                    $scope.value = null;
                };

                $scope.open = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.opened = true;
                };
            }]
        };
    }]);

    /**
     * @ngdoc directive
     * @name ngCrud.directive:moveLists
     * @scope
     * @priority 0
     * @restrict E
     * 
     * @param {array} selected list of selected items
     * @param {array} available list of available items
     * 
     * @description
     * 
     * Creates a view to swap items between two lists
     * 
     * @example
     * <pre>
     *     <move-lists selected="selectedItems" available="availableItems"></move-lists>
     * </pre>
     */
    mod.directive('moveLists', ['CrudTemplatesDir', function (tplDir) {
        return {
            scope: {
                selected: '=*',
                available: '=*'
            },
            restrict: 'E',
            templateUrl: tplDir + 'move-lists.tpl.html',
            controllerAs: '$ctrl',
            controller: ['$scope', function ($scope) {
                function move(src, dst, marked) {
                    // If selected is undefined, all records from src are moved to dst
                    if (!!marked) {
                        for (var i = 0; i < marked.length; i++) {
                            if (marked.hasOwnProperty(i)) {
                                var index = null;
                                for (var j = 0; j < src.length; j++) {
                                    if (src.hasOwnProperty(j)) {
                                        if (src[j].id === marked[i].id) {
                                            index = j;
                                            break;
                                        }
                                    }
                                }
                                if (index !== null) {
                                    dst.push(src.splice(index, 1)[0]);
                                }
                            }
                        }
                    } else {
                        dst.push.apply(dst, src);
                        src.splice(0, src.length);
                    }
                }

                move($scope.available, [], $scope.selected);
                $scope.selectedMarked = [];
                $scope.availableMarked = [];

                this.addSome = function () {
                    move($scope.available, $scope.selected, $scope.availableMarked);
                    $scope.availableMarked = [];
                };
                this.addAll = function () {
                    move($scope.available, $scope.selected);
                    $scope.availableMarked = [];
                };
                this.removeSome = function () {
                    move($scope.selected, $scope.available, $scope.selectedMarked);
                    $scope.selectedMarked = [];
                };
                this.removeAll = function () {
                    move($scope.selected, $scope.available);
                    $scope.selectedMarked = [];
                };
            }]
        };
    }]);
})(window.angular);
