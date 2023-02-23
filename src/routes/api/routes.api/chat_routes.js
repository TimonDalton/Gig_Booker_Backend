const { doQuery, tableNames } = require("../../../configs/db.config");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

function apply_chat_api_routes(app) {

    app.get('/api/getDisplayableChat', jsonParser, async function (req, res, next) {
        console.log("In /api/getDisplayableChat");
        res.contentType('application/json');
        let chatId = req.body['chat_id'];
        //step 1: store chat. step 2: process chat, and get its type to display it from db
        let data = await doQuery(`
            SELECT chat_id,organiser_id,performer_id,event_id,is_general FROM ${tableNames.chatTable}
            WHERE chat_id = ${chatId}
        `);
        let ret = data.rows[0];

        data = await doQuery(`
            SELECT name FROM ${tableNames.userTable}
            WHERE chat_id = ${chatId}
        `);
        ret['contact_name'] = data[0]['name'];

        data = await doQuery(`
            SELECT message_id,organiser_id,performer_id,chat_id,message,time_sent,user_sent FROM ${tableNames.messageTable}
            WHERE (organiser_id = ${userId} OR performer_id = ${userId})
            AND chat_id = ${chatId}
            ORDER BY message_id DESC LIMIT 1; 
        `);
        ret["last_message"] = data.rows[0];
        if (!ret['is_general']) {
            data = await doQuery(`
            SELECT event_id,organiser_id,name,starttime,final_payment,location,location_name,description,status FROM ${tableNames.eventTable}
            WHERE (event_id = ${ret['event_id']}); 
            `);
            ret['event'] = data.rows[0];
        }
        // console.log(`/api/getChats: data rows:`);
        // console.log(data.rows);

        let respJson = JSON.stringify(ret)
        res.send(respJson);
    });

    app.get('/api/getDisplayableEventChatsPerf', jsonParser, async function (req, res, next) {
        console.log("In /api/getDisplayableEventChatsPerf");
        res.contentType('application/json');

        let data = await doQuery(`
            SELECT chat_id,organiser_id,performer_id,event_id,is_general FROM ${tableNames.chatTable}
            WHERE performer_id = ${req.session.userId}
            ORDER BY event_id DESC  ;
        `);
        let ret = data.rows;
        for (let i = 0; i < ret.length; i++) {
            data = await doQuery(`
                SELECT name FROM ${tableNames.userTable}
                WHERE user_id = ${ret[i]['organiser_id']}
            `);
            ret[i]['contact_name'] = data[0]['name'];
        }
        for (let i = 0; i < ret.length; i++) {
            data = await doQuery(`
                SELECT message_id,organiser_id,performer_id,chat_id,message,time_sent,user_sent FROM ${tableNames.messageTable}
                WHERE chat_id = ${ret[i]['chat_id']}
                ORDER BY message_id DESC LIMIT 1; 
            `);
            ret[i]['last_message'] = data.rows[0];
        }
        for (let i = 0; i < ret.length; i++) {
            data = await doQuery(`
                SELECT event_id,organiser_id,name,starttime,final_payment,location,location_name,description,status FROM ${tableNames.eventTable}
                WHERE (event_id = ${ret[i]['event_id']}); 
            `);
            ret[i]['event'] = data.rows[0];
        }
        // console.log(`/api/getChats: data rows:`);
        // console.log(data.rows);

        let respJson = JSON.stringify(ret)
        res.send(respJson);
    });

    app.get('/api/getDisplayableGeneralChats', jsonParser, async function (req, res, next) {
        console.log("In /api/getDisplayableChats");
        res.contentType('application/json');
        let data = await doQuery(`
            SELECT * FROM ${tableNames.chatTable}
            WHERE (performer_id = '${req.session.userId}'
                OR organiser_id = '${req.session.userId}')
            AND is_general = 't'
            ;`
        );

        // console.log(`/api/getChats: data rows:`);
        // console.log(data.rows);

        let respJson = JSON.stringify(data.rows)
        res.send(respJson);
    });
    //This will allow us to add a contacts information to the chat table
    app.post('/api/createChat', jsonParser, async function (req, res, next) {
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
    app.delete('/api/deleteChat', jsonParser, async function (req, res, next) {
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
    apply_chat_api_routes: apply_chat_api_routes,
}