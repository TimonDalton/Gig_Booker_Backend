const {doQuery,tableNames} = require("../../configs/db.config");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const  {EventOrganiser} = require('../../models/eventOrganiser_class');
const  {EventObject} = require('../../models/event_class');

function apply_api_routes(app){

    app.get('/api/getEvent',jsonParser,async function(req,res,next){
        res.contentType('application/json');
        let data = await doQuery(`SELECT * FROM ${tableNames.orgTable}`);
        console.log(`data rows:`);
        console.log(data.rows);
    
        let respJson = JSON.stringify(data.rows)
        res.send(respJson);
    });
    function a (req,res,next){
        console.log("----------------------------------------------------");
        console.log(req);
        next();
    }
    // app.post('/api/createEvent',a);
    app.post('/api/createEvent',jsonParser,function(req,res,next){
        console.log("HERE");
        let data = req.body;
        let eventObj = new EventObject();
        console.log(req.body);
        eventObj.fromJSON(req.body);
    
    
        console.log(`api/createEvent post request body:`);
        console.log(data);
        res.send(data);
    });
    
    app.post('/api/login',jsonParser,async function(req,res,next){
        let orgLogin = new EventOrganiser();
        orgLogin.createFromJSON(req.body);
        
        // id SERIAL,
        // name VARCHAR(100) NOT NULL,
        // password VARCHAR(100) NOT NULL,
        let user_read = {}
        try{
            user_read = await doQuery(`SELECT name,password FROM ${tableNames.orgTable} WHERE name = '${orgLogin.name}'`);
            console.log(`DB res: `);
            console.log(user_read);
        }catch(e){
            console.log("db read error: ");
            console.log(e);
            res.status(403).json({"message":"Error"});
            return;
        }
        console.log(`api/login post request body:`);
        // console.log(req.body);
        if (user_read.rowCount == 0){
            console.log("a---------------");
            res.status(403).json({"message":"No account exists"});
        }else{
            if (user_read.rows[0]["password"] == orgLogin.password){
                console.log("b---------------");
                res.status(200).json({"message":"Logged in Successfully"});
            }else{
                console.log("c---------------");
                res.status(403).json({"message":"Wrong account details"});
            }
        }
    });
    app.post('/api/signup',jsonParser,async function(req,res,next){
        console.log("--------------");
        let data = req.body
        let postdata = new EventOrganiser();
        postdata.createFromJSON(req.body);
        let q = `SELECT name FROM ${tableNames.orgTable} WHERE name ='${postdata.name}';`;
        console.log(q);
        let selectRes;
        try{
            selectRes = await doQuery(q);
        }catch(e){
            console.log(`Error with await db select signup post`);console.log(e);
            res.status(403).json({"message":"Bad data"});
            return;
        }
        if (selectRes.rowCount != 0){
            console.log("In /api/signup, account already exists.");
            res.status(403).json({"message":"Username already in use"});
        }else{
            q = `INSERT INTO ${tableNames.orgTable} (name,password) VALUES ('${postdata.name}','${postdata.password}');`;
            console.log(q);
            try{
                await doQuery(q);
            }catch(e){
                console.log(`Error with await db insert signup post`);console.log(e);
                res.status(403).json({"message":"Bad data"});
                return;
            }
            console.log(`api/signup post request body inserted:`);
            console.log(postdata);
            res.status(200).json({"message":"Account Created"});
        }
    });
}

module.exports = {
    apply_api_routes:apply_api_routes,
}