var express = require('express');
var router = express.Router();
var util = require('util');
var fs = require('fs');
var async = require('async');
var fstools = require('fs-tools');
var path = require('path');
var mime = require('mime');
var formidable = require('formidable');
var im = require('imagemagick');
var baseImageDir = "C:/Users/강철진/StudyNodejs/DB_Project_git/public/res/production/images/guide/";

function getUploadForm(req,res,next){
  res.render('index',{title:'File Upload'});
}


// 파일 업로드 함수
function uploadFile(req,res,next){

  // 안드로이드앱과 같은 모바일 애플리케이션에서의 요청의 인코딩 방식을 확인하기 위해 아래와 같이 검사구문 추가
  if(req.headers['content-type'] === 'application/x-www-form-urlencoded'){
    // 모바일 업로드 요청

  }else{//multipart/form-data
    // 일반 웹페이지 업로드 요청

  }

  var form = new formidable.IncomingForm();
  var dirPath = "C:/Users/강철진/StudyNodejs/DB_Project_git/public/res/production/images/guide/";
  form.uploadDir = path.normalize(dirPath);   // 업로드 디렉토리
  form.keepExtensions = true;                                 // 파일 확장자 유지
  form.multiples = true;                                      // multiple upload
  form.parse(req,function(err,fields,files){
    // 이 미들웨어는 멀티파트 요청을 파싱하기 위해 form.parse를 사용하는데
    // form.parse의 콜백함수의 매개변수(fields, files)로 폼의 필드 정보들과 파일 정보들이 전달된다.
    console.log(fields);
    console.log(files);
    // 여러개의 파일을 업로드하는 경우
    if(files.pict instanceof Array){
      // async.each를 사용해 files.pict배열 객체의 각각의 파일을 /images 디렉토리로 옮긴다.
      var index=0;
      async.each(files.pict, function(file,cb){
        // 파일명만 추출후 업로드되는 파일명으로 선택하여 이미지가 저장될 경로를 더해준다.
        if(index==0){
          file.name="sin.jpg";
        }else{
          file.name="kim.jpg";
        }
        var destPath = path.normalize(baseImageDir+file.name);
        index++;
        // 해당 파일명을 서버로 전송처
        console.log(file.path);
        console.log(destPath);
        fstools.move(file.path, destPath, function(err){
          if(err) cb(err);
          else cb();
        })
      }, function(err){
        // 최종 처리 콜백 함
        if(err){ err.status(500); next(err); }   // 에러가 아니면 성공여부 전달
        else{

            /*image resize*/
            var route = "C:/Users/강철진/StudyNodejs/DB_Project_git/public/res/production/images/guide/sin.jpg";
            im.convert([ route, '-resize', '260x402',route],
            function(err, stdout){
              if (err) throw err;
              route = "C:/Users/강철진/StudyNodejs/DB_Project_git/public/res/production/images/guide/kim.jpg";
              im.convert([route, '-resize', '260x402',route],
              function(err, stdout){
                if (err) throw err;
                  return res.redirect('/guide/Introduce');
              });
            });

        }
      });
    }
    // 파일을 선택하지 않았을때
    else if(!files.pict.name){
      // 파일 선택하지 않았을 경우 업로드 과정에서 생긴 크기가 0인 파일을 삭제한다.
      fstools.remove(files.pict.path, function(err){
        if(err){ err.status(500); next(err); }
        else{
          res.status(200);
          res.json({error:null,data:'Upload successful'});
        }
      })
    }
    // 파일을 하나만 선택했을때
    else{
      // 업로드된 파일을(files.pict) /images디렉토리로 옮긴다.
      // 업로드 되는 파일명을 추출해서 이미지가 저장될 경로를 더해준다.
      var destPath = path.normalize("C:/Users/강철진/StudyNodejs/DB_Project_git/public/profileImage/"+path.basename(files.pict.path));
      // 임시 폴더에 저장된 이미지 파일을 이미지 경로로 이동시킨다.
      console.log(files.pict);
      fstools.move(files.pict.path, destPath, function(err){
        if(err){ err.status(500); next(err); }
        else{
          res.status(200);
          res.json({error:null,data:'Upload successful'});
        }
      })
    }
  });
  form.on('progress', function(receivedBytes, expectedBytes){
    console.log(((receivedBytes/expectedBytes)*100).toFixed(1)+'% received');
  });
}

// 이미지 조회 함수
function getImage(req,res,next){
  // Get방식으로 이미지의 파일명을 조회하면 이 함수로 들어와 imagepath값을 얻어온후
  // 해당 파일이 존재하면 스트림을 통해 읽어 요청한 클라이언트로 전송한다.
  // 요청한 파일이 없으면 next 미들웨어를 실행한다.
  var imagepath = req.params.imagepath;
  var filepath = path.normalize(baseImageDir+imagepath);
  fs.exists(filepath, function(exists){
    if(exists){
      res.statusCode = 200;
      res.set('Content-Type', mime.lookup(imagepath));
      var rs = fs.createReadStream(filepath);
      rs.pipe(res);
    }else{
      next();
    }
  })
}
router.post('/api/image',uploadFile);




module.exports = router;
