  function readURL(input){
  	 if (input.files && input.files[0]) {
  	        var reader = new FileReader();
  	        reader.onload = function (e) {
  	            $('#img1').attr('src', e.target.result);
  	        };
  	        reader.readAsDataURL(input.files[0]);
  	    }
  }
  function readURLSECOND(input){
  	 if (input.files && input.files[0]) {
  	        var reader = new FileReader();
  	        reader.onload = function (e) {
  	            $('img:nth-child(2)').attr('src', e.target.result);
  	        };
  	        reader.readAsDataURL(input.files[0]);
  	    }
  }

  $(function(){
    $("#test-upload").fileinput({
        'showPreview' : false,
        'allowedFileExtensions' : ['jpg', 'png','gif'],
        'elErrorContainer': '#errorBlock'
    });
  });

  $('#file-fr').fileinput({
      language: 'fr',
      uploadUrl: '#',
      allowedFileExtensions : ['jpg', 'png','gif'],
  });
  $('#file-es').fileinput({
      language: 'es',
      uploadUrl: '#',
      allowedFileExtensions : ['jpg', 'png','gif'],
  });
  $("#file-0").fileinput({
      'allowedFileExtensions' : ['jpg', 'png','gif'],
  });
  $("#file-1").fileinput({
      uploadUrl: '#', // you must set a valid URL here else you will get an error
      allowedFileExtensions : ['jpg', 'png','gif'],
      overwriteInitial: false,
      maxFileSize: 1000,
      maxFilesNum: 10,
      //allowedFileTypes: ['image', 'video', 'flash'],
      slugCallback: function(filename) {
          return filename.replace('(', '_').replace(']', '_');
      }
  });
  /*
  $(".file").on('fileselect', function(event, n, l) {
      alert('File Selected. Name: ' + l + ', Num: ' + n);
  });
  */
  $("#file-3").fileinput({
  showUpload: false,
  showCaption: false,
  browseClass: "btn btn-primary btn-lg",
  fileType: "any",
      previewFileIcon: "<i class='glyphicon glyphicon-king'></i>"
  });
  $("#file-4").fileinput({
  uploadExtraData: {kvId: '10'}
  });
  $(".btn-warning").on('click', function() {
      if ($('#file-4').attr('disabled')) {
          $('#file-4').fileinput('enable');
      } else {
          $('#file-4').fileinput('disable');
      }
  });
  $(".btn-info").on('click', function() {
      $('#file-4').fileinput('refresh', {previewClass:'bg-info'});
  });
  /*
  $('#file-4').on('fileselectnone', function() {
      alert('Huh! You selected no files.');
  });
  $('#file-4').on('filebrowse', function() {
      alert('File browse clicked for #file-4');
  });
  */
