var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");

var exToJson = function(req,callback){
  var exceltojson;
  if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
      exceltojson = xlsxtojson;
  } else {
      exceltojson = xlstojson;
  }
  try {
      exceltojson({
          input: req.file.path, //the same path where we uploaded our file
          output: null, //since we don't need output.json
          lowerCaseHeaders:true
      }, function(err,result){
          if(err) {
              //return res.json({error_code:1,err_desc:err, data: null});
              result.msg="userDataMiss";
              req.flash('error', "엑셀에 유저 정보 입력을 확인 해주세요!");
              callback(result);
          }

          //res.json({error_code:0,err_desc:null, data: result});
          result.msg = "success";
          callback(result);
      });
  } catch (err){
      //res.json({error_code:1,err_desc:"Corupted excel file"});
       var result={};
       result.msg="excelTypeErr";
      callback(result);
  }

}

exports.exToJson = exToJson;
