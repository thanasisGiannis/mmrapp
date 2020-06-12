
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




function changeRoute(routeNum){
//	alert(routeNum.value);

	mainRoute=routeNum.value;
	queryRoute();
	return false;

}



function updateMod(modButton){
	
	mod = modButton;
	queryRoute();
	return false;	
}


function setDefault(){

	lg   = 'en';
	slat = 38.2466036;
	slon = 21.7361790;

	dlat = 38.2466404;
	dlon = 21.7361404;

	ts   = 1573735815;
	te   = ts + 10000000;//1573737192;
	mod  = 'pub'; // koumpia
	obj  = 'multi';
	skip;// = ['tram']; // checkbox

	return false;
}




function googleMapCallback(){
	initMap();
	initAutocomplete('spoint');
	initAutocomplete('epoint');
	return false;
}


// Initialize Map
function initMap() {

	var localmap = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center: {lat: 38.246639, lng: 21.734573},
          mapTypeId: 'terrain'
        });

	map = localmap;
	return false;
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
  return false;
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

	return false;
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

	return false;
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
	return false;
}

function toDate(unix_timestamp){

	if(unix_timestamp==0){
		return '-';
	}

	// Create a new JavaScript Date object based on the timestamp
	// multiplied by 1000 so that the argument is in milliseconds, not seconds.
	var date = new Date(unix_timestamp * 1000);
	// Hours part from the timestamp
	var hours = date.getHours();
	// Minutes part from the timestamp
	var minutes = "0" + date.getMinutes();
	// Seconds part from the timestamp
	var seconds = "0" + date.getSeconds();

	// Will display time in 10:30:23 format
	var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

	return formattedTime;
}

function drawLineMap(coordinates,colorMod,putMarkers,street,arrivalTime,leaveTime,waitTime,streetEnd,arrivalTimeEnd){


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


 	
	if(putMarkers){
/*
		if(arrivalTime == 0){
			arrivalTime = "-";
			waitTime = "-";
		}
*/
		var messageS = 'Street: ' + street + 
							'\nArrival Time: '+ toDate(arrivalTime)+
							'\nLeave Time: '+ toDate(leaveTime)+
							'\nWait Time: '+ waitTime +
							'\nTransport: '+ colorMod;

		var markerS = new google.maps.Marker({
			 position: route[0],
			 map: map,
			title: messageS
		  });

		var messageE = 'Street: ' + streetEnd + 
							'\nArrival Time: '+ toDate(arrivalTimeEnd);

		var markerE = new google.maps.Marker({
			 position: route[route.length-1],
			 map: map,
			 title: messageE
		  });
		markerS.setMap(map);
		markerE.setMap(map);
		globalMarkerMap.push(markerS);
		globalMarkerMap.push(markerE);
	}

	polyMap.setMap(map);

	globalPolyMap.push(polyMap);

	lineExists=1;
	return false;

}

function removeDirections(){


	document.getElementById("directions").innerHTML='';
	return false;
}



function addDirections(type,street,arrivalTime,leaveTime,waitTime,streetE,arrivalTimeE){


	outputMessage = "Street: "+street+"\n"+
						 "Arrival Time: "+arrivalTime+"\n"+
						 "Leave Time: "+leaveTime + "\n"+
						 "Wait Time: "+waitTime + "\n"+
						 "Using: " +type+"\n";

	var node = document.createElement("P");                 // Create a <li> node
	var textnode = document.createTextNode(outputMessage);         // Create a text node
	node.appendChild(textnode);                              // Append the text to <li>
	document.getElementById("directions").appendChild(node);     // Append <li> to <ul> with id="myList" 

	return false;
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

	if(mainRoute>=numRoutes){
		mainRoute = numRoutes-1;
	}

	for(var j=0; j<numRoutes; j++){
		if(j==mainRoute){
			continue;
		}
		numIter = jsonRoutes.routes[j].legs.length;
		for(var i=0; i<numIter; i++){
			var route = jsonRoutes.routes[j].legs[i].coordinates;
			var type  = jsonRoutes.routes[j].legs[i].type;
			
			drawLineMap(route,'',false,"","","","","","");
		}
	}

	/* Draw lines with colors */
	var j=mainRoute;
	numIter = jsonRoutes.routes[j].legs.length;
	
	removeDirections();
	for(var i=0; i<numIter; i++){
		var route = jsonRoutes.routes[j].legs[i].coordinates;
		var type  = jsonRoutes.routes[j].legs[i].type;
		
		arrivalTime = jsonRoutes.routes[j].legs[i].extra_data[0][1];
		
		var waitTime    = jsonRoutes.routes[j].legs[i].extra_data[0][2];//leaveTime-arrivalTime;
		var leaveTime   = arrivalTime + waitTime;//jsonRoutes.routes[j].legs[i].extra_data[0][1];
		var street = jsonRoutes.routes[j].legs[i].extra_data[0][0];
		if(i==0){
			arrivalTime=0;
		}

		var streetE = jsonRoutes
							.routes[j]
							.legs[i]
							.extra_data[jsonRoutes.routes[j].legs[i].extra_data.length-1][0];

		var arrivalTimeE = jsonRoutes
							.routes[j]
							.legs[i]
							.extra_data[jsonRoutes.routes[j].legs[i].extra_data.length-1][1];

		/* + street,arrivalTime,leaveTime,waitTime */
		drawLineMap(route,type,true,street,arrivalTime,leaveTime,waitTime,streetE,arrivalTimeE);

		
		addDirections(type,street,arrivalTime,leaveTime,waitTime,streetE,arrivalTimeE);

	}


	/* reset html form */
	switch(numRoutes) {
		  case 2:
			document.getElementById("routeNum1").disabled=false;
			document.getElementById("routeNum2").disabled=false;
			document.getElementById("routeNum3").disabled=true;
			
			break;
		  case 3:
			document.getElementById("routeNum1").disabled=false;
			document.getElementById("routeNum2").disabled=false;
			document.getElementById("routeNum3").disabled=false;
			break;
		  default:
			document.getElementById("routeNum1").disabled=false;
			document.getElementById("routeNum2").disabled=true;
			document.getElementById("routeNum3").disabled=true;
		} 
		var routeNumUp=mainRoute+1;
		document.getElementById("routeNum"+routeNumUp).checked=true;

	return false;	
}

