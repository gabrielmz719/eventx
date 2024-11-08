var express = require('express');
var router = express.Router();
var userController = require("../controller/userController");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/register', userController.createUser);

module.exports = router;
