var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Perangkat = require("../models/perangkat.model");
const socketApp = require('../socket/socket-app');
var ObjectId = require('mongoose').Types.ObjectId;
var api = require("../services/Outapi");
var Constants = require('../services/Constants');

const perangkatRepositories = {
    emitStreamData : async(id)=>{
        let latestUpdate = await Perangkat.findById(id)
        if(latestUpdate){
            // emit to specific id perangkat
            let connectWith = await Perangkat.aggregate(
              [
                {
                  '$match': {
                    '_id': new ObjectId(id)
                  }
                }, {
                  '$lookup': {
                    'from': 'pasiens', 
                    'localField': 'idPasien', 
                    'foreignField': '_id', 
                    'as': 'pasien_docs'
                  }
                }, {
                  '$project': {
                    'idntifier': 'perangkat', 
                    'pasien_docs': '$pasien_docs', 
                    'perangkats_docs': [
                      {
                        '_id': '$_id', 
                        'idPasien': '$idPasien', 
                        'statusDevice': '$statusDevice', 
                        'data': '$data', 
                        'dokterEnrolling': '$dokterEnrolling'
                      }
                    ]
                  }
                }
              ]
            )
            socketApp.notifyDetailEwaras(id,connectWith)

            //emit to dokter enrolling
            for(var i=0;i<latestUpdate.dokterEnrolling.length;i++){
                let perangkats = await Perangkat.aggregate(
                    [
                      {
                        '$match': {
                          'dokterEnrolling.idDokter': new ObjectId(latestUpdate.dokterEnrolling[i].idDokter)
                        }
                      }, {
                        '$lookup': {
                          'from': 'pasiens', 
                          'localField': 'idPasien', 
                          'foreignField': '_id', 
                          'as': 'pasien_docs'
                        }
                      }, {
                        '$project': {
                          'identifier': 'pasien', 
                          'perangkat_docs': [
                            {
                              '_id': '$_id', 
                              'idPasien': '$idPasien', 
                              'statusDevice': '$statusDevice', 
                              'data': '$data', 
                              'dokterEnrolling': '$dokterEnrolling'
                            }
                          ], 
                          'pasien_docs': '$pasien_docs'
                        }
                      }
                    ]
                )
                socketApp.notifyEwarasData(latestUpdate.dokterEnrolling[i].idDokter,perangkats)
            }
            return latestUpdate
            // let dokters = await api.getEnrolling(latestUpdate.idPasien)
            // if(dokters){
            //     for(var i=0;i<dokters.data.length;i++){
            //         socketApp.notifyEwarasData(dokters.data._id,perangkatEachDokter)
            //     }
            //     return dokters.data
            // }
            // let perangkatEachDokter = await Perangkat.find({
            //     idDokter: latestUpdate.idDokter
            // })
            // if(perangkatEachDokter){
            //     // emit to all perangkat in dokter
            //     socketApp.notifyEwarasData(latestUpdate.idDokter,perangkatEachDokter)
            //     return latestUpdate
            // }
            
        }else{
            return false
        }
        
    },
    perangkatRegister: async(idPasien)=>{
        var today = new Date();
        let newPerangkat = new Perangkat({
            idPasien: idPasien,
            statusDevice: Constants.DEVICE_PENDING,
            data:[{
                tanggal: today,
                suhu: 0,
                jantung: 0,
                spo: 0,
                kondisi: Constants.ABNORMAL_CONDITION
            }]
        });
        let savePerangkat = await newPerangkat.save()
        if(savePerangkat){
            return savePerangkat
        }else{
            return false
        }
    },
    dokterEnrolling : async(idDokter,idPasien)=>{
        let result = await Perangkat.update({
            idPasien: new ObjectId(idPasien)
          }, {
            $push: {
              'dokterEnrolling': {
                idDokter: new ObjectId(idDokter)
              }
            }
          }
        )
        if(result){
            return result
        }else{
            return false
        }
    },
    dokterUnroll: async(idDokter,idPasien)=>{
        let result = await Perangkat.update({
            idPasien: new ObjectId(idPasien)
          }, {
            $pull: {
              'dokterEnrolling': {
                idDokter: new ObjectId(idDokter)
              }
            }
          }
        )
        if(result){
            return result
        }else{
            return false
        }
    }


}
module.exports = perangkatRepositories