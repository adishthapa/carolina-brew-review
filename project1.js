var queryURL = "https://data.opendatasoft.com/api/records/1.0/search/?dataset=open-beer-database%40public-us&rows=100&sort=name&facet=style_name&facet=cat_name&facet=name_breweries&facet=country&refine.country=United+States&refine.state=North+Carolina"

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
    var beerObj = {};

    for (var i = 0; i < response.records.length; i++) {
        var city = response.records[i].fields.city;
        var brewery = response.records[i].fields.name_breweries;
        var beerName = response.records[i].fields.name;
        var beerStyle = response.records[i].fields.style_name;
        var beerCateg = response.records[i].fields.cat_name;
        var beerABV = response.records[i].fields.abv;
        var beerDescr = response.records[i].fields.descript;
        var longitude = response.records[i].geometry.coordinates[0];
        var latitude = response.records[i].geometry.coordinates[1];
        if (!beerObj[city]) {
            var cityInfo = {
                [brewery]: {
                    beers: [beerName],
                    location: {
                        longitude,
                        latitude
                    },
                    [beerName]: {
                        name: beerName,
                        style: beerStyle,
                        category: beerCateg,
                        ABV: beerABV,
                        description: beerDescr
                    }
                }
            };
            beerObj[city] = cityInfo;
        } else if (!beerObj[city][brewery]) {
            var beerInfo = {
                name: beerName,
                style: beerStyle,
                category: beerCateg,
                ABV: beerABV,
                description: beerDescr
            };
            var breweryInfo = {
                beers: [beerName],
                location: {
                    longitude,
                    latitude
                }
            };
   
            beerObj[city][brewery] = breweryInfo;
            breweryInfo[beerName] = beerInfo;
        } else if (beerObj[city][brewery]["beers"].indexOf(beerName) === -1) {
            beerObj[city][brewery]["beers"].push(beerName);
            var beerInfo = {
                name: beerName,
                style: beerStyle,
                category: beerCateg,
                ABV: beerABV,
                description: beerDescr
            };
            beerObj[city][brewery][beerName] = beerInfo;
        }
    }
   
    function fillBreweries(beerObj) {
        var citiesList = Object.keys(beerObj).sort();
        for (var i = 0; i < citiesList.length; i++) {
            var newCol = $("<div>").addClass("col-sm-12 col-md-4 mb-4")
            var newCard = $("<div>").addClass("card h-100 border-0");
            var newCardBody = $("<div>").addClass("card-body")
            
            var cityName = citiesList[i]

            var newCity = $("<h4>").addClass("card-title text-center p-2 ")

            newCity.text(cityName);
            newCardBody.append(newCity);
            newCard.append(newCardBody);
            newCol.append(newCard);

            var breweriesList = Object.keys(beerObj[cityName]).sort();

            for (var j = 0; j < breweriesList.length; j++) {
                // var newCardBody = $("<div>");
                var newBrewery = $("<p>").addClass("card-text pb-2")
                breweryName = breweriesList[j];
                newBrewery.text(breweryName);
                // newCardBody.append(newBrewery);
                newCardBody.append(newBrewery);
                console.log(breweriesList[j]);
            }

            $("#cities-breweries-list").append(newCol);

        }

        console.log(beerObj);

    }

    fillBreweries(beerObj)
});
