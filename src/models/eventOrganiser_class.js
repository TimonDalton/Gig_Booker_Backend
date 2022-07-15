class EventOrganiser{
    
    constructor(){
        this.id = -1;
        this.name = "";
        this.password = "";
        this.bio = "";
        this.creditCardDetails = "";
        return this;
    }
    createFromJSON(json){
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
}

module.exports = {
    EventOrganiser:EventOrganiser,
}