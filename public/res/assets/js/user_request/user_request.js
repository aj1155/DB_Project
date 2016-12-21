$(document).on("click","#sss",function(){
    var user_id = $("input[name=user_id]").val();
    var button=$(this);
    $.ajax({
      type : 'get',
      url : '/admin/request/'+user_id,
      contentType :"application/x-www-form-urlencoded;charset=UTF-8",
      success : function(result){
        button.remove();
      },
      error:function(error){
        alert("error:"+error);
      }
    });
  });
