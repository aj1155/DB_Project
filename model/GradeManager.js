var Sequelize = require("sequelize");
var sequelize = require('../join/sequelize');

var GradeManager = sequelize.define('grademanager', {
       id : {
             type: Sequelize.INTEGER,
             primaryKey: true,
             autoIncrement: true
       },
       category_id:{
             type: Sequelize.INTEGER
       },
       grade:{
             type: Sequelize.INTEGER
       },
       user_id:{
             type: Sequelize.INTEGER
       },
       user_name:{
             type: Sequelize.STRING
       },
       position:{
             type: Sequelize.STRING
       },

 }, {
       freezeTableName: true, // Model tableName will be the same as the model name
       timestamps: false
 });

 module.exports = GradeManager;
