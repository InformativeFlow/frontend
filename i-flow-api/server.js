/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname+"/src/main/webapp/",{'index':["index.html"]})).listen(8080, function(){
    console.log('Server running on 8080...');
});
