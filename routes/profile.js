const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');

// Rota para exibir o perfil do usuário
router.get('/', UserController.getUserProfile);

module.exports = router;