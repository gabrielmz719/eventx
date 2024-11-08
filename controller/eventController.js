const Event = require('../models/event');
const path = require('path');



exports.createEvent = async (req, res) => {
  try {
      const { title, type, description, date } = req.body;

      // Verificar se o usuário está autenticado
      if (!req.session.userId) {
          return res.status(401).json({ message: 'Usuário não autenticado' });
      }

      // Verificar se a imagem de capa foi enviada
      if (!req.file) {
          return res.status(400).json({ message: 'Imagem de capa não enviada' });
      }

      const coverImagePath = path.relative(path.join(__dirname, '..', 'public', 'uploads'), req.file.path);
    
      const organizer = req.session.userId;

      const newEvent = new Event({
          title,
          type,
          description,
          date,
          organizer,
          coverImage: coverImagePath
      });
      await newEvent.save();

      
      res.redirect('/');
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.renderEditEventPage = async (req, res) => {
  try {
    // Encontre o evento pelo ID fornecido na rota
    const event = await Event.findById(req.params.id);
    
    // Verifique se o usuário está autenticado
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    // Renderize a página de edição de evento, passando o evento encontrado e o userId
    res.render('editEvent', { event, userId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { title, type, description, date } = req.body;
    let updatedData = {
      title,
      type,
      description,
      date
    };

    // Verificar se há um novo arquivo de imagem enviado
    if (req.file) {
      const coverImagePath = path.relative(path.join(__dirname, '..', 'public', 'uploads'), req.file.path);
      updatedData.coverImage = coverImagePath;
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updatedData, { new: true });

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    res.redirect('/profile'); // Redireciona para a página de perfil ou outra página após a edição
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      // Se o evento não for encontrado, redirecione para a página de perfil
      return res.redirect('/profile');
    }
    // Se a exclusão for bem-sucedida, redirecione para a página de perfil
    return res.redirect('/profile');
  } catch (error) {
    // Em caso de erro, redirecione para a página de perfil
    return res.redirect('/profile');
  }
};
exports.getRecentEvents = async (req, res) => {
  try {
    // Recupere os eventos do banco de dados e ordene por data em ordem decrescente
    const events = await Event.find().sort({ date: -1 }).limit(3);

    // Renderize a visualização do carrossel passando os eventos para exibir
    res.render('carousel', { events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getEventDetails = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer');
    
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    
    const userId = req.session.userId;
    res.render('event-details', { event, userId }); // Renderiza uma view com os detalhes do evento
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.session.userId;

    // Verificar se o usuário está autenticado
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    // Encontrar o evento pelo ID
    const event = await Event.findById(eventId);

    // Verificar se o evento existe
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    // Verificar se o usuário já está registrado para o evento
    const alreadyRegistered = event.participants.some(participant => participant.user.equals(userId));
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Usuário já registrado para este evento' });
    }

    // Registrar o usuário para o evento
    event.participants.push({ user: userId });
    await event.save();

    // Redirecionar o usuário de volta para a página do evento
    res.redirect(`/events/${eventId}`);  // Substitua com a rota correta para a página de detalhes do evento

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.unregisterFromEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.session.userId;

    // Verificar se o usuário está autenticado
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    // Encontrar o evento pelo ID
    const event = await Event.findById(eventId);

    // Verificar se o evento existe
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    // Remover o usuário da lista de participantes
    event.participants = event.participants.filter(participant => !participant.user.equals(userId));
    await event.save();

    // Redirecionar o usuário de volta para a página do evento ou para o perfil
    res.redirect(`/events/${eventId}`);  // Substitua com a rota correta para a página de detalhes do evento

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.renderCreateEventPage = (req, res) => {
  const userId = req.session.userId; // Supondo que userId está disponível na sessão

  res.render('create-event', { userId: userId });
};
