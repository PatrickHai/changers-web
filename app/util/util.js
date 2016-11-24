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

exports.formatUseNotes = function(use_note){
  if(!use_note.startsWith('===')) return;
  let arr = use_note.split('===');
  arr.splice(0, 1);
  let keys = [];
  let values = [];
  if(arr.length % 2 !== 0) return;
  arr.forEach(function(data, index){
    if(index % 2 === 0){
      keys.push(data);
    }else{
      values.push(data);
    }
  });
  let finals = [];
  keys.forEach(function(d, i){
    let obj = {};
    obj.key = d;
    let list = values[i].split('\r\n');
    list.pop();
    list.shift();
    obj.values = list;
    finals.push(obj);
  });
  return finals;
}