jQuery.ajaxSetup({
  beforeSend: function() {
     $('#loader').show();
  },
  complete: function(){
     $('#loader').hide();
  },
  success: function() {}
});

mesgs = [];


var addmessage = function(type,msg){

	mesgs.push({
		type:type,
		msg:msg
	});

}

setInterval(function() {

	var cl = "alert ";

	for(var i=0 ; i < mesgs.length ; i++){

		if(mesgs[i].type == "success"){
			cl = cl + "alert-success";
		}else if(mesgs[i].type == "info"){
			cl = cl + "alert-info";
		}else if(mesgs[i].type == "warning"){
			cl = cl + "alert-warning";
		}else if(mesgs[i].type == "danger"){
			cl = cl + "alert-danger";
		}

		$('#gmesg').append("<div class='alert alert-dismissable"+cl+"'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>"+mesgs[i].msg+"</div>")

		mesgs.splice(i, 1);		

	}

}, 1000);  


setInterval(function() {

	$('#gmesg div:first-child').remove();

}, 5000);  



var loadDropDown = function(url,id,name,selectdiv){

  $('#'+selectdiv).empty();

  $.getJSON(url).then(function(data){

  	if(data != undefined && data.length > 0){


	  	for(var i=0; i<data.length ; i++){

	  		var item = data[i];
	  		var j;
	  		var k;

			for(key in item) {

			  if(key == id){
			  	j=item[key];
			  }else if(key == name){
			  	k=item[key];
			  }

			}	  		

		    $('#'+selectdiv).append($('<option></option>').attr("value", j).text(k));

	  	}

  	}

  });

};


var poppover = function(message, title, placement, element) {
	$(element).popover({
		title : title,
		content : message,
		placement : placement,
		html : true
	});

};

Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}