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
            socketApp.notifyEwarasData(id,latestUpdate)
            return latestUpdate
        }else{
            return false
        }
        
    }

}
module.exports = perangkatRepositories