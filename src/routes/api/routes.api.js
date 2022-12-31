const {doQuery,tableNames} = require("../../configs/db.config");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const  {EventOrganiser} = require('../../models/eventOrganiser_class');

function apply_api_routes(app){

    //This will fetch all events
    app.get('/api/getEvent',jsonParser,async function(req,res,next){
        res.contentType('application/json');
        let data = await doQuery(`SELECT * FROM ${tableNames.eventTable}`);
        console.log(`/api/getEvent: data rows:`);
        console.log(data.rows);
    
        let respJson = JSON.stringify(data.rows)
        res.send(respJson);
    });
    function a (req,res,next){
        console.log("----------------------------------------------------");
        console.log(req);
        next();
    }


    //Here a new event will be created and the information from the JSON will be inserted
    app.post('/api/createEvent',jsonParser,async function(req,res,next){
        console.log("CreateEvent in Backend/routes/api/routes.api.js");
        console.log("This is the received JSON request:");
        console.log(req.body);
        let data = req.body;
        
        const insert_statement = `
            INSERT INTO ${tableNames.eventTable} (organiser_id,  name, starttime, final_payment, location, location_name, description, status)
            VALUES('${data["organiserId"]}','${data["name"]}','${data["startTime"]}','${data["payment"]}','${3},${4}','${data["locationName"]}','${data["description"]}','${data["status"]}');  
        `;
    
        try {
            await doQuery(insert_statement);
        } catch (error) {
            console.log("READ TO DB ERROR ON CREATE EVENT");
            console.log(error);
        }
        console.log('Sending back received data');
        res.send(data);
    });


    //Here an event will be deleted
    app.delete('/api/deleteEvent',jsonParser,async function(req,res,next){
        console.log("deleteEvent in Backend/routes/api/routes.api.js");
        console.log("This is the received JSON request:");
        console.log(req.body);
        let data = req.body;
        
        const delete_statement = `
            DELETE FROM ${tableNames.eventTable}
            WHERE event_id = '${data["event_id"]}' 
        `;
 
        try {
            await doQuery(delete_statement);
        } catch (error) {
            console.log("READ TO DB ERROR ON delete EVENT");
            console.log(error);
        }
        console.log('Sending back received data');
        res.send(data);
    });


    //Here an event will be edited
    app.put('/api/editEvent',jsonParser,async function(req,res,next){
        console.log("editEvent in Backend/routes/api/routes.api.js");
        console.log("This is the received JSON request:");
        console.log(req.body);
        let data = req.body;
        
        const edit_statement = `
            UPDATE ${tableNames.eventTable}
            SET name = '${data["name"]}',
                starttime = '${data["startTime"]}',
                final_payment = '${data["payment"]}',
                location = '${3},${4}',
                location_name = '${data["locationName"]}',
                description = '${data["description"]}',
                status = '${data["status"]}'
            WHERE event_id = '${data["event_id"]}'
        `;
        try {
            await doQuery(edit_statement);
        } catch (error) {
            console.log("READ TO DB ERROR ON Edit EVENT");
            console.log(error);
        }
        console.log('Sending back received data');
        res.send(data);
    });

    
    app.post('/api/login',jsonParser,async function(req,res,next){
        // let orgLogin = new EventOrganiser();
        // orgLogin.createFromJSON(req.body);
        let data = req.body
        

        let user_read = {}
        try{
            user_read = await doQuery(`SELECT name,password FROM ${tableNames.orgTable} WHERE name = '${data["username"]}'`);
            console.log(`DB res: `);
            console.log(user_read);
        }catch(e){
            console.log("db read error: ");
            console.log(e);
            res.status(403).json({"message":"Error"});
            return;
        }
        console.log(`api/login post request body:`);

        if (user_read.rowCount == 0){
            console.log("a---------------");
            res.status(403).json({"message":"No account exists"});
        }else{
            if (user_read.rows[0]["password"] == data["password"]){
                console.log("b---------------");
                res.status(200).json({"message":"Logged in Successfully"});
            }else{
                console.log("c---------------");
                res.status(403).json({"message":"Wrong account details"});
            }
        }
    });

    app.post('/api/signupOrg',jsonParser,async function(req,res,next){
        console.log("--------------");
        let data = req.body
        //let postdata = new EventOrganiser();
        //postdata.createFromJSON(req.body);


        let q = `SELECT name FROM ${tableNames.orgTable} WHERE name ='${data["username"]}';`;
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
            q = `INSERT INTO ${tableNames.orgTable} (name,password) VALUES ('${data["username"]}','${data["password"]}');`;
            console.log(q);
            try{
                await doQuery(q);
            }catch(e){
                console.log(`Error with await db insert signup post`);console.log(e);
                res.status(403).json({"message":"Bad data"});
                return;
            }
            console.log(`api/signup post request body inserted:`);
            res.status(200).json({"message":"Account Created"});
        }
    });

    app.post('/api/signupCont',jsonParser,async function(req,res,next){
        console.log("--------------");
        console.log("in signup Contractor")
        let data = req.body
        //let postdata = new EventOrganiser();
        //postdata.createFromJSON(req.body);


        let q = `SELECT name FROM ${tableNames.contTable} WHERE name ='${data["username"]}';`;
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
            q = `INSERT INTO ${tableNames.contTable} (name,password) VALUES ('${data["username"]}','${data["password"]}');`;
            console.log(q);
            try{
                await doQuery(q);
            }catch(e){
                console.log(`Error with await db insert signup post`);console.log(e);
                res.status(403).json({"message":"Bad data"});
                return;
            }
            console.log(`api/signup post request body inserted:`);
            res.status(200).json({"message":"Account Created"});
        }
    });


    //Find the user and return their profile
    app.post('/api/getProfile',jsonParser,async function(req,res,next){
        res.contentType('application/json');


        let user_read = {}
        try{
            user_read = await doQuery(`SELECT name,password FROM ${tableNames.orgTable} WHERE name = '${data["username"]}'`);
            console.log(`DB res: `);
            console.log(user_read);
        }catch(e){
            console.log("db read error: ");
            console.log(e);
            res.status(403).json({"message":"Error"});
            return;
        }
        console.log(`api/login post request body:`);







        let data = await doQuery(`SELECT * FROM ${tableNames.orgTable}`);
        console.log(`/api/getProfile: data rows:`);
        console.log(data.rows);
    
        let respJson = JSON.stringify(data.rows)
        res.send(respJson);
    });

    //This fetches all contacts that the user is chatting with
    app.get('/api/getChats',jsonParser,async function(req,res,next){
        res.contentType('application/json');
        let data = await doQuery(`SELECT * FROM ${tableNames.chatTable}`);
        console.log(`/api/getChats: data rows:`);
        console.log(data.rows);
    
        let respJson = JSON.stringify(data.rows)
        res.send(respJson);
    });
    
    //This will allow us to add a contacts information to the chat table
    app.post('/api/createChat',jsonParser,async function(req,res,next){
        console.log("CreateChat in Backend/routes/api/routes.api.js");
        console.log("This is the received JSON request:");
        console.log(req.body);
        let data = req.body;
        
        const insert_statement = `
            INSERT INTO ${tableNames.chatTable} (organiser_id,  name)
            VALUES('${data["organiserId"]}','${data["name"]}');  
        `;
    
        try {
            await doQuery(insert_statement);
        } catch (error) {
            console.log("READ TO DB ERROR ON CREATE CHAT");
            console.log(error);
        }
        console.log('Sending back received data');
        res.send(data);
    });


    //Here a chat will be deleted
    app.delete('/api/deleteChat',jsonParser,async function(req,res,next){
        console.log("deleteChat in Backend/routes/api/routes.api.js");
        console.log("This is the received JSON request:");
        console.log(req.body);
        let data = req.body;
        
        const delete_statement = `
            DELETE FROM ${tableNames.chatTable}
            WHERE chat_id = '${data["chat_id"]}' 
        `;
    
        try {
            await doQuery(delete_statement);
        } catch (error) {
            console.log("READ TO DB ERROR ON CREATE EVENT");
            console.log(error);
        }
        console.log('Sending back received data');
        res.send(data);
    });

    //This is where I attempted to use a get request and send data with but
    //could not extract the data to use
    //We could use a post request instead of a get request to solve
    app.get('/api/getMessages',jsonParser,async function(req,res,next){
        res.contentType('application/json');

        //Here we should filter by column
        let data = await doQuery(`SELECT * FROM ${tableNames.messageTable}`);
        console.log(`/api/getMessages: data rows:`);
        console.log(data.rows);
    
        let respJson = JSON.stringify(data.rows)
        res.send(respJson);
    });
    
    //This will allow us to add a message to the messages table
    app.post('/api/createMessage',jsonParser,async function(req,res,next){
        console.log("CreateMessage in Backend/routes/api/routes.api.js");
        console.log("This is the received JSON request:");
        console.log(req.body);
        let data = req.body;

        
        const insert_statement = `
            INSERT INTO ${tableNames.messageTable} (organiser_id, chat_id, message, time_sent, user_sent)
            VALUES('${data["organiserId"]}','${data["chatId"]}','${data["message"]}','${data["time_sent"]}',${data["user_sent"]});  
        `;
    
        try {
            await doQuery(insert_statement);
        } catch (error) {
            console.log("READ TO DB ERROR ON CREATE CHAT");
            console.log(error);
        }
        console.log('Sending back received data');
        res.send(data);
    });
    
}

module.exports = {
    apply_api_routes:apply_api_routes,
}