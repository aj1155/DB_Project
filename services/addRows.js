var User = require('../model/User');
var crypto = require('crypto');





var insert = function(result,category_id,callback){
  result.forEach(function(user,index){
    var key = 'secret password crypto';
    var myPass = user.birth;/*암호화 전에 패스워드*/
    var cipherPass = crypto.createCipher('aes192', key);
    cipherPass.update(myPass, 'utf8', 'base64');
    cipherPass = cipherPass.final('base64'); /*암호화 후에 패스워드*/
  User.create({
      login_id : user.login_id,
      name : user.name,
      password : cipherPass,
      phone_number : user.phone_number,
      birth : user.birth,
      company_number : user.company_number,
      email : user.email,
      category_id : category_id,
      grade : user.grade,
      social_status : user.social_status
    })
    .then(function(result){

    });
  });
  callback("success");
};

exports.insert = insert;
