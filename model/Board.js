var Sequelize = require("sequelize");
var sequelize = require('../join/sequelize');

var Board = sequelize.define('board', {
       id : {
         type : Sequelize.INTEGER,
         primaryKey : true,
         autoIncrement : true
       },
       category_id : {
         type : Sequelize.INTEGER
       },
       board_name : {
         type : Sequelize : STRING
       }
 }, {
       freezeTableName: true, // Model tableName will be the same as the model name
       timestamps: false
 });

 module.exports = Board;
/*user와 board cateogry조인후 board id로 board_post조회*/
