$(function(){
  $('#add').click(function(){
    $.ajax({
        url:'/user/userGradeListMore',
        type:'get',
        data:{
          //srchType :,
          //srchText :,
          //current :,
          count: 4
        },
        success:function(msg){
            if(msg=="success"){
              location.href = '/admin/userManage/'+"delfine";
            }
        }
    });
  });
});
