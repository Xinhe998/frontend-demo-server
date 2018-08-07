var express = require('express');
var router = express.Router();
const crypto = require('crypto');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* 註冊 */
router.post('/register', function (req, res, next) {
  var db = req.con;
  let result = {};
  //加密
  var salt = crypto.randomBytes(128).toString('base64');
  let password = req.body.Password;
  let hashPassword = crypto.createHmac('sha256', salt);
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
/* 檢查Email重複 */
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
/* 登入 */
router.post('/login', function (req, res, next) {
  var db = req.con;
  let result = {};

  const loginData = {
    Email: req.body.Email,
    Password: rePassword
  }
  console.log(rePassword);
  //console.log(req.body);
  db.query('SELECT * FROM member WHERE Email = ? AND Password = ?', [loginData.Email, loginData.Password], function (err, rows) {
    if (err) {
      console.log(err);
      result.status = "註冊失敗。"
      result.err = "伺服器錯誤，請稍後在試！"
      res.json({
        result: err
      })
    } else {
      console.log(rows);
      if (rows.length >= 1) {
        // 產生token
        const token = jwt.sign({
          algorithm: 'HS256',
          exp: Math.floor(Date.now() / 1000) + (60 * 60), // token一個小時後過期。
          data: rows[0].Email
        }, config.secret);
        res.setHeader('token', token);

        result.status = "登入成功。"
        res.json({
          result: result
        })
      } else {
        result.status = "登入失敗。"
        result.err = "請輸入正確的帳號或密碼。";
        res.json({
          result: result
        })
      }
    }
  })
});

module.exports = router;
