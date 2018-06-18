var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
var pg = require('pg');
var config = {
    user: 'postgres',
    database: 'quanly',
    password: 'admin',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
};
var pool = new pg.Pool(config);
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/sinhvien/list", function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error("error ", err);
        }
        client.query('SELECT *FROM hocsinh', function (err, result) {
            done();
            if (err) {
                res.end();
                return console.error("error", err);
            }
            res.render("hocsinhlist.ejs", { danhsach: result });
        });
    });

});
app.get("/sinhvien/them", function (req, res) {
    res.render("them.ejs");
});
app.post("/sinhvien/them", urlencodedParser, function (req, res) {

    pool.connect(function (err, client, done) {
        if (err) {
            return console.error("error ", err);
        }
        var hoten = req.body.ten;
        var malop = req.body.malop;
        var mahs = req.body.mahs;
        var email = req.body.email;
        var sql = "INSERT INTO hocsinh(mahs, malop, ten, email) VALUES('" + mahs + "','" + malop + "','" + ten + "','" + email + "')";
        client.query(sql, function (err, result) {
            done();
            if (err) {
                res.end();
                return console.error("error", err);
            }
            res.render("them thanh cong");
        });
    });
});
app.get("/sinhvien/xoa/:id", function (req, res) {
    var id = req.param.id;
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error("error ", err);
        }

        var sql = "DELETE hocsinh WHERE id ='" + id + "'";
        client.query(sql, function (err, result) {
            done();
            if (err) {
                res.end();
                return console.error("error", err);
            }
            res.render("xoa thanh cong");
        });
    });
});

app.get("/sinhvien/sua/:id", function (req, res) {
    var id = req.param.id;
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error("error ", err);
        }
        var hoten = req.body.ten;
        var malop = req.body.malop;
        var mahs = req.body.mahs;
        var email = req.body.email;
        var sql = "UPDATE hocsinh SET hoten ='" + hoten + "',email ='" + email + "',malop='" + malop + "',' ten ='" + ten + "'";
        client.query(sql, function (err, result) {
            done();
            if (err) {
                res.end();
                return console.error("error", err);
            }
            res.render("sua thanh cong");
        });
    });
});



app.listen(3000, function () {
    console.log('server is listening in port 3000')
});