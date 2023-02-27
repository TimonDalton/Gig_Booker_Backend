const {doQuery,tableNames} = require("../../../configs/db.config");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

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
            INSERT INTO ${tableNames.messageTable} (chat_id, message, time_sent, organiser_sent)
            VALUES('${data["chatId"]}','${data["message"]}','${data["timeSent"]}',${data["organiserSent"]});  
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

}

module.exports = {
    apply_message_api_routes: apply_message_api_routes,
}