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
});
