const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config/development_config');
const formidable = require('formidable');
const fs = require('fs');

function getAllProducts(req, res, next) {
  var db = req.con;

  let result = {};

  db.getConnection().then(function () {
    return db.query('SELECT * FROM product');
  }).then(function (rows) {

    result.status = "success";
    result.data = rows;

    res.json({
      result: result
    })

  }).catch(function (error) {
    result.err = error;
    res.json({
      result: result
    })
    //logs out the error
    console.log(error);
  });
}

function getProductById(req, res, next) {
  var db = req.con;
  var id = req.params.id;

  let result = {};

  db.getConnection().then(function () {
    return db.query('SELECT * FROM product WHERE Id = ?', id);
  }).then(function (rows) {

    result.status = "success";
    result.data = rows[0];

    res.json({
      result: result
    })

  }).catch(function (error) {
    result.err = error;
    res.json({
      result: result
    })
    //logs out the error
    console.log(error);
  });
}

function deleteProductById(req, res, next) {
  var db = req.con;
  var id = req.params.id;

  let result = {};

  db.getConnection().then(function () {
    return db.query('DELETE FROM product WHERE Id = ?', id);
  }).then(function (rows) {

    result.status = "success"

    res.json({
      result: result
    })

  }).catch(function (error) {
    result.err = error;
    res.json({
      result: result
    })
    //logs out the error
    console.log(error);
  });
}

function addProduct(req, res, next) {
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
        const form = new formidable.IncomingForm();
        form.parse(req, async function (err, fields, files) {
          // 確認檔案大小是否小於5MB
          if (checkFileSize(files.Img.size) === true) {
            res.json({
              result: {
                status: "上傳檔案失敗。",
                err: "請上傳小於5MB的檔案"
              }
            })
            return;
          }
          if (checkFileType(files.Img.type) === true) {
            // res.json({
            //   Email: current_Email,
            //   Avatar: files.Avatar
            // })
            const image = await fileToBase64(files.Img.path);

            const productData = {
              Name: fields.Name,
              Price: fields.Price,
              Quantity: fields.Quantity,
              Img: image
            }
            console.log(productData);
            db.query('INSERT INTO product SET ?', productData, function (err, rows) {
              if (err) {
                console.log(err);
                result.status = " 新增失敗。"
                result.err = "伺服器錯誤，請稍後在試！"
                res.json({
                  result: err
                })
              } else {
                result.status = "success。"
                result.product = productData;
                res.json({
                  result: result
                })
              }
            })
          }
        })
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
//判斷檔案大小
function checkFileSize(fileSize) {
  var maxSize = 5 * 1024 * 1024; //1MB
  if (fileSize > maxSize) {
    return true;
  }
  return false;
}
//判斷型態是否符合jpg, jpeg, png
function checkFileType(fileType) {
  if (fileType === 'image/png' || fileType === 'image/jpg' || fileType === 'image/jpeg') {
    return true;
  }
  return false;
}
// 圖片轉base64
const fileToBase64 = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'base64', function (err, data) {
      resolve(data);
    })
  })
}

module.exports = {
  getAllProducts: getAllProducts,
  addProduct: addProduct,
  getProductById: getProductById,
  deleteProductById: deleteProductById
};