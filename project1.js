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
            var newPanel = $("<div>").addClass("panel col-md-3")
            var newPanelHeading = $("<div>").addClass("panel-heading")
            var newPanelTitle = $("<div>").addClass("panel-title")
            var newCity = $("<a>").attr("data-toggle", "collapse").attr("href", "#")
            var cityName = citiesList[i]

            newCity.text(cityName);
            newPanelTitle.append(newCity);
            newPanelHeading.append(newPanelTitle);
            newPanel.append(newPanelHeading);

            var breweriesList = Object.keys(beerObj[cityName]).sort();

            for (var j = 0; j < breweriesList.length; j++) {
                var newPanelBody = $("<div>").addClass("panel-body");
                var newBrewery = $("<li>")
                breweryName = breweriesList[j];
                newBrewery.text(breweryName);
                newPanelBody.append(newBrewery);
                newPanel.append(newPanelBody);
                console.log(breweriesList[j]);
            }

            $("#addHere").append(newPanel);

        }

        console.log(beerObj);

    }

    fillBreweries(beerObj)
});
