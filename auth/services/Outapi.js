const axios = require('axios');
var Api = require("../services/url")
const OutApi = {
    perangkatRegister: async(data)=>{
        let result = await axios.post(Api.perangkatUrl()+'register', {
            idPasien: data
          })
        return result
    },
    dokterEnrolling: async(idPasien,idDokter)=>{
        let result = await axios.post(Api.perangkatUrl()+'dokter-enrolling', {
            idPasien: idPasien,
            idDokter: idDokter
          })
        return result
    }
}
module.exports = OutApi