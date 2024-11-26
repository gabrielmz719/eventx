var express = require('express');
var router = express.Router();
const authController = require('../controller/authController');

/* GET home page. */
router.get('/', function(req, res, next) {
  // Verificando se o usuário está logado
  const userId = req.session.userId || null; // Se houver um userId na sessão, significa que o usuário está logado

  // Renderizando a página de login, passando userId para o template EJS
  res.render('login', { userId });
});

router.get('/logout', function(req, res) {
  // Destruir a sessão do usuário para fazer o logout
  req.session.destroy(function(err) {
    if (err) {
      return res.status(500).json({ message: 'Erro ao fazer logout' });
    }
    // Após o logout, redireciona para a página de login
    res.redirect('/login');
  });
});

// Endpoint de login via POST
router.post('/', authController.login);

module.exports = router;
