var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DokterSchema = new Schema({
  idUser: {
    type: Schema.Types.ObjectId,
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
  },
  pasienEnrol:[{
    idPasien:{
      type: Schema.Types.ObjectId
    }
  }]
});

module.exports = mongoose.model('Dokter', DokterSchema);
