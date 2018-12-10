var express = require('express');
var router = express.Router();

var db = require('../controllers/users')

router.post('/sendData', db.sendData);
router.get('/', db.getAllData);

module.exports = router;
