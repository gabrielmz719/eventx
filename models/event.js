const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
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
      required: true,
      validate: {
        validator: function(value) {
          return value > Date.now(); // A data deve ser maior que a data atual
        },
        message: 'A data do evento deve ser no futuro.'
      }
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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
          ref: 'User',
          required: true
        },
        role: {
          type: String,
          enum: ['organizer', 'speaker', 'attendee'],
          default: 'attendee'
        },
        attended: {
          type: Boolean,
          default: false
        },
        certificateReceived: {
          type: Boolean,
          default: false
        },
        certificadoLink: {
          type: String,
          default: null
        }
      }
    ]
  },
  {
    timestamps: true // Cria os campos createdAt e updatedAt automaticamente
  }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
