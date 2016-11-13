$(function(){
      $(".add").click(function() {
        event.stopPropagation();
        var list =[];
        $(".flat:checked").each(function(idx, row) {
         var record = $(row).parents("tr");
         list.push(record[0].innerText);
        })
        if(list.length>0){
          console.log(list);
        };
    });
});
