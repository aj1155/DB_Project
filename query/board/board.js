var mysql = require('mysql');
var pool = require('../../join/connection');

var board={};

board.selectList=function(params,callback){
  pool.getConnection(function(err,connection){
    var query="call select_list(?,?,?,?,?)";
    connection.query(query,params,function(err,row){
      if(err){
        console.log(err);
      }else{
        callback(row[0]);
        connection.release();
      }
    });
  });
};
board.selectById=function(id,callback){
  pool.getConnection(function(err,connection){
    connection.query("select * from board_post where id=?",[id],function(err,row){
      if(err){
        console.log(err);
      }else{
        callback(row[0]);
        connection.release();
      }
    });
  });
};

board.board_insert=function(title,content,callback){
  pool.getConnection(function(err,connection){
    connection.query("insert into board_post(board_id,title,content,create_time,user_name,user_id) values(?,?,?,?,?,?)",[1,title,content,bp[1],bp[2],bp[3]],function(err,row){
      if(err){/*insert set-->json객체를 넣고 객체를 매개변수로*/
        console.log(err);
      }else{
        callback(true);
        connection.release();
      }
    });
  });
};

board.selectByCategory_id=function(category_id,callback){
  var query = "select bp.* from board_post bp JOIN board b ON b.id=bp.board_id && b.category_id=? && b.id=?";
  pool.getConnection(function(err,connection){
    connection.query(query,[category_id,2],function(err,result){
      if(err){
        console.log(err);
      }else{
        callback(result);
        connection.release();
      }
    });
  })
};

board.main1=function(category_id,callback){//메인에 카테고리별 자유게시판쿼리
  var query = "select * from board_post where board_id=? order by id desc LIMIT 10";
  pool.getConnection(function(err,connection){
    var cid=Number(category_id)*2-1;
    connection.query(query,[cid],function(err,result){
      if(err){
        console.log(err);
      }else{
        callback(result);
        connection.release();
      }
    });
  });
};

board.main2=function(category_id,callback){//메인에 카테고리별 공지사항쿼리
  var query="select * from board_post where board_id=? order by id DESC LIMIT 5";
  pool.getConnection(function(err,connection){
    var cid=Number(category_id)*2;
    console.log(cid);
    connection.query(query,[cid],function(err,result){
      if(err){
        console.log(err);
      }else{
        callback(result);
        connection.release();
      }
    });
  });
};

board.insert=function(param,callback){
  var query="INSERT INTO board_post(board_id,title,content,create_time,user_name,user_id) values(?,?,?,?,?,?)";
  pool.getConnection(function(err,connection){
    connection.query(query,param,function(err,result){
      if(err){
        console.log(err);
      }else{
        callback(result);
        connection.release();
      }
    });
  });
};

board.delete=function(id,callback){
  var query="delete from board_post where id=?";
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

board.update=function(params,callback){
  var query="UPDATE board_post SET title=?,content=?,create_time=? where id=?";
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
module.exports = board;
