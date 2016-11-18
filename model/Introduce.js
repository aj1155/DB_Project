var Sequelize = require("sequelize");
var sequelize = require('../join/sequelize');

var Introduce = sequelize.define('introduce', {
       id : {
             type: Sequelize.INTEGER,
             primaryKey: true,
             autoIncrement: true
       },
       text:{
         type : Sequelize.STRING
       },
       image1:{
             type: Sequelize.BLOB
       },
       image2:{
             type: Sequelize.BLOB
       },


 }, {
       freezeTableName: true, // Model tableName will be the same as the model name
       timestamps: false
 });

 module.exports = Introduce;
