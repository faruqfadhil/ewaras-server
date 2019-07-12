var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var perangkatRepositories = require('../repositories/perangkat.repositories');
var Token = require('../services/TokenAuthentication');
var Response = require('../services/Response');

module.exports = {
  stream_data_update: async(req, res)=>{
    let response = new Response()
    try{
      response.setData(await perangkatRepositories.emitStreamData(req.body.id))
    }catch(e){
      response.setStatus(false)
      response.setMessage(e)
    }
    res.json(response) 
  }
}
