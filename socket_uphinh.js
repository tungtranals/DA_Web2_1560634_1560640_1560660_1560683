var express = require("express");
var app = express();
var fileUpload = require('express-fileupload');
app.use(express.static("public"));
var path = require("path");
app.set("view engine","ejs");
app.set("views","./views");
app.use(fileUpload());

var server = require("http").Server(app);
var io = require("socket.io")(server);


server.listen(3000,function(){
    console.log('server is listening in port 3000')
});

app.get('/html',function(req,res){
    res.sendFile(path.join(__dirname+'/views/senfile.html'));
});

