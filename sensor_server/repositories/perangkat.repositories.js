var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Perangkat = require("../models/perangkat.model");
const socketApp = require('../socket/socket-app');
var ObjectId = require('mongoose').Types.ObjectId;
// var peternakRepositories = require('../repositories/peternak.repositories');
// var ConnectRaspi = require('../services/ConnectRaspi');
var Constants = require('../services/Constants');

const perangkatRepositories = {
    emitStreamData : async(id)=>{
        let latestUpdate = await Perangkat.findById(id)
        if(latestUpdate){
            // emit to specific id perangkat
            socketApp.notifyDetailEwaras(id,latestUpdate)
            let perangkatEachDokter = await Perangkat.find({
                idDokter: latestUpdate.idDokter
            })
            if(perangkatEachDokter){
                // emit to all perangkat in dokter
                socketApp.notifyEwarasData(latestUpdate.idDokter,perangkatEachDokter)
                return latestUpdate
            }
            
        }else{
            return false
        }
        
    }

}
module.exports = perangkatRepositories