import $ from "jquery";


class GeoLocation {
    constructor(searchInput){
        this.api = 'https://graphhopper.com/api/1/geocode?'
        this.city = searchInput;
        this.key = '6dfe1fd5-fe60-46fc-ae70-6949542e05c2';        
    }

    getDate(){
        $.ajax({
            url: this.api,
            data:{
            q: this.city,
            key: this.key
            }
        }).done((response)=>{
            this.displayDate(response)
        }).fail(function(error){
            console.log(error)
        })
        }

    displayDate(city){
        let long = city.hits[0].point.lng;
        let lat = city.hits[0].point.lat;

        console.log(long, lat)

        // city.hits.forEach(function(item){
        //     console.log(item)
            
        // });
        
    }
    
        
    }

export default GeoLocation;