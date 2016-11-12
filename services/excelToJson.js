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
              callback(fail);
          }
          console.log(result);
          //res.json({error_code:0,err_desc:null, data: result});
          callback(result);
      });
  } catch (err){
      //res.json({error_code:1,err_desc:"Corupted excel file"});
      callback(fail);
  }

}

exports.exToJson = exToJson;
