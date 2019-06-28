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
var city,
  brewery,
  beerName,
  beerStyle,
  beerCateg,
  beerABV,
  beerDescr,
  longitude,
  latitude,
  address,
  website,
  cityInfo,
  beerInfo,
  breweryInfo;
var queryURL =
  "https://data.opendatasoft.com/api/records/1.0/search/?dataset=open-beer-database%40public-us&q=North+Carolina&rows=100&facet=city&facet=name_breweries";

$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {
  for (var i = 0; i < response.records.length; i++) {
    city = response.records[i].fields.city;
    brewery = response.records[i].fields.name_breweries;
    beerName = response.records[i].fields.name;
    beerStyle = response.records[i].fields.style_name;
    beerCateg = response.records[i].fields.cat_name;
    beerABV = response.records[i].fields.abv;
    beerDescr = response.records[i].fields.descript;
    longitude = response.records[i].geometry.coordinates[0];
    latitude = response.records[i].geometry.coordinates[1];
    address = response.records[i].fields.address1;
    website = response.records[i].fields.website;
    if (!beerObj[city]) {
      cityInfo = {
        [brewery]: {
          beers: [beerName],
          location: {
            longitude,
            latitude
          },
          address: address,
          website: website,
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
      beerInfo = {
        name: beerName,
        style: beerStyle,
        category: beerCateg,
        ABV: beerABV,
        description: beerDescr
      };
      breweryInfo = {
        beers: [beerName],
        location: {
          longitude,
          latitude
        },
        address: address,
        website: website
      };

      beerObj[city][brewery] = breweryInfo;
      breweryInfo[beerName] = beerInfo;
    } else if (beerObj[city][brewery]["beers"].indexOf(beerName) === -1) {
      beerObj[city][brewery]["beers"].push(beerName);
      beerInfo = {
        name: beerName,
        style: beerStyle,
        category: beerCateg,
        ABV: beerABV,
        description: beerDescr
      };
      beerObj[city][brewery][beerName] = beerInfo;
    }
  }

  // Add functions here
  //console.log(Object.keys(beerObj.Asheville["Highland Brewing Company"]));
  //console.log(beerObj.Asheville);
  //   var breweryInfo = beerObj.Asheville["Highland Brewing Company"];
  //   console.log(breweryInfo.beers.length);
  //   for (var key in breweryInfo) {
  //     console.log(breweryInfo[key].length);
  //   }
  test(beerObj.Asheville["Highland Brewing Company"]);
});

// Change "breweryName" to whatever the link or button id for the brewery is (under brewery list under city)
//$(".breweryName").on("click",
function test(returned) {
  console.log(returned);
  var brewHeaderDiv = $("<div>")
    .attr("id", "brewHeader")
    .text(returned);
  var brewAddressDiv = $("<div>").attr("id", "brewAddress");
  var brewLinkDiv = $("<div>").attr("id", "brewLink");

  // ? How to access length of beer list ?
  var beerList = returned.beers;
  for (i = 0; i < beerList.length; i++) {
    // beerObj needs to be built with each beer's info to complete this section
    var newRow = $("<tr>");
    var newName = $("<td>").text(beerList[i].name);
    var newStyle = $("<td>").text(beerList[i].style);
    var newCateg = $("<td>").text(beerList[i].category);
    var newAlcPerc = $("<td>").text(beerList[i].ABV);
    var newDescr = $("<td>").text(beerList[i].description);
    newRow.append(newName, newStyle, newCateg, newAlcPerc, newDescr);
    $("tbody").append(newRow);
  }
}
//);

console.log(beerObj);
