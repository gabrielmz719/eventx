const express = require('express');
const router = express.Router();
const EventController = require('../controller/eventController');
const pdf = require('html-pdf');
const fs = require('fs');
const path = require('path');
const Event = require('../models/event'); // Importe seu modelo de evento

// Rota para exibir todos os eventos
router.get('/', EventController.getAllEvents);

// Rota para exibir o formulário de criação de evento
router.get('/create', (req, res, next) => {
  const userId = req.session.userId; // Obtém o userId da sessão, assumindo que ele esteja configurado corretamente

  // Renderiza o formulário de criação de evento e passa userId para a view
  res.render('create-event', { userId: userId });
});

// Rota para lidar com o processo de criação de um novo evento
router.post('/create', EventController.createEvent);

// Rota para exibir os detalhes de um evento específico
router.get('/:id', EventController.getEventDetails);

// Rota para permitir que um usuário se registre para um evento
router.post('/:eventId/register', EventController.registerForEvent);

// Rota para renderizar a página de edição de evento
router.get('/:id/edit', EventController.renderEditEventPage);

// Rota para manipular a edição de evento
router.post('/:id/edit', EventController.editEvent);

// Rota para excluir um evento
router.post('/:id/delete', EventController.deleteEvent);

// Rota para desinscrever um usuário de um evento
router.post('/:eventId/unregister', EventController.unregisterFromEvent);

// Verifica se a pasta existe, caso contrário, cria a pasta
const pdfDir = path.join(__dirname, '../public/pdfs');
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir, { recursive: true });
}

// Rota para pré-visualizar o certificado antes de gerar
router.get('/:id/preview-certificate', async (req, res) => {
  const eventId = req.params.id;
  const event = await Event.findById(eventId).populate('participants.user');

  if (!event) {
    return res.status(404).send('Evento não encontrado');
  }

  // Encontrando o participante do evento (pode ser alterado conforme a lógica)
  const participant = event.participants.find(p => p.user._id.toString() === req.session.userId.toString());
  
  if (!participant) {
    return res.status(404).send('Participante não encontrado');
  }

  const user = participant.user;

  // Gerar conteúdo HTML para pré-visualização do certificado
  const htmlContent = `
    <html>
      <head>
        <title>Certificado - ${event.title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
          }
          h1 {
            color: #4CAF50;
          }
          .content {
            font-size: 1.2rem;
            margin-top: 20px;
          }
          .footer {
            margin-top: 30px;
            font-size: 1rem;
            color: #888;
          }
        </style>
      </head>
      <body>
        <h1>Certificado de Conclusão</h1>
        <div class="content">
          <p>Certificamos que <strong>${user.username}</strong></p>
          <p>concluiu com sucesso o evento <strong>${event.title}</strong></p>
          <p>Realizado em: ${event.date.toLocaleDateString()}</p>
        </div>
        <div class="footer">
          <p>Organizador: ${event.organizer.username}</p>
        </div>

        <!-- Link para gerar o certificado -->
        <a href="/events/${event._id}/generate-certificate" class="btn btn-success">Gerar Certificado em PDF</a>
      </body>
    </html>
  `;

  res.send(htmlContent); // Exibe a pré-visualização
});


// **Nova rota para gerar certificados**
router.post('/:id/generate-certificates', async (req, res) => {
  const eventId = req.params.id;

  try {
    // Busca do evento e seus participantes
    const event = await Event.findById(eventId).populate('participants.user');
    if (!event) {
      return res.status(404).send('Evento não encontrado');
    }

    const certificatesPromises = event.participants.map(async (participant) => {
      const user = participant.user;

      // Gerar conteúdo HTML do certificado
      const htmlContent = `
        <html>
          <head>
            <title>Certificado - ${event.title}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 20px;
              }
              h1 {
                color: #4CAF50;
              }
              .content {
                font-size: 1.2rem;
                margin-top: 20px;
              }
              .footer {
                margin-top: 30px;
                font-size: 1rem;
                color: #888;
              }
            </style>
          </head>
          <body>
            <h1>Certificado de Conclusão</h1>
            <div class="content">
              <p>Certificamos que <strong>${user.username}</strong></p>
              <p>concluiu com sucesso o evento <strong>${event.title}</strong></p>
              <p>Realizado em: ${event.date.toLocaleDateString()}</p>
            </div>
            <div class="footer">
              <p>Organizador: ${event.organizer.username}</p>
            </div>
          </body>
        </html>
      `;

      // Gerar o PDF
      const filePath = `./public/pdfs/${event._id}-${user._id}.pdf`;
      
      // Gerando o PDF com html-pdf
      await new Promise((resolve, reject) => {
        pdf.create(htmlContent).toFile(filePath, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });

      // Atualizar o participante com o link do certificado
      participant.certificadoLink = `/pdfs/${event._id}-${user._id}.pdf`;
      await event.save();
    });

    // Espera a criação de todos os certificados
    await Promise.all(certificatesPromises);

    // Redireciona para a página do evento
    res.redirect(`/events/${event._id}`);

  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao gerar os certificados');
  }
});
router.get('/search', EventController.searchEvents);

module.exports = router;