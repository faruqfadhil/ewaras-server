const axios = require('axios');
var Api = require("../services/url")
const OutApi = {
    uploadTo: async(data)=>{
        let result = await axios.post(Api.perangkatUrl()+'stream', {
            id: data
          })
        return result
    }
}
module.exports = OutApi