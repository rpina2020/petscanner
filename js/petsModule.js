var wspetsUrl = ""; //URL Web Service usado por el modulo

/* declaraciones de variables específicas del módulo */

/* funciones básicas del módulo que son llamadas desde framework */
petsModule.ready = function(){
	//Esto se ejecutará cuando la página termine de cargar

};

petsModule.initLogin = function(){
	document.addEventListener("keyup", function(event) {
	    if (event.keyCode === 13) {
	        alert('Enter is pressed!');
	    }
	});
	//Inicializa las opciones de menú
	$("#btn_ingresar_login").on("click", function() {
		if(!checkSession()){
		  	// Do something
		    var txt_email = $("#text-usuario-login").val();
		    var txt_pass = sha256($("#text-pass-login").val());
			
			checkUserLogin(txt_email,txt_pass);
		}else{

			console.log
		}
		



	});
};

petsModule.initReset = function(){
	//Inicializa las opciones de menú
	console.log("initReset")

};
petsModule.initPetProfile = function(){
	//Inicializa las opciones de menú
  	// const image = "file:///C:/petscanner/img/uploads/mora.png";
  	const image = {
	    url: "file:///C:/petscanner/img/uploads/mora.png", // url
	    scaledSize: new google.maps.Size(70, 70), // scaled size
	    origin: new google.maps.Point(4, 6), // origin
	    anchor: new google.maps.Point(4, 6) // anchor
	};
	var defaultLatLng = new google.maps.LatLng(34.0983425, -118.3267434);  // Default to Hollywood, CA when no geolocation support
	if ( navigator.geolocation ) {
		function success(pos) {
			// Location found, show map with these coordinates
			drawMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
		}
		function fail(error) {
			drawMap(defaultLatLng);  // Failed to find location, show default map
		}
		// Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
		navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:true, timeout: 6000});
	} else {
		drawMap(defaultLatLng);  // No geolocation support, show default map
	}
	function drawMap(latlng) {
		var myOptions = {
			zoom: 10,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
		// Add an overlay to the map of current lat/lng
		var marker = new google.maps.Marker({
			position: latlng,
			map: map,
			title: "Greetings!",
			icon: image
		});
	}

};
		function checkUserLogin(txt_email,txt_pass){
			
			if(txt_email != '' & txt_pass != ''){
				$.ajax({
					type: "GET",
					url: " http://localhost:3000/users",
					data: {
						email: txt_email,
						pass: txt_pass
					},
					success: function(json) {
						petsModule.loginSuccess(json)
						return true;
					},
					error: function(xhr, status, error) {
					// Handle failed login.

					}
				});
			}else{
				alert("Ambos campos son obligatorios.")
			}

		}

petsModule.initLostPetsMap = function(){
	// If you're adding a number of markers, you may want to drop them on the map
	// consecutively rather than all at once. This example shows how to use
	// window.setTimeout() to space your markers' animation.

	var lost_pets = [];
	$.ajax({
		type: "GET",
		url: "http://localhost:3000/lost_pets",
		success: function(json) {
		    //localStorage.setItem('session', JSON.stringify( [{"session": true, "dataUser": json}] ) )
		    for (var i = 0; i < json.length; i++) {
				$("#buscador").append('<li id="los_pet_'+i+'" geoloc="'+(json[i].pet_info.geoloc)+'">\
										<div class="card transform">\
										    <div class="face">\
										        <img src="'+json[i].img+'" style="width: 26vw;height: 17vh;">\
										    </div>\
										    <div id="containText">\
										        <h3 style="margin: 5% 0 0 12%;width: 81%;">'+json[i].pet_info.nombre+'</h3>\
										        <p style="font-size: 11px;margin: 5% 0 0 12%;width: 81%;">Ramiro Pina (DEVICE #'+json[i].id_device+').</p>\
										    </div>\
										    <p style="text-transform: none;font-size: small;float: right;margin-top: 0;margin: -1% 0 0 12%;width: 62%;">'+json[i].pet_info.descripcion+'</p>\
										</div>\
									</li>')
				$("#buscador").listview().listview('refresh')  
				var geolocx = json[i].pet_info.geoloc;
	            $("#los_pet_" + i).off("click").click(function(){
	            	ZoomAndCenter(geolocx)
	            });
	            $("#los_pet_" + i).trigger("create");
		    }


			for (var i = 0; i < json.length; i++) {
				lost_pets.push(json[i].pet_info.geoloc)

				var markers = [];
				var map;

				map = new google.maps.Map(document.getElementById("map-lost_pets"), {
					zoom: 12,
					center: lost_pets[0],
				});
				//document.getElementById("drop").addEventListener("click", function(){
				  	markers = [];

					for (var i = 0; i < markers.length; i++) {
						markers[i].setMap(null);
					}


					for (var i = 0; i < lost_pets.length; i++) {
						markers.push(
							new google.maps.Marker({
								position: lost_pets[i],
								map,
								animation: google.maps.Animation.DROP,
							}),
						);

					}

			}
			initMapPage();

			
		},
		error: function(xhr, status, error) {
		// Handle failed login.

		}
	});


	// const lost_pets = [
	// 	{ lat: -34.923568, lng: -57.984729 },
	// 	{ lat: -34.917152, lng: -57.974167 },
	// 	{ lat: -34.922078, lng: -57.980647 },
	// 	{ lat: -34.913123, lng: -57.967172 },
	// 	{ lat: -34.912102, lng: -57.960370 },
	// 	{ lat: -34.910407, lng: -57.955234 },
	// 	{ lat: -34.896286, lng: -57.978229 },
	// 	{ lat: -34.900134, lng: -57.979925 },
	// ];


};

petsModule.initRegistro = function(){
	$("#btn_checkin_ingresar-registro").on("click", function() {
		var text_usuario_registro = $("#text-usuario-registro").val();
		var text_email_registro = $("#text-email-registro").val();
		var text_clave_registro = $("#text-clave-registro").val();
		var text_repetir_registro = $("#text-repetir-registro").val();

		var data_form = [
			{
		      "nombre": "admin_usr",
		      "apellido": "admin_usr",
		      "pass": "38e5e0bf7c23d753f13927aa60053b5bc72972bb52519c9760b19bc27171e262",
		      "email": "admin_usr@gmail.com",
		      "tipo_usuario": 2,
		      "devices": [1-2],
		      "img": "",
		      "confirmed_account": false
			}
		]

		console.log(data_form)

		// $.ajax({
		// 	type: "POST",
		// 	url: "http://localhost:3000/users",
		// 	data: {
		// 	  nombre: text_usuario_registro,
		// 	  email: text_email_registro,
		// 	  password: sha256(text_repetir_registro),
		// 	  confirmed_account: false
		// 	},
		// 	success: function(response) {
		// 	  console.log(response);
		// 	},
		// 	error: function(error) {
		// 	  console.log(error);
		// 	}
		// });
	})

};

petsModule.initializeConfig = function(){
	//inicializa la tabla de configuración
};

petsModule.initCheckbox = function(){
	//inicializa los checkbox de configuracion correspondientes
};

petsModule.initHome = function(){
	//Inicializa pantalla Home
};

petsModule.loginSuccess = function(json){
	//Si el logueo es correcto guarda los datos del usuario en la variable userFields 
	var session = [{"session": true, "start_sessionTime": moment().format(), "dataUser": json}]
	localStorage.setItem('session', JSON.stringify( session ) );
	$.mobile.navigate("#dashboard");

};

petsModule.closeSession = function(){
	//Resetea las tablas
};

/* funciones de la base de datos local */

/* funciones de web services */

/* funciones específicas del módulo  */
function loginUser(user){
    
    var txt_email = $("#text-usuario-login").val();
    var txt_pass = sha256($("#text-pass-login").val());

    var txt_email_ok = txt_email == '' || txt_email == undefined ? alert("error") : txt_email;
    var txt_pass_ok = txt_pass == '' || txt_pass == undefined ? alert("error") : txt_pass;
    

    if (txt_email == user[0].email && txt_pass == user[0].pass) {
        alert("logueado")
    }
}

function initReset(){
    alert("initReset")
}
function initRegistro(){
    var data = {
		name: $("#name").val(),
		email: $("#email").val(),
		password: $("#password").val()
    };
    $.ajax({
		type: "POST",
		url: "/api/users",
		data: JSON.stringify(data),
		contentType: "application/json",
		success: function(response) {
			console.log(response);
		},
		error: function(error) {
			console.log(error);
		}
    });
}
function checkSession(){
    
    var valor = JSON.parse( localStorage.getItem('session') )
    if (valor) {
    	var start_session = JSON.parse( localStorage.getItem('session'))[0].start_sessionTime
		var lapsed_session_time = moment(start_session).startOf('minutes').fromNow().split(" minutes ago")[0]
        if (parseInt(lapsed_session_time) > 1 ) {
        	alert("tiempo caducado pasaron "+lapsed_session_time+" minutos")
        }
        return true;
    }else{
        return false;
    }

}
function initMapPage(){
	(function() {
	  function initMap() {
	    // ...
	  }
	  initMap();
	})();
}
function ZoomAndCenter(location) {
    var map = $("#map-lost_pets")
	console.log(location)
	map.setCenter({"lat": location.lat,"lng": location.lng});
	map.setZoom(20);
	location = [];
}

/* html específico del módulo */