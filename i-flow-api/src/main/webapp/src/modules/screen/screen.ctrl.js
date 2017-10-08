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
    var mod = ng.module('screenModule');

    mod.controller('screenCtrl', ['$scope', '$http',
        function (scope, http) {
          
            var screenAwsApi = 'https://3ayy9cn195.execute-api.us-west-2.amazonaws.com/prod/screens';
            
            scope.getScreens = function () {
                var req = {
                    method: 'GET',
                    url: screenAwsApi + '?TableName=screen'
                };
                return http(req).then(function (r) {
                    scope.screensRecords = r.data;
                    console.log(JSON.stringify(r.data));
                });
            };

            scope.createScreen = function (screen) {

                var postData = {
                    "TableName": "screen", 
                    "Item": {
                        "name": {"S": screen.name},
                        "area": {"S": screen.area}
                    }
                };
                var req = {
                    method: 'POST',
                    url: screenAwsApi,
                    data: JSON.stringify(postData)
                };
                return http(req).then(function (r) {
                    console.log(JSON.stringify(r.data));
                });
            };
     
            scope.updateScreen = function (screen) {

                var putData = {
                    "TableName": "screen",
                    "Key": {
                        "name": {
                            "S": screen.name
                        }
                    },
                    "UpdateExpression": "set area=:a",
                    "ExpressionAttributeValues":{
                        ":a":{
                            "S":screen.area
                        }
                    },
                    "ReturnValues":"UPDATED_NEW" 
                };
                var req = {
                    method: 'PUT',
                    url: screenAwsApi,
                    data: JSON.stringify(putData)
                };
                return http(req).then(function (r) {
                    console.log(JSON.stringify(r.data));
                });
            };
            
             scope.deleteBranch = function (screen) {

                var deleteData = {
                    "TableName": "screen", 
                    "Key": {
                        "name": {"S": screen.name}
                    }
                };
                var req = {
                    method: 'DELETE',
                    url: screenAwsApi,
                    data: JSON.stringify(deleteData)
                };
                return http(req).then(function (r) {
                    console.log(JSON.stringify(r.data));
                });
            };
        }]);


})(window.angular);
