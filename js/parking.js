$( document ).ready(function() {
  
  setTimeout(function(){
      hideLoading()
      var actualPage = location.hash.split("#")[1];

      if (actualPage == "checkin") {
        initApp("checkin")
      }
  },1000);
  

});

$(window).on('hashchange', function() {

  setTimeout(function(){
    hideLoading()
    var actualPage = location.hash.split("#")[1];

    if (actualPage == "checkin") {

      initApp("checkin")
    }
  },1000);
  
});

function initApp(actualPage){
  $.mobile.navigate("#"+actualPage);
}
function showLoading(){
  $("#loading").fadeIn()
}
function hideLoading(){
  $("#loading").fadeOut()
}


