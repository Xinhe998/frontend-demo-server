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
 * @apiParam  {String} Name  會員名稱
 *
 *  @apiExample {js} Example usage:
  * const data = {
  *   "Email": "xxx@gmail.com",
  *   "Password": "xxxxxx",
  *   "Name": "Demo"
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
router.post('/login', db.login);
/* 修改密碼 */
router.post('/updatePassword', db.updatePassword);
/* 修改會員資料 */
router.post('/updateProfile', db.updateProfile);
/* 修改會員大頭貼 */
router.post('/updateAvatar', db.updateAvatar);

module.exports = router;
