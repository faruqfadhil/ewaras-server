var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var userRepositories = require('../repositories/user.repositories');
var Token = require('../services/TokenAuthentication');
var Response = require('../services/Response');

//Simple version, without validation or sanitation
module.exports = {
  dokter_signup: async(req,res)=>{
    let response = new Response()
    if (!req.body.username || !req.body.password || !req.body.nama || !req.body.alamat || !req.body.telp) {
      response.setStatus(false)
      response.setMessage('Please pass the require form')
    }else{
      try{
        response.setData(await userRepositories.dokterSignup(req.body.username,req.body.password,req.body.nama,req.body.alamat,req.body.telp, req.body.role,req.body.sip))
      }catch (e) {
        response.setStatus(false)
        response.setMessage(e)
      }
      res.json(response)
    }
  },
  pasien_signup: async(req,res)=>{
    let response = new Response()
    if (!req.body.username || !req.body.password || !req.body.nama || !req.body.alamat || !req.body.telp) {
      response.setStatus(false)
      response.setMessage('Please pass the require form')
    }else{
      try{
        response.setData(await userRepositories.pasienSignup(req.body.username,req.body.password,req.body.nama,req.body.alamat,req.body.telp, req.body.role,req.body.nik))
      }catch (e) {
        response.setStatus(false)
        response.setMessage(e)
      }
      res.json(response)
    }
  },
  user_signup: async(req,res)=>{
    let response = new Response()
    if (!req.body.username || !req.body.password ) {
      response.setStatus(false)
      response.setMessage('Please pass the require form')
    }else{
      try{
        response.setData(await userRepositories.userSignup(req.body.username,req.body.password,req.body.role))
      }catch (e) {
        response.setStatus(false)
        response.setMessage(e)
      }
      res.json(response)
    }
  },
  pasien_enrol: async(req,res)=>{
    let response = new Response()
    let token = Token.authorizationToken(req.headers)
    if(token){
      try{
        response.setData(await userRepositories.pasienEnrol(req.body.idDokter,req.body.idPasien))
      }catch(e){
        response.setStatus(false)
        response.setMessage(e)
      }
      res.json(response)
    }else{
      res.json(response.unAuthorized())
    }
  },
  pasien_search: async(req,res)=>{
    let response = new Response()
    let token = Token.authorizationToken(req.headers)
    if(token){
      try{
        response.setData(await userRepositories.pasienSearch(req.body.nik))
      }catch(e){
        response.setStatus(false)
        response.setMessage(e)
      }
      res.json(response)
    }else{
      res.json(response.unAuthorized())
    }
  },
  pasien_unroll: async(req,res)=>{
    let response = new Response()
    let token = Token.authorizationToken(req.headers)
    if(token){
      try{
        response.setData(await userRepositories.pasienUnroll(req.body.idDokter,req.body.idPasien))
      }catch(e){
        response.setStatus(false)
        response.setMessage(e)
      }
      res.json(response)
    }else{
      res.json(response.unAuthorized())
    }
  },
  detail_pasien: async(req,res)=>{
    let response = new Response()
    let token = Token.authorizationToken(req.headers)
    if(token){
      try{
        response.setData(await userRepositories.detailPasien(req.body.idPasien))
      }catch(e){
        response.setStatus(false)
        response.setMessage(e)
      }
      res.json(response)
    }else{
      res.json(response.unAuthorized())
    }
  },
  all_pasien: async(req,res)=>{
    let response = new Response()
    let token = Token.authorizationToken(req.headers)
    if(token){
      try{
        response.setData(await userRepositories.allPasien())
      }catch(e){
        response.setStatus(false)
        response.setMessage(e)
      }
      res.json(response)
    }else{
      res.json(response.unAuthorized())
    }
  },
  all_pasien_pending: async(req,res)=>{
    let response = new Response()
    let token = Token.authorizationToken(req.headers)
    if(token){
      try{
        response.setData(await userRepositories.allPasienPending())
      }catch(e){
        response.setStatus(false)
        response.setMessage(e)
      }
      res.json(response)
    }else{
      res.json(response.unAuthorized())
    }
  },
  all_dokter: async(req,res)=>{
    let response = new Response()
    let token = Token.authorizationToken(req.headers)
    if(token){
      try{
        response.setData(await userRepositories.allDokter())
      }catch(e){
        response.setStatus(false)
        response.setMessage(e)
      }
      res.json(response)
    }else{
      res.json(response.unAuthorized())
    }
  },
  data_on_dokter: async(req,res)=>{
    let response = new Response()
    let token = Token.authorizationToken(req.headers)
    if(token){
      try{
        response.setData(await userRepositories.dataOnDokter(req.body.idDokter))
      }catch(e){
        response.setStatus(false)
        response.setMessage(e)
      }
      res.json(response)
    }else{
      res.json(response.unAuthorized())
    }
  },
  dokter_enrolling: async(req,res)=>{
    let response = new Response()
      try{
        response.setData(await userRepositories.dokterEnrolling(req.body.idPasien))
      }catch(e){
        response.setStatus(false)
        response.setMessage(e)
      }
      res.json(response)
    
  },
  // user_signup: async(req,res)=>{
  //   let response = new Response()
  //   try{
  //     let result = await userRepositories.userSignup(req.body.username,req.body.password,req.body.role)
  //     if(result){
  //       response.setData(result)
  //     }else{
  //       response.setStatus(false)
  //       response.setMessage("Gagal")
  //     }
  //   }catch (e){
  //     response.setStatus(false)
  //     response.setMessage(e)
  //   }
  //   res.json(response)
  // },
  signin: async(req,res)=>{
    let response = new Response()
    try{
      let result = await userRepositories.signin(req.body.username,req.body.password)
      if(result){
        response.setData(result)
      }else{
        response.setStatus(false)
        response.setMessage("Invalid username or password")
      }
    }catch (e){
      response.setStatus(false)
      response.setMessage(e)
    }
    res.json(response)
  },
  // user_delete:async(req,res)=>{
  //   let response = new Response()
  //   let token = Token.authorizationToken(req.headers)
  //   if(token){
  //     try{
  //       response.setData(await userRepositories.userDelete(req.params.id))
  //     }catch(e){
  //       response.setStatus(false)
  //       response.setMessage(e)
  //     }
  //     res.json(response)
  //   }else{
  //     res.json(response.unAuthorized())
  //   }
  // },
  // user_update:async(req,res)=>{
  //   let response = new Response()
  //   let token = Token.authorizationToken(req.headers)
  //   if(token){
  //     try{
  //       response.setData(await userRepositories.userUpdate(req.params.id))
  //     }catch(e){
  //       response.setStatus(false)
  //       response.setMessage(e)
  //     }
  //     res.json(response)
  //   }else{
  //     res.json(response.unAuthorized())
  //   }
  // },
  pasien_profile: async(req,res)=>{
    let response = new Response()
    let token = Token.authorizationToken(req.headers)
    if(token){
      let result_decode = jwt.verify(token, config.secret)
      try{
        response.setData(await userRepositories.profile(result_decode._doc._id))
      }catch(e){
        response.setStatus(false)
        response.setMessage(e)
      }
      res.json(response)
    }else{
      res.json(response.unAuthorized())
    }
  },
  dokter_profile: async(req,res)=>{
    let response = new Response()
    let token = Token.authorizationToken(req.headers)
    if(token){
      let result_decode = jwt.verify(token, config.secret)
      try{
        response.setData(await userRepositories.dokterProfile(result_decode._doc._id))
      }catch(e){
        response.setStatus(false)
        response.setMessage(e)
      }
      res.json(response)
    }else{
      res.json(response.unAuthorized())
    }
  }
  // all_peternak: async(req,res)=>{
  //   let response = new Response()
  //   let token = Token.authorizationToken(req.headers)
  //   if(token){
  //     try{
  //       response.setData(await userRepositories.getAllPeternak())
  //     }catch(e){
  //       response.setStatus(false)
  //       response.setMessage(e)
  //     }
  //     res.json(response)
  //   }else{
  //     res.json(response.unAuthorized())
  //   }
  // }
}
