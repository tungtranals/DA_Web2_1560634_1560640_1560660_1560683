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

app.post('/login',function(req,res){
    var user = req.body.name;
    var pass = req.body.pass;
    pool.connect(function(err, client, done){
        if(err){
            return console.error("error ",err);
        }
        client.query("SELECT *FROM taikhoan WHERE tendangnhap ='"+user.toString()+"'AND matkhau='"+pass.toString()+"'",
        function(err,result){
            done();
            if(err){
                return console.error("error",err);
            }else{
                res.send(result.rowCount.toString());
            }
        });
    });
});
app.post('/signin',function(req,res){
    var user = req.body.user;
    var pass = req.body.pass;
    var name = req.body.name;
    var email = req.body.email;
    var sodt = req.body.sodt;
    var diachi = req.body.diachi;
    pool.connect(function(err, client, done){
        if(err){
            return console.error("error ",err);
        }
        client.query("SELECT *FROM taikhoan WHERE tendangnhap ='"+user.toString()+"'",
        function(err,result){
            done();
            if(err){
                return console.error("error",err);
            }else{
                if(result.rowCount == 0){
                    res.send("1");
                    var kq =user+"/"+pass+"/"+name+"/"+email+"/"+sodt+"/"+diachi;
                    var sql = "INSERT INTO taikhoan(tendangnhap, matkhau, tenhienthi, email,dienthoai,diachi,maloaitaikhoan) VALUES('"+user
                    +"','"+pass+"','"+name+"','"+email+"','"+sodt+"','"+diachi+"','1' )";
                    client.query(sql,function(err,result){
                        done();
                        if(err){
                            res.send("0");
                            res.end();
                            return console.error("error",err);
                        }
                        res.render("1");
                    });

                }else
                    res.send("0");
            }
        });
    });
});