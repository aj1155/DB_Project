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
              url:'/admin/user',
              type:'delete',
              data:{
                list: JSON.stringify(list)
              },
              success:function(msg){
                  if(msg=="success"){
                    location.href = '/admin/userManage/'+"delfine";
                  }
              }
          });
        };
    });

    $('#more').click(function(){
      $.ajax({
          url:'/admin/userManagerListMore',
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
                    '<tr onClick="location.href=/admin/userEdit/'+row.id+'" style="cursor:pointer;">'+
                    '<td><input type="checkbox" class="flat" name="table_records" value="'+row.id+'"></td>'+
                    '<td>'+row.name+'</td>'+
                    '<td>'+row.grade+'</td>'+
                    '<td>'+row.phone_number+'</td>'+
                    '<td>'+row.email+'</td>'+
                    '<td>'+row.birth+'</td>'+
                    '<td>'+row.company_number+'</td>'+
                    '<td>'+row.social_status+'</td>'+
                    '<td>'+row.is_admin+'</td>'+
                    '</tr>'
                  );
                  tr.appendTo($('#dataList'));
                });

              }
          }
      });
    });
});
