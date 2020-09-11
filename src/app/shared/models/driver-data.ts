export class DriverData {
    id: number =  -1;
    username: string = '';
    first_name: string = '';
    last_name: string = '';
    email: string = "";
    is_driver: string =  "";

    image: string =  "";
    phone: string =  "";
    carnumber: string = "";
    preferred_pickup_location: any =  null;
    preferred_radius_in_km: number = 0;
    document: string = "";
    fare: number =  0;


    driver_passenger_set : any = null; 
}