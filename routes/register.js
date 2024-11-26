var express = require('express');
var router = express.Router();

/* Rota para renderizar a view de cadastro de usuário */
router.get('/register', function(req, res, next) {
  // Verificando se o usuário está logado
  const userId = req.session.userId || null; // Se houver um userId na sessão, significa que o usuário está logado

  // Mensagem de sucesso ou erro que será exibida na tela (exemplo de uso)
  const message = req.query.message || null; // Recebe uma mensagem de querystring, se houver

  // Renderiza a página de registro, passando userId e message para o template EJS
  res.render('register', { userId, message });
});

module.exports = router;
