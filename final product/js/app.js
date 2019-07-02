$(document).ready(function(){

    var firebaseConfig = {
        apiKey: "AIzaSyCrrcl0Qk0lbbLwURSemFTE499mmFSVbvM",
        authDomain: "project-01-704ce.firebaseapp.com",
        databaseURL: "https://project-01-704ce.firebaseio.com",
        projectId: "project-01-704ce",
        storageBucket: "",
        messagingSenderId: "638882612611",
        appId: "1:638882612611:web:2566b2b54d0668d4"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Create a variable to reference the database
    var database = firebase.database();
    // Link to Firebase Database for tracking users
    var users = database.ref("/users");

    var queryURL = "https://data.opendatasoft.com/api/records/1.0/search/?dataset=open-beer-database%40public-us&rows=100&sort=name&facet=style_name&facet=cat_name&facet=name_breweries&facet=country&refine.country=United+States&refine.state=North+Carolina";

    var beerObj = {};

    var loginStatus;
    var user;
    var favoriteBreweries = [];

    // Function for signing up
    $("#signup-submit").click(function(event) {
        event.preventDefault();
        var name = $("#signup-name-input").val().trim();
        var email = $("#signup-email-input").val().trim();
        var password = $("#signup-password-input").val().trim();

        users.push({
            name,
            email,
            password,
            favoriteBreweries
        });

        $("#signup-name-input").val("");
        $("#signup-email-input").val("");
        $("#signup-password-input").val("");

    });

    // Function for logging in
    $("#login-submit").click(function(event) {
        event.preventDefault();
        var email = $("#login-email-input").val().trim();
        var password = $("#login-password-input").val().trim();
        

        users.orderByChild("email").equalTo(email).on("child_added", function(snapshot) {
            if(snapshot.key) {
                
                if (password === snapshot.val().password) {
                    
                    loginStatus = true;
                    user = snapshot.key;

                    if (snapshot.val().favoriteBreweries) {
                        favoriteBreweries = snapshot.val().favoriteBreweries;
                    }
                    $(".initial-log-in").hide();
                    $("#home-buttons").append("<li><a class='initial-log-in href='#'>Signout</a></li>");
                    $("#modal-login").modal("close");
                }
                
            }
        });
    })

    // Function for checking for favorite


    function createObj(response) {
           
        for (var i = 0; i < response.records.length; i++) {
            var city = response.records[i].fields.city;
            var brewery = response.records[i].fields.name_breweries;
            var beerName = response.records[i].fields.name;
            var beerStyle = response.records[i].fields.style_name;
            var beerCateg = response.records[i].fields.cat_name;
            if (response.records[i].fields.abv === 0) {
                var beerABV = "";
            } else {
                var beerABV = response.records[i].fields.abv;
                beerABV = beerABV.toFixed(2);
            }
            var beerDescr = response.records[i].fields.descript;
            var longitude = response.records[i].geometry.coordinates[0];
            var latitude = response.records[i].geometry.coordinates[1];
            var address = response.records[i].fields.address1;
            var website = response.records[i].fields.website;
            if (!beerObj[city]) {
                var beerInfo = {
                    name: beerName,
                    style: beerStyle,
                    category: beerCateg,
                    ABV: beerABV,
                    description: beerDescr
                };
                var cityInfo = {
                    [brewery]: {
                        beers: [beerInfo],
                        location: {
                            longitude,
                            latitude
                        },
                        address: address,
                        website: website,
                        breweryName: brewery
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
                    beers: [beerInfo],
                    location: {
                        longitude,
                        latitude
                    },
                    address: address,
                    website: website,
                    breweryName: brewery
                };
                beerObj[city][brewery] = breweryInfo;
            } else if (!beerObj[city][brewery].beers.name) {
                var beerInfo = {
                    name: beerName,
                    style: beerStyle,
                    category: beerCateg,
                    ABV: beerABV,
                    description: beerDescr
                };
                beerObj[city][brewery].beers.push(beerInfo);
            }
        }
    }

    function fillBreweries(beerObj) {
        var citiesList = Object.keys(beerObj).sort();
        for (var i = 0; i < citiesList.length; i++) {
            var newCol = $("<div>").addClass("col s12 m4")
            var newCard = $("<div>").addClass("card");
            var newCardContent = $("<div>").addClass("card-content transparent")
            
            var cityName = citiesList[i]

            var newCity = $("<h4>").addClass("card-title text-center p-2 ")

            newCity.text(cityName);
            newCardContent.append(newCity);
            newCard.append(newCardContent);
            newCol.append(newCard);

            var breweriesList = Object.keys(beerObj[cityName]).sort();

            for (var j = 0; j < breweriesList.length; j++) {
                breweryName = breweriesList[j];
                var newBrewery = $("<a>").addClass("modal-trigger brewery-link").val(breweryName).attr("id", cityName).attr("href", "#modal-fixed-footer");
                newBrewery.text(breweryName);
                newBrewery.append("<br>");
                newCardContent.append(newBrewery);
            }

            $("#cities-breweries-list").append(newCol);
        }
    }

    // Initialize and add the map
    function initMap(lat, lng) {
        // The location of the Brewery
        var breweryLoc = {lat, lng};
        // The map, centered at the Brewery
        var map = new google.maps.Map(
            document.getElementById('mapDiv'), {zoom: 14, center: breweryLoc});
        // The marker, positioned at the Brewery
        var marker = new google.maps.Marker({position: breweryLoc, map: map});
    }

    $(window).scroll(function(){
  
        if ($(window).scrollTop()>300){
            $('nav').addClass('black');
        } else{
            $('nav').removeClass('black');
        }
  
    });

    $(".modal").modal();

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {

        createObj(response)
        
        fillBreweries(beerObj)

        var currentBrewery;
    
        $(".brewery-link").on("click", function() {
            returned = beerObj[$(this).attr("id")][$(this).val()];
            currentBrewery = returned;
            var brewNameDiv = $("<h1>").attr("id", "breweryName").text(returned.breweryName);
            console.log(favoriteBreweries);
            if (loginStatus) {
                if(favoriteBreweries.indexOf(returned.breweryName) === -1 ) {
                    brewNameDiv.append("&nbsp&nbsp&nbsp<a class='btn-floating black'><i class='medium material-icons favorite'>star_border</i></a>");
                } else {
                    brewNameDiv.append("&nbsp&nbsp&nbsp<a class='btn-floating yellow'><i class='medium material-icons favorite'>star</i></a>");
                }
            } else {
                brewNameDiv.append("&nbsp&nbsp&nbsp<a class='btn-floating black'><i class='medium material-icons favorite'>star_border</i></a>");
            }
            var brewAddressDiv = $("<h6>").attr("id", "breweryAddress").text(returned.address);
            var breweryLink = $("<a>").attr("href", returned.website).attr("target", "_blank").text(returned.website);
            var brewLinkDiv = $("<div>").attr("id", "breweryLink").append(breweryLink);
    
            $("#beerInfoHeader").append(brewNameDiv);
            $("#addressDiv").append(brewAddressDiv);
    
            var beerList = returned.beers;
            for (i = 0; i < beerList.length; i++) {
                var newRow = $("<tr>");
                var newName = $("<td>").text(beerList[i].name);
                var newStyle = $("<td>").text(beerList[i].style);
                var newCateg = $("<td>").text(beerList[i].category);
                var newAlcPerc = $("<td>").text(beerList[i].ABV);
                var newDescr = $("<td>").text(beerList[i].description);
                newRow.append(newName, newStyle, newCateg, newAlcPerc, newDescr);
                $("tbody").append(newRow);
            }

            var brewLat = returned.location.latitude;
            var brewLong = returned.location.longitude;

            initMap(brewLat, brewLong);

        });

        $(document).on("click", ".favorite", function() {
            if (loginStatus) {
                if (favoriteBreweries.indexOf(currentBrewery.breweryName) === -1) {
                    $("#beerInfoHeader").empty();
                    var brewNameDiv = $("<h1>").attr("id", "breweryName").text(currentBrewery.breweryName);
                    brewNameDiv.append("&nbsp&nbsp&nbsp<a class='btn-floating yellow'><i class='medium material-icons favorite'>star</i></a>");
                    favoriteBreweries.push(currentBrewery.breweryName);
                    database.ref("/users/" + user).update( {
                        favoriteBreweries: favoriteBreweries
                    });
                    $("#beerInfoHeader").append(brewNameDiv);
                } else {
                    $("#beerInfoHeader").empty();
                    var brewNameDiv = $("<h1>").attr("id", "breweryName").text(currentBrewery.breweryName);
                    brewNameDiv.append("&nbsp&nbsp&nbsp<a class='btn-floating black'><i class='medium material-icons favorite'>star_border</i></a>");
                    favoriteBreweries.splice(currentBrewery.breweryName, 1);
                    database.ref("/users/" + user).update( {
                        favoriteBreweries: favoriteBreweries
                    });
                    $("#beerInfoHeader").append(brewNameDiv);
                }
                
            } else {
                $("#loginStatus").text("You must be logged in to add a brewery to your favorite list!");
            }
        });
    
        $(".modal-close").on("click", function() {
            $("#beerInfoHeader").empty();
            $("#beerInfoBody").empty();
            $("#addressDiv").empty();
            $("#loginStatus").empty();
        });

    });
  
});