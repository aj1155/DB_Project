var User = require('../model/User');





var insert = function(result,category_id,callback){

  result.forEach(function(user,index){
  User.create({
      login_id : user.login_id,
      name : user.name,
      password : user.password,
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
