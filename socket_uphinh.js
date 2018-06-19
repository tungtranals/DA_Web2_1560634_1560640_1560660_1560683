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

io.on("connection", function(socket){
    console.log("ket noi "+socket.io);
    socket.on("disconnect", function(){
        console.log(socket.io +"ngat ket noi ");
    });
    socket.on("clientsentdata", function(data){
        console.log(data);
        io.sockets.emit("senddata",data+" hihi");
    });
    var time = 1;
    setInterval(function() {
        io.sockets.emit("senddata",time+" hihi");
        time++;
    }, 1000);
});


app.get("/tr",function(req,res){
    res.render("main1.ejs");
}); 

app.post('/upload', function(req, res) {
    if (!req.files)
      return res.status(400).send('No files were uploaded.');
  
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
    console.log(req.files);
    var name = sampleFile.name;
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('./public/'+name, function(err) {
      if (err)
        return res.status(500).send(err);
  
        res.send("hihi");
    });
});
/*app.get("/trtr",function(req,res){
    res.render("uphinh.ejs");
}); 

app.get('/html',function(req,res){
    res.sendFile(path.join(__dirname+'/views/uphinh.html'));
    //__dirname : It will resolve to your project folder.
});

app.post('/uploadsss', function(req, res) {
    var file = req.body.file;

    var name = file.name;
    // Use the mv() method to place the file somewhere on your server
    file.mv('./public/'+name, function(err) {
      if (err)
        return res.status(500).send(err);
  
        res.send("hihi");
    });
});*/