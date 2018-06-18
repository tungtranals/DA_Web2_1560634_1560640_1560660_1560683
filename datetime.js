var l = "4/4/2011 00:00:1";
var startDate = Date.parse(l);
var endDate = Date.parse("4/4/2011 00:00:00");
var dat = new Date();


var t = dat.getDay();
var t3 = dat.getDate();
var t1 = dat.getMonth();
var t2 = dat.getFullYear();
var h = dat.getHours();
var m = dat.getMinutes();
var s = dat.getSeconds();
console.log(dat);
console.log(t + " " + t3 + "/" + t1 + "/" + t2 + "  " + h + ":" + m + ":" + s);
if (startDate > endDate) {
  console.log("Ngày bắt đầu lớn hơn");
} else {
  console.log("Ngày kết thúc lớn hơn");
}