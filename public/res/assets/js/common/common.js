/*공통 자바스크립트*/
$(function(){
  $("li[data-url]").click(function() {
            event.stopPropagation();
		        location.href = $(this).attr("data-url");
		});
   $("span[data-url]").click(function() {
              event.stopPropagation();
   		        location.href = $(this).attr("data-url");

   	});
    $("a[data-url]").click(function() {
                 event.stopPropagation();
     		        location.href = $(this).attr("data-url");
    });
    $("div[data-url]").click(function() {
              event.stopPropagation();
  		        location.href = $(this).attr("data-url");
  	});

});
