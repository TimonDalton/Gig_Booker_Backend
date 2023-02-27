const {doQuery,tableNames} = require("../configs/db.config");
const {log} = require('../configs/logging');
const {apply_api_routes} = require("./api/routes.api");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

function apply_routes(app){

    app.get('/',function(req,res,next){
        res.send(`
            <p>Home page</p>
        `);
    });
    
    // CASE OF "/api/*"
    apply_api_routes(app);
    
    //backup incase no other page is found
    app.use(jsonParser,function(req,res){
        console.log(`${req.method} request @${req.url} not found`);
        console.log()
        // console.log(req);
        res.status(404).send("Page not found -_-");
    });

}

module.exports = {
    apply_routes:apply_routes,
}   
