/**
 * Author : Faruq
 */
var mqtt = require('mqtt');
var mongoose = require('mongoose');
var config = require('./config/database');
var Perangkat = require("./model/perangkat.model");
var ObjectId = require('mongoose').Types.ObjectId;
var api = require("./services/Outapi");
var Constant = require('./services/Constant');

// comment this when no mongo DB installed on your server
mongoose.connect(config.database)

var topic = "ewarasTopic"
var client = mqtt.connect("mqtt://192.168.20.100", {
    username: "ewaras",
    password: "ewaras"
});
console.log("connected flag  " + client.connected);

//handle incoming messages
client.on('message', function (topic, message, packet) {
    console.log("message is " + message);
    console.log("topic is " + topic);
    var messagess = String(message)
    var payData = messagess.split("&")
    
    // comment this when no mongo DB installed on your server
    method.saveToDb(payData[0],payData[1],payData[2],payData[3])
});


client.on("connect", function () {
    console.log("connected  " + client.connected);
    client.subscribe(topic);
})
//handle errors
client.on("error", function (error) {
    console.log("Can't connect" + error);
    process.exit(1)
});

const method ={
    saveToDb: async(suhu,detak,spo,id)=>{
        var today = new Date();
        var tmpSuhu = Number(suhu)
        var tmpJantung = Number(detak)
        var tmpSpo = Number(spo)
        var tmpKondisi = Constant.NORMAL_CONDITION
        if (tmpJantung < Constant.HEARTRATE_LOWER_LIMIT || tmpJantung > Constant.HEARTRATE_UPPER_LIMIT || tmpSuhu < Constant.TEMPERATURE_LOWER_LIMIT || tmpSuhu > Constant.TEMPERATURE_UPPER_LIMIT || tmpSpo < Constant.SPO_LOWER_LIMIT || tmpSpo > Constant.SPO_UPPER_LIMIT) {
          // abnormal
          tmpKondisi = Constant.ABNORMAL_CONDITION
        }
        let result = await Perangkat.update({
            _id: new ObjectId(id)
          }, {
            $set: {
              'statusDevice': 1
            },
            $push: {
              'data': {
                tanggal: today,
                suhu: suhu,
                jantung: detak,
                spo:spo,
                kondisi: tmpKondisi
              }
            }
          }
        );
        if(result){
          let toServer = await api.uploadTo(id)
          if(toServer){
            console.log(toServer.data)
          }
            
        }else{
            console.log("update gagal")
        }
    }
}
