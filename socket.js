var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.set("views","./views");

var pg = require('pg');
var config = {
    user: 'postgres',
    database: 'QL_DauGia',
    password:'admin',
    host:'localhost',
    port: 5433,
    max:10,
    idleTimeoutMillis:30000,
};

//Sử dụng socket io
io.on("connection", function(socket){
    console.log("ket noi "+socket.io);
    socket.on("disconnect", function(){
        console.log(socket.io +"ngat ket noi ");
    });
    //nhận kết nối
    socket.on("clientsentdata", function(data){
        //send data
        io.sockets.emit("serversentdata",
    "xin chao");
        
    });
});

    server.listen(3000,function(){
        console.log('server is listening in port 3000')
    });