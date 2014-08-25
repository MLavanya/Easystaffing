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

Ember.Handlebars.helper('format-date', function(date) {
	return moment(date).fromNow();
});


/********************************
 * Controllers
 **********************************/

App.ApplicationController = Ember.Controller.extend({
	actions:{				
		signout:function(){			
			document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT"
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


			var textarea = $('#skills:last');
			//var textext = textarea.textext()[0];

			if(textarea.val().length < 3){
				addmessage("danger","All fields are Mandatory.");
				v=false;
			}

			var text = textarea.val();
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
		   		    		"recruiter"			: UserName,
		   					"firstname"			: this.get("firstname"),
		   					"title"				: this.get("title"),
		   					"candidate_email"	: this.get("email"),
		   					"mobile_num"		: this.get("phone"),
		   					"experience"		: this.get("experience"),
		   					"country"			: jQuery('#country').val(),
		   					"city"				: jQuery('#city').val(),
		   					"cv"				: cv,
		   					"forcompany"		: jQuery("#company").val(),
		   					"status"			: jQuery("#status").val(),
		   					"skills"			: text,
		   					"comments"			: this.get("comments"),
		   					"faved"				: "false",
		      		    },
		   		    success: function(data){		   		    			   		    	
		   		    	jQuery(".form-control").val("");
	   					setTimeout(function(){that.transitionTo('dashboard');},500);
		   		    },
		   		    error: function(data){
		   		    	console.log("error");
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
	usertypes: ["SAHAJ","SRS","CISCO","HCL"],
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
	statuses: ['None','Interviewed','Rejected','Deferred','Accepted'],
	actions :{
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

			var textarea = $('#skills:last');			

			if(textarea.val().length < 3){
				addmessage("danger","Skills has to be specified");
				v=false;
			}			

			var text = textarea.val();
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
		   					"jobTitle"			: this.get("jobTitle"),
		   					"vacancy"			: this.get("vacancy"),
		   					"country"			: jQuery('#country').val(),
		   					"city"				: jQuery('#city').val(),
		   					"min_experience"	: this.get("min_experience"),
		   					"max_experience"	: this.get("max_experience"),		   					
		   					"forcompany"		: jQuery("#company").val(),		   					
		   					"skills"			: text,
		   					"description"		: this.get("description"),
		      		    },
		   		    success: function(data){
		   		    	console.log("success");
		   		    	confirmbox("success", "Candidate Saved");
		   		    	jQuery(".form-control").val("");
	   					setTimeout(function(){that.transitionTo('home');},500);
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
			$.ajax ({
                type: "POST", 
                url:'/solrclient',
                data:{searchtext:search_text},                   
                success: function(data) {  
    	          //  alert(data);  
	                alert('success'+JSON.stringify(data));  
	                that.transitionTo('searchResult');
                },
                error: function(data) {
                    alert("Msg: "+ data.status + ": " + data.statusText);
                }
            }); 
		}
	}
});

App.FileUploadTool = Ember.TextField.extend({
	tagName : 'input',
	attributeBindings : [ 'name', 'data-url' ],
	classNamesBindings : [ 'class' ],
	type : 'file',
	classNames : 'form-control',
	didInsertElement : function() {
		/*
		 this.$().fileupload('option', {
		 maxFileSize: 5000000
		 });*/

		var that = this;

		this.$().fileupload({
			add : function(e, data) {
				var goUpload = true;
				var uploadFile = data.files[0];
				if (!(/\.(xls|xlsx)$/i)
						.test(uploadFile.name)) {
					addmessage("danger",'Please select an xls or xlsx file.');
					goUpload = false;
				}				
				if (uploadFile.size > 5000000) { // 2mb
					addmessage("warning",'Please upload a smaller file, max size is 5 MB');
					goUpload = false;
				}
				if (goUpload == true) {
					$('#importcandidatefile').attr('disable', true);
					addmessage("info","Uploading "+data.files[0].name);
					data.submit();
				}
			},
			dataType : 'text',
			done : function(e, data) {
				addmessage("success","Upload Complete");
				$('#importcandidatefile').attr('disable', false);
				console.log(JSON.parse(data.result));
			}

		});

	}

});

App.CVUploadTool = Ember.TextField.extend({
	tagName : 'input',
	attributeBindings : [ 'name', 'data-url' ],
	classNamesBindings : [ 'class' ],
	type : 'file',
	classNames : 'form-control',
	didInsertElement : function() {

		/*
		 this.$().fileupload('option', {
		 maxFileSize: 5000000
		 });*/

		var that = this;

		this.$().fileupload({
			add : function(e, data) {
				var goUpload = true;
				var file = document.getElementById("uploadcv").value;
				var uploadFile = data.files[0];
				if (!(/\.(doc|docx)$/i)
						.test(uploadFile.name)) {
					addmessage("danger",'Please select an doc or docx file.');
					goUpload = false;
				}				
				if (uploadFile.size > 5000000) { // 2mb
					addmessage("warning",'Please upload a smaller file, max size is 5 MB');
					goUpload = false;
				}
				if (goUpload == true) {
					$('#uploadcv').hide();
            		$('#addEmpSbmt').attr('disabled',true);
            		data.context = $('<button/>').text('Upload')
                	.appendTo($("#uploadcv").parent())
                	.click(function (e) {
                		e.preventDefault();
                		$(this).parent().append('<div class="progress" id="#progress"> <div class="progress-bar progress-bar-aqua" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"> </div> </div>');
				
                		//addmessage("info","Uploading "+data.files[0].name);
                    	//data.context = $('<p/>').text('Uploading...').replaceAll($(this));
                    	data.submit();
                	});					
					
					//data.submit();
				}
			},
			dataType : 'text',
		    progressall: function (e, data) {
		        var progress = parseInt(data.loaded / data.total * 100, 10);
		        $('.progress-bar').css(
		            'width',
		            progress + '%'
		        );
		    },			
			done : function(e, data) {
				//console.log(JSON.parse(data.result));
				$('.progress-bar').parent().prev().text('Uploaded').attr('disabled',true);
				$('#addEmpSbmt').attr('disabled',false);
				$('.uploadedfile').text(data.result);
			}

		});

	}

});



