const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config/development_config');
const formidable = require('formidable');
const fs = require('fs');

function sendData(req, res, next) {
  var db = req.con;
  let result = {};

  const data = {
    sid: req.body.sid,
    name: req.body.name,
    gender: req.body.gender,
    class: req.body.class,
    desc: req.body.desc,
    avatar: req.body.avatar
  }
  //console.log(req.body);
  db.query('INSERT INTO data SET ?', data, function (err, rows) {
    if (err) {
      console.log(err);
      result.status = "失敗。"
      result.err = "伺服器錯誤，請稍後再試！"
      res.json({
        result: err
      })
    } else {
      result.status = "success"
      result.data = data;
      res.json({
        result: result
      })
    }
  })
}

function renderIndex(req, res, next) {
    res.render('index');
}

function getData(req, res, next) {
  var db = req.con;
  let result = {};

  //console.log(req.body);
  db.query('SELECT * FROM data', function (err, rows) {
    if (err) {
      console.log(err);
      result.status = "失敗。"
      result.err = "伺服器錯誤，請稍後再試！"
      res.json({
        result: err
      })
    } else {
      result.status = "success"
      result.data = rows;
      res.json({
        result: result
      })
    }
  })
}


module.exports = {
  sendData: sendData,
  renderIndex: renderIndex,
  getData: getData
};