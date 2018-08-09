var express = require('express');
var router = express.Router();

var db = require('../controllers/users')
/* 註冊 */
router.post('/register', db.register);
/* 檢查Email重複 */
router.post('/checkEmailIsExist', db.checkEmailIsExist)
/* 登入 */
router.post('/login', db.login);
/* 修改密碼 */
router.post('/updatePassword', db.updatePassword);
/* 修改會員資料 */
router.post('/updateProfile', db.updateProfile);

module.exports = router;
