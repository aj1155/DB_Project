var Sequelize = require("sequelize");
var sequelize = require('../join/sequelize');

var Comment = sequelize.define('comment', {
       id : {
         type : Sequelize.INTEGER,
         primaryKey : true,
         autoIncrement : true
       },
       board_id : {
         type : Sequelize.INTEGER
       },
       content : {
         type : Sequelize.STRING
       },
       user_name : {
         type : Sequelize.STRING
       },
       write_time : {
         type : Sequelize.STRING
       },
       user_id : {
         type : Sequelize.INTEGER
       },
       parent_id : {
         type : Sequelize.INTEGER
       }
 }, {
       freezeTableName: true, // Model tableName will be the same as the model name
       timestamps: false
 });

 module.exports = Comment;
