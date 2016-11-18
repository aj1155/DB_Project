var Sequelize = require("sequelize");
var sequelize = require('../join/sequelize');

var Board_post = sequelize.define('board_post', {
       id : {
             type: Sequelize.INTEGER,
             primaryKey: true,
             autoIncrement: true
       },
       board_id:{
         type : Sequelize.INTEGER
       },
       title:{
             type: Sequelize.STRING
       },
       content:{
             type: Sequelize.STRING
       },
       create_time:{
         type:Sequelize.STRING
       },
       user_name:{
             type: Sequelize.STRING
       },
       user_id:{
             type: Sequelize.INTEGER
       },
 }, {
       freezeTableName: true, // Model tableName will be the same as the model name
       timestamps: false
 });

 module.exports = Board_post;
