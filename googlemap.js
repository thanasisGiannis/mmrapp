
// Initialize and add the map
var localmap;
// Global Variables for accessing data
// default dummy values
var lg;//   = 'en';
var slat;// = 38.2466036;
var slon;// = 21.7361790;

var dlat;// = 38.2466404;
var dlon;// = 21.7361404;

var contextLatLng;

var ts;//   = 1592487000;// 1592235600;
var te;   //= ts + 10000000;//1573737192;
var mod;//  = 'pub'; // koumpia
var obj;//  = 'multi';
var skip ;//= ['bus'];//x=  ['tram'];//['bus']; // checkbox
var globalPolyMap=[];
var globalMarkerMap=[];

var lineExists = 0;
var mainRoute=0;
var contextMenuDisplayed = false;
var queryLeg;

var contextMenuSpoint = undefined;
var contextMenuDpoint = undefined;
//var pointsInMap = 0;
var pointSinMap = false;
var pointDinMap = false;
var total_walk_travel_time=0; // total walking time in a route



/* profile data */
var userLoggedIn=false; // true or false if a user is logged in
var userProfile; // raw data about user
var userName;
var userMail;
var userCity;
var userCountry;



var longpress = false;



function userSignup(){


			var name     = document.getElementById("SUname").value;
			var password     = document.getElementById("SUpass").value;
			var passConf = document.getElementById("SUpassConf").value;
			var email     = document.getElementById("SUemail").value;
			var country  = document.getElementById("SUCountry").value;
			var city     = document.getElementById("SUCity").value;


			if(password === passConf){

				var jsonData = JSON.stringify({
											 "name"     : name,
											 "password" : password,
											 "email"	   : email,
											 "country"  : country,
											 "city"	   : city
											});

				var xmlhttp = new XMLHttpRequest();
				xmlhttp.onreadystatechange = function() {
																if (this.readyState == 4 && this.status == 200) {
																		//var userData = JSON.parse(this.responseText);
																		var res = JSON.parse(this.responseText);

																		if(res['error'] === "Success"){
																				console.log(res);
																				document.getElementById("username").value = name;
																				document.getElementById("userpass").value = password;
																				document.getElementById("username").innerHTML = name;
																				document.getElementById("userpass").innerHTML = password;

																				userLogInSubmit();
																				document.getElementById("signInButton").click();
																				//$('#profileModal').modal('toggle');

																		}
																		return false;
																	
																}
														};


				console.log("http://web.interreginvestment.eu/mmrp/signUpForm.php?data2b="+jsonData);
				xmlhttp.open("POST", "http://web.interreginvestment.eu/mmrp/signUpForm.php?data2b="+jsonData, true);
				xmlhttp.send();

			}
			return false;

}

function userLogOut(){

				
			document.getElementById("noLoggedIn").style.display="block";
			document.getElementById("LoggedIn").style.display="none";

			document.getElementById("LoggedInInside").innerHTML="";
			document.getElementById("userLoginLink").innerHTML="Login";

			document.getElementById("username").value ="";
			document.getElementById("userpass").value ="";

			return false;
}


function userLogInSubmit(){
/* user log in */
	var jsusername = document.getElementById("username").value;
	var jsuserpass = document.getElementById("userpass").value;
	

	var jsonData = JSON.stringify({
										 "email"   : jsusername,
										 "password": jsuserpass
										});

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
			var userData = JSON.parse(this.responseText);

				
			document.getElementById("noLoggedIn").style.display="none";
			document.getElementById("LoggedIn").style.display="block";

			document.getElementById("LoggedInInside").innerHTML="<p style='align:center'> <img src='./img/ic_profile.png'> <p>Hello " + userData.name +"! <br><br>"+userData.email + "</p><p>";
			document.getElementById("userLoginLink").innerHTML=userData.name;

			document.getElementById("username").value ="";
			document.getElementById("userpass").value ="";

			return false;
		}
	};


	
	xmlhttp.open("POST", "http://web.interreginvestment.eu/mmrp/logInForm.php?data2b="+jsonData, true);
	xmlhttp.send();



	return false;
}


function changeRoute(routeNum){
//	alert(routeNum.value);

	mainRoute=routeNum.value;
	queryRoute();
	return false;

}

function resetButtonColor(){
document.getElementById("trainButton").style.backgroundColor="#d8d8d8";
document.getElementById("walkButton").style.backgroundColor="#d8d8d8";
document.getElementById("carButton").style.backgroundColor="#d8d8d8";
document.getElementById("hybridButton").style.backgroundColor="#d8d8d8";

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

/*
	slat = 38.2466036;
	slon = 21.7361790;

	dlat = 38.2466404;
	dlon = 21.7361404;
*/
	slat = null;
	slon = null;

	dlat = null;
	dlon = null;




   /*    Default button     */
	/* --------------------- */
	mod  = 'pub'; // koumpia
	document.getElementById("trainButton").style.backgroundColor="#034200";
	/* --------------------- */



	/* settings date default */
	/* --------------------- */
	var d = new Date();
  	var ms = d.getTime();	
	ts = Math.round(ms/1000); // round to nearest second
	
	var month = d.getMonth() + 1;
	if (month < 10){
		month = "0"+month;
	}

	var day = d.getDate();
	if (day < 10){
		day = "0"+day;
	}

	document.getElementById("timeModal").value = ""+toDate(ts)+"";
	document.getElementById("dateModal").value = ""+d.getFullYear() +"-"+month+"-"+day;


	console.log('DateD: ' + d.getFullYear() +"-"+month+"-"+day);

//	document.getElementById("timeA").value = "";
//	document.getElementById("dateA").value = "";
	/* --------------------- */



	/* settings 3 routes asked default */
	/* ------------------------------- */
	obj  = 'ea';
	/* ------------------------------- */

	/* settings language */
	/* ----------------- */
	lg  = 'en';
	/* ----------------- */


	/* settings checkbox default */
	/* ------------------------- */
	document.getElementById("vehicleBus").checked = true;
	document.getElementById("vehicleSubway").checked = true;
	document.getElementById("vehicleTrain").checked = true;
	document.getElementById("vehicleTram").checked = true;
	document.getElementById("vehicleTrolley").checked = true;
	document.getElementById("vehicleBoat").checked = true;
	/* ------------------------- */



	/* settings checkbox default */
	/* ------------------------- */
	document.getElementById("maxWalkTime").value="30";
	document.getElementById("headMaxWalkTime").innerHTML = "Μaximum walking time: "+document.getElementById("maxWalkTime").value + "min";
	/* ------------------------- */


	return false;
}


function updateSettings(){

	/* settings date default */
	/* --------------------- */
	var timeD = document.getElementById("timeModal").value;
	var dateD = document.getElementById("dateModal").value;

	var hD = timeD.slice(0, 2); // hours
	var minD = timeD.slice(3, 5); // minutes

	var yD = dateD.slice(0, 4); // year
	var monthD = parseInt(dateD.slice(5, 7))-1; // month
	if(monthD > 9){
		monthD = ""+monthD;
	}else{
		monthD = "0"+monthD;
	}
	var dayD = dateD.slice(8, 10); // day

	var fullDateD = new Date(yD, monthD, dayD, hD, minD, "0","0");
	console.log("ts-: " + ts);
	console.log("te-: " + te);

	if(document.getElementById("labelDate").value=='D'){
		ts = fullDateD.getTime() / 1000;
		te = -1;
	}else{
		te = fullDateD.getTime() / 1000;
		ts = -1;
	}

	var dtest = new Date(te * 1000)
	console.log("Arrival date: "+ dtest);

	console.log("MonthD: "+ monthD);

	console.log("ts+: " + ts);
	console.log("te+: " + te);
	/* --------------------- */


	/* settings vehicle checkbox default */
	/* --------------------------------- */
	skip = [];
	if(document.getElementById("vehicleBus").checked == false){
		skip.push('bus');
		console.log('bus unckecked');
	}
	if(document.getElementById("vehicleSubway").checked == false){
		skip.push('subway');
	}
	if(document.getElementById("vehicleTrain").checked == false){
		skip.push('train');
	}
	if(document.getElementById("vehicleTram").checked == false){
		skip.push('tram');
	}
	if(document.getElementById("vehicleTrolley").checked == false){
		skip.push('trolley');
	}
	if(document.getElementById("vehicleBoat").checked == false){
		skip.push('boat');
	}
	/* --------------------------------- */



	/* settings routes checkbox default */
	/* -------------------------------- */

	var eaObj =  document.getElementById("eaCheckBox");
	var ldObj =  document.getElementById("ldCheckBox");


	if(eaObj.checked == true){
		obj  = 'ea'; 
	}
	if(ldObj.checked == true){
		obj  = 'minTran';
	}
	/* -------------------------------- */

	/* settings checkbox default */
	/* ------------------------- */
	//document.getElementById("maxWalkTime").value="30";
	//document.getElementById("headMaxWalkTime").innerHTML = "Μaximum walking time: "+document.getElementById("maxWalkTime").value + "min";
	/* ------------------------- */

	queryRoute();
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
			 map: localmap,
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
	navigator.geolocation.getCurrentPosition(myPositionInMap,errorGeolocation,{timeout:1000});
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}


function sPointSetMenu(){


	var menuBox = document.getElementById("contextGoogleMapsMenu");
	menuBox.style.display = "none";


	var latLng = contextLatLng.toString(); 
	latLng = latLng.replace('(','');
	latLng = latLng.replace(')','');
	
	var dest = latLng;

	latLng = latLng.split(",");
	console.log("sending to google: " + latLng);

	var googleURL1 = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ latLng +'&key=AIzaSyDxth0qsM28RlcY8gF8IaPDfBxPRL_GM1I';

	var HttpreqGoogleS = new XMLHttpRequest(); // a new request
	HttpreqGoogleS.open("GET",googleURL1,false);
	HttpreqGoogleS.send();
	var jsonSpoint = JSON.parse(HttpreqGoogleS.responseText);

	//console.log(HttpreqGoogleS.responseText);

	if(contextMenuSpoint!=undefined){
		contextMenuSpoint.setMap(null);
	}

	var messageS = jsonSpoint.results[0].formatted_address ; //'You are here';
	var markerS = new google.maps.Marker({
			 position: contextLatLng,
			 map: localmap,
			 icon:'./img/start.png',
			title: messageS
		 });

	globalMarkerMap.push(markerS);

	contextMenuSpoint=markerS;

	document.getElementById("spoint").value=messageS;
	document.getElementById("spoint").placeholder=messageS;

	console.log("Before spoint: "+latLng);

	console.log("spoint: " +  document.getElementById("spoint").value);
	latLng[0].replace(" ","");
	latLng[1].replace(" ","");

	slat = Number(latLng[0]);
	slon = Number(latLng[1]);
		
	if(pointDinMap == true){
		updateRoute(spoint,epoint);
		//updateRouteFromContextMenu(slat,slon,dlat,dlon);
		pointSinMap = true;
	}else{
		pointSinMap = true;
	}

	return false;
	//alert('spoint set');
}

function dPointSetMenu(){

	var menuBox = document.getElementById("contextGoogleMapsMenu");
	menuBox.style.display = "none";

	var latLng = contextLatLng.toString(); 
	latLng = latLng.replace('(','');
	latLng = latLng.replace(')','');
	
	var dest = latLng;

	latLng = latLng.split(",");
	//console.log(latLng);

	var googleURL1 = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ latLng +'&key=AIzaSyDxth0qsM28RlcY8gF8IaPDfBxPRL_GM1I';

	var HttpreqGoogleS = new XMLHttpRequest(); // a new request
	HttpreqGoogleS.open("GET",googleURL1,false);
	HttpreqGoogleS.send();
	var jsonSpoint = JSON.parse(HttpreqGoogleS.responseText);

	//console.log(HttpreqGoogleS.responseText);

	if(contextMenuDpoint!=undefined){
		contextMenuDpoint.setMap(null);
	}


	var messageS = jsonSpoint.results[0].formatted_address ; //'You are here';
	var markerS = new google.maps.Marker({
			 position: contextLatLng,
			 map: localmap,
			 icon:'./img/end.png',
			title: messageS
		 });

	globalMarkerMap.push(markerS);
	contextMenuDpoint=markerS;

	document.getElementById("epoint").value=messageS;
	document.getElementById("epoint").placeholder=messageS;

	latLng[0].replace(" ","");
	latLng[1].replace(" ","");
	dlat = Number(latLng[0]);
	dlon = Number(latLng[1]);
	if(pointSinMap == true){
		console.log(latLng);
		updateRoute(spoint,epoint);
		pointDinMap = true;
	}else{
		pointDinMap = true;
	}

	return false;
}


// Initialize Map
function initMap() {

/* OpenStreet Map */

	localmap = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center: {lat: 38.246639, lng: 21.734573},
          mapTypeId: "OSM"
        });


	localmap.mapTypes.set("OSM", new google.maps.ImageMapType({
                getTileUrl: function(coord, zoom) {
                    // See above example if you need smooth wrapping at 180th meridian
                    return "http://mmrp.interreginvestment.eu/pegasus/map/tiles/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
                },
                tileSize: new google.maps.Size(256, 256),
                name: "OpenStreetMap",
                maxZoom: 17
            }));

	localmap.addListener('rightclick', function(e) {


		contextLatLng = e.latLng;
	
		var menuBox = document.getElementById("contextGoogleMapsMenu");
		var localmap = document.getElementById("map");		

		var menuBoxWidth = menuBox.style.width;
		menuBoxWidth = parseInt(String(menuBoxWidth).replace('px',''));


		var menuBoxHeight = menuBox.style.height;
		menuBoxHeight = parseInt(String(menuBoxHeight).replace('px',''));
		


		var Xpos = parseInt(localmap.getBoundingClientRect().left + e.pixel.x);
		var Ypos  = parseInt(localmap.getBoundingClientRect().top  + e.pixel.y);

		var Xpos2 = Xpos;
		var Ypos2 = Ypos;

		if(Xpos  > localmap.getBoundingClientRect().right/2){
			Xpos2 = (Xpos - menuBoxWidth);
		}

		if(Ypos  > localmap.getBoundingClientRect().bottom/2){
			Ypos2 = Ypos2 - menuBoxHeight;
		}

		menuBox.style.left = Xpos2  + "px";
		menuBox.style.top  = Ypos2  + "px";
	
		menuBox.style.display = "block";
		contextMenuDisplayed = true;
 

	});


	localmap.addListener("click", function (e)
	{
			var timeOutSuccess = false;
			if(contextMenuDisplayed == false){
				setTimeout(function(){
					  
								contextLatLng = e.latLng;
							
								var menuBox = document.getElementById("contextGoogleMapsMenu");
								var localmap = document.getElementById("map");		

								var menuBoxWidth = menuBox.style.width;
								menuBoxWidth = parseInt(String(menuBoxWidth).replace('px',''));


								var menuBoxHeight = menuBox.style.height;
								menuBoxHeight = parseInt(String(menuBoxHeight).replace('px',''));
								


								var Xpos = parseInt(localmap.getBoundingClientRect().left + e.pixel.x);
								var Ypos  = parseInt(localmap.getBoundingClientRect().top  + e.pixel.y);

								var Xpos2 = Xpos;
								var Ypos2 = Ypos;

								if(Xpos  > localmap.getBoundingClientRect().right/2){
									Xpos2 = (Xpos - menuBoxWidth);
								}

								if(Ypos  > localmap.getBoundingClientRect().bottom/2){
									Ypos2 = Ypos2 - menuBoxHeight;
								}

								menuBox.style.left = Xpos2  + "px";
								menuBox.style.top  = Ypos2  + "px";
							
								menuBox.style.display = "block";
								contextMenuDisplayed = true;
								timeOutSuccess = true;
					
				 }, 1000);
			}

		if (contextMenuDisplayed == true)
	 	{
  			 contextMenuDisplayed = false;
	  		 var menuBox = document.getElementById("contextGoogleMapsMenu");
			 menuBox.style.display = "none";
		}

	});










return false;

/* Google Map */
	//var
   localmap = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center: {lat: 38.246639, lng: 21.734573},
          mapTypeId: 'roadmap'//'terrain'
        });

	//map = localmap;


	localmap.addListener('rightclick', function(e) {


		contextLatLng = e.latLng;
	
		var menuBox = document.getElementById("contextGoogleMapsMenu");
		var localmap_ = document.getElementById("map");		
		//menuBox.style.left = left + "px";
		//menuBox.style.top  = top + "px";
		var leftS = localmap_.getBoundingClientRect().left + e.pixel.x;
		var topS  = localmap_.getBoundingClientRect().top  + e.pixel.y;
		
		menuBox.style.left = leftS + "px";
		menuBox.style.top  = topS  + "px";

	
		menuBox.style.display = "block";
		contextMenuDisplayed = true;
 
	});



	localmap.addListener("click", function (e)
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


function updateRouteFromContextMenu(slat_,slon_,dlat_,dlon_){

	slat = slat_;
	slon = slon_;

	dlat = dlat_;
	dlon = dlon_;

	queryRoute();
	return false;
}


function updateRoute(spoint,epoint){

	if (spoint.value == '' || epoint.value==''){
		alert('Please type Starting Point and Destination');
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
	console.log("FROM UPDATEROUTE " + slat);
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
	var formattedTime = hours + ':' + minutes.substr(-2);// + ':' + seconds.substr(-2);

	return formattedTime;
}

function drawLineMap(coordinates,colorMod,putMarkers,street,arrivalTime,leaveTime,waitTime,streetEnd,arrivalTimeEnd,type,StartEnd){


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



		var testing = false;
		var imgSrcS = '';
		var imgSrcE = '';
		if (!testing && type === "walk"){
			imgSrcS = './img/walk3.png';
			imgSrcE = '';
		}else if ( !testing &&  type === "bus" ){
			imgSrcS = './img/bus.png';
			imgSrcE = '';
		}else if ( !testing &&  type === "car" ){
			imgSrcS = './img/car2m.png';
			imgSrcE = '';
		}else if ( !testing &&  type === "rail" ){
			imgSrcS = './img/train.png';
			imgSrcE = '';
		}else if ( !testing &&  type === "subway" ){
			imgSrcS = './img/subway.png';
			imgSrcE = '';
		}else if ( !testing &&  type === "tram" ){
			imgSrcS = './img/tram.png';
			imgSrcE = '';
		}else if ( !testing &&  type === "ferry" ){
			imgSrcS = './img/ferry.png';
			imgSrcE = '';
		}else if ( !testing &&  type === "trolleybus" ){
			imgSrcS = './img/trolleybus.png';
			imgSrcE = '';
	   }else{
			outputMessage = "Total Time to Destination: " + outputtravel_time + "\nTotal Distance to Destination:" + distance;
//			outputMessage = "From: " + street + " To:" + streetE + " by " + type;
			imgSrc = undefined;
		}


		if ( !testing &&  StartEnd === "start" ){
			imgSrcS = './img/start.png';
		}else if ( !testing &&  StartEnd === "end" ){
			imgSrcE = './img/end.png'
		}else if ( !testing &&  StartEnd === "startend" ){
			imgSrcS = './img/start.png';
			imgSrcE = './img/end.png'
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

		var myIcon = new google.maps.MarkerImage(imgSrcS);
		var markerS = new google.maps.Marker({
			 position: route[0],
			 map: localmap,
			 icon:  myIcon,
			 title: messageS
		  });

		markerS.icon.scale=20;

		var messageE = 'Street: ' + streetEnd + 
							'\nArrival Time: '+ toDate(arrivalTimeEnd);

		myIcon = new google.maps.MarkerImage(imgSrcE);
		var markerE = new google.maps.Marker({
			 position: route[route.length-1],
			 map: localmap,
			 icon: myIcon,
			 title: messageE
			
		  });

		markerE.icon.scale=20;

		markerS.setMap(localmap);
		markerE.setMap(localmap);
		globalMarkerMap.push(markerS);
		globalMarkerMap.push(markerE);
	}

	polyMap.setMap(localmap);

	globalPolyMap.push(polyMap);

	lineExists=1;
	return false;

}

function removeDirections(){


	document.getElementById("directions").innerHTML='';
	return false;
}




function addDirections(type,street,arrivalTime,leaveTime,waitTime,streetE,arrivalTimeE, desc, distance, travel_time, walk_time,legNum){

		var imgSrc = "";

		/* */
		


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
		hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
		mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
		var outputtravel_time =  hDisplay + mDisplay; 

		distance = distance/ 1000;
		distance = distance.toFixed(1) + "km";
		//alert( desc + distance+ travel_time+ walk_time);
		var testing = false;
		var imageNode = document.createElement('img');
		if (!testing && type === "walk"){
			outputMessage = "Walk to "+streetE +
										 "\nDept. Time: "+leaveTime+ 
										 "\nTravel Time: "+ outputwalk_time + 
										 "\nDistance: "+distance;

			/*
			var maxWalkTime = document.getElementById("maxWalkTime").value;
			maxWalkTime = maxWalkTime*60;
			if(maxWalkTime < total_walk_travel_time){
				imageNode.style.backgroundColor = "red";
			}
			*/
			imgSrc = './img/walk3ar.png';
		}else if ( !testing &&  type === "bus" ){
			//var desc = "Dromologio Tade";
			outputMessage = desc + " \nBus to " + streetE +
								 "\nDept. Time: "+leaveTime + " "+
								 "\nTravel Time: "+ outputtravel_time + 
								 "\nDistance: "+distance;
			imgSrc = './img/busar.png';
		}else if ( !testing &&  type === "car" ){
			outputMessage = "Drive to " + streetE +
								 "\nDept. Time: "+leaveTime + " "+
								 "\nTravel Time: "+ outputtravel_time + 
								 "\nDistance: "+distance;
			imgSrc = './img/car2m.png';
		}else if ( !testing &&  type === "rail" ){
			//var desc = "Dromologio Tade";
			outputMessage = desc + " \nRail to " + streetE +
								 "\nDept. Time: "+leaveTime + " "+
								 "\nTravel Time: "+ outputtravel_time;
			imgSrc = './img/trainar.png';
		}else if ( !testing &&  type === "subway" ){
			//var desc = "Dromologio Tade";
			outputMessage = desc + " \nSubway to " + streetE +
								 "\nDept. Time: "+leaveTime + " "+
								 "\nTravel Time: "+ outputtravel_time + 
								 "\nDistance: "+distance;
			imgSrc = './img/subwayar.png';
		}else if ( !testing &&  type === "tram" ){
			//var desc = "Dromologio Tade";
			outputMessage = desc + " \nTram to " + streetE +
								 "\nDept. Time: "+leaveTime + " "+
								 "\nTravel Time: "+ outputtravel_time + 
								 "\nDistance: "+distance;

			imgSrc = './img/tramar.png';
		}else if ( !testing &&  type === "ferry" ){
			//var desc = "Dromologio Tade";
			outputMessage = desc + " \nFerry to " + streetE +
								 "\nDept. Time: "+leaveTime + " "+
								 "\nTravel Time: "+ outputtravel_time + 
								 "\nDistance: "+distance;
			imgSrc = './img/ferryar.png';
		}else if ( !testing &&  type === "trolleybus" ){
			//var desc = "Dromologio Tade";
			outputMessage = desc + " \nTorlleybus to " + streetE +
								 "\nDept. Time: "+leaveTime + " "+
								 "\nTravel Time: "+ outputtravel_time + 
								 "\nDistance: "+distance;
			imgSrc = './img/trolleybusar.png';
	   }else{
			outputMessage = "Total Time to Destination: " + outputtravel_time + "\nTotal Distance to Destination:" + distance;
			imgSrc = undefined;
		}





	imageNode.src  = imgSrc;
	imageNode.style.height = '50%';//"9vh";
	imageNode.style.width  = '20%';//"4vw";
	imageNode.style.float = "left";

	var textnode = document.createTextNode(outputMessage);

	var spanNode = document.createElement('span');
	spanNode.className = "inner-pre";

	var swidth = $( window ).width();
	if ( swidth >= 800 ){
		spanNode.style.fontSize = "12px";
	}else{
		spanNode.style.fontSize = "9px";

	}

	spanNode.id = 'directionsID' + legNum;
	spanNode.appendChild(textnode);


	var nodeInfo = document.createElement("pre");

//	nodeInfo.appendChild(textnode);      
	nodeInfo.appendChild(spanNode);      

	nodeInfo.style.float = "center";
	nodeInfo.style.backgroundColor = "white";
	nodeInfo.style.borderColor = "white";



	var node;
	if(imgSrc == undefined){
		//node  = document.createElement('pre');
		node  = document.createElement('button');

		node.onclick = function(){
										 focusLeg(-1); return false;
									  };

	}else{
		node  = document.createElement('button');

		node.onclick = function(){
										 focusLeg(legNum); return false;
									  };
	}

	node.style.height = "100%";
	node.style.width  = "100%";
	node.style.backgroundColor = "white";
	if(imgSrc != undefined){
		node.appendChild(imageNode);
	}
	node.appendChild(nodeInfo);
//	node.appendChild(textnode);

	document.getElementById("directions").appendChild(node);

	return false;
}



function focusLeg(legNum){

	var legslat;
	var legslon;

	var legdlat;
	var legdlon;

	if(legNum==-1){
		legslat = queryLeg[0].coordinates[0][0];
		legslon = queryLeg[0].coordinates[0][1];

		if(queryLeg.length > 1){
			legdlat = queryLeg[queryLeg.length-1].coordinates[0][0];
			legdlon = queryLeg[queryLeg.length-1].coordinates[0][1];
		}else{
			legdlat = queryLeg[0].coordinates[queryLeg[0].coordinates.length-1][0];
			legdlon = queryLeg[0].coordinates[queryLeg[0].coordinates.length-1][1];

		}

	}else{
		legslat = queryLeg[legNum].coordinates[0][0];
		legslon = queryLeg[legNum].coordinates[0][1];

		legdlat = queryLeg[legNum].coordinates[queryLeg[legNum].coordinates.length-1][0];
		legdlon = queryLeg[legNum].coordinates[queryLeg[legNum].coordinates.length-1][1];
	}
	
	var clat = Math.abs(legslat+legdlat)/2;
	var clon = Math.abs(legslon+legdlon)/2;

	localmap.setCenter(new google.maps.LatLng(clat, clon));
	//localmap.setMapTypeId(google.maps.MapTypeId.ROADMAP);

	var latlngb = [
		 new google.maps.LatLng(legslat, legslon),
		 new google.maps.LatLng(legdlat, legdlon),
	]; 

	var latlngbounds = new google.maps.LatLngBounds();

	for (var i = 0; i < latlngb.length; i++) {
		 latlngbounds.extend(latlngb[i]);
	}
	localmap.fitBounds(latlngbounds);
	
	var zoom = localmap.getZoom();
	if(zoom > 17){
		localmap.setZoom(17);
	}

	return false;
}


function queryRoute(){

	console.log("To Backend " + slat + " " + dlat);

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

	
	console.log(inputHttp);
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
	//console.log(numIter);
	for(var i=0;i<numIter;i++){
		globalMarkerMap[i].setMap(null);
	}


	

	// Draw polylines on google map 

	var numRoutes = jsonRoutes.routes.length; 


	if(mainRoute>=numRoutes){
		mainRoute = numRoutes-1;
	}

	/* Draw lines with colors */
	var j=mainRoute;

	removeDirections();
	numIter = jsonRoutes.routes[j].legs.length;
	var totalTimeTravel = jsonRoutes.routes[j].travel_time;
	var totalDistanceTravel = jsonRoutes.routes[j].distance;
	//alert(totalTimeTravel);
	addDirections("total","","","","","","","", totalDistanceTravel, totalTimeTravel, "",-1);

	/* find total walking time of the route */
	total_walk_travel_time=0;
	for(var i=0; i<numIter; i++){
		var type  = jsonRoutes.routes[j].legs[i].type;
		var travel_time = jsonRoutes.routes[j].legs[i].travel_time;
	
		if(type == "walk"){
			total_walk_travel_time += travel_time;
			console.log('Total walk travel time: ' + total_walk_travel_time);
		}		


	}
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
		var StartEnd = '';
		if(i==0){
			arrivalTime=0;
			StartEnd = 'start';
		}

		if(i==numIter-1){
			StartEnd = 'end';
		}

		if(numIter == 1){
			StartEnd = 'startend';
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
		drawLineMap(route,type,true,street,arrivalTime,leaveTime,waitTime,streetE,arrivalTimeE,type,StartEnd);

		addDirections(type,street,arrivalTime,leaveTime,waitTime,streetE,arrivalTimeE, desc, distance, travel_time, walk_time,i);
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

	console.log("clat: " + clat + " clon: " + clon);
	console.log("slat: " + slat + " slon: " + slon);
	console.log("dlat: " + dlat + " dlon: " + dlon);

	localmap.setCenter(new google.maps.LatLng(clat, clon));
	//localmap.setMapTypeId(google.maps.MapTypeId.ROADMAP);
	
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
	localmap.fitBounds(latlngbounds);
	queryLeg = jsonRoutes.routes[j].legs;

	return false;	
}


function openNav() {
	document.getElementById("settingsSideNav").style.width = "100%";
}

function closeNav() {
	document.getElementById("settingsSideNav").style.width = "0%";
}


function cssDeviceChange( swidth,sheight){

//style="width:100px; max-width:400px;"

	if(swidth <= 800){
		/* mobile or tablet */
		document.getElementById("map").style.width = "100%";
		if( document.getElementById("buttonsID")!= null){
			document.getElementById("buttonsID").style.width = "100%";
			document.getElementById("buttonsID").style.zoom = "0.8";
		}
		document.getElementById("routeNum").style.maxWidth = "200px";

		/* Transport Preferences */
		/* --------------------- */
		document.getElementById("closebtnNav").style.zoom = "0.8";
		document.getElementById("transPrefHeader").style.zoom = "0.7";
		document.getElementById("headMaxWalkTime").style.zoom = "0.7";
		document.getElementById("headRoutesCheckBox").style.zoom = "0.7";
		//document.getElementById("headDeparture").style.zoom = "0.7";
		//document.getElementById("headArrival").style.zoom = "0.7";

		//document.getElementById("labelDateD").style.display = "block";
		//document.getElementById("timeDateD").style.display = "block";
		//document.getElementById("labelDateA").style.display = "block";
		//document.getElementById("timeDateA").style.display = "block";
		/* --------------------- */


		document.getElementById("map").className = "col-sm-3";
		document.getElementById("map").style.height = "50vh";//"45vh";//0.9*sheight + "px";//"75vh";
		document.getElementById("map").style.maxWidth = "100vw";//0.9*sheight + "px";//"75vh";

		document.getElementById("mmrpHEADGLOBAL").style.zoom="0.4";



		if( document.getElementById("directions2") != null){
			if(document.getElementById("directions")!= null ){
				document.getElementById("directions").innerHTML='';
				document.getElementById("directions").id = "directions1"; 
				document.getElementById("directions1").style.visibility = "hidden";
			}
			document.getElementById("directions2").id = "directions"; 
			document.getElementById("directions").style.visibility = "visible";
			if(slat != null || dlat!= null || slon!=null || dlon != null){		
				queryRoute();
			}
		}




		document.getElementById("directions").style.maxHeight = "30vh";//"50vh";//0.9*sheight + "px";//"75vh";
		if (queryLeg != undefined){
			var legLength =  queryLeg.length;
			for(j=0;j<queryLeg.length;j++){
				document.getElementById("directionsID"+j).style.fontSize = "11px";
			}		
		}

	}else{

		if( document.getElementById("buttonsID")!= null){
			document.getElementById("buttonsID").style.width = "450px";
			document.getElementById("buttonsID").style.maxWidth = "450px";
		}
		var buttonW = parseInt(document.getElementById("buttonsID").style.width, 10);
		document.getElementById("map").style.width = swidth-buttonW +'px';
		
		document.getElementById("routeNum").style.maxWidth = "450px";


		/* Transport Preferences */
		/* --------------------- */
		document.getElementById("closebtnNav").style.zoom = "1";
		document.getElementById("transPrefHeader").style.zoom = "1";
		document.getElementById("headMaxWalkTime").style.zoom = "1";
		document.getElementById("headRoutesCheckBox").style.zoom = "1";
		//document.getElementById("headDeparture").style.zoom = "1";
		//document.getElementById("headArrival").style.zoom = "1";

		//document.getElementById("labelDateD").style.display = "";
		//document.getElementById("timeDateD").style.display = "";
		//document.getElementById("labelDateA").style.display = "";
		//document.getElementById("timeDateA").style.display = "";
		/* --------------------- */


		document.getElementById("map").className = "col-sm-9";
		document.getElementById("map").style.height = "75vh";//0.9*sheight + "px";//"75vh";
		document.getElementById("map").style.maxWidth = "75vw";//0.9*sheight + "px";//"75vh";

		document.getElementById("mmrpHEADGLOBAL").style.zoom="1";



		if( document.getElementById("directions1") != null){

			if(document.getElementById("directions")!= null){
				document.getElementById("directions").innerHTML='';
				document.getElementById("directions").id = "directions2"; 
				document.getElementById("directions2").style.visibility = "hidden";
			}
			document.getElementById("directions1").id = "directions"; 
			document.getElementById("directions").style.visibility = "visible";
			if(slat != null || dlat!= null || slon!=null || dlon != null){		
				queryRoute();
			}
		}

		document.getElementById("directions").style.zoom = "1";
		if (queryLeg != undefined){
			var legLength =  queryLeg.length;
			for(j=0;j<queryLeg.length;j++){
				document.getElementById("directionsID"+j).style.fontSize = "12px";
			}		
		}
		document.getElementById("directions").style.maxHeight = "56.5vh";//0.9*sheight + "px";//"75vh";

	}

	return false;
}

