$(function(){
  $('#add').click(function(){
    var pageURL = $(location).attr("href");
    var list = pageURL.replace(/[a-zA-z0-9.:/]+3000[/a-zA-Z/]+/, "").split("/");
    var category = list[0];
    var grade = list[1];
    $.ajax({
        url:'/users/userGradeListMore/',
        type:'get',
        data:{
          srchType : $("select[name=srchType]").val(),
          srchText : $("input[name=srchText]").val(),
          current : $("#add").val(),
          count: 4
        },
        success:function(data){
            if(data.msg=="success"){
              $("#add").val(Number($("#add").val())+data.len);
              data.list.forEach(function(row){
                var div;
                if(row.is_image === true || row.is_image === 1){
                  div = $(
                      '<div class="row col-md-6 col-sm-12 col-xs-12">'+
                        '<div class="profile_details">'+
                          '<div class="well profile_view" onClick="location.href=\'/users/detailProfile/'+row.id+'\'" style="cursor:pointer;">'+
                            '<div class="col-md-12 col-xs-12 col-sm-12">'+
                              '<div class="left col-md-7 col-xs-7 col-sm-7">'+
                                '<h2>이름 :'+row.name+'</h2>'+
                                '<p>기수 : '+row.grade+'</p>'+
                                '<button type="button" class="btn btn-success btn-xs">'+
                                '<i class="fa fa-phone"></i>'+
                                '</button>'+
                                '<button type="button" class="btn btn-primary btn-xs">'+
                                '<i class="fa fa-envelope"></i>'+
                                '</button>'+
                              '</div>'+
                              '<div class="right col-md-5 col-xs-5 col-sm-5 text-center">'+
                                '<img src="/profileImage/'+row.id+'_Profile.jpg" alt="" class="img-circle img-responsive">'+
                              '</div>'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                      '</div>'
                  );
                }
                else {
                  div = $(
                      '<div class="row col-md-6 col-sm-12 col-xs-12">'+
                        '<div class="profile_details">'+
                          '<div class="well profile_view" onClick="location.href=\'/users/detailProfile/'+row.id+'\'" style="cursor:pointer;">'+
                            '<div class="col-md-12 col-xs-12 col-sm-12">'+
                              '<div class="left col-md-7 col-xs-7 col-sm-7">'+
                                '<h2>이름 :'+row.name+'</h2>'+
                                '<p>기수 : '+row.grade+'</p>'+
                                '<button type="button" class="btn btn-success btn-xs">'+
                                '<i class="fa fa-phone"></i>'+
                                '</button>'+
                                '<button type="button" class="btn btn-primary btn-xs">'+
                                '<i class="fa fa-envelope"></i>'+
                                '</button>'+
                              '</div>'+
                              '<div class="right col-md-5 col-xs-5 col-sm-5 text-center">'+
                                '<img src="/res/production/images/user.png" alt="" class="img-circle img-responsive">'+
                              '</div>'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                      '</div>'
                  );
                }
                div.appendTo($('#innerList'));
              });

            }
        }
    });
  });
});
