const {doQuery,tableNames} = require("../../configs/db.config");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

const {apply_event_api_routes} = require("./routes.api/event_routes");
const {apply_chat_api_routes} = require("./routes.api/chat_routes");
const {apply_message_api_routes} = require("./routes.api/message_routes");
const {apply_user_api_routes} = require("./routes.api/user_routes");

function apply_api_routes(app){

    apply_event_api_routes(app);
    apply_chat_api_routes(app);
    apply_message_api_routes(app);
    apply_user_api_routes(app);

    //catch all
    app.all('/api/*',jsonParser,async function(req,res,next){
        console.log(`API path not found: ${req.url} using ${req.method}`);
        res.status(404).json({"message":"API Endpoint not found"});
    });  
    
}

module.exports = {
    apply_api_routes:apply_api_routes,
}