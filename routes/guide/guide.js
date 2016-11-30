var express = require('express');
var router = express.Router();
var Introduce = require('../../model/Introduce');
var sequelize = require('../../join/sequelize');
/* node.js orm sequelize 설정을 불러옴 */


/*session user정보를 local에 저장하여 명시적으로 넘겨주지않아도
ejs파일로 render할 시에 자동적으로 넘어감 세션값 사용시 user로 꺼내쓰면됨*/
router.use(function(req, res, next) {
  if(req.user) res.locals.user = req.user;
  else res.locals.user = undefined;
  next();
});

/* GET home page. */
router.get('/introduce', function (req, res, next) {
    sequelize.authenticate().then(function (err) {
        Introduce.findAll({
            where: {
                id: req.user.category_id
            }
        })
            .then(function (rows) {
                res.render('guide/introduce', {body: rows[0].text});
            });
    })
        .catch(function (err) {
            res.send(err);
        });
});


module.exports = router;
