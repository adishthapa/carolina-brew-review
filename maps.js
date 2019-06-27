var queryURL = "https://data.opendatasoft.com/api/records/1.0/search/?dataset=open-beer-database%40public-us&rows=100&sort=name&facet=style_name&facet=cat_name&facet=name_breweries&facet=country&refine.country=United+States&refine.state=North+Carolina"

var beerObj = {};

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
    console.log(response.records);

    for (var i = 0; i < response.records.length; i++) {
        var city = response.records[i].fields.city;
        var brewery = response.records[i].fields.name_breweries;
        var beerName = response.records[i].fields.name;
        var longitude = response.records[i].geometry.coordinates[0]
        var latitude = response.records[i].geometry.coordinates[1]
        if (!beerObj[city]) {
            var breweryInfo = {
                beers: [beerName],
                location: {
                    longitude,
                    latitude
                }
            }
            var cityInfo = {}
            cityInfo[brewery] = breweryInfo;
            beerObj[city] = cityInfo;
        } else if (!beerObj[city][brewery]) {
            var breweryInfo = {
                beers: [beerName],
                location: {
                    longitude,
                    latitude
                }
            }
            beerObj[city][brewery] = breweryInfo;
        } else if (beerObj[city][brewery]["beers"].indexOf(beerName) === -1) {
            beerObj[city][brewery]["beers"].push(beerName);
        }
    }

    var marker;
    

    // Initialize and add the map
    function initMap(lat, lng) {
        // The location of the Brewery
        var breweryLoc = {lat, lng};
        // The map, centered at the Brewery
        var map = new google.maps.Map(
            document.getElementById('map'), {zoom: 7, center: breweryLoc});
        // The marker, positioned at the Brewery
        var marker = new google.maps.Marker({position: breweryLoc, map: map});
    }

    beerLong = beerObj["Raleigh"]["Big Boss Brewing Company"].location.longitude
    beerLat = beerObj["Raleigh"]["Big Boss Brewing Company"].location.latitude
    initMap(beerLat, beerLong);

    
});