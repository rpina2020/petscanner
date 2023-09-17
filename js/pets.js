var petsModule = [];
var modules = {"petsModule": petsModule};
//actualPage
$( document ).ready(function() {
    ready()
});
$(window).on('hashchange', function() {
    ready()
});
function ready(){
    var actualPage = location.hash.split("#")[1];
    switch (actualPage) { 
        case 'login': 
            $("#login").on("pageshow", petsModule.initLogin());
            break;
        case 'reset': 
            $("#reset").on("pageshow", petsModule.initReset());
        case 'registro': 
            $("#registro").on("pageshow", petsModule.initRegistro());
            break; 
        case 'pet_profile': 
            $("#pet_profile").on("pageshow", petsModule.initPetProfile());
            break;  
        case 'lost_pets': 
         setTimeout(function(){
            //hideLoading()
            $("#lost_pets").on("pageshow", petsModule.initLostPetsMap());
        }, 2000);
            break;      
        default:
            $("#login").on("pageshow", petsModule.initLogin());
    }  

    // for (var m in modules) {
    //     modules[m].ready();
    // }
    setTimeout(function(){
        hideLoading()
    }, 2000);

  //setTimeout(function(){

    if (actualPage == "login" || actualPage == undefined) {
      //  $.mobile.navigate("#login");
    }
  //},1000);
}
function initApp(actualPage){
    $.mobile.navigate("#"+actualPage);
}
function showLoading(){
    $("#loading").fadeIn()
}
function hideLoading(){
    $("#loading").fadeOut()
}
