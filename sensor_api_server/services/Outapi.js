const axios = require('axios');
var Api = require("../services/url")
const OutApi = {
    getEnrolling: async(data)=>{
        let result = await axios.post(Api.authUrl()+'dokter/dokter-enrolling', {
            idPasien: data
          })
        return result
    }
}
module.exports = OutApi