const {doQuery,tableNames} = require("../../../configs/db.config");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

function apply_chat_api_routes(app){

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
    app.get('/api/getDisplayableChat',jsonParser,async function(req,res,next){
        console.log("In /api/getDisplayableChat");
        res.contentType('application/json');
        let chatId = req.body['chat_id'];
        //step 1: store chat. step 2: process chat, and get its type to display it from db
        let data = await doQuery(`
            SELECT chat_id,organiser_id,performer_id,event_id,is_general FROM ${tableNames.chatTable}
            WHERE chat_id = ${chatId}
        `);
        let ret = data[0];
        data = await doQuery(`
            SELECT name FROM ${tableNames.userTable}
            WHERE chat_id = ${chatId}
        `); 
        ret['contact_name'] = data[0]['name']
        if (!ret['is_general']){
            
        }
        // console.log(`/api/getChats: data rows:`);
        // console.log(data.rows);
    
        let respJson = JSON.stringify(data.rows)
        res.send(respJson);
    });
    app.get('/api/getDisplayableEventChatsPerf',jsonParser,async function(req,res,next){
        console.log("In /api/getDisplayableChats");
        res.contentType('application/json');
        let data = await doQuery(`
            SELECT * FROM ${tableNames.chatTable}
            WHERE performer_id = '${req.session.performerId}'
            ;`
        );

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

}

module.exports = {
    apply_chat_api_routes:apply_chat_api_routes,
}