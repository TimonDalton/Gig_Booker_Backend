var path = require('path');
const { log } = require('../configs/logging');
var fs = require('fs');
const redis = require('../configs/redis');


let types = {
    'image':'jpg',
    'video':'mp4',
    'audio':'mp3',

}

function generateFileName(userId,mediaId,type){
    let typeExtention = types[type];
    if (typeExtention == null){
        log(`Error: Type "${type}" not in list.`);
        log(`Failure on: userId ${userId}, mediaId ${mediaId}, type ${type}`);
        return null;
    }else{
        return 'U'+userId.toString()+'#'+mediaId.toString()+'.'+typeExtention;
    }
}

let dir = __dirname+'../../../public/files';
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

async function getNewAccountMediaJsonFileName(){
    let name = 'accountMediaJsonFileName';
    console.log('redis.getClient()');
    console.log(redis.getClient());
    let res = await redis.getClient().get(name,(err,data)=>{
        if (err){
            log(err);
        }
    });

    let num = parseInt(res);
    num ++;
    await redis.getClient().set(name,num.toString());
    return res;
}

async function getNewAccountMediaZipFileName(){
    let name = 'accountMediaZipFileName';
    let res = '';
    let data = await redis.getClient().get(name,(err,data)=>{
        if (err){
            log(err);
        }    
    });
    let num = parseInt(data);
    num ++;
    await redis.getClient().set(name,num);
    res = numberToName(num.toString());

    return res; 
}



module.exports = {
    generateFileName: generateFileName,
    saveFile: saveFile,
    saveDataAsFilename:saveDataAsFilename,
    fileDirInit: fileDirInit,
    getNewAccountMediaJsonFileName:getNewAccountMediaJsonFileName,
    getNewAccountMediaZipFileName:getNewAccountMediaZipFileName,
    deleteFile:deleteFile,
}