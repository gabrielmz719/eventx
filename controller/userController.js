const User = require('../models/user');
const createError = require('http-errors');
const Event = require('../models/event');



const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Gerar hash da senha
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Criar o novo usuário com o hash da senha
    const newUser = await User.create({ username, email, passwordHash });

    req.session.userId = newUser._id;
   
    res.redirect('/');
  } catch (error) {
    // Tratar erros
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    // Verificar se o usuário está autenticado
    const userId = req.session.userId; // Obtenha o userId da sessão
    if (!userId) {
      return res.redirect('/login');
    }

    // Encontrar o usuário pelo ID
    const user = await User.findById(userId);

    // Verificar se o usuário existe
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Encontrar os eventos criados pelo usuário
    const userEvents = await Event.find({ organizer: userId });

    // Encontrar os eventos cadastrados pelo usuário
    const registeredEvents = await Event.find({ 'participants.user': userId });

    // Passar os eventos criados e cadastrados pelo usuário para o template de página
    res.locals.userId = userId; // Passa o userId para a visualização
    res.locals.userEvents = userEvents;
    res.locals.registeredEvents = registeredEvents;

    // Renderizar a página de perfil
    res.render('profile', { user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(200).json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};