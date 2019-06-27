// var firebaseConfig = {
//   apiKey: "AIzaSyCQwhMpGPFS8wqCkRypCXUaVxOe2mZgml0",
//   authDomain: "test-7c38b.firebaseapp.com",
//   databaseURL: "https://test-7c38b.firebaseio.com",
//   projectId: "test-7c38b",
//   storageBucket: "test-7c38b.appspot.com",
//   messagingSenderId: "1084629551515",
//   appId: "1:1084629551515:web:ca74a9aa882f8a3c"
// };

// firebase.initializeApp(firebaseConfig);

// var database = firebase.database();
var beerObj = {};
var queryURL =
  "https://data.opendatasoft.com/api/records/1.0/search/?dataset=open-beer-database%40public-us&q=North+Carolina&rows=100&facet=city&facet=name_breweries";

$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {
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
      var beerInfo = {
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
      var cityInfo = {};
      breweryInfo[beerName] = beerInfo;
      cityInfo[brewery] = breweryInfo;
      beerObj[city] = cityInfo;
    } else if (!beerObj[city][brewery]) {
      var beerInfo = {
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
        style: beerStyle,
        category: beerCateg,
        ABV: beerABV,
        description: beerDescr
      };
      beerObj[city][brewery][beerName] = beerInfo;
      // TRYING TO ADD INDIVIDUAL BEER INFO TO BEEROBJ
      // beerObj[city][brewery][beerName]["style"].push(beerStyle);
      // beerObj[city][brewery][beerName]["category"].push(beerCateg);
      // beerObj[city][brewery][beerName]["ABV"].push(beerABV);
      // beerObj[city][brewery][beerName]["description"].push(beerDescr);
    }
  }

  // Add functions here
});

// Change "breweryName" to whatever the link or button id for the brewery is (under brewery list under city)
$("breweryNameId").on("click", function() {
  var brewHeaderDiv = $("<div>").attr("id", "brewHeader");
  var brewAddressDiv = $("<div>").attr("id", "brewAddress");
  var brewLinkDiv = $("<div>").attr("id", "brewLink");
  var newRow = $("<tr>");

  // ? How to access length of beer list ?
  for (i = 0; i < "thisbrewery.beers.length"; i++) {
    // beerObj needs to be built with each beer's info to complete this section
    var newName = $("<td>").text("name");
    var newStyle = $("<td>").text("style");
    var newCateg = $("<td>").text("category");
    var newAlcPerc = $("<td>").text("alc %");
    var newDescr = $("<td>").text("Description (if it exists)");
    newRow.append(newName, newStyle, newCateg, newAlcPerc, newDescr);
    $("tbody").append(newRow);
  }
});

console.log(beerObj);
