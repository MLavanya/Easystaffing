mesgs = [];
var searchQuery ;
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
  }


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

		$("#alertMsg").prepend("<div class='alert alert-dismissable"+cl+"'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>"+mesgs[i].msg+"</div>")

		mesgs.splice(i, 1);		

	}

}, 1000);  


setInterval(function() {

	$('#gmesg div:first-child').remove();

}, 5000);  



/********************************
 * Helpers
 **********************************/

Ember.Handlebars.helper('format-skill', function(skills) {
	var res = skills.split(",");
	var ret = "";
	for(var i=0;i<res.length;i++){
		ret = ret+'<a href="#" class="label label-info">'+res[i]+'</a>';
	}
	return new Ember.Handlebars.SafeString(ret);
});

Ember.Handlebars.helper('format-matched', function(skills) {
	var res = skills.split(",");
	var ret = "";
	for(var i=0;i<res.length;i++){
		ret = ret+'<a href="#" class="label label-success">'+res[i]+'</a>';
	}
	return new Ember.Handlebars.SafeString(ret);
});

Ember.Handlebars.helper('format-vacancy', function(id) {
	return "#/vacancy/"+id;
});

Ember.Handlebars.helper('format-date', function(date) {
	return moment(date).fromNow();
});

Ember.Handlebars.helper('format-cv', function(value) {
  return new Ember.Handlebars.SafeString(value);
});

/********************************
 * Controllers
 **********************************/

App.ApplicationController = Ember.Controller.extend({
	name: "",

	init: function(){
		var that = this;
		$.get('/me',function(data){
			that.set('name',data[0].name);
		});
	},

	actions:{				
		signout:function(){			
			document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    		window.location='login.html';
		},	
	}
});

App.AddcandidateController = Ember.Controller.extend({

	needs : [ 'application' ],
	currentUser : Ember.computed.alias('controllers.application.loggedinUser'),
	usertypes: ["SAHAJ","SRS","CISCO"],
	statuses: ['None','Interviewed','Rejected','Deferred','Accepted'],
	country : ["China", "India", "United States", "Indonesia", "Brazil",
                "Pakistan", "Bangladesh", "Nigeria", "Russia", "Japan",
                "Mexico", "Philippines", "Vietnam", "Ethiopia", "Egypt",
                "Germany", "Turkey", "Iran", "Thailand", "D. R. of Congo",
                "France", "United Kingdom", "Italy", "Myanmar", "South Africa",
                "South Korea", "Colombia", "Ukraine", "Spain", "Tanzania",
                "Sudan", "Kenya", "Argentina", "Poland", "Algeria",
                "Canada", "Uganda", "Morocco", "Iraq", "Nepal",
                "Peru", "Afghanistan", "Venezuela", "Malaysia", "Uzbekistan",
                "Saudi Arabia", "Ghana", "Yemen", "North Korea", "Mozambique",
                "Taiwan", "Syria", "Ivory Coast", "Australia", "Romania",
                "Sri Lanka", "Madagascar", "Cameroon", "Angola", "Chile",
                "Netherlands", "Burkina Faso", "Niger", "Kazakhstan", "Malawi",
                "Cambodia", "Guatemala", "Ecuador", "Mali", "Zambia",
                "Senegal", "Zimbabwe", "Chad", "Cuba", "Greece",
                "Portugal", "Belgium", "Czech Republic", "Tunisia", "Guinea",
                "Rwanda", "Dominican Republic", "Haiti", "Bolivia", "Hungary",
                "Belarus", "Somalia", "Sweden", "Benin", "Azerbaijan",
                "Burundi", "Austria", "Honduras", "Switzerland", "Bulgaria",
                "Serbia", "Israel", "Tajikistan", "Hong Kong", "Papua New Guinea",
                "Togo", "Libya", "Jordan", "Paraguay", "Laos",
                "El Salvador", "Sierra Leone", "Nicaragua", "Kyrgyzstan", "Denmark",
                "Slovakia", "Finland", "Eritrea", "Turkmenistan"],
	city	: ['Cleveland',
                'New York City',
                'Brooklyn',
                'Manhattan',
                'Queens',
                'The Bronx',
                'Staten Island',
                'San Francisco',
                'Los Angeles',
                'Seattle',
                'London',
                'hyderabad',  
                'Portland',
                'Chicago',
                'Boston'],
	actions :{
		savecandidate: function(){

			var that = this;
			var v = true;
			var fileName = JSON.parse($(".uploadedfile").text());
			var cv = fileName.filepath;
			
			if($("#experience").val() == ""){
				addmessage("danger","Experience has to be specified");
				v=false;
			}
			if($("#email").val() == ""){
				addmessage("danger","Email is Mandatory.");				
				v=false;
			}
			if($("#phone").val() == ""){
				addmessage("danger","Mobile number is Mandatory");				
				v=false;
			}
			if($("#country").val() == ""){
				addmessage("danger", "country has to be specified");
				v=false;
			}
			if($("#city").val() == ""){
				addmessage("danger", "city has to be specified");
				v=false;
			}


			var textarea = $('#tags:last');
			var textext = textarea.textext()[0];

			if(textext.hiddenInput().val().length < 3){
				addmessage("danger","Skills has to be specified.");
				v=false;
			}

			var text = textext.hiddenInput().val();
			text = text.replace("[","");
			text = text.replace("]","");
			text = text.replace(/['"]+/g, '');

			if(v){
	   			jQuery("#addEmpSbmt").attr('disabled','disabled').html("updated"); 
	   			$.ajax({
		   		    type: 'POST',
		   		    url: "/saveCandidate",
		   		    dataType:"json",
		   		    data: {
		   					"name"				: this.get("firstname"),
		   					"title"				: this.get("title"),
		   					"email"				: this.get("email"),
		   					"phone"				: this.get("phone"),
		   					"exp"				: this.get("experience"),
		   					"country"			: jQuery('#country').val(),
		   					"city"				: jQuery('#city').val(),
		   					"cvpath"			: cv,
		   					"company_id"		: jQuery("#company").val(),
		   					"status"			: jQuery("#status").val(),
		   					"skills"			: text,
		   					"comments"			: this.get("comments"),
		   					"active"		   	:"true"		
		      		    },
		   		    success: function(data){
		   		    	jQuery(".form-control").val("");
	   					setTimeout(function(){that.transitionToRoute('dashboard');},500);
		   		    },
		   		    error: function(data){
		   		    	addmessage("danger","Sorry, Data could not be saved. Server error.");
		   		    	//confirmbox("danger", "Sorry, Data could not be saved. Server error.");
		   		    }
	   		     });
          	}

		}
	}
});

App.AddvacancyController = Ember.Controller.extend({

	needs : [ 'application' ],
	currentUser : Ember.computed.alias('controllers.application.loggedinUser'),
	statuses: ['None','Interviewed','Rejected','Deferred','Accepted'],
	companies: [],
	country : ["China", "India", "United States", "Indonesia", "Brazil",
                "Pakistan", "Bangladesh", "Nigeria", "Russia", "Japan",
                "Mexico", "Philippines", "Vietnam", "Ethiopia", "Egypt",
                "Germany", "Turkey", "Iran", "Thailand", "D. R. of Congo",
                "France", "United Kingdom", "Italy", "Myanmar", "South Africa",
                "South Korea", "Colombia", "Ukraine", "Spain", "Tanzania",
                "Sudan", "Kenya", "Argentina", "Poland", "Algeria",
                "Canada", "Uganda", "Morocco", "Iraq", "Nepal",
                "Peru", "Afghanistan", "Venezuela", "Malaysia", "Uzbekistan",
                "Saudi Arabia", "Ghana", "Yemen", "North Korea", "Mozambique",
                "Taiwan", "Syria", "Ivory Coast", "Australia", "Romania",
                "Sri Lanka", "Madagascar", "Cameroon", "Angola", "Chile",
                "Netherlands", "Burkina Faso", "Niger", "Kazakhstan", "Malawi",
                "Cambodia", "Guatemala", "Ecuador", "Mali", "Zambia",
                "Senegal", "Zimbabwe", "Chad", "Cuba", "Greece",
                "Portugal", "Belgium", "Czech Republic", "Tunisia", "Guinea",
                "Rwanda", "Dominican Republic", "Haiti", "Bolivia", "Hungary",
                "Belarus", "Somalia", "Sweden", "Benin", "Azerbaijan",
                "Burundi", "Austria", "Honduras", "Switzerland", "Bulgaria",
                "Serbia", "Israel", "Tajikistan", "Hong Kong", "Papua New Guinea",
                "Togo", "Libya", "Jordan", "Paraguay", "Laos",
                "El Salvador", "Sierra Leone", "Nicaragua", "Kyrgyzstan", "Denmark",
                "Slovakia", "Finland", "Eritrea", "Turkmenistan"],
	city	: ['Cleveland',
                'New York City',
                'Brooklyn',
                'Manhattan',
                'Queens',
                'The Bronx',
                'Staten Island',
                'San Francisco',
                'Los Angeles',
                'Seattle',
                'London',
                'hyderabad',  
                'Portland',
                'Chicago',
                'Boston'],
	statuses: ['OPEN','CLOSED'],
	actions :{
		addCompany: function(){

			bootbox.prompt({
				title: "Enter the company name",
				callback: function(result) {
				},
				className: "bootbox-sm"
			});

		},

		savecandidate: function(){

			var that = this;
			var v = true;

			if($("#min_experience").val() == ""){
				addmessage("danger","Experience has to be specified");
				v=false;
			}
			if($("#max_experience").val() == ""){
				addmessage("danger","Experience has to be specified");
				v=false;
			}
			if($("#jobTitle").val() == ""){
				addmessage("danger","Email has to be specified");
				v=false;
			}
			if($("#vacancy").val() == ""){
				addmessage("danger", "Phone number has to be specified");
				v=false;
			}
			if($("#country").val() == ""){
				addmessage("danger", "country has to be specified");
				v=false;
			}
			if($("#city").val() == ""){
				addmessage("danger", "city has to be specified");
				v=false;
			}
			if($("#status").val() == ""){
				addmessage("danger", "status has to be specified");
				v=false;
			}

			var textarea = $('#tags:last');
			var textext = textarea.textext()[0];

			if(textext.hiddenInput().val().length < 3){
				addmessage("danger","Skills has to be specified.");
				v=false;
			}		

			var text = textext.hiddenInput().val();
			text = text.replace("[","");
			text = text.replace("]","");
			text = text.replace(/['"]+/g, '');

			if(v){
	   			jQuery("#addEmpSbmt").attr('disabled','disabled').html("updated"); 
	   			$.ajax({
		   		    type: 'POST',
		   		    url: "/saveVacancies",
		   		    dataType:"json",
		   		    data: {
		   					"title"			: this.get("jobTitle"),
		   					"name"			: this.get("vacancy"),
		   					"country"		: jQuery('#country').val(),
		   					"city"			: jQuery('#city').val(),
		   					"exp_min"		: this.get("min_experience"),
		   					"exp_max"		: this.get("max_experience"),		   					
		   					"company_id"	: jQuery("#company").val(),	
		   					"status"		: jQuery("#status").val(),	   					
		   					"skills"		: text,
		   					"description"	: this.get("description"),
		      		    },
		   		    success: function(data){
		   		    	console.log("success");
		   		    	confirmbox("success", "Vacancy Saved");
		   		    	jQuery(".form-control").val("");
	   					setTimeout(function(){that.transitionToRoute('dashboard');},500);
		   		    },
		   		    error: function(data){
		   		    	console.log("error");
		   		    	confirmbox("danger", "Sorry, Data could not be saved. Server error.");
		   		    } 
	   		     });
          	}

		}
	}
});

App.DashboardController = Ember.Controller.extend({	
	actions : {		
		search : function (){
			var that = this;						
			//that.transitionToRoute('searchResult',search_text);
			$.ajax ({
                type: "POST", 
                url:'/solrclient',
                data:{searchtext:search_text},                   
                success: function(data) {  
	                search_text="";
	                that.transitionToRoute('searchResult',search_text);
                },
                error: function(data) {
                    alert("Msg: "+ data.status + ": " + data.statusText);
                }
            });           
		}
	}
});

App.VacancyController = Ember.ObjectController.extend({



});

App.SearchResultController = Ember.ObjectController.extend({
	/*actions :{
		search : function (){
			var that = this;
			that.transitionToRoute('searchResult',search_text);
			$.ajax ({
                type: "POST", 
                url:'/solrclient',
                data:{searchtext:search_text},                   
                success: function(data) {  
	                search_text="";
	                that.transitionToRoute('searchResult');
                },
                error: function(data) {
                    alert("Msg: "+ data.status + ": " + data.statusText);
                }
            }); 
		}
	}	*/
});



