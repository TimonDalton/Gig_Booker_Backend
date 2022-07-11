type Gig = {
    id: number;
    name: string;
    startime: Date;
    // endtime:Date;
    // minimum_payment: number;
    final_payment: number;
    // max_payment: number;

    location: Location;
    location_name:string;
    description: string;

    status: string;
    organiser_id: number;
    artist_ids: number[];

    // invited_artist_ids: number[];
    // excluded_artist_ids: number[];
    // photo_id:number;

  };