const {doQuery,tableNames} = require("../../configs/db.config");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const {log} = require('../../configs/logging');

const {apply_event_api_routes} = require("./routes.api/event_routes");
const {apply_chat_api_routes} = require("./routes.api/chat_routes");
const {apply_message_api_routes} = require("./routes.api/message_routes");
const {apply_user_api_routes} = require("./routes.api/user_routes");
const {apply_account_api_routes} = require("./routes.api/account_routes");



function apply_api_routes(app){

    pre_directory_routes(app);
    apply_user_api_routes(app);

    apply_event_api_routes(app);
    apply_chat_api_routes(app);
    apply_message_api_routes(app);
    apply_account_api_routes(app);

    //catch all
    app.all('/api/*',jsonParser,async function(req,res,next){
        console.log(`API path not found: ${req.url} using ${req.method}`);
        res.status(404).json({"message":"API Endpoint not found"});
    });  
    
}

function pre_directory_routes(app){
    // set a cookie
    app.use(function (req, res, next) {
        // check if client sent cookie
        var cookie = req.cookies.token;
        if (cookie === undefined) {
            console.log('No cookie with request');
        // // no: set a new cookie
        // var randomNumber=Math.random().toString();
        // randomNumber=randomNumber.substring(2,randomNumber.length);
        // res.cookie('cookieName',randomNumber, { maxAge: 900000, httpOnly: true });
        // console.log('cookie created successfully');
            if(req.url.includes('signup') || req.url.includes('login')){//only route permitted to not be signed in
                next();
            }
            res.json({"requiredSignIn":true});
        } else {
        // yes, cookie was already present 
            console.log('cookie exists', cookie);
            console.log('req headers');
            console.log(req.headers);
            next(); // <-- important!
        } 
    });
}


module.exports = {
    apply_api_routes:apply_api_routes,
}