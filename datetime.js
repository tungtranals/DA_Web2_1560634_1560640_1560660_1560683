var l = "06/19/2018 02:46:00";
var startDate = Date.parse(l);
var endDate = Date.parse("6/19/2018 2:46:0");
var date = new Date();


var t = date.getDay();
var t3 = date.getDate();
var t1 = date.getMonth();
var t2 = date.getFullYear();
var h = date.getHours();

var m = date.getMinutes();
var s = date.getSeconds();
console.log(date);
var StrDate = t1 + "/" + (t3+1) + "/" + t2 + "  " + h + ":" + m + ":" + s;
console.log(StrDate);
var endDatess = Date.parse(StrDate.toString());
console.log(endDatess+"/"+endDate);

/*console.log(endDatess);
console.log(endDate);
  console.log((startDate - endDate)/1000 ); */
