var Sequelize = require("sequelize");
var sequelize = require('../join/sequelize');

var User = sequelize.define('user', {
       id : {
             type: Sequelize.INTEGER,
             primaryKey: true,
             autoIncrement: true
       },
       login_id:{
         type : Sequelize.STRING
       },
       name:{
             type: Sequelize.STRING
       },
       password:{
             type: Sequelize.STRING
       },
       birth:{
         type:Sequelize.STRING
       },
       phone_number:{
             type: Sequelize.STRING
       },
       company_number:{
             type: Sequelize.STRING
       },
       email:{
             type: Sequelize.STRING
       },
       category_id:{
             type: Sequelize.INTEGER
       },
       grade:{
             type: Sequelize.INTEGER
       },
       social_status:{
             type: Sequelize.STRING
       },
       is_admin:{
             type: Sequelize.BOOLEAN
       },
       is_phone_number:{
             type: Sequelize.BOOLEAN
       },
       is_social_status:{
             type: Sequelize.BOOLEAN
       },
       is_company_number:{
             type: Sequelize.BOOLEAN
       },
       is_email:{
             type: Sequelize.BOOLEAN
       },
       is_image:{
             type: Sequelize.BOOLEAN
       },

 }, {
       freezeTableName: true, // Model tableName will be the same as the model name
       timestamps: false
 });

 module.exports = User;
