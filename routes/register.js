var express = require('express');
var router = express.Router();

// Rota para renderizar a view de cadastro de usuário
router.get('/register', function(req, res, next) {
  res.render('register');
});

module.exports = router;