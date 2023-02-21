const {doQuery,tableNames} = require("../../../configs/db.config");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

function apply_event_api_routes(app) {

    //This will fetch all events
    //app.get('/api/getEvent',jsonParser,async function(req,res,next){
    app.post('/api/getEventOrg', jsonParser, async function (req, res, next) {
        console.log("In /api/getEventOrg");
        res.contentType('application/json');
        //user_read = await doQuery(`SELECT name,password,user_id,user_is_organiser FROM ${tableNames.userTable} WHERE name = '${data["username"]}'`);

        console.log(req.session);
        let data = await doQuery(`SELECT * FROM ${tableNames.eventTable} WHERE organiser_id = '${req.session.organiserId}'`);
        console.log(`/api/getEventOrg: data rows:`);
        let respJson = '';
        if (data) {
            console.log(data.rowCount);
            console.log(`Data Rows: ${data.rowCount}`);
            respJson = JSON.stringify(data.rows)
        }
        res.send(respJson);
    });


    //All of the events the performer can apply for. Currently, it is all of the events
    app.post('/api/getVisibleEventsPerf', jsonParser, async function (req, res, next) {
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

    app.post('/api/applyForEventPerf', jsonParser, async function (req, res, next) {
        console.log("In /api/applyForEventPerf");
        res.contentType('application/json');
        //user_read = await doQuery(`SELECT name,password,user_id,user_is_organiser FROM ${tableNames.userTable} WHERE name = '${data["username"]}'`);
        let eventId = req.body["eventId"];
        let organiserId = req.body["organiserId"];

        let data = await doQuery(
            `SELECT * FROM ${tableNames.perfEventIntTable} 
            WHERE "performer_id" = ${req.session.performerId}
            AND "event_id" = ${eventId}`
        );


        if (data.rowCount > 0) {
            res.status(400).json({ "message": "Already applied" });
        } else {
            try {
                let ret = await doQuery(
                    `SELECT "chat_id" FROM ${tableNames.chatTable} 
                        WHERE event_id = '${eventId}';
                    `);
                if (ret.rowCount == 0) {
                    ret = await doQuery(
                        `INSERT INTO ${tableNames.chatTable} (organiser_id,performer_id,event_id,is_general)
                        VALUES ('${organiserId}','${req.session.performerId}','${eventId}','f')    
                        RETURNING chat_id;`);
                }
                let chatId = ret.rows[0]["chat_id"];
                console.log("GOT FROM INSERT RETURNING chat_id");
                console.log(chatId);

                await doQuery(
                    `INSERT INTO ${tableNames.perfEventIntTable} (performer_id,event_id,chat_id,status)
                        VALUES ('${req.session.performerId}','${eventId}','${chatId}','application');
                    `);
                res.status(200).json({ "message": "Applied" });
                console.log(`Accepted data: `);
                console.log(data);
            } catch (e) {
                res.status(400).json({ "message": "Error Applying" });
                console.log('Error in applyForEventPerf apply');
                console.log(e);
            }


        }

    });
    app.post('/api/deleteEventApplicationPerf', jsonParser, async function (req, res, next) {
        console.log("In /api/deleteEventApplicationPerf");
        res.contentType('application/json');
        //user_read = await doQuery(`SELECT name,password,user_id,user_is_organiser FROM ${tableNames.userTable} WHERE name = '${data["username"]}'`);
        let eventId = req.body["eventId"];
        try {
            await doQuery(//delete performer event link
                `DELETE FROM ${tableNames.perfEventIntTable} 
            WHERE "performer_id" = ${req.session.performerId}
            AND "event_id" = ${eventId}`
            );
            // let data = await doQuery(
            //     `SELECT chat_id FROM ${tableNames.chatTable}
            //         WHERE "event_id" = ${eventId}
            //     );`
            // );
            // data = await doQuery(//search messages to find empty chats for event and performer
            //     `SELECT * FROM ${tableNames.messageTable}
            //         WHERE THEY ARE IN THE LIST OF CHATS
            //     );`
            // );
            res.status(200);
        } catch (e) {
            res.status(400).json({ "message": "Error Deleting" });
            console.log("Delete of event performer connection successful");
        }
    });


    app.post('/api/getHasAppliedForEvent', jsonParser, async function (req, res, next) {
        console.log("In /api/getHasAppliedForEvent");
        res.contentType('application/json');

        let data = await doQuery(
            `SELECT * FROM ${tableNames.perfEventIntTable} 
                WHERE "performer_id" = ${req.session.performerId}
                AND "event_id" = ${req.body["eventId"]}`
        );
        if (!data) {
            console.log("/getHasAppliedForEvent getdata error");
        }
        let hasApplied = false;
        if (data.rowCount > 0) {
            hasApplied = true;
            console.log(data);
        }
        res.status(200).json({ "hasApplied": hasApplied });
    });
    //All of the events the performer has already applied for.
    app.post('/api/getEventsPerf', jsonParser, async function (req, res, next) {
        console.log("In /api/getEventsPerf");
        res.contentType('application/json');
        //user_read = await doQuery(`SELECT name,password,user_id,user_is_organiser FROM ${tableNames.userTable} WHERE name = '${data["username"]}'`);

        console.log(req.session);
        let data = await doQuery(
            `SELECT ${tableNames.eventTable}.* 
            FROM ${tableNames.eventTable}, ${tableNames.perfEventIntTable}
            WHERE ${tableNames.perfEventIntTable}.performer_id = ${req.session.performerId}
            AND ${tableNames.perfEventIntTable}.event_id = ${tableNames.eventTable}.event_id;`
        );

        if (data) {
            console.log(`/api/getEventsPerf: data rows:`);
            console.log(data.rowCount);
        } else {
            console.log(`No data /api/getEventsPerf'`);
        }
        let respJson = JSON.stringify(data.rows)
        res.send(respJson);
    });




    //Here a new event will be created and the information from the JSON will be inserted
    app.post('/api/createEvent', jsonParser, async function (req, res, next) {
        console.log("In /api/createEvent");
        console.log("CreateEvent in Backend/routes/api/routes.api.js");
        console.log("This is the received JSON request:");
        let data = req.body;
        console.log("REQ REQ REQ REQ");
        console.log(req.session);
        const insert_statement = `
            INSERT INTO ${tableNames.eventTable} (  name, organiser_id, starttime, final_payment, location, location_name, description, status)
            VALUES('${data["name"]}','${req.session.organiserId}','${data["startTime"]}','${data["payment"]}','(4,3)','${data["locationName"]}','${data["description"]}','${data["status"]}');  
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
    app.delete('/api/deleteEvent', jsonParser, async function (req, res, next) {
        console.log("In /api/deleteEvent");
        console.log("This is the received JSON request:");
        console.log(req.body);
        let data = req.body;

        const delete_statement = `
            DELETE FROM ${tableNames.eventTable}
            WHERE event_id = '${data["event_id"]};' 
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
    app.put('/api/editEvent', jsonParser, async function (req, res, next) {
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

}

module.exports = {
    apply_event_api_routes: apply_event_api_routes,
}