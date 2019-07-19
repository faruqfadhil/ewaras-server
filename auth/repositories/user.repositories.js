var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var User = require("../models/user");
var Dokter = require("../models/dokter.model");
var Pasien = require("../models/pasien.model");
var bcrypt = require('bcrypt-nodejs');
var api = require("../services/Outapi");
var ObjectId = require('mongoose').Types.ObjectId;

const userRepositories = {
    dokterSignup: async(username,password,nama,alamat,telp,role,sip)=>{
        let newUser = new User({
            username: username,
            password: password,
            role: role
        });
        let saveUser = await newUser.save()
        if(saveUser){
            let newDokter = new Dokter({
                idUser: saveUser._id,
                sip:sip,
                nama: nama,
                alamat: alamat,
                noTelp: telp
            })
            let saveDokter = await newDokter.save()
            if(saveDokter){
                return saveDokter
            }
        }
    },
    pasienSignup: async(username,password,nama,alamat,telp,role,nik)=>{
        let newUser = new User({
            username: username,
            password: password,
            role: role
        });
        let saveUser = await newUser.save()
        if(saveUser){
            let newPasien = new Pasien({
                idUser: saveUser._id,
                nik:nik,
                nama: nama,
                alamat: alamat,
                noTelp: telp
            })
            let savePasien = await newPasien.save()
            if(savePasien){
                let newPerangkat = await api.perangkatRegister(savePasien._id)
                if(newPerangkat.data){
                    return savePasien
                }else{
                    return false
                }
                
            }else{
                return false
            }
        }else{
            return false
        }
    },
    pasienEnrol : async(idDokter,idPasien)=>{
        let result = await Dokter.update({
            _id: new ObjectId(idDokter)
          }, {
            $push: {
              'pasienEnrol': {
                idPasien: new ObjectId(idPasien)
              }
            }
          }
        )
        if(result){
            let toPerangkat = await api.dokterEnrolling(idPasien,idDokter)
            if(toPerangkat.data){
                return result
            }else{
                return false
            }
            
        }else{
            return false
        }
    },
    detailPasien: async(idPasien)=>{
        let result = await Pasien.aggregate(
            [
                {
                  '$match': {
                    '_id': new ObjectId(idPasien)
                  }
                }, {
                  '$lookup': {
                    'from': 'perangkats', 
                    'localField': '_id', 
                    'foreignField': 'idPasien', 
                    'as': 'perangkats_docs'
                  }
                }, {
                  '$project': {
                    'identifier': 'pasien', 
                    'pasien_docs': [
                      {
                        '_id': '$_id', 
                        'idUser': '$idUser', 
                        'nik': '$nik', 
                        'nama': '$nama', 
                        'alamat': '$alamat', 
                        'noTelp': '$noTelp'
                      }
                    ], 
                    'perangkats_docs': '$perangkats_docs'
                  }
                }
            ]
        )
        if(result){
            return result
        }else{
            return false
        }
        
    },
    signin: async(username,password)=>{
        let user = await User.findOne({
            username: username
        })
        if(user){
            if(bcrypt.compareSync(password, user.password)){
                let token = jwt.sign(user,config.secret)
                let newUserObj = {
                    _id: user._id,
                    username: user.username,
                    password: user.password,
                    role: user.role,
                    token: 'JWT ' + token
                }
                return newUserObj
            }else{
                return false
            }
        }else{
            return false
        }
    },
    pasienSearch: async(nik)=>{
        let result = await Pasien.find({
            nik:nik
        })
        if(result){
            return result
        }else{
            return false
        }
    },
    pasienUnroll: async(idDokter,idPasien)=>{
        let result = await Dokter.update({
            _id: new ObjectId(idDokter)
          }, {
            $pull: {
              'pasienEnrol': {
                idPasien: new ObjectId(idPasien)
              }
            }
          }
        )
        if(result){
            let toPerangkat = await api.dokterUnroll(idDokter,idPasien)
            if(toPerangkat.data){
                return result
            }else{
                return false
            }
            
        }else{
            return false
        }
    },
    profile:async(idUser)=>{
        let result = await Pasien.findOne({
            idUser:idUser
        })
        if(result){
            return result
        }else{
            return false
        }
        
    },
    dokterProfile:async(idUser)=>{
        let result = await Dokter.findOne({
            idUser:idUser
        })
        if(result){
            return result
        }else{
            return false
        }
        
    },
    dokterEnrolling: async(idPasien)=>{
        let result = await Dokter.aggregate(
            [
                {
                  '$unwind': {
                    'path': '$pasienEnrol', 
                    'includeArrayIndex': 'arrayIndex', 
                    'preserveNullAndEmptyArrays': false
                  }
                }, {
                  '$match': {
                    'pasienEnrol.idPasien': new ObjectId(idPasien)
                  }
                }
              ]
        )
        if(result){
            return result
        }else{
            return false
        }
        
    },
    dataOnDokter: async(idDokter)=>{
        let result = await Dokter.aggregate(
            [
                {
                  '$match': {
                    '_id': new ObjectId(idDokter)
                  }
                }, {
                  '$unwind': {
                    'path': '$pasienEnrol', 
                    'includeArrayIndex': 'arrayIndex', 
                    'preserveNullAndEmptyArrays': false
                  }
                }, {
                  '$lookup': {
                    'from': 'perangkats', 
                    'localField': 'pasienEnrol.idPasien', 
                    'foreignField': 'idPasien', 
                    'as': 'perangkat_docs'
                  }
                }, {
                  '$lookup': {
                    'from': 'pasiens', 
                    'localField': 'pasienEnrol.idPasien', 
                    'foreignField': '_id', 
                    'as': 'pasien_docs'
                  }
                }
            ]
        )
        if(result){
            return result
        }else{
            return false
        }
        
    }
}
module.exports = userRepositories