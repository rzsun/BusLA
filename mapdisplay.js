/*
 * globals
 */
var map;
var infowindow = new google.maps.InfoWindow({maxWidth: 350});
var businfo = new google.maps.InfoWindow({maxWidth: 100, pixelOffset: new google.maps.Size(0, -5)});
var routePaths = [];
const NUM_ROUTES = 11;


/*
 * initializeMap initializes the map
 */
function initializeMap() {
    var mapOptions = {
        center: new google.maps.LatLng(34.0722, -118.4441), // map centered at UCLA, go Bruins!
        zoom: 12
    };
    map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
    routePaths[0] = drawRoute("data/maproutes/big_blue_bus_1.json", "#186BCB");
    routePaths[1] = drawRoute("data/maproutes/big_blue_bus_12.json", "#FFA617");
    routePaths[2] = drawRoute("data/maproutes/big_blue_bus_2.json", "#FFF824");
    routePaths[3] = drawRoute("data/maproutes/big_blue_bus_3.json", "#E53515");
    routePaths[4] = drawRoute("data/maproutes/culver_city_6.json", "#E32B7D");
    routePaths[5] = drawRoute("data/maproutes/metro_20.json", "#12BEFF");
    routePaths[6] = drawRoute("data/maproutes/metro_2_302.json", "#8143F7");
    routePaths[7] = drawRoute("data/maproutes/metro_534.json", "#3E1CFF");
    routePaths[8] = drawRoute("data/maproutes/metro_720.json", "#06C472");
    routePaths[9] = drawRoute("data/maproutes/metro_761.json", "#A9F22C");
    routePaths[10] = drawRoute("data/maproutes/metro_expo_806.json", "#FA5204");
    drawEvents("data/events.json");
}

/*
 * drawRoute creates a Google Maps Polyline from a JSON with the bus route
 * and stores a route object as a global variable
 * @param string filePath: path to JSON bus route
 * @param string color: hex color of the path
 * @returns routeObject
 */
function drawRoute(filePath, color) {
    var routeObject = {};
    $.getJSON(filePath, function(routeJSON) {
        var routeCoordinates = [];
        for (i in routeJSON.bus_stops) {
            routeCoordinates[i] = new google.maps.LatLng(
                    routeJSON.bus_stops[i].lat, routeJSON.bus_stops[i].lon);
        }
        routeObject.polyline = new google.maps.Polyline({
            path: routeCoordinates,
            geodesic: true,
            strokeColor: color,
            strokeOpacity: 0.9,
            strokeWeight: 10
        });
        routeObject.polyline.setMap(map);
        routeObject.name = routeJSON.route_name;
        // event listener to hide all other routes on click
        google.maps.event.addListener(routeObject.polyline, 'click', function() {
            for(var i = 0; i < NUM_ROUTES; i++)
                routePaths[i].polyline.setOptions({strokeOpacity: 0.35});
            routeObject.polyline.setOptions({strokeOpacity: 0.9});
        });
        // event listener to show name of route on mouseover
        google.maps.event.addListener(routeObject.polyline, 'mouseover', function(event) {
            businfo.setContent(routeObject.name);
            businfo.setPosition(event.latLng);
            businfo.open(window.map);
        });
        google.maps.event.addListener(routeObject.polyline, 'mousemove', function(event) {
            businfo.setPosition(event.latLng);
        });
        google.maps.event.addListener(routeObject.polyline, 'mouseout', function(event) {
            businfo.close();
        });
    });
    return routeObject;
}

function drawEvents(filePath) {
    $.getJSON(filePath, function(eventJSON) {
        for (var i = 0; i < eventJSON.length; i++) {
            addMarker(eventJSON[i]);
        }
    });
}

function addMarker(place) {
    /* TODO: add more place fields to description */
    var contentString = '<div id="content">' +
            '<h2>' + place.name + '</h2>' +
            '<h3>' + place.district + '</h3>' +
            '<p>' + place.description + '</p></div>';
    var pinIcon = new google.maps.MarkerImage(
            "img/pinicons/" + place.type + ".png",
            null, /* size is determined at runtime */
            null, /* origin is 0,0 */
            null, /* anchor is bottom center of the scaled image */
            new google.maps.Size(22, 29)
            );
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(place.lat, place.lng),
        map: map,
        title: place.name,
        draggable: false,
        icon: pinIcon
    });
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(contentString);
        infowindow.open(window.map, marker);
    });
}

google.maps.event.addDomListener(window, 'load', initializeMap);
