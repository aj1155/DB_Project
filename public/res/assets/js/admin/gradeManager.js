$(function(){
      $(".del").click(function() {
        event.stopPropagation();
        var list =[];
        $(".flat:checked").each(function(idx, row) {
         var record = $(this).val();
         list.push(record);
       });
        if(list.length>0){
          $.ajax({
              url:'/admin/gManager',
              type:'delete',
              data:{
                list: JSON.stringify(list)
              },
              success:function(msg){
                  if(msg=="success"){
                    location.href = '/admin/gradeManager';
                  }
              }
          });
        }
    });
    $('#more').click(function(){
      $.ajax({
          url:'/admin/gradeManagerListMore',
          type:'get',
          data:{
            srchType : $("select[name=srchType]").val(),
            srchText : $("input[name=srchText]").val(),
            current : $("#more").val(),
            count: 4
          },
          success:function(data){
              if(data.msg=="success"){
                console.log(data);
                $("#more").val(Number($("#more").val())+data.len);
                data.list.forEach(function(row){
                  var tr = $(
                    '<tr onClick="location.href=\'/admin/gradeManagerAdd/'+row.id+'\'" style="cursor:pointer;">'+
                    '<td>'+row.name+'</td>'+
                    '<td>'+row.grade+'</td>'+
                    '<td>'+row.phone_number+'</td>'+
                    '<td>'+row.email+'</td>'+
                    '</tr>'
                  );
                  tr.appendTo($('#dataList'));
                });

              }
          }
      });
    });
});
