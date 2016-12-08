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
                    '<tr onClick="location.href=\'/admin/userEdit/'+row.id+'\'" style="cursor:pointer;">'+
                    '<td>'+
                        '<div class="icheckbox_flat-green" style="position: relative;">'+
                          '<input type="checkbox" class="flat" name="table_records" value="'+row.id+'" style="position: absolute; opacity: 0;"">'+
                          '<ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins>'+
                         '</div>'+
                    '</td>'+
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

$(document).ready(function(){
  var fileTarget = $('.filebox .upload-hidden');

  fileTarget.on('change', function(){  // 값이 변경되면
      if(window.FileReader){  // modern browser
        var filename = $(this)[0].files[0].name;
      }
      else {  // old IE
        var filename = $(this).val().split('/').pop().split('\\').pop();  // 파일명만 추출
      }

      // 추출한 파일명 삽입
      $(this).siblings('.upload-name').val(filename);
    });
  });
