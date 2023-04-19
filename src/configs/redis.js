const {log} = require('./logging');

const Redis = require('redis');

const redisUrl = 'http://localhost:6379';

var redisClient;

let setValues = [
    'accountMediaJsonFileName',
    'accountMediaZipFileName'
];

async function initRedisClient (redisClient) {
    // redisClient = Redis.createClient({url:redisUrl});
    await redisClient.connect();
    redisClient.on('error', err => console.error('Redis Client Error', err));


    setValues.forEach(async(el)=>{
        let ret = await redisClient.get(el,async(error,val)=>{
            if (error){
                console.log(error);
            }
        });
        if(ret == null){
            redisClient.set(el,'1');
        }

    });
}

function getClient(){
    return redisClient;
}

function redisSet(key,value){
    redisClient.set(key,value);
}
function redisGet(key){
    return redisClient.get(key);
}

exports.name = 'redis';
module.exports ={
    initRedisClient:initRedisClient,
    getClient:getClient,
    redisSet:redisSet,
    redisGet:redisGet,
}