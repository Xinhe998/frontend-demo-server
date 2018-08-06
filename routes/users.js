var express = require('express');
var router = express.Router();
const crypto = require('crypto');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function (req, res, next) {
  var db = req.con;
  let result = {};
  //加密
  let password = req.body.Password;
  let hashPassword = crypto.createHash('sha1');
  hashPassword.update(password);
  const rePassword = hashPassword.digest('hex');

  const memberData = {
    Email: req.body.Email,
    Password: rePassword,
    Name: req.body.Name
  }
  //console.log(req.body);
  db.query('INSERT INTO member SET ?', memberData, function (err, rows) {
    if (err) {
      console.log(err);
      result.status = "註冊失敗。"
      result.err = "伺服器錯誤，請稍後在試！"
      res.json({
        result: err
      })
    } else {
      result.status = "註冊成功。"
      result.member = memberData;
      res.json({
        result: result
      })
    }
  })
});

router.post('/checkEmailIsExist', function (req, res, next) {
  var db = req.con;
  let result = {};
  const Email = req.body.Email;
  db.query('SELECT * FROM member WHERE Email = ?', Email, function (err, rows) {
    if (err) {
      console.log(err);
      result.status = "查詢失敗。"
      result.err = "伺服器錯誤，請稍後在試！"
      res.json({
        result: err
      })
    } else {
      if (rows.length >= 1) {
        result.status = "查詢成功。"
        result.err = "已有重複Email。";
        res.json({
          result: result
        })
      } else {
        result.status = "查詢成功。"
        result.err = "未有重複Email。";
        res.json({
          result: result
        })
      }

    }
  })
})

module.exports = router;
