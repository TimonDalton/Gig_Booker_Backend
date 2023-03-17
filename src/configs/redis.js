const {log} = require('./logging');

const Redis = require('redis');

const redisUrl = 'http://localhost:6379';

var redisClient;

let setValues = [
    'accountMediaJsonFileName',
    'accountMediaZipFileName'
];

async function initRedisClient () {
    // redisClient = Redis.createClient({url:redisUrl});
    redisClient = Redis.createClient();
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

exports.name = 'redis';
module.exports ={
    initRedisClient:initRedisClient,
    getClient:getClient,
}