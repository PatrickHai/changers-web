var config = require('../../config-properties')
exports.generateImgUrl = function(banner){
    if(!banner && banner.length < 6) return
    let folders = banner.substr(0,6)
    let f1 = folders.substr(0,2)
    let f2 = folders.substr(2,2)
    let f3 = folders.substr(4,2)
    let path = f1+'/'+f2+'/'+f3+'/'
    return config.imgBase + path + banner
} 