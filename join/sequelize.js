var mysql = require('mysql');
 var Sequelize = require("sequelize");
 var sequelize = new Sequelize('nodejsstudy', 'root', 'cjfwls524!', {
     host: 'localhost',
     dialect: 'mysql',
       pool: {
           max: 5,
            min: 0,
             idle: 5
      },
});
module.exports = sequelize;
