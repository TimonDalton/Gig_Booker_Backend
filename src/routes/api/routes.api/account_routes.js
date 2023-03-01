const { doQuery, tableNames } = require("../../../configs/db.config");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const { log } = require('../../../configs/logging');
var http = require('http');
let fs = require('fs');

function apply_account_api_routes(app) {

    //Here a chat will be deleted
    app.post('/api/sendImageToBackend', jsonParser, async function (req, res, next) {
        console.log("In /api/sendImageToBackend");
        if (!req.body['file']) {
            console.log(req);
            console.log("No files uploaded");
            console.log("Request");
            return res.status(400).send('No files were uploaded.');
        }
        filePath = __dirname + '../../../../../test/public/img.jpg';
        try{
            fs.writeFile(filePath, req.body['file'],(e)=>{
                if(e){
                    console.log("Didn't work because of:");
                    console.log(e);
                }else{                    
                    console.log('Worked!');
                }
            });
        }catch(e){
            req.status(401).send('Error uploading file');
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



}

module.exports = {
    apply_account_api_routes: apply_account_api_routes,
}