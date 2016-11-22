$(document).ready(function(){
  $('#commentCreate').click(function(){
    var id = $(this).val();
    $.ajax({
      type : "GET",
      url : "board/CommentCreate/"+id,
      dataType : "text",
      srccess : function(result){
        if(!message){
          $("#comment").append(result.user_name);
          $("#comment").append(result.write_time);
          $("#comment").append(result.content);
        }
      }
    });
  });
});
