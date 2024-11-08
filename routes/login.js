var express = require('express');
var router = express.Router();
const authController = require('../controller/authController');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.get('/logout', function(req, res) {
 
  req.session.destroy(function(err) {
      if (err) {
          return res.status(500).json({ message: 'Erro ao fazer logout' });
      }
      res.redirect('/login');
  });
});


router.post('/', authController.login);

module.exports = router;
