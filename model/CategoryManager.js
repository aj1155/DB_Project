var Sequelize = require("sequelize");
var sequelize = require('../join/sequelize');

var CategoryManager = sequelize.define('categorymanager', {
       id : {
             type: Sequelize.INTEGER,
             primaryKey: true,
             autoIncrement: true
       },
       category_id:{
         type : Sequelize.INTEGER
       },
       user_id:{
             type: Sequelize.INTEGER
       },
       position:{
             type: Sequelize.STRING
       },
       user_name:{
         type:Sequelize.STRING
       },
       grade:{
             type: Sequelize.INTEGER
       }
 }, {
       freezeTableName: true, // Model tableName will be the same as the model name
       timestamps: false
 });

 module.exports = CategoryManager;
