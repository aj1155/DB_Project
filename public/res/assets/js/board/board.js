$(document).ready(function(){
  $("#listSubmit").click(function(){
    var board_id = $("input[name=board_id]").val();
    var currentPage=$("input[name=currentPage]").val();
    var srchText=0;
    console.log("srchText1:"+srchText);
    if($("input[name=srchText]").val()!=""){
      srchText=$("input[name=srchText]").val();
    }
    console.log("srchText2:"+srchText);
    var srchType=$("select[name=srchType]").val();
    var lastTr = $("tr").last();
    var cp = Number(currentPage)+1;
    $("input[name=currentPage]").val(cp);
    $.ajax({
      type :'get',
      url : '/board/list/'+currentPage+'/'+srchType+'/'+srchText+'/'+board_id,
      success : function(result){
        console.log(result);
        for(var i=result.length-1; i>-1; i--){
          var dataTable = '<tr>'+
                            '<td><a data-utrl="/baord/read/'+result[i].id+'">'+result[i].ROWNUM+'</a></td>'+
                            '<td>'+result[i].title+'</td>'+
                            '<td>'+result[i].user_name+'</td>'+
                            '<td>'+result[i].create_time+'</td>'+
                          '</tr>';
          lastTr.after(dataTable);
        }
      },
      error : function(err){
        alert("error:"+err);
      }
    });
  });
});
