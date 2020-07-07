
// Initialize and add the map
var map;

// Global Variables for accessing data
// default dummy values
var lg   = 'en';
var slat;// = 38.2466036;
var slon;// = 21.7361790;

var dlat;// = 38.2466404;
var dlon;// = 21.7361404;

var contextLatLng;

var ts   = 1592487000;// 1592235600;
var te   ;//= ts + 10000000;//1573737192;
var mod  = 'pub'; // koumpia
var obj  = 'multi';
var skip ;//= ['bus'];//x=  ['tram'];//['bus']; // checkbox
var globalPolyMap=[];
var globalMarkerMap=[];

var lineExists = 0;
var mainRoute=0;
var contextMenuDisplayed = false;

var contextMenuSpoint = undefined;
var contextMenuDpoint = undefined;

function changeRoute(routeNum){
//	alert(routeNum.value);

	mainRoute=routeNum.value;
	queryRoute();
	return false;

}



function updateMod(modButton){
	
	mainRoute=0;
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





	var d = new Date();
  	var ms = d.getTime();	
	ts = Math.round(ms/1000); // round to nearest second

//	ts = 1573737192;
	te;//   = ts + 10000000;//1573737192;
	mod  = 'pub'; // koumpia
	obj  = 'multi';
	skip;// = ['tram']; // checkbox

	return false;
}




function googleMapCallback(){
	initMap();
	initAutocomplete('spoint');
	initAutocomplete('epoint');
	setDefault();
	getLocation();
	return false;
}


function myPositionInMap(position) {

	/* Fill in the Starting Point with the user's location */
	slat = position.coords.latitude;
	slon = position.coords.longitude;

//	slat = 38.2466036;
//	slon = 21.7361790;

	var route = [];
	route.push({lat: slat, lng: slon});



	var googleURL1 = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=slat,slon&key=AIzaSyDxth0qsM28RlcY8gF8IaPDfBxPRL_GM1I';

	var HttpreqGoogleS = new XMLHttpRequest(); // a new request
	HttpreqGoogleS.open("GET",googleURL1,false);
	HttpreqGoogleS.send();
	var jsonSpoint = JSON.parse(HttpreqGoogleS.responseText);


	var messageS = jsonSpoint.results[0].formatted_address ; //'You are here';
	var markerS = new google.maps.Marker({
			 position: route[0],
			 map: map,
			title: messageS
		 });


	document.getElementById("spoint").value=messageS;
	document.getElementById("spoint").placeholder=messageS;


}
function errorGeolocation(err){
	console.log(err);
}


function getLocation() {
  if (navigator.geolocation) {
	//console.log('hey');
   navigator.geolocation.getCurrentPosition(myPositionInMap,errorGeolocation,{timeout:1000});
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}


function sPointSetMenu(){


	if (contextMenuDisplayed == true){
		  		 var menuBox = document.getElementById("contextGoogleMapsMenu");
				 menuBox.style.display = "none";
	}


	var latLng = contextLatLng.toString(); 
	latLng = latLng.replace('(','');
	latLng = latLng.replace(')','');

	latLng = latLng.split(",");
	console.log(latLng);

	var googleURL1 = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ latLng +'&key=AIzaSyDxth0qsM28RlcY8gF8IaPDfBxPRL_GM1I';

	var HttpreqGoogleS = new XMLHttpRequest(); // a new request
	HttpreqGoogleS.open("GET",googleURL1,false);
	HttpreqGoogleS.send();
	var jsonSpoint = JSON.parse(HttpreqGoogleS.responseText);

	console.log(HttpreqGoogleS.responseText);

	if(contextMenuSpoint!=undefined){
		contextMenuSpoint.setMap(null);
	}

	var messageS = jsonSpoint.results[0].formatted_address ; //'You are here';
	var markerS = new google.maps.Marker({
			 position: contextLatLng,
			 map: map,
			title: messageS
		 });

	globalMarkerMap.push(markerS);

	contextMenuSpoint=markerS;

	document.getElementById("spoint").value=messageS;
	document.getElementById("spoint").placeholder=messageS;




	//alert('spoint set');
}

function dPointSetMenu(){

	if (contextMenuDisplayed == true){
		  		 var menuBox = document.getElementById("contextGoogleMapsMenu");
				 menuBox.style.display = "none";
	}

	var latLng = contextLatLng.toString(); 
	latLng = latLng.replace('(','');
	latLng = latLng.replace(')','');

	latLng = latLng.split(",");
	console.log(latLng);

	var googleURL1 = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ latLng +'&key=AIzaSyDxth0qsM28RlcY8gF8IaPDfBxPRL_GM1I';

	var HttpreqGoogleS = new XMLHttpRequest(); // a new request
	HttpreqGoogleS.open("GET",googleURL1,false);
	HttpreqGoogleS.send();
	var jsonSpoint = JSON.parse(HttpreqGoogleS.responseText);

	console.log(HttpreqGoogleS.responseText);

	if(contextMenuDpoint!=undefined){
		contextMenuDpoint.setMap(null);
	}


	var messageS = jsonSpoint.results[0].formatted_address ; //'You are here';
	var markerS = new google.maps.Marker({
			 position: contextLatLng,
			 map: map,
			title: messageS
		 });

	globalMarkerMap.push(markerS);
	contextMenuDpoint=markerS;

	document.getElementById("epoint").value=messageS;
	document.getElementById("epoint").placeholder=messageS;



}


// Initialize Map
function initMap() {

	var localmap = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center: {lat: 38.246639, lng: 21.734573},
          mapTypeId: 'terrain'
        });

	map = localmap;


	map.addListener('rightclick', function(e) {


		contextLatLng = e.latLng;
	
		var menuBox = document.getElementById("contextGoogleMapsMenu");
		var localmap = document.getElementById("map");		
		//menuBox.style.left = left + "px";
		//menuBox.style.top  = top + "px";
		var leftS = localmap.getBoundingClientRect().left + e.pixel.x;
		var topS  = localmap.getBoundingClientRect().top  + e.pixel.y;
		
		menuBox.style.left = leftS + "px";
		menuBox.style.top  = topS  + "px";

	
		menuBox.style.display = "block";
		contextMenuDisplayed = true;
 
	});



	map.addListener("click", function (e)
	{
		if (contextMenuDisplayed == true)
	 	{
	  		 var menuBox = document.getElementById("contextGoogleMapsMenu");
			 menuBox.style.display = "none";
		}
	});

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




function addDirections(type,street,arrivalTime,leaveTime,waitTime,streetE,arrivalTimeE, desc, distance, travel_time, walk_time){


	   leaveTime = toDate(leaveTime);
		arrivalTime = toDate(arrivalTime);
		arrivalTimeE = toDate(arrivalTimeE);


		walk_time = Number(walk_time);
		var h = Math.floor(walk_time / 3600);
		var m = Math.floor(walk_time % 3600 / 60);
		var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours") : "";
		var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes") : "";
		var outputwalk_time =  hDisplay + mDisplay; 

		
		travel_time = Number(travel_time);
		h = Math.floor(travel_time / 3600);
		m = Math.floor(travel_time % 3600 / 60);
		hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours") : "";
		mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes") : "";
		var outputtravel_time =  hDisplay + mDisplay; 

		distance = distance/ 1000;
		distance = distance.toFixed(1) + "km";
		//alert( desc + distance+ travel_time+ walk_time);
		var testing = false;
		if (!testing && type === "walk"){
					outputMessage = "Walk to "+streetE +
										 "\nDept. Time: "+leaveTime+ 
										 "\nTravel Time: "+ outputwalk_time + 
										 "\nDistance: "+distance;
		}else if ( !testing &&  type === "bus" ){
			//var desc = "Dromologio Tade";
			outputMessage = desc + " \nBus to " + streetE +
								 "\nDept. Time: "+leaveTime + " "+
								 "\nTravel Time: "+ outputtravel_time + 
								 "\nDistance: "+distance;

		}else if ( !testing &&  type === "car" ){
			outputMessage = "Drive to " + streetE +
								 "\nDept. Time: "+leaveTime + " "+
								 "\nTravel Time: "+ outputtravel_time + 
								 "\nDistance: "+distance;

		}else if ( !testing &&  type === "rail" ){
			//var desc = "Dromologio Tade";
			outputMessage = desc + " \nRail to " + streetE +
								 "\nDept. Time: "+leaveTime + " "+
								 "\nTravel Time: "+ outputtravel_time;

		}else if ( !testing &&  type === "subway" ){
			//var desc = "Dromologio Tade";
			outputMessage = desc + " \nSubway to " + streetE +
								 "\nDept. Time: "+leaveTime + " "+
								 "\nTravel Time: "+ outputtravel_time + 
								 "\nDistance: "+distance;

		}else if ( !testing &&  type === "tram" ){
			//var desc = "Dromologio Tade";
			outputMessage = desc + " \nTram to " + streetE +
								 "\nDept. Time: "+leaveTime + " "+
								 "\nTravel Time: "+ outputtravel_time + 
								 "\nDistance: "+distance;


		}else if ( !testing &&  type === "ferry" ){
			//var desc = "Dromologio Tade";
			outputMessage = desc + " \nFerry to " + streetE +
								 "\nDept. Time: "+leaveTime + " "+
								 "\nTravel Time: "+ outputtravel_time + 
								 "\nDistance: "+distance;

		}else if ( !testing &&  type === "trolleybus" ){
			//var desc = "Dromologio Tade";
			outputMessage = desc + " \nTorlleybus to " + streetE +
								 "\nDept. Time: "+leaveTime + " "+
								 "\nTravel Time: "+ outputtravel_time + 
								 "\nDistance: "+distance;

	   }else{
			outputMessage = "Total Time to Destination: " + outputtravel_time + "\nTotal Distance to Destination:" + distance;
//			outputMessage = "From: " + street + " To:" + streetE + " by " + type;
		}


	var node = document.createElement("pre");
	var textnode = document.createTextNode(outputMessage);
	node.appendChild(textnode);                           
	document.getElementById("directions").appendChild(node);

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


	/* Clear Map from Routes*/
	var numIter = globalPolyMap.length;
	for(var i=0;i<numIter;i++){
		globalPolyMap[i].setMap(null);
	}
	
	/* Clear Map from Markers*/
	numIter = globalMarkerMap.length;
	console.log(numIter);
	for(var i=0;i<numIter;i++){
		globalMarkerMap[i].setMap(null);
	}


	

	// Draw polylines on google map 

	var numRoutes = jsonRoutes.routes.length; 


/*
	var outputvar = "";
	for(var i=0;i<numRoutes;i++){
		for(var j=0;j<jsonRoutes.routes[i].object.length;j++){
			outputvar = outputvar + " "+ i+ " " + jsonRoutes.routes[i].object[j];
		}

	}

	alert(outputvar);
*/

	if(mainRoute>=numRoutes){
		mainRoute = numRoutes-1;
	}



/* alternative routes, if want to be seen un-comment this section */
/*
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
*/
	/* Draw lines with colors */
	var j=mainRoute;

	removeDirections();
	numIter = jsonRoutes.routes[j].legs.length;
	var totalTimeTravel = jsonRoutes.routes[j].travel_time;
	var totalDistanceTravel = jsonRoutes.routes[j].distance;
	//alert(totalTimeTravel);
	addDirections("total","","","","","","","", totalDistanceTravel, totalTimeTravel, "");
	for(var i=0; i<numIter; i++){
		var route = jsonRoutes.routes[j].legs[i].coordinates;
		var type  = jsonRoutes.routes[j].legs[i].type;
		

		arrivalTime = jsonRoutes.routes[j].legs[i].extra_data[0][1];
		
		var waitTime    = jsonRoutes.routes[j].legs[i].extra_data[0][2];//leaveTime-arrivalTime;
		var leaveTime   = arrivalTime + waitTime;//jsonRoutes.routes[j].legs[i].extra_data[0][1];
		var street = jsonRoutes.routes[j].legs[i].extra_data[0][0];


		var desc = jsonRoutes.routes[j].legs[i].desc;
		var distance = jsonRoutes.routes[j].legs[i].distance;
		var travel_time = jsonRoutes.routes[j].legs[i].travel_time;
		var walk_time = jsonRoutes.routes[j].legs[i].travel_time;
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

		addDirections(type,street,arrivalTime,leaveTime,waitTime,streetE,arrivalTimeE, desc, distance, travel_time, walk_time);
		/* add desc, distance, travel_time, walk_time */
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

		var routeNumUp = mainRoute+1;
		document.getElementById("routeNum"+routeNumUp).selected=true;


		/* clear dropdown route directions */
		document.getElementById("routeNum1").innerText = "";				
		document.getElementById("routeNum2").innerText = "";				
		document.getElementById("routeNum3").innerText = "";				

		/* naming the buttons */
		switch(numRoutes){
			/* for route 1 button */
			case 1:
				document.getElementById("routeNum1").innerText = "Earliest Arrival / Minimum Number of Transfers";				
				document.getElementById("routeNum1").hidden = false;				
				document.getElementById("routeNum2").hidden = true;				
				document.getElementById("routeNum3").hidden = true;				
				break;
			/* for route 2 button */
			case 2:
				document.getElementById("routeNum1").innerText = "Earliest Arrival";				
				document.getElementById("routeNum2").innerText = "Minimum Number of Transfers";				
		
				document.getElementById("routeNum1").hidden = false;				
				document.getElementById("routeNum2").hidden = false;				
				document.getElementById("routeNum3").hidden = true;				
				break;
			/* for route 3 button */
			case 3:
				document.getElementById("routeNum1").innerText = "Earliest Arrival";				
				document.getElementById("routeNum2").innerText = "Minimum Number of Transfers";				
				document.getElementById("routeNum3").innerText = "Intermediate Solution";		

				document.getElementById("routeNum1").hidden = false;				
				document.getElementById("routeNum2").hidden = false;				
				document.getElementById("routeNum3").hidden = false;						
				break;
			default:
				alert();
		}


	/* map cenetering */

	var clat = Math.abs(slat+dlat)/2;
	var clon = Math.abs(slon+dlon)/2;

	map.setCenter(new google.maps.LatLng(clat, clon));
	map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
	
	/* map zooming to fit spoint and dpoint */

	var maxLat;
	var maxLon;
	var minLat;
	var minLon;

	

	var j=mainRoute;
	var latlngb = [];
	numIter = jsonRoutes.routes[j].legs.length;
	for(var i=0; i<numIter; i++){
		route = jsonRoutes.routes[j].legs[i].coordinates;
		for(var k = 0 ; k<route.length;k++){
			var coor = route[k];

			if (i==0 && k==0){
				maxLat = coor[0];
				minLat = coor[0];

				maxLon = coor[1];
				minLon = coor[1];
				continue;
			}


			if(maxLat < coor[0]){
				maxLat = coor[0];		
			}
			if(minLat > coor[0]){
				minLat = coor[0];		
			}

			if(maxLon < coor[1]){
				maxLon = coor[1];		
			}
			if(minLon > coor[1]){
				minLon = coor[1];		
			}



		}
	}



	var latlngb = [
		 new google.maps.LatLng(maxLat, maxLon),
		 new google.maps.LatLng(minLat, minLon),
	]; 

	var latlngbounds = new google.maps.LatLngBounds();

	for (var i = 0; i < latlngb.length; i++) {
		 latlngbounds.extend(latlngb[i]);
	}
	map.fitBounds(latlngbounds);

	return false;	
}

