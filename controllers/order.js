const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config/development_config');
const formidable = require('formidable');
const fs = require('fs');
const nodemailer = require('nodemailer');

//訂購
async function order(req, res, next) {
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

        const orderData = {
          Customer_Id: current_Email,
          Product_Id: req.body.Product_Id,
          Order_Quantity: req.body.Order_Quantity,
          Is_Complete: false
        }
        db.query('INSERT INTO order_list SET ?', orderData, async function (err, rows) {
          if (err) {
            console.log(err);
            result.status = " 訂購失敗。"
            result.err = "伺服器錯誤，請稍後在試！"
            res.json({
              result: err
            })
          } else {
            const memberData = await getMemberData(req, current_Email);
            console.log(memberData);
            order_sendMail(memberData);
            result.status = "success。"
            result.data = orderData;
            res.json({
              result: result
            })
          }
        })
      }
    })
  }
}
//出貨
function ship(req, res, next) {
  var db = req.con;
  const token = req.headers['token'];
  var id = req.params.id;  //訂單ID

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
        db.getConnection().then(function () {
          return db.query('SELECT * FROM order_list WHERE Id = ?', id);
        }).then(function (rows) {
          // console.log(rows);
          db.query('UPDATE product SET Quantity = Quantity - ? WHERE Id = ?', [rows[0].Order_Quantity, rows[0].Product_Id]);
          return db.query('SELECT * FROM product WHERE Id = ?', rows[0].Product_Id);
        }).then(function (rows) {
          // console.log(rows);
          result.status = "出貨成功，產品庫存量：" + rows[0].Quantity;
          res.json({
            result: result
          })
        });
      }
    })
  }
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

function order_sendMail(memberData) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.senderMail.user, //gmail account
      pass: config.senderMail.password //gmail password
    }
  })
  const mailOptions = {
    from: `"Xinhe" <${config.senderMail.user}>`, // 寄信
    to: memberData.Email, // 收信
    subject: memberData.Name + '您好，您所購買的訂單已經完成。',  // 主旨
    html: `<p>Hi, ${memberData.Name} </p>` + `<br>` + `<br>` + `<span>感謝您的訂購，歡迎下次再來！</span>` // 內文
  }
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.log(err);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  })
}

const getMemberData = (req, current_Email) => {
  return new Promise((resolve, reject) => {
    var db = req.con;
    db.getConnection().then(function () {
      return db.query('SELECT * FROM member WHERE Email = ?', current_Email);
    }).then(function (rows) {
      resolve(rows[0])
    });
  })
}

module.exports = {
  order: order,
  ship: ship
};