const { doQuery, tableNames } = require("../../../configs/db.config");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const { log } = require('../../../configs/logging');
let fs = require('fs');
let {
    generateFileName,
    saveFile,
    getNewAccountMediaJsonFileName,
    saveDataAsFilename,
    getNewAccountMediaZipFileName,
    deleteFile
} = require('../../../configs/file.storage');


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
            VALUES('${req.session.userId}', '${req.body["fileType"]}', '${req.body["uploadTime"]}', '${req.body["description"]}') 
            RETURNING media_id;        
        `);
        let mediaId = data.rows[0]['media_id'];
        log('mediaId');
        log(mediaId);
        let fileName = generateFileName(req.session.userId,mediaId,req.body["fileType"]);
        let file = req.files.file;
        let successfulSave = saveFile(fileName,file);
        if (successfulSave == false){
            await doQuery(`
                DELETE FROM ${tableNames.accountMediaTableName}
                WHERE media_id = '${mediaId}'
            `);
            log(`Save unsuccessful. Entry for file deleted with id: ${mediaId}`);
        }

    });

    //Here a new event will be created and the information from the JSON will be inserted
    app.get('/api/getAccountMedia', jsonParser, async function (req, res, next) {
        console.log("In /api/getAccountMedia");
        
        log('Request:');
        log(req);
        let data = await doQuery(`
            SELECT media_id,user_id,upload_time,description FROM account_media
            WHERE user_id = '${req.session.userId}'
        ;`);
        log('data:');
        log(data);
        try{
            let filesPaths = [];
            const prefix = '../../../public/files';
            for(let i = 0;i<data.rowCount;i++){
                let row = data.rows[i];
                filesPaths.push(prefix+generateFileName(row['user_id'],row['media_id'],row['type']));
            }
            let jsonFileName = await getNewAccountMediaJsonFileName() +'.json';
            saveDataAsFilename(JSON.stringify(data.rows),jsonFileName);
            // const file1Path = '/path/to/your/file1'; // Replace with your file 1 path
            // const file2Path = '/path/to/your/file2'; // Replace with your file 2 path
            
            const archiveFileName = await getNewAccountMediaZipFileName()+'.zip'; // Replace with your archive name
        
            res.set('Content-Type', 'application/zip');
            res.set('Content-Disposition', `attachment; filename= ${archiveFileName}`);
            res.json(data);
            log('File Paths being zipped:');
            log(filesPaths);
            res.zip(filesPaths, archiveFileName, (err) => {
            if (err) {
                console.log('Error sending files:', err);
            } else {
                console.log('Files sent successfully');
            }
            });
        }catch(e){
            log(e);
        }
        // deleteFile(jsonFileName);
        // deleteFile(archiveFileName);
    });
}

module.exports = {
    apply_account_api_routes: apply_account_api_routes,
}