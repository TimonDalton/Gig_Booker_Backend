const { doQuery, tableNames } = require("../../../configs/db.config");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const { log } = require('../../../configs/logging');
let fs = require('fs');
let {generateFileName,saveFile} = require('../../../configs/file.storage');


function apply_account_api_routes(app) {
    //Here a chat will be deleted
    app.post('/api/sendImageToBackend', jsonParser, async function (req, res, next) {
        console.log("In /api/sendImageToBackend");
        log(req.session);
        if (!req.files) {
            console.log(req);
            console.log("No files uploaded");
            console.log("Request");
            return res.status(400).send('No files were uploaded.');
        }
        let fileName = 'jeff.jpg';
        filePath = __dirname + '../../../../../test/public/'+fileName;
        let file = req.files.file;
        try{
            fs.writeFile(filePath,file.data,(e)=>{
                if(e){
                    console.log("Didn't work because of:");
                    console.log(e);
                }else{                    
                    console.log('Worked!');
                }
                res.status(200).send('Error uploading file');
            });
        }catch(e){
            res.status(401).send('Error uploading file');
            console.log('Error');
            console.log(e);
        }
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        //   let sampleFile = File(req.body['file']);

        // Use the mv() method to place the file somewhere on your server
        // sampleFile.mv(`${__dirname}/../../test/public`, function (err) {
        //     if (err)
        //         return res.status(500).send(err);

        //     res.status(200).send('File uploaded!');
        // });
    });

    //Here a new event will be created and the information from the JSON will be inserted
    app.post('/api/createMediaItem', jsonParser, async function (req, res, next) {
        console.log("In /api/createMediaItem");
        log(req.session);
        log("req.headers");
        log(req.headers);
        if (!req.files) {
            log("Before Request");
            log(req);
            log("No files uploaded");
            log("Request After");
            return res.status(400).send('No files were uploaded.');
        }
        let data = await doQuery(`
            INSERT INTO ${tableNames.accountMediaTableName} (user_id,  file_type,  upload_time,  description)
            VALUES('${req.session.userId}, '${req.body["fileType"]}', '${req.body["uploadTime"]}, '${req.body["description"]}') 
            RETURNING media_id;        
        `);
        log('data');
        log(data);
        let mediaId = data['media_id']
        let fileName = generateFileName(req.session.userId,mediaId);
        let file = req.files.file;
        let successfulSave = saveFile(fileName,file);
        if (!successfulSave){
            await doQuery(`
                DELETE ${tableNames.accountMediaTableName}
                WHERE media_id = "${mediaId}"
            `);
            log('Save unsuccessful. Entry for file deleted with id: '+mediaId.toString());
        }

    });

    //Here a new event will be created and the information from the JSON will be inserted
    app.post('/api/getMediaItem', jsonParser, async function (req, res, next) {
        console.log("In /api/createMediaItem");
        const insert_statement = `
            INSERT INTO ${tableNames.eventTable} (  name, organiser_id, starttime, final_payment, location, location_name, description, status)
            VALUES('${data["name"]}','${req.session.userId}','${data["startTime"]}','${data["payment"]}','(4,3)','${data["locationName"]}','${data["description"]}','${data["status"]}');  
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
}

module.exports = {
    apply_account_api_routes: apply_account_api_routes,
}