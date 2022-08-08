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
    fromJSON(json){
        if(json["id"])
            this.id = json["id"];
        if(json["organiserId"])
            this.id = json["organiserId"];
        if(json["name"])
            this.id = json["name"];
        if(json["payment"])
            this.id = json["payment"];
        if(json["startTime"])
            this.id = json["startTime"];
        if(json["duration"])
            this.id = json["duration"];
        if(json["location"])
            this.id = json["location"];
        if(json["locationName"])
            this.id = json["locationName"];
        if(json["description"])
            this.id = json["description"];
        if(json["status"])
            this.id = json["status"];
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