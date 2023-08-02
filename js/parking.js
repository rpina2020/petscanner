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

set_info()
var sectores_data = [
    {
        "id_sector": 1,
        "nombre_sector": "B0",
        "waiting": "false",
        "reservado": null,
        "status": "occupied"
    },
    {
        "id_sector": 1,
        "nombre_sector": "B1",
        "waiting": "false",
        "reservado": null,
        "status": "occupied"
    },
    {
        "id_sector": 1,
        "nombre_sector": "B2",
        "waiting": "false",
        "reservado": null,
        "status": "occupied"
    },
    {
        "id_sector": 1,
        "nombre_sector": "C0",
        "waiting": "false",
        "reservado": null,
        "status": "free"
    },
    {
        "id_sector": 1,
        "nombre_sector": "C1",
        "waiting": "false",
        "reservado": null,
        "status": "free"
    },
    {
        "id_sector": 1,
        "nombre_sector": "C2",
        "waiting": "false",
        "reservado": null,
        "status": "free"
    },
    {
        "id_sector": 1,
        "nombre_sector": "D0",
        "waiting": "false",
        "reservado": null,
        "status": "occupied"
    },
    {
        "id_sector": 1,
        "nombre_sector": "D1",
        "waiting": "false",
        "reservado": null,
        "status": "occupied"
    },
    {
        "id_sector": 1,
        "nombre_sector": "D2",
        "waiting": "false",
        "reservado": null,
        "status": "occupied"
    }
];
function set_info(){
  var parking_1 = [{"id":1,"nombre": "parking_1", "columnas": 3, "filas": 3}];
  var letrascol = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  
  var html = "<table>";
  for (let i = 1; i < parking_1[0].columnas+1; i++) {
      html += '<tr>';
      var clase_bloque = "";
      for (let j = 0; j < parking_1[0].filas; j++) {
          var status = i%2==0 ? "free" : "occupied";
          var waiting = letrascol[i]+j == "C2" ? "true" : "false";
          //var content = status == "free" ? '' : '';

          if (true) {}

          if (status == "free") {
            content = letrascol[i]+j
          }else{
            content = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve" style="height: 3em;margin: 6% auto;display: block;">\
                        <g><g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)"><path d="M4053.6,4997.9c-692.3-121.3-1214.4-637.5-1333.7-1320c-23.5-136.9-29.3-350.1-29.3-1026.7v-856.6l-119.3-41.1c-326.6-109.5-582.8-400.9-655.1-743.1c-45-217.1-84.1-197.5,373.5-197.5h398.9l5.9-2125.7c5.9-2104.2,7.8-2129.7,48.9-2274.4c166.2-584.7,569.1-989.5,1149.9-1157.7c154.5-45,172.1-45,1104.9-45c921.1,0,952.4,1.9,1099.1,43c592.6,172.1,1003.2,590.6,1163.6,1183.2c31.3,111.5,33.2,324.6,39.1,2250.9l7.8,2125.7h400.9h400.9l-11.7,93.9c-56.7,408.7-307,723.6-672.7,846.8l-119.3,41.1v837c0,483-9.8,903.5-21.5,991.5c-86.1,635.6-531.9,1146-1171.4,1337.6c-142.8,43-176,45-1056,48.9C4556.2,5011.6,4104.5,5005.7,4053.6,4997.9z M5659.2,2367.6c385.3-54.7,756.8-160.4,1011.1-287.5c64.5-33.2,121.3-62.6,125.2-66.5c2-2-84.1-275.8-193.6-604.3l-199.5-600.4l-72.3,11.7c-645.4,107.6-2018.2,107.6-2663.6,0l-72.4-11.7l-199.5,600.4c-109.5,328.5-195.6,602.3-193.6,604.3c3.9,3.9,60.6,33.3,125.2,66.5c330.5,164.3,794,275.8,1359.2,324.6C4853.5,2420.4,5459.7,2396.9,5659.2,2367.6z M4147.5-1956.3c555.4-50.8,1451.1-37.1,2014.3,31.3c86.1,11.7,174.1,19.6,197.5,19.6c39.1,0,62.6-54.8,234.7-571c103.7-314.9,193.6-584.7,199.5-598.4c11.7-33.3-310.9-183.8-531.9-248.4c-416.5-119.3-770.5-166.2-1263.3-166.2c-492.8,0-846.8,46.9-1263.3,166.2c-221,64.5-543.7,215.1-531.9,248.4c5.9,13.7,95.8,283.6,201.4,600.4l191.6,575l119.3-13.7C3779.8-1921.1,3975.4-1940.7,4147.5-1956.3z"></path></g></g>\
                        </svg>'
          }


          html += '<td onclick="selecSector(this)" id_sector="1" nombre_sector="'+letrascol[i]+j+'" status="'+status+'" waiting="'+waiting+'" class="'+(waiting == "true" ? "selected animated infinite pulse" : "")+'">'+content+'</td>';
          console.log(letrascol[i]+j)
          var sector = [{"id_sector": "1","nombre_sector": letrascol[i]+j,"waiting": waiting,"reservado": [{"reserved": "false","date_time_reserved": "null"}],"status": status}];
          console.log(sector[0],"<--");
         // sectores_data.push( );
      } 
      html += '</tr>';  
  }
  html += "</table>";
  $("#sectores").html(html)
  console.log(sectores)
}
function checkIn(){
  var parking_1 = [{"id":1,"nombre": "parking_1", "columnas": 3, "filas": 3,"cant_total": "","cfg_cant_total": "false"}];
  var letrascol = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

  sectores = [];
  var html = "<table>";
  for (let i = 0; i < parking_1[0].columnas; i++) {
      //html += '<div class="ui-grid-b">';
      html += '<tr>';
      for (let j = 0; j < parking_1[0].filas; j++) {
          html += '<td>'+letrascol[i]+j+'</td>';
          console.log(letrascol[i]+j)
          sectores.push({"id_sector": 1, "nombre_sector": letrascol[i]+j})
      html += '</tr>';

      }    
  }
  html += "</table>";
  $("#sectores").html(html)
}

function selecSector(sector){
  var nombre_sector = $(sector).attr("nombre_sector");
  var status_sector = $(sector).attr("status");
  var waiting = $(sector).attr("waiting");

  var nombre_sector_actual = $("td[waiting='true']").attr("nombre_sector");

  if (status_sector == "free" && waiting != "true") {
    if ($("td[waiting='true']")[0].className == "selected animated infinite pulse") {
        $("td[waiting='true']")[0].className = "";
       $(sector)[0].className = "selected animated infinite pulse";
    }else{

    }

    $("#sector_asignado").text(nombre_sector);
  }
}

function ahora(){
  var hoy = new Date();
  var fecha = hoy.getDate() + '/' + ( hoy.getMonth() + 1 ) + '/' + hoy.getFullYear();
  var hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
  var fechaYHora = fecha + ' ' + hora;

  return fechaYHora;
}

function setPatenteWhatsapp(){
  var patente = $("#text-patente").val();
  var whatsapp = $("#text-whatsapp").val();
  moment.locale("es")
  var checkin = moment().format('L LTS');
  $("#patente_sector_asignado").text(patente);
  $("#checkin_sector_asignado").text( checkin )
  transcurrido(checkin)
  setInterval(function () {
    transcurrido(checkin)
  }, 60000);
  $.mobile.navigate("#info");
  //return fechaYHora;
}

function transcurrido(checkin){
    var momentAgo = checkin

    var timeAgo = moment(momentAgo).fromNow()

    $("#info_transcurrido").text( timeAgo )
}
