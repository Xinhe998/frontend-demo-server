var express = require('express');
var router = express.Router();

var db = require('../controllers/order')
/* 訂購 */
router.post('/', db.order);
/* 出貨 */
router.post('/ship/:id', db.ship);

module.exports = router;
