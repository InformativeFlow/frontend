/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function (ng) {
    var mod = ng.module('videoModule');
    
    mod.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
  
    mod.controller('videoCtrl', ['$scope', '$http',
        function (scope, http) {
     
  scope.creds= {};
  scope.uploadProgress = 0;
  
  scope.creds.bucket = "iflowvidin";
  
  AWS.config.update({ accessKeyId: scope.creds.access_key, secretAccessKey: scope.creds.secret_key });
    AWS.config.region = 'us-west-2';
    var bucket = new AWS.S3({ params: { Bucket: scope.creds.bucket } });
  
  scope.uploadFile = function(){
    var file = scope.myFile;
        console.log('file is '+ file.type );
        console.dir(file);
    
     
    var params = { 
        Key: file.name, 
        ContentType:file.type, 
        Body: file, 
        ServerSideEncryption: 'AES256' 
    };
      
    bucket.putObject(params,function(error,data){
        
        if(error) {
            console.log(error.message);
            return false;
          }
          else {
            // Upload Successfully Finished
            console.log('File Uploaded Successfully');
            window.location.reload();
        }
    }).on('httpUploadProgress',function(progress) {
          scope.uploadProgress = Math.round(progress.loaded / progress.total * 100);
          scope.$digest();
        });  
        
    };
  
  var paramslist = { 
 Bucket: 'iflowvidin',
 Delimiter: '/'
};


bucket.listObjects(paramslist,
function (err, data) {
 if(err)throw err;
 scope.records = data.Contents; 
});
  
scope.listBucketObjects = function(){
  return scope.records;  
};
scope.deleteBucketObj = function(name){
bucket.deleteObject({Bucket: 'iflowvidin',Key:name}, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log("file successfully deleted");           // successful response
});};
    }  
    ]);

})(window.angular);







 