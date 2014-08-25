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

		$("[class='content']").prepend("<div class='alert alert-dismissable"+cl+"'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>"+mesgs[i].msg+"</div>")

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


/*var IDLE_TIMEOUT = 60; //seconds
var _idleSecondsCounter = 0;
document.onclick = function() {
    _idleSecondsCounter = 0;
};
document.onmousemove = function() {
    _idleSecondsCounter = 0;
};
document.onkeypress = function() {
    _idleSecondsCounter = 0;
};
window.setInterval(CheckIdleTime, 1000);

function CheckIdleTime() {
    _idleSecondsCounter++;
    var oPanel = document.getElementById("SecondsUntilExpire");
    if (oPanel)
        oPanel.innerHTML = (IDLE_TIMEOUT - _idleSecondsCounter) + "";
    if (_idleSecondsCounter >= IDLE_TIMEOUT) {
        alert("Time expired!");
        //document.location.href = "logout.html";
    }
}*/

function setErrorField(e){

    e = $("#"+e);

    if(e.parent().parent().hasClass('form-group'))
      e.parent().parent().addClass('has-error');

}


function clearErrorField(e){

    e = $("#"+e);

    if(e.parent().parent().hasClass('form-group') && e.parent().hasClass('has-error'))
      e.parent().parent().remoceClass('has-error');

}

function calculateAmt(e){

	var q = $($(e).parent().prev().children()[0]).val();
	var a = $(e).val();
	var st = 0;
	var tot = 0;

	$($(e).parent().next().children()[0]).val(q*a);

	$(".timeforweek tbody").children().each(function(i,row){
			var x = $($($(row).children()[5]).children()[0]).val();
			st= st + +x;
	});

	$('#subtotal').val(st);

}