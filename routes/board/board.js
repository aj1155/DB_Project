var express = require('express');
var router = express.Router();
var boardDAO = require('../../query/board/board');
var pool = require('../../join/connection');
var Board_post = require('../../model/Board_post');
var sequelize = require('../../join/sequelize');
var commentDAO = require('../../query/comment/comment');
var Comment = require('../../model/Comment');

/*파일 업로드 관련 multiparty 모듈*/
var multiparty = require('multiparty');
var fs = require('fs');

/*session user정보를 local에 저장하여 ejs파일로
 명시적으로 넘겨주지않아도 자동적으로 넘어감 세션값 사용시 user로 꺼내쓰면됨*/
router.use(function (req, res, next) {
    if (req.user) res.locals.user = req.user;
    else res.locals.user = undefined;
    next();
});

router.get('/list/:board_id', function (req, res, next) {
    var board_id = req.params.board_id;
    if (req.params.srchType != null) {
        var srchType = req.params.srchType;
    } else {
        var srchType = 0;
    }
    if (req.params.srchText != null) {
        var srchText = req.params.srchText;
    } else {
        var srchText = "";
    }
    var category_id = req.user.category_id;
    var currentPage = 1;
    var pageSize = 15;
    var params = [currentPage, srchType, srchText, pageSize, board_id, category_id];
    boardDAO.selectList(params, function (rows) {
        res.render('board/list', {
            board_id: board_id,
            row: rows,
            currentPage: currentPage,
            srchType: srchType,
            srchText: "",
            currentPage: currentPage
        });
    });
});

router.post('/list/:board_id', function (req, res, next) {
    var params = [1, req.body.srchType, req.body.srchText, 15, req.params.board_id, req.user.category_id];
    boardDAO.selectList(params, function (rows) {
        res.render('board/list', {
            row: rows,
            board_id: req.params.board_id,
            srchText: req.body.srchText,
            srchType: req.body.srchType,
            currentPage: 1
        });
    });

});

router.get('/list/:currentPage/:srchType/:srchText/:board_id', function (req, res, next) {
    var srchText = 0;
    if (req.params.srchText != "") {
        srchText = req.params.srchText;
    }
    var pageSize = 15;
    var params = [req.params.currentPage, req.params.srchType, srchText, pageSize, req.params.board_id, req.user.category_id];
    boardDAO.selectList(params, function (rows) {
        res.json(rows);
    });
});
/*1은 공지사항 2는 자유게시판*/
router.get('/read/:id', function (req, res, next) {
    boardDAO.selectById([req.params.id], function (rows) {
        commentDAO.selectByBoard_id([req.params.id], function (row) {
            res.render('board/read', {rows: rows, row: row});
        });
    });
});

router.get('/write/:board_id', function (req, res, next) {
    var board_id = req.params.board_id;
    res.render('board/write', {board_id: board_id});
});

router.post('/write/:board_id', function (req, res, next) {
    var d = new Date();
    var board_id = req.params.board_id;
    var date = (d.getFullYear()) + '-' +
        (d.getMonth() + 1) + '-' +
        (d.getDate()) + ' ';
    var user_name = req.user.name;
    var user_id = req.user.id;
    sequelize.authenticate().then(function (err) {
        Board_post.create({
            board_id: board_id,
            title: req.body.title,
            content: req.body.content,
            create_time: date,
            user_id: user_id,
            user_name: user_name
        })
            .then(function (rows) {
                res.redirect('/board/list/' + board_id + '/1');
            });
    })
        .catch(function (err) {
            console.log(err);
        });
});

router.get('/edit/:id', function (req, res, next) {
    sequelize.authenticate().then(function (err) {
        Board_post.findOne({
            where: {
                id: req.params.id
            }
        })
            .then(function (result) {
                res.render('board/edit', {result: result});
            });
    })
        .catch(function (err) {
            res.send(err);
        });
});

router.post('/edit/:id', function (req, res, next) {

    var d = new Date();
    var date = (d.getFullYear()) + '-' +
        (d.getMonth() + 1) + '-' +
        (d.getDate()) + ' ';
    var updateObj = {
        title: req.body.title,
        content: req.body.content,
        create_time: date
    }
    var whereObj = {
        where: {
            id: req.params.id
        }
    }
    sequelize.authenticate().then(function (err) {
        Board_post.update(updateObj, whereObj)
            .then(function (result) {
                if (result == 1) {
                    res.redirect('/board/read/' + req.params.id);
                } else {
                    res.json("fail");
                }
            })
    })
        .catch(function (err) {
            res.send(err);
        });
});

router.get('/CommentCreate/:id/:message', function (req, res, next) {
    var d = new Date();
    var date = (d.getFullYear()) + '-' +
        (d.getMonth() + 1) + '-' +
        (d.getDate()) + ' ';
    var name = req.user.name;
    var user_id = req.user.id;
    var board_id = req.params.id;
    var content = req.params.message;
    var group_id;
    if (req.params.group_id != null) {
        group_id = req.params.group_id;
    } else {
        group_id = 1;
    }
    console.log(group_id)
    var parent_id = req.params.comment_id;
    sequelize.authenticate().then(function (err) {
        Comment.create({
            board_id: board_id,
            content: content,
            user_name: name,
            write_time: date,
            user_id: user_id
        })
            .then(function (results) {
                var id = results.id;
                commentDAO.defaultUpdate(board_id, results.id, function (result) {
                    res.json(results);
                });
            });
    })
        .catch(function (err) {
            console.log(err);
        });
    //commentDAO.parentCommentCreate(params,function(results){
    //res.json("success");
    //});
});

router.get('/CommentDelete/:board_id', function (req, res, next) {
    sequelize.authenticate().then(function (err) {
        Comment.destroy({
            where: {
                parent_id: req.params.board_id
            }
        })
            .then(function (results) {
                res.json(results);
            });
    })
        .catch(function (err) {
            console.log(err);
        });
});

router.get('/CommentCreate2/:board_id/:message/:parent_id/:group_id', function (req, res, next) {
    var d = new Date();
    var date = (d.getFullYear()) + '-' +
        (d.getMonth() + 1) + '-' +
        (d.getDate()) + ' ';
    var name = req.user.name;
    var user_id = req.user.id;
    var parent_id = req.params.parent_id;
    var board_id = req.params.board_id;
    var content = req.params.message;
    var group_id = req.params.group_id;
    var params = [board_id, content, name, date, user_id, group_id, group_id, board_id, board_id, group_id, parent_id];
    commentDAO.commentCreate(params, function (results) {
        results.user_name = name;
        res.json(results);
    });
});

module.exports = router;
