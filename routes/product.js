var express = require('express');
var router = express.Router();

var db = require('../controllers/product')
/* 取得所有商品資料 */
router.get('/getAllProducts', db.getAllProducts);
/* 取得特定商品資料 */
router.get('/getProduct/:id', db.getProductById);
/* 刪除特定商品資料 */
router.delete('/deleteProduct/:id', db.deleteProductById);
/* 新增商品資料 */
router.post('/addProduct', db.addProduct);

module.exports = router;
