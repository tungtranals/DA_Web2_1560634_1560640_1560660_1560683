var express = require("express");
var session = require('express-session')
var cookieParser = require('cookie-parser');
var app = express();
app.use(express.static("public"));
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
var fileUpload = require('express-fileupload');
var path = require("path");
app.use(session({secret: 'iloveuit'}));
app.use(cookieParser());

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
    var cookie = req.cookies['cookieName'];
    if (cookie === undefined){
        let options = {
            maxAge: 1000*60*60*24*3, // would expire after 3 day
            httpOnly: true, // The cookie only accessible by the web server
        }// Set cookie
        console.log("Chua co cookie");
        res.cookie('cookieName', 'Value1', options)
    }else{
        console.log("da co cookie"+cookie);
        let options = {
            maxAge: 1000*60*60*24*3, // would expire after 3 day
            httpOnly: true, // The cookie only accessible by the web server
        }// Set cookie
        res.cookie('cookieName', 'Value2', options)
    }

    
    if(req.session.email){
        console.log("Co roi");
        req.session.destroy(function(err){
            if(err){

            }
        });
    }else{
        console.log("Chua Co");
        req.session.email = "hihi";
    }
    res.sendFile(path.join(__dirname+'/views/index.html'));
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
                        res.send("1");
                    });

                }else
                    res.send("0");
            }
        });
    });
});


//Admin Sản Phẩm
app.get('/laysanpham',function(req,res){
    
    pool.connect(function(err, client, done){
        if(err){
            return console.error("error ",err);
        }
        client.query("SELECT *FROM sanpham INNER JOIN hinhanh ON sanpham.mahinhanh=hinhanh.mahinhanh",
        function(err,result){
            done();
            if(err){
                return console.error("error",err);
            }else{
                console.log(result.rows);
                res.send(result.rows);

            }
        });
    });
});
app.get("/xoasp/:id", function (req, res) {
    var id = req.params.id;
    pool.connect(function(err, client, done){
        if(err){
            return console.error("error ",err);
        }
        client.query("DELETE FROM sanpham WHERE masp ="+id+"",
        function(err,result){
            done();
            if(err){
                res.send("k thanh cong");
                return console.error("error",err);
            }else{
                console.log(result);
                res.send("thanh cong");

            }
        });
    });
});
app.get("/suasp/:id", function (req, res) {
    var id = req.params.id;
    pool.connect(function(err, client, done){
        if(err){
            return console.error("error ",err);
        }
        client.query("SELECT *FROM sanpham WHERE masp ="+id+"",
        function(err,result){
            done();
            if(err){
                return console.error("error",err);
            }else{
                console.log(result.rows);
                res.send(result.rows[0]);

            }
        });
    });
});
app.post('/cssanpham',function(req,res){
    var masp = req.body.masp;
    var maloai = req.body.maloaisp;
    var ten = req.body.tensp;
    var mota = req.body.mota;
    var mahinh = req.body.mahinhanh;
    pool.connect(function(err, client, done){
        if(err){
            return console.error("error ",err);
        }
        client.query("UPDATE sanpham SET maloaisp="+maloai+", tensp='"+ten+"', mota='"+mota+"', mahinhanh="+mahinh+" WHERE masp="+masp+"",
        function(err,result){
            done();
            if(err){
                return console.error("error",err);
            }else{
                res.send("Thanh cong");
            }
        });
    });
});

app.post('/addsanpham',function(req,res){
    var maloai = req.body.maloaisp;
    var ten = req.body.tensp;
    var mota = req.body.mota;
    var mahinh = req.body.mahinhanh;
    pool.connect(function(err, client, done){
        if(err){
            return console.error("error ",err);
        }
        client.query("INSERT INTO sanpham( maloaisp, tensp, mota, mahinhanh) VALUES ("+maloai+",'"+ten+"','"+mota+"',"+mahinh+") ",
        function(err,result){
            done();
            if(err){
                return console.error("error",err);
            }else{
                res.send("Thêm Thành Công");
            }
        });
    });
});
//Admin Phiên Đấu Giá
app.get('/layphiendaugia',function(req,res){
    
    pool.connect(function(err, client, done){
        if(err){
            return console.error("error ",err);
        }
        client.query("SELECT *FROM phiendaugia",
        function(err,result){
            done();
            if(err){
                return console.error("error",err);
            }else{
                console.log(result.rows);
                res.send(result.rows);

            }
        });
    });
});
app.post('/hoanthanhaddPhien',function(req,res){
    var pmasp = req.body.pmasp;
    var ptimebd = req.body.ptimebd;
    var mtimedau = req.body.mtimedau;
    var pgiaht = req.body.pgiaht;
    var pgiakd = req.body.pgiakd;
    var ptinhtrang = req.body.ptinhtrang;
    var pmathang = req.body.pmathang;
    pool.connect(function(err, client, done){
        if(err){
            return console.error("error ",err);
        }
        client.query("INSERT INTO phiendaugia(masp, thoigianbatdau, thoigiandau, giahientai, giakhoidiem, matinhtrang, maphieuthang)"+
        "VALUES ("+pmasp+",'"+ptimebd+"','"+mtimedau+"', "+pgiaht+", "+pgiakd+", "+ptinhtrang+", "+pmathang+");",
        function(err,result){
            done();
            if(err){
                return console.error("error",err);
            }else{
                res.send("Thêm Thành Công");
            }
        });
    });
});
app.get("/xoaphien/:id", function (req, res) {
    var id = req.params.id;
    pool.connect(function(err, client, done){
        if(err){
            return console.error("error ",err);
        }
        client.query("DELETE FROM phiendaugia WHERE maphien ="+id+"",
        function(err,result){
            done();
            if(err){
                res.send("k thanh cong");
                return console.error("error",err);
            }else{
                console.log(result);
                res.send("thanh cong");

            }
        });
    });
});
app.get("/chinhsuaphien/:id", function (req, res) {
    var id = req.params.id;
    pool.connect(function(err, client, done){
        if(err){
            return console.error("error ",err);
        }
        client.query("SELECT *FROM phiendaugia WHERE maphien ="+id+"",
        function(err,result){
            done();
            if(err){
                return console.error("error",err);
            }else{
                console.log(result.rows);
                res.send(result.rows[0]);

            }
        });
    });
});
app.post('/hoanthanhcsphien',function(req,res){
    var maphien = req.body.maphien;
    var pmasp = req.body.pmasp;
    var ptimebd = req.body.ptimebd;
    var mtimedau = req.body.mtimedau;
    var pgiaht = req.body.pgiaht;
    var pgiakd = req.body.pgiakd;
    var ptinhtrang = req.body.ptinhtrang;
    var pmathang = req.body.pmathang;
    pool.connect(function(err, client, done){
        if(err){
            return console.error("error ",err);
        }
        
        client.query("UPDATE phiendaugia SET masp="+pmasp+", thoigianbatdau='"+ptimebd+"', thoigiandau='"+mtimedau+"',giahientai="+pgiaht+", giakhoidiem="+pgiakd+", matinhtrang="+ptinhtrang+", maphieuthang="+pmathang+" WHERE maphien = "+maphien+"",
        function(err,result){
            done();
            if(err){
                return console.error("error",err);
            }else{
                res.send("Thanh cong");
            }
        });
    });
});

//Admin Sản Phẩm
app.get('/laytaikhoan',function(req,res){
    
    pool.connect(function(err, client, done){
        if(err){
            return console.error("error ",err);
        }
        client.query("SELECT *FROM taikhoan",
        function(err,result){
            done();
            if(err){
                return console.error("error",err);
            }else{
                console.log(result.rows);
                res.send(result.rows);

            }
        });
    });
});

app.get("/xoatk/:id", function (req, res) {
    var user = req.params.id;
    pool.connect(function(err, client, done){
        if(err){
            return console.error("error ",err);
        }
        client.query("DELETE FROM taikhoan WHERE matk ='"+user+"'",
        function(err,result){
            done();
            if(err){
                console.log("kk");
                res.send("k thanh cong");
                return console.error("error",err);
            }else{
                console.log("cc");
                res.send("thanh cong");

            }
        });
    });
});
app.get("/suatk/:id", function (req, res) {
    var id = req.params.id;
    pool.connect(function(err, client, done){
        if(err){
            return console.error("error ",err);
        }
        client.query("SELECT *FROM taikhoan WHERE matk ="+id+"",
        function(err,result){
            done();
            if(err){
                return console.error("error",err);
            }else{
                console.log(result.rows);
                res.send(result.rows[0]);

            }
        });
    });
});

app.post('/cstaikhoan',function(req,res){
    var matk = req.body.matk;
    var tendn = req.body.tendn;
    var matkhau = req.body.matkhau;
    var tenht = req.body.tenht;
    var email = req.body.email;
    var dienthoai = req.body.dienthoai;
    var diachi = req.body.diachi;
    pool.connect(function(err, client, done){
        if(err){
            return console.error("error ",err);
        }
        client.query("UPDATE taikhoan SET dienthoai='"+dienthoai+"', diachi='"+diachi+"', tendangnhap='"+tendn+"', matkhau='"+matkhau+"', tenhienthi='"+tenht+"', email='"+email+"' WHERE matk="+matk+"",
        function(err,result){
            done();
            if(err){
                return console.error("error",err);
            }else{
                res.send("Thanh cong");
            }
        });
    });
});
//Admin Hình Ảnh
app.get('/layhinhanh',function(req,res){
    
    pool.connect(function(err, client, done){
        if(err){
            return console.error("error ",err);
        }
        client.query("SELECT *FROM hinhanh",
        function(err,result){
            done();
            if(err){
                return console.error("error",err);
            }else{
                console.log(result.rows);
                res.send(result.rows);

            }
        });
    });
});

app.post('/upload', function(req, res) {
    if (!req.files)
      return res.status(400).send('No files were uploaded.');
  
    let sampleFile = req.files.sampleFile;
    console.log(req.files);
    var name = sampleFile.name;
    
    sampleFile.mv('./public/images/'+name, function(err) {
      if (err)
        return res.status(500).send(err);
        else{
            pool.connect(function(err, client, done){
                if(err){
                    return console.error("error ",err);
                }
                client.query("INSERT INTO hinhanh(tenanh) VALUES ('"+name+"')",
                function(err,result){
                    done();
                    if(err){
                        return console.error("error",err);
                    }else{
                        res.sendFile(path.join(__dirname+'/views/index.html'));
                    }
                });
            });
            res.send("Thanh Công");
        }
        
    });
  });