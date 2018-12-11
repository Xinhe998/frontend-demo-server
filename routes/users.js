var express = require('express');
var router = express.Router();

var db = require('../controllers/users')

router.post('/sendData', db.sendData);
router.post('/getData', db.getData);
router.get('/', db.renderIndex);

module.exports = router;
