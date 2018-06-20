var express = require("express");
var session = require('express-session')
var cookieParser = require('cookie-parser');
var app = express();
app.use(express.static("public"));
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var fileUpload = require('express-fileupload');
var path = require("path");
app.use(session({ secret: 'iloveuit' }));
app.use(cookieParser());

app.use(fileUpload());
var server = require("http").Server(app);
var io = require("socket.io")(server);

server.listen(3000, function () { console.log('server is listening in port 3000') });
var pg = require('pg');
var config = {
    user: 'postgres',
    database: 'ql_daugia',
    password: 'admin',
    host: 'localhost',
    port: 5433,
    max: 1,
    idleTimeoutMillis: 30000,
};
var pool = new pg.Pool(config);
//emit liên tục mỗi giấy để lấy giá trị realtime gửi về cho client
setInterval(function () {
    try {
        pool.connect(function (err, client, done) {
            if (err) {
                console.log(err);
            }
            client.query("SELECT *FROM phiendaugia",
                function (err, result) {
                    done();
                    if (err) {
                        console.log(err);
                    } else {
                        io.sockets.emit("senddata", result.rows);
                    }
                });
        });
    } catch (error) {

    }
}, 1);

app.get('/', function (req, res) {
    try {
        res.sendFile(path.join(__dirname + '/views/index.html'));
    } catch (error) {

    }
});

app.post('/login', function (req, res) {
    try {
        var user = req.body.name;
        var pass = req.body.pass;
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error("error ", err);
            }
            client.query("SELECT *FROM taikhoan WHERE tendangnhap ='" + user.toString() + "'AND matkhau='" + pass.toString() + "'",
                function (err, result) {
                    done();
                    if (err) {
                        res.end();
                        return console.error("error", err);
                    } else {
                        if (result.rowCount > 0) {
                            let options = {
                                maxAge: 1000 * 60 * 60 * 24 * 3, // would expire after 3 day
                                httpOnly: true,
                            }
                            res.cookie('user', user.toString(), options);
                            res.cookie('pass', pass.toString(), options);
                            req.session.user = user.toString();
                            req.session.quyen = result.rows[0].maloaitaikhoan;
                            res.send({ rowcount: result.rowCount, quyen: result.rows[0].maloaitaikhoan, tenhienthi: result.rows[0].tenhienthi });
                        }
                    }
                });
        });
    } catch (error) {

    }
});
app.post('/signin', function (req, res) {
    try {
        var user = req.body.user;
        var pass = req.body.pass;
        var quyen1 = 1;
        var quyenadmin = req.body.add;
        if (quyenadmin == "admin123") {
            quyen1 = 2;
        }

        var name = req.body.name;
        var email = req.body.email;
        var sodt = req.body.sodt;
        var diachi = req.body.diachi;



        pool.connect(function (err, client, done) {
            if (err) {
                return console.error("error ", err);
            }
            client.query("SELECT *FROM taikhoan WHERE tendangnhap ='" + user.toString() + "'",
                function (err, result) {
                    done();
                    if (err) {
                        res.end();
                        return console.error("error", err);
                    } else {
                        if (result.rowCount == 0) {
                            var kq = user + "/" + pass + "/" + name + "/" + email + "/" + sodt + "/" + diachi;
                            var sql = "INSERT INTO taikhoan(tendangnhap, matkhau, tenhienthi, email,dienthoai,diachi,maloaitaikhoan) VALUES('" + user
                                + "','" + pass + "','" + name + "','" + email + "','" + sodt + "','" + diachi + "'," + quyen1 + " )";
                            client.query(sql, function (err, result) {
                                done();
                                if (err) {
                                    res.send("0");
                                    res.end();
                                    return console.error("error", err);
                                } else {
                                    let options = {
                                        maxAge: 1000 * 60 * 60 * 24 * 3, // would expire after 3 day
                                        httpOnly: true,
                                    }
                                    res.cookie('user', user.toString(), options);
                                    res.cookie('pass', pass.toString(), options);
                                    req.session.user = user.toString();
                                    req.session.quyen = quyen1;
                                }
                                res.send({ rowcount: 1, quyen: quyen1, tenhienthi: name });
                            });

                        } else
                            res.send("0");
                    }
                });
        });
    } catch (error) {

    }
});


//Admin Sản Phẩm
app.get('/laysanpham', function (req, res) {
    try {
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error("error ", err);
            }
            client.query("SELECT *FROM sanpham INNER JOIN hinhanh ON sanpham.mahinhanh=hinhanh.mahinhanh",
                function (err, result) {
                    done();
                    if (err) {
                        res.end();
                        return console.error("error", err);
                    } else {
                        console.log(result.rows);
                        res.send(result.rows);

                    }
                });
        });
    } catch (error) {

    }
});
app.get("/xoasp/:id", function (req, res) {
    try {
        var id = req.params.id;
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error("error ", err);
            }
            client.query("DELETE FROM sanpham WHERE masp =" + id + "",
                function (err, result) {
                    done();
                    if (err) {
                        res.end();
                        res.send("k thanh cong");
                        return console.error("error", err);
                    } else {
                        console.log(result);
                        res.send("thanh cong");

                    }
                });
        });
    } catch (error) {

    }
});
app.get("/suasp/:id", function (req, res) {
    try {
        var id = req.params.id;
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error("error ", err);
            }
            client.query("SELECT *FROM sanpham WHERE masp =" + id + "",
                function (err, result) {
                    done();
                    if (err) {
                        res.end();
                        return console.error("error", err);
                    } else {
                        console.log(result.rows);
                        res.send(result.rows[0]);

                    }
                });
        });
    } catch (error) {

    }
});
app.post('/cssanpham', function (req, res) {
    try {
        var masp = req.body.masp;
        var maloai = req.body.maloaisp;
        var ten = req.body.tensp;
        var mota = req.body.mota;
        var mahinh = req.body.mahinhanh;
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error("error ", err);
            }
            client.query("UPDATE sanpham SET maloaisp=" + maloai + ", tensp='" + ten + "', mota='" + mota + "', mahinhanh=" + mahinh + " WHERE masp=" + masp + "",
                function (err, result) {
                    done();
                    if (err) {
                        res.end();
                        return console.error("error", err);
                    } else {
                        res.send("Thanh cong");
                    }
                });
        });
    } catch (error) {

    }
});

app.post('/addsanpham', function (req, res) {
    try {
        var maloai = req.body.maloaisp;
        var ten = req.body.tensp;
        var mota = req.body.mota;
        var mahinh = req.body.mahinhanh;
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error("error ", err);
            }
            client.query("INSERT INTO sanpham( maloaisp, tensp, mota, mahinhanh) VALUES (" + maloai + ",'" + ten + "','" + mota + "'," + mahinh + ") ",
                function (err, result) {
                    done();
                    if (err) {
                        res.end();
                        return console.error("error", err);
                    } else {
                        res.send("Thêm Thành Công");
                    }
                });
        });
    } catch (error) {

    }
});
//Admin Phiên Đấu Giá
app.get('/layphiendaugia', function (req, res) {
    try {
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error("error ", err);
            }
            client.query("SELECT *FROM phiendaugia",
                function (err, result) {
                    done();
                    if (err) {
                        res.end();
                        return console.error("error", err);
                    } else {
                        console.log(result.rows);
                        res.send(result.rows);

                    }
                });
        });
    } catch (error) {

    }
});
app.post('/hoanthanhaddPhien', function (req, res) {
    try {
        var pmasp = req.body.pmasp;
        var ptimebd = req.body.ptimebd;
        var mtimedau = req.body.mtimedau;
        var pgiaht = req.body.pgiaht;
        var pgiakd = req.body.pgiakd;
        var ptinhtrang = req.body.ptinhtrang;
        var pmathang = req.body.pmathang;
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error("error ", err);
            }
            client.query("INSERT INTO phiendaugia(masp, thoigianbatdau, thoigiandau, giahientai, giakhoidiem, matinhtrang, maphieuthang)" +
                "VALUES (" + pmasp + ",'" + ptimebd + "','" + mtimedau + "', " + pgiaht + ", " + pgiakd + ", " + ptinhtrang + ", " + pmathang + ");",
                function (err, result) {
                    done();
                    if (err) {
                        res.end();
                        return console.error("error", err);
                    } else {
                        res.send("Thêm Thành Công");
                    }
                });
        });
    } catch (error) {

    }
});
app.get("/xoaphien/:id", function (req, res) {
    try {
        var id = req.params.id;
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error("error ", err);
            }
            client.query("DELETE FROM phiendaugia WHERE maphien =" + id + "",
                function (err, result) {
                    done();
                    if (err) {
                        res.end();
                        res.send("k thanh cong");
                        return console.error("error", err);
                    } else {
                        console.log(result);
                        res.send("thanh cong");

                    }
                });
        });
    } catch (error) {

    }
});
app.get("/chinhsuaphien/:id", function (req, res) {
    try {
        var id = req.params.id;
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error("error ", err);
            }
            client.query("SELECT *FROM phiendaugia WHERE maphien =" + id + "",
                function (err, result) {
                    done();
                    if (err) {
                        res.end();
                        return console.error("error", err);
                    } else {
                        console.log(result.rows);
                        res.send(result.rows[0]);

                    }
                });
        });
    } catch (error) {

    }
});
app.post('/hoanthanhcsphien', function (req, res) {
    try {
        var maphien = req.body.maphien;
        var pmasp = req.body.pmasp;
        var ptimebd = req.body.ptimebd;
        var mtimedau = req.body.mtimedau;
        var pgiaht = req.body.pgiaht;
        var pgiakd = req.body.pgiakd;
        var ptinhtrang = req.body.ptinhtrang;
        var pmathang = req.body.pmathang;
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error("error ", err);
            }

            client.query("UPDATE phiendaugia SET masp=" + pmasp + ", thoigianbatdau='" + ptimebd + "', thoigiandau='" + mtimedau + "',giahientai=" + pgiaht + ", giakhoidiem=" + pgiakd + ", matinhtrang=" + ptinhtrang + ", maphieuthang=" + pmathang + " WHERE maphien = " + maphien + "",
                function (err, result) {
                    done();
                    if (err) {
                        res.end();
                        return console.error("error", err);
                    } else {
                        res.send("Thanh cong");
                    }
                });
        });
    } catch (error) {

    }
});

//Admin Sản Phẩm
app.get('/laytaikhoan', function (req, res) {
    try {
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error("error ", err);
            }
            client.query("SELECT *FROM taikhoan",
                function (err, result) {
                    done();
                    if (err) {
                        res.end();
                        return console.error("error", err);
                    } else {
                        console.log(result.rows);
                        res.send(result.rows);

                    }
                });
        });
    } catch (error) {

    }
});

app.get("/xoatk/:id", function (req, res) {
    try {
        var user = req.params.id;
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error("error ", err);
            }
            client.query("DELETE FROM taikhoan WHERE matk ='" + user + "'",
                function (err, result) {
                    done();
                    if (err) {
                        res.end();
                        console.log("kk");
                        res.send("k thanh cong");
                        return console.error("error", err);
                    } else {
                        console.log("cc");
                        res.send("thanh cong");

                    }
                });
        });
    } catch (error) {

    }
});
app.get("/suatk/:id", function (req, res) {
    try {
        var id = req.params.id;
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error("error ", err);
            }
            client.query("SELECT *FROM taikhoan WHERE matk =" + id + "",
                function (err, result) {
                    done();
                    if (err) {
                        res.end();
                        return console.error("error", err);
                    } else {
                        console.log(result.rows);
                        res.send(result.rows[0]);

                    }
                });
        });
    } catch (error) {

    }
});

app.post('/cstaikhoan', function (req, res) {
    try {
        var matk = req.body.matk;
        var tendn = req.body.tendn;
        var matkhau = req.body.matkhau;
        var tenht = req.body.tenht;
        var email = req.body.email;
        var dienthoai = req.body.dienthoai;
        var diachi = req.body.diachi;
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error("error ", err);
            }
            client.query("UPDATE taikhoan SET dienthoai='" + dienthoai + "', diachi='" + diachi + "', tendangnhap='" + tendn + "', matkhau='" + matkhau + "', tenhienthi='" + tenht + "', email='" + email + "' WHERE matk=" + matk + "",
                function (err, result) {
                    done();
                    if (err) {
                        res.end();
                        return console.error("error", err);
                    } else {
                        res.send("Thanh cong");
                    }
                });
        });
    } catch (error) {

    }
});
//Admin Hình Ảnh
app.get('/layhinhanh', function (req, res) {
    try {
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error("error ", err);
            }
            client.query("SELECT *FROM hinhanh",
                function (err, result) {
                    done();
                    if (err) {
                        res.end();
                        return console.error("error", err);
                    } else {
                        console.log(result.rows);
                        res.send(result.rows);

                    }
                });
        });
    } catch (error) {

    }
});

app.post('/upload', function (req, res) {
    try {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        let sampleFile = req.files.sampleFile;
        let sampleFile2 = req.files.sampleFile2;
        let sampleFile3 = req.files.sampleFile3;
        if (sampleFile) {
            var name = sampleFile.name;
            sampleFile.mv('./public/images/' + name, function (err) {
                if (err)
                    return res.status(500).send(err);
                else {
                    pool.connect(function (err, client, done) {
                        if (err) {
                            res.end();
                            return console.error("error ", err);
                        }
                        client.query("INSERT INTO hinhanh(tenanh) VALUES ('" + name + "')",
                            function (err, result) {
                                done();
                                if (err) {
                                    res.end();
                                    return console.error("error", err);
                                } else { }
                            });
                    });
                }
            });
        }
        if (sampleFile2) {
            var name2 = sampleFile2.name;
            sampleFile2.mv('./public/images/' + name2, function (err) {
                if (err)
                    return res.status(500).send(err);
                else {
                    pool.connect(function (err, client, done) {
                        if (err) {
                            return console.error("error ", err);
                        }
                        client.query("INSERT INTO hinhanh(tenanh) VALUES ('" + name2 + "')",
                            function (err, result) {
                                done();
                                if (err) {
                                    res.end();
                                    return console.error("error", err);
                                } else { }
                            });
                    });
                }
            });
        }
        if (sampleFile3) {
            var name3 = sampleFile3.name;
            sampleFile3.mv('./public/images/' + name3, function (err) {
                if (err)
                    return res.status(500).send(err);
                else {
                    pool.connect(function (err, client, done) {
                        if (err) {
                            res.end();
                            return console.error("error ", err);
                        }
                        client.query("INSERT INTO hinhanh(tenanh) VALUES ('" + name3 + "')",
                            function (err, result) {
                                done();
                                if (err) {
                                    res.end();
                                    return console.error("error", err);
                                } else { }
                            });
                    });
                }
            });
        }
        console.log(req.files);
        res.sendFile(path.join(__dirname + '/views/index.html'));
    } catch (error) {

    }
});

app.get("/xoahinhanh/:id", function (req, res) {
    try {
        var user = req.params.id;
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error("error ", err);
            }
            client.query("DELETE FROM hinhanh WHERE mahinhanh =" + user + "",
                function (err, result) {
                    done();
                    if (err) {
                        res.end();
                        console.log("kk");
                        res.send("k thanh cong");
                        return console.error("error", err);
                    } else {
                        console.log("cc");
                        res.send("thanh cong");

                    }
                });
        });
    } catch (error) {

    }
});

//Bắt Đầu
app.post('/kiemtrasesioncookie', function (req, res) {
    try {
        var lc = "";
        var user = req.cookies['user'];
        var pass = req.cookies['pass'];
        //Kiểm tra cookie
        if (user === undefined || pass === undefined) {
            lc += "user|pass|";
            //test
            /*let options = {
                maxAge: 1000 * 60 * 60 * 24 * 3, // would expire after 3 day
                httpOnly: true, // The cookie only accessible by the web server
            }
            res.cookie('user', 'tung', options);
            res.cookie('pass', '12345', options);*/
        } else {
            lc += user + "|" + pass + "|";
        }
        //Kiểm tra sesion
        var suser = req.session.user;
        var quyen = req.session.quyen;
        if (suser) {
            lc += suser + "|" + quyen;
        } else {
            lc += "0|0";
        }
        res.send(lc);
    } catch (error) {

    }
});

app.post('/sigout', function (req, res) {
    try {
        req.session.destroy(function (err) {
            if (err) {
                res.end();
            } else {
                res.send("dang xuat");
            }
        });
    } catch (error) {

    }
});

//Kho Đồ
app.get('/laykhodo', function (req, res) {
    try {
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error("error ", err);
            }
            var suser = req.session.user;
            client.query("SELECT *FROM phieudaugia INNER JOIN phiendaugia ON phieudaugia.maphieudau = phiendaugia.maphieuthang "
                + " INNER JOIN sanpham ON phiendaugia.masp = sanpham.masp " +
                " INNER JOIN hinhanh ON sanpham.mahinhanh = hinhanh.mahinhanh" +
                " WHERE tendangnhap ='" + suser + "' AND phieudaugia.tinhtrang = 1",
                function (err, result) {
                    done();
                    if (err) {
                        res.end();
                        return console.error("error", err);
                    } else {
                        console.log(result.rows);
                        res.send(result.rows);

                    }
                });
        });
    } catch (error) {

    }
});

app.get("/thanhtoansp/:id", function (req, res) {
    try {
        var id = req.params.id;
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error("error ", err);
            }
            client.query("UPDATE phieudaugia SET tinhtrang = 2 WHERE maphieudau =" + id + "",
                function (err, result) {
                    done();
                    if (err) {
                        res.end();
                        res.send("k thanh cong");
                        console.log("k thanh cong thanh cong");
                        return console.error("error", err);
                    } else {
                        console.log("thanh cong me roi");
                        res.send("thanh cong");

                    }
                });
        });
    } catch (error) {

    }
});
//lấy phiên đấu giá
app.get('/laycacphiendau', function (req, res) {
    try {
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error("error ", err);
            }
            var suser = req.session.user;
            client.query("SELECT *FROM phiendaugia "
                + " INNER JOIN sanpham ON phiendaugia.masp = sanpham.masp " +
                " INNER JOIN hinhanh ON sanpham.mahinhanh = hinhanh.mahinhanh",
                function (err, result) {
                    done();
                    if (err) {
                        res.end();
                        return console.error("error", err);
                    } else {
                        console.log(result.rows);
                        res.send(result.rows);

                    }
                });
        });
    } catch (error) {

    }
});

//lấy phiên đấu giá theo loại
app.get('/laycacphiendautheoloai/:id', function (req, res) {
    try {
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error("error ", err);
            }
            var loai = req.params.id;
            client.query("SELECT *FROM phiendaugia "
                + " INNER JOIN sanpham ON phiendaugia.masp = sanpham.masp " +
                " INNER JOIN hinhanh ON sanpham.mahinhanh = hinhanh.mahinhanh WHERE sanpham.maloaisp = " + loai + "",
                function (err, result) {
                    done();
                    if (err) {
                        res.end();
                        return console.error("error", err);
                    } else {
                        console.log(result.rows);
                        res.send(result.rows);

                    }
                });
        });
    } catch (error) {

    }
});

//lấy phiên đấu giá theo loại
app.get('/laychitietphiendaugia/:id', function (req, res) {
    try {
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error("error ", err);
            }
            var loai = req.params.id;
            client.query("SELECT *FROM phiendaugia "
                + " INNER JOIN sanpham ON phiendaugia.masp = sanpham.masp " +
                " INNER JOIN hinhanh ON sanpham.mahinhanh = hinhanh.mahinhanh WHERE phiendaugia.maphien = " + loai + "",
                function (err, result) {
                    done();
                    if (err) {
                        res.end();
                        return console.error("error", err);
                    } else {
                        console.log(result.rows);
                        res.send(result.rows[0]);

                    }
                });
        });
    } catch (error) {

    }
});


//
app.post('/daugiaclient', function (req, res) {
    try {
        var maphien = req.body.maphien;
        var giadau = req.body.giadau;
        var suser = req.session.user.toString();
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error("error ", err);
            }
            client.query("SELECT *FROM phieudaugia WHERE maphiendau = "
                + maphien + " AND tendangnhap='" + suser + "'",
                function (err, result) {
                    done();
                    if (err) {
                        res.end();
                        return console.error("error", err);
                    } else {
                        if (result.rowCount == 1) {//update
                            client.query("UPDATE phieudaugia SET giadau=" + giadau + ",tinhtrang =1 WHERE maphiendau=" + maphien
                                + " AND tendangnhap='" + suser + "'",
                                function (err, result) {
                                    done();
                                    if (err) {
                                        res.end();
                                        return console.error("error", err);
                                    } else {
                                        console.log("UPDATE phieudaugia SET giadau=" + giadau + " WHERE maphiendau=" + maphien
                                            + " AND tendangnhap='" + suser + "'");
                                    }
                                });
                        } else {//insert
                            client.query("INSERT INTO phieudaugia( maphiendau, tendangnhap, giadau, tinhtrang) VALUES ("
                                + maphien + ", '" + suser + "', " + giadau + ", 1)",
                                function (err, result) {
                                    done();
                                    if (err) {
                                        res.end();
                                        return console.error("error", err);
                                    } else {
                                        console.log("INSERT INTO phieudaugia( maphiendau, tendangnhap, giadau, tinhtrang) VALUES ("
                                            + maphien + ", '" + suser + "', " + giadau + ", 1); " + result);
                                    }
                                });
                        }



                    }
                    var maphieupp = 0;
                    client.query("SELECT maphieudau,maphiendau FROM phieudaugia WHERE maphiendau =" + maphien + " AND tendangnhap= '" + suser + "' ",
                        function (err, result) {
                            done();
                            if (err) {
                                return console.error("error", err);
                            } else {
                                //lcdem =result.rowCount;
                                var arr = result.rows;
                                maphieupp = arr[0].maphieudau;
                                console.log("dem " + result.rowCount);
                                console.log("dem11 " + arr[0].maphieudau);

                                console.log(maphieupp + " ma phieu")
                                var SQL = "UPDATE phiendaugia SET giahientai=" + giadau + ", matinhtrang=2, maphieuthang=" + maphieupp + " WHERE maphien = " + maphien + "";
                                console.log(SQL + "cc");
                                client.query(SQL,
                                    function (err, result) {
                                        done();
                                        if (err) {
                                            return console.error("error", err);
                                        } else {
                                            lcdem = result.rowCount;
                                            arr = result.rows;
                                            console.log(SQL);
                                        }
                                    });
                            }
                        });
                });
        });
    } catch (error) {

    }
});
