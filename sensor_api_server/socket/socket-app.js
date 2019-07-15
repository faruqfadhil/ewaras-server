let publicSocket = null;

const configure = function (io) {
    if (!isConfigured())
        publicSocket = io;
};

const isConfigured = function () {
    return publicSocket != null;
};

const createRefreshResponse = function (refresh) {
    return {
        refresh: refresh
    };
};

const emitEvent = function (eventName, body) {
    publicSocket.emit(eventName, body);
};
const notifyEwarasData = function(idDokter,data){
    emitEvent('/topic/ewaras/'+idDokter,data)
}
const notifyDetailEwaras = function(id,data){
    emitEvent('/topic/ewaras/detail/'+id,data)
}

module.exports = {
    configure,
    notifyEwarasData,
    notifyDetailEwaras
}