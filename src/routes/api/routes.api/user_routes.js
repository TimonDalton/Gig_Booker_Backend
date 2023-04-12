const {doQuery,tableNames} = require("../../../configs/db.config");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const {log} = require('../../../configs/logging');

function apply_user_api_routes(app) {
    app.post('/api/login', jsonParser, async function (req, res, next) {
        console.log("In /api/login");
        let data = req.body

        let user_read = {}
        try {
            user_read = await doQuery(`SELECT name,password,user_id,user_is_organiser FROM ${tableNames.userTable} WHERE name = '${data["username"]}'`);
        } catch (error) {
            console.log("db read error: ");
            console.log(error);
            res.status(403).json({ "message": "Error" });
        }

        if (user_read.rowCount == 0) {
            res.status(403).json({ "message": "No account exists" });
        } else {
            if (user_read.rows[0]["password"] == data["password"]) {
                req.session.userId = user_read.rows[0]["user_id"];

                const token = 'mytoken'; // Generate a unique token
                const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); 

                if (user_read.rows[0]["user_is_organiser"] == true) {
                    req.session.organiserId = req.session.userId;// 1 day
                    // res.cookie('token', token, { expires });

                    res.status(200).json({ "isOrganiser": true, "message": "Logged in Successfully as Organiser" });
                } else {
                    // res.cookie('token', 'cookie', { expires });
                    req.session.performerId = req.session.userId;
                    res.status(200).json({ "isOrganiser": false, "message": "Logged in Successfully as Performer" });
                }

            } else {
                res.status(403).json({ "message": "Wrong account details" });
            }

        }
    });

    app.post('/api/signup', jsonParser, async function (req, res, next) {
        console.log("In /api/signup");
        let data = req.body


        let query = `SELECT name FROM ${tableNames.userTable} WHERE "name" ='${data["username"]}';`;
        console.log(query);
        let selectRes;
        try {
            selectRes = await doQuery(query);
        } catch (e) {
            console.log(`Error with await db select signup post. Tried:`);
            console.log(query);
            console.log(`Got:`);
            console.log(e);
            res.status(403).json({ "message": "Bad data" });
            return;
        }
        if (selectRes.rowCount != 0) {
            console.log("In /api/signup, account already exists.");
            res.status(403).json({ "message": "Username already in use" });
        } else {
            q = `INSERT INTO ${tableNames.userTable} (name,password,user_is_organiser) VALUES ('${data["username"]}','${data["password"]}','${data["isOrganiser"]}');`;

            try {
                await doQuery(q);
                user_read = await doQuery(`SELECT user_id FROM ${tableNames.userTable} WHERE name = '${data["username"]}'`);
                req.session.userId = user_read.rows[0]["user_id"];
                const token = 'mytoken'; // Generate a unique token
                const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); 
                res.cookie('token', token, { expires });

                if (data["isOrganiser"] == "true") {
                    let id = user_read.rows[0]["user_id"];
                    q_2 = `INSERT INTO ${tableNames.orgTable} (user_id) VALUES ('${id}');`;
                    await doQuery(q_2);
                    req.session.organiserId = id;
                } else {
                    let id = user_read.rows[0]["user_id"];
                    q_2 = `INSERT INTO ${tableNames.perfTable} (user_id) VALUES ('${id}');`;
                    await doQuery(q_2);
                    req.session.performerId = id;
                }


            } catch (e) {
                console.log(`Error with await db insert signup post. Tried:`);
                console.log(query);
                console.log(`Got:`);
                console.log(e);

                res.status(403).json({ "message": "Bad data" });
                return;
            }
            console.log(`api/signup post request body inserted:`);
            res.status(200).json({ "message": "Account Created" });
        }
    });


    //Find the user and return their profile
    app.post('/api/getProfile', jsonParser, async function (req, res, next) {
        console.log("In /api/getProfile");
        res.contentType('application/json');


        let user_read = {}
        try {
            user_read = await doQuery(`SELECT name,password FROM ${tableNames.orgTable} WHERE name = '${data["username"]}'`);
            // console.log(`DB res: `);
            // console.log(user_read);
        } catch (e) {
            console.log("db read error: ");
            console.log(e);
            res.status(403).json({ "message": "Error" });
            return;
        }
        console.log(`api/login post request body:`);

        let data = await doQuery(`SELECT * FROM ${tableNames.orgTable}`);
        // console.log(`/api/getProfile: data rows:`);
        // console.log(data.rows);

        let respJson = JSON.stringify(data.rows)
        res.send(respJson);
    });
}

module.exports = {
    apply_user_api_routes: apply_user_api_routes,
}