var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PasienSchema = new Schema({
  idUser: {
    type: Schema.Types.ObjectId,
  },
  nik: {
    type: String,
    required: true
  },
  nama: {
    type: String,
    required: true
  },
  alamat: {
    type: String,
    required: true
  },
  noTelp: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Pasien', PasienSchema);
