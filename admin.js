var express = require("express");
var app = express();
app.use(express.static("public"));
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
var fileUpload = require('express-fileupload');
var path = require("path");
app.use(fileUpload());
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000,function(){console.log('server is listening in port 3000')});
var pg = require('pg');
var config = {
    user: 'postgres',
    database: 'ql_daugia',
    password:'admin',
    host:'localhost',
    port: 5433,
    max:10,
    idleTimeoutMillis:30000,
};
var pool = new pg.Pool(config);


io.on("connection", function(socket){
    socket.on("disconnect", function(){
    });
    socket.on("clientsentdata", function(data){
        io.sockets.emit("serversentdata","khong the truy van"); 
    });
});
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/views/admin.html'));
});

