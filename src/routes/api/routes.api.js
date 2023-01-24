const {doQuery,tableNames} = require("../../configs/db.config");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const  {EventOrganiser} = require('../../models/eventOrganiser_class');

function apply_api_routes(app){

    //This will fetch all events
    //app.get('/api/getEvent',jsonParser,async function(req,res,next){
    app.post('/api/getEventOrg',jsonParser,async function(req,res,next){
        console.log("In /api/getEventOrg");
        res.contentType('application/json');
        //user_read = await doQuery(`SELECT name,password,user_id,user_is_organiser FROM ${tableNames.userTable} WHERE name = '${data["username"]}'`);

        console.log(req.session);
        let data = await doQuery(`SELECT * FROM ${tableNames.eventTable} WHERE organiser_id = '${req.session.organiserId}'`);
        console.log(`/api/getEventOrg: data rows:`);
        console.log(data.rowCount);
    
        let respJson = JSON.stringify(data.rows)
        res.send(respJson);
    });


    //All of the events the performer can apply for. Currently, it is all of the events
    app.get('/api/getVisibleEventsPerf',jsonParser,async function(req,res,next){
        console.log("In api/getVisibleEventsPerf");
        res.contentType('application/json');
        //user_read = await doQuery(`SELECT name,password,user_id,user_is_organiser FROM ${tableNames.userTable} WHERE name = '${data["username"]}'`);

        console.log(req.session);
        let data = await doQuery(
        `SELECT * FROM ${tableNames.eventTable}`
        );


        console.log(`/api/getEventsPerf: data rows:`);
        console.log(data.rowCount);
    
        let respJson = JSON.stringify(data.rows)
        res.send(respJson);
    });

    //All of the events the performer has already applied for.
    app.get('/api/getEventsPerf',jsonParser,async function(req,res,next){
        console.log("In /api/getEventsPerf");
        res.contentType('application/json');
        //user_read = await doQuery(`SELECT name,password,user_id,user_is_organiser FROM ${tableNames.userTable} WHERE name = '${data["username"]}'`);

        console.log(req.session);
        let data = await doQuery(
        `SELECT ${tableNames.eventTable}.* 
            FROM ${tableNames.eventTable}, ${tablenames.perfEventIntTable}
            WHERE ${tablenames.perfEventIntTable}.performer_id = ${req.session.performerId}
            AND ${tablenames.perfEventIntTable}.event_id = ${tableNames.eventTable}.event_id;`
        );


        console.log(`/api/getEventsPerf: data rows:`);
        console.log(data.rowCount);
    
        let respJson = JSON.stringify(data.rows)
        res.send(respJson);
    });

    //Here a new event will be created and the information from the JSON will be inserted
    app.post('/api/createEvent',jsonParser,async function(req,res,next){
        console.log("In /api/createEvent");
        console.log("CreateEvent in Backend/routes/api/routes.api.js");
        console.log("This is the received JSON request:");
        let data = req.body;
        console.log("REQ REQ REQ REQ");
        console.log(req.session);
        const insert_statement = `
            INSERT INTO ${tableNames.eventTable} (  name, organiser_id, starttime, final_payment, location, location_name, description, status)
            VALUES('${data["name"]}','${req.session.organiserId}','${data["startTime"]}','${data["payment"]}','${3},${4}','${data["locationName"]}','${data["description"]}','${data["status"]}');  
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
        console.log("In /api/deleteEvent");
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
        console.log("In /api/editEvent");
        console.log("editEvent in Backend/routes/api/routes.api.js");
        // console.log("This is the received JSON request:");
        // console.log(req.body);
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
        console.log("In /api/login");
        let data = req.body
        
        let user_read = {}
        try{
            user_read = await doQuery(`SELECT name,password,user_id,user_is_organiser FROM ${tableNames.userTable} WHERE name = '${data["username"]}'`);
        }catch(error){
            console.log("db read error: ");
            console.log(error);
            res.status(403).json({"message":"Error"});
        }
        

        if (user_read.rowCount == 0){
            res.status(403).json({"message":"No account exists"});
        }else{
            if (user_read.rows[0]["password"] == data["password"]){
                req.session.userId = user_read.rows[0]["user_id"];
                
                
                if (user_read.rows[0]["user_is_organiser"] == true){
                    user_read = await doQuery(`SELECT organiser_id FROM ${tableNames.orgTable} WHERE user_id = '${user_read.rows[0]["user_id"]}'`);
                    req.session.organiserId = user_read.rows[0]["organiser_id"];
                    res.status(200).json({"message":"Logged in Successfully as Organiser"});
                }else{
                    user_read = await doQuery(`SELECT performer_id FROM ${tableNames.perfTable} WHERE user_id = '${user_read.rows[0]["user_id"]}'`);
                    req.session.performerId = user_read.rows[0]["performer_id"];
                    res.status(200).json({"message":"Logged in Successfully as Performer"});
                }

            }else{
                if (user_read.rows[0]["password"] == data["password"]){
                    req.session.isOrganiser = false;
                    req.session.isPerformer = !req.session.isOrganiser;
                    req.session.performerId = user_read.rows[0]["organiser_id"];
                    res.status(200).json({"message":"Logged in Successfully"});
                }else{
                    res.status(403).json({"message":"Wrong account details"});
                }
            }

        }
    });

    app.post('/api/signup',jsonParser,async function(req,res,next){
        console.log("In /api/signup");
        let data = req.body


        let query = `SELECT name FROM ${tableNames.userTable} WHERE "name" ='${data["username"]}';`;
        console.log(query);
        let selectRes;
        try{
            selectRes = await doQuery(query);
        }catch(e){
            console.log(`Error with await db select signup post. Tried:`);
            console.log(query);
            console.log(`Got:`);            
            console.log(e);
            res.status(403).json({"message":"Bad data"});
            return;
        }
        if (selectRes.rowCount != 0){
            console.log("In /api/signup, account already exists.");
            res.status(403).json({"message":"Username already in use"});
        }else{
            q = `INSERT INTO ${tableNames.userTable} (name,password,user_is_organiser) VALUES ('${data["username"]}','${data["password"]}','${data["isOrganiser"]}');`;
            
            try{
                await doQuery(q);
                user_read = await doQuery(`SELECT user_id FROM ${tableNames.userTable} WHERE name = '${data["username"]}'`);
                req.session.userId = user_read.rows[0]["user_id"];

                if(data["isOrganiser"] == "true"){
                    q_2 = `INSERT INTO ${tableNames.orgTable} (user_id) VALUES ('${user_read.rows[0]["user_id"]}');`;
                    await doQuery(q_2);

                    user_read = await doQuery(`SELECT organiser_id FROM ${tableNames.orgTable} WHERE user_id = '${req.session.userId}'`);
                    req.session.organiserId = user_read.rows[0]["organiser_id"];
                }else{
                    q_2 = `INSERT INTO ${tableNames.perfTable} (user_id) VALUES ('${user_read.rows[0]["user_id"]}');`;
                    await doQuery(q_2);

                    user_read = await doQuery(`SELECT performer_id FROM ${tableNames.perfTable} WHERE user_id = '${req.session.userId}'`);
                    req.session.performerId = user_read.rows[0]["performer_id"];
                }
                

            }catch(e){
                console.log(`Error with await db insert signup post. Tried:`);
                console.log(query);
                console.log(`Got:`);
                console.log(e);

                res.status(403).json({"message":"Bad data"});
                return;
            }
            console.log(`api/signup post request body inserted:`);
            res.status(200).json({"message":"Account Created"});
        }
    });


    //Find the user and return their profile
    app.post('/api/getProfile',jsonParser,async function(req,res,next){
        console.log("In /api/getProfile");
        res.contentType('application/json');


        let user_read = {}
        try{
            user_read = await doQuery(`SELECT name,password FROM ${tableNames.orgTable} WHERE name = '${data["username"]}'`);
            // console.log(`DB res: `);
            // console.log(user_read);
        }catch(e){
            console.log("db read error: ");
            console.log(e);
            res.status(403).json({"message":"Error"});
            return;
        }
        console.log(`api/login post request body:`);

        let data = await doQuery(`SELECT * FROM ${tableNames.orgTable}`);
        // console.log(`/api/getProfile: data rows:`);
        // console.log(data.rows);
    
        let respJson = JSON.stringify(data.rows)
        res.send(respJson);
    });

    //This fetches all contacts that the user is chatting with
    app.get('/api/getChats',jsonParser,async function(req,res,next){
        console.log("In /api/getChats");
        res.contentType('application/json');
        let data = await doQuery(`SELECT * FROM ${tableNames.chatTable}`);
        // console.log(`/api/getChats: data rows:`);
        // console.log(data.rows);
    
        let respJson = JSON.stringify(data.rows)
        res.send(respJson);
    });
    
    //This will allow us to add a contacts information to the chat table
    app.post('/api/createChat',jsonParser,async function(req,res,next){
        console.log("In /api/createChat");
        console.log("CreateChat in Backend/routes/api/routes.api.js");
        // console.log("This is the received JSON request:");
        // console.log(req.body);
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
        console.log("In /api/deleteChat");
        console.log("deleteChat in Backend/routes/api/routes.api.js");
        // console.log("This is the received JSON request:");
        // console.log(req.body);
        let data = req.body;
        
        const delete_statement = `
            DELETE FROM ${tableNames.chatTable}
            WHERE chat_id = '${data["chat_id"]}' 
        `;
    
        try {
            await doQuery(delete_statement);
        } catch (error) {
            console.log("READ TO DB ERROR ON DELETE CHAT");
            console.log(error);
        }
        console.log('Done with delete');
        res.send(data);
    });

    //This is where I attempted to use a get request and send data with but
    //could not extract the data to use
    //We could use a post request instead of a get request to solve
    app.get('/api/getMessages',jsonParser,async function(req,res,next){
        console.log("In /api/getMessages");
        res.contentType('application/json');

        //Here we should filter by column
        let data = await doQuery(`SELECT * FROM ${tableNames.messageTable}`);
        // console.log(`/api/getMessages: data rows:`);
        // console.log(data.rows);
    
        let respJson = JSON.stringify(data.rows)
        res.send(respJson);
    });
    
    //This will allow us to add a message to the messages table
    app.post('/api/createMessage',jsonParser,async function(req,res,next){
        console.log("In /api/createMessage");
        console.log("CreateMessage in Backend/routes/api/routes.api.js");
        // console.log("This is the received JSON request:");
        // console.log(req.body);
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
        console.log('Done with Create Message');
        res.send(data);
    });

    //catch all
    app.all('/api/*',jsonParser,async function(req,res,next){
        console.log(`API path not found: ${req.url} using ${req.method}`);
        res.status(404).json({"message":"API Endpoint not found"});
    });  
    
}

module.exports = {
    apply_api_routes:apply_api_routes,
}