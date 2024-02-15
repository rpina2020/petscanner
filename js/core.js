/* Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Esto se ejecutará cuando la página termine de cargar
$(document).ready(function() {

    init();
    // Funciones de inicio al entrar en distintas secciones
    $(document).off("pageshow", "#login").on("pageshow", "#login", initLogin);
    $(document).off("pageshow", "#forcepassword").on("pageshow", "#forcepassword", initForcePassword);
    $(document).off("pageshow", "#forgetpassword").on("pageshow", "#forgetpassword", initForgetPassword);
    $(document).off("pageshow", "#home").on("pageshow", "#home", initHome);
    $(document).off("pageshow", "#mapa").on("pageshow", "#mapa", taggsModule.initMapa);

    // Avisar de que se perdió la conexión.
    $(document).off("offline").on("offline", function() {
        if (!noInternet) {
            globalErrorMessage(noInternetMsg);
            noInternet = true;
            globalStateConnectionOffline();
            clearInterval(DBOPPS);
        }
    });
    $(document).off("online").on("online", function() {
        globalErrorMessage("");
        noInternet = false;
        globalStateConnectionOnline();
        //DBOPPS = setInterval(getOperationDB, 8000);
    });
});

$( window ).on( 'hashchange', function( e ) {
    var hash = location.href.hash;
    switch (hash) {
        case '#login':
            initLogin();
            break;
        case '#forcepassword':
            initForcePassword();
            break;
        case '#forgetpassword':
            initForgetPassword();
            break;
        case '#home':
            initHome();
            break;
        case '#mapa':
            taggsModule.initMapa();
            break;
        case '#login':
            initLogin();
            
    }

} );

function globalStateConnectionOnline() { 
    $(".stateconnection").removeClass("stateConnectionOffline");
    $(".stateconnection").addClass("stateConnectionOnline");
}
function globalStateConnectionOffline() {
    $(".stateconnection").removeClass("stateConnectionOnline");
    $(".stateconnection").addClass("stateConnectionOffline");
}
// Variables globales para Aplicación

var api = "https://my-json-server.typicode.com/rpina2020/bdd_pets/"; //URL Web Services Usuarios

//Variable para verificar la primera vez que se ingresa a home
var firstTimeHome = true;
//Política de seguridad de la contraseña
var policy = [];
//Variable que guarda datos de usuario
userFields = [];

//Variable que guarda cantidad de campos validos
var valids = 0;


//Variable para guardar el sessionid
var session = "";
var deprecatedDate = "1900-01-01"; //Variable definida como fecha antigua para la actualización
var noInternet = false;
//Mensaje de error de Internet
var noInternetMsg = "Acabas de perder la conexión a internet. Algunas opciones no funcionarán correctamente.";
//codigo temporal reset password offline
var tempcode = "";

//variables que indican el estado del reset de contraseña, online y offline
var resetpassoff = false;
var resetpasson = false;

//Variable para intervalo de operaciones offline
var DBOPPS = null;
var opSend = false;




// Ejecución al tener el dispositivo listo
function init() {
    //Estado de errores
    errorMessagesState();
    //Estado de exito
    successMessagesState();
    //Inicialización de pantalla
    initLogin();

    // setTimeout(intervalConnection, 4000);

    //Con el timeout corrobora que los plugins están inicializados y llama a la inicialización de la base de datos local
    // setTimeout(initDBLocal, 2000);
    // setTimeout(saveConfig, 2000);

    //Hardcodeado
    //setTimeout(createUser, 5000);
}


//Inicializa los elementos del login
function initLogin() {
    showLoading();
    var email = $("#usernameLogin").val();
    //Reviso que el usuario no esté logueado. Si lo está lo llevo a la pantalla home
    //setTimeout(function() {
        //sessionStatus();
        //setTimeout(function() {
            if ( localStorage.session != undefined ) {
                var t = JSON.parse(localStorage.session)[0].lastSessionUpdate;
                var lapsed = parseInt( moment(t).fromNow() );
                
                //$(".ui-grid-a").append("("+(ft+1)+") "+lapsed+" transcurrido")
                $(".ui-grid-a").html('')
                $(".ui-grid-a").append('<div class="" style="position: absolute;z-index: 10;margin: 3%;">('+(firstTimeHome)+') '+lapsed+' transcurrido</div>')
                
                var actual_hash = location.hash.split("?")[0];
                if (actual_hash != "#login" && actual_hash != "" && location.hashs != undefined)  {
                    alert(actual_hash)

                }
                if(lapsed != NaN && lapsed > 1 ){
                    $.mobile.navigate("#login");
                }else{
                    $.mobile.navigate( actual_hash );
                }

            } else {
                //Si el sessionid no está seteado quiere decir que la sesión no está iniciada. Reseteo la tabla y saco el loading
                if (email) {
                    $.ajax({   
                        type: "GET",
                        url: api + "users?email="+email,
                        async: false,
                        // data: {email: "email="+email},
                        success: function(json){
                            console.log(json,"<-- USERS")
                            if (json.length != 0 && json[0].email == email) {
                                
                                // firstTimeHome = false;
                                // $.mobile.navigate("#home");





                                // var text_email =  $("#text_email").val() ;
                                // var text_pass =  $("#text_pass").val() ;
                                
                                // localStorage.setItem('session', JSON.stringify(userData) );
                                                
                                // if (text_email == userData[0].email && text_pass == userData[0].pass) {
                                    
                                    userData.push( {"session_status": true, "date": moment().format(),"calendar": moment().calendar(), "userData": json} )                
                                    
                                    localStorage.setItem('session', JSON.stringify(json) );

                                    //if (session != null) {
                                        // ok = true;
                                    //}

                                // }else{
                                //     ok = false;
                                // }
                            }else{
                                //  return false;
                                rst = false;
                            }
                        }
                    });               
                    // resetSession();
                    lapsed = 0
                    // hideLoading();
                    
                }
            }
        // }, 600000);
    //    }, 3000);
    //}, 3000);

    //Inicializa formulario
    resetLogin();

    //Submit del formulario de login
    $("#login").off("submit", "#formLogin").on("submit", "#formLogin", function() {
        return loginUser();
    });


    //Guarda los inputs del formulario
    var inputsLogin = $("#formLogin").children("div").children("input");

    totalInputsForm = inputsLogin.size() - 1;
    putListenerChangeInputs(inputsLogin, totalInputsForm);

    //bloquear la orientacion de la pantalla, solo portrait
    // window.plugins.orientationLock.lock("portrait");
    hideLoading();
}


function putListenerChangeInputs(inputsLogin,totalInputsForm){
    for (var i = 0; i < totalInputsForm; i++) {
        $("#" + inputsLogin[i].id).bind('input', function() { 
            $(this).attr("valid",false);
            valFormButton($(this)[0].id);
        });
    }
}

function valFormButton(idc){
    //var valids = 0;
    var camps = $("#"+idc);
    
    if ( camps.val().length > 0 && camps.val() != "" && validField( camps.val() ) ) {
        camps.attr("valid",true);

        camps.parent().removeClass("invalidStateRed");
        camps.parent().addClass("validStateGreen");
        camps.css("border-color","#97B539");

        camps[0].setCustomValidity("");
    } else {
        camps.attr("valid",false);

        camps.parent().removeClass("validStateGreen");
        camps.parent().addClass("invalidStateRed")
        
        camps.css("border-color","rgba(225, 3, 2, 1)");
        camps[0].setCustomValidity("El campo contiene caracteres inválidos o cadenas prohibidas (No se aceptan /, \\, ', &, ?, <, >," + '").');
    }
   
    valids = $("input[valid='true']").length;

    if (valids == totalInputsForm) {
       blockButtonForm(true);
    } else {
       blockButtonForm(false);
    }

}
function initForcePassword() {

    //Inicializa formulario
    resetForcePassword();
    //Pide la política de la contraseña al ws si no la tiene guardada
    PasswordPolicy();

    //Si se vuelve al login, se resetea el formulario de login
    $("#forcepassword").off("click", "#buttonBackForcePassword").on("click", "#buttonBackForcePassword", resetLogin);
    //Submit del forzar contraseña
    $("#forcepassword").off("submit", "#formForcePassword").on("submit", "#formForcePassword", function() {
        return forcePasswordUser();
    });

    //Guarda los inputs del formulario
    var inputsFP = $("#formForcePassword").children("div").children("input");
    inputsFP.splice(1, 1);
    for (var i = 0; i < inputsFP.size() - 1; i++) {
        //Por cada input (menos el submit y la imagen) setea la función de validación para que se ejecute cuando el valor cambia. Si hay error muestra un mensaje html5
        $("#" + inputsFP[i].id).off("change").on("change", function() {
            //Si el campo tiene contenido inválido setea y muestra el error
            if (!validField(this.value)) {
                this.setCustomValidity("El campo contiene caracteres inválidos o cadenas prohibidas (No se aceptan /, \\, ', &, ?, <, >," + '").');
            } else {
                //Si el campo es válido setea null en el error
                this.setCustomValidity("");
            }
        });
    }

    //La validación de la contraseña tiene una validación más compleja
    $("#newPassword", $("#formForcePassword")).off("change").on("change", function() {
        if (!validField(this.value)) {
            //Si el campo tiene contenido inválido setea y muestra el error
            this.setCustomValidity("El campo contiene caracteres inválidos o cadenas prohibidas (No se aceptan / , \\ , ' , & , ? , < , > , " + '").');
        } else {
            if (!checkPolicy(this.value)) {
                //Si la contraseña no respeta las condiciones de la política de seguridad setea y muestra la política de seguridad en el mensaje de error
                this.setCustomValidity(policy["message"]);
            } else {
                //Si la contraseña respeta la política setea null en el error
                this.setCustomValidity("");
            }
        }
    });

    $("#confirmNewPassword", $("#formForcePassword")).off("change").on("change", function() {
        if (!validField(this.value)) {
            //Si el campo tiene contenido inválido setea y muestra el error
            this.setCustomValidity("El campo contiene caracteres inválidos o cadenas prohibidas (No se aceptan / , \\ , ' , & , ? , < , > , " + '").');
        } else {
            if (!checkPolicy(this.value)) {
                //Si la contraseña no respeta las condiciones de la política de seguridad setea y muestra la política de seguridad en el mensaje de error
                this.setCustomValidity(policy["message"]);
            } else {
                //Si la contraseña respeta la política setea null en el error
                this.setCustomValidity("");
            }
        }
    });

    //El mensaje de error tiene que aparecer cuando se inicia la pantalla
    if((resetpasson) || (resetpassoff)){
        errorMessage($("#errorMessageForcePassword"), "Debe actualizar la contraseña para recuperar su cuenta. Su contraseña temporal es " + tempcode + ".", $("#forcepassword"));
        resetpassoff = false;
        resetpasson = false;
    }else{
        errorMessage($("#errorMessageForcePassword"), "Su contraseña ha expirado, por favor actualícela.", $("#forcepassword"));
    }

    //Gesto para volver al login
    $("#forcepassword").off("swiperight").on("swiperight", function() {
        $.mobile.changePage("#login", { transition: "slide", reverse: true });
    });

}

function initForgetPassword() {
    //Inicializa Formulario
    resetForgetPassword();

    //Si se vuelve al login, se resetea el formulario de login
    $("#forgetpassword").off("click", "#buttonBackForgetPassword").on("click", "#buttonBackForgetPassword", resetLogin);
    //Submit del olvidó contraseña 
    $("#forgetpassword").off("submit", "#formForgetPassword").on("submit", "#formForgetPassword", function() {
        return forgetPasswordUser();
    });

    //Validación del campo nombre de usuario
    $("#usernameForgetPassword", "#formForgetPassword").off("change").on("change", function() {
        //Si el campo nombre de usuario tiene contenido inválido setea y muestra el error
        if (!validField(this.value)) {
            this.setCustomValidity("El campo contiene caracteres inválidos o cadenas prohibidas (No se aceptan /, \\, ', &, ?, <, >," + '").');
        } else {
            //Si el campo es válido setea null en el error
            this.setCustomValidity("");
        }
    });
    //Validación del campo dni
    $("#personalidForgetPassword", "#formForgetPassword").off("change").on("change", function() {
        //Si el campo dni tiene contenido inválido setea y muestra el error
        if (!validField(this.value)) {
            this.setCustomValidity("El campo contiene caracteres inválidos o cadenas prohibidas (No se aceptan /, \\, ', &, ?, <, >," + '").');
        } else {
            //Si el campo es válido setea null en el error
            this.setCustomValidity("");
        }
    });

    //Gesto para volver al login
    $("#forgetpassword").off("swiperight").on("swiperight", function() {
        $.mobile.changePage("#login", { transition: "slide", reverse: true });
    });
}

//Resetea valores del formulario de logueo
function resetLogin() {
    $('#formLogin').trigger("reset");
    errorMessage($("#errorMessageLogin"), "", $("#login"));
}

//Resetea los valores del formulario de cambio de contraseña
function resetForcePassword() {
    $('#formForcePassword').trigger("reset");
    successMessage($("#successMessageLogin"), "", $("#login"));
}

//Resetea los valores del formulario de olvido de contraseña
function resetForgetPassword() {
    $('#formForgetPassword').trigger("reset");
    errorMessage($("#errorMessageForgetPassword"), "", $("#forgetpassword"));
    successMessage($("#successMessageLogin"), "", $("#login"));
}

//Resetea mensaje de exito de logueo
function resetHome() {
    successMessage($("#successMessageLogin"), "", $("#home"));
}

/*  INICIO BASE DE DATOS LOCAL  */

//Borra la tabla session de la base de datos local
function resetSession() {
    // db_local.transaction(function(tx) {
    //     tx.executeSql("DELETE FROM session", []);
    //     //console.log('DB DELETE SESSION OK');
    //     return true;
    // }, function(e) {
    //     //console.log('DB DELETE SESSION ERROR: ' + e.message);
    //     return false;
    // });
}

//Realiza una consulta en la tabla de sesión para validar que existe un sessionid. Si es falso lo vuelve a la pantalla de login
function sessionStatus() {
    session = "";
    PasswordPolicy();
    var session = JSON.parse(localStorage.getItem("session"))[0].sessionid;
    var rst = session != null && session.length > 0 ? session : false;
    if (rst) {
        return true;
    } else {
       return false
        hideLoading();
    }
}

//Si el resultado contiene el sessionid, setea la variable session en true. Si el resultado es vacío lleva a la pantalla de login y setea session en false
function sessionSuccess(session) {
    var sessionInfo = session;
    if (res.rows.item(0) != undefined) {
        var actualDate = new Date();
        var lastDate = new Date(res.rows.item(0).lastUpdate);
        var timeDiff = Math.abs(actualDate.getTime() - lastDate.getTime());
        var hoursDiff = timeDiff /(1000*3600);
        if(hoursDiff <= policy["sessionTime"]){
            session = true;
        }
    } else {
        if (!$("#login").hasClass("ui-page-active")) { $.mobile.navigate("#login") }
        session = false;
        localStorage.clear();
        hideLoading();
    }
}

//Si hubo un error tratando de acceder a su sesión genera un mensaje de error
function sessionError(e) {
    //console.log("DB GET SESSION ERROR: " + e.message);
    localStorage.clear();
    session = false;
}



//Borra la tabla configuracion de la base de datos local
function resetConfig() {
    // db_local.transaction(function(tx) {
    //     tx.executeSql("DELETE FROM config", []);
    //     //console.log('DB DELETE CONFIG OK');
    //     return true;
    // }, function(e) {
    //     //console.log('DB DELETE CONFIG ERROR: ' + e.message);
    //     return false;
    // });
}

function saveConfig() {
    // db_local.transaction(function(tx) {
    //     //Realiza una inserción en la tabla config
    //     tx.executeSql('INSERT INTO config VALUES (?, ?, ?, ?, ?)', [1, null, null, null, null], saveConfigSuccess, saveConfigError);
    // }, function(e) {
    //     //console.log('DB INSERT CONFIG ERROR: ' + e.message);
    // });
}

function saveConfigSuccess(tx, res) {
    //console.log('DB INSERT CONFIG SUCCESS');
}

function saveConfigError(e) {
    //console.log('DB INSERT CONFIG ERROR: ' + e.message);
}

//Guarda la sesión del usuario
function saveSession(sessionid, date, connection) {
    var sessionInfo = [{"sessionid": 1, "lastSessionUpdate": moment().format(),"calendar": moment().calendar() }];
    localStorage.setItem("session", JSON.stringify(sessionInfo));    

    // db_local.transaction(function(tx) {
    //     //Realiza una inserción en la tabla sesión
    //     var session = [];
        
    //     if(connection == "online"){
    //         //Guarda el id de sesión en la variable session para ser consultado y la fecha y hora online
    //         session["sessionid"] = sessionid;
    //         tx.executeSql('INSERT INTO session VALUES (?, ?, ?, ?)', [session["sessionid"], "",  date, ""], saveSessionSuccess, saveSessionError);
    //     }else{
    //         //Guarda el id de sesión en la variable session para ser consultado y la fecha y hora offline
    //         session["sessionid"] = sessionid;
    //         tx.executeSql('UPDATE session SET sessionIdOffline = ?, lastOfflineUpdate = ?, WHERE sessionId = ?', [session["sessionid"], date], saveSessionSuccess, saveSessionError);
    //     }

    // }, function(e) {
    //     //console.log('DB INSERT SESSION ERROR: ' + e.message);
    //     return false;
    // });
    return true;
}

//Guarda la sesión correctamente
function saveSessionSuccess(tx, result) {
    //console.log("DB INSERT SESSION OK");
    return true;
}

//No guarda la sesión correctamente 
function saveSessionError(error) {
    //console.log('DB INSERT SESSION ERROR: ' + e.message);
    return false;
}

//Borra la tabla user de la base de datos local
function resetUser() {
    // db_local.transaction(function(tx) {
    //     tx.executeSql("DELETE FROM user", []);
    //     //console.log('DB DELETE USER OK');
    //     return true;
    // }, function(e) {
    //     //console.log('DB DELETE USER ERROR: ' + e.message);
    //     return false;
    // });
}

//Guarda un usuario en la base de datos local
function saveUserLocal(userInfo) {
    user_fields["sessionid"] = undefined;
    //Reseteo la tabla
    resetUser();
    // db_local.transaction(function(tx) {
    //     //Realiza una inserción en la tabla user
    //     tx.executeSql('INSERT INTO user VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [userInfo.userId, userInfo.userName, userInfo.name, userInfo.lastName, userInfo.position, userInfo.dni, userInfo.employeesId, userInfo.offlinePassword, userInfo.password, userInfo.rol]);
    // }, function(e) {
    //     //console.log('DB INSERT USER ERROR: ' + e.message);
    //     return false;
    // });
    return true;
}

//Si se guarda correctamente el usuario
function saveUserSuccess(tx, result) {
    console.log("DB INSERT USER OK");
    console.log("Last inserted ID = " + result.insertId);
}

//Si hay algún error en la inserción de usuario
function saveUserError(error) {
    //console.log("Error processing SQL: "+error.code);
}

//Actualiza un usuario en la base de datos local
function updateUserLocal(user_fields) {
    user_fields["sessionid"] = undefined;
    // db_local.transaction(function(tx) {
    //     //Realiza un update en la tabla user
    //     tx.executeSql('UPDATE user SET name = ?, lastname = ?, position = ?, dni = ?, employeesId = ?, offlinePassword = ?, password = ? WHERE username = ?;', [user_fields["name"], user_fields["lastname"], user_fields["position"], user_fields["dni"], user_fields["employeesId"], user_fields["offlinePassword"], user_fields["password"], user_fields["username"]]);
    //     hideLoading();
    // }, function(e) {
    //     //console.log('DB UPDATE USER ERROR: ' + e.message);
    //     hideLoading();
    //     return false;
    // });
    //console.log("DB UPDATE USER OK");
    return true;
}

//Trae un usuario en la base de datos local
function getUserLocal() {
    // db_local.transaction(function(tx) {
    //     //Realiza un select en la tabla user
    //     tx.executeSql('SELECT userid, username, name, lastname, position, dni, employeesId, offlinePassword FROM user', [], function(tx, res) {
    //         //Todos los datos traídos de la base de datos local son almacenados en la variable userInfo  
    //         var row = [];
    //         row = res.rows.item(0);
    //         userFields = row;
    //         loginSuccess(userFields);
    //         //console.log("DB SELECT USER OK");
    //         return true;
    //     }, function getUserLocalError(error) {
    //         //console.log('DB SELECT USER ERROR: ' + e.message);
    //         return false;
    //     });
    // });
}

function getUserId(){
    // db_local.transaction(function(tx) {
    //     //Trae el user id de la tabla user
    //     tx.executeSql('SELECT userid FROM user', [], getUserIdSuccess, getUserIdError);
    // }, function(e) {
    //     console.log('DB SELECT USER ID ERROR: ' + e.message);
    //     return false;
    // });
}

//Agrega una operacion offline a la base de datos local
function addOperationDB (operation, contenidos, operationType) {
    // db_local.transaction(function(tx) {
    //     //Trae el user id de la tabla user
    //     tx.executeSql('SELECT userid FROM user', [], getUserIdSuccess, getUserIdError);
    // }, function(e) {
    //     //console.log('DB INSERT USER ERROR: ' + e.message);
    //     return false;
    // });
    var date = new Date();
    var dateString = (('0' + (date.getUTCDate())).slice(-2) + '/' + ('0' + (date.getUTCMonth() + 1)).slice(-2) + "/" + date.getUTCFullYear() + " " + (date.getHours() + (date.getTimezoneOffset()/60)) + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds() + " GMT");
            
    // db_local.transaction(function(tx) {
    //     //Realiza una inserción en la tabla operation con los contenidos
    //     tx.executeSql('INSERT INTO operation (type, date, operationUser, contents) VALUES (?, ?, ?, ?)', [operationType, dateString, userFields.userid, contenidos], addOperationDBSuccess, addOperationDBError);
    // }, function(e) {
    //     //console.log('DB INSERT USER ERROR: ' + e.message);
    //     return false;
    // });
    return true;
}

//Si inserta la operación correctamente
function addOperationDBSuccess(tx, res){
    console.log("DB INSERT OPERATION SUCCESS");
}

//Si no puede insertar la operación
function addOperationDBError(e){
    console.log("DB INSERT OPERATION ERROR: " + e.message);
}


//Traigo una operación guardada de la base de datos
function getOperationDB(){
    if(!opSend){
        opSend = true;
        // db_local.transaction(function(tx) {
        //     tx.executeSql('SELECT * FROM operation WHERE operationId = (SELECT MIN(operationId) FROM operation);', [], getOperationDBSuccess, getOperationDBError);
        // }, function(e) {
        //     console.log('DB SELECT OPERATION ERROR: ' + e.message);
        //     return false;
        // });
    }
}

function getOperationDBSuccess(tx, res) {
    var row = [];
    row = res.rows.item(0);
    if(row != undefined){
        var contenidos = JSON.parse(row.contents);
        switch (row.type) {
            case "logActivity":
                var activity = [];
                activity["userType"] = contenidos.userType;
                activity["dateString"] = contenidos.dateTime;
                activity["description"] = contenidos.description; 
                activity["username"] = contenidos.username;
                logActivity(activity);
                break;
            case "sendAssessment":
                var assessment = new Object();
                assessment['actionNumber'] =  contenidos.actionNumber;
                assessment['userId'] = contenidos.userId;
                assessment['recordType'] = "" + contenidos.recordType;
                assessment['assessmentDate'] = contenidos.assessmentDate.split("/").reverse().join("-");
                assessment['employer'] = contenidos.employer;
                assessment['location'] = contenidos.location;
                assessment['responsableSolidario'] = contenidos.jointlyLiable;
                assessment['employees'] = contenidos.employees;
                console.log('contenidos.inspectionType', contenidos.inspectionType)
                sendAssessment(assessment, contenidos.inspectionType);
               break;
        }
        
        // db_local.transaction(function(tx) {
        //     //Elimina la fila de la tabla
        //     tx.executeSql('DELETE FROM operation WHERE operationId = ?;', [row.operationId], deleteOppSuccess, deleteOppError);
        // }, function(e) {
        //     console.log('DB DELETE OPERATION ERROR: ' + e.message);
        //     return false;
        // });

    }
}

function deleteOppSuccess(tx, res){
    console.log('DB DELETE OPERATION SUCCESS');
    opSend = false;
}

function deleteOppError (e) {
    console.log('DB DELETE OPERATION ERROR: ' + e.message);
    return false;
}


function getOperationDBError(e) {
    console.log('DB SELECT OPERATION ERROR: ' + e.message);
    return false;
}

function getUserIdError(e){
    //console.log('DB SELECT USERID ERROR: ' + e.message);
    return false;
}

function getUserIdSuccess(tx, res) {
    var row = [];
    row = res.rows.item(0);
    userFields["userid"] = row.userid;
}

function getUserIdError(e){
    //console.log('DB SELECT USERID ERROR: ' + e.message);
    return false;
}

function getUserId(){
    // db_local.transaction(function(tx) {
    //     //Trae el user id de la tabla user
    //     tx.executeSql('SELECT userid FROM user', [], getUserIdSuccess, getUserIdError);
    // }, function(e) {
    //     console.log('DB SELECT USER ID ERROR: ' + e.message);
    //     return false;
    // });
}

/*  FIN BASE DE DATOS LOCAL  */

/*  INICIO WEB SERVICES  */

//Pida la política de seguridad de la contraseña. Si realiza la operación correctamente devuelve la política en la variable policy.
function getPasswordPolicy() {
    $.ajax({
        url : api + "getMessageSecurity",
        type : "GET",
        contentType : 'application/json',
        success : function(json){
            policy["message"] = json.message;
            savePolicy();
            return policy;
        },
        error: function( jqXHR, textStatus, errorThrown ) {
            var msg = "";
            if (jqXHR.status === 0) {
                msg = 'Not connect: Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found [404]';
            } else if (jqXHR.status == 500) {
                if(jqXHR.responseJSON.message == "En estos momentos la app no se encuentra disponible. Favor de reintentar más tarde"){
                    customMsg = true;
                    globalErrorMessage(jqXHR.responseJSON.message);
                }
            } else if (textStatus === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (textStatus === 'timeout') {
                msg = 'Time out error.';
            } else if (textStatus === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error: ' + jqXHR.responseJSON.message;
            }
            if(msg != ""){
                console.log(msg);
            } else if (!customMsg){
                globalErrorMessage("Hubo un error al realizar recuperar la contraseña. Intente nuevamente.");
            }
            return false;
        }
    });
}

//Envía los datos de actualización de la contraseña al web service y este devuelve un booleano. Si es true, devuelve un estado correcto. Si es false devuelve un mensaje de error.
function updatePasswordUser(userInfo) {
    $.ajax({
        url: api + "updatePasswordUser", 
        type : "PUT",
        data : JSON.stringify({userId: userFields.userid, userName: userInfo.username,newPassword: userInfo.newPassword}),
        contentType : "application/json",
        success : function() {
            //Logueo la actividad y guardo la operación offline
            var activity = [];
            var date = new Date();
            
            //Logueo la actividad
            if(userInfo.username != null){
                activity["userType"] = "INSPECTOR";
                activity["dateString"] = (('0' + (date.getUTCDate())).slice(-2) + '/' + ('0' + (date.getUTCMonth() + 1)).slice(-2) + "/" + date.getUTCFullYear() + " " + date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds() + " GMT");
                activity["description"] = "log_user_update_online_password"; 
                activity["username"] = userInfo.username;
                logActivity(activity);
            }

            //LLeva al login informando el éxito. Oculta loading.
            $.mobile.navigate("#login");
            successMessage($("#successMessageLogin"), "La contraseña fue actualizada correctamente. Por favor vuelva a loguearse.", $("#login"));
            hideLoading();
            return true;
        },
        error: function( jqXHR, textStatus, errorThrown ) {
            var msg = "";
            if (jqXHR.status === 0) {
                msg = 'Not connect: Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (textStatus === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (textStatus === 'timeout') {
                msg = 'Time out error.';
            } else if (textStatus === 'abort') {
                msg = 'Ajax request aborted.';
            } else if ((jqXHR.responseJSON.message == "Tu usuario no está registrado para usar la app") || (jqXHR.responseJSON.message == "En estos momentos la app no se encuentra disponible. Favor de reintentar más tarde") || (jqXHR.responseJSON.message == "La contraseña no cumple las políticas de seguridad")) {
                errorMessage($("#errorMessageForcePassword"), errorThrown, $("#forcepassword"));
            } else {
                msg = 'Uncaught Error: ' + jqXHR.responseJSON.message;
            }
            if(msg != ""){
                console.log(msg);
            }
            errorMessage($("#errorMessageForcePassword"), "Hubo un error al recuperar la contraseña. Intente nuevamente.", $("#forcepassword"));
            hideLoading();
        }
    });
}

//Si la actualización de la contraseña es correcta informa al usuario 
function updatePasswordSuccess(data, status, req) {
    
}

//Si el logueo es incorrecto filtra el error y lo muestra en pantalla
function updatePasswordError(data, status, req) {
    //$dataXML = $(data.toXML());
    //var error = $dataXML.find("ns2\\:message, message").first().text();
    
}

//Envía los datos de recuperación de la contraseña al web service y este devuelve un booleano. Si es true, devuelve nombre de usuario, número de teléfono y una nueva password randomodules[m]. Si es false devuelve un mensaje de error.
function validateUserResetOnline(userInfo) {
    $.ajax({
        url: api + "validateUserDNI",
        type : "POST",
        data : JSON.stringify({userName: userInfo.username, dni: userInfo.dni}),
        contentType : "application/json",
        success : function(json) {
            userFields["userid"] = json.userId;
            userFields["username"] = userInfo.username;
            tempcode = offlineCodeTemporal();
            resetpasson = true;
            success = "Se ha reseteado la contraseña para la cuenta de usuario " + usr + '. Ingrese con la contraseña: <class="highlight">' + tempcode + "</class>. Por favor vuelva a loguearse.";
            $.mobile.navigate("#login");
            successMessage($("#successMessageLogin"), success, $("#login"));
            return false;
        },
        error: function( jqXHR, textStatus, errorThrown ) {
            var msg = "";
            var customMsg = false;
            if (jqXHR.status === 0) {
                msg = 'Not connect: Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found [404]';
            } else if (jqXHR.status == 500) {
                if((jqXHR.responseJSON.message == "El usuario ingresado no existe en la base de datos o los datos ingresados son incorrectos.")  || (jqXHR.responseJSON.message == "En estos momentos la app no se encuentra disponible. Favor de reintentar más tarde")){
                    customMsg = true;
                    errorMessage($("#errorMessageForgetPassword"), jqXHR.responseJSON.message, $("#forgetpassword"));
                }
            } else if (textStatus === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (textStatus === 'timeout') {
                msg = 'Time out error.';
            } else if (textStatus === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error: ' + jqXHR.responseJSON.message;
            }
            if(msg != ""){
                console.log(msg);
            } else if (!customMsg){
                errorMessage($("#errorMessageForgetPassword"), "Ingrese con la contraseña: <class='highlight'>" + tempcode + "</class>.", $("#forgetpassword"));
            }
            hideLoading();
            return false;
        }
    });    
}

///////////////////////////////////////////////////////////////////

/*  FIN WEB SERVICES  */

/* INICIO MÉTODOS GENÉRICOS */

function showLoading() {
    $(".ui-loader").show();
}

function hideLoading() {
    $(".ui-loader").hide();
}

//Si la base fue inicializada consulta si la sesión está guardada. Si no fue inicializada espera a que se inicialice y ahí realiza el chequeo de la sesión.
function isLoggedIn() {
    // if (db_local == undefined) {
    //     setTimeout(sessionStatus, 2500);
    // } else {
    //     sessionStatus();
    // }
}

//Actualiza mensaje de éxito
function successMessage(element, message, section) {
    //Elimina mensajes anteriores
    element.html("");
    //Agrega mensaje
    element.append(message);
    //Mueve el scroll al comienzo de la sección
    if (!section == null) {
        section.scrollTop(section);
    }
    //Cambia el estado del elemento success a visible
    successMessagesState();

    element.off("click").click(function(){
        $(this).hide();
    });
}

//Actualiza mensaje de error
function errorMessage(element, message, section) {
    //Elimina mensajes anteriores
    element.html("");
    //Agrega mensaje
    element.append(message);
    //Mueve el scroll al comienzo de la sección
    if (!section == null) {
        section.scrollTop(section);
    }
    //Cambia el estado del elemento error a visible
    errorMessagesState();

    element.off("click").click(function(){
        $(this).hide();
    });
}

//Actualiza mensaje de información
function infoMessage(element, message, section) {
    //Elimina mensajes anteriores
    element.html("");
    //Agrega mensaje
    element.append(message);
    //Mueve el scroll al comienzo de la sección
    if (!section == null) {
        section.scrollTop(section);
    }
    //Cambia el estado del elemento error a visible
    infoMessagesState();

    element.off("click").click(function(){
        $(this).hide();
    });
}

//Muestra u oculta los mensajes de información si tienen contenido
function infoMessagesState() {
    var infoMessages = $('div[id^="infoMessage"]');
    for (var i = 0; i < infoMessages.size(); i++) {
        //Armo el id del info
        var infoid = '#' + infoMessages[i].id;
        //Armo el id de éxito para ocultarlo si existe
        var successid = '#' + (infoMessages[i].id).replace("info", "success");
        var errorid = '#' + (infoMessages[i].id).replace("info", "error");
        if ($(infoid).html() == "") {
            //Si el mensaje está vacío oculta el elemento
            $(infoid).hide();
        } else {
            //Si el mensaje no está vacío muestra el elemento
            $(infoid).show();

            if (successid.length != 0) {
                //Si no es cero, el elemento existe, por lo tanto se oculta
                $(successid).hide();
            }
            if (errorid.length != 0) {
                //Si no es cero, el elemento existe, por lo tanto se oculta
                $(errorid).hide();
            }
        }
    }
}

//Muestra u oculta los mensajes de error si tienen contenido
function errorMessagesState() {
    var errorMessages = $('div[id^="errorMessage"]');
    for (var i = 0; i < errorMessages.size(); i++) {
        //Armo el id del error
        var errorid = '#' + errorMessages[i].id;
        //Armo el id de éxito para ocultarlo si existe
        var successid = '#' + (errorMessages[i].id).replace("error", "success");
        var infoid = '#' + (errorMessages[i].id).replace("error", "info");
        if ($(errorid).html() == "") {
            //Si el mensaje está vacío oculta el elemento
            $(errorid).hide();
        } else {
            //Si el mensaje no está vacío muestra el elemento
            $(errorid).show();

            if (successid.length != 0) {
                //Si no es cero, el elemento existe, por lo tanto se oculta
                $(successid).hide();
            }

            if (infoid.length != 0) {
                //Si no es cero, el elemento existe, por lo tanto se oculta
                $(infoid).hide();
            }
        }
    }
}

//Muestra u oculta los mensajes de exito si tienen contenido
function successMessagesState() {
    var successMessages = $('div[id^="successMessage"]');
    for (var i = 0; i < successMessages.size(); i++) {
        //Armo el id del éxito
        var successid = '#' + successMessages[i].id;
        //Armo el id de error para ocultarlo si existe
        var errorid = '#' + (successMessages[i].id).replace("success", "error");
        var infoid = '#' + (successMessages[i].id).replace("success", "info");
        if ($(successid).html() == "") {
            //Si el mensaje está vacío oculta el elemento
            $(successid).hide();
        } else {
            //Si el mensaje no está vacío muestra el elemento
            $(successid).show();

            if (errorid.length != 0) {
                //Si no es cero, el elemento existe, por lo tanto se oculta
                $(errorid).hide();
            }

            if (infoid.length != 0) {
                //Si no es cero, el elemento existe, por lo tanto se oculta
                $(infoid).hide();
            }
        }
    }
}

//Muestra el mensaje de error en la sección activa
function globalErrorMessage(error) {
    var pageActive = $("#" + jQuery.mobile.activePage[0].id);
    var element = $(pageActive).find('div[id^="errorMessage"]');
    errorMessage(element, error, pageActive);
    element.off("click").click(function(){
        $(this).hide();
    });
}

//Muestra el mensaje de éxito en la sección activa
function globalSuccessMessage(success) {
    var pageActive = $("#" + jQuery.mobile.activePage[0].id);
    var element = $(pageActive).find('div[id^="successMessage"]');
    successMessage(element, success, pageActive);
    element.off("click").click(function(){
        $(this).hide();
    });
}

//Muestra el mensaje de información en la sección activa
function globalInfoMessage(info) {
    var pageActive = $("#" + jQuery.mobile.activePage[0].id);
    var element = $(pageActive).find('div[id^="infoMessage"]');
    infoMessage(element, info, pageActive);
    element.off("click").click(function(){
        $(this).hide();
    });
}

//Elimina los espacios blancos de un string
function rtrim(string) {
    return string.replace(/((\s*\S+)*)\s*/, "$1");
}

//Valida que el campo que se recibe como parámetro no contenga cadenas prohibidas o caracteres no permitidos
function validField(field) {
    var result = !((field.indexOf("<") > -1) ||
        (field.indexOf(">") > -1) ||
        (field.indexOf("'") > -1) ||
        (field.indexOf("&") > -1) ||
        (field.indexOf('"') > -1) ||
        (field.indexOf("/") > -1) ||
        (field.indexOf("\\") > -1) ||
        (field.indexOf("script") > -1) ||
        (field.indexOf("http") > -1) ||
        (field.indexOf("https") > -1) ||
        (field.indexOf("?") > -1));
    return result;
}

//Si la política no está guardada en la variable policy, la pide al web service y la parsea dentro de policy
function PasswordPolicy() {
    if ((policy == "") || (policy["message"] == undefined) || (policy["message"] == "")) {
        if(checkConnection()){
            //Llama al web service
            //getPasswordPolicy();
        }
    }
}

function savePolicy() {
    //Guardo la logitud mínima de la contraseña
    var arr = policy["message"].split("longitud mínima es de ");
    policy["minlength"] = arr[1].split("")[0];
    //Guardo la cantidad mínima de minúsculas de la contraseña
    arr = policy["message"].split("letras minúsculas mínima es ");
    policy["minuscules"] = arr[1].split("")[0];
    //Guardo la cantidad mínima de mayúsculas de la contraseña
    arr = policy["message"].split("letras mayúsculas mínima es ");
    policy["majuscules"] = arr[1].split("")[0];
    //Guardo la cantidad mínima de números de la contraseña
    arr = policy["message"].split("cantidad mínima de números es ");
    policy["numbers"] = arr[1].split("")[0];
    //Guardo el tiempo de sesión válido
    arr = policy["message"].split("tiempo de sesión permitido es ");
    policy["sessionTime"] = parseInt(arr[1].split(" ")[0]);
}

//Valida que el campo contraseña respete la política de seguridad. Devuelve un booleano con el resultado.
function checkPolicy(field) {
    //Variables de conteo de caracteres
    var minuscules = 0;
    var majuscules = 0;
    var numbers = 0;
    var character = '';
    //Por cada caracter hago el chequeo
    for (var i = 0; i <= field.length; i++) {
        character = field.charAt(i);
        //Si el caracter es un número
        if (!isNaN(character * 1)) {
            numbers++;
        } else {
            //Si el caracter es una mayúscula
            if (character == character.toUpperCase()) {
                majuscules++;
            }
            //Si el caracter es una minúscula
            if (character == character.toLowerCase()) {
                minuscules++;
            }
        }
    }
    //Si respeta los valores de la política de seguridad guardada en policy devuelve un booleano
    if (minuscules >= policy["minuscules"] && majuscules >= policy["majuscules"] && numbers >= policy["numbers"] && field.length >= policy["minlength"]) {
        return true;
    } else {
        return false;
    }
}

//Chequea que se tenga conexión a Internet
function checkConnection() {
    if (!navigator.network) {
        // Si no está definido setea el objeto que maneja la conexión de red del navigator
        if(window.top.navigator.network != undefined){
            navigator.network = window.top.navigator.network;
        }else{
            navigator.network = window.top.navigator;
        }
    }
    // Devuelve si existe conexión o no
    return ((navigator.network.connection.type === "none" || navigator.network.connection.type === null || navigator.network.connection.type === "unknown") ? false : true);
}

//
function intervalConnection(){
    // setInterval(function(){
    //     if (!checkConnection()) {
    //         noInternet = true;
    //         globalStateConnectionOffline();
    //     }else{
    //         noInternet = false;
    //         globalStateConnectionOnline();
    //     }
    // }, 3000);
}

//Analiza si la contraseña es válida y devuelve un resultado
function checkPassword(password, confirmPassword) {
    //Las contraseñas deben estar completadas y ser iguales entre sí
    if ((password != undefined) && (confirmPassword != undefined) && (password == confirmPassword)) {
        return true;
    } else {
    	$("#usernameForgetPassword").css("border-color","red")
        //Si no coinciden las contraseñas o no están completan devuelve false
        return false;
    }
}

//Chequea que esté logueado. Si lo está pide los datos del usuario en la base de datos, sino vuelve al login 
function getValuesUser() {
    userFields = [];
    if (isLoggedIn) {
        getUserLocal();
    } else {
        hideLoading();
        $.mobile.navigate("#login");
    }
}


// check permission
function hasReadPermission() {
    window.plugins.sim.hasReadPermission(function() {
        //console.log("Tiene permisos para obtener sim");
    }, function() {
        requestReadPermission();
    });
}

// request permission
function requestReadPermission() {
    // no callbacks required as this opens a popup which returns async
    window.plugins.sim.requestReadPermission();
}

function getIMEI() {
    hasReadPermission();
    window.plugins.sim.getSimInfo(function(result) {
        imei = result.deviceId;
    }, function(error) {
        console.log(error);
    })
}

//Transforma de string base 64 a binario
function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

function processImage(imageFile, file, previewElement) {
    if (imageFile.startsWith("data:")) {
        imageFile = imageFile.split(",")[1];
    }
    var binary = b64toBlob(imageFile);
    var error = "";
    var size = binary.size / 1024; //KB

    if (error == "") {
        if (size > 2048) {
            var difference = 2048 / size;
            var width = 0.5;
            var height = 0.5;
            if (difference <= 0.5) {
                width = difference;
                height = difference;
            }
            window.imageResizer.resizeImage(
                function(data) {
                    imageFile = data.imageData;
                    binary = b64toBlob(imageFile);
                    size = binary.size / 1024; //KB
                    previewElement.attr('src', 'data:image/png;base64,' + imageFile);
                    hideLoading();
                },
                function(e) {
                    globalErrorMessage(error)
                    error = e;
                    hideLoading();
                }, imageFile, width, height, {
                    resizeType: ImageResizer.RESIZE_TYPE_FACTOR,
                    imageDataType: ImageResizer.IMAGE_DATA_TYPE_BASE64,
                    format: ImageResizer.FORMAT_PNG
                }
            );
        } else {
            previewElement.attr('src', 'data:' + file.type + ';base64,' + imageFile);
            hideLoading();
        }
        if ((error == "")&&(file.name != undefined)) {
            var readerBinary = new FileReader();
            readerBinary.onload = function(readerEvt) {
                //Recibe la imagen convertida a string binario
                var binaryString = readerEvt.target.result;
                //Guarda la imagen codificada en base 64
                imageBinary = btoa(binaryString);
            };
            readerBinary.readAsBinaryString(file);
        }
    }
    return error;
}

//Previsualiza la imagen seleccionada
function viewImage(input, previewElement) {
    showLoading();
    
    var error;
    //Si hay un archivo seleccionado
    if (input.files && input.files[0]) {
        var readerURL = new FileReader();
        var imageFile;

        readerURL.onload = function(e) {
            imageFile = e.target.result;
            error = processImage(imageFile, input.files[0], previewElement)
            if (error != "") {
                globalErrorMessage(error);
            }
        }
        readerURL.readAsDataURL(input.files[0]);
    } else {
        //Si no se eligió un archivo asigno una imagen por defecto
        previewElement.attr('src', "img/photo.png");
        imageBinary = null;
        if (error != ""){
            globalErrorMessage(error);
        }
        hideLoading();
    }
}

//Actualiza contraseña del usuario
function forcePasswordUser() {
    //Loading
    showLoading();

    //Variable para datos de formulario
    var userInfo = [];
    //Si hay conexión toma los valores ingresados para usuario, contraseña y confirmación de contraseña
    //Si las contraseñas coinciden y no son nulas
    userInfo["username"] = $("#usernameForcePassword", $("#formForcePassword")).val();
    //Saca espacios en blanco
    userInfo["username"] = rtrim(userInfo["username"]);
    var pass = $("#oldPassword", $("#formForcePassword")).val();
    userInfo["oldPassword"] = cryptshadoscincoseis(pass);
    var newpass = $("#newPassword", $("#formForcePassword")).val();
    userInfo["newPassword"] = cryptshadoscincoseis(newpass);
    var confirmpass = $("#confirmNewPassword", $("#formForcePassword")).val();
    userInfo["confirmNewPassword"] = cryptshadoscincoseis(confirmpass);
    
    if (checkConnection()) {
        if (checkPassword($("#newPassword", $("#formForcePassword")).val(), $("#confirmNewPassword", $("#formForcePassword")).val())) {
            //Pide el userid para llamar al servicio
            //getUserId();

            //Llamo a actualizar contraseña con la información de actualización.
            setTimeout(function(){updatePasswordUser(userInfo)}, 3000);
            return false;
        }
    } else {

        if (checkPassword($("#newPassword", $("#formForcePassword")).val(), $("#confirmNewPassword", $("#formForcePassword")).val())) {

            //Actualizo en la base de datos local la contraseña con la información de actualización.
            updatePasswordUserOffline(userInfo);
            
            //$.mobile.navigate("#login");
            // }else{
            //     $.mobile.navigate("#forcepassword");
            // }

            // if (document.getElementById("errorMessageForcePassword").innerHTML != "") {
            //     return false;
            // } else {
            //     return true;
            // }
        }

        // //Si no tiene conexión a Internet devuelve false e informa el error
        // errorMessage($("#errorMessageForcePassword"), "No tiene conexi&oacute;n a Internet. Intente nuevamente.", $("#forcepassword"));
        // return false;
    }
}

//Pide una nueva contraseña temporal para poder loguearse
function forgetPasswordUser() {
    //Loading
    showLoading();

    //Variable para datos de formulario
    var userInfo = [];
    //Si hay conexión toma el valor ingresado para usuario y dni
    userInfo["username"] = $("#usernameForgetPassword", $("#formForgetPassword")).val();
    //Saca espacios en blancos
    userInfo["username"] = rtrim(userInfo["username"]);
    userInfo["dni"] = $("#personalidForgetPassword", $("#formForgetPassword")).val();
    //Saca espacios en blancos
    userInfo["dni"] = rtrim(userInfo["dni"]);

    if (checkConnection()) {
        //Envía el nombre de usuario y el dni para chequear sus datos de forma online
        setTimeout(function(){ return validateUserResetOnline(userInfo)}, 3000);
        return false;
    } else {
        //Trae la información de la base y compara nombre de usuario y dni para chequear sus datos de forma offline
        setTimeout(function(){ return validateUserResetOffline(userInfo); }, 3000);
        return false;
    }
}

function reverseString(string) {
    var o = '';
    for (var i = string.length - 1; i >= 0; i--)
        o += string[i];
    return o;
}

function getCodedString(string) {
    var reversed = reverseString(string);
    //console.log(reversed + " - " + string);

    var coded = '';
    for (var i = 0; i < string.length; i++) {
        if (dictionary[reversed[i]] != undefined) {
            coded += dictionary[reversed[i]];
        } else {
            coded += reversed[i];
        }
    }
    return coded;
}

function getDecodedString(string) {
    var reversedDictionary = getReversedDictionary();

    var decoded = '';
    for (var i = 0; i < string.length; i++) {
        if ((parseInt(string[i]).toString() != "NaN") && (string[i + 1] != undefined) && ((string[i + 1] == "*") || (string[i + 1] == "_"))) {
            decoded += reversedDictionary[string[i] + string[i + 1]];
            i++;
        } else {
            if (reversedDictionary[string[i]] != undefined) {
                decoded += reversedDictionary[string[i]];
            } else {
                decoded += string[i];
            }
        }
    }
    return reverseString(decoded);
}

function getReversedDictionary() {
    var reversed = {};

    for (var prop in dictionary) {
        if (dictionary.hasOwnProperty(prop)) {
            reversed[dictionary[prop]] = prop;
        }
    }

    return reversed;
}
function cryptshadoscincoseis(value){
    value = sha256(value);
    return value;
    var button = $("#form"+pageActive).children("div").children('input[type="submit"]');
    button.attr('disabled','disabled');
}
function blockButtonForm(state){
    var pageActive = jQuery.mobile.activePage[0].id;
    pageActive = pageActive.charAt(0).toUpperCase() + pageActive.slice(1);
    var button = $("#form"+pageActive).children("div").children('input[type="submit"]');
    if (state == true) {
        button.removeAttr('disabled');
    } else {
        button.attr('disabled','disabled');
    }
}
/* FIN MÉTODOS GENÉRICOS */