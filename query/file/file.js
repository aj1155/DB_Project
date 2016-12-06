var mysql = require('mysql');
var pool = require('../../join/connection');

var file={};

file.insert=function(params,callback){
  var query = "INSERT INTO file(name,size,data,board_id) VALUES(?,?,?,?)";
  pool.getConnection(function(err,connection){
    connection.query(query,params,function(err,result){
      if(err){
        console.log(err);
      }else{
        callback(result);
        connection.release();
      }
    });
  });
};

file.selectByBoard_id=function(board_id,callback){
  var query="SELECT id,name FROM file where board_id=?";
  pool.getConnection(function(err,connection){
    connection.query(query,board_id,function(err,result){
      if(err){
        console.log(err);
      }else{
        callback(result);
        connection.release();
      }
    });
  });
};

file.selectById=function(id,callback){
  var query="SELECT * FROM file where id=?";
  pool.getConnection(function(err,connection){
    connection.query(query,id,function(err,result){
      if(err){
        console.log(err);
      }else{
        callback(result);
        connection.release();
      }
    });
  });
};

file.boardDelete=function(id,callback){
  var query="delete from file where board_id=?";
  pool.getConnection(function(err,connection){
    connection.query(query,id,function(err,results){
      if(err){
        console.log(err);
      }else{
        callback(results);
        connection.release();
      }
    });
  });
};

file.delete=function(id,callback){
  var query="DELETE FROM file where id=?";
  pool.getConnection(function(err,connection){
    connection.query(query,id,function(err,results){
      if(err){
        console.log(err);
      }else{
        callback(results);
        connection.release();
      }
    });
  });
};
module.exports = file;
