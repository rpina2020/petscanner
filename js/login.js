var wsapi = "http://localhost:3000/";

$( "#login > div > a:nth-child(10)" ).on( "click", "tr", function() {
  validateUser( $("#text-basic").val() );
});

function validateUser(email){
	console.log(email != "" ? email : "no info");
	$.ajax({   
		type: "POST",
		url: wsapi + "users?",
		data: "email="+$("#text-basic").val(),
		success: function(json){
			console.log( json);
		}
	});
}