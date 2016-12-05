$(document).ready(function(){
  $('#commentParentSubmit').click(function(){
    var board_id = $("input[name=board_id]").val();
    var message = $("#message").val();
    $.ajax({
      type : 'get',
      url : '/board/CommentCreate/'+board_id+'/'+message,
      contentType :"application/x-www-form-urlencoded;charset=UTF-8",
      success : function(result){
        var commentParentText = '<tr id="r1" name="commentParentCode">'+
                                      '<input type="hidden" name="comment_id" value='+result.id+'/>'+
                                          '<td colspan=2>'+
                                               '<strong>'+result.user_name+'</strong> '+result.write_time+' <a style="cursor:pointer;" name="pDel">삭제</a>'+
                                               '<p>'+message+'</p>'+
                                          '</td>'+
                                  '</tr>';
        if($('#commentTable').contents().size()==0){
          $('#commentTable').append(commentParentText);
        }else{
          $('#commentTable tr:last').after(commentParentText);
        }
        $('#message').val("");
      },
      error:function(error){
        alert("error:"+error);
      }
    });
  });
});

$(document).on("click","table#commentTable a",function(){
  if($(this).attr("name")=="pDel"){
    var comment_id = $('input[name=comment_id]').val();
    if(confirm("답글을 삭제 하시면 밑에 답글도 모두 삭제됩니다. 삭제하시겠습니까?")==true){
      var delComment = $(this).parent().parent();
      $.ajax({
        type : 'get',
        url :'/board/CommentDelete/'+comment_id,
        contentType:"application/x-www-form-urlencoded;charset=UTF-8",
        success : function(result){
          delComment.remove();
        }
      });
    }else {
      return;
    }
  }else if($(this).attr("name")=="pAdd"){
    var parentElement = $(this).parent().parent();
     $("#commentEditor").remove();
    var commentEditor = '<tr id="commentEditor">'+
                          '<td style="width:1%"> </td>'+
                          '<td>'+
                            '<span class="form-inline" role="form">'+
                            '<textarea id="commentChildText" name="commentChildText" class="form-control" width="100%"></textarea>'+
                              '<div class="form-group">'+
                                '<button type="button" id="commentChildSubmit" class="btn btn-default">확인</button>'+
                              '</div>'+
                            '</span>'+
                          '</td>'+
                        '</tr>';                    
   parentElement.after(commentEditor);

$(document).on("click","#commentChildSubmit",function(){
  var d = new Date();
  var date =(d.getFullYear()) + '-' +
    (d.getMonth() + 1) + '-' +
    (d.getDate()) + ' ';
    var s = $(this).parent().parent().parent().parent().prev();
    var board_id = $("input[name=board_id]").val();
    var message = $("#commentChildText").val();
    var parent_id = s.children("input[name=comment_id]").val();
    var group_id = s.children("input[name=group_id]").val();
    $.ajax({
      type : 'get',
      url : '/board/CommentCreate2/'+board_id+'/'+message+'/'+parent_id+'/'+group_id,
      contentType:"application/x-www-form-urlencoded;charset=UTF-8",
      success : function(results){
      var commentChildText = '<tr name="commentChildCode">'+
                                  '<input type="hidden" name="comment_id" value='+results.id+'/>'+
                                  '<input type="hidden" name="group_id" value='+results.group_id+'/>'+
                                  '<td style="width:99%">'+
                                    '<strong>'+results.user_name+'</strong> '+date+'<a style="cursor:pointer;" name="cDel">삭제</a>'+
                                      '<p>RE:'+message+'</p>'+
                                  '</td>'+
                             '</tr>';

      $("#commentEditor").remove();

      while(s.attr("name")!="commentParentCode"){
        s=s.prev();
      }
      var check = false;
      var nextTr = s.next();
      if(nextTr.attr("name")!="commentChildCode"){
        s.after(commentChildText);
      }else{
        while(nextTr.attr("name")=="commentChildCode"){
          nextTr=nextTr.next();
          check=true;
        }
      }
      if(check){
        nextTr=nextTr.prev();
        nextTr.after(commentChildText);
      }
    },
    error : function(error){
      alert("err"+error);
    }
  });
});
  }
});
