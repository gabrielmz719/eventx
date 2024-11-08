const User = require('../models/user');
const bcrypt = require('bcrypt');
const createError = require('http-errors');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        req.session.userId = user._id;
        res.redirect('/');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
