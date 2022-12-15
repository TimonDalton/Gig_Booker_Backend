const { json } = require("express");

class EventObject{
    
    constructor(json){
        if (json){
            return this.fromJSON(json);
        }
        this.id = -1;
        this.organiserId = "";
        this.name = "";
        this.payment = "";
        this.startTime = "";
        this.duration = "";
        this.location = "";
        this.locationName = "";
        this.description = "";
        this.status = "";
        return this;
    }
    //This converts a JSON into an event object
    fromJSON(json){
        if(json["id"])
            this.id = json["id"];
        if(json["organiserId"]){
            console.log(`found organiserId of ${json["organiserId"]}`);
            this.organiserId = json["organiserId"];
        }else{
            console.log(`Didn't find organiserId in`);
            console.log(json);
        }
        if(json["name"])
            this.name = json["name"];
        if(json["payment"])
            this.payment = json["payment"];
        if(json["startTime"])
            this.startTime = json["startTime"];
        if(json["duration"])
            this.duration = json["duration"];
        if(json["location"])
            this.location = {'lat':3,'long':4};
        if(json["locationName"])
            this.locationName = json["locationName"];
        if(json["description"])
            this.description = json["description"];
        if(json["status"])
            this.status = json["status"];
        return this;
    }
    listFromJSON(listJson){
        let ret = [];
        for (json in listJson["events"]){
            let obj = new EventOrganiser(json);
            ret.push(obj);
        }
        return this;
    }
}

module.exports = {
    EventObject:EventObject,
}