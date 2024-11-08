const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Referencia o modelo User
    required: true
  },
  coverImage: {
    type: String,
    required: true
  },
  participants: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Referenciando o modelo de usuário
        required: true
      }
    }
  ]
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
