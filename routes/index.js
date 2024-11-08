var express = require('express');
var router = express.Router();
const Event = require('../models/event'); // Importe seu modelo de evento

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const events = await Event.find(); // Encontre todos os eventos no banco de dados
    res.render('index', { events, userId: req.session.userId }); // Passe os eventos e o userId para o template
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/logout', function(req, res) {
  // Limpar informações de sessão
  req.session.destroy(function(err) {
      if (err) {
          return res.status(500).json({ message: 'Erro ao fazer logout' });
      }
      // Redirecionar para a página inicial ou outra página de sua escolha
      res.redirect('/');
  });
});


module.exports = router;
