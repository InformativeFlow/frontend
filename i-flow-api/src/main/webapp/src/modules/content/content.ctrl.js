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
    var mod = ng.module('contentModule');

    mod.controller('contentCtrl', ['$scope', '$http',
        function (scope, http) {
          
            var contentAwsApi = 'https://2cenrmbnma.execute-api.us-west-2.amazonaws.com/prod/contents';
            
            scope.getContents = function () {
                var req = {
                    method: 'GET',
                    url: contentAwsApi + '?TableName=content'
                };
                return http(req).then(function (r) {
                    scope.contentsRecords = r.data;
                    console.log(JSON.stringify(r.data));
                });
            };

            scope.createContent = function (content) {

                var postData = {
                    "TableName": "content", 
                    "Item": {
                        "name": {"S": content.name},
                        "area": {"S": content.area}
                    }
                };
                var req = {
                    method: 'POST',
                    url: contentAwsApi,
                    data: JSON.stringify(postData)
                };
                return http(req).then(function (r) {
                    console.log(JSON.stringify(r.data));
                });
            };
     
            scope.updateContent = function (content) {

                var putData = {
                    "TableName": "content",
                    "Key": {
                        "name": {
                            "S": content.name
                        }
                    },
                    "UpdateExpression": "set area=:a",
                    "ExpressionAttributeValues":{
                        ":a":{
                            "S":content.area
                        }
                    },
                    "ReturnValues":"UPDATED_NEW" 
                };
                var req = {
                    method: 'PUT',
                    url: contentAwsApi,
                    data: JSON.stringify(putData)
                };
                return http(req).then(function (r) {
                    console.log(JSON.stringify(r.data));
                });
            };
            
             scope.deleteContent = function (content) {

                var deleteData = {
                    "TableName": "content", 
                    "Key": {
                        "name": {"S": content.name}
                    }
                };
                var req = {
                    method: 'DELETE',
                    url: contentAwsApi,
                    data: JSON.stringify(deleteData)
                };
                return http(req).then(function (r) {
                    console.log(JSON.stringify(r.data));
                });
            };
        }]);


})(window.angular);
