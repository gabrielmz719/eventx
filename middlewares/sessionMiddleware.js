const session = require('express-session');

const sessionMiddleware = session({
    secret: 'sua_chave_secreta_aqui',
    resave: false,
    saveUninitialized: true
});

module.exports = sessionMiddleware;