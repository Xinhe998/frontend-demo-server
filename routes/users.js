var express = require('express');
var router = express.Router();

var db = require('../controllers/users')
/* 註冊 */
/**
 * @api {post} /users/register register
 * @apiName register
 * @apiGroup User
 * @apiVersion 0.1.0
 * @apiPermission none
 *
 * @apiParam  {String} Email 會員Email
 * @apiParam  {String} Password  會員密碼
 * @apiParam  {String} Name  會員姓名
 * @apiParam  {Blob} Name  會員大頭貼
 *
 *  @apiExample {js} Example usage:
  * const data = {
  *   "Email": "xxx@gmail.com",
  *   "Password": "xxxxxx",
  *   "Name": "Demo"
  *   "Avatar": ""
  * }
  *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "result": {
 *          "status": "註冊成功。",
 *           "member": {
 *              "Email": "xxx@gmail.com",
 *              "Password": "1263f6273c4384121a70f2b891691d72",
 *              "Name": "Demo"
 *           }
 *        }
 *     }
 *
 */
router.post('/register', db.register);


/* 檢查Email重複 */
router.post('/checkEmailIsExist', db.checkEmailIsExist)


/* 登入 */
/**
 * @api {post} /users/login login
 * @apiName login
 * @apiGroup User
 * @apiVersion 0.1.0
 * @apiPermission none
 *
 * @apiParam  {String} Email 會員Email
 * @apiParam  {String} Password  會員密碼
 *
 *  @apiExample {js} Example usage:
  * const data = {
  *   "Email": "xxx@gmail.com",
  *   "Password": "xxxxxx"
  * }
  *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "result": {
 *          "status": "登入成功。"
 *        }
 *     }
 *
 */
router.post('/login', db.login);


/* 修改密碼 */
/**
 * @api {post} /users/updatePassword updatePassword
 * @apiName updatePassword
 * @apiGroup User
 * @apiVersion 0.1.0
 * @apiPermission none
 *
 * @apiParam  {String} oldPassword 舊密碼
 * @apiParam  {String} newPassword 新密碼
 *
 * @apiHeaderExample {json} Header Example: 
    * {
    *   "token": "Bearer token"
    *  }
    * 
 *  @apiExample {js} Example usage:
  * const data = {
  *   "oldPassword": "xxxxxx",
  *   "newPassword": "zzzzzz",
  * }
  *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "result": {
 *          "status": "更新成功。"
 *        }
 *     }
 *
 */
router.post('/updatePassword', db.updatePassword);


/* 修改會員資料 */
router.post('/updateProfile', db.updateProfile);


/* 修改會員大頭貼 */
router.post('/updateAvatar', db.updateAvatar);

module.exports = router;
