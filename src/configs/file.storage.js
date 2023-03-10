var path = require('path');
const { log } = require('../configs/logging');
var fs = require('fs');
const {redisCli} = require('../configs/redis');


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
            log("saveFile didn't work because of:");
            log(e);
            return false;
        }else{                    
            log(`File "${fileName}" saved in "${dir}"`);
            return true;
        }
    });
}
function deleteFile(fileName){
    var filePath = dir+fileName; 
    fs.unlink(filePath);
}

function saveDataAsFilename(data,fileName){
    fs.writeFile(dir+'/'+fileName,data,(e)=>{
        if(e){
            log("saveDataAsFilename didn't work because of:");
            log(e);
            return false;
        }else{                    
            log(`File "${fileName}" saved in "${dir}"`);
            return true;
        }
    });
}


function numberToName(num){//this should eventually be some form of hash
    return num.toString;
}
function getNewAccountMediaJsonFileName(){
    redisCli.get('accountMediaJsonFileName',(err,data)=>{
        if (err){
            log(err);
        }
        if (data != null){
            let num = parseInt(data);
            num ++;
            regisCli.set('accountMediaJsonFileName',num);
            return numberToName(num);
        }else{
            regisCli.set('accountMediaJsonFileName',0);
            return numberToName(0);
        }
    });
}

function getNewAccountMediaZipFileName(){
    redisCli.get('accountMediaZipFileName',(err,data)=>{
        if (err){
            log(err);
        }
        if (data != null){
            let num = parseInt(data);
            num ++;
            regisCli.set('accountMediaZipFileName',num);
            return numberToName(num);
        }else{
            regisCli.set('accountMediaZipFileName',0);
            return numberToName(0);
        }
    });
}

module.exports = {
    generateFileName: generateFileName,
    saveFile: saveFile,
    saveDataAsFilename:saveDataAsFilename,
    fileDirInit: fileDirInit,
    getNewAccountMediaJsonFileName:getNewAccountMediaJsonFileName,
    getNewAccountMediaZipFileName:getNewAccountMediaZipFileName,
}