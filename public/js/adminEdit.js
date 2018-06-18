
//Admin Tài Khoản
function laytaikhoan() {
    $('#ten').html("DS Tài khoản");
    $('#sanphanadmin').html("");
    $.ajax({
        type: 'GET',
        url: '/laytaikhoan',
        dataType: 'json',
        success: function (response) {
            response.forEach(function (item) {
                $('#sanphanadmin').append("</br>Tên DN: " + item.matk + "");
                $('#sanphanadmin').append("</br>Tên DN: " + item.tendangnhap + "");
                $('#sanphanadmin').append("</br>Tên Hiển Thị: " + item.tenhienthi + "");
                $('#sanphanadmin').append("</br>Email: " + item.email + "");
                $('#sanphanadmin').append("</br>Điện Thoại: " + item.dienthoai + "");
                $('#sanphanadmin').append("</br>Địa Chỉ: " + item.diachi + "");
                
                $('#sanphanadmin').append('</br><a href="#" onclick="xoatk(' + item.matk + ')" class="btn btn-primary btn-sm">Xóa</a>');
                $('#sanphanadmin').append('<a href="#" onclick="suatk(' + item.matk + ')" class="btn btn-primary btn-sm">Sửa</a></br>');
            });
        }
    });
}
function xoatk(i) {
    $.ajax({
        type: 'GET',
        url: '/xoatk/' + i,
        dataType: 'text',
        success: function (response) {
            alert(response);
            laytaikhoan();
        }
    });
}

function suatk(ma) {
    $('#sanphanadmin').html("");
    $('#ten').html("Chỉnh Sửa");
    $.ajax({
        type: 'GET',
        url: '/suatk/' + ma,
        dataType: 'json',
        success: function (response) {
            $('#sanphanadmin').append('Tên Đăng Nhập: </br><input value= ' + response.tendangnhap + ' type="text" class="form-control" id="tendnn">');
            $('#sanphanadmin').append('Mật Khẩu: </br><input value= ' + response.matkhau + ' type="password" class="form-control" id="matkhaun">');
            $('#sanphanadmin').append('Tên Hiển Thị: </br><input value= ' + response.tenhienthi + ' type="text" class="form-control" id="tenhtn">');
            $('#sanphanadmin').append('Email: </br><input value= ' + response.email + ' type="text" class="form-control" id="emailn">');
            $('#sanphanadmin').append('Điện Thoại: </br><input value= ' + response.dienthoai + ' type="text" class="form-control" id="dtn">');
            $('#sanphanadmin').append('Địa Chỉ</br><input value= ' + response.diachi + ' type="text" class="form-control" id="diachin">');
            $('#sanphanadmin').append('</br><a onclick="hoanthanhcstk(' + response.matk + ')" href="#" class="btn btn-primary btn-sm">Hoàn Thành</a></br>');
        }
    });
}
function hoanthanhcstk(matks) {
    var tendn = $("#tendnn");
    var matkhau = $("#matkhaun");
    var tenht = $("#tenhtn");
    var email = $("#emailn");
    var dienthoai = $("#dtn");
    var diachi = $("#diachin");
    $.ajax({
        url: '/cstaikhoan',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ matk: matks, tendn: tendn.val(),
            matkhau: matkhau.val(), tenht: tenht.val(),
            email: email.val(), dienthoai: dienthoai.val(), diachi: diachi.val()}),
        success: function (response) {
            laytaikhoan();
            alert(response);
        }
    });

}
//Admin Tài Khoản

//Admin Sản Phẩm
function laysanpham() {
    $('#ten').html("Danh Sách SP");
    $('#sanphanadmin').html("");
    $('#sanphanadmin').append('<a href="#" onclick="addSP()" class="btn btn-primary btn-sm">Thêm SP</a></br></br>');
    $.ajax({
        type: 'GET',
        url: '/laysanpham',
        dataType: 'json',
        success: function (response) {
            response.forEach(function (item) {
                $('#sanphanadmin').append("</br>Mã SP: " + item.masp + "");
                $('#sanphanadmin').append("</br>Tên SP: " + item.tensp + "");
                $('#sanphanadmin').append("</br>Mã Loại SP: " + item.maloaisp + "");
                $('#sanphanadmin').append("</br>Mô Tả: " + item.mota + "");
                $('#sanphanadmin').append("</br>Mã Hình Ảnh:" + item.mahinhanh + "");
                $('#sanphanadmin').append("</br><img src='/images/"+item.tenanh+"' height='70' width='70'></br>");
                $('#sanphanadmin').append('</br><a href="#" onclick="xoasp(' + item.masp + ')" class="btn btn-primary btn-sm">Xóa</a>');
                $('#sanphanadmin').append('<a href="#" onclick="chinhsuasp(' + item.masp + ')" class="btn btn-primary btn-sm">Sửa</a></br>');
            });
        }
    });
}
function xoasp(i) {
    $.ajax({
        type: 'GET',
        url: '/xoasp/' + i,
        dataType: 'text',
        success: function (response) {
            alert(response);
            laysanpham();
        }
    });
}
function chinhsuasp(ma) {
    $('#sanphanadmin').html("");
    $('#ten').html("Chỉnh Sửa");
    $.ajax({
        type: 'GET',
        url: '/suasp/' + ma,
        dataType: 'json',
        success: function (response) {
            $('#sanphanadmin').append('Mã Loại</br><input value= ' + response.maloaisp + ' type="text" class="form-control" id="maloaispp">');
            $('#sanphanadmin').append('Tên SP</br><input value= ' + response.tensp + ' type="text" class="form-control" id="tenspp">');
            $('#sanphanadmin').append('Mô Tả</br><input value= ' + response.mota + ' type="text" class="form-control" id="motap">');
            $('#sanphanadmin').append('Mã HA</br><input value= ' + response.mahinhanh + ' type="text" class="form-control" id="mahinhanhp">');
            $('#sanphanadmin').append('</br><a onclick="hoanthanhcs(' + response.masp + ')" href="#" class="btn btn-primary btn-sm">Hoàn Thành</a></br>');
        }
    });
}
function hoanthanhcs(maspp) {
    var maloaispp = $("#maloaispp");
    var tenspp = $("#tenspp");
    var motap = $("#motap");
    var mahinhanhp = $("#mahinhanhp");
    $.ajax({
        url: '/cssanpham',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ masp: maspp, maloaisp: maloaispp.val(), tensp: tenspp.val(), mota: motap.val(), mahinhanh: mahinhanhp.val() }),
        success: function (response) {
            laysanpham();
            alert(response);
        }
    });

}
function addSP() {
    $('#sanphanadmin').html("");
    $('#ten').html("Thêm SP");
    $('#sanphanadmin').append('Mã Loại</br><input type="text" class="form-control" id="maloaispp">');
    $('#sanphanadmin').append('Tên SP</br><input type="text" class="form-control" id="tenspp">');
    $('#sanphanadmin').append('Mô Tả</br><input type="text" class="form-control" id="motap">');
    $('#sanphanadmin').append('Mã Hình Ảnh</br><input type="text" class="form-control" id="mahinhanhp">');
    $('#sanphanadmin').append('</br><a onclick="hoanthanhaddsp()" href="#" class="btn btn-primary btn-sm">Tạo SP</a></br>');
}
function hoanthanhaddsp() {
    var maloaispp = $("#maloaispp");
    var tenspp = $("#tenspp");
    var motap = $("#motap");
    var mahinhanhp = $("#mahinhanhp");
    $.ajax({
        url: '/addsanpham',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ maloaisp: maloaispp.val(), tensp: tenspp.val(), mota: motap.val(), mahinhanh: mahinhanhp.val() }),
        success: function (response) {
            laysanpham();
            alert(response);
        }
    });

}
//Admin Sản Phẩm
//Admin Phiên Đấu Giá
function layphiendaugia() {
    $('#ten').html("Phiên Đấu Giá");
    $('#sanphanadmin').html("");
    $('#sanphanadmin').append('<a href="#" onclick="addPhien()" class="btn btn-primary btn-sm">Thêm SP</a></br></br>');
    $.ajax({
        type: 'GET',
        url: '/layphiendaugia',
        dataType: 'json',
        success: function (response) {
            response.forEach(function (item) {
                $('#sanphanadmin').append("</br>Mã Phiên: " + item.maphien + "");
                $('#sanphanadmin').append("</br>Mã SP: " + item.masp + "");
                $('#sanphanadmin').append("</br>Time Bắt Đầu: " + item.thoigianbatdau + "");
                $('#sanphanadmin').append("</br>Time Đấu: " + item.thoigiandau + "");
                $('#sanphanadmin').append("</br>Giá Hiện Tại:" + item.giahientai + "");
                $('#sanphanadmin').append("</br>Giá Khởi Điểm:" + item.giakhoidiem + "");
                $('#sanphanadmin').append("</br>Mã Tình Trạng:" + item.matinhtrang + "");
                $('#sanphanadmin').append("</br>Mã Phiếu Thắng:" + item.maphieuthang + "");
                $('#sanphanadmin').append('</br><a href="#" onclick="xoaphien(' + item.maphien + ')" class="btn btn-primary btn-sm">Xóa</a>');
                $('#sanphanadmin').append('<a href="#" onclick="chinhsuaphien(' + item.maphien + ')" class="btn btn-primary btn-sm">Sửa</a></br>');
            });
        }
    });
}
function chinhsuaphien(ma) {
    $('#sanphanadmin').html("");
    $('#ten').html("Chỉnh Sửa");
    $.ajax({
        type: 'GET',
        url: '/chinhsuaphien/' + ma,
        dataType: 'json',
        success: function (response) {
            $('#sanphanadmin').append('Mã Sản Phẩm: </br><input value= ' + response.masp + ' type="text" class="form-control" id="pmasp">');
            $('#sanphanadmin').append('Time Bắt Đầu:</br><input value= ' + response.thoigianbatdau + ' type="text" class="form-control" id="ptimebd">');
            $('#sanphanadmin').append('Time Đấu:</br><input value= ' + response.thoigiandau + ' type="text" class="form-control" id="mtimedau">');
            $('#sanphanadmin').append('Giá Hiện Tại:</br><input value= ' + response.giahientai + ' type="text" class="form-control" id="pgiaht">');
            $('#sanphanadmin').append('Giá Khởi Điểm:</br><input value= ' + response.giakhoidiem + ' type="text" class="form-control" id="pgiakd">');
            $('#sanphanadmin').append('Mã Tình Trạng:</br><input value= ' + response.matinhtrang + ' type="text" class="form-control" id="ptinhtrang">');
            $('#sanphanadmin').append('Mã Phiếu Thắng:</br><input value= ' + response.maphieuthang + ' type="text" class="form-control" id="pmathang">');
            $('#sanphanadmin').append('</br><a onclick="hoanthanhcsphien(' + response.maphien + ')" href="#" class="btn btn-primary btn-sm">Hoàn Thành</a></br>');
        }
    });
}
function hoanthanhcsphien(maspp) {
    var pmasp = $("#pmasp");
    var ptimebd = $("#ptimebd");
    var mtimedau = $("#mtimedau");
    var pgiaht = $("#pgiaht");
    var pgiakd = $("#pgiakd");
    var ptinhtrang = $("#ptinhtrang");
    var pmathang = $("#pmathang");
    $.ajax({
        url: '/hoanthanhcsphien',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({maphien:maspp, pgiakd: pgiakd.val(),ptinhtrang: ptinhtrang.val(),
            pmathang: pmathang.val(),pmasp: pmasp.val(), ptimebd: ptimebd.val(),
            mtimedau: mtimedau.val(), pgiaht: pgiaht.val()}),
        success: function (response) {
            layphiendaugia()
            alert(response);
        }
    });

}
function xoaphien(i) {
    $.ajax({
        type: 'GET',
        url: '/xoaphien/' + i,
        dataType: 'text',
        success: function (response) {
            alert(response);
            layphiendaugia();
        }
    });
}
function addPhien() {
    $('#sanphanadmin').html("");
    $('#ten').html("Thêm Phiên");
    $('#sanphanadmin').append('Mã SP:</br><input type="text" class="form-control" id="pmasp">');
    $('#sanphanadmin').append('Time Bắt Đầu(dd/mm/yyyy hh:mm:ss):</br><input type="text" class="form-control" id="ptimebd">');
    $('#sanphanadmin').append('Time Đấu (mm:ss):</br><input type="text" class="form-control" id="mtimedau">');
    $('#sanphanadmin').append('Giá Hiện Tại:</br><input type="text" class="form-control" id="pgiaht">');
    $('#sanphanadmin').append('Giá Khởi Điểm</br><input type="text" class="form-control" id="pgiakd">');
    $('#sanphanadmin').append('Mã Tình Trạng(1:true,2:false):</br><input type="text" class="form-control" id="ptinhtrang">');
    $('#sanphanadmin').append('Mã Phiếu Thắng</br><input type="text" class="form-control" id="pmathang">');
    
    $('#sanphanadmin').append('</br><a onclick="hoanthanhaddPhien()" href="#" class="btn btn-primary btn-sm">Tạo SP</a></br>');
}
function hoanthanhaddPhien() {
    var pmasp = $("#pmasp");
    var ptimebd = $("#ptimebd");
    var mtimedau = $("#mtimedau");
    var pgiaht = $("#pgiaht");
    var pgiakd = $("#pgiakd");
    var ptinhtrang = $("#ptinhtrang");
    var pmathang = $("#pmathang");
    $.ajax({
        url: '/hoanthanhaddPhien',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ pgiakd: pgiakd.val(),ptinhtrang: ptinhtrang.val(),
            pmathang: pmathang.val(),pmasp: pmasp.val(), ptimebd: ptimebd.val(),
            mtimedau: mtimedau.val(), pgiaht: pgiaht.val() }),
        success: function (response) {
            layphiendaugia();
            alert(response);
        }
    });

}
//Admin Phiên Đấu Giá
//Admin Hình Ảnh
function layhinhanh(){
    $('#ten').html("Danh Sách Ảnh");
    $('#sanphanadmin').html("");
    $('#sanphanadmin').append('<a href="#" onclick="addHinhAnh()" class="btn btn-primary btn-sm">Thêm SP</a></br></br>');
    $.ajax({
        type: 'GET',
        url: '/layhinhanh',
        dataType: 'json',
        success: function (response) {
            response.forEach(function (item) {
                $('#sanphanadmin').append("</br>Mã Ảnh: " + item.mahinhanh + "");
                $('#sanphanadmin').append("</br>Tên Ảnh: " + item.tenanh + "");
                $('#sanphanadmin').append("</br><img src='/images/"+item.tenanh+"' height='70' width='70'></br>");
                $('#sanphanadmin').append('</br><a href="#" onclick="xoahinhanh(' + item.mahinhanh + ')" class="btn btn-primary btn-sm">Xóa</a>');
                
            });
        }
    });
}

function xoahinhanh(id){
    $.ajax({
        type: 'GET',
        url: '/xoahinhanh/' + id,
        dataType: 'text',
        success: function (response) {
            alert(response);
            layhinhanh();
        }   
    });
}

function addHinhAnh() {
    
    $('#sanphanadmin').html("");
    $('#ten').html("Thêm Ảnh");
    $('#sanphanadmin').append("upload 1 lần tối đa 3 file");
    $('#sanphanadmin').append("<form ref='uploadForm' id='uploadForm' action='/upload' method='post' encType='multipart/form-data'>"
    +"<input id = 'file' type='file' name='sampleFile'/>"
    +"<input id = 'file' type='file' name='sampleFile2'/>"
    +"<input id = 'file' type='file' name='sampleFile3'/>"
    +"<input type='submit' class='btn btn-primary btn-sm' value='Upload!' /> </form>");

}
