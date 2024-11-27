var express = require('express');
var router = express.Router();
var userController = require("../controller/userController");

// Rota para o registro de usuários (GET)
router.get('/register', function(req, res, next) {
  // Verifica se o usuário já está logado
  const userId = req.session.userId;

  if (userId) {
    // Se já estiver logado, redireciona para a página principal ou outra página desejada
    return res.redirect('/');
  }

  // Se não estiver logado, renderiza a página de registro
  res.render('register', { userId: userId }); // Passando userId para a navbar
});

// Rota para criar o usuário (POST)
router.post('/register', userController.createUser);

module.exports = router;
