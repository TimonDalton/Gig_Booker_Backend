const Redis = require('redis');

const redisUrl = 'http://localhost:6379';

let redisClient;

function initRedisClient(){
    // redisClient = Redis.createClient({url:redisUrl});
    redisClient = Redis.createClient();
}

module.exports ={
    initRedisClient:initRedisClient,
    redisCli:redisClient,
}