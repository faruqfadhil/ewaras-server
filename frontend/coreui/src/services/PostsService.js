/**
 * created by Faruq
 * 13 dec 2018
 * develop for final project :)
 */
import axios from 'axios'
import { type } from 'os';
var Api = require("../services/Api")
export default {
  fetchPosts () {
    return axios.get(Api.deviceUrl()+'5ba50758e4dc4000191f0c99/detail', { 
        headers: { 
            Authorization:'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsicm9sZSI6ImluaXQiLCJwYXNzd29yZCI6ImluaXQiLCJ1c2VybmFtZSI6ImluaXQiLCJfX3YiOiJpbml0IiwiX2lkIjoiaW5pdCJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnsiX192Ijp0cnVlLCJyb2xlIjp0cnVlLCJwYXNzd29yZCI6dHJ1ZSwidXNlcm5hbWUiOnRydWUsIl9pZCI6dHJ1ZX0sIm1vZGlmeSI6e30sInJlcXVpcmUiOnt9fSwic3RhdGVOYW1lcyI6WyJyZXF1aXJlIiwibW9kaWZ5IiwiaW5pdCIsImRlZmF1bHQiLCJpZ25vcmUiXX0sImVtaXR0ZXIiOnsiX2V2ZW50cyI6e30sIl9ldmVudHNDb3VudCI6MCwiX21heExpc3RlbmVycyI6MH19LCJpc05ldyI6ZmFsc2UsIl9kb2MiOnsiX192IjowLCJyb2xlIjoyLCJwYXNzd29yZCI6IiQyYSQxMCRlSjdRYk1FL0lTREJlMVU1RXBkOTh1Szk5UUoxaUN5U0ovM1pSejNVaER0ZnBCbnVRcDVudSIsInVzZXJuYW1lIjoiYWludW4iLCJfaWQiOiI1YmExZDEzMDgwNWJmYzAwMTljNTkzMzIifSwiaWF0IjoxNTM3NjEwMDE5fQ.PHl8umAmyvNwU6DKpSvskbw5kqmD_HRUI0RmnyMj11g'
         } }); 
  },
  addPost(params){
    return axios.post(Api.userUrl()+'ptsignup',params)
  },
  loginPost(params){
    return axios.post(Api.userUrl()+'signin',params)
  },
  createCow(token,params){
    return axios.post(Api.sapiUrl()+'create',params,{
      headers:{
        Authorization:token
      }
    })
  },
  me(token){
    return axios.get(Api.userUrl()+'me',{
      headers:{
        Authorization:token
      }
    })
  },
  getSapi(token){
    return axios.get(Api.sapiUrl()+'showsapi',{
      headers:{
        Authorization:token
      }
    })
  },
  getAllSapi(token){
    return axios.get(Api.sapiUrl()+'sapi-show-all',{
      headers:{
        Authorization:token
      }
    })
  },
  getRequestedSapi(token){
    return axios.get(Api.sapiUrl()+'requested-sapi',{
      headers:{
        Authorization:token
      }
    })
  },
  getAllPeternak(token){
    return axios.get(Api.userUrl()+'alluser',{
      headers:{
        Authorization:token
      }
    })
  },
  getSapiDetail(token,id){
    return axios.get(Api.sapiUrl()+id+'/sapidetail',{
      headers:{
        Authorization:token
      }
    })
  },
  getDataToday(token, params){
    return axios.post(Api.sapiUrl()+'data-today',params,{
      headers:{
        Authorization:token
      }
    })
  },
  getDataInTime(token, params){
    return axios.post(Api.sapiUrl()+'data-in-time',params,{
      headers:{
        Authorization:token
      }
    })
  },
  getAllAttributes(){
    return axios.get(Api.intelligentUrl()+'all_attributes')
  },
  getAllLabel(){
    return axios.get(Api.intelligentUrl()+'all_label')
  },
  getAllDiagnoses(){
    return axios.get(Api.intelligentUrl()+'all_diagnoses')
  },
  getAllDiagnosesInTime(start,end){
    return axios.get(Api.intelligentUrl()+'all_diagnoses_in_time?start='+start+'&end='+end)
  },
  getDiagnoseBySapi(id_sapi){
    return axios.post(Api.intelligentUrl()+'diagnoses_by_sapi?sapi='+id_sapi)
  },
  getDiagnoseBySapiInTime(start,end,id_sapi){
    return axios.get(Api.intelligentUrl()+'diagnoses_by_sapi_in_time?start='+start+'&end='+end+'&sapi='+id_sapi)
  },
  getAllGejala(){
    return axios.get(Api.intelligentUrl()+'all_gejala')
  },
  getAllGejalaLimit(){
    return axios.get(Api.intelligentUrl()+'all_gejala_limit')
  },
  getAllGejalaInTime(start,end){
    return axios.get(Api.intelligentUrl()+'all_gejala_in_time?start='+start+'&end='+end)
  },
  getAllGejalaInTimeLimit(start,end){
    return axios.get(Api.intelligentUrl()+'all_gejala_in_time_limit?start='+start+'&end='+end)
  },
  getGejalaBySapi(id_sapi){
    return axios.post(Api.intelligentUrl()+'gejala_by_sapi?sapi='+id_sapi)
  },
  getGejalaBySapiLimit(id_sapi){
    return axios.post(Api.intelligentUrl()+'gejala_by_sapi_limit?sapi='+id_sapi)
  },
  getGejalaBySapiInTime(start,end,id_sapi){
    return axios.get(Api.intelligentUrl()+'gejala_by_sapi_in_time?start='+start+'&end='+end+'&sapi='+id_sapi)
  },
  getGejalaBySapiInTimeLimit(start,end,id_sapi){
    return axios.get(Api.intelligentUrl()+'gejala_by_sapi_in_time_limit?start='+start+'&end='+end+'&sapi='+id_sapi)
  },
  uploadDataTraining(params){
    return axios.post(Api.intelligentUrl()+'upload_training_data',params,{
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    })

  },
  testingData(params,id_sapi){
    return axios.post(Api.intelligentUrl()+'testing_data?sapi='+id_sapi,params)
  },
  getAllSolutions(){
    return axios.get(Api.intelligentUrl()+'all_solutions')
  },
  addSolution(params){
    return axios.post(Api.intelligentUrl()+'add_solution',params)
  }

}