var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PerangkatSchema = new Schema({
  idDokter :{
    type: Schema.Types.ObjectId
  },
  namaPasien: String,
  alamatPasien : String,
  noTelp : String,
  statusDevice : Number,
  data: [{
    tanggal:{ type: Date, default: Date.now },
    suhu:Number,
    jantung:Number,
    spo: Number,
    kondisi: Number
  }]

});

module.exports = mongoose.model('Perangkat', PerangkatSchema);
