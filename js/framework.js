//Guarda los módulos
//var modules = {beaconsModule: beaconsModule, gpsModule: gpsModule};
var modules = {taggsModule: taggsModule};


// Esto se ejecutará cuando la página termine de cargar
$(document).ready(function() {
    ready();
});

function ready() {
    // Funciones de inicio al entrar en distintas secciones
    $(document).off("pageshow", "#login").on("pageshow", "#login", initLogin);
    $(document).off("pageshow", "#forcepassword").on("pageshow", "#forcepassword", initForcePassword);
    $(document).off("pageshow", "#forgetpassword").on("pageshow", "#forgetpassword", initForgetPassword);
    $(document).off("pageshow", "#home").on("pageshow", "#home", initHome);
    //$(document).off("pagecontainerchange").on("pagecontainerchange", initCheckbox);

    for (var m in modules) {
        modules[m].ready();
    }

    //initMenuOptions();
}

//Inicializa las opciones de menú para las distintas secciones
// function initMenuOptions() {
//     for (var m in modules) {
//         modules[m].initMenuOptions();
//     }
//     updateOptionsView();
// }



// function initCheckbox() {
//     var pageActive = jQuery.mobile.activePage[0].id;
//     if ((pageActive != "login") && (pageActive != "forgetpassword") && (pageActive != "forcepassword")) {
//         for (var m in modules) {
//             modules[m].initCheckbox();
//         }
//         $(".main-menu-option").find('.ui-btn-b').each(function() {
//             $(this).removeClass("ui-btn-b");
//         });
//         $(".btn-selected").remove();
//         var selected = $("#" + pageActive).find(".ui-btn-icon-" + pageActive);
//         $(selected).addClass("ui-btn-b");
//         $(selected).parent().append('<div class="btn-selected"></div>');
//     }
// }

//Inicializa pantalla Home
function initHome() {
    //bloquear la orientacion de la pantalla, solo portrait
    // window.plugins.orientationLock.lock("portrait");
    //Inicializa la configuracion general
    //initializeConfig();
    //Muestra la imagen de espera
    showLoading();
    //Chequea que esté logueado correctamente
    isLoggedIn();
    //Inicializa el mensaje de éxito
    resetHome();

    //Click de menu lateral
    $("#options-menu-home").off("click").click(function() {
        $("#home .option-menu-panel").panel("open");
    });
    //Click de cierre de sesión
    $("#close-session-home").off("click").click(function() {
        closeSession();
    });

    $("#open-createInspectionWithoutLoad").off("click").click(function() {
        $.mobile.navigate("#createInspectionWithoutLoad")
    });

    //initCheckbox();

    //Gesto para navegar al perfil
    // $("#home").off("swipeleft").on("swipeleft",function(){
    //   $.mobile.changePage("#profile", {transition: "slide", reverse: false});
    // });
    // //Gesto para navegar a contenidos
    // $("#home").off("swiperight").on("swiperight",function(){
    //   $.mobile.changePage("#contents", {transition: "slide", reverse: true});
    // });

    //Esconde la imagen de espera
    hideLoading();

    for (var m in modules) {
        modules[m].initHome();
    }
}

/*  INICIO WEB SERVICES  */

//Envía los datos de logueo al web service y este devuelve un booleano. Si es true, devuelve los datos del usuario y los permisos del mismo. Si es false devuelve un mensaje de error.
function validateUser(userInfo) {
    var errorMessageText = "";
    var email = $("#usernameLogin").val();
    var password_user = cryptshadoscincoseis($("#passwordLogin").val());
    userInfo["password"] = password_user;
    if (resetpasson == false) {
        $.ajax({
            url : api + "users?email="+email,
            type : "GET",
            // data: JSON.stringify({userName: userInfo.username,password: userInfo.password}),
            contentType : 'application/json',
            success : function(json){
                userFields = json;
                if(json.length > 0){
                    if (email == json[0].email && password_user == json[0].pass) {
                        loginSuccess(userInfo);
                    }else{
                        errorMessageText = "Datos de inicio de sesion incorrectos. Intentalo nuevamente.";
                    }
                }else{
                    errorMessageText = "El usuario no existe en la base de datos. Crea una cuenta.";

                }
                hideLoading();
                errorMessage($("#errorMessageLogin"), errorMessageText, $("#login"));
                
            },
            error: function( jqXHR, textStatus, errorThrown ) {
                var msg = "";
                var customMsg = false;
                if (jqXHR.status === 0) {
                    msg = 'Not connect: Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found [404]';
                } else if (jqXHR.status == 500) {
                    if(jqXHR.responseJSON.message == "Tu contraseña ha expirado. Favor de actualizarla") {
                    //Si se forzó el cambio de contraseña, lleva a la pantalla de cambio de contraseña
                        $.mobile.navigate("#forcepassword");
                    }else if ((jqXHR.responseJSON.message == "El usuario ingresado no tiene permisos para usar la app.") || (jqXHR.responseJSON.message == "Tu usuario no está registrado para usar la app") || (errorThrown == "En estos momentos la app no se encuentra disponible. Favor de reintentar más tarde") || (errorThrown == "El usuario ingresado no existe en la base de datos o los datos ingresados son incorrectos.")) {
                        customMsg = true;
                        errorMessage($("#errorMessageLogin"), jqXHR.responseJSON.message, $("#login"));
                    }else if((jqXHR.responseJSON.message == "El usuario no está habilitado.")) {
                        customMsg = true;
                        resetLogin()
                        errorMessage($("#errorMessageLogin"), "El usuario no está habilitado", $("#login"));
                    }
                } else if (textStatus === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (textStatus === 'timeout') {
                    msg = 'Time out error.';
                } else if (textStatus === 'abort') {
                    msg = 'Uncaught Error: ' + jqXHR.responseText;
                }
                if(msg != ""){
                    console.log(msg);
                } else if (!customMsg){
                    errorMessage($("#errorMessageLogin"), "Los datos ingresados son incorrectos. Intente nuevamente.", $("#login"));
                }
                hideLoading();
            }
        });
    }else{
        var pass = cryptshadoscincoseis(tempcode).toString();
        var passlogin = userInfo.password;
        if ((userInfo.username == userFields.username) && (passlogin == pass)) {
            hideLoading();
            $.mobile.navigate("#forcepassword");                          
            return false;
        }else{
            hideLoading();
            errorMessage($("#errorMessageLogin"), "Los datos ingresados son incorrectos. Intente nuevamente.", $("#login"));
            return false;
        }
    }
    //getUserLocal();
}


//Si el logueo es correcto guarda los datos del usuario en la variable userFields 
function loginSuccess(user) {
    var sessionInfo = [{"sessionid": "1", "lastSessionUpdate": moment().format()}];
    localStorage.setItem("session", JSON.stringify(sessionInfo)); 

    var userInfo = [{"dni": userFields.dni, "employeesId":userFields.employeesId, "enabled":userFields.enabled, "lastName": userFields.lastName, "name": userFields.name, "position": userFields.position, "rol": userFields.rol, "sessionIdOffline": userFields.sessionIdOffline, "userId":userFields.userId, "userName": userFields.userName}];
    localStorage.setItem("user", JSON.stringify(userInfo));  

    //Guarda el sessionid y los campos de usuario por separado en la base de local
    var date = new Date();
    var dateString = (date.getUTCFullYear() + '-' + ('0' + (date.getUTCMonth() + 1)).slice(-2)) + "-" + ('0' + ( date.getUTCDate())).slice(-2) + " " + date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds() + " GMT";
    userFields["sessionIdOffline"] = "1";
    
    if ((saveSession(userFields["sessionIdOnline"], dateString, "online", ))) {
        $.mobile.navigate("#home");

        for (var m in modules) {
            modules[m].loginSuccess();
        }

    } else {
        //Si no puede guardarlo, informa el error en pantalla
        errorMessage($("#errorMessageLogin"), "Hubo problemas para Iniciar Sesión. Intente nuevamente.", $("#login"));
        return false;
    }
    //hideLoading();
    return false;
}

/*  FIN WEB SERVICES  */

/* INICIO FUNCIONALIDADES */

// function initializeConfig() {
//     for (m in modules) {
//         modules[m].initializeConfig();
//     }
// }

function closeSession() {
    firstTimeHome = true;
    //Resetea tablas
    showLoading();
      
    var activity = [];
    var date = new Date();
    activity["userType"] = userFields.rol;
    activity["dateString"] = (('0' + (date.getUTCDate())).slice(-2) + '/' + ('0' + (date.getUTCMonth() + 1)).slice(-2) + "/" + date.getUTCFullYear() + " " + date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds() + " GMT");
    activity["description"] = "log_session_logout_mobile"; 
    if(userFields.userName != undefined){
        activity["username"] = userFields.userName;
    }else{
        activity["username"] = null;
    }
    logActivity(activity);
    resetSession();
    resetUser();
    $.mobile.navigate("#login");

    for (m in modules) {
        modules[m].closeSession();
    }
}
//Valida los datos del usuario y da acceso a las operaciones permitidas por el mismo
function loginUser() {
    //Loading
    showLoading();
    //Variable para datos de formulario
    var userInfo = [];
    //Si hay conexión toma los valores ingresados para usuario y contraseña
    userInfo["username"] = $("#usernameLogin", $("#formLogin")).val();
    //Saca espacios en blanco
    userInfo["username"] = rtrim(userInfo["username"]);
    var pass = $("#passwordLogin", $("#formLogin")).val();
    //Codifico contraseña por seguridad
    userInfo["password"] = cryptshadoscincoseis(pass).toString();
    if (checkConnection()) {
        //Llamo a validar usuario con la información de login.
        userInfo["password"] = pass;
        validateUser(userInfo);
        return false;
    } else {
        //setTimeout(function(){ 
            //validateUserOffline(userInfo); 
            return false;
        //}, 3000);
    }
}

//Actualiza las clases de las opciones de menú para que se acomoden según la cantidad de opciones
function updateOptionsView() {
    var $mainMenus = $("section .main-menu nav ul");
    for (var j = 0; j < $mainMenus.length; j++) {
        var mainOptions = $($mainMenus[j]).find(".main-menu-option");
        switch (mainOptions.length) {
            case 3:
                $(mainOptions[0]).attr("class", "main-menu-option ui-block-a");
                $(mainOptions[0]).trigger("create");
                $(mainOptions[1]).attr("class", "main-menu-option ui-block-b");
                $(mainOptions[1]).trigger("create");
                $(mainOptions[2]).attr("class", "main-menu-option ui-block-c");
                $(mainOptions[2]).trigger("create");
                $($mainMenus[j]).attr("class", "ui-grid-b").trigger("create");
                break;
            case 4:
                $(mainOptions[0]).attr("class", "main-menu-option ui-block-a");
                $(mainOptions[0]).trigger("create");
                $(mainOptions[1]).attr("class", "main-menu-option ui-block-b");
                $(mainOptions[1]).trigger("create");
                $(mainOptions[2]).attr("class", "main-menu-option ui-block-c");
                $(mainOptions[2]).trigger("create");
                $(mainOptions[3]).attr("class", "main-menu-option ui-block-d");
                $(mainOptions[3]).trigger("create");
                $($mainMenus[j]).attr("class", "ui-grid-d").trigger("create");
                break;
            case 5:
                $(mainOptions[0]).attr("class", "main-menu-option ui-block-a");
                $(mainOptions[0]).trigger("create");
                $(mainOptions[1]).attr("class", "main-menu-option ui-block-b");
                $(mainOptions[1]).trigger("create");
                $(mainOptions[2]).attr("class", "main-menu-option ui-block-c");
                $(mainOptions[2]).trigger("create");
                $(mainOptions[3]).attr("class", "main-menu-option ui-block-d");
                $(mainOptions[3]).trigger("create");
                $(mainOptions[4]).attr("class", "main-menu-option ui-block-e");
                $(mainOptions[4]).trigger("create");
                $($mainMenus[j]).attr("class", "ui-grid-d").trigger("create");
                break;
        }
    }
}

/* FIN FUNCIONALIDADES */

///////////////////////////////////////////////////////////////////
// function createUser() {
//     db_local.transaction(function(tx) {
//         //Realiza una inserción en la tabla user
//         var pass = cryptshadoscincoseis("admin");
//         //Realiza una inserción en la tabla user
//         tx.executeSql('INSERT INTO user VALUES (?,?,?,?,?,?,?,?,?,?)', ["1","juanMobile", "Juan", "Mobile", "Inspector Buenos Aires", "33590227", "10354392", pass,"1234","Inspector"]);
//     }, function(error) {
//         console.log('DB SELECT USER ERROR: ' + error.message);
//         return false;
//     });
// }
///////////////////////////////////////////////////////////////////
function validateUserOffline(userInfo) {
    // db_local.transaction(function(tx) {
    //     tx.executeSql('SELECT * FROM user', [], function(tx, res) {
    //         var row = [];
    //         row = res.rows.item(0);
    //         userFields = row;
    //         if(userFields != undefined){
    //             var pass = userFields.offlinePassword;
    //             var passLogin = userInfo.password;

    //             if (resetpassoff == false) {
    //                 if ((userInfo.username == userFields.username) && (passLogin == pass)) { 
    //                     return loginSuccessOffline(userFields);
    //                 }else{
    //                     errorMessage($("#errorMessageLogin"), "Los datos ingresados son INCORRECTOS. Intente nuevamente.", $("#login"));
    //                     hideLoading();
    //                     return false;
    //                 }
    //             }else{
    //                 var cryptTempcode = cryptshadoscincoseis(tempcode);
    //                 if ((userInfo.username == userFields.username) && (passLogin == cryptTempcode)) {
    //                     resetpassoff = true;
    //                     $.mobile.navigate("#forcepassword");
    //                     hideLoading();
    //                     return false;
    //                 }
    //             }
    //         }else{
    //             errorMessage($("#errorMessageLogin"), "Para iniciar sesión sin conexión debe haber iniciado sesión con acceso a internet anteriormente. Intente nuevamente con conexión.", $("#login"));
    //             hideLoading();
    //             return false;
    //         }
    //     });
    // });
}
function loginSuccessOffline(userFields){
    var date = new Date();
    var dateString = (date.getUTCFullYear() + '-' + ('0' + (date.getUTCMonth() + 1)).slice(-2)) + "-" + ('0' + ( date.getUTCDate())).slice(-2) + " " + date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds() + " GMT";
    userFields["sessionIdOffline"] = "1";
   
    if (saveSession(userFields["sessionIdOffline"], dateString, "offline")){        
        // var activity = [];
        // activity["userType"] = userFields.rol;
        // activity["dateString"] = (('0' + (date.getUTCDate())).slice(-2) + '/' + ('0' + (date.getUTCMonth() + 1)).slice(-2) + "/" + date.getUTCFullYear() + " " + date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds() + " GMT");
        // activity["description"] = "log_session_login_offline_mobile"; 
        // if(userFields.username != undefined){
        //     activity["username"] = userFields.userName;
        // }else{
        //     activity["username"] = null;
        // }
        // logActivity(activity);
        $.mobile.navigate("#home");
        return false;

    }else{
        errorMessage($("#errorMessageLogin"), "Hubo problemas para Iniciar Sesión. Intente nuevamente.", $("#login"));
        return false;
    }
}
    
function lastOfflineUpdate(sessionidoffline,dateString,userid){
    // db_local.transaction(function(tx) {
    //     //Realiza una inserción en la tabla user
    //     tx.executeSql('INSERT INTO session VALUES (?, ?, ?, ?)', ["",sessionidoffline, "", dateString]);
    //     return true;
    // }, function(e) {
    //     //console.log('DB INSERT USER ERROR: ' + e.message);
    //     return false;
    // });
}
///////////////////////////////////////////////////////////////////