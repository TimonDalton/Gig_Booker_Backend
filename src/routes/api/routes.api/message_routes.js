const { doQuery, tableNames } = require("../../../configs/db.config");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const { log } = require('../../../configs/logging');

function apply_message_api_routes(app) {

    //This is where I attempted to use a get request and send data with but
    //could not extract the data to use
    //We could use a post request instead of a get request to solve
    app.get('/api/getMessages', jsonParser, async function (req, res, next) {
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
    app.post('/api/createMessage', jsonParser, async function (req, res, next) {
        console.log("In /api/createMessage");
        console.log("CreateMessage in Backend/routes/api/routes.api.js");
        // console.log("This is the received JSON request:");
        // console.log(req.body);
        let data = req.body;


        const insert_statement = `
            INSERT INTO ${tableNames.messageTable} (chat_id, message, time_sent, organiser_sent, type)
            VALUES('${data["chatId"]}','${data["message"]}','${data["timeSent"]}',${data["organiserSent"]},'${data["type"]}');  
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

    app.post('/api/updateMessageType', jsonParser, async function (req, res, next) {
        console.log("In /api/updateMessageType");
        let data = req.body;
        let updateErrorOccured = false;
        try {
            await doQuery(
                `
                UPDATE ${tableNames.messageTable} 
                SET "type" = '${data["type"]}'
                WHERE "message_id" = ${data["messageId"]} 
                ;
            `
            );
        } catch (error) {
            console.log("READ TO DB ERROR ON CREATE CHAT");
            console.log(error);
            res.status(400).send({ 'message': 'error updating message type' });
            updateErrorOccured = true;
        }
        if (data["type"] == 'accepted_proposal'){
            try {
                let chatTableQueryData = await doQuery(`
                    SELECT performer_id,event_id FROM ${tableNames.chatTable} 
                    WHERE "chat_id" = ${data["chatId"]} LIMIT 1 
                    ;
                `);
                chatTableQueryData = chatTableQueryData.rows[0];
    
                if (chatTableQueryData['performer_id'] == undefined || chatTableQueryData['event_id'] == undefined){
                    log('chatTableQueryData which gave an error');
                    log(chatTableQueryData);
                    throw `Found no chat with chat_id = ${data["chatId"]} with 
                    chatTableQueryData['performer_id'] = ${chatTableQueryData['performer_id']}
                    and chatTableQueryData['event_id'] = ${chatTableQueryData['event_id']}
                    `;
                }
                doQuery(`
                    UPDATE ${tableNames.eventTable} 
                    SET "booked_artist_id" = '${chatTableQueryData['performer_id']}',
                    "status" = 'booked pre-deposit'
                    WHERE "event_id" = ${chatTableQueryData["event_id"]} 
                    ;
                `);
            } catch (e) {
                log('Error updating event type:');
                log(e);
                updateErrorOccured = true;
            }
        }
        

        console.log('Done with Update Message');
        if (!updateErrorOccured) {
            res.send(data);
        }else{
            res.status(400).send(data);
        }
    });

}


module.exports = {
    apply_message_api_routes: apply_message_api_routes,
}