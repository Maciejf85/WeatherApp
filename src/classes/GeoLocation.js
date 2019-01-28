import $ from "jquery";


class GeoLocation {
    constructor(searchInput) {
        this.api = 'https://graphhopper.com/api/1/geocode?'
        this.city = searchInput;
        this.key = '6dfe1fd5-fe60-46fc-ae70-6949542e05c2';
    }

    getGeoDate(fn) {
        $.ajax({
            url: this.api,
            data: {
                q: this.city,
                key: this.key
            }
        }).done((response) => {
            fn(response)

        }).fail(function (error) {
            console.log(error)
        })
    }
}

export default GeoLocation;