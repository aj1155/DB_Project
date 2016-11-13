var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var storage = multer.diskStorage({ //multers disk storage settings

        /* data저장
       destination: function (req, file, cb) {

           cb(null, 'C:/Users/USER/nodepj/express');

       },
       */
       filename: function (req, file, cb) {
           var datetimestamp = Date.now();
           cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
       }
   });
   var upload = multer({ //multer settings
                   storage: storage,
                   fileFilter : function(req, file, callback) { //file filter
                       if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                           return callback(new Error('Wrong extension type'));
                       }
                       callback(null, true);
                   }
               }).single('file');

module.storage = storage;
exports.upload = upload;
