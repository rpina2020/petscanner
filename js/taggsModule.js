/* declaraciones de variables específicas del módulo */
var actualPage = location.hash.split("#")[1];
var inHome = false;
/* funciones básicas del módulo que son llamadas desde framework */
taggsModule.ready = function(){
    //Esto se ejecutará cuando la página termine de cargar
    if (actualPage == "home") {
        $("#cards").html("")
        initTaggs()
    }
};

taggsModule.initMenuOptions = function(){
    //Inicializa las opciones de menú
};

taggsModule.initializeConfig = function(){
    //inicializa la tabla de configuración
};

taggsModule.initCheckbox = function(){
    //inicializa los checkbox de configuracion correspondientes
};

taggsModule.initHome = function(){
    inHome = true;
    initTaggs();
};

taggsModule.initMapa = function(){
    inHome = false;
    console.log('MAPA');
    init_map();

};

taggsModule.loginSuccess = function(){
    console.log('LOGIN');
};

function updateChargesList(local) {
    successMessage($("#successMessageHome"), '', $("#home"));
    infoMessage($("#infoMessageHome"), '', $("#home"));
    var userStored = JSON.parse(localStorage.getItem("user"));
    if (userFields && (userFields.rol != undefined)) {
        if ( (userFields.rol) && (userFields.rol == "INSPECTOR" || userFields.rol == "SUPERVISOR") ){
            //errorMessage($("#errorMessageHome"), "", $("#home"));
            chargesList(local);  
        }
    } else if(userStored){
        if ( (userStored[0].rol) && (userStored[0].rol == "INSPECTOR" || userStored[0].rol == "SUPERVISOR") ){
            userFields = userStored[0];
            chargesList(local);  
        }                   
    }
}

taggsModule.closeSession = function(){
    $("#cards .card, #cards .card_blocked").remove();
    localStorage.clear();
    //Resetea las tablas
    // resetCharges();
    // resetInfoCharges();
    // resetInspectionWithoutCharge();
    // resetLoadInspection();
};

/* funciones de la base de datos local */

/* funciones de web services */

/* funciones específicas del módulo  */

sections = '';

function appendHTML() {
    $("body").append(sections).trigger("create");
}   

var geoDevicesByUser = [];
function initTaggs(){
    var userData = JSON.parse(localStorage.getItem('userData'));
    $("#content_loader").fadeIn()
    $.ajax({   
        type: "GET",
        url: api + "pets?id_user=1",
        async: false,
        // data: {email: "email="+email},
        success: function(json){
            $("#cards").html("")   
            var pet_img = [];
            for (var i = 0; i < json.length; i++) {
                console.log("-------------------------------------------------------------")
                
                $.ajax({   
                    type: "GET",
                    url: api + "devices?id="+json[i].id_device,
                    async: false,
                    // data: {email: "email="+email},
                    success: function(res){
                        geoDevicesByUser.push(res);
                    } 
                });
                console.log( geoDevicesByUser[i] );

                console.log("-------------------------------------------------------------")
                if (geoDevicesByUser.length > 0) {
                    $("#cards").append('<li url="#pet_profile'+json[i].nombre+'-TAGG'+json[i].id_device+'-'+json[i].id_user+'" id="tagg_'+json[i].id+'">\
                                            <img src="'+json[i].imgs+'" class="car_pet_image">\
                                            <div class="content_grid_cards">\
                                                <div class="ui-grid-a">\
                                                    <div class="ui-block-a" style="width: 20%;">\
                                                        <div class="ui-bar ui-bar-a" style="/* height: 32px; */">\
                                                            <a href="index.html" class="ui-btn ui-shadow ui-corner-all ui-icon-tag ui-btn-icon-notext"></a>\
                                                        </div>\
                                                    </div>\
                                                    <div class="ui-block-b" style="width: 80%;height: 35px;padding: 2% 0;">\
                                                        <div class="ui-bar ui-bar-a" style="height: 40px;line-height: 2;"><small style="font-size: .8rem;font-weight: 700;">'+json[i].nombre+'-TAGG'+json[i].id_device+'#'+json[i].id_user+'</small></div>\
                                                    </div>\
                                                </div>\
                                                <div class="ui-grid-a">\
                                                    <div class="ui-block-a" style="width: 20%;">\
                                                        <div class="ui-bar ui-bar-a" style="height: 45px;">\
                                                            <a href="index.html" class="ui-btn ui-shadow ui-corner-all ui-icon-user ui-btn-icon-notext"></a>\
                                                        </div>\
                                                    </div>\
                                                    <div class="ui-block-b" style="width: 80%;height: 35px;padding: 2% 0;">\
                                                        <div class="ui-bar ui-bar-a" style="height: 40px;line-height: 2;">'+userFields[0].nombre+'</div>\
                                                    </div>\
                                                </div>\
                                                <div class="ui-grid-a">\
                                                    <div class="ui-block-a" style="width: 20%;">\
                                                        <div class="ui-bar ui-bar-a" style="/* height: 32px; */">\
                                                            <a id="map_'+i+'" href="#" href-data="#mapa?nombre='+json[i].nombre+'&id_device='+json[i].id_device+'&id_user='+json[i].id_user+'&id_tagg=tagg_'+json[i].id+'&geoloc='+geoDevicesByUser[i][0].geoloc[0]+','+geoDevicesByUser[i][0].geoloc[1]+'" class="ui-btn ui-shadow ui-corner-all ui-icon-location ui-btn-icon-notext"></a>\
                                                        </div>\
                                                    </div>\
                                                    <div class="ui-block-b" style="width: 80%;height: 35px;padding: 2% 0;">\
                                                        <div class="ui-bar ui-bar-a" style="height: 40px;line-height: 2;">\
                                                        <small>\
                                                            <span>'+geoDevicesByUser[i][0].geoloc[0]+'</span>\
                                                            <span>'+geoDevicesByUser[i][0].geoloc[1]+'</span>\
                                                        </small>\
                                                        </div>\
                                                    </div>\
                                                </div>\
                                            <div>\
                                        </li>');
                    pet_img.push({"id": json[i].id_device, "img": json[i].imgs })
                    localStorage.setItem('img_pets', JSON.stringify(pet_img) )
                    $("#map_"+i).click(function() {
                        $.mobile.navigate( $(this).attr("href-data") );
                    });
                    $("#content_loader").fadeOut()
                }else{
                    $("#cards").fadeOut()
                    $(".content_scan_banner").fadeIn()
                }
            
            }
          
            $("#cards").listview().listview('refresh') ;
            $(".content_scan_banner").fadeOut(function(){
                $("#cards").fadeIn();
            });

            $("#btn_qr").click(function() {
                $.mobile.navigate( "#mapa?nombre=Mora&id_device=1&id_user=1&id_tagg=tagg_1&geoloc=-34.899365,-57.95561") ;
            });

        }

    });

}

function init_map(){

    var latLng = location.hash.split("?")[1].split("&geoloc=")[1].split(",");

    //var pet_img = JSON.parse(localStorage.getItem('img_pets'));
    var pet_img = "file:///E:/PetScanner/www/img/logocompletoblanco.png";
    var id_tagg = location.hash.split("?")[1].split("&id_tagg=")[1].split("&")[0].split("id_tagg")[0].split("tagg_")[1];
    // var pet_img_url = _.filter(pet_img, function(o) { 
    //     return o.id == id_tagg; 
    // });
    var pet_img_url = 'file:///E:/PetScanner/www/img/logocompletoblanco.png';
    $("#pet_image").attr("src", pet_img_url[0].img)

    const uluru = new google.maps.LatLng(latLng[0], latLng[1]);

    map = new google.maps.Map(document.getElementById('map'), {
        center: uluru,
        zoom: 15,
        disableDefaultUI: true,
        mapTypeId: 'terrain'
    });

    const marker = new google.maps.Marker({
        position: uluru,
        map: map,
        style: "width: 1'%;",
        icon: 'file:///E:/app_testing_2/img/pet_dog_marker.png'
    });
}

function updateGeolocDevice(){
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            alert("We got a barcode\n" +
                    "Result: " + result.text + "\n" +
                    "Format: " + result.format + "\n" +
                    "Cancelled: " + result.cancelled);
        },
        function (error) {
            alert("Scanning failed: " + error);
        },
        {
            preferFrontCamera : true, // iOS and Android
            showFlipCameraButton : true, // iOS and Android
            showTorchButton : true, // iOS and Android
            torchOn: true, // Android, launch with the torch switched on (if available)
            saveHistory: true, // Android, save scan history (default false)
            prompt : "Coloque un código de barras dentro del área de escaneo.", // Android
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
            orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
            disableAnimations : true, // iOS
            disableSuccessBeep: false // iOS and Android
        }
    );

    // fetch('http://localhost:3000/users/1', {
    //     method: 'PUT',
    //     body: JSON.stringify({id: 1,
    //     nombre: "Ramiro",
    //     apellido: "Pina",
    //     pass: "admin_vet",
    //     email: "admin_vet",
    //     tipo_usuario: 1,
    //     devices: [1,3], 
    //     img: "https://www.pngfind.com/pngs/m/93-938050_png-file-transparent-white-user-icon-png-download.png"}),
    //     headers: {'Content-type': 'application/json; charset=UTF-8'},
    // })
    //     .then((response) => response.json())
    //     .then((json) => console.log(json));


    // fetch('http://localhost:3000/users/1', {
    //     method: 'PUT',
    //     body: JSON.stringify({
    //         id: id,
    //         nombre: nombre,
    //         apellido: apellido,
    //         pass: pass,
    //         email: email,
    //         tipo_usuario: tipo_usuario,
    //         devices: devices 
    //         img: img,
    //         headers: headers,
    // })
    //     .then((response) => response.json())
    //     .then((json) => console.log(json));


}

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    var element = document.getElementById('deviceProperties');
    element.innerHTML = 'Device Model: '    + device.model    + '<br />' +
                        'Device Cordova: '  + device.cordova  + '<br />' +
                        'Device Platform: ' + device.platform + '<br />' +
                        'Device UUID: '     + device.uuid     + '<br />' +
                        'Device Version: '  + device.version  + '<br />';
}