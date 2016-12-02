var mysql = require('mysql');
var pool = require('../../join/connection');

var comment={};

comment.selectByBoard_id=function(board_id,callback){
  pool.getConnection(function(err,connection){
    var query = "select * from comment where board_id=? order by group_id , seq";
    connection.query(query,[board_id],function(err,row){
      if(err){
        console.log(err);
      }else{
        callback(row);
        connection.release();
      }
    });
  });
};

comment.defaultUpdate=function(board_id,id,callback){
  pool.getConnection(function(err,connection){
    var query="update comment set group_id=(select * from (select max(a.group_id)+1 from comment a where a.board_id=?)A),parent_id=id where id=?";
    connection.query(query,[board_id,id],function(err,result){
      if(err){
        console.log(err);
      }else{
        callback(result);
        connection.release();
      }
    });
  });
};

comment.parentCommentCreate=function(params,callback){
  pool.getConnection(function(err,connection){
    console.log(params);
    var query="INSERT INTO comment(board_id,content,user_name,write_time,user_id,group_id,seq,level) VALUES(?,?,?,?,?,?,(select max(a.group_id)+1 from comment a where a.group_id=? and a.board_id=?),(select max(d.level)+1 from comment d where d.group_id=? and d.board_id=?));"
    var query1="INSERT INTO comment(board_id,content,user_name,write_time,user_id,group_id,seq,level) values(1,1,1,1,1,1,1,1)"
    connection.query(query1,[params],function(results){
      if(err){
        console.log(err);
      }else{
        callback(results[0]);
        connection.release();
      }
    });
  });
};

comment.commentCreate=function(params,callback){
  pool.getConnection(function(err,connection){
    var query="INSERT INTO comment(board_id,content,user_name,write_time,user_id,group_id,seq,level,parent_id) VALUES(?,?,?,?,?,?,(select max(c.seq)+1 from comment c where c.group_id=? and c.board_id=?),(select max(d.level)+1 from comment d where d.board_id=? and d.group_id=?),?)"
    connection.query(query,params,function(err,results){
        if(err){
          console.log(err);
        }else{
          callback(results);
          connection.release();
        }
    });
  });
};

module.exports = comment;
