const { json } = require("express");

class EventOrganiser{
    
    constructor(json){
        if (json){
            return this.fromJSON(json);
        }
        this.id = -1;
        this.name = "";
        this.password = "";
        this.bio = "";
        this.creditCardDetails = "";
        return this;
    }
    fromJSON(json){
        if(json["organiserId"])
            this.id = json["organiserId"];
        if(json["username"])
            this.name = json["username"];
        if(json["password"])
            this.password = json["password"];
        if(json["bio"])
            this.bio = json["bio"];
        if(json["creditCardDetails"])
            this.creditCardDetails = json["creditCardDetails"];
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
    EventOrganiser:EventOrganiser,
}