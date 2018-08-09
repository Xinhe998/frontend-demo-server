const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config/development_config');

function register(req, res, next) {
  var db = req.con;
  let result = {};

  const memberData = {
    Email: req.body.Email,
    Password: hashPassword(req.body.Password),
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
}

function checkEmailIsExist(req, res, next) {
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
}

function login(req, res, next) {
  var db = req.con;
  let result = {};

  const loginData = {
    Email: req.body.Email,
    Password: hashPassword(req.body.Password)
  }

  db.query('SELECT * FROM member WHERE Email = ? AND Password = ?', [loginData.Email, loginData.Password], function (err, rows) {
    if (err) {
      console.log(err);
      result.status = "註冊失敗。"
      result.err = "伺服器錯誤，請稍後再試！"
      res.json({
        result: err
      })
    } else {
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
}

function updatePassword(req, res, next) {
  var db = req.con;
  const token = req.headers['token'];

  //確定token是否有輸入
  if (!token) {
    res.json({
      err: "請輸入token！"
    })
  } else {
    verifyToken(token).then(tokenResult => {
      if (tokenResult === false) {
        res.json({
          result: {
            status: "token錯誤。",
            err: "請重新登入。"
          }
        })
      } else {
        // res.json({
        //   test: "token正確"
        // })
        let result = {};

        const current_Email = tokenResult;
        const oldPassword = hashPassword(req.body.oldPassword);
        const newPassword = req.body.newPassword;

        db.getConnection().then(function () {
          return db.query('SELECT * FROM member WHERE Email = ?', current_Email);
        }).then(function (rows) {
          // console.log(rows);
          if (rows[0].Password === oldPassword) {
            var data = db.query('UPDATE member SET Password =? WHERE Email = ?', [hashPassword(newPassword), current_Email]);
          } else {
            result.status = "密碼更新失敗。"
            result.err = "舊密碼錯誤，請重新輸入！"
            res.json({
              result: result
            })
          }
          return data;
        }).then(function (rows) {
          // console.log(rows);
          result.status = "更新成功。"
          res.json({
            result: result
          })
        });
      }
    })
  }
}

function updateProfile(req, res, next) {
  var db = req.con;
  const token = req.headers['token'];

  //確定token是否有輸入
  if (!token) {
    res.json({
      err: "請輸入token！"
    })
  } else {
    verifyToken(token).then(tokenResult => {
      if (tokenResult === false) {
        res.json({
          result: {
            status: "token錯誤。",
            err: "請重新登入。"
          }
        })
      } else {
        // res.json({
        //   test: "token正確"
        // })
        let result = {};

        const current_Email = tokenResult;
        const memberData = {
          Gender: req.body.Gender,
          Birthday: req.body.Birthday
        }
        db.getConnection().then(function () {
          return db.query('SELECT * FROM member_detail WHERE Email = ?', current_Email);
        }).then(function (rows) {
          if (rows.length >= 1) {
            const memberData = {
              Gender: req.body.Gender,
              Birthday: req.body.Birthday
            }
            return db.query('UPDATE member_detail SET ? WHERE Email = ?', [memberData, current_Email]);
          } else {
            const memberData = [
              [current_Email, req.body.Gender, req.body.Birthday]
            ]
            return db.query('INSERT INTO member_detail (Email, Gender, Birthday) VALUES ?', [memberData]);
          }
        }).then(function (rows) {
          result.status = "更新成功。"
          res.json({
            result: result
          })
        }).catch(function (error) {

          //logs out the error
          console.log(error);
        });
      }
    })
  }
}


function hashPassword(password) {
  let hashPassword = crypto.createHash('md5');;
  hashPassword.update(password);
  const rePassword = hashPassword.digest('hex');
  return rePassword;
}

function verifyToken(token) {
  let tokenResult = "";
  const time = Math.floor(Date.now() / 1000);
  return new Promise((resolve, reject) => {
    //判斷token是否正確
    if (token) {
      jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
          tokenResult = false;
          resolve(tokenResult);
          //token過期判斷
        } else if (decoded.exp <= time) {
          tokenResult = false;
          resolve(tokenResult);
          //若正確
        } else {
          tokenResult = decoded.data
          resolve(tokenResult);
        }
      })
    }
  });
}

module.exports = {
  register: register,
  checkEmailIsExist: checkEmailIsExist,
  login: login,
  updatePassword: updatePassword,
  updateProfile: updateProfile
};