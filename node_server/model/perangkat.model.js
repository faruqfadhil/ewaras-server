var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PerangkatSchema = new Schema({
  idPasien :{
    type: Schema.Types.ObjectId
  },
  dokterEnrolling:[{
    idDokter: {
      type: Schema.Types.ObjectId
    }
  }],
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
