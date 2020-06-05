
// Initialize and add the map
var map;

// Global Variables for accessing data
// default dummy values
var lg   = 'en';
var slat = 38.2466036;
var slon = 21.7361790;

var dlat = 38.2466404;
var dlon = 21.7361404;

var ts   = 1573735815;
var te   = ts + 10000000;//1573737192;
var mod  = 'pub'; // koumpia
var obj  = 'multi';
var skip;// = ['tram']; // checkbox
var globalPolyMap=[];
var globalMarkerMap=[];

var lineExists = 0;
var mainRoute=0;



function updateMod(modButton){
	
	mod = modButton;
	queryRoute();	
}






function googleMapCallback(){
	initMap();
	initAutocomplete('spoint');
	initAutocomplete('epoint');

}


// Initialize Map
function initMap() {

	var localmap = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center: {lat: 38.246639, lng: 21.734573},
          mapTypeId: 'terrain'
        });

	map = localmap;
/*
  // The location of Uluru
  var uluru = {lat: 38.246639, lng: 21.734573};
  // The map, centered at Uluru
  map = new google.maps.Map(
      document.getElementById('map'), {zoom: 12, center: uluru});
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({position: uluru, map: map});
*/
}

// Autocomplete forms
var placeSearch,autocomplete;
var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

function initAutocomplete(id) {
  // Create the autocomplete object, restricting the search predictions to
  // geographical location types.
  autocomplete = new google.maps.places.Autocomplete(
      document.getElementById(id), {types: ['geocode']});

  // Avoid paying for data that you don't need by restricting the set of
  // place fields that are returned to just the address components.
  autocomplete.setFields(['address_component']);

  // When the user selects an address from the drop-down, populate the
  // address fields in the form.
  autocomplete.addListener('place_changed', fillInAddress);
}


function fillInAddress() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();

  for (var component in componentForm) {
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
  }

  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }
}
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle(
          {center: geolocation, radius: position.coords.accuracy});
      autocomplete.setBounds(circle.getBounds());
    });
  }
}


// Do the search query to backend
function updateRoute(spoint,epoint){

	if (spoint.value == '' || epoint.value==''){
		alert('Please type Starting Point and Destination')
		return;
	}


	var googleURL = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDxth0qsM28RlcY8gF8IaPDfBxPRL_GM1I'

	var googleURL1 = googleURL + '&address=' + spoint.value;
	var googleURL2 = googleURL + '&address=' + epoint.value;


	var HttpreqGoogleS = new XMLHttpRequest(); // a new request
	HttpreqGoogleS.open("GET",googleURL1,false);
	HttpreqGoogleS.send();

	var HttpreqGoogleE = new XMLHttpRequest(); // a new request
	HttpreqGoogleE.open("GET",googleURL2,false);
	HttpreqGoogleE.send();

	var jsonSpoint = JSON.parse(HttpreqGoogleS.responseText);
	var jsonEpoint = JSON.parse(HttpreqGoogleE.responseText);
	

	slat = jsonSpoint.results[0].geometry.location.lat;
	slon = jsonSpoint.results[0].geometry.location.lng;

	dlat = jsonEpoint.results[0].geometry.location.lat;
	dlon = jsonEpoint.results[0].geometry.location.lng;
	
	queryRoute();
	
}


function drawLineMap(coordinates,colorMod){


	var color;

	switch(colorMod) {
	  case 'car':
		color='#66bb6a';
		break;
	  case 'rail':
		color='#607D8B';
		break;
	  case 'walk':
		color='#607D8B';
		break;
	  case 'pubcar':
		color='#607D8B';
		break;
	  case '':
		color='#202020';
		break;
	  default:
		color='#66bb6a';
	} 


	var route=[];
	var routeIter = coordinates.length;
	for (var i=0; i<routeIter; i++){
		route.push({lat: coordinates[i][0], lng: coordinates[i][1]});

	}


	var polyMap = new google.maps.Polyline({
          path: route,
          geodesic: true,
          strokeColor:color,
          strokeOpacity: 1.0,
          strokeWeight: 5
        });

	var markerS = new google.maps.Marker({
		 position: route[0],
		 map: map,
		 title: 'Start of ' + colorMod
	  });

	var markerE = new google.maps.Marker({
		 position: route[route.length-1],
		 map: map,
		 title: 'End of ' + colorMod
	  });
	markerS.setMap(map);
	markerE.setMap(map);
	globalMarkerMap.push(markerS);
	globalMarkerMap.push(markerE);


	polyMap.setMap(map);

	globalPolyMap.push(polyMap);

	lineExists=1;
	//return false;
}

function queryRoute(){

	var Url = 'http://150.140.143.218:8000/getJourneys/';
	
	var inputHttp =      "lg="+lg
						+"&"+"slat="+slat
						+"&"+"slon="+slon
						+"&"+"dlat="+dlat
						+"&"+"dlon="+dlon
						+"&"+"ts="+ts
						+"&"+"te="+te
						+"&"+"mod="+mod
						+"&"+"obj="+obj
						+"&"+"skip="+skip;


	var mmrappReq = Url + '?' + inputHttp;
	var Httpreq = new XMLHttpRequest(); // a new request
	Httpreq.open("GET",mmrappReq,false);
	Httpreq.send();

	var jsonRoutes = JSON.parse(Httpreq.responseText);

	var success = jsonRoutes.header.success;
	
	if (success==0){
		alert('No route');
		return false;
	}


	if(lineExists > 0 ){

		/* Clear Map from Routes*/
		var numIter = globalPolyMap.length;
		for(var i=0;i<numIter;i++){
			globalPolyMap[i].setMap(null);
		}
		
		/* Clear Map from Markers*/
		numIter = globalMarkerMap.length;
		for(var i=0;i<numIter;i++){
			globalMarkerMap[i].setMap(null);
		}

	}


	// Draw polylines on google map 
	var numRoutes = jsonRoutes.routes.length; 
	for(var j=0; j<numRoutes; j++){
		if(j==mainRoute){
			continue;
		}
		numIter = jsonRoutes.routes[j].legs.length;
		for(var i=0; i<numIter; i++){
			var route = jsonRoutes.routes[j].legs[i].coordinates;
			var type = jsonRoutes.routes[j].legs[i].type;
			
			drawLineMap(route,'');
		}
	}

	/* Draw lines with colors */
	var j=mainRoute;
	numIter = jsonRoutes.routes[j].legs.length;
	for(var i=0; i<numIter; i++){
		var route = jsonRoutes.routes[j].legs[i].coordinates;
		var type  = jsonRoutes.routes[j].legs[i].type;
		
		drawLineMap(route,type);
	}

}

