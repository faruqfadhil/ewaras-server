/**
 * Author : Faruq
 */
var mqtt = require('mqtt');
var mongoose = require('mongoose');
var config = require('./config/database');
var Perangkat = require("./model/perangkat.model");
var ObjectId = require('mongoose').Types.ObjectId;
var api = require("./services/Outapi");

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
        var event = new Date();
        var today = event.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
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
                kondisi: 1
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
