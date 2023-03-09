var path = require('path');
const { log } = require('../configs/logging');
var fs = require('fs');



let types = {
    'image':'jpg',
    'video':'mp4',
    'audio':'mp3',

}

function generateFileName(userId,mediaId,type){
    let typeExtention = types[type];
    if (typeExtention == null){
        log(`Error: Type "${type}" not in list.`);
        return null;
    }else{
        return 'U'+userId.toString()+'#'+mediaId.toString()+'.'+typeExtention;
    }
}

let dir = __dirname+'../../public/files';
function fileDirInit(){
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }   
}

function saveFile(fileName,file){
    fs.writeFile(dir+'/'+fileName,file.data,(e)=>{
        if(e){
            log("Didn't work because of:");
            log(e);
            return false;
        }else{                    
            log(`File "${fileName}" saved in "${dir}"`);
            return true;
        }
    });
}


module.exports = {
    generateFileName: generateFileName,
    saveFile: saveFile,
    fileDirInit: fileDirInit,
}